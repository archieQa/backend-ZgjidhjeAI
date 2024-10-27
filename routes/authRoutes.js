const express = require("express");
const passport = require("../services/oauthService");
const { registerUser, loginUser } = require("../controllers/authController");
const { InternalServerError } = require("../utils/customErrors");

const router = express.Router();

// Local authentication routes
router.post("/register", registerUser);
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
