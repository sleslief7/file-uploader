import { Prisma } from '../../generated/prisma';
import db from '../db';
import { FolderTree, UserWithoutPassword } from '../interfaces';
import { createSignedUrl, deleteFiles, uploadFile } from '../storage/supabase';
import { BadRequestError } from '../validation/errors';

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
  profileImageFile?: Express.Multer.File,
  name?: string
): Promise<UserWithoutPassword> => {
  if (!profileImageFile && !name)
    throw new BadRequestError('Must provide one of profileImageFile or name');

  const user = await db.getUserById(userId);

  let presignedUrl: string | undefined = undefined;
  let newProfileImgPath: string | undefined = undefined;

  if (profileImageFile) {
    newProfileImgPath = `${userId}/${Date.now().toString()}-${
      profileImageFile.originalname
    }`;

    await uploadFile(newProfileImgPath, profileImageFile, avatarBucketName);

    if (user?.profileImgPath)
      await deleteFiles([user.profileImgPath], avatarBucketName);

    presignedUrl = await createSignedUrl(
      newProfileImgPath,
      avatarBucketName,
      315_360_000 // 10 years in seconds
    );
  }

  const dataToUpdate: Prisma.UserUpdateInput = {
    name,
    profileImgUrl: presignedUrl,
    profileImgPath: newProfileImgPath,
  };

  const updatedUser = await db.updateUser(userId, dataToUpdate, true);

  return updatedUser as UserWithoutPassword;
};
