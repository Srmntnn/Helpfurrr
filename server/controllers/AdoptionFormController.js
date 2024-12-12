
const AdoptForm = require('../models/AdoptionFormModel')
const express = require('express')
const UserModel = require('../models/user')
const Notification = require('../models/notification')
const { v2: cloudinary } = require('cloudinary');
const Dogs = require('../models/Dogs');
const QRCode = require('qrcode');

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
        } = req.body;

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

        // Create the form
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
        });

        // Fetch the user
        const user = await UserModel.findOne({ email: form.email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Fetch the dog's name using dogId
        const dog = await Dogs.findById(dogId); // Ensure DogModel is properly imported
        const dogName = dog ? dog.name : "Unknown Dog";

        // Send notification with the dog's name
        await Notification.create({
            userId: user._id,
            message: `Your application for ${dogName} has been sent!`,
        });

        res.status(200).json(form);
    } catch (err) {
        console.error("Error in saveForm:", err);
        res.status(400).json({ message: err.message });
    }
};


const getAdoptForms = async (req, res) => {
    try {
        const forms = await AdoptForm.find().sort({ createdAt: -1 });
        res.status(200).json(forms)
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
}

const approveRequest = async (req, res) => {
    try {
        const id = req.params.id; // Adoption form ID
        const { status, appointmentDate } = req.body;

        // Validate status before proceeding
        if (!['pending', 'approved', 'rejected', 'waiting for owner', 'adopted'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status value' });
        }

        // Find the adoption form by ID
        const adoption = await AdoptForm.findById(id);
        if (!adoption) {
            return res.status(404).json({ message: 'Adoption Form not found' });
        }

        // Fetch the associated dog
        const dog = await Dogs.findById(adoption.dogId);
        if (!dog) {
            return res.status(404).json({ message: 'Dog not found' });
        }

        if (status === 'waiting for owner') {
            // Set the adoption form and dog's status to 'waiting for owner'
            adoption.status = 'waiting for owner';
            adoption.appointmentDate = appointmentDate;
            dog.status = 'waiting for owner';

            // Send notification about the appointment
            const user = await UserModel.findOne({ email: adoption.email });
            if (user) {
                await Notification.create({
                    userId: user._id,
                    message: `Your adoption application for ${dog.name} has been approved. Your appointment date is set for ${appointmentDate}.`,
                });
            }
        } else if (status === 'adopted') {
            // Remove the appointmentDate when the status is 'adopted'
            adoption.status = 'adopted';
            adoption.appointmentDate = null; // Set to null or you can delete it entirely

            // Update the dog's details for adoption
            dog.currentOwner = adoption.adopterName;
            dog.email = adoption.email;
            dog.phone = adoption.phoneNo;
            dog.shelter = adoption.address;
            dog.status = 'Adopted';

            // Generate a QR code for the dog
            const qrCodeData = {
                name: dog.name,
                age: dog.age,
                gender: dog.gender,
                condition: dog.condition,
                status: dog.status,
                vaccinated: dog.vaccinated,
                neutered: dog.neutered,
                urgent: dog.urgent,
                owner: dog.postedBy,
                shelter: dog.shelter,
                phone: dog.phone,
                email: dog.email,
                prevOwnerEmail: dog.clientEmail,
                currentOwner: dog.currentOwner,
                imageUrl: dog.image[0],
            };
            const qrCodeUrl = await QRCode.toDataURL(
                `${process.env.CLIENT_URL}/scanned-data?data=${encodeURIComponent(
                    JSON.stringify(qrCodeData)
                )}`
            );
            dog.qrCodeUrl = qrCodeUrl;

            // Notify the user about the successful adoption
            const user = await UserModel.findOne({ email: adoption.email });
            if (user) {
                await Notification.create({
                    userId: user._id,
                    message: `Congratulations! You have officially adopted ${dog.name}.`,
                });
            }
        } else {
            return res.status(400).json({ message: 'Invalid status update' });
        }

        // Save the updated form and dog
        await adoption.save();
        await dog.save();

        res.status(200).json({ message: `Adoption status updated to ${status}` });
    } catch (err) {
        console.error("Error in approveRequest:", err);
        res.status(500).json({ message: err.message });
    }
};

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

const rejectRequest = async (req, res) => {
    try {
        const { id } = req.params;
        const { remarks } = req.body; // Get remarks from request body

        // Update the form's status to "rejected" and save the remarks
        const form = await AdoptForm.findByIdAndUpdate(
            id,
            { status: 'rejected', remarks: remarks }, // Store the remarks
            { new: true }
        );

        if (!form) {
            return res.status(404).json({ message: 'Form not found' });
        }

        const dog = await Dogs.findById(form.dogId); // Ensure DogModel is properly imported
        const dogName = dog ? dog.name : "Unknown Dog";

        // Optionally, notify the user about the rejection
        const user = await UserModel.findOne({ email: form.email });
        if (user) {
            await Notification.create({
                userId: user._id,
                message: `Your adoption application for ${dogName} has been rejected. Remarks: ${remarks}`,
            });
        }

        res.status(200).json({ message: 'Form rejected successfully', form });
    } catch (err) {
        console.error("Error in rejectRequest:", err);
        res.status(500).json({ message: err.message });
    }
};

const getAdoptFormsById = async (req, res) => {
    try {
        const { email } = req.params; // Assuming email is in the request body

        if (!email) {
            return res.status(400).json({ message: 'Please provide email in request body' });
        }

        const form = await AdoptForm.find({ email });
        if (!form) {
            return res.status(404).json({ message: 'Dog not Found' });
        }
        res.status(200).json(form);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const updateDogDetails = async (req, res) => {
    try {
        const { dogId } = req.params; // ID of the dog to update
        const { clientEmail, phone, currentOwner } = req.body;

        if (!dogId) {
            return res.status(400).json({ message: 'Dog ID is required' });
        }

        // Update the dog details in the Dogs collection
        const updatedDog = await Dogs.findByIdAndUpdate(
            dogId,
            { clientEmail, phone, currentOwner }, // Fields to update
            { new: true } // Return the updated document
        );

        if (!updatedDog) {
            return res.status(404).json({ message: 'Dog not found' });
        }

        res.status(200).json({
            message: 'Dog details updated successfully',
            dog: updatedDog,
        });
    } catch (err) {
        console.error("Error in updateDogDetails:", err);
        res.status(500).json({ message: err.message });
    }
};



module.exports = {
    saveForm,
    getAdoptForms,
    deleteForm,
    deleteAllRequests,
    rejectRequest,
    getAdoptFormsById,
    updateDogDetails,
    approveRequest
}