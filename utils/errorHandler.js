const { AppError } = require("../utils/customErrors");
const Sentry = require("@sentry/node");
const logger = require("../utils/logger");

const errorHandler = (err, req, res, next) => {
  const isOperational = err.isOperational || false;
  const statusCode = err.statusCode || 500;

  // Log the error
  logger.error(err.message, { stack: err.stack });
  Sentry.captureException(err);

  // Send a structured error response
  res.status(statusCode).json({
    success: false,
    error: {
      message: isOperational ? err.message : "An unexpected error occurred",
      type: err.name,
      code: statusCode,
    },
    // Hide stack trace in production for operational errors
    stack:
      process.env.NODE_ENV === "production" && isOperational ? null : err.stack,
  });
};

module.exports = errorHandler;
