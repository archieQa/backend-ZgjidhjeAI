const mongoose = require("mongoose");
require("dotenv").config();
const connectDB = async (retries = 5, delay = 3000) => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      maxPoolSize: 10, // Max number of connections in the connection pool
    });
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    console.error(`Stack trace: ${error.stack}`);
    if (retries === 0) {
      console.error("MongoDB connection failed:", error.message);
      process.exit(1);
    } else {
      console.warn(
        `MongoDB connection failed. Retrying in ${delay / 1000} seconds...`
      );
      setTimeout(() => {
        connectDB(retries - 1, delay * 2);
      }, delay);
    }
  }
};

module.exports = connectDB;
