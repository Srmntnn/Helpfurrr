const Dogs = require('../models/Dogs');
const Notification = require('../models/notification');
const UserModel = require('../models/user');
const router = require("../routes/AuthRouter");
const fs = require('fs');
const { v2: cloudinary } = require('cloudinary');
const path = require('path');
const QRCode = require('qrcode');

const PostDogRequest = async (req, res) => {
  try {
    const { name, age, shelter, condition, email, phone, postedBy, gender, vaccinated, neutered, urgent, clientEmail, color } = req.body;

    // Collect images from req.files
    const images = [
      req.files.image1 && req.files.image1[0],
      req.files.image2 && req.files.image2[0],
      req.files.image3 && req.files.image3[0],
      req.files.image4 && req.files.image4[0]
    ].filter(Boolean); // Filter out undefined values

    // Upload images to Cloudinary
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

    // Create dog entry in database
    const dog = await Dogs.create({
      name,
      postedBy,
      age,
      shelter,
      condition,
      phone,
      image: imageUrl,
      email,
      status: 'Pending',
      gender,
      vaccinated,
      neutered,
      urgent,
      clientEmail,
      color
    });

    res.status(200).json(dog);
  } catch (error) {
    console.error("Error creating dog request:", error);
    res.status(500).json({ error: error.message });
  }
};

const AddDog = async (req, res) => {
  try {
    const { name, age, shelter, condition, email, phone, postedBy, gender, vaccinated, neutered, urgent, clientEmail, color } = req.body;

    // Collect images from req.files
    const images = [
      req.files.image1 && req.files.image1[0],
      req.files.image2 && req.files.image2[0],
      req.files.image3 && req.files.image3[0],
      req.files.image4 && req.files.image4[0]
    ].filter(Boolean); // Filter out undefined values

    // Upload images to Cloudinary
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

    // Create dog entry in database
    const dog = await Dogs.create({
      name,
      postedBy,
      age,
      shelter,
      condition,
      phone,
      image: imageUrl,
      email,
      status: 'Approved',
      gender,
      vaccinated,
      neutered,
      urgent,
      clientEmail,
      color
    });

    res.status(200).json(dog);
  } catch (error) {
    console.error("Error creating dog request:", error);
    res.status(500).json({ error: error.message });
  }
};

const getAllDogs = async (reqStatus, req, res) => {
  try {
    // If reqStatus is a string, wrap it in an array to handle both cases
    const statusArray = Array.isArray(reqStatus) ? reqStatus : [reqStatus];

    // Use MongoDB's $in operator to query multiple statuses
    const data = await Dogs.find({ status: { $in: statusArray } }).sort({ updatedAt: -1 });

    if (data.length > 0) {
      res.status(200).json(data);
    } else {
      res.status(404).json({ message: 'No data found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


const getAllDogData = async (req, res) => {
  try {
    const data = await Dogs.find();
    if (data.length > 0) {
      res.status(200).json(data);
    } else {
      res.status(404).json({ message: 'No data found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getDogsById = async (req, res) => {
  try {
    const { id } = req.params;

    const dog = await Dogs.findById(id);
    if (!dog) {
      return res.status(404).json({ message: 'Dog not Found' });
    }
    res.status(200).json(dog);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const approveRequest = async (req, res) => {
  try {
    const id = req.params.id;
    const { email, phone, status, currentOwner } = req.body;

    // Find and update the dog entry
    const dog = await Dogs.findByIdAndUpdate(
      id,
      { email, phone, status, currentOwner },
      { new: true } // Returns the updated document
    );

    if (!dog) {
      return res.status(404).json({ message: "Dog not found" });
    }

    const user = await UserModel.findOne({ email: dog.email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await Notification.create({
      userId: user._id, // Use user's ObjectId
      message: `Your Request for ${dog.name} has been approved! `,
    });

    // Generate the QR code with specific fields
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
      prevOwnererEmail: dog.clientEmail,
      currentOwner: dog.currentOwner,
      imageUrl: dog.image[0],
    };

    const qrCodeUrl = await QRCode.toDataURL(
      `${process.env.CLIENT_URL}/scanned-data?data=${encodeURIComponent(
        JSON.stringify(qrCodeData)
      )}`
    );

    // Save the QR code URL in the database
    dog.qrCodeUrl = qrCodeUrl;
    await dog.save();

    res.status(200).json({ dog, qrCodeUrl });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


const rejectDog = async (req, res) => {
  try {
    const id = req.params.id;
    const { email, phone, status, remarks } = req.body; // Include remarks in request body

    // Update the dog's status, remarks, and other details
    const dog = await Dogs.findByIdAndUpdate(
      id,
      { email, phone, status, remarks }, // Add remarks field to update
      { new: true }
    );

    if (!dog) {
      return res.status(404).json({ message: 'Dog not found' });
    }

    const user = await UserModel.findOne({ email: dog.email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Create a notification for the user
    await Notification.create({
      userId: user._id, // Use user's ObjectId
      message: `Your post for ${dog.name} has been Rejected! \nRemarks: ${remarks}`,
    });

    res.status(200).json(dog);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


const deletePost = async (req, res) => {
  try {
    const id = req.params.id;
    const dog = await Dogs.findByIdAndDelete(id);

    if (!dog) {
      return res.status(404).json({ message: 'Dog not found' });
    }

    if (dog.imageUrl) {
      const publicId = dog.imageUrl.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(publicId);
    }

    return res.status(200).json({ message: 'Dog deleted successfully' });
  } catch (err) {
    console.error("Error deleting dog:", err);
    return res.status(500).json({ message: 'Failed to delete dog' });
  }
};

const editDog = async (req, res) => {
  try {
    const { id } = req.params; // Extract dog ID from request parameters
    const {
      name,
      age,
      shelter,
      condition,
      email,
      phone,
      gender,
      vaccinated,
      neutered,
      urgent,
      color,
      imageUrl, // Assuming you might want to update images as well
    } = req.body;

    // Prepare update object
    const updateData = {
      name,
      age,
      shelter,
      condition,
      email,
      phone,
      gender,
      vaccinated,
      neutered,
      urgent,
      color,
      image: imageUrl,
    };

    // If images are provided in the request body, include them in the update
    if (imageUrl && imageUrl.length > 0) {
      updateData.image = imageUrl; // Assuming you want to store multiple image URLs
    }

    // Update the dog record in the database
    const updatedDog = await Dogs.findByIdAndUpdate(id, updateData, { new: true });

    if (!updatedDog) {
      return res.status(404).json({ message: 'Dog not found' });
    }

    // Return the updated dog information
    res.status(200).json(updatedDog);
  } catch (err) {
    console.error("Error updating dog:", err); // Log the error for debugging
    res.status(500).json({ error: err.message });
  }
};

const getDogByEmail = async (req, res) => {
  try {
    const { email } = req.params;

    if (!email) {
      return res.status(400).json({ message: 'Email parameter is required' });
    }

    // Define the statuses to filter
    const allowedStatuses = ['Approved', 'Pending', 'Rejected'];

    // Find dogs by email and statuses, and sort by updatedAt in descending order
    const dogs = await Dogs.find({ email, status: { $in: allowedStatuses } }).sort({ updatedAt: -1 });

    if (dogs.length > 0) {
      res.status(200).json(dogs);
    } else {
      res.status(404).json({ message: 'No dogs found with the specified statuses for the given email' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getAdoptedDogByEmail = async (req, res) => {
  try {
    const { email } = req.params;

    if (!email) {
      return res.status(400).json({ message: 'Email parameter is required' });
    }

    // Define the statuses to filter
    const allowedStatuses = ['Adopted'];

    // Find dogs by email and statuses, and sort by updatedAt in descending order
    const dogs = await Dogs.find({ email, status: { $in: allowedStatuses } }).sort({ updatedAt: -1 });

    if (dogs.length > 0) {
      res.status(200).json(dogs);
    } else {
      res.status(404).json({ message: 'No dogs found with the specified statuses for the given email' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getDogsByStatus = async (req, res) => {
  try {
    // Query database for dogs with statuses 'waiting for owner' or 'approved'
    const dogs = await Dogs.find({
      status: { $in: ['waiting for owner', 'approved'] }
    });

    // Respond with the dogs data
    res.status(200).json({
      success: true,
      data: dogs,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve dogs',
    });
  }
};



module.exports = {
  getAllDogs,
  PostDogRequest,
  deletePost,
  approveRequest,
  getDogsById,
  editDog,
  getDogByEmail,
  getAllDogData,
  rejectDog,
  AddDog,
  getDogsByStatus,
  getAdoptedDogByEmail
}