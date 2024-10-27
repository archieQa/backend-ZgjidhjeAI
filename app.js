require("./config/instrument");
const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/config");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const errorHandler = require("./utils/errorHandler");
const paymentRoutes = require("./routes/paymentRoutes");
const config = require("./config/index");
const apiLimiter = require("./middleware/rateLimiter");
const logger = require("./utils/logger");
const Sentry = require("@sentry/node");

// Initialize Express
const app = express();
app.use(express.json());

// Apply rate limiting to all routes
app.use(apiLimiter);

// Connect to MongoDB
connectDB();

app.get("/debug-sentry", function mainHandler(req, res) {
  throw new Error("My first Sentry error!");
});

app.get("/manual-error", (req, res) => {
  try {
    // Simulate some code that can fail
    if (Math.random() < 0.5) {
      throw new Error("Simulated random error!");
    } else {
      JSON.parse("This is not JSON");
    }
  } catch (err) {
    logger.error("Manual error triggered", { error: err });
    Sentry.captureException(err); // Capture manually with Sentry
    res.status(500).json({ success: false, message: "Manual error occurred" });
  }
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/payment", paymentRoutes);

// Sentry request handler
Sentry.setupExpressErrorHandler(app);

// Error handler with logging
app.use((err, req, res, next) => {
  logger.error(err.message, { stack: err.stack });
  next(err);
});
// Custom error handler
app.use(errorHandler);

// Start the server
const PORT = config.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
