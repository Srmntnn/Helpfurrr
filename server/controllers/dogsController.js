const Dogs = require('../models/Dogs');
const Notification = require('../models/notification');
const UserModel = require('../models/user');
const router = require("../routes/AuthRouter");
const fs = require('fs');
const { v2: cloudinary } = require('cloudinary');
const path = require('path');

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

const getAllDogs = async (reqStatus, req, res) => {
  try {
    const data = await Dogs.find({ status: reqStatus }).sort({ updatedAt: -1 });
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
    const { email, phone, status } = req.body;

    // Update the dog's status and other details
    const dog = await Dogs.findByIdAndUpdate(id, { email, phone, status }, { new: true });

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
      message: `Your post for ${dog.name} has been approved!`,
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
    const { id } = req.params;
    const { name, age, shelter, condition, email, phone, gender, vaccinated, neutered, urgent, color } = req.body;

    const updatedDog = await Dogs.findByIdAndUpdate(id, {
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
      color
    }, { new: true });

    if (!updatedDog) {
      return res.status(404).json({ message: 'Dog not found' });
    }

    res.status(200).json(updatedDog);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getDogByEmail = async (req, res) => {
  try {
    const { email } = req.params; // Assuming email is in the request body

    if (!email) {
      return res.status(400).json({ message: 'Please provide email in request body' });
    }

    const dog = await Dogs.find({ email });
    if (!dog) {
      return res.status(404).json({ message: 'Dog not Found' });
    }
    res.status(200).json(dog);
  } catch (err) {
    res.status(500).json({ message: err.message });
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
  getAllDogData
}