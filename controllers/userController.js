const Data = require("../models/Data");
const User = require("../models/User");
const path = require("path");
const {
  BadRequestError,
  InternalServerError,
  NotFoundError,
} = require("../utils/customErrors");

// Create new data (picture or AI answer)
exports.createData = async (req, res, next) => {
  const { type, content } = req.body;

  try {
    // Validate user input
    if (!type || !content) {
      throw new BadRequestError("Type and content are required");
    }

    const newData = new Data({
      userId: req.user._id,
      type,
      content,
    });

    await newData.save();

    res.status(201).json({ success: true, data: newData });
  } catch (error) {
    if (error.name === "ValidationError") {
      // Handle Mongoose validation errors
      return next(new BadRequestError(error.message));
    }

    // Wrap other unexpected errors as InternalServerError
    return next(
      new InternalServerError("An error occurred while creating data")
    );
  }
};

// Get all user data
exports.getUserData = async (req, res, next) => {
  try {
    const data = await Data.find({ userId: req.user._id });

    // If no data is found, throw a NotFoundError
    if (!data || data.length === 0) {
      throw new NotFoundError("No data found for the user");
    }

    res.status(200).json({ success: true, data });
  } catch (error) {
    if (error instanceof NotFoundError) {
      return next(error); // Known operational error
    }

    // Wrap other unexpected errors as InternalServerError
    return next(
      new InternalServerError("An error occurred while retrieving user data")
    );
  }
};

// Update data
exports.updateData = async (req, res, next) => {
  const { id } = req.params;
  const { content } = req.body;

  try {
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
  } catch (error) {
    if (error instanceof BadRequestError || error instanceof NotFoundError) {
      return next(error); // Known operational errors
    }

    // Wrap other unexpected errors as InternalServerError
    return next(
      new InternalServerError("An error occurred while updating data")
    );
  }
};

// Delete data
exports.deleteData = async (req, res, next) => {
  const { id } = req.params;

  try {
    const data = await Data.findOneAndDelete({ _id: id, userId: req.user._id });

    // If the data is not found, throw a NotFoundError
    if (!data) {
      throw new NotFoundError("Data not found");
    }

    res.status(200).json({ success: true, message: "Data deleted" });
  } catch (error) {
    if (error instanceof NotFoundError) {
      return next(error); // Forward known operational errors
    }

    // Wrap other unexpected errors as InternalServerError
    return next(
      new InternalServerError("An error occurred while deleting data")
    );
  }
};

// Use AI service
exports.useAiService = async (req, res, next) => {
  try {
    // Perform the AI service operation (e.g., generate AI response)
    const aiResponse = "This is the generated AI response"; // Example response

    // Find the user and increment AI usage count
    const user = await User.findById(req.user._id);

    // If user is not found, throw a NotFoundError
    if (!user) {
      throw new NotFoundError("User not found");
    }

    user.aiUsageCount += 1;
    await user.save();

    res.status(200).json({ success: true, response: aiResponse });
  } catch (error) {
    if (error instanceof NotFoundError) {
      return next(error); // Forward known operational errors
    }

    // Wrap other unexpected errors as InternalServerError
    return next(
      new InternalServerError("An error occurred while using AI service")
    );
  }
};

// Update User Plan
exports.updateUserPlan = async (req, res, next) => {
  const { plan } = req.body; // Expecting 'free', 'student', or 'premium'

  try {
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
  } catch (error) {
    if (error instanceof BadRequestError || error instanceof NotFoundError) {
      return next(error); // Forward known operational errors
    }

    // Wrap other unexpected errors as InternalServerError
    return next(
      new InternalServerError("An error occurred while updating user plan")
    );
  }
};

// Upload file
exports.uploadFile = async (req, res, next) => {
  try {
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
      },
    });

    await newFile.save();

    res.status(201).json({ success: true, data: newFile });
  } catch (error) {
    if (error instanceof BadRequestError) {
      return next(error); // Forward known operational errors
    }

    // Wrap other unexpected errors as InternalServerError
    return next(
      new InternalServerError("An error occurred while uploading the file")
    );
  }
};
