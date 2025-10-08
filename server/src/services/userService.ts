import { Prisma } from '../../generated/prisma';
import db from '../db';
import { FolderTree, UserWithoutPassword } from '../interfaces';
import { createSignedUrl, deleteFiles, uploadFile } from '../storage/supabase';

const avatarBucketName = process.env.SUPABASE_AVATARS_BUCKET_NAME;

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

export const updateUser = async (
  userId: number,
  profileImageFile: Express.Multer.File,
  name?: string
): Promise<UserWithoutPassword> => {
  const user = await db.getUserById(userId);

  const path = `${userId}/${Date.now().toString()}-${
    profileImageFile.originalname
  }`;

  await uploadFile(path, profileImageFile, avatarBucketName);

  if (user?.profileImgPath)
    await deleteFiles([user.profileImgPath], avatarBucketName);

  const presignedUrl = await createSignedUrl(
    path,
    avatarBucketName,
    315_360_000 // 10 years in seconds
  );

  const dataToUpdate: Prisma.UserUpdateInput = {
    name,
    profileImgUrl: presignedUrl,
    profileImgPath: path,
  };

  const updatedUser = await db.updateUser(userId, dataToUpdate, true);

  return updatedUser as UserWithoutPassword;
};
