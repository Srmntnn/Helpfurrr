const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

const { getAllDogs, PostDogRequest, deletePost, approveRequest, getDogsById, getDogByEmail, getAllDogData, rejectDog, editDog, AddDog, getAdoptedDogByEmail } = require('../controllers/dogsController');
const upload = require('../middlewares/multer');

router.get('/requests', (req, res) => getAllDogs('Pending', req, res));
router.get('/approvedPets', (req, res) => getAllDogs('Approved', req, res));
router.get('/approved-and-waiting', (req, res) => {
    getAllDogs(['Approved', 'waiting for owner'], req, res);
});
router.get('/requestDog', (req, res) => {
    getAllDogs(['Approved', 'Pending', 'Rejected'], req, res);
});
router.get('/rejected-dogs', (req, res) => getAllDogs('Rejected', req, res));
router.get('/getdogbyId/:id', getDogsById);
router.get('/all-dogs', getAllDogData);
router.get('/adoptedPets', (req, res) => getAllDogs('Adopted', req, res));
router.post('/postadoption', upload.fields([{ name: 'image1', maxCount: 1 }, { name: 'image2', maxCount: 1 }, { name: 'image3', maxCount: 1 }, { name: 'image4', maxCount: 1 }]), PostDogRequest);
router.put('/approving/:id', approveRequest);
router.post('/admin-addDog', upload.fields([{ name: 'image1', maxCount: 1 }, { name: 'image2', maxCount: 1 }, { name: 'image3', maxCount: 1 }, { name: 'image4', maxCount: 1 }]), AddDog);
router.put('/rejecting/:id', rejectDog);
router.delete('/delete/:id', deletePost);
router.patch('/edit-dog/:id', editDog);
router.get('/mydogs/:email', getDogByEmail)
router.get('/adopted-email/:email', getAdoptedDogByEmail)

module.exports = router; 