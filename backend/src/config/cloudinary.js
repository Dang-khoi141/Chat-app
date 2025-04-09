const cloudinary = require("cloudinary").v2;  // Lấy thuộc tính v2 từ đối tượng cloudinary


const{config}= require('dotenv');
const { model } = require('mongoose');

config()

cloudinary.config({
    cloud_name:process.env.CLOUDINAR_CLOUD_NAME,
    api_key:process.env.CLOUDINAR_API_KEY,
    api_secret:process.env.CLOUDINAR_API_SECRET,
});

module.exports = cloudinary