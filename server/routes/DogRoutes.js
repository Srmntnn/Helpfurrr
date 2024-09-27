const express = require("express");
const router = express.Router();
const Dog = require("../models/Dogs");

const dogController = require('../controllers/dogsController');

router.get('/', dogController.getAllDogs);

module.exports = router; 