const prisma = require('./prisma');
import { Prisma, Folder } from '../../generated/prisma';

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

export const deleteFolder = async (folderId: number): Promise<Folder> => {
  const folder = await prisma.folder.delete({
    where: {
      id: folderId,
    },
  });
  return folder;
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
