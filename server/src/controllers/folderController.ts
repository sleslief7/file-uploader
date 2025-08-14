import db from '../db';
import asyncHandler from 'express-async-handler';
import { Breadcrumb, Items } from '../interfaces';
import { BadRequestError } from '../validation/errors';
import {
  validateFolderExists,
  validateFolderId,
  validateNullableFolderId,
} from '../validation/validators';
import { supabase } from '../lib/supabase';

export const createFolder = asyncHandler(async (req, res) => {
  const { name } = req.body;
  if (!name) throw new BadRequestError('Folder name is required.');

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
  const folderId = validateFolderId(req.params.folderId);

  const folder = await db.updateFolder(folderId, data);
  res.status(204).json(folder);
});

export const deleteFolder = asyncHandler(async (req, res) => {
  const folderId = validateFolderId(req.params.folderId);
  await validateFolderExists(folderId);

  let filesToDelete: string[] = []

  let folderIdsToScan: number[] = [folderId]
  
  while (folderIdsToScan.length) {
    let currentFolderId = folderIdsToScan.pop()!;
    let currentFolder = await db.getFolderWithContent(currentFolderId);

    folderIdsToScan.push(...currentFolder.folders.map(f => f.id))
    
    let currentFolderFilesToDelete = currentFolder.files.map(f => f.path)
    filesToDelete.push(...currentFolderFilesToDelete)
  }

  if (filesToDelete.length > 0) {
    const { error } = await supabase
      .storage
      .from(process.env.SUPABASE_BUCKET_NAME!)
      .remove(filesToDelete);
    
    if (error) {
      console.error(`Failed to delete the following files: ${filesToDelete.join(', ')}\nError message: ${error.message}`);
      throw new Error('Failed to delete the following files: ' + filesToDelete.join(', ') + '\nError message: ' + error.message);
    }
  }

  let deletedRootFolder = await db.deleteFolder(folderId);
  res.status(204).json(deletedRootFolder);
});

export const getFolderById = asyncHandler(async (req, res) => {
  const folderId = validateFolderId(req.params.folderId);
  const folder = await validateFolderExists(folderId);
  res.status(200).json(folder);
});

export const getFolders = asyncHandler(async (req, res) => {
  const parentFolderId = validateNullableFolderId(req.body?.parentFolderId);

  const folders = await db.getFolders(req.user!.id, parentFolderId);

  res.status(200).json(folders);
});

export const getItemsByParentFolderId = asyncHandler(async (req, res) => {
  const folderId = validateNullableFolderId(req.params.folderId);
  const folders = await db.getFolders(req.user!.id, folderId);
  const files = await db.getFiles(req.user!.id, folderId);

  const items: Items = [];
  folders.map((folder) =>
    items.push({
      id: folder.id,
      isFile: false,
      name: folder.name,
      ownerId: folder.ownerId,
      parentId: folder.parentFolderId,
      updatedAt: folder.updatedAt,
    })
  );
  files.map((file) =>
    items.push({
      id: file.id,
      isFile: true,
      name: file.name,
      size: file.size,
      ownerId: file.ownerId,
      parentId: file.folderId,
      updatedAt: file.updatedAt,
    })
  );

  res.status(200).json(items);
});

export const getBreadCrumb = asyncHandler(async (req, res) => {
  let folderId = validateNullableFolderId(req.params.folderId);

  const breadCrumb: Breadcrumb = [];

  while (folderId) {
    const folder = await db.getFolderById(folderId);
    breadCrumb.unshift({
      folderName: folder?.name,
      folderId: folder?.id,
      position: 0,
    });
    folderId = folder?.parentFolderId ?? null;
  }

  breadCrumb.unshift({
    folderName: 'Home',
    folderId: null,
    position: 0,
  });

  for (let i = 0; i < breadCrumb.length; i++) {
    let breadCrumbItem = breadCrumb[i];
    breadCrumbItem.position = i + 1;
  }

  res.status(200).json(breadCrumb);
});
