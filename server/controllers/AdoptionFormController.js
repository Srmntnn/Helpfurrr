
const AdoptForm = require('../models/AdoptionFormModel')
const express = require('express')
const UserModel = require('../models/user')
const Notification = require('../models/notification')
const { v2: cloudinary } = require('cloudinary');
const Dogs = require('../models/Dogs');

const saveForm = async (req, res) => {
    try {
        const id = req.params.id;
        const {
            email,
            livingSituation,
            phoneNo,
            previousExperience,
            familyComposition,
            dogId,
            contactReference,
            adopterName,
            occupation,
            renting,
            familyAllergic,
            neutering,
            address
        } = req.body

        const images = [
            req.files.image1 && req.files.image1[0],
            req.files.image2 && req.files.image2[0],
        ].filter(Boolean); // Filter out undefined values

        const imageUrl = await Promise.all(
            images.map(async (item) => {
                try {
                    const result = await cloudinary.uploader.upload(item.path, { resource_type: 'image' });
                    return result.secure_url;
                } catch (uploadError) {
                    console.error("Error uploading image:", uploadError);
                    throw new Error("Image upload failed");
                }
            })
        );

        const form = await AdoptForm.create({
            email,
            livingSituation,
            phoneNo,
            previousExperience,
            familyComposition,
            dogId,
            contactReference,
            adopterName,
            occupation,
            renting,
            familyAllergic,
            neutering,
            address,
            image: imageUrl
        })

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