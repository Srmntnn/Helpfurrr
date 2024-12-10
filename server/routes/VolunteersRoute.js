const express = require("express");
const router = express.Router();
const { VolunteerRequest, approveRequest, getAllVolunteers, AllVolunteers, getVolunteerByEmail, rejectVisit } = require("../controllers/VolunteerController");

router.get('/requests', (req, res) => getAllVolunteers('Pending', req, res));
router.get('/all-volunteer', AllVolunteers);
router.get('/approved-visits', (req, res) => getAllVolunteers('Approved', req, res));
router.get('/rejected-visits', (req, res) => getAllVolunteers('Rejected', req, res));
router.put('/approving-volunteer/:id', approveRequest);
router.put('/rejecting-volunteer/:id', rejectVisit);
router.post('/visit-request', VolunteerRequest);
router.get('/visit-request/:email', getVolunteerByEmail)




module.exports = router; 