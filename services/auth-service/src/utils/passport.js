import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import dotenv from "dotenv";

dotenv.config();



passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL:process.env.GOOGLE_CALLBACK_URL
    },
    (_, __, profile, done) => {
      console.log(profile);
      
      return done(null, profile);
    },
  ),
);

export default passport;
