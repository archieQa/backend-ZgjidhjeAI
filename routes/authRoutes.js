const express = require("express");
const passport = require("../services/oauthService");
const { registerUser, loginUser } = require("../controllers/authController");
const { InternalServerError } = require("../utils/customErrors");
const { body } = require("express-validator");
const validateRequest = require("../middleware/validateRequest");
const router = express.Router();

// Local authentication routes

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Bad request
 */
router.post(
  "/register",
  [
    // Username validation: 3-20 characters, alphanumeric, trimmed
    body("username")
      .trim()
      .isLength({ min: 3, max: 20 })
      .withMessage("Username must be between 3 and 20 characters")
      .isAlphanumeric()
      .withMessage("Username can only contain letters and numbers"),

    // Email validation: must be a valid email, sanitized
    body("email")
      .isEmail()
      .withMessage("Invalid email address")
      .normalizeEmail(), // Normalizes email (e.g., removes dots from Gmail)

    // Password validation: 8-30 characters, must include uppercase, lowercase, number, and symbol
    body("password")
      .isLength({ min: 8, max: 30 })
      .withMessage("Password must be between 8 and 30 characters")
      .matches(/[A-Z]/)
      .withMessage("Password must contain at least one uppercase letter")
      .matches(/[a-z]/)
      .withMessage("Password must contain at least one lowercase letter")
      .matches(/\d/)
      .withMessage("Password must contain at least one number")
      .matches(/[\W_]/)
      .withMessage("Password must contain at least one special character"),

    // Additional sanitization
    body("username").escape(), // Escape any HTML characters
    body("email").escape(),
    body("password").escape(),
  ],
  validateRequest([
    body("username")
      .trim()
      .isLength({ min: 3, max: 20 })
      .withMessage("Username must be between 3 and 20 characters")
      .isAlphanumeric()
      .withMessage("Username can only contain letters and numbers"),
    body("email")
      .isEmail()
      .withMessage("Invalid email address")
      .normalizeEmail(),
    body("password")
      .isLength({ min: 8, max: 30 })
      .withMessage("Password must be between 8 and 30 characters")
      .matches(/[A-Z]/)
      .withMessage("Password must contain at least one uppercase letter")
      .matches(/[a-z]/)
      .withMessage("Password must contain at least one lowercase letter")
      .matches(/\d/)
      .withMessage("Password must contain at least one number")
      .matches(/[\W_]/)
      .withMessage("Password must contain at least one special character"),
    body("username").escape(),
    body("email").escape(),
    body("password").escape(),
  ]),
  registerUser
);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login an existing user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User logged in successfully
 *       401:
 *         description: Invalid credentials
 */
router.post("/login", loginUser);

// Google OAuth routes
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "/",
  }),
  (req, res, next) => {
    try {
      // Send token to client after successful authentication
      res.json({ success: true, token: generateToken(req.user._id) });
    } catch (error) {
      // Wrap unexpected errors as InternalServerError
      next(
        new InternalServerError(
          "An error occurred during Google authentication"
        )
      );
    }
  }
);

// GitHub OAuth routes
router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] })
);

router.get(
  "/github/callback",
  passport.authenticate("github", {
    session: false,
    failureRedirect: "/",
  }),
  (req, res, next) => {
    try {
      // Send token to client after successful authentication
      res.json({ success: true, token: generateToken(req.user._id) });
    } catch (error) {
      // Wrap unexpected errors as InternalServerError
      next(
        new InternalServerError(
          "An error occurred during GitHub authentication"
        )
      );
    }
  }
);

module.exports = router;
