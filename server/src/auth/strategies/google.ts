import 'dotenv/config';
import passport from 'passport';
import db from '../../db/index';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: `${process.env.API_URL}/api/login/google/callback`,
    },
    async function (_, __, profile, cb) {
      try {
        const user = await db.findOrCreateGoogleUser(profile);
        return cb(null, user);
      } catch (err) {
        return cb(err, undefined);
      }
    }
  )
);
