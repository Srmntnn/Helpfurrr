const Donation = require('../models/Donation');
const Campaign = require('../models/Campaign');
const paymongo = require('paymongo-node')(process.env.PAYMONGO_SECRET_KEY);

const createDonation = async (req, res) => {
    try {
        const { campaignId, donorName, donorEmail, amount, status } = req.body;

        // Convert amount to centavos (for PHP)
        const amountInCentavos = parseFloat(amount) * 100;
        if (isNaN(amountInCentavos) || amountInCentavos <= 0) {
            return res.status(400).json({ error: 'Amount must be a valid positive number.' });
        }

        // Find the campaign by ID
        const campaign = await Campaign.findById(campaignId);
        if (!campaign) {
            return res.status(404).json({ error: 'Campaign not found' });
        }

        // Prepare the data for the payment link (PayMongo)
        const linkData = {
            amount: amountInCentavos,
            currency: 'PHP',
            description: `Donation for campaign: ${campaign.campaignName}`,
            metadata: {
                donorName,
                donorEmail,
                campaignId,
                campaignName: campaign.campaignName,
            },
        };

        // Create the payment link using PayMongo API
        const link = await paymongo.links.create(linkData);
        console.log("PayMongo Create Link Response:", link);

        // Extract the checkout URL and payment link ID
        const checkoutUrl = link.checkout_url;
        const paymentLinkId = link.id;

        if (!checkoutUrl) {
            console.error("Error: No checkout URL returned from PayMongo");
            return res.status(500).json({ error: 'Failed to create payment link (no URL)' });
        }

        // Create a new donation record
        const newDonation = new Donation({
            campaignId,
            donorName,
            donorEmail,
            amount: amountInCentavos,  // Store the amount in centavos
            status,  // Status initially set to 'pending'
            paymentId: paymentLinkId,  // Store PayMongo's payment link ID
        });

        // Save the donation
        await newDonation.save();

        // Update the total donations for the campaign
        campaign.totalDonations += amountInCentavos;  // Increment totalDonations by the donation amount
        await campaign.save();  // Save the updated campaign

        // Send response back to frontend with checkout URL, donation ID, and updated total donations
        res.status(200).json({
            checkoutUrl,  // PayMongo checkout URL
            donationId: newDonation._id,  // ID of the new donation
            totalDonations: campaign.totalDonations,  // Updated total donations in the campaign
        });

    } catch (error) {
        console.error('Error creating donation:', error);
        return res.status(500).json({ error: 'Failed to create donation' });
    }
};

const handleWebhook = async (req, res) => {
    try {
        const event = req.body;
        console.log("Webhook event received:", JSON.stringify(event, null, 2)); // Log for debugging

        // Check for successful payment event
        if (event.status === 'Paid') {
            const paymentLinkId = event.data.id; // This is the payment link ID returned by PayMongo

            console.log("Payment ID received from webhook:", paymentLinkId); // Debugging line

            // Find the donation using the correct payment link ID
            const donation = await Donation.findOneAndUpdate(
                { paymentId: paymentLinkId },  // Match by paymentId (PayMongo payment link ID)
                { status: 'Paid' },             // Update status to Paid
                { new: true }                   // Return updated donation
            );

            if (donation) {
                console.log('Donation updated as Paid:', donation);
            } else {
                console.log('Donation not found for payment link:', paymentLinkId);
            }
        }

        res.sendStatus(200); // Acknowledge the webhook
    } catch (error) {
        console.error('Error handling webhook:', error);
        res.status(500).json({ error: 'Webhook error' });
    }
};



module.exports = {
    createDonation,
    handleWebhook,
};
