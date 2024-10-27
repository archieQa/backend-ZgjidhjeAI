const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// Define User Schema
const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: false, // Optional for OAuth users
  },
  provider: {
    type: String,
    enum: ["local", "google", "github"],
    default: "local",
  },
  googleId: {
    type: String,
    required: false,
  },
  githubId: {
    type: String,
    required: false,
  },
  aiUsageCount: {
    type: Number,
    default: 0, // Starts at 0 when a user is created
  },
  lastReset: {
    type: Date,
    default: Date.now, // Tracks the last time the AI usage was reset
  },
  plan: {
    type: String,
    enum: ["free", "student", "premium"],
    default: "free", // Default to Free Plan
  },
  dailyTokenLimit: {
    type: Number,
    default: 5, // Free Plan starts with 5 tokens daily
  },
  tokensLeft: {
    type: Number,
    default: 5, // Tokens left for the current day
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Hash password before saving user
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Index user by email for faster searching
UserSchema.index({ email: 1 });

module.exports = mongoose.model("User", UserSchema);
