import passport from 'passport';
import './strategies/local';
import db from '../db';

passport.serializeUser((userId, done) => done(null, userId));

passport.deserializeUser(async (userId: number, done) => {
  try {
    const user = await db.getUserById(userId);
    return done(null, user);
  } catch (err) {
    return done(err);
  }
});

export default passport;
