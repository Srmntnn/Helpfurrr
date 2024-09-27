const UserModel = require("../models/user");
const generateToken = require('../middlewares/generateToken');
const router = require("../routes/AuthRouter");
const { query } = require("express");

const signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const user = await UserModel.findOne({ email });
        if (user) {
            return res.status(409)
                .json({ message: 'User is already exist, you can login', success: false });
        }
        const userModel = new UserModel({ name, email, password });
        // userModel.password = await bcrypt.hash(password, 10);
        await userModel.save();
        res.status(201)
            .json({
                message: "Signup successfully",
                success: true
            })
    } catch (err) {
        res.status(500)
            .json({
                message: "Internal server errror",
                success: false
            })
    }
}


const login = async (req, res) => {
    try {
        const { email, password } = req.body;
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

        const token = await generateToken(user._id);

        res.cookie('token', token, {
            httpOnly: true,
            secure: true,
            sameSite: true,
        })

        res.status(200).send({
            message: "Login Success", token, user: {
                _id: user._id,
                email: user.email,
                name: user.name,
                role: user.role,
                profilePicture: user.profilePicture,
                profession: user.profession
            }
        })


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
        onsole.error("Error Fetching User", error);
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
        const { userId, name, profilePicture, profession } = req.body;
        if (!userId) {
            return res.status(400).send({ message: 'User Id is Required' })
        }
        const user = await UserModel.findById(userId);
        if (!user) {
            return res.status(400).send({ message: 'User not Found' })
        }
        if (name !== undefined) user.name = name;
        if (profilePicture !== undefined) user.profilePicture = profilePicture;
        if (profession !== undefined) user.profession = profession;

        await user.save();
        res.status(200).send({
            message: 'Profile updated succesfully', user: {
                _id: user._id,
                email: user.email,
                name: user.name,
                role: user.role,
                profilePicture: user.role,
                profession: user.role
            }
        })
    } catch (error) {
        console.error("Error Updating User's Info", error);
        res.status(500).send({ message: "Error Updating User's Info", });
    }
}

const getAdmin = async (req, res) => {
    const email = req.params.email;
    const query = { email: email }
    try {
        const user = await UserModel.findOne(query);
        console.log(user);
        if (email !== req.decoded.email) {
            return res.status(403).send({ messages: "Forbidden Access" })
        }
        let admin = false;
        if (user) {
            admin = user?.role === "admin";
        }
        res.status(200).json({ admin });
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const makeAdmin = async (req, res) => {
    const userId = req.params.id;
    const {name, email, role, profession, profilePicture} = req.body;
    try {
        const updatedUser = UserModel.findByIdAndUpdate(userId,
            {role: "admin"},
            {new: true, runValidators: true}
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
    makeAdmin
}