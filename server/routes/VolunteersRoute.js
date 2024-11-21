const express = require("express");
const router = express.Router();
const { VolunteerRequest, approveRequest, getAllVolunteers } = require("../controllers/VolunteerController");

router.get('/requests', (req, res) => getAllVolunteers('Pending', req, res));
router.get('/approved-visits', (req, res) => getAllVolunteers('Approved', req, res));
router.put('/approving-volunteer/:id', approveRequest);
router.post('/visit-request', VolunteerRequest);




module.exports = router; 