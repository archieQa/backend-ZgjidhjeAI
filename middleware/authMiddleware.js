const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Tutor = require("../models/Tutor"); // Import Tutor model
const { UnauthorizedError, NotFoundError } = require("../utils/customErrors");
const asyncHandler = require("./asyncHandler");

const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Try to find the authenticated user first
    let user = await User.findById(decoded.id).select("-password");

    // If not found, try to find the authenticated tutor
    if (!user) {
      user = await Tutor.findById(decoded.id).select("-password");
      if (!user) {
        throw new NotFoundError("Authenticated user or tutor not found");
      }
      req.userType = "tutor"; // Mark the request as coming from a tutor
    } else {
      req.userType = "user"; // Mark the request as coming from a regular user
    }

    // Attach the user or tutor object to the request
    req.user = user;
    return next();
  }

  // If no token is provided, throw an UnauthorizedError
  if (!token) {
    throw new UnauthorizedError("No token provided");
  }
});

module.exports = { protect };
