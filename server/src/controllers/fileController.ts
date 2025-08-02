import db from '../db';
import asyncHandler from 'express-async-handler';
import { supabase } from '../lib/supabase';
import { User } from '../../generated/prisma';

export const createFiles = asyncHandler(async (req, res) => {
  const user = req.user as User;
  const files = req.files as Express.Multer.File[];

  if (!files || files.length === 0) {
    res.status(400).json({ error: 'No files uploaded' });
    return;
  }

  const bucket = 'uploads';
  const folderId =
    req.params.folderId === 'home' ? null : Number(req.params.folderId);
  const uploadedFiles = [];

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
      uploadedFiles.push(prismaFile);
    } catch (err) {
      console.error(`Failed to save file ${name} to DB:`, err);
      await supabase.storage.from(bucket).remove([path]);
    }
  }

  res.status(200).json({ uploaded: uploadedFiles });
});

export const deleteFile = asyncHandler(async (req, res) => {
  const { fileId } = req.params;
  if (!fileId) {
    res
      .status(400)
      .json({ status: 'fail', message: 'Provide fileId to delete file.' });
    return;
  }

  let file = await db.getFileById(Number(fileId));

  if (file === null) {
    res
      .status(404)
      .json({ status: 'fail', message: 'fileId does not exists.' });
    return;
  }

  const { error } = await supabase.storage
    .from(file.bucket)
    .remove([file.path]);

  if (error) {
    res.status(500).json({
      status: 'fail',
      message: 'Error encountered while deleting file from storage',
    });
    return;
  }

  file = await db.deleteFile(Number(fileId));

  res.status(204).json(file);
});

export const updateFile = asyncHandler(async (req, res) => {
  const { data } = req.body;
  const { fileId } = req.params;
  if (!fileId) {
    res
      .status(400)
      .json({ status: 'fail', message: 'Provide fileId to delete file.' });
    return;
  }

  const file = await db.updateFile(Number(fileId), data);
  res.status(204).json(file);
});

export const getFileById = asyncHandler(async (req, res) => {
  const { fileId } = req.params;
  const file = await db.getFileById(Number(fileId));
  if (!file) {
    res.status(404).json({ status: 'fail', message: 'File not found' });
    return;
  }
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
