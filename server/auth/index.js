import passport from 'passport';
import './strategies/local';
import db from '../db';

passport.serializeUser((user, done) => done(null, user.id));

passport.deserializeUser(async (id, done) => {
  try {
    const user = await db.getUserById(id);
    return done(null, user);
  } catch (err) {
    return done(err);
  }
});

export default passport;
