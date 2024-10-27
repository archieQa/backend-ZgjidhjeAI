const jwt = require("jsonwebtoken");
const User = require("../models/User");
const config = require("../config/index");
const {
  UnauthorizedError,
  NotFoundError,
  InternalServerError,
} = require("../utils/customErrors");

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, config.JWT_SECRET);

      // Find user and exclude the password field
      const user = await User.findById(decoded.id).select("-password");

      // If the user is not found, throw a NotFoundError
      if (!user) {
        throw new NotFoundError("User not found");
      }

      // Attach the user object to the request
      req.user = user;
      next();
    } catch (error) {
      // Handle invalid token or other authorization errors
      if (
        error.name === "JsonWebTokenError" ||
        error.name === "TokenExpiredError"
      ) {
        return next(new UnauthorizedError("Invalid or expired token"));
      } else if (error instanceof NotFoundError) {
        return next(error); // Forward known operational errors
      }

      // Wrap other unexpected errors as InternalServerError
      return next(
        new InternalServerError("An error occurred during authorization")
      );
    }
  }

  // If no token is provided, return UnauthorizedError
  if (!token) {
    return next(new UnauthorizedError("No token provided"));
  }
};

module.exports = { protect };
