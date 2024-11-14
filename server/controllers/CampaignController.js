const Campaign = require('../models/Campaign');
const verifyToken = require('../middlewares/verifyToken');
const fs = require('fs');
const path = require('path');
// Functions for creating, retrieving, editing, and pausing campaigns

const createCampaign = async (req, res) => {
  try {
    // Validate input data
    const { campaignName, campDeadline, maxDonation, campaignCategory, shortDescription, longDescription, email, author } = req.body;


    const { filename } = req.file;

    // Create a new campaign
    const campaign = await Campaign.create({
      campaignName,
      campDeadline,
      maxDonation,
      campaignCategory,
      shortDescription,
      longDescription,
      status: 'Pending',
      filename,
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

const editCampaign = async (req, res) => {
  try {
    const { id } = req.params;
    const { campaignName, campDeadline, maxDonation, campaignCategory, shortDescription, longDescription } = req.body;

    // Find the campaign by ID
    const campaign = await Campaign.findById(id);

    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }

    // Update the campaign fields
    campaign.campaignName = campaignName;
    campaign.campDeadline = campDeadline;
    campaign.maxDonation = maxDonation;
    campaign.campaignCategory = campaignCategory;
    campaign.shortDescription = shortDescription;
    campaign.longDescription = longDescription;

    // Save the updated campaign
    await campaign.save();

    res.status(200).json({ message: 'Campaign updated successfully', campaign });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update campaign' });
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
// ... (Similar functions for other functionalities)

module.exports = {
  createCampaign,
  getCampaigns,
  editCampaign,
  pauseCampaign,
  getCampaignsById,
  approveCampaign,
  deleteCampaign,
  pauseCampaign,
  rejectCampaign
}