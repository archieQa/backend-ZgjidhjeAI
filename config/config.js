const mongoose = require("mongoose");
const config = require("./index");

const connectDB = async (retries = 5, delay = 3000) => {
  try {
    await mongoose.connect(config.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      maxPoolSize: 10, // Max number of connections in the connection pool
    });
    console.log("MongoDB connected successfully");
  } catch (error) {
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
