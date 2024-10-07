const express = require("express");
const router = express.Router();
const multer = require('multer');
const path = require('path');

const { getAllDogs, PostDogRequest, deletePost, approveRequest } = require('../controllers/dogsController');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../images'));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

router.get('/requests', (req, res) => getAllDogs('Pending', req, res));
router.get('/approvedPets', (req, res) => getAllDogs('Approved', req, res));
router.get('/adoptedPets', (req, res) => getAllDogs('Adopted', req, res));
router.post('/postadoption', upload.single('picture'), PostDogRequest);
router.put('/approving/:id', approveRequest);
router.delete('/delete/:id', deletePost);

module.exports = router; 