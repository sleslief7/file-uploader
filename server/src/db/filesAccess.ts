const prisma = require('./prisma');
import { Prisma, File } from '../../generated/prisma';

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

export const deleteFile = async (fileId: number): Promise<File> => {
  const file = await prisma.file.delete({
    where: {
      id: fileId,
    },
  });
  return file;
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
