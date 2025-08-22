const prisma = require('./prisma');
import { Prisma, Folder, File } from '../../generated/prisma';
import { FolderTree } from '../interfaces';
import { cloneName } from '../util/util';
import { cloneFile } from './filesAccess';

export const createFolder = async (
  data: Prisma.FolderCreateInput
): Promise<Folder> => {
  const folder = await prisma.folder.create({ data });
  return folder;
};

export const updateFolder = async (
  folderId: number,
  data: Prisma.FolderUpdateInput
): Promise<Folder> => {
  const folder = await prisma.folder.update({
    where: {
      id: folderId,
    },
    data,
  });
  return folder;
};

export const deleteFolders = async (folderIds: number[]): Promise<number> => {
  const deletedCount = await prisma.folder.deleteMany({
    where: { id: { in: folderIds } },
  });
  return deletedCount;
};

export const getFolderById = async (
  folderId: number
): Promise<Folder | null> => {
  const folder = await prisma.folder.findUnique({
    where: {
      id: folderId,
    },
  });
  return folder;
};

export const getFoldersByIds = async (
  folderIds: number[]
): Promise<Folder[]> => {
  const folders = await prisma.folder.findMany({
    where: {
      id: { in: folderIds },
    },
  });
  return folders;
};

export const getFolders = async (
  ownerId: number,
  parentFolderId: number | null = null
): Promise<Folder[]> => {
  const folders = await prisma.folder.findMany({
    where: {
      ownerId,
      parentFolderId,
    },
  });
  return folders;
};

export const folderExists = async (folderId: number): Promise<boolean> => {
  const folder = await prisma.folder.findUnique({
    where: {
      id: folderId,
    },
  });
  return folder !== null;
};

export const getNestedFilesForFolder = async (
  folderId: number
): Promise<File[]> => {
  let files: File[] = [];
  let rootFolder = await getFolderWithNestedItems(folderId);
  let foldersToScan: FolderTree[] = [rootFolder];

  while (foldersToScan.length !== 0) {
    const currentFolder = foldersToScan.pop()!;
    console.log(currentFolder.files);
    foldersToScan.push(...currentFolder.folders);
    files.push(...currentFolder.files);
  }

  return files;
};

export const getFolderWithNestedItems = async (
  folderId: number
): Promise<FolderTree> => {
  const folder = await prisma.folder.findUnique({
    where: {
      id: folderId,
    },
    include: {
      folders: true,
      files: true,
    },
  });

  const childFolders: Folder[] = [];
  for (const childFolder of folder.folders) {
    childFolders.push(await getFolderWithNestedItems(childFolder.id));
  }

  return { ...folder, folders: childFolders };
};

export const moveFolder = async (
  folderId: number,
  newParentFolderId: number | null
): Promise<Folder> => {
  const movedFolder = await prisma.folder.update({
    where: {
      id: folderId,
    },
    data: {
      folder: {
        connect: { id: newParentFolderId },
      },
    },
  });

  return movedFolder;
};

export const cloneFolder = async (
  folderId: number,
  newFolderId: number | null | undefined = undefined
): Promise<Folder> => {
  const folder = await prisma.folder.findUnique({
    where: {
      id: folderId,
    },
    include: {
      folders: true,
      files: true,
    },
  });

  const { id, ...folderWithoutId } = folder;

  const folderNameDuplicate = await getFolderNameDuplicate(folderId);

  const copiedFolder = await prisma.folder.create({
    data: {
      ...folderWithoutId,
      name: folderNameDuplicate,
      ...(newFolderId !== undefined && {
        folder: { connect: { id: newFolderId } },
      }),
      folders: undefined,
      files: undefined,
    },
  });

  for (const childFolder of folder.folders) {
    await cloneFolder(childFolder, copiedFolder.id);
  }
  for (const childFile of folder.files) {
    await cloneFile(childFile, copiedFolder.id);
  }

  return copiedFolder;
};

export const getFolderNameDuplicate = async (
  folderId: number
): Promise<string> => {
  const folder = await getFolderById(folderId);
  const folders = await getFolders(folder!.ownerId, folder!.parentFolderId);
  const existingFolderNames = folders.map((f) => f.name);

  let folderNameClone = cloneName(folder!.name);

  while (!existingFolderNames.includes(folderNameClone)) {
    folderNameClone = cloneName(folderNameClone);
  }

  return folderNameClone;
};
