const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
    campaignId: { type: mongoose.Schema.Types.ObjectId, ref: 'Campaign', required: true },
    donorName: { type: String, required: true },
    donorEmail: { type: String, required: true },
    amount: { type: Number, required: true },
    paymentId: { type: String, required: true },
    status: { type: String, enum: ['Pending', 'Paid', 'Failed'], default: 'Pending' },
}, { timestamps: true });

const Donation = mongoose.model('Donation', donationSchema)
module.exports = Donation;
