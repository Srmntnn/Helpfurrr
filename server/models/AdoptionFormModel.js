const mongoose = require('mongoose')
const Schema = mongoose.Schema

const adoptFormSchema = new Schema({
    email: { type: String, required: true },
    livingSituation: { type: String, required: true },
    phoneNo: { type: String, required: true },
    previousExperience: { type: String, required: true },
    familyComposition: { type: String, required: true },
    dogId: { type: mongoose.Schema.Types.ObjectId, ref: 'Dogs', required: true },
    contactReference: { type: String, required: true },
    adopterName: { type: String, required: true },
    occupation: { type: String, required: true },
    renting: { type: String, required: true },
    familyAllergic: { type: String, required: true },
    neutering: { type: String, required: true },
    address: { type: String, required: true },
    image: [{ type: String }],
    status: { type: String, default: 'pending', enum: ['pending', 'approved', 'rejected'] },
    remarks: { type: String, default: '' },  // Field to store rejection remarks
}, { timestamps: true });

const AdoptForm = mongoose.model('AdoptForm', adoptFormSchema);
module.exports = AdoptForm;