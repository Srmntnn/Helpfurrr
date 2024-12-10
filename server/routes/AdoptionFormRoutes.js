const express = require('express');
const router = express.Router();
const {
    saveForm,
    getAdoptForms,
    deleteForm,
    deleteAllRequests,
    rejectRequest,
    getAdoptFormsById,
    updateDogDetails,// Import the new rejectRequest function
    approveRequest
} = require('../controllers/AdoptionFormController');
const upload = require('../middlewares/multer');

// Route to save a new form with image upload
router.post('/save', upload.fields([{ name: 'image1', maxCount: 1 }, { name: 'image2', maxCount: 1 }]), saveForm);

// Route to get all adoption forms
router.get('/getForms', getAdoptForms);

router.get('/getForms/:email', getAdoptFormsById);

// Route to reject a form (updates status to "rejected")
router.put('/reject/:id', rejectRequest); // Use PUT for status updates

// Route to delete a specific form
router.delete('/delete/:id', deleteForm);

// Route to delete all requests for a specific dog
router.delete('/delete/many/:id', deleteAllRequests);

router.put('/update-dog/:dogId', updateDogDetails);

router.put('/approve/:id', approveRequest)

module.exports = router;
