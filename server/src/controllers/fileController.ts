import db from '../db';
import asyncHandler from 'express-async-handler';
import { supabase } from '../lib/supabase';
import { User } from '../../generated/prisma';
import { validateFileExists, validateFileId } from '../validation/validators';
import { BadRequestError } from '../validation/errors';

export const createFiles = asyncHandler(async (req, res) => {
  const user = req.user as User;
  const files = req.files as Express.Multer.File[];

  if (!files || files.length === 0)
    throw new BadRequestError('No files uploaded');

  const bucket = 'uploads';
  const folderId =
    req.params.folderId === 'home' ? null : Number(req.params.folderId);
  const uploaded = [];
  const failed = [];

  for (const file of files) {
    const rawName = file.originalname;
    const sanitizedName = rawName.replace(/[^\w.-]+/g, '');
    const name = `${sanitizedName}`;
    const path = `${user.id}/${folderId ?? 'home'}/${name}`;

    const { error } = await supabase.storage
      .from(bucket)
      .upload(path, file.buffer, { contentType: file.mimetype });

    if (error) {
      console.error(`Failed to upload file ${rawName}:`, error.message);
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
      await supabase.storage.from(bucket).remove([path]);
      throw err;
    }
  }

  res.status(200).json({ uploaded, failed });
});

export const deleteFile = asyncHandler(async (req, res) => {
  const fileId = validateFileId(req.params.fileId);
  let file = await validateFileExists(fileId);

  const { error } = await supabase.storage
    .from(file.bucket)
    .remove([file.path]);

  if (error) throw error;

  file = await db.deleteFile(fileId);

  res.status(204).json(file);
});

export const updateFile = asyncHandler(async (req, res) => {
  const { data } = req.body;

  const fileId = validateFileId(req.params.fileId);

  let file = await validateFileExists(fileId);

  file = await db.updateFile(fileId, data);

  res.status(204).json(file);
});

export const renameFile = asyncHandler(async (req, res) => {
  const fileId = validateFileId(req.params.fileId);
  let file = await validateFileExists(fileId);

  const { name } = req.body;

  if (!name) throw new BadRequestError('Invalid name provided');

  const extension = name.split('.').at(-1);
  const newNameWithExtension = `${name}.${extension}`;
  const newPath = file.path.replace(file.name, newNameWithExtension);

  const { error: copyError } = await supabase.storage
    .from(file.bucket)
    .copy(file.path, newPath);

  if (copyError) throw copyError;

  const { error } = await supabase.storage
    .from(file.bucket)
    .remove([file.path]);

  if (error) throw error;

  file.name = newNameWithExtension;
  file.path = newPath;

  file = await db.updateFile(file.id, file);

  res.status(204).json(file);
});

export const getFileById = asyncHandler(async (req, res) => {
  const fileId = validateFileId(req.params.fileId);
  let file = await validateFileExists(fileId);
  res.status(200).json(file);
});

export const getFiles = asyncHandler(async (req, res) => {
  let folderId;
  if (!req.body?.folderId) {
    folderId = null;
  } else {
    folderId = Number(req.body.folderId);
  }

  let files;
  if (!folderId) {
    files = await db.getFiles(req.user!.id, folderId);
  } else {
    files = await db.getFiles(req.user!.id, folderId);
  }
  res.status(200).json(files);
});
