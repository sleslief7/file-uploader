const prisma = require('./prisma');
import { Prisma, Folder, File } from '../../generated/prisma';
import { FolderWithContent } from '../interfaces';

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

export const getFolderWithContent = async (
  folderId: number
): Promise<FolderWithContent> => {
  const folder = await prisma.folder.findUnique({
    where: {
      id: folderId,
    },
    include: {
      folders: true,
      files: true
    }
  });
  return folder;
};

export const getNestedFilesForFolder = async (folderId: number): Promise<File[]> => {
  let files: File[] = []
  
  let folderIdsToScan: number[] = [folderId]
    
  while (folderIdsToScan.length) {
    let currentFolderId = folderIdsToScan.pop()!;
    let currentFolder = await getFolderWithContent(currentFolderId);

    folderIdsToScan.push(...currentFolder.folders.map(f => f.id))
    
    let currentFolderFiles = currentFolder.files
    files.push(...currentFolderFiles)
  }
  return files;
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
