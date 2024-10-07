const Dogs = require('../models/Dogs')
const router = require("../routes/AuthRouter");
const fs = require('fs');
const path = require('path');

const PostDogRequest = async (req, res) => {
  try {
    const { name, age, shelter, condition, email, phone, } = req.body;
    const { filename } = req.file;

    const dog = await Dogs.create({
      name,
      age,
      shelter,
      condition,
      email,
      phone,
      filename,
      // color,
      status: 'Pending'
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
      res.status(404).json({ error: 'No data found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const approveRequest = async (req, res) => {
  try {
    const id = req.params.id;
    const { email, phone, status } = req.body;
    const dog = await Dogs.findByIdAndUpdate(id, { email, phone, status }, { new: true });

    if (!dog) {
      return res.status(404).json({ error: 'Dog not found' });
    }

    res.status(200).json(dog);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


const deletePost = async (req, res) => {
  try {
    const id = req.params.id;
    const dog = await Dogs.findByIdAndDelete(id);
    if (!dog) {
      return res.status(404).json({ error: 'dog not found' });
    }
    const filePath = path.join(__dirname, '../images', dog.filename);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    res.status(200).json({ message: 'dog deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getAllDogs,
  PostDogRequest,
  deletePost,
  approveRequest
}