const prisma = require('./prisma');
import path from 'path';
import { Prisma, File } from '../../generated/prisma';
import { cloneFilePathName, cloneName } from '../util/util';

export const createFile = async (
  data: Prisma.FileCreateInput
): Promise<File> => {
  const file = await prisma.file.create({ data });
  return file;
};

export const updateFile = async (
  fileId: number,
  data: Prisma.FileUpdateInput
): Promise<File> => {
  const file = await prisma.file.update({
    where: {
      id: fileId,
    },
    data,
  });
  return file;
};

export const deleteFiles = async (fileIds: number[]): Promise<number> => {
  const deletedFilesCount = await prisma.file.deleteMany({
    where: {
      id: {
        in: fileIds,
      },
    },
  });
  return deletedFilesCount;
};

export const getFileById = async (fileId: number): Promise<File | null> => {
  const file = await prisma.file.findUnique({
    where: {
      id: fileId,
    },
  });
  return file;
};

export const getFiles = async (
  ownerId: number,
  folderId: number | null = null
): Promise<File[]> => {
  const files = await prisma.file.findMany({
    where: {
      ownerId,
      folderId,
    },
  });
  return files;
};

export const getFilesByIds = async (fileIds: number[]): Promise<File[]> => {
  const files = await prisma.file.findMany({
    where: {
      id: { in: fileIds },
    },
  });
  return files;
};

export const getFileByOwnerId = async (
  ownerId: number
): Promise<File | null> => {
  const file = await prisma.file.findFirst({
    where: {
      ownerId,
    },
  });
  return file;
};

export const fileExists = async (fileId: number): Promise<boolean> => {
  const file = await prisma.file.findUnique({
    where: {
      id: fileId,
    },
  });
  return file !== null;
};

export const cloneFile = async (
  file: File,
  newFolderId: number | null | undefined = undefined
): Promise<File> => {
  const fileNameDuplicate = await getFileNameDuplicate(file.id);
  const { id, updatedAt, createdAt, ...restOfFile } = file;

  if (newFolderId === undefined) newFolderId = file.folderId;

  let newPath = cloneFilePathName(file, newFolderId, fileNameDuplicate);

  const fileCopied = await prisma.file.create({
    data: {
      ...restOfFile,
      name: fileNameDuplicate,
      path: newPath,
      ...(newFolderId === null ? { folderId: null } : {}),
      ...(newFolderId !== null
        ? { folder: { connect: { id: newFolderId } } }
        : {}),
    },
  });

  return fileCopied;
};

export const moveFile = async (
  fileId: number,
  newParentFolderId: number | null
): Promise<File> => {
  const file = await getFileById(fileId);
  const newPath = cloneFilePathName(file!, newParentFolderId);

  const movedFile = await prisma.file.update({
    where: {
      id: fileId,
    },
    data: {
      path: newPath,
      ...(newParentFolderId === null ? { folderId: null } : {}),
      ...(newParentFolderId !== null
        ? { folder: { connect: { id: newParentFolderId } } }
        : {}),
    },
  });

  return movedFile;
};

export const getFileNameDuplicate = async (fileId: number): Promise<string> => {
  const file = await getFileById(fileId);
  const folderFiles = await getFiles(file!.ownerId, file!.folderId);
  const existingFileNames = folderFiles.map((f) => f.name);

  let fileNameClone = cloneName(file!.name);

  while (!existingFileNames.includes(fileNameClone)) {
    fileNameClone = cloneName(fileNameClone);
  }

  return fileNameClone;
};

export const fileNameExistsInFolder = async (
  ownerId: number,
  newParentFolderId: number | null,
  fileName: string
): Promise<boolean> => {
  const filesInDestFolder = await getFiles(ownerId, newParentFolderId);
  const fileNamesInDestFolder = filesInDestFolder.map((f) => f.name);
  return fileNamesInDestFolder.includes(fileName);
};
