const User = require("../models/User");
const {
  NotFoundError,
  InternalServerError,
  BadRequestError,
} = require("../utils/customErrors");
const asyncHandler = require("../middleware/asyncHandler");

// Middleware to check AI usage limit based on user's plan
const checkAiUsageLimit = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id);

  // If user is not found, throw a NotFoundError
  if (!user) {
    throw new NotFoundError("User not found");
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
    throw new BadRequestError(
      "Daily token limit has been reached. Please try again tomorrow or upgrade your plan."
    );
  }

  // Deduct one token if not on the Premium Plan
  if (user.plan !== "premium") {
    user.tokensLeft -= 1;
    await user.save();
  }

  // Proceed to the next middleware or route handler
  next();
});

module.exports = { checkAiUsageLimit };
module.exports = { checkAiUsageLimit };
