// config/cloudinaryConfig.js

const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const config = require("./index"); // Your environment loader

// Configure Cloudinary
cloudinary.config({
  cloud_name: config.CLOUDINARY_CLOUD_NAME,
  api_key: config.CLOUDINARY_API_KEY,
  api_secret: config.CLOUDINARY_API_SECRET,
});

// Set up Cloudinary Storage for Multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "files", // Change this to your desired folder name in Cloudinary
    allowed_formats: ["jpg", "jpeg", "png", "pdf", "doc"],
  },
});

module.exports = { cloudinary, storage };
