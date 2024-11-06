// models/Tutor.js

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs"); // Add this line
// Define Tutor Schema
const TutorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
  expertise: {
    type: [String], // Array of expertise areas
    required: true,
  },
  yearsExperience: {
    type: Number,
    required: true,
  },
  rating: {
    type: Number,
    default: 0, // Optional, starts with 0 rating
  },
  description: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String, // URL for the tutor's image
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Hash password before saving tutor
TutorSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method for login
TutorSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("Tutor", TutorSchema);
