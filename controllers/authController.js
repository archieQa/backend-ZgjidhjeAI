const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { OAuth2Client } = require("google-auth-library");
const { Strategy: GitHubStrategy } = require("passport-github2");
const config = require("../config/index");
const { BadRequestError, UnauthorizedError } = require("../utils/customErrors");
const asyncHandler = require("../middleware/asyncHandler");

const generateToken = (id) => {
  return jwt.sign({ id }, config.JWT_SECRET, {
    expiresIn: "30d",
  });
};

// Register User
exports.registerUser = asyncHandler(async (req, res, next) => {
  const { username, email, password } = req.body;

  // Validate user input
  if (!username || !email || !password) {
    throw new BadRequestError("Username, email, and password are required");
  }

  // Check if username or email already exists
  const existingUser = await User.findOne({ $or: [{ email }, { username }] });
  if (existingUser) {
    throw new BadRequestError("Email or username already exists");
  }

  // Create and save the new user
  const user = new User({ username, email, password });
  await user.save();

  // Return success response with token
  res.status(201).json({
    success: true,
    token: generateToken(user._id),
  });
});

// Login User
exports.loginUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // Validate user input
  if (!email || !password) {
    throw new BadRequestError("Email and password are required");
  }

  const user = await User.findOne({ email });

  // Check if user exists and password matches
  if (!user || !(await user.matchPassword(password))) {
    throw new UnauthorizedError("Invalid email or password");
  }

  // Return success response with token
  res.json({
    success: true,
    token: generateToken(user._id),
  });
});

// OAuth Logic (Placeholder - To be expanded later)
exports.googleOAuth = async (req, res) => {
  // Implement Google OAuth Login here
};

exports.githubOAuth = async (req, res) => {
  // Implement GitHub OAuth Login here
};
