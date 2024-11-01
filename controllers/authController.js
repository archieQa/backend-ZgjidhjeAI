const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
//const { OAuth2Client } = require("google-auth-library");
//const { Strategy: GitHubStrategy } = require("passport-github2");
const { BadRequestError, UnauthorizedError } = require("../utils/customErrors");
const asyncHandler = require("../middleware/asyncHandler");

const generateToken = (id, expiresIn = "1h") => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn, // Use a shorter token expiration
  });
};

// Generate refresh token
const generateRefreshToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: "7d", // Refresh token lasts 7 days
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
exports.loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    const accessToken = generateToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    res.json({
      success: true,
      accessToken,
      refreshToken,
    });
  } else {
    throw new UnauthorizedError("Invalid credentials");
  }
});

// OAuth Logic (Placeholder - To be expanded later)
exports.googleOAuth = async (req, res) => {
  // Implement Google OAuth Login here
};

exports.githubOAuth = async (req, res) => {
  // Implement GitHub OAuth Login here
};
