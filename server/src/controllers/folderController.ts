import db from '../db';
import asyncHandler from 'express-async-handler';
import { Breadcrumb, Items } from '../interfaces';

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

export const getFolders = asyncHandler(async (req, res) => {
  let parentFolderId;
  if (!req.body?.parentFolderId) {
    parentFolderId = null;
  } else {
    parentFolderId = Number(req.body.parentFolderId);
  }

  let folders;
  if (!parentFolderId) {
    folders = await db.getFolders(req.user!.id, parentFolderId);
  } else {
    folders = await db.getFolders(req.user!.id, parentFolderId);
  }
  res.status(200).json(folders);
});

export const getItemsByParentFolderId = asyncHandler(async (req, res) => {
  const folderId = Number(req.params.folderId);
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
  let folderId: number | null | undefined = req.params.folderId
    ? Number(req.params.folderId)
    : null;

  const breadCrumb: Breadcrumb = [];

  while (folderId) {
    const folder = await db.getFolderById(folderId);
    breadCrumb.unshift({
      folderName: folder?.name,
      folderId: folder?.id,
      position: 0,
    });
    folderId = folder?.parentFolderId;
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
