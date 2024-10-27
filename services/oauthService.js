const { OAuth2Client } = require("google-auth-library");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const GitHubStrategy = require("passport-github2").Strategy;
const User = require("../models/User");
const config = require("../config/index");

// Initialize Google OAuth Client
const googleClient = new OAuth2Client(config.GOOGLE_CLIENT_ID);

// Google OAuth Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: config.GOOGLE_CLIENT_ID,
      clientSecret: config.GOOGLE_CLIENT_SECRET,
      callbackURL: "/api/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ googleId: profile.id });
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
        done(error, false);
      }
    }
  )
);

// GitHub OAuth Strategy
passport.use(
  new GitHubStrategy(
    {
      clientID: config.GITHUB_CLIENT_ID,
      clientSecret: config.GITHUB_CLIENT_SECRET,
      callbackURL: "/api/auth/github/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ githubId: profile.id });
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
        done(error, false);
      }
    }
  )
);

module.exports = passport;
