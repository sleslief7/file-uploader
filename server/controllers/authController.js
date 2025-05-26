const db = require('../db');
const bcrypt = require('bcrypt');
const asyncHandler = require('express-async-handler');
const passport = require('passport');

exports.signUp = asyncHandler(async (req, res) => {
  const { name, username, password } = req.body;
  if (!name || !username || !password) {
    return res
      .status(400)
      .json({ status: 'fail', message: 'All fields are required.' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  await db.createUser({ name, username, password: hashedPassword });

  res.status(201).json({ message: 'Successfully signed up' });
});

exports.logIn = (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
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

exports.ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) return next();
  res.status(401).json({ status: 'fail', message: 'Unauthorized' });
};

exports.logOut = (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);

    req.session.destroy((err) => {
      if (err) return next(err);
      res.clearCookie('connect.sid');
      res.status(200).json({ message: 'Logged out' });
    });
  });
};
