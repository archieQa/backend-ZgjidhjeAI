const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const { createSubscription } = require("../services/stripeService");

const router = express.Router();

// Payment routes
router.post("/subscribe", protect, createSubscription);

module.exports = router;
