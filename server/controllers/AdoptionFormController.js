
const AdoptForm = require('../models/AdoptionFormModel')
const express = require('express')
const UserModel = require('../models/user')
const Notification = require('../models/notification')

const saveForm = async (req, res) => {
    try {
        const { email, livingSituation, phoneNo, previousExperience, familyComposition, dogId } = req.body
        const form = await AdoptForm.create({ email, livingSituation, phoneNo, previousExperience, familyComposition, dogId })

        const user = await UserModel.findOne({ email: form.email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        await Notification.create({
            userId: user._id, // Use user's ObjectId
            message: `Your application for ${dogId.name} has been approved!`,
        });
        res.status(200).json(form)
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
}

const getAdoptForms = async (req, res) => {
    try {
        const forms = await AdoptForm.find().sort({ createdAt: -1 });
        res.status(200).json(forms)
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
}

const deleteForm = async (req, res) => {
    try {
        const { id } = req.params
        const form = await AdoptForm.findByIdAndDelete(id)
        if (!form) {
            return res.status(404).json({ message: 'Form not found' })
        }
        res.status(200).json({ message: 'Form deleted successfully' })
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
}

const deleteAllRequests = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await AdoptForm.deleteMany({ dogId: id });
        if (result.deletedCount === 0) {
            console.log("Forms not found");
            return res.status(404).json({ error: 'Forms not found' });
        }
        res.status(200).json({ message: 'Forms deleted successfully' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    saveForm,
    getAdoptForms,
    deleteForm,
    deleteAllRequests
}