const User = require("../models/User");

// Middleware to check AI usage limit based on user's plan
const checkAiUsageLimit = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Check if 24 hours have passed since the last reset
    const now = new Date();
    const hoursSinceLastReset = Math.abs(now - user.lastReset) / 36e5;

    if (hoursSinceLastReset >= 24) {
      // Reset tokens based on the plan and update last reset timestamp
      if (user.plan === "free") {
        user.dailyTokenLimit = 5;
      } else if (user.plan === "student") {
        user.dailyTokenLimit = 100;
      } else if (user.plan === "premium") {
        user.dailyTokenLimit = Infinity; // Unlimited tokens
      }

      user.tokensLeft = user.dailyTokenLimit;
      user.lastReset = now;
      await user.save();
    }

    // Check if user has tokens left (not for Premium Plan)
    if (user.plan !== "premium" && user.tokensLeft <= 0) {
      return res.status(403).json({
        success: false,
        message:
          "Daily token limit has been reached. Please try again tomorrow or upgrade your plan.",
      });
    }

    // Deduct one token if not on the Premium Plan
    if (user.plan !== "premium") {
      user.tokensLeft -= 1;
      await user.save();
    }

    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { checkAiUsageLimit };
