const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { OAuth2Client } = require("google-auth-library");
const { Strategy: GitHubStrategy } = require("passport-github2");
const config = require("../config/index");

const generateToken = (id) => {
  return jwt.sign({ id }, config.JWT_SECRET, {
    expiresIn: "30d",
  });
};

// Register User
exports.registerUser = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const user = new User({ username, email, password });
    await user.save();
    res.status(201).json({
      success: true,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Login User
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
      res.json({
        success: true,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// OAuth Logic (Placeholder - To be expanded later)
exports.googleOAuth = async (req, res) => {
  // Implement Google OAuth Login here
};

exports.githubOAuth = async (req, res) => {
  // Implement GitHub OAuth Login here
};
