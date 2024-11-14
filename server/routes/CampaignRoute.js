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
    deleteCampaign,rejectCampaign } = require('../controllers/CampaignController');
const verifyToken = require('../middlewares/verifyToken');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../campaignimages'));
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname));
    }
});


const upload = multer({ storage: storage });

router.post('/create-campaign', upload.single('picture'), createCampaign);
router.get('/campaign-requests', (req, res) => getCampaigns('Pending', req, res));
router.get('/get-campaigns', (req, res) => getCampaigns('Approved', req, res));
router.get('/edit-campaign/:id', editCampaign);
router.patch('/edit-campaign', editCampaign);
router.patch('/pause-campaign', verifyToken, pauseCampaign);
router.get('/get-campaignbyid/:id', getCampaignsById)
router.put('/approving-campaign/:id', approveCampaign);
router.put('/rejecting-campaign/:id', rejectCampaign);
router.delete('/delete-campaign/:id', deleteCampaign);


// router.get('/campaigns/:id', getCampaignDetailsWithRecommendations);

module.exports = router;