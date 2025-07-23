import db from '../db';
import asyncHandler from 'express-async-handler';
import { Breadcrumb } from '../interfaces';

export const createFolder = asyncHandler(async (req, res) => {
  const { name } = req.body;
  if (!name) {
    res
      .status(400)
      .json({ status: 'fail', message: 'Folder name is required.' });
    return;
  }
  const folder = await db.createFolder({
    name,
    owner: { connect: { id: req.user?.id } },
    ...(req.body.parentFolderId && {
      parentFolder: { connect: { id: Number(req.body.parentFolderId) } },
    }),
  });
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

export const getFoldersAndFilesByParentFolderId = asyncHandler(
  async (req, res) => {
    const folderId = Number(req.params.folderId);
    const folders = await db.getAllFolders(folderId);
    const files = await db.getAllFiles(folderId);

    res.status(200).json({ folders, files });
  }
);

export const getBreadCrumb = asyncHandler(async (req, res) => {
  let folderId: number | undefined | null = Number(req.params.folderId);
  const breadCrumb: Breadcrumb = [];
  let position = breadCrumb.length;

  while (folderId) {
    const folder = await db.getFolderById(folderId);
    breadCrumb.unshift({
      folderName: folder?.name,
      folderId: folder?.id,
      position: position++,
    });
    folderId = folder?.parentFolderId;
  }

  res.status(200).json(breadCrumb);
});
