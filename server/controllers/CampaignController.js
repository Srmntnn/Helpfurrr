const Campaign = require('../models/Campaign');
const verifyToken = require('../middlewares/verifyToken');
const fs = require('fs');
const { v2: cloudinary } = require('cloudinary');
const path = require('path');
// Functions for creating, retrieving, editing, and pausing campaigns

const createCampaign = async (req, res) => {
  try {
    console.log("Request files:", req.files); // Debugging line

    const { campaignName, campDeadline, maxDonation, campaignCategory, shortDescription, longDescription, email, author } = req.body;

    // Check if req.files is defined
    if (!req.files) {
      return res.status(400).json({ error: 'No files were uploaded.' });
    }

    const images = [
      req.files.image1 && req.files.image1[0],
      req.files.image2 && req.files.image2[0],
      req.files.image3 && req.files.image3[0],
      req.files.image4 && req.files.image4[0]
    ].filter(Boolean);

    const imageUrl = await Promise.all(
      images.map(async (item) => {
        try {
          const result = await cloudinary.uploader.upload(item.path, { resource_type: 'image' });
          return result.secure_url;
        } catch (uploadError) {
          console.error("Error uploading image:", uploadError);
          throw new Error("Image upload failed");
        }
      })
    );

    // Create a new campaign
    const campaign = await Campaign.create({
      campaignName,
      campDeadline,
      maxDonation,
      campaignCategory,
      shortDescription,
      longDescription,
      status: 'Ongoing',
      image: imageUrl,
      email,
      author
    });

    res.status(200).json(campaign);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create campaign' });
  }
};

const getCampaigns = async (reqStatus, req, res) => {
  try {
    const data = await Campaign.find({ status: reqStatus }).sort({ updatedAt: -1 });
    if (data.length > 0) {
      res.status(200).json(data);
    } else {
      res.status(404).json({ error: 'No data found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getAllCampaigns = async (req, res) => {
  try {
    const data = await Campaign.find();
    if (data.length > 0) {
      res.status(200).json(data);
    } else {
      res.status(404).json({ error: 'No data found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const editCampaign = async (req, res) => {
  const { id } = req.params; // Extract campaign ID from the URL
  const { campaignName, maxDonation, status } = req.body; // Get updated data from request body

  try {
    // Find the campaign by ID and update it with new data
    const updatedCampaign = await Campaign.findByIdAndUpdate(
      id,
      { campaignName, maxDonation, status },
      { new: true, runValidators: true } // return the updated campaign and validate
    );

    if (!updatedCampaign) {
      return res.status(404).json({ message: "Campaign not found" });
    }

    return res.status(200).json(updatedCampaign); // Send updated campaign back
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error updating campaign" });
  }
};

const pauseCampaign = async (req, res) => {
  try {
    const { id } = req.params; // Get the campaign ID from the request parameters

    // Find the campaign by ID
    const campaign = await Campaign.findById(id);

    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }

    // Update the campaign status to 'Paused'
    campaign.status = 'Paused';

    // Save the updated campaign
    await campaign.save();

    res.status(200).json({ message: 'Campaign paused successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to pause campaign' });
  }
};

const getCampaignsById = async (req, res) => {
  try {
    const { id } = req.params;

    const campaign = await Campaign.findById(id);
    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }

    res.status(200).json(campaign);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const approveCampaign = async (req, res) => {
  try {
    const id = req.params.id;
    const { email, phone, status } = req.body;
    const campaign = await Campaign.findByIdAndUpdate(id, { email, phone, status }, { new: true });

    if (!campaign) {
      return res.status(404).json({ error: 'Campaign not found' });
    }

    res.status(200).json(campaign);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

const rejectCampaign = async (req, res) => {
  try {
    const id = req.params.id;
    const { email, status } = req.body;
    const campaign = await Campaign.findByIdAndUpdate(id, { email, status }, { new: true });

    if (!campaign) {
      return res.status(404).json({ error: 'Campaign not found' });
    }

    res.status(200).json(campaign)
  } catch (err) {
    res.status(500).json({ error: err.message });

  }
}

const deleteCampaign = async (req, res) => {
  try {
    const id = req.params.id;
    const campaign = await Campaign.findByIdAndDelete(id);
    if (!campaign) {
      return res.status(404).json({ error: 'Campaign not found' });
    }
    const filePath = path.join(__dirname, '../images', campaign.filename);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    res.status(200).json({ message: 'Campaign deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateTotalDonations = async (req, res) => {
  const { id } = req.params;
  const { donationAmount } = req.body; // Assuming donationAmount is passed in the body

  try {
    // Find the campaign by ID
    const campaign = await Campaign.findById(id);
    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }

    // Update the total donations for the campaign
    campaign.totalDonations = donationAmount;

    // Save the updated campaign
    await campaign.save();

    return res.status(200).json({
      message: 'Total donations updated successfully',
      totalDonations: campaign.totalDonations
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};

const postBudgetUsage = async (req, res) => {
  const { id } = req.params;
  const { item, cost } = req.body;

  try {
      if (!cost || cost <= 0) {
          return res.status(400).json({ message: 'Invalid cost' });
      }

      const campaign = await Campaign.findById(id);
      if (!campaign) {
          return res.status(404).json({ message: 'Campaign not found' });
      }

      campaign.budgetUsage.push({ item, cost });
      
      if (campaign.totalDonations >= cost) {
          campaign.totalDonations -= cost;
      } else {
          return res.status(400).json({ message: 'Insufficient funds to post this budget usage' });
      }

      await campaign.save();
      return res.status(200).json({ message: 'Budget usage added successfully', budgetUsage: campaign.budgetUsage, totalDonations: campaign.totalDonations });
  } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Server error' });
  }
};

const setTotalDonations = async (req, res) => {
  const { campaignId, totalDonations } = req.body;

  try {
    const campaign = await Campaign.findByIdAndUpdate(
      campaignId,
      { totalDonations },
      { new: true }
    );

    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }

    return res.status(200).json({
      message: 'Total donations updated successfully',
      totalDonations: campaign.totalDonations,
    });
  } catch (error) {
    console.error('Error updating total donations:', error);
    return res.status(500).json({ message: 'Error updating total donations' });
  }
};


module.exports = {
  createCampaign,
  getCampaigns,
  editCampaign,
  pauseCampaign,
  getCampaignsById,
  approveCampaign,
  deleteCampaign,
  pauseCampaign,
  rejectCampaign,
  getAllCampaigns,
  postBudgetUsage,
  updateTotalDonations,
  setTotalDonations
}