import db from '../db';
import asyncHandler from 'express-async-handler';

export const getUserById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = await db.getUserById(Number(id));
  if (!user) {
    res
      .status(400)
      .json({ status: 'fail', message: 'There is no user with that id.' });
    return;
  }
  res.status(200).json(user);
});

export const updateUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { data } = req.body;
  const user = req.user;
  if (!user) {
    res
      .status(400)
      .json({ status: 'fail', message: 'There is no user with that id.' });
    return;
  }
  const updatedUser = await db.updateUser(Number(id), data, true);
  res.status(201).json(updatedUser);
});
