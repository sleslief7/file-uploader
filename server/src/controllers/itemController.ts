import db from '../db';
import asyncHandler from 'express-async-handler';
import {
  GetItemsQueryParams,
  getItemsQueryParamsSchema,
  GetItemsResponse,
  Items,
} from '../interfaces';

export const getItems = asyncHandler(async (req, res) => {
  const params: GetItemsQueryParams = getItemsQueryParamsSchema.parse(
    req.query
  );

  const userId = req.user!.id;

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
  const response: GetItemsResponse = {
    items,
    totalCount: foldersTotalCount + filesTotalCount,
    page,
    pageSize,
  };
  res.status(200).json(response);
});
