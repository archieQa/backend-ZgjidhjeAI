const jwt = require("jsonwebtoken");
const User = require("../models/User");
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

    // Find user and exclude the password field
    const user = await User.findById(decoded.id).select("-password");

    // If the user is not found, throw a NotFoundError
    if (!user) {
      throw new NotFoundError("User not found");
    }

    // Attach the user object to the request
    req.user = user;
    return next();
  }

  // If no token is provided, return UnauthorizedError
  if (!token) {
    throw new UnauthorizedError("No token provided");
  }
});

module.exports = { protect };

module.exports = { protect };
