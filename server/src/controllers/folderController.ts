import db from '../db';
import asyncHandler from 'express-async-handler';
import { Breadcrumb, FolderTree, MoveFolderDto } from '../interfaces';
import { BadRequestError } from '../validation/errors';
import {
  validateFolderExists,
  validateFoldersExist,
  validateFolderId,
  validateFolderIds,
  validateNullableFolderId,
} from '../validation/validators';
import {
  createFolder,
  deleteFolders,
  getFolderById,
  updateFolder,
  cloneFolders,
  moveFolders,
  getFolders,
  getBreadCrumbForFolder,
} from '../services/folderService';

export const createFolderHandler = asyncHandler(async (req, res) => {
  const { name } = req.body;
  if (!name) throw new BadRequestError('Folder name is required.');

  const folder = await createFolder(
    req.user!.id,
    name,
    req.body.parentFolderId
  );

  res.status(201).json(folder);
});

export const updateFolderHandler = asyncHandler(async (req, res) => {
  const { data } = req.body;
  const folderId = validateFolderId(req.params.folderId);
  const folder = await updateFolder(folderId, data);
  res.status(200).json(folder);
});

export const deleteFoldersHandler = asyncHandler(async (req, res) => {
  const folderIds = validateFolderIds(req.body.folderIds);
  await deleteFolders(folderIds);
  res.status(204).send();
});

export const getFolderByIdHandler = asyncHandler(async (req, res) => {
  const folderId = validateFolderId(req.params.folderId);
  const folder = await getFolderById(folderId);
  res.status(200).json(folder);
});

export const getFoldersHandler = asyncHandler(async (req, res) => {
  const parentFolderId = validateNullableFolderId(req.body?.parentFolderId);
  const folders = await getFolders(req.user!.id, parentFolderId);
  res.status(200).json(folders);
});

export const getBreadCrumbHandler = asyncHandler(async (req, res) => {
  let folderId = validateNullableFolderId(req.params.folderId);
  const breadCrumb = await getBreadCrumbForFolder(folderId);
  res.status(200).json(breadCrumb);
});

export const moveFoldersHandler = asyncHandler(async (req, res) => {
  const moveFolderDtos = req.body.moveFolderDtos as MoveFolderDto[];
  await moveFolders(moveFolderDtos);
  res.status(200).send();
});

export const cloneFoldersHandler = asyncHandler(async (req, res) => {
  const folderIds = validateFolderIds(req.body.folderIds);
  await cloneFolders(folderIds);
  res.status(200).send();
});
