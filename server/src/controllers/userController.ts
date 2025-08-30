import db from '../db';
import asyncHandler from 'express-async-handler';
import { FolderTree, Storage } from '../interfaces';
import { BadRequestError } from '../validation/errors';

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

export const getFolderTree = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!req.user || req.user!.id.toString() !== id)
    throw new BadRequestError('User id not recognized');

  const userId = Number(req.user!.id);

  const trees: FolderTree[] = [];
  const directChildrenOfRoot = await db.getFolders(userId, null);

  for (const directChildOfRoot of directChildrenOfRoot) {
    const tree = await db.getFolderWithNestedItems(directChildOfRoot.id);
    trees.push(tree);
  }

  res.status(200).json(trees);
});
