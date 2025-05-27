const prisma = require('./prisma');
import { Prisma, Folder } from '../../generated/prisma';

exports.createFolder = async (
  name: string,
  ownerId: number
): Promise<Folder> => {
  const folder = await prisma.folder.create({
    data: {
      name,
      owner: { connect: { id: ownerId } },
    },
  });
  return folder;
};

exports.updateFolder = async (
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

exports.deleteFolder = async (folderId: number): Promise<Folder> => {
  const folder = await prisma.folder.delete({
    where: {
      id: folderId,
    },
  });
  return folder;
};

exports.getFolderById = async (folderId: number): Promise<Folder | null> => {
  const folder = await prisma.folder.findUnique({
    where: {
      id: folderId,
    },
  });
  return folder;
};

exports.getAllFolders = async (
  parentFolderId: number | null = null
): Promise<Folder[]> => {
  const folders = await prisma.folder.findMany({
    where: {
      parentFolderId,
    },
  });
  return folders;
};

exports.folderExists = async (folderId: number): Promise<boolean> => {
  const folder = await prisma.folder.findUnique({
    where: {
      id: folderId,
    },
  });
  return folder !== null;
};

export {};
