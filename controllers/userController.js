const Data = require("../models/Data");
const User = require("../models/User");
const path = require("path");
const { BadRequestError, NotFoundError } = require("../utils/customErrors");
const asyncHandler = require("../middleware/asyncHandler");
const { cloudinary } = require("../config/cloudinaryConfig");

// Create new data (picture or AI answer)
exports.createData = asyncHandler(async (req, res) => {
  // If req.body is an array, validate that each item has type and content
  if (Array.isArray(req.body)) {
    req.body.forEach((item) => {
      if (!item.type || !item.content) {
        throw new BadRequestError("Each item must have type and content");
      }
    });
  } else {
    // Validate user input for single item
    const { type, content } = req.body;
    if (!type || !content) {
      throw new BadRequestError("Type and content are required");
    }
  }

  // Prepare data for insertion
  const dataToInsert = Array.isArray(req.body)
    ? req.body.map((item) => ({
        userId: req.user._id,
        type: item.type,
        content: item.content,
      }))
    : [
        {
          userId: req.user._id,
          type: req.body.type,
          content: req.body.content,
        },
      ];

  // Use insertMany for batch insertion
  const insertedData = await Data.insertMany(dataToInsert);

  res.status(201).json({ success: true, data: insertedData });
});

// Get user profile
exports.getUserProfile = asyncHandler(async (req, res) => {
  // Fetch user profile data directly from the database
  const user = await User.findById(req.user._id)
    .select("username email tokensLeft profilePictureUrl plan lastReset")
    .lean();

  if (!user) {
    throw new NotFoundError("User profile not found");
  }

  // Customize token and refill information based on plan
  if (user.plan === "premium") {
    user.tokensLeft = "Infinite Tokens";
    user.nextRefillTime = "You don't need token refill; you're rich!";
  } else {
    // Calculate exact time remaining until next refill
    const now = new Date();
    const nextRefillTimestamp = user.lastReset.getTime() + 24 * 60 * 60 * 1000;
    const timeUntilRefill = nextRefillTimestamp - now;

    if (timeUntilRefill > 0) {
      const hoursUntilRefill = Math.floor(timeUntilRefill / (1000 * 60 * 60));
      const minutesUntilRefill = Math.floor(
        (timeUntilRefill % (1000 * 60 * 60)) / (1000 * 60)
      );
      user.nextRefillTime = `Your tokens will be refilled in ${hoursUntilRefill} hours and ${minutesUntilRefill} minutes.`;
    } else {
      user.nextRefillTime = "Your tokens have been refilled.";
    }
  }

  // Fetch related user data
  const userData = await Data.find({ userId: req.user._id }).lean();
  const files = userData
    .filter((data) => data.type === "file")
    .map((file) => ({
      id: file._id,
      content: file.content,
      fileInfo: file.fileInfo,
      createdAt: file.createdAt,
    }));
  const aiAnswers = userData
    .filter((data) => data.type === "ai_answer")
    .map((answer) => ({
      id: answer._id,
      content: answer.content,
      createdAt: answer.createdAt,
    }));

  // Structure the response data
  const profile = {
    username: user.username,
    email: user.email,
    tokensLeft: user.tokensLeft,
    plan: user.plan,
    nextRefillTime: user.nextRefillTime,
    profilePictureUrl: user.profilePictureUrl,
    files,
    aiAnswers,
  };

  res.status(200).json({
    success: true,
    profile,
  });
});

// Get all user data
exports.getUserData = asyncHandler(async (req, res) => {
  // Fetch files, AI answers, and packages associated with the user from the database
  const dataRecords = await Data.find({ userId: req.user._id }).lean();

  // Organize data into categories
  const files = dataRecords
    .filter((data) => data.type === "file")
    .map((file) => ({
      id: file._id,
      content: file.content,
      fileInfo: file.fileInfo,
      createdAt: file.createdAt,
    }));

  const aiAnswers = dataRecords
    .filter((data) => data.type === "ai_answer")
    .map((answer) => ({
      id: answer._id,
      content: answer.content,
      createdAt: answer.createdAt,
    }));

  const packages = dataRecords
    .filter((data) => data.type === "ai_package")
    .map((pkg) => ({
      id: pkg._id,
      pdf: pkg.fileInfo,
      extractedText: pkg.content,
      aiSolution: pkg.aiSolution,
      createdAt: pkg.createdAt,
    }));

  // Structure the response data
  const userData = {
    files,
    aiAnswers,
    packages,
  };

  res.status(200).json({
    success: true,
    data: userData,
  });
});

// Update data
exports.updateData = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;

  // Validate input
  if (!content) {
    throw new BadRequestError("Content is required for update");
  }

  const data = await Data.findOneAndUpdate(
    { _id: id, userId: req.user._id },
    { content },
    { new: true }
  );

  // If data is not found, throw a NotFoundError
  if (!data) {
    throw new NotFoundError("Data not found");
  }

  res.status(200).json({ success: true, data });
});

// Delete data
exports.deleteData = asyncHandler(async (req, res) => {
  const { id } = req.params;

  console.log("Attempting to delete data with ID:", id);

  const data = await Data.findOne({ _id: id, userId: req.user._id });

  console.log("Data found:", data);
  // If the data is not found, throw a NotFoundError
  if (!data) {
    throw new NotFoundError("Data not found");
  }
  // If the data is a file and has a cloudinaryId, delete the file from Cloudinary
  if (data.type === "file" && data.fileInfo && data.fileInfo.cloudinaryId) {
    await cloudinary.uploader.destroy(data.fileInfo.cloudinaryId);
  }

  await Data.findOneAndDelete({ _id: id, userId: req.user._id });

  res.status(200).json({ success: true, message: "Data deleted" });
});

// Use AI service
exports.useAiService = asyncHandler(async (req, res) => {
  // Fetch the user data directly from the database
  let user = await User.findById(req.user._id);

  // If user is not found, throw a NotFoundError
  if (!user) {
    throw new NotFoundError("User not found");
  }

  // Increment AI usage count
  user.aiUsageCount += 1;

  // Save the updated usage count in the database
  await user.save();

  // Example AI response for demonstration purposes
  const aiResponse = "This is the generated AI response";

  res.status(200).json({ success: true, response: aiResponse });
});

// Update User Plan
exports.updateUserPlan = asyncHandler(async (req, res) => {
  const { plan } = req.body;

  const user = await User.findById(req.user._id);

  if (!user) {
    throw new NotFoundError("User not found");
  }

  if (!["free", "student", "premium"].includes(plan)) {
    throw new BadRequestError("Invalid plan selected");
  }

  user.plan = plan;
  user.dailyTokenLimit =
    plan === "premium" ? Infinity : plan === "student" ? 100 : 5;
  user.tokensLeft = user.dailyTokenLimit;
  await user.save();

  res
    .status(200)
    .json({ success: true, message: `Plan updated to ${plan} successfully.` });
});

// Upload file
exports.uploadFile = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new BadRequestError("No file uploaded");
  }

  const newFile = new Data({
    userId: req.user._id,
    type: "file",
    content: req.file.path,
    fileInfo: {
      originalName: req.file.originalname,
      mimeType: req.file.mimetype,
      size: req.file.size,
      cloudinaryId: req.file.filename,
    },
  });

  await newFile.save();

  res.status(201).json({ success: true, data: newFile });
});

// Upload Profile Picture
exports.uploadProfilePicture = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new BadRequestError("No file uploaded");
  }

  // Get the current user
  const user = await User.findById(req.user._id);
  if (!user) {
    throw new NotFoundError("User not found");
  }

  // Upload to Cloudinary and store the cloudinaryId
  const result = await cloudinary.uploader.upload(req.file.path, {
    folder: "profile_pictures",
  });

  // If user has a previous profile picture, delete it from Cloudinary
  if (user.profilePictureId) {
    await cloudinary.uploader.destroy(user.profilePictureId);
  }

  // Update user document
  user.profilePictureUrl = result.secure_url;
  user.profilePictureId = result.public_id;
  await user.save();

  res.status(200).json({
    success: true,
    message: "Profile picture uploaded successfully",
    profilePictureUrl: user.profilePictureUrl,
  });
});

// Delete Profile Picture
exports.deleteProfilePicture = asyncHandler(async (req, res) => {
  // Get the current user
  const user = await User.findById(req.user._id);
  if (!user || !user.profilePictureId) {
    throw new NotFoundError("Profile picture not found");
  }

  // Delete from Cloudinary
  await cloudinary.uploader.destroy(user.profilePictureId);

  // Remove from user document
  user.profilePictureUrl = undefined;
  user.profilePictureId = undefined;
  await user.save();

  res.status(200).json({
    success: true,
    message: "Profile picture deleted successfully",
  });
});

exports.uploadPackage = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new BadRequestError("No PDF file uploaded");
  }

  const { extractedText, aiSolution } = req.body;

  // Check for both extracted text and AI solution
  if (!extractedText || !aiSolution) {
    throw new BadRequestError("Extracted text and AI solution are required");
  }

  // Upload PDF to Cloudinary
  const uploadResult = await cloudinary.uploader.upload(req.file.path, {
    folder: "user_packages",
    resource_type: "raw", // For non-image files
  });

  // Create a new data entry as a package
  const packageData = new Data({
    userId: req.user._id,
    type: "ai_package",
    content: extractedText, // Store extracted text as main content
    fileInfo: {
      originalName: req.file.originalname,
      mimeType: req.file.mimetype,
      size: req.file.size,
      cloudinaryId: uploadResult.public_id,
      url: uploadResult.secure_url,
    },
    aiSolution,
  });

  await packageData.save();

  res.status(201).json({
    success: true,
    message: "Package uploaded successfully",
    data: packageData,
  });
});
