import asyncHandler from 'express-async-handler';
import { User } from '../../generated/prisma';
import {
  validateFileId,
  validateFileIds,
  validateFolderId,
  validateNullableFolderId,
} from '../validation/validators';
import { MoveFileDto } from '../interfaces';
import * as fileService from '../services/fileService';

export const createFilesHandler = asyncHandler(async (req, res) => {
  const user = req.user as User;
  const files = req.files as Express.Multer.File[];
  const folderId = validateNullableFolderId(req.params.folderId);
  const { uploaded, failed } = await fileService.createFiles(
    user,
    files,
    folderId
  );
  res.status(200).json({ uploaded, failed });
});

import { deleteFiles } from '../services/fileService';

export const deleteFilesHandler = asyncHandler(async (req, res) => {
  const fileIds = validateFileIds(req.body.fileIds);
  await deleteFiles(fileIds);
  res.status(204).send();
});

export const updateFileHandler = asyncHandler(async (req, res) => {
  const { data } = req.body;
  const fileId = validateFileId(req.params.fileId);

  const file = await fileService.updateFile(fileId, data);

  res.status(200).json(file);
});

export const renameFileHandler = asyncHandler(async (req, res) => {
  const fileId = validateFileId(req.params.fileId);
  const { name } = req.body;

  const file = await fileService.renameFile(fileId, name);

  res.status(200).json(file);
});

export const getFileByIdHandler = asyncHandler(async (req, res) => {
  const fileId = validateFileId(req.params.fileId);

  const file = await fileService.getFileById(fileId);

  res.status(200).json(file);
});

export const getFilesHandler = asyncHandler(async (req, res) => {
  const folderId = validateFolderId(req.body.folderId);

  const files = await fileService.getFiles(req.user!.id, folderId);

  res.status(200).json(files);
});

export const getFileUrlHandler = asyncHandler(async (req, res) => {
  const fileId = validateFileId(req.params.fileId);

  const signedUrl = await fileService.getFileUrl(fileId);

  res.status(200).json({ signedUrl });
});

export const cloneFilesHandler = asyncHandler(async (req, res) => {
  const fileIds = validateFileIds(req.body.fileIds);

  const clonedFiles = await fileService.cloneFiles(fileIds);

  res.status(200).json(clonedFiles);
});

export const moveFilesHandler = async (moveFileDtos: MoveFileDto[]) => {
  await fileService.moveFiles(moveFileDtos);
};
