// models/LearningPath.js

const mongoose = require("mongoose");

// Define Learning Path Schema
const LearningPathSchema = new mongoose.Schema({
  tutorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Tutor",
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  level: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true, // Assuming an image URL is mandatory
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("LearningPath", LearningPathSchema);
