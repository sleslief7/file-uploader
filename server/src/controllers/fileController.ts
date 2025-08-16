import db from '../db';
import asyncHandler from 'express-async-handler';
import supabase from '../storage/supabase';
import { User } from '../../generated/prisma';
import {
  validateFileExists,
  validateFilesExist,
  validateFileId,
  validateFileIds,
  validateFolderId,
} from '../validation/validators';
import { BadRequestError } from '../validation/errors';

export const createFiles = asyncHandler(async (req, res) => {
  const user = req.user as User;
  const files = req.files as Express.Multer.File[];

  if (!files || files.length === 0)
    throw new BadRequestError('No files uploaded');

  const bucket = process.env.SUPABASE_BUCKET_NAME || 'uploads';
  const folderId =
    req.params.folderId === 'home' ? null : Number(req.params.folderId);
  const uploaded = [];
  const failed = [];

  for (const file of files) {
    const rawName = file.originalname;
    const sanitizedName = rawName.replace(/[^\w.-]+/g, '');
    const name = `${sanitizedName}`;
    const path = `${user.id}/${folderId ?? 'home'}/${name}`;

    try {
      await supabase.uploadFile(path, file);
    } catch {
      failed.push(name);
      continue; // skip to the next file
    }

    try {
      const prismaFile = await db.createFile({
        name,
        owner: { connect: { id: user.id } },
        mimeType: file.mimetype,
        path,
        bucket,
        size: file.size,
        ...(folderId && {
          folder: { connect: { id: folderId } },
        }),
      });
      uploaded.push(prismaFile);
    } catch (err) {
      console.error(`Failed to save file ${name} to DB:`, err);
      await supabase.deleteFiles([path]);
      throw err;
    }
  }

  res.status(200).json({ uploaded, failed });
});

export const deleteFiles = asyncHandler(async (req, res) => {
  const fileIds = validateFileIds(req.body.fileIds);
  let files = await validateFilesExist(fileIds);

  const filePaths = files.map((f) => f.path);

  await supabase.deleteFiles(filePaths);

  await db.deleteFiles(fileIds);

  res.status(204).send();
});

export const updateFile = asyncHandler(async (req, res) => {
  const { data } = req.body;

  const fileId = validateFileId(req.params.fileId);

  let file = await validateFileExists(fileId);

  file = await db.updateFile(fileId, data);

  res.status(200).json(file);
});

export const renameFile = asyncHandler(async (req, res) => {
  const fileId = validateFileId(req.params.fileId);
  let file = await validateFileExists(fileId);

  const { name } = req.body;

  if (!name) throw new BadRequestError('Invalid name provided');

  const extension = file.name.split('.').at(-1);
  const newNameWithExtension = `${name}.${extension}`;
  const newPath = file.path.replace(file.name, newNameWithExtension);

  await supabase.copyFile(file.path, newPath);

  await supabase.deleteFiles([file.path]);

  file.name = newNameWithExtension;
  file.path = newPath;

  file = await db.updateFile(file.id, file);

  res.status(200).json(file);
});

export const getFileById = asyncHandler(async (req, res) => {
  const fileId = validateFileId(req.params.fileId);

  let file = await validateFileExists(fileId);

  res.status(200).json(file);
});

export const getFiles = asyncHandler(async (req, res) => {
  const folderId = validateFolderId(req.body.folderId);

  const files = await db.getFiles(req.user!.id, folderId);

  res.status(200).json(files);
});

export const getFileUrl = asyncHandler(async (req, res) => {
  const fileId = validateFileId(req.params.fileId);

  let file = await validateFileExists(fileId);

  const signedUrl = await supabase.createSignedUrl(file.path);

  res.status(200).json({ signedUrl });
});
