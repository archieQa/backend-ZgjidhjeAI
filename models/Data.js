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
    enum: ["picture", "ai_answer", "file"],
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  fileInfo: {
    originalName: { type: String },
    mimeType: { type: String },
    size: { type: Number },
    cloudinaryId: { type: String },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Index userId for faster query performance

DataSchema.index({ userId: 1 });

module.exports = mongoose.model("Data", DataSchema);
