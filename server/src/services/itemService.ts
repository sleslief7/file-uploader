import db from '../db';
import {
  GetItemsQueryParams,
  GetItemsResponse,
  Items,
  MoveFileDto,
  MoveFolderDto,
} from '../interfaces';
import { moveFiles } from './fileService';
import { moveFolders } from './folderService';

export const getItems = async (
  userId: number,
  params: GetItemsQueryParams
): Promise<GetItemsResponse> => {
  const { search, folderId, page, pageSize, favoritesOnly } = params;

  const [folders, foldersTotalCount] = await db.getFoldersWithCount(
    userId,
    folderId,
    search,
    undefined,
    undefined,
    favoritesOnly
  );

  const [files, filesTotalCount] = await db.getFilesWithCount(
    userId,
    folderId,
    search,
    undefined,
    undefined,
    favoritesOnly
  );

  let items: Items = [];

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

  items = items.sort((x, y) => {
    if (x.isFile !== y.isFile) return x.isFile ? 1 : -1;
    return y.updatedAt.getTime() - x.updatedAt.getTime();
  });

  if (page && pageSize) {
    const skip = (page - 1) * pageSize;
    items = items.slice(skip, skip + pageSize);
  }

  return {
    items,
    totalCount: foldersTotalCount + filesTotalCount,
    page,
    pageSize,
  };
};

export const moveItems = async (
  foldersToMove: MoveFolderDto[],
  filesToMove: MoveFileDto[]
): Promise<void> => {
  await moveFolders(foldersToMove);
  await moveFiles(filesToMove);
};
