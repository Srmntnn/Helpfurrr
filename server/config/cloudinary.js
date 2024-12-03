// Import the Cloudinary library
const { v2: cloudinary } = require('cloudinary');

// Configure Cloudinary with your credentials
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME, // Your cloud name
  api_key: process.env.CLOUDINARY_API_KEY,       // Your API key
  api_secret: process.env.CLOUDINARY_SECRET_KEY   // Your API secret
});

module.exports = cloudinary