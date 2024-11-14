const Dogs = require('../models/Dogs')
const router = require("../routes/AuthRouter");
const fs = require('fs');
const path = require('path');

const PostDogRequest = async (req, res) => {
  try {
    const { name, age, shelter, condition, email, phone, postedBy, gender, vaccinated, neutered, urgent, clientEmail } = req.body;
    const { filename } = req.file;

    const dog = await Dogs.create({
      name,
      postedBy,
      age,
      shelter,
      condition,
      phone,
      filename,
      email,
      status: 'Pending',
      gender, 
      vaccinated, 
      neutered, 
      urgent, 
      clientEmail
    });

    res.status(200).json(dog);
  } catch (error) {
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
    const dog = await Dogs.findByIdAndUpdate(id, { email, phone, status }, { new: true });

    if (!dog) {
      return res.status(404).json({ message: 'Dog not found' });
    }

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
      return res.status(404).json({ message: 'dog not found' });
    }
    const filePath = path.join(__dirname, '../images', dog.filename);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    res.status(200).json({ message: 'dog deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
const editDog = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, age, shelter, condition, email, phone, gender, vaccinated, neutered, urgent } = req.body;

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
      urgent
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
  getDogByEmail
}