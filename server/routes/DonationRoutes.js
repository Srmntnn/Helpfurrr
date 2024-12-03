const express = require('express');
const router = express.Router();
const DonationController = require('../controllers/DonationController');

router.post('/donate', DonationController.createDonation);
router.post('/webhook', DonationController.handleWebhook);

module.exports = router;