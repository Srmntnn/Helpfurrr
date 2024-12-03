const express = require('express');
const router = express.Router();
const { saveForm, getAdoptForms, deleteForm, deleteAllRequests } = require('../controllers/AdoptionFormController');
const upload = require('../middlewares/multer');

router.post('/save', upload.fields([{ name: 'image1', maxCount: 1 }, { name: 'image2', maxCount: 1 }]), saveForm);
router.get('/getForms', getAdoptForms);
router.delete('/reject/:id', deleteForm);
router.delete('/delete/many/:id', deleteAllRequests);

module.exports = router;