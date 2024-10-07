const { signup, login, logout, deleteUser, getUsers, updateRole, updateUsers, getAdmin, makeAdmin } = require('../Controllers/AuthController');
// const { signupValidation, loginValidation } = require('../Middlewares/AuthValidation');

const router = require('express').Router();
const verifyToken = require('../middlewares/verifyToken');

router.post('/login', login);
router.post('/signup',  signup);
router.post('/logout', logout);
router.delete('/users/:id', deleteUser)
router.get('/users' , getUsers)
router.put('/users/:id', updateRole)
router.patch('/edit-profile', updateUsers)
router.get('/admin/:email', getAdmin)
router.post('/admin/:id', makeAdmin)

module.exports = router;