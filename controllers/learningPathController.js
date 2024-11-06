// controllers/learningPathController.js

const LearningPath = require("../models/LearningPath");
const asyncHandler = require("../middleware/asyncHandler");
const { NotFoundError } = require("../utils/customErrors");

// Create a new learning path
exports.createLearningPath = asyncHandler(async (req, res) => {
  const { title, description, level, imageUrl } = req.body;

  if (!title || !description || !level || !imageUrl) {
    throw new BadRequestError(
      "Title, description, level, and image URL are required"
    );
  }

  const learningPath = new LearningPath({
    tutorId: req.user._id,
    title,
    description,
    level,
    imageUrl,
  });

  await learningPath.save();

  res.status(201).json({
    success: true,
    learningPath,
  });
});

// Get all learning paths by the authenticated tutor
exports.getLearningPaths = asyncHandler(async (req, res) => {
  const learningPaths = await LearningPath.find({
    tutorId: req.user._id,
  }).lean();

  res.status(200).json({
    success: true,
    learningPaths,
  });
});

// Update a learning path by ID
exports.updateLearningPath = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, description, level, imageUrl } = req.body;

  const learningPath = await LearningPath.findOne({
    _id: id,
    tutorId: req.user._id,
  });
  if (!learningPath) {
    throw new NotFoundError("Learning path not found");
  }

  // Update only provided fields
  if (title) learningPath.title = title;
  if (description) learningPath.description = description;
  if (level) learningPath.level = level;
  if (imageUrl) learningPath.imageUrl = imageUrl;

  await learningPath.save();

  res.status(200).json({
    success: true,
    message: "Learning path updated successfully",
    learningPath,
  });
});

// Delete a learning path by ID
exports.deleteLearningPath = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const learningPath = await LearningPath.findOneAndDelete({
    _id: id,
    tutorId: req.user._id,
  });
  if (!learningPath) {
    throw new NotFoundError("Learning path not found");
  }

  res.status(200).json({
    success: true,
    message: "Learning path deleted successfully",
  });
});
