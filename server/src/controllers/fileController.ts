import db from '../db';
import asyncHandler from 'express-async-handler';
import { supabase } from '../lib/supabase';
import { User } from '../../generated/prisma';

export const createFile = asyncHandler(async (req, res) => {
  const user = req.user as User;
  const { name: customName, folderId } = req.body;
  if (!req.file) {
    res.status(400).json({ error: 'No file uploaded' });
    return;
  }

  const file = req.file;
  const bucket = 'uploads';
  const extension = file.originalname.split('.')[1];
  const name = customName ? `${customName}.${extension}` : file.originalname;
  const path = `${user.id}/${folderId ?? 'home'}/${name}`;

  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file.buffer, { contentType: file.mimetype });

  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }

  const prismaFile = await db.createFile({
    name,
    owner: { connect: { id: user.id } },
    mimeType: file.mimetype,
    path,
    bucket,
    size: file.size,
    ...(folderId && { folder: { connect: { id: folderId } } }),
  });
  res.status(200).json(prismaFile);
});
