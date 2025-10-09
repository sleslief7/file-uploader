import db from '../db';
import asyncHandler from 'express-async-handler';
import { Storage } from '../interfaces';
import { BadRequestError } from '../validation/errors';
import * as userService from '../services/userService';
import { validateUserId } from '../validation/validators';

export const getUserById = asyncHandler(async (req, res) => {
  const id = validateUserId(req.params.id);
  const user = await db.getUserById(id);
  if (!user) {
    res
      .status(400)
      .json({ status: 'fail', message: 'There is no user with that id.' });
    return;
  }
  res.status(200).json(user);
});

export const updateUserHandler = asyncHandler(async (req, res) => {
  const id = validateUserId(req.params.id);
  const name = req.body.name;
  const profileImage = req.file as Express.Multer.File;

  const updatedUser = await userService.updateUser(id, profileImage, name);
  res.status(201).json(updatedUser);
});

export const userStorage = asyncHandler(async (req, res) => {
  const id = validateUserId(req.params.id);
  const usedStorage = await db.getFilesUsedStorage(id);
  const storage: Storage = {
    total: Number(process.env.STORAGE_PER_USER_IN_BYTES!),
    usedStorage,
  };
  res.status(200).json(storage);
});

export const getUserFolderTreeHandler = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const body = req.body as GetUserFolderTreeHandlerBody;

  const includeParentFolder = Boolean(
    body?.fileIds?.length && body?.folderIds?.length
  );

  if (!req.user || req.user!.id.toString() !== id)
    throw new BadRequestError('User id not recognized');

  const userId = Number(req.user!.id);
  const folderTreeItems = await userService.getUserFolderTree(
    userId,
    body?.parentFolderId,
    includeParentFolder,
    body?.folderIds,
    body?.fileIds,
    body?.includeUrls
  );

  const response =
    folderTreeItems.length === 1 ? folderTreeItems[0] : folderTreeItems;
  res.status(200).json(response);
});

type GetUserFolderTreeHandlerBody =
  | {
      fileIds?: number[];
      folderIds?: number[];
      parentFolderId?: number | null;
      includeUrls?: boolean;
    }
  | null
  | undefined;
