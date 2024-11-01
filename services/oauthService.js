// const { OAuth2Client } = require("google-auth-library");
// const passport = require("passport");
// const GoogleStrategy = require("passport-google-oauth20").Strategy;
// const GitHubStrategy = require("passport-github2").Strategy;
const User = require("../models/User");
const { InternalServerError } = require("../utils/customErrors");

// Initialize Google OAuth Client
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Google OAuth Strategy
/*
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/api/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ googleId: profile.id });

        // If the user does not exist, create a new one
        if (!user) {
          user = await User.create({
            username: profile.displayName,
            email: profile.emails[0].value,
            provider: "google",
            googleId: profile.id,
          });
        }

        done(null, user);
      } catch (error) {
        // Use a custom error for unexpected issues during authentication
        done(
          new InternalServerError("An error occurred during Google OAuth"),
          false
        );
      }
    }
  )
);


// GitHub OAuth Strategy
passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: "/api/auth/github/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ githubId: profile.id });

        // If the user does not exist, create a new one
        if (!user) {
          user = await User.create({
            username: profile.username,
            email: profile.emails[0].value,
            provider: "github",
            githubId: profile.id,
          });
        }

        done(null, user);
      } catch (error) {
        // Use a custom error for unexpected issues during authentication
        done(
          new InternalServerError("An error occurred during GitHub OAuth"),
          false
        );
      }
    }
  )
);
*/
module.exports = passport;
