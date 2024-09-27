const DogsModel = require('../models/Dogs')
const router = require("../routes/AuthRouter");


const AddDogs = async (req, res) => {
    try {
        const newDog = new DogsModel({
            ...req.body
        })

        const savedDog = await newDog.save();
        res.status(202).send(savedDog)
    } catch (error) {
        
    }
}

const getAllDogs = async (req, res) => {
    try {
        const dogs = await DogsModel.find({})
        res.status(200).json(dogs)
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = {
    getAllDogs
}