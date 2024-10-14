const { signup,
    login,
    logout,
    deleteUser,
    getUsers,
    updateRole,
    updateUsers,
    getAdmin,
    makeAdmin,
    verifyEmail,
    forgotPassword,
    resetPassword,
    checkAuth } = require('../controllers/AuthController');
const verifyAdmin = require('../middlewares/verifyAdmin');
// const { signupValidation, loginValidation } = require('../Middlewares/AuthValidation');

const router = require('express').Router();
const verifyToken = require('../middlewares/verifyToken');

router.post('/login', login);
router.post('/signup', signup);
router.post('/logout', logout);
router.post('/verify-email', verifyEmail);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);
router.get('/check-auth', verifyToken, checkAuth)


router.delete('/users/:id', deleteUser)
router.get('/users', verifyToken, verifyAdmin, getUsers)
router.put('/users/:id', updateRole)
router.patch('/edit-profile', updateUsers)
router.get('/admin/:email', getAdmin)
router.post('/admin/:id', makeAdmin)

module.exports = router;