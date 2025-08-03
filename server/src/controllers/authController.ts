import 'dotenv/config';
import db from '../db';
import bcrypt from 'bcrypt';
import { RequestHandler } from 'express';
import asyncHandler from 'express-async-handler';
import passport from 'passport';

export const signUp = asyncHandler(async (req, res) => {
  const { name, username, password } = req.body;
  if (!name || !username || !password) {
    res
      .status(400)
      .json({ status: 'fail', message: 'All fields are required.' });
    return;
  }

  if (await db.userExists(username)) {
    res.status(400).json({ status: 'fail', message: 'User already exists' });
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  await db.createUser({ name, username, password: hashedPassword });

  res.status(201).json({ message: 'Successfully signed up' });
});

export const logIn: RequestHandler = (req, res, next) => {
  passport.authenticate('local', (err: any, user: any, info: any) => {
    if (err) return next(err);

    if (!user) {
      return res.status(401).json({ message: info?.message || 'Login failed' });
    }

    req.logIn(user, function (err) {
      if (err) return next(err);
      return res.json({ message: 'Login successful', user });
    });
  })(req, res, next);
};

export const ensureAuthenticated: RequestHandler = (req, res, next) => {
  if (req.isAuthenticated()) return next();
  res.status(401).json({ status: 'fail', message: 'Unauthorized' });
};

export const logOut: RequestHandler = (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);

    req.session.destroy((err) => {
      if (err) return next(err);
      res.clearCookie('connect.sid');
      res.status(200).json({ message: 'Logged out' });
    });
  });
};

export const checkAuthStatus: RequestHandler = async (req, res) => {
  const isAuth = req.isAuthenticated();
  const user = isAuth ? req.user : null;

  res.status(200).json({ isAuth, user });
};

export const googleLogin = asyncHandler(async (req, res, next) => {
  passport.authenticate('google', { scope: ['profile', 'email'] })(
    req,
    res,
    next
  );
});

export const googleLoginCallback = asyncHandler(async (req, res, next) => {
  passport.authenticate(
    'google',
    (err: any, user: Express.User | false, info: { message?: string }) => {
      if (err) return next(err);

      if (!user) {
        return res
          .status(401)
          .json({ message: info?.message || 'Login failed' });
      }

      req.logIn(user, function (err) {
        if (err) return next(err);

        res.redirect(`${process.env.CLIENT_URL}/`);
      });
    }
  )(req, res, next);
});
