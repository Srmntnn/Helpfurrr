const mongoose = require('mongoose');
const { Schema } = mongoose;

const visitSchema = new Schema({
    typeOfVisit: {
        type: String,
        required: true
    },
    visitDate: {
        type: Date,
        required: true
    },
    visitTime: {
        type: String,
        required: true
    },
    visitorName: {
        type: String,
        required: true
    },
    visitorLastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    totalVisitors: {
        type: Number,
        required: true
    },
    questions: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    }
}, { timestamps: true })

const Visit = mongoose.model('Visit', visitSchema)
module.exports = Visit;