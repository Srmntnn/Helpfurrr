const jwt = require('jsonwebtoken');
const UserModel = require('../models/user')

const generateToken = async (res, userId) => {
    const user = await UserModel.findById(userId)
    const token = jwt.sign(
        { userId: user._id, role: user.role, email: user.email }, process.env.JWT_SECRET, {
        expiresIn: '24hr'
    }
    );
    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return token;
}

module.exports = generateToken;

// try {
//     const user = await User.findById(userId);
//     if (!user) {
//         throw new Error("User Not Found.");
//     }

//     const token = jwt.sign(
//         { email: user.email, _id: user._id },
//         process.env.JWT_SECRET,
//         { expiresIn: '24h' }
//     )
//     res.cookie("token", token, {
//         httpOnly: true,
//         secure: process.env.NODE_ENV === "production",
//         sameSite: "strict",
//         maxAge: 7 * 24 * 60 * 60 * 1000,
//     });
//     return token;

// } catch (error) {

// }