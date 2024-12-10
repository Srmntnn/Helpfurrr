const mongoose = require('mongoose');

const campaignSchema = new mongoose.Schema({
    campaignName: {
        type: String,
        required: true
    },
    campDeadline: {
        type: Date,
        required: true
    },
    maxDonation: {
        type: Number,
        required: true
    },
    campaignCategory: {
        type: String,
        required: true
    },
    shortDescription: {
        type: String,
        required: true
    },
    longDescription: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    author: {
        type: String
    },
    email: {
        type: String
    },
    image: {
        type: Array,
        required: true
    },
    totalDonations: { type: Number, default: 0 },
    remainingBudget: {
        type: Number,
        default: 0,
    },
    budgetUsage: [
        {
            item: String,
            cost: Number,
            date: { type: Date, default: Date.now }
        }
    ],
    usedBudget: { type: Number, default: 0 },
}, { timestamps: true })

const Campaign = mongoose.model('Campaign', campaignSchema);
module.exports = Campaign;