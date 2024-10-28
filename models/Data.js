const mongoose = require("mongoose");

// Define Data Schema
const DataSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  type: {
    type: String,
    enum: ["file", "ai_package"],
    required: true,
  },
  content: {
    // General content (e.g., extracted text or AI response)
    type: String,
  },
  fileInfo: {
    originalName: { type: String },
    mimeType: { type: String },
    size: { type: Number },
    cloudinaryId: { type: String },
    url: { type: String }, // Cloudinary URL
  },
  aiSolution: {
    type: String, // AI response solving the test
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Index userId for faster query performance

DataSchema.index({ userId: 1 });

module.exports = mongoose.model("Data", DataSchema);
