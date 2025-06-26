import passport from 'passport';
import bcrypt from 'bcrypt';
import { Strategy as LocalStrategy } from 'passport-local';
import db from '../../db/index';

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await db.getUserByUsername(username);
      if (!user) {
        return done(null, false, { message: 'No user with that username' });
      }

      const match = await bcrypt.compare(password, user.password!);
      if (!match) {
        return done(null, false, { message: 'Password incorrect' });
      }

      user.password = null;

      return done(null, user);
    } catch (err) {
      console.log(err);
      return done(err);
    }
  })
);
