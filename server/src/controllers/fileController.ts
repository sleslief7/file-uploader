import db from '../db';
import asyncHandler from 'express-async-handler';
import { supabase } from '../lib/supabase';
import { User } from '../../generated/prisma';

export const createFile = asyncHandler(async (req, res) => {
  const user = req.user as User;
  if (!req.file) {
    res.status(400).json({ error: 'No file uploaded' });
    return;
  }

  const file = req.file;
  const bucket = 'uploads';
  const extension = file.originalname.split('.')[1];
  const name = req.body.name
    ? `${req.body.name}.${extension}`
    : file.originalname;
  const path = `${user.id}/${req.body.folderId ?? 'home'}/${name}`;

  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file.buffer, { contentType: file.mimetype });

  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }

  try {
    const prismaFile = await db.createFile({
      name,
      owner: { connect: { id: user.id } },
      mimeType: file.mimetype,
      path,
      bucket,
      size: file.size,
      ...(req.body.folderId && {
        folder: { connect: { id: req.body.folderId } },
      }),
    });
    res.status(200).json(prismaFile);
  } catch (err) {
    console.error(err);
    const { data, error } = await supabase.storage.from(bucket).remove([path]);
  }
});

export const deleteFile = asyncHandler(async (req, res) => {
  const { fileId } = req.params;
  if (!fileId) {
    res
      .status(400)
      .json({ status: 'fail', message: 'Provide fileId to delete file.' });
    return;
  }
  if (!(await db.fileExists(Number(fileId)))) {
    res
      .status(404)
      .json({ status: 'fail', message: 'fileId does not exists.' });
    return;
  }

  const file = await db.deleteFile(Number(fileId));

  const { data, error } = await supabase.storage
    .from(file.bucket)
    .remove([file.path]);
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

export const getAllFiles = asyncHandler(async (req, res) => {
  let folderId;
  if (!req.body?.folderId) {
    folderId = null;
  } else {
    folderId = Number(req.body.folderId);
  }

  let files;
  if (!folderId) {
    files = await db.getAllFiles(folderId);
  } else {
    files = await db.getAllFiles(folderId);
  }
  res.status(200).json(files);
});
