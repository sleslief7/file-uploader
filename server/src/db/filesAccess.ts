const prisma = require('./prisma');
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
  folderId?: number | null,
  search?: string,
  page?: number,
  pageSize?: number,
  favoritesOnly?: boolean
): Promise<File[]> => {
  const [files, totalCount] = await getFilesWithCount(
    ownerId,
    folderId,
    search,
    page,
    pageSize,
    favoritesOnly
  );

  return files;
};

export const getFilesWithCount = async (
  ownerId: number,
  folderId?: number | null,
  search?: string,
  page?: number,
  pageSize?: number,
  favoritesOnly?: boolean
): Promise<[File[], number]> => {
  const skip =
    page === undefined || pageSize === undefined
      ? undefined
      : (page - 1) * pageSize;
  const take = pageSize ?? undefined;

  const where = {
    ownerId,
    ...(folderId !== undefined ? { folderId } : {}),
    ...(favoritesOnly ? { isFavorite: true } : {}),
    ...(search ? { name: { contains: search, mode: 'insensitive' } } : {}),
  };

  const files = await prisma.file.findMany({
    skip,
    take,
    orderBy: {
      updatedAt: 'desc',
    },
    where,
  });

  const totalCount = await prisma.file.count({ where });
  return [files, totalCount];
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
  if (newFolderId === undefined) newFolderId = file.folderId;

  const fileNameDuplicate = await getFileNameDuplicate(file.id, newFolderId);
  const { id, updatedAt, createdAt, ...restOfFile } = file;

  let newPath = cloneFilePathName(file, newFolderId, fileNameDuplicate);

  const fileCopied = await prisma.file.create({
    data: {
      ...restOfFile,
      name: fileNameDuplicate,
      path: newPath,
      folderId: newFolderId,
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
      folderId: newParentFolderId,
    },
  });

  return movedFile;
};

export const getFileNameDuplicate = async (
  fileId: number,
  destinationFolderId: number | null
): Promise<string> => {
  const file = await getFileById(fileId);
  const folderFiles = await getFiles(file!.ownerId, destinationFolderId);
  const existingFileNames = folderFiles.map((f) => f.name);

  let fileNameClone = file!.name;

  while (existingFileNames.includes(fileNameClone)) {
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

export const findFile = async (
  userId: number,
  fileName: string,
  parentFolderId?: number | null
): Promise<File | null> => {
  const files = await getFiles(userId, parentFolderId, fileName);

  const exactMatches = files.filter(
    (f) =>
      f.name.replace(/\.[^/.]+$/, '').toLowerCase() === fileName.toLowerCase()
  );

  if (exactMatches.length === 1) return exactMatches[0];

  return null;
};
