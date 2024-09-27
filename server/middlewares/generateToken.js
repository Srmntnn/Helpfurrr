const jwt = require('jsonwebtoken');
const User = require('../models/user')

const JWT_SECRET = process.env.JWT_SECRET;

const generateToken = async (userId) => {
    try {
        const user = await User.findById(userId);
        if (!user) {
            throw new Error("User Not Found.");
        }

        const token = jwt.sign(
            { email: user.email, _id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        )
        return token;


    } catch (error) {

    }
}

module.exports = generateToken;