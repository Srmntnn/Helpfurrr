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
    filename: {
        type: String,
    },
    author: {
        type: String
    },
    email: {
        type: String
    },

}, { timestamps: true })

const Campaign = mongoose.model('Campaign', campaignSchema);
module.exports = Campaign;