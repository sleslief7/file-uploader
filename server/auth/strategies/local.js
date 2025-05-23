const passport = require('passport');
import db from '../../db';
const bcrypt = require('bcrypt');
const LocalStrategy = require('passport-local').Strategy;

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await db.getUserByUsername(username);
      if (!user) {
        return done(null, false, { message: 'No user with that username' });
      }

      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return done(null, false, { message: 'Password incorrect' });
      }

      user.password = undefined;

      return done(null, user);
    } catch (err) {
      console.log(err);
      return done(err);
    }
  })
);
