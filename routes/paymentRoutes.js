const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const { createSubscription } = require("../services/stripeService");

const router = express.Router();

// Payment routes
/**
 * @swagger
 * /api/payment/subscribe:
 *   post:
 *     summary: Subscribe to a plan
 *     tags: [Payment]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - plan
 *             properties:
 *               plan:
 *                 type: string
 *                 description: Subscription plan (e.g., student, premium)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Subscription successful
 *       404:
 *         description: User not found
 */
router.post("/subscribe", protect, createSubscription);

module.exports = router;
