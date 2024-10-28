const multer = require("multer");
const path = require("path");
const fs = require("fs");
const {
  BadRequestError,
  InternalServerError,
} = require("../utils/customErrors");
const asyncHandler = require("./asyncHandler");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;

// Create an 'uploads' folder if it doesn't exist
const uploadDir = path.join(__dirname, "../uploads");

// Use fs.promises to create the folder asynchronously
fs.promises.mkdir(uploadDir, { recursive: true }).catch(() => {
  throw new InternalServerError("Failed to create upload directory");
});

// Dynamic storage based on URL
const getStorage = (req) => {
  const folder = req.url.includes("profile-picture/upload")
    ? "profile_pictures"
    : "files";

  return new CloudinaryStorage({
    cloudinary,
    params: {
      folder, // Dynamic folder based on URL
      allowed_formats: req.url.includes("profile-picture/upload")
        ? ["jpg", "jpeg", "png"] // Only images for profile pictures
        : ["jpg", "jpeg", "png", "pdf", "doc"], // Allow more types for general uploads
    },
  });
};

// File filter with conditions for different file types
const fileFilter = (req, file, cb) => {
  const profilePictureTypes = ["image/jpeg", "image/png"];
  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "application/pdf",
    "application/msword",
  ];

  if (req.url.includes("profile-picture/upload")) {
    // Only allow JPEG and PNG for profile pictures
    if (profilePictureTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new BadRequestError(
          "Only JPEG and PNG files are allowed for profile pictures"
        ),
        false
      );
    }
  } else {
    // General file uploads filter
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new BadRequestError("Only PDF, JPEG, PNG, and DOC files are allowed"),
        false
      );
    }
  }
};

// Initialize Multer with dynamic storage
const uploadMiddleware = asyncHandler(async (req, res, next) => {
  const upload = multer({
    storage: getStorage(req), // Use dynamic storage based on URL
    limits: { fileSize: 5 * 1024 * 1024 }, // General limit for all file uploads (5MB)
    fileFilter,
  }).single("file");

  upload(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      // Handle multer-specific errors (e.g., file size limit exceeded)
      return next(new BadRequestError(err.message));
    } else if (err) {
      // Handle other unexpected errors
      return next(new InternalServerError(err.message));
    }

    next();
  });
});

module.exports = uploadMiddleware;
