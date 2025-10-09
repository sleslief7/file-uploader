import asyncHandler from 'express-async-handler';
import { MoveFolderDto } from '../interfaces';
import { BadRequestError } from '../validation/errors';
import {
  validateFolderId,
  validateFolderIds,
  validateNullableFolderId,
} from '../validation/validators';
import * as folderService from '../services/folderService';

export const createFolderHandler = asyncHandler(async (req, res) => {
  const { name } = req.body;
  if (!name) throw new BadRequestError('Folder name is required.');

  const folder = await folderService.createFolder(
    req.user!.id,
    name,
    req.body.parentFolderId
  );

  res.status(201).json(folder);
});

export const updateFolderHandler = asyncHandler(async (req, res) => {
  const { data } = req.body;
  const folderId = validateFolderId(req.params.folderId);
  const folder = await folderService.updateFolder(folderId, data);
  res.status(200).json(folder);
});

export const deleteFoldersHandler = asyncHandler(async (req, res) => {
  const folderIds = validateFolderIds(req.body.folderIds);
  await folderService.deleteFolders(folderIds);
  res.status(204).send();
});

export const getFolderByIdHandler = asyncHandler(async (req, res) => {
  const folderId = validateFolderId(req.params.folderId);
  const folder = await folderService.getFolderById(folderId);
  res.status(200).json(folder);
});

export const getFoldersHandler = asyncHandler(async (req, res) => {
  const parentFolderId = validateNullableFolderId(req.body?.parentFolderId);
  const folders = await folderService.getFolders(req.user!.id, parentFolderId);
  res.status(200).json(folders);
});

export const getBreadCrumbHandler = asyncHandler(async (req, res) => {
  let folderId = validateNullableFolderId(req.params.folderId);
  const breadCrumb = await folderService.getBreadCrumbForFolder(folderId);
  res.status(200).json(breadCrumb);
});
