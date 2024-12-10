const express = require('express');
const multer = require('multer');
const { signup, login, logout, deleteUser, getUsers, updateRole, updateUsers, getAdmin, makeAdmin, verifyEmail, forgotPassword, resetPassword, checkAuth } = require('../controllers/AuthController');
const verifyAdmin = require('../middlewares/verifyAdmin');
const verifyToken = require('../middlewares/verifyToken');

const router = express.Router();

// Multer setup for image uploads
const storage = multer.memoryStorage(); // Store the file in memory temporarily
const upload = multer({ storage: storage }); // You can also set limits like file size here

// Route to handle login, signup, etc.
router.post('/login', login);
router.post('/signup', signup);
router.post('/logout', logout);
router.post('/verify-email', verifyEmail);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);
router.get('/check-auth', verifyToken, checkAuth);

// Admin and user management
router.delete('/users/:id', deleteUser);
router.get('/users', verifyToken, verifyAdmin, getUsers);
router.put('/users/:id', updateRole);
router.get('/admin/:email', getAdmin);
router.post('/admin/:id', makeAdmin);

// Edit profile route with image upload
router.patch('/edit-profile', verifyToken, upload.single('profilePicture'), updateUsers); // Single file upload

module.exports = router;
