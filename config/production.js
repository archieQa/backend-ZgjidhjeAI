// production.js
module.exports = {
  MONGO_URI: process.env.MONGO_URI_PRODUCTION,
  JWT_SECRET: process.env.JWT_SECRET_PRODUCTION,
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY_PRODUCTION,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID_PRODUCTION,
  GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID_PRODUCTION,
  SENTRY_DSN: process.env.SENTRY_DSN,
  NODE_ENV: "production",
  PORT: process.env.PORT || 80,
};
