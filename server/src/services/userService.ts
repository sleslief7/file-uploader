import db from '../db';
import { FolderTree } from '../interfaces';

export const getUserFolderTree = async (
  userId: number
): Promise<FolderTree> => {
  const rootFolderTrees: FolderTree[] = [];
  const directChildrenOfRoot = await db.getFolders(userId, null);

  for (const directChildOfRoot of directChildrenOfRoot) {
    const tree = await db.getFolderWithNestedItems(directChildOfRoot.id);
    rootFolderTrees.push(tree);
  }

  const rootFiles = await db.getFiles(userId, null);

  const rootFolderTree: FolderTree = {
    id: 0,
    name: 'home',
    ownerId: userId,
    parentFolderId: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    isFavorite: false,
    folders: rootFolderTrees,
    files: rootFiles,
  };

  return rootFolderTree;
};
