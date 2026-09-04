import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import dotenv from "dotenv";


dotenv.config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    
   async (accessToken, refreshToken, profile, done) => {
  const existingGoogleUser = await User.findOne({
    where: {
      google_id: profile.id,
    },
  });

  if (existingGoogleUser) {
    return done(null, existingGoogleUser);
  }

  const existingEmailUser = await User.findOne({
    where: {
      email: profile.emails[0].value,
    },
  });

  if (existingEmailUser) {
    existingEmailUser.google_id = profile.id;
    await existingEmailUser.save();

    return done(null, existingEmailUser);
  }

  const newUser = await User.create({
    user_name: profile.displayName,
    email: profile.emails[0].value,
    google_id: profile.id,
    password: null,
  });

  return done(null, newUser);
}
  ),
);

export default passport;
