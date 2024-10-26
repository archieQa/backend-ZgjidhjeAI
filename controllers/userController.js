const Data = require("../models/Data");
const User = require("../models/User");
const path = require("path");

// Create new data (picture or AI answer)
exports.createData = async (req, res) => {
  const { type, content } = req.body;

  try {
    const newData = new Data({
      userId: req.user._id,
      type,
      content,
    });
    await newData.save();
    res.status(201).json({ success: true, data: newData });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Get all user data
exports.getUserData = async (req, res) => {
  try {
    const data = await Data.find({ userId: req.user._id });
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Update data
exports.updateData = async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;

  try {
    const data = await Data.findOneAndUpdate(
      { _id: id, userId: req.user._id },
      { content },
      { new: true }
    );
    if (!data) {
      return res
        .status(404)
        .json({ success: false, message: "Data not found" });
    }
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Delete data
exports.deleteData = async (req, res) => {
  const { id } = req.params;

  try {
    const data = await Data.findOneAndDelete({ _id: id, userId: req.user._id });
    if (!data) {
      return res
        .status(404)
        .json({ success: false, message: "Data not found" });
    }
    res.status(200).json({ success: true, message: "Data deleted" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.useAiService = async (req, res) => {
  try {
    // Perform the AI service operation (e.g., generate AI response)
    const aiResponse = "This is the generated AI response"; // Example response

    // Increment AI usage count
    const user = await User.findById(req.user._id);
    user.aiUsageCount += 1;
    await user.save();

    res.status(200).json({ success: true, response: aiResponse });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update User Plan
exports.updateUserPlan = async (req, res) => {
  const { plan } = req.body; // Expecting 'free', 'student', or 'premium'

  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Update the user's plan and reset the daily token limit
    if (["free", "student", "premium"].includes(plan)) {
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
    } else {
      res
        .status(400)
        .json({ success: false, message: "Invalid plan selected." });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Upload file
exports.uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "No file uploaded" });
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
    res.status(500).json({ success: false, message: error.message });
  }
};
