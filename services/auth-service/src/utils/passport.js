import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import dotenv from "dotenv";

dotenv.config();

const clientID = process.env.GOOGLE_CLIENT_ID || "not-configured";
const clientSecret = process.env.GOOGLE_CLIENT_SECRET || "not-configured";
const callbackURL = process.env.GOOGLE_CALLBACK_URL || "http://localhost:3001/api/auth/google/callback";

passport.use(
  new GoogleStrategy(
    {
      clientID,
      clientSecret,
      callbackURL,
    },
    (_, __, profile, done) => {
      if (clientID === "not-configured") {
        return done(new Error("Google OAuth credentials are not configured"));
      }
      return done(null, profile);
    },
  ),
);

export default passport;
