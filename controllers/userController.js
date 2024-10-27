const Data = require("../models/Data");
const User = require("../models/User");
const path = require("path");
const { BadRequestError, NotFoundError } = require("../utils/customErrors");
const asyncHandler = require("../middleware/asyncHandler");
const { cloudinary } = require("../config/cloudinaryConfig");
const redisClient = require("../config/redisConfig");

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

// Get all data
exports.getUserProfile = asyncHandler(async (req, res) => {
  // Define a cache key based on the user ID
  const cacheKey = `userProfile:${req.user._id}`;
  let profile = await redisClient.get(cacheKey);

  if (profile) {
    // If profile data is in cache, parse and return it
    profile = JSON.parse(profile);
  } else {
    // If not cached, fetch from database and cache it
    profile = await User.findById(req.user._id).select("-password").lean();
    if (!profile) {
      throw new NotFoundError("User profile not found");
    }

    // Cache the profile data for 10 minutes
    await redisClient.set(cacheKey, JSON.stringify(profile), "EX", 600);
  }

  res.status(200).json({ success: true, profile });
});

// Get all user data
exports.getUserData = asyncHandler(async (req, res) => {
  // Check if the data is in cache
  const cacheKey = `userData:${req.user._id}`;
  let data = await redisClient.get(cacheKey);

  if (data) {
    // Data is in cache, parse and return it
    data = JSON.parse(data);
  } else {
    // If not in cache, fetch from database and cache it
    data = await Data.find({ userId: req.user._id }).lean();
    if (data && data.length > 0) {
      await redisClient.set(cacheKey, JSON.stringify(data), {
        EX: 600, // Cache for 10 minutes
      });
    }
  }
  // If no data is found, throw a NotFoundError
  if (!data || data.length === 0) {
    throw new NotFoundError("No data found for the user");
  }

  res.status(200).json({ success: true, data });
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
  const aiUsageCacheKey = `aiUsage:${req.user._id}`;

  // Get the user data from cache
  let user = await redisClient.get(aiUsageCacheKey);
  let isFromCache = false;

  if (user) {
    // Parse the user data from cache
    user = JSON.parse(user);
    isFromCache = true;
  } else {
    // If not in cache, fetch from the database
    user = await User.findById(req.user._id);

    // If user is not found, throw a NotFoundError
    if (!user) {
      throw new NotFoundError("User not found");
    }
  }

  // Increment AI usage count
  user.aiUsageCount += 1;

  // If the user data is from cache, update the database directly
  if (isFromCache) {
    await User.findByIdAndUpdate(req.user._id, {
      aiUsageCount: user.aiUsageCount,
    });
  } else {
    // If it's from the database, use the save method
    await user.save();
  }

  // Refresh the cache after updating AI usage
  await redisClient.set(aiUsageCacheKey, JSON.stringify(user), "EX", 600);

  // Example AI response for demonstration purposes
  const aiResponse = "This is the generated AI response";

  res.status(200).json({ success: true, response: aiResponse });
});

// Update User Plan
exports.updateUserPlan = asyncHandler(async (req, res) => {
  const { plan } = req.body; // Expecting 'free', 'student', or 'premium'

  const user = await User.findById(req.user._id);

  // If the user is not found, throw a NotFoundError
  if (!user) {
    throw new NotFoundError("User not found");
  }

  // Validate the plan
  if (!["free", "student", "premium"].includes(plan)) {
    throw new BadRequestError("Invalid plan selected");
  }

  // Update the user's plan and reset the daily token limit
  user.plan = plan;

  if (plan === "free") {
    user.dailyTokenLimit = 5;
    user.tokensLeft = 5;
  } else if (plan === "student") {
    user.dailyTokenLimit = 100;
    user.tokensLeft = 100;
  } else if (plan === "premium") {
    user.dailyTokenLimit = Infinity;
    user.tokensLeft = Infinity;
  }

  await user.save();

  res.status(200).json({
    success: true,
    message: `Plan updated to ${plan} successfully.`,
  });
});

// Upload file
exports.uploadFile = asyncHandler(async (req, res) => {
  // Check if the file was uploaded
  if (!req.file) {
    throw new BadRequestError("No file uploaded");
  }

  // Save file info in the database
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

  const fileCacheKey = `fileData:${newFile._id}`;
  await redisClient.set(fileCacheKey, JSON.stringify(newFile), "EX", 600); // Cache for 10 minutes
  await newFile.save();

  res.status(201).json({ success: true, data: newFile });
});
