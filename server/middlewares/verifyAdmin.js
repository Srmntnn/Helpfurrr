const jwt = require('jsonwebtoken');
const UserModel = require('../models/user');
const verifyAdmin = async (req, res, next) => {
    const email = req.decoded.email;
    const query ={email: email};

    const user = await UserModel.findOne(query);
    const isAdmin = user?.role == 'admin';

    if(!isAdmin){
        return res.status(403).send({message: "forbidden access!"})
    }

    next();
};

module.exports = verifyAdmin;