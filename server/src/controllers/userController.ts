import db from '../db';
import asyncHandler from 'express-async-handler';
import { Storage } from '../interfaces';
import { BadRequestError } from '../validation/errors';
import * as userService from '../services/userService';

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

export const userStorage = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const usedStorage = await db.getFilesUsedStorage(Number(id));
  const storage: Storage = {
    total: Number(process.env.STORAGE_PER_USER_IN_BYTES!),
    usedStorage,
  };
  res.status(200).json(storage);
});

export const getUserFolderTreeHandler = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!req.user || req.user!.id.toString() !== id)
    throw new BadRequestError('User id not recognized');

  const userId = Number(req.user!.id);
  const folderTree = await userService.getUserFolderTree(userId);

  res.status(200).json(folderTree);
});
