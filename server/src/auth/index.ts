import passport from 'passport';
import './strategies/local';
import './strategies/google';
import db from '../db';
import { User as PrismaUser } from '../../generated/prisma';

declare global {
  namespace Express {
    interface User extends PrismaUser {}
  }
}

passport.serializeUser((user, done) => done(null, user.id));

passport.deserializeUser(async (userId: number, done) => {
  try {
    const user = await db.getUserById(userId, true);
    return done(null, user);
  } catch (err) {
    return done(err);
  }
});

export default passport;
