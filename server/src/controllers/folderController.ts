import db from '../db';
import asyncHandler from 'express-async-handler';

export const createFolder = asyncHandler(async (req, res) => {
  const { name, ownerId } = req.body;
  if (!name || !ownerId) {
    res
      .status(400)
      .json({ status: 'fail', message: 'All fields are required.' });
    return;
  }
  const folder = await db.createFolder(name, ownerId);
  res.status(201).json(folder);
});

export const updateFolder = asyncHandler(async (req, res) => {
  const { data } = req.body;
  const { folderId } = req.params;

  if (!folderId) {
    res
      .status(404)
      .json({ status: 'fail', message: 'Provide folderId to update folder.' });
    return;
  }

  const folder = await db.updateFolder(Number(folderId), data);
  res.status(204).json(folder);
});

export const deleteFolder = asyncHandler(async (req, res) => {
  const { folderId } = req.params;
  if (!folderId) {
    res
      .status(400)
      .json({ status: 'fail', message: 'Provide folderId to delete folder.' });
    return;
  }
  if (!(await db.folderExists(Number(folderId)))) {
    res
      .status(404)
      .json({ status: 'fail', message: 'Folder does not exists.' });
    return;
  }
  const folder = await db.deleteFolder(Number(folderId));
  res.status(204).json(folder);
});

export const getFolderById = asyncHandler(async (req, res) => {
  const { folderId } = req.params;
  const folder = await db.getFolderById(Number(folderId));
  if (!folder) {
    res.status(404).json({ status: 'fail', message: 'Folder not found' });
    return;
  }
  res.status(200).json(folder);
});

export const getAllFolders = asyncHandler(async (req, res) => {
  let parentFolderId;
  if (!req.body?.parentFolderId) {
    parentFolderId = null;
  } else {
    parentFolderId = Number(req.body.parentFolderId);
  }

  let folders;
  if (!parentFolderId) {
    folders = await db.getAllFolders(parentFolderId);
  } else {
    folders = await db.getAllFolders(parentFolderId);
  }
  res.status(200).json(folders);
});
