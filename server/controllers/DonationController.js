const Donation = require('../models/Donation');
const Campaign = require('../models/Campaign');
const Paymongo = require('paymongo');

const paymongo = new Paymongo(process.env.PAYMONGO_SECRET_KEY);

const createDonation = async (req, res) => {
    try {
        const { campaignId, donorName, donorEmail, amount } = req.body;

        // Find campaign by ID
        const campaign = await Campaign.findById(campaignId);
        if (!campaign) {
            return res.status(404).json({ error: 'Campaign not found' });
        }

        // Create payment intent with PayMongo
        const paymentIntent = await paymongo.paymentIntents.create({
            amount: amount * 100, // Convert amount to centavos
            currency: 'PHP',
            payment_method_allowed: ['gcash', 'card', 'paymaya'],
            description: `Donation for campaign: ${campaign.campaignName}`,
        });

        // Check if the payment intent was created successfully
        if (!paymentIntent || !paymentIntent.data || !paymentIntent.data.id) {
            return res.status(500).json({ error: 'Failed to create payment intent' });
        }

        // Create donation record in the database
        const donation = await Donation.create({
            campaignId,
            donorName,
            donorEmail,
            amount,
            paymentId: paymentIntent.data.id,
            status: 'Pending', // Mark as pending until payment is completed
        });

        // Return client secret and donation ID
        res.status(200).json({
            clientSecret: paymentIntent.data.attributes.client_secret,
            donationId: donation._id,
        });
    } catch (error) {
        console.error('Error creating donation:', error);
        res.status(500).json({ error: 'Failed to create donation' });
    }
};


const handleWebhook = async (req, res) => {
    try {
        const event = req.body;

        if (event.type === 'payment_intent.succeeded') {
            const paymentIntentId = event.data.id;

            const donation = await Donation.findOneAndUpdate(
                { paymentId: paymentIntentId },
                { status: 'Paid' },
                { new: true }
            );

            if (donation) {
                console.log('Donation updated as Paid:', donation);
            }
        }

        res.sendStatus(200);
    } catch (error) {
        console.error('Webhook error:', error);
        res.status(500).json({ error: 'Webhook error' });
    }
};

module.exports = {
    createDonation,
    handleWebhook,
};