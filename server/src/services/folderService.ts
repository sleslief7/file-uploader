import { Folder, Prisma } from '../../generated/prisma';
import db from '../db';
import { MoveFolderDto } from '../interfaces';
import supabase from '../storage/supabase';
import {
  validateFolderExists,
  validateFoldersExist,
} from '../validation/validators';

export const createFolder = async (
  userId: number,
  name: string,
  parentFolderId: null | number
): Promise<Folder> => {
  const folder = await db.createFolder({
    name,
    owner: { connect: { id: userId } },
    ...(parentFolderId && {
      parentFolder: { connect: { id: Number(parentFolderId) } },
    }),
  });

  return folder;
};

export const updateFolder = async (
  folderId: number,
  updates: Prisma.FolderUpdateInput
): Promise<Folder> => {
  const folder = await db.updateFolder(folderId, updates);
  return folder;
};

export const renameFolder = async (
  folderId: number,
  newName: string
): Promise<Folder> => {
  const folder = await db.updateFolder(folderId, { name: newName });
  return folder;
};

export const setFolderIsFavorite = async (
  folderId: number,
  isFavorite: boolean
): Promise<Folder> => {
  const folder = await db.updateFolder(folderId, { isFavorite });
  return folder;
};

export const deleteFolders = async (folderIds: number[]) => {
  await validateFoldersExist(folderIds);

  const filesPathsToDelete = [];

  for (const folderId of folderIds) {
    const nestedFiles = await db.getNestedFilesForFolder(folderId);
    filesPathsToDelete.push(...nestedFiles.map((f) => f.path));
  }

  await supabase.deleteFiles(filesPathsToDelete);

  await db.deleteFolders(folderIds);
};

export const getFolderById = async (folderId: number): Promise<Folder> => {
  const folder = await validateFolderExists(folderId);
  return folder;
};

export const findFolder = async (
  userId: number,
  folderName: string,
  parentFolderId?: number | null
): Promise<Folder | null> => {
  return await db.findFolder(userId, folderName, parentFolderId);
};

export const getFolders = async (
  userId: number,
  parentFolderId: number | null
) => {
  return db.getFolders(userId, parentFolderId);
};

export const getBreadCrumbForFolder = async (folderId: number | null) => {
  const breadCrumb: any[] = [];
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
  return breadCrumb;
};

export const moveFolders = async (moveFolderDtos: MoveFolderDto[]) => {
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
      throw new Error(
        'Folder with same name already exists in destination folder'
      );

    await db.moveFolder(folder.id, moveFolderDto.newFolderId);
  }
};

export const cloneFolders = async (folderIds: number[]) => {
  await validateFoldersExist(folderIds);

  for (const folderId of folderIds) {
    let rootFolderTree = await db.getFolderWithNestedItems(folderId);

    let foldersToClone: any[] = [rootFolderTree];
    let folderIdMap: { [key: string]: number | null } = {};
    folderIdMap[`${rootFolderTree.parentFolderId}`] =
      rootFolderTree.parentFolderId;
    while (foldersToClone.length > 0) {
      const folderToClone = foldersToClone.pop();
      foldersToClone.push(...folderToClone.folders);

      const clonedFolder = await db.cloneFolder(
        folderToClone.id,
        folderIdMap[`${folderToClone.parentFolderId}`]
      );

      folderIdMap[`${folderToClone.id}`] = clonedFolder.id;

      for (const fileToClone of folderToClone.files) {
        await db.cloneFile(fileToClone, clonedFolder.id);
      }
    }
  }
};
