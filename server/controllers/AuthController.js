const UserModel = require("../models/user");
const generateToken = require('../middlewares/generateToken.js');
const router = require("../routes/AuthRouter");
const { query } = require("express");
const { sendVerificationEmail, sendWelcomeEmail, sendPasswordResetEmail, sendResetSuccessEmail } = require("../mailtrap/emails.js");
const crypto = require("crypto");
const { v2: cloudinary } = require('cloudinary');

const signup = async (req, res, next) => {
    const { name, email, password } = req.body;
    try {
        const userAlreadyExists = await UserModel.findOne({ email });

        if (!(name || email || password)) {
            return next("Provide Input Fields.")
        }

        if (userAlreadyExists) {
            return res.status(409)
                .json({ message: 'User is already exist, you can login', success: false });
        }
        // userModel.password = await bcrypt.hash(password, 10);
        const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();
        const user = new UserModel({
            email,
            name,
            password,
            verificationToken,
            verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
        });

        await user.save();

        const token = await generateToken(res, user._id);

        await sendVerificationEmail(user.email, verificationToken);

        res.status(201).json({
            success: true,
            message: "User created successfully",
            user: {
                ...user._doc,
                password: undefined,
            },
            token
        });
    } catch (err) {
        res.status(500)
            .json({
                message: "Internal server errror",
                success: false
            })
    }
}

const verifyEmail = async (req, res) => {
    const { code } = req.body;
    try {
        // Find the user with verification code and valid expiration
        const user = await UserModel.findOne({
            verificationToken: code,
            verificationTokenExpiresAt: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid or expired verification code" });
        }

        // Update user properties
        user.emailVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpiresAt = undefined;

        // Save the updated user document
        await user.save();

        await sendWelcomeEmail(user.email, user.name);

        res.status(200).json({
            success: true,
            message: "Email verified successfully",
            user: {
                ...user._doc,
                password: undefined,
            },
        });
    } catch (error) {
        console.log("error in verifyEmail ", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;
    try {

        const user = await UserModel.findOne({ email });
        const errorMsg = 'Email or Password is wrong';
        const errorPass = 'Password is not Matched.';
        if (!user) {
            return res.status(403)
                .json({ message: errorMsg, success: false });
        }
        const isPassEqual = await user.comparePassword(password);
        // const isPassEqual = await bcrypt.compare(password, user.password);
        if (!isPassEqual) {
            return res.status(403)
                .json({ message: errorPass, success: false });
        }

        const token = await generateToken(res, user._id);

        user.lastLogin = new Date();
        await user.save();

        res.status(200).json({
            success: true,
            message: "Logged in successfully",
            token,
            user: {
                ...user._doc,
                password: undefined,
            },
        });


        // const jwtToken = jwt.sign(
        //     { email: user.email, _id: user._id },
        //     process.env.JWT_SECRET,
        //     { expiresIn: '24h' }
        // )

        //  res.status(200)
        //      .json({
        //          message: "Login Success",
        //          success: true,
        //          jwtToken,
        //          email,
        //          name: user.name
        //     })
    } catch (err) {
        res.status(500)
            .json({
                message: "Internal server errror",
                success: false
            })
    }
}

const logout = (req, res) => {
    res.clearCookie('token');
    res.status(200).send({ message: "Logged out Succesfully" });
}

const forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await UserModel.findOne({ email })
        if (!user) {
            return res.status(404).send({ message: 'User not Found' });
        }
        const resetToken = crypto.randomBytes(20).toString("hex")
        const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000; // 1hour

        user.resetPasswordToken = resetToken;
        user.resetPasswordExpiresAt = resetTokenExpiresAt

        await user.save();

        await sendPasswordResetEmail(user.email, `${process.env.CLIENT_URL}/reset-password/${resetToken}`)
        res.status(200).json({ success: true, message: "Password reset link sent to your email" });
    } catch (error) {
        console.log("Error in forgot Password ", error);
        res.status(400).json({ success: false, message: error.message });
    }

}

const resetPassword = async (req, res) => {
    try {
        const { token } = req.params
        const { password } = req.body

        const user = await UserModel.findOne({
            resetPasswordToken: token,
            resetPasswordExpiresAt: { $gt: Date.now() }
        })

        if (!user) {
            res.status(400).json({ success: false, message: "Invalid or Expired reset token " });
        }


        user.password = password
        user.resetPasswordToken = undefined
        user.resetPasswordExpiresAt = undefined
        await user.save();

        await sendResetSuccessEmail(user.email)

        res.status(200).json({ success: true, message: "Password reset successful" });

    } catch (error) {
        console.log("Error in resetPassword ", error);
        res.status(400).json({ success: false, message: error.message });
    }
}

const checkAuth = async (req, res) => {
    try {
        const user = await UserModel.findById(req.userId).select("-password");
        if (!user) {
            return res.status(400).json({ success: false, message: "User not found" });
        }

        res.status(200).json({ success: true, user });
    } catch (error) {
        console.log("Error in checkAuth ", error);
        res.status(400).json({ success: false, message: error.message });
    }
}

const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await UserModel.findByIdAndDelete(id);
        if (!user) {
            return res.status(404).send({ message: 'User not Found' });
        }
        res.status(200).send({ message: 'User deleted Succesfully' });
    } catch (error) {
        console.error("Error Deleting User", error);
        res.status(500).send({ message: "Error Deleting User", });
    }
}

const getUsers = async (req, res) => {
    try {
        const users = await UserModel.find({}, 'id name email role').sort({ createdAt: -1 })
        res.status(200).send(users)
    } catch (error) {
        console.error("Error Fetching User", error);
        res.status(500).send({ message: "Error Fetching User", });
    }
}

const updateRole = async (req, res) => {
    try {
        const { id } = req.params;
        const { role } = req.body;
        const user = await UserModel.findByIdAndUpdate(id, { role }, { new: true });
        if (!user) {
            return res.status(404).send({ message: 'User not found' })
        }
        res.status(200).send({ message: "User's role updated succesfully" })
    } catch (error) {
        console.error("Error Updating Role", error);
        res.status(500).send({ message: "Error Updating Role", });
    }
}

const updateUsers = async (req, res) => {
    try {
        const { userId, name } = req.body;

        if (!userId) {
            return res.status(400).send({ message: 'User Id is Required' });
        }

        const user = await UserModel.findById(userId);

        if (!user) {
            return res.status(400).send({ message: 'User not Found' });
        }

        // If there's a new profile picture, upload to Cloudinary
        if (req.file) {
            const uploadedImage = await cloudinary.uploader.upload_stream({ folder: 'user_profile_pics' }, (error, result) => {
                if (error) {
                    return res.status(500).send({ message: 'Error uploading image to Cloudinary' });
                }
                user.profilePicture = result.secure_url;
            });

            req.file.stream.pipe(uploadedImage); // Pipe the file stream directly to Cloudinary
        }

        // Update other fields if provided
        if (name !== undefined) user.name = name;

        await user.save();

        res.status(200).send({
            message: 'Profile updated successfully',
            user: {
                _id: user._id,
                email: user.email,
                name: user.name,
                role: user.role,
                profilePicture: user.profilePicture,
            },
        });
    } catch (error) {
        console.error("Error Updating User's Info", error);
        res.status(500).send({ message: "Error Updating User's Info" });
    }
};

const getAdmin = async (req, res) => {
    const email = req.params.email;
    const query = { email: email };
    try {
        const user = await UserModel.findOne(query);
        console.log(user)
        if (email !== req.decoded.email) {
            return res.status(403).send({ message: "Forbidden access" })
        }
        let admin = false;
        if (user) {
            admin = user?.role === "admin";
        }
        res.status(200).json({ admin })

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const makeAdmin = async (req, res) => {
    const userId = req.params.id;
    const { name, email, role, profession, profilePicture } = req.body;
    try {
        const updatedUser = UserModel.findByIdAndUpdate(userId,
            { role: "admin" },
            { new: true, runValidators: true }
        );
        if (!updatedUser) {
            return res.status(403).send({ messages: "User not Found" })
        }
        res.status(200).json({ updatedUser });
    } catch (error) {
        res.status(500).json({ message: error.message })

    }
}

module.exports = {
    signup,
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
    checkAuth
}