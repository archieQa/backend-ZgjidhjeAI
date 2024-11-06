// controllers/tutorController.js

const Tutor = require("../models/Tutor");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { BadRequestError, UnauthorizedError } = require("../utils/customErrors");
const asyncHandler = require("../middleware/asyncHandler");

// Generate JWT Token for tutor authentication
const generateToken = (id, expiresIn = "3h") => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn });
};

// Register Tutor
exports.registerTutor = asyncHandler(async (req, res) => {
  const {
    name,
    subject,
    expertise,
    yearsExperience,
    email,
    password,
    description,
  } = req.body;

  // Validate required fields
  if (
    !name ||
    !subject ||
    !expertise ||
    !yearsExperience ||
    !email ||
    !password ||
    !description
  ) {
    throw new BadRequestError("All fields are required for tutor registration");
  }

  // Check if email already exists
  const existingTutor = await Tutor.findOne({ email });
  if (existingTutor) {
    throw new BadRequestError("Email already exists");
  }

  // Create and save new tutor
  const tutor = new Tutor({
    name,
    subject,
    expertise,
    yearsExperience,
    email,
    password,
    description,
  });
  await tutor.save();

  // Return success response with token
  res.status(201).json({
    success: true,
    token: generateToken(tutor._id),
  });
});

// Login Tutor
exports.loginTutor = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const tutor = await Tutor.findOne({ email });
  if (tutor && (await tutor.matchPassword(password))) {
    res.json({
      success: true,
      token: generateToken(tutor._id),
    });
  } else {
    throw new UnauthorizedError("Invalid credentials");
  }
});
