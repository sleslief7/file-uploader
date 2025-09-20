const prisma = require('./prisma');
import { Prisma, Folder, File } from '../../generated/prisma';
import { FolderTree } from '../interfaces';
import { cloneName } from '../util/util';

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

export const findFolder = async (
  userId: number,
  folderName: string,
  parentFolderId?: number | null
): Promise<Folder | null> => {
  const folders = await getFolders(userId, parentFolderId, folderName);

  const exactMatches = folders.filter(
    (f) => f.name.toLowerCase() === folderName.toLowerCase()
  );

  if (exactMatches.length === 1) return exactMatches[0];

  return null;
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
  parentFolderId?: number | null,
  search?: string,
  page?: number,
  pageSize?: number,
  favoritesOnly?: boolean
): Promise<Folder[]> => {
  const [folders, totlaCount] = await getFoldersWithCount(
    ownerId,
    parentFolderId,
    search,
    page,
    pageSize,
    favoritesOnly
  );
  return folders;
};

export const getFoldersWithCount = async (
  ownerId: number,
  parentFolderId?: number | null,
  search?: string,
  page?: number,
  pageSize?: number,
  favoritesOnly?: boolean
): Promise<[Folder[], number]> => {
  const skip =
    page === undefined || pageSize === undefined
      ? undefined
      : (page - 1) * pageSize;
  const take = pageSize ?? undefined;

  const where = {
    ownerId,
    ...(parentFolderId !== undefined ? { parentFolderId } : {}),
    ...(favoritesOnly ? { isFavorite: true } : {}),
    ...(search ? { name: { contains: search, mode: 'insensitive' } } : {}),
  };

  const folders = await prisma.folder.findMany({
    skip,
    take,
    orderBy: { updatedAt: 'desc' },
    where,
  });

  const totalCount = await prisma.folder.count({ where });
  return [folders, totalCount];
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
      parentFolderId: newParentFolderId,
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

  const { id, createdAt, updatedAt, ...restOfFolder } = folder;

  const folderNameDuplicate = await getFolderNameDuplicate(
    folderId,
    newFolderId ?? null
  );

  const copiedFolder = await prisma.folder.create({
    data: {
      ...restOfFolder,
      name: folderNameDuplicate,
      parentFolderId: newFolderId ?? null,
      folders: undefined,
      files: undefined,
    },
  });

  return copiedFolder;
};

export const getFolderNameDuplicate = async (
  folderId: number,
  destinationFolderId: number | null
): Promise<string> => {
  const folder = await getFolderById(folderId);
  const folders = await getFolders(folder!.ownerId, destinationFolderId);
  const existingFolderNames = folders.map((f) => f.name);

  let folderNameClone = folder!.name;

  while (existingFolderNames.includes(folderNameClone)) {
    folderNameClone = cloneName(folderNameClone);
  }

  return folderNameClone;
};

export const folderNameExistsInFolder = async (
  ownerId: number,
  newParentFolderId: number | null,
  folderName: string
): Promise<boolean> => {
  const foldersInDestFolder = await getFolders(ownerId, newParentFolderId);
  const folderNamesInDestFolder = foldersInDestFolder.map((f) => f.name);
  return folderNamesInDestFolder.includes(folderName);
};
