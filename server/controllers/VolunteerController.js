const Notification = require('../models/notification');
const UserModel = require('../models/user');
const Visit = require('../models/VisitModel')

const VolunteerRequest = async (req, res) => {
    try {
        // Destructure request body
        const {
            typeOfVisit,
            visitDate,
            visitTime,
            visitorName,
            visitorLastName,
            email,
            totalVisitors,
            questions,
        } = req.body;

        // Input validation
        if (!typeOfVisit || !visitDate || !visitTime || !visitorName || !visitorLastName || !email || totalVisitors === undefined || !questions) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        // Create visit entry in the database
        const volunteer = await Visit.create({
            typeOfVisit,
            visitDate,
            visitTime,
            visitorName,
            visitorLastName,
            email,
            totalVisitors,
            questions,
            status: 'Pending', // Default status
        });

        // Send success response
        res.status(201).json({
            message: 'Volunteer request created successfully',
            volunteer,
        });
    } catch (error) {
        console.error("Error creating volunteer request:", error);

        // Handle duplicate email or other specific errors if necessary
        if (error.code === 11000) { // MongoDB duplicate key error
            return res.status(409).json({ error: 'A request with this email already exists' });
        }

        // General error response
        res.status(500).json({ error: 'Internal server error' });
    }
};

const getAllVolunteers = async (reqStatus, req, res) => {
    try {
        const data = await Visit.find({ status: reqStatus }).sort({ updatedAt: -1 });
        if (data.length > 0) {
            res.status(200).json(data);
        } else {
            res.status(404).json({ message: 'No data found' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const getVolunteerByEmail = async (req, res) => {
    try {
        const { email } = req.params; // Assuming email is in the request body

        if (!email) {
            return res.status(400).json({ message: 'Please provide email in request body' });
        }

        const volunteer = await Visit.find({ email });
        if (!volunteer) {
            return res.status(404).json({ message: 'Dog not Found' });
        }
        res.status(200).json(volunteer);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const AllVolunteers = async (req, res) => {
    try {
        const data = await Visit.find();
        if (data.length > 0) {
            res.status(200).json(data);
        } else {
            res.status(404).json({ message: 'No data found' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const approveRequest = async (req, res) => {
    try {
        const id = req.params.id;
        const { email, status } = req.body;

        // Validate incoming data
        if (!email || !status) {
            return res.status(400).json({ message: 'Email and status are required' });
        }

        const volunteer = await Visit.findByIdAndUpdate(id, { email, status }, { new: true });

        if (!volunteer) {
            return res.status(404).json({ message: 'Volunteer not found' });
        }

        const user = await UserModel.findOne({ email: volunteer.email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Create a notification for the user
        await Notification.create({
            userId: user._id,
            message: `${volunteer.visitorName}, Your request for visiting has been approved!`,
        });

        res.status(200).json(volunteer);
    } catch (err) {
        console.error("Error in approveRequest:", err); // Log error details
        res.status(500).json({ message: err.message });
    }
};

const rejectVisit = async (req, res) => {
    try {
        const id = req.params.id;
        const { email, status, remarks } = req.body;

        // Validate incoming data
        if (!email || !status || !remarks) {
            return res.status(400).json({ message: 'Email, status, and remarks are required.' });
        }

        // Update the visit request with rejection status and remarks
        const volunteer = await Visit.findByIdAndUpdate(
            id,
            { email, status, remarks },
            { new: true }
        );

        if (!volunteer) {
            return res.status(404).json({ message: 'Volunteer not found' });
        }

        const user = await UserModel.findOne({ email: volunteer.email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Create a notification for the user
        await Notification.create({
            userId: user._id,
            message: `Your visit request has been rejected. \nRemarks: ${remarks}`,
        });

        res.status(200).json({ message: 'Visit request rejected successfully', volunteer });
    } catch (err) {
        console.error("Error in rejectVisit:", err); // Log error details
        res.status(500).json({ message: err.message });
    }
};


module.exports = {
    VolunteerRequest,
    approveRequest,
    getAllVolunteers,
    AllVolunteers,
    getVolunteerByEmail,
    rejectVisit
}