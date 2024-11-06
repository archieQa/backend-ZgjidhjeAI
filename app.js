require("./config/instrument");
const express = require("express");
const cors = require("cors"); // Import CORS
const dotenv = require("dotenv");
const connectDB = require("./config/config");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const tutorRoutes = require("./routes/tutorRoutes");
const errorHandler = require("./utils/errorHandler");
const paymentRoutes = require("./routes/paymentRoutes");
const apiLimiter = require("./middleware/rateLimiter");
const logger = require("./utils/logger");
const Sentry = require("@sentry/node");
const swaggerUi = require("swagger-ui-express");
const swaggerDocs = require("./config/swaggerConfig");
const helmet = require("helmet");
// Initialize Express
const app = express();

app.use(cors({ origin: "http://localhost:5173" })); // Allow requests from frontend

app.use(express.json());

app.use(helmet()); // Add security headers
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "https://trusted-cdn.com"], // Allow scripts only from trusted sources
      styleSrc: ["'self'", "https://trusted-cdn.com"],
      imgSrc: ["'self'", "data:", "https://trusted-cdn.com"], // Allow images from trusted sources
    },
  })
);
// Apply rate limiting to all routes
app.use(apiLimiter);

// Connect to MongoDB
connectDB();

// Routes
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use("/api/auth", authRoutes);
app.use("/api/tutors", tutorRoutes);
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
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
