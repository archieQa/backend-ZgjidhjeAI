const { createClient } = require("redis");
const config = require("./index"); // Use your environment config loader

// Initialize Redis client
const client = createClient({
  url: `redis://${config.REDIS_HOST || "127.0.0.1"}:${
    config.REDIS_PORT || 6379
  }`,
  password: config.REDIS_PASSWORD || null, // Optional if your Redis is password-protected
});

client.on("error", (err) => {
  console.error("Redis error:", err);
});

// Connect to Redis
(async () => {
  try {
    await client.connect();
    console.log("Connected to Redis successfully");
  } catch (err) {
    console.error("Failed to connect to Redis:", err);
  }
})();

module.exports = client;
