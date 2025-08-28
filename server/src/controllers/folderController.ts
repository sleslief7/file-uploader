import db from '../db';
import asyncHandler from 'express-async-handler';
import { Breadcrumb, FolderTree, Items, MoveFolderDto } from '../interfaces';
import { BadRequestError } from '../validation/errors';
import {
  validateFolderExists,
  validateFoldersExist,
  validateFolderId,
  validateFolderIds,
  validateNullableFolderId,
} from '../validation/validators';
import supabase from '../storage/supabase';

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

export const deleteFolders = asyncHandler(async (req, res) => {
  const folderIds = validateFolderIds(req.body.folderIds);
  await validateFoldersExist(folderIds);

  const filesPathsToDelete = [];

  for (const folderId of folderIds) {
    const nestedFiles = await db.getNestedFilesForFolder(folderId);
    filesPathsToDelete.push(...nestedFiles.map((f) => f.path));
  }

  await supabase.deleteFiles(filesPathsToDelete);

  await db.deleteFolders(folderIds);
  res.status(204).send();
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
  const { q } = req.query;
  const safeQuery: string | undefined =
    typeof q === 'string'
      ? q
      : Array.isArray(q) && typeof q[0] === 'string'
      ? q[0]
      : undefined;

  const folderId = validateNullableFolderId(req.params.folderId);
  const folders = await db.getFolders(req.user!.id, folderId, safeQuery);
  const files = await db.getFiles(req.user!.id, folderId, safeQuery);

  const items: Items = [];
  folders.map((folder) =>
    items.push({
      id: folder.id,
      isFile: false,
      name: folder.name,
      ownerId: folder.ownerId,
      parentId: folder.parentFolderId,
      updatedAt: folder.updatedAt,
      isFavorite: folder.isFavorite,
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
      isFavorite: file.isFavorite,
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

export const moveFolders = asyncHandler(async (req, res) => {
  const moveFolderDtos = req.body.foldersToMove as MoveFolderDto[];

  for (const moveFolderDto of moveFolderDtos) {
    if (moveFolderDto.newFolderId !== null)
      await validateFolderExists(moveFolderDto.newFolderId);

    let folder = await validateFolderExists(moveFolderDto.folderId);

    const folderExistsInDestFolder = await db.folderNameExistsInFolder(
      folder.ownerId,
      moveFolderDto.newFolderId,
      folder.name
    );
    if (folderExistsInDestFolder)
      throw new BadRequestError(
        'Folder with same name already exists in destination folder'
      );

    await db.moveFolder(folder.id, moveFolderDto.newFolderId);
  }

  res.status(200).send();
});

export const cloneFolders = asyncHandler(async (req, res) => {
  const folderIds = validateFolderIds(req.body.folderIds);
  await validateFoldersExist(folderIds);

  for (const folderId of folderIds) {
    let rootFolderTree = await db.getFolderWithNestedItems(folderId);

    let foldersToClone: FolderTree[] = [rootFolderTree];
    let folderIdMap: { [key: string]: number | null } = {};
    folderIdMap[`${rootFolderTree.parentFolderId}`] =
      rootFolderTree.parentFolderId;
    while (foldersToClone.length > 0) {
      const folderToClone = foldersToClone.pop();
      foldersToClone.push(...folderToClone!.folders);

      const clonedFolder = await db.cloneFolder(
        folderToClone!.id,
        folderIdMap[`${folderToClone!.parentFolderId}`]
      );

      folderIdMap[`${folderToClone!.id}`] = clonedFolder.id;

      for (const fileToClone of folderToClone!.files) {
        await db.cloneFile(fileToClone, clonedFolder.id);
      }
    }
  }

  res.status(200).send();
});
