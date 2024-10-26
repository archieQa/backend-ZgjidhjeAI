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
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Data", DataSchema);
