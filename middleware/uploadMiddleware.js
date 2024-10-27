const multer = require("multer");
const path = require("path");
const fs = require("fs");
const {
  BadRequestError,
  InternalServerError,
} = require("../utils/customErrors");
const asyncHandler = require("./asyncHandler");
const { storage } = require("../config/cloudinaryConfig");

// Create an 'uploads' folder if it doesn't exist
const uploadDir = path.join(__dirname, "../uploads");

// Use fs.promises to create the folder asynchronously
fs.promises.mkdir(uploadDir, { recursive: true }).catch(() => {
  throw new InternalServerError("Failed to create upload directory"); // Handle error
});

// File filter for PDF, images, and documents
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "application/pdf",
    "application/msword",
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    // Use BadRequestError for unsupported file types
    cb(
      new BadRequestError("Only PDF, JPEG, PNG, and DOC files are allowed"),
      false
    );
  }
};

// Initialize Multer with file size limit of 5MB
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter,
}).single("file"); // Assuming you're using 'file' as the field name for uploads

// Middleware wrapper to handle multer errors consistently
const uploadMiddleware = asyncHandler(async (req, res, next) => {
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

module.exports = uploadMiddleware;
