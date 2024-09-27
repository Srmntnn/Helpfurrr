const mongoose = require('mongoose');
const {Schema} = mongoose;

//create new Schema object for Dogs
const dogsSchema = new Schema({
    name: {
        type: String,
        trim: true,
        required: true,
        minLength: 3,
    },
    dogName: String,
    age: Number,
    image: String,
    color: String,
    rescueDate: Number,
    condition: String,
    shelter: String,
    dogImage: String,
})

const Dogs = mongoose.model('Dogs', dogsSchema);
module.exports = Dogs;