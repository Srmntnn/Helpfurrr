const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

const { getAllDogs, PostDogRequest, deletePost, approveRequest, getDogsById, getDogByEmail, getAllDogData } = require('../controllers/dogsController');
const upload = require('../middlewares/multer');

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, path.join(__dirname, '../images'));
//   },
//   filename: function (req, file, cb) {
//     cb(null, Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname));
//   }
// });

// const upload = multer({ storage: storage });

// upload.single('picture')

router.get('/requests', (req, res) => getAllDogs('Pending', req, res));
router.get('/approvedPets', (req, res) => getAllDogs('Approved', req, res));
router.get('/getdogbyId/:id', getDogsById);
router.get('/all-dogs', getAllDogData);
router.get('/adoptedPets', (req, res) => getAllDogs('Adopted', req, res));
router.post('/postadoption', upload.fields([{ name: 'image1', maxCount: 1 }, { name: 'image2', maxCount: 1 }, { name: 'image3', maxCount: 1 }, { name: 'image4', maxCount: 1 }]), PostDogRequest);
router.put('/approving/:id', approveRequest);
router.delete('/delete/:id', deletePost);
router.get('/mydogs/:email', getDogByEmail)

module.exports = router; 