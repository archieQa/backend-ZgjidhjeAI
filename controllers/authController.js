const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { OAuth2Client } = require("google-auth-library");
const { Strategy: GitHubStrategy } = require("passport-github2");
const config = require("../config/index");
const {
  InternalServerError,
  BadRequestError,
  UnauthorizedError,
} = require("../utils/customErrors");

const generateToken = (id) => {
  return jwt.sign({ id }, config.JWT_SECRET, {
    expiresIn: "30d",
  });
};

// Register User
exports.registerUser = async (req, res, next) => {
  const { username, email, password } = req.body;
  try {
    // Validate user input
    if (!username || !email || !password) {
      throw new BadRequestError("Username, email, and password are required");
    }

    const user = new User({ username, email, password });
    await user.save();

    res.status(201).json({
      success: true,
      token: generateToken(user._id),
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      // MongoDB/Mongoose validation errors should be treated as bad requests
      return next(new BadRequestError(error.message));
    }

    // For other unexpected errors, wrap them as InternalServerError
    return next(
      new InternalServerError("An error occurred while registering the user")
    );
  }
};

// Login User
exports.loginUser = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    // Validate user input
    if (!email || !password) {
      throw new BadRequestError("Email and password are required");
    }

    const user = await User.findOne({ email });

    // Check if user exists and password matches
    if (!user || !(await user.matchPassword(password))) {
      throw new UnauthorizedError("Invalid email or password");
    }

    res.json({
      success: true,
      token: generateToken(user._id),
    });
  } catch (error) {
    if (
      error instanceof BadRequestError ||
      error instanceof UnauthorizedError
    ) {
      return next(error); // Forward known operational errors
    }

    // Wrap other unexpected errors as InternalServerError
    return next(new InternalServerError("An error occurred while logging in"));
  }
};

// OAuth Logic (Placeholder - To be expanded later)
exports.googleOAuth = async (req, res) => {
  // Implement Google OAuth Login here
};

exports.githubOAuth = async (req, res) => {
  // Implement GitHub OAuth Login here
};
