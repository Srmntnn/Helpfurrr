const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

const { createCampaign,
    getCampaigns,
    editCampaign,
    pauseCampaign,
    getCampaignsById,
    approveCampaign,
    getAllCampaigns,
    deleteCampaign,
    rejectCampaign } = require('../controllers/CampaignController');
const verifyToken = require('../middlewares/verifyToken');
const upload = require('../middlewares/multer');

router.post('/create-campaign', upload.fields([
    { name: 'image1', maxCount: 1 },
    { name: 'image2', maxCount: 1 },
    { name: 'image3', maxCount: 1 },
    { name: 'image4', maxCount: 1 }
]), createCampaign);
router.get('/campaign-requests', (req, res) => getCampaigns('Ongoing', req, res));
router.get('/get-campaigns', (req, res) => getCampaigns('Approved', req, res));
router.get('/get-all-campaigns', getAllCampaigns);
router.get('/edit-campaign/:id', editCampaign);
router.patch('/edit-campaign', editCampaign);
router.patch('/pause-campaign', verifyToken, pauseCampaign);
router.get('/get-campaignbyid/:id', getCampaignsById)
router.put('/approving-campaign/:id', approveCampaign);
router.put('/rejecting-campaign/:id', rejectCampaign);
router.delete('/delete-campaign/:id', deleteCampaign);


// router.get('/campaigns/:id', getCampaignDetailsWithRecommendations);

module.exports = router;