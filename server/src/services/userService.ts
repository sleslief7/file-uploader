import { Prisma } from '../../generated/prisma';
import db from '../db';
import {
  FolderTreeFile,
  FolderTreeFolder,
  FolderTreeItem,
  UserWithoutPassword,
} from '../interfaces';
import { createSignedUrl, deleteFiles, uploadFile } from '../storage/supabase';
import { BadRequestError } from '../validation/errors';

const avatarBucketName = process.env.SUPABASE_AVATARS_BUCKET_NAME;

export const getUserFolderTree = async (
  userId: number,
  parentFolderId: number | null = null,
  includeParentFolder: boolean = true,
  folderIdsToFilterBy: number[] = [],
  fileIdsToFilterBy: number[] = [],
  includeFileUrls: boolean = false
): Promise<FolderTreeItem[]> => {
  let rootFolderTrees: FolderTreeFolder[] = [];
  const directChildrenOfRoot = await db.getFolders(userId, parentFolderId);

  for (const directChildOfRoot of directChildrenOfRoot) {
    const tree = await db.getFolderWithNestedItems(directChildOfRoot.id);
    rootFolderTrees.push(tree);
  }

  let rootFiles = (await db.getFiles(
    userId,
    parentFolderId
  )) as FolderTreeFile[];

  if (fileIdsToFilterBy)
    rootFiles = rootFiles.filter((x) => fileIdsToFilterBy.includes(x.id));

  if (folderIdsToFilterBy)
    rootFolderTrees = rootFolderTrees.filter((x) =>
      folderIdsToFilterBy.includes(x.id)
    );

  let rootFolderTree = await buildRootFolderTree(
    userId,
    parentFolderId,
    rootFolderTrees,
    rootFiles,
    includeParentFolder
  );

  let response = rootFolderTree
    ? [rootFolderTree]
    : [...rootFolderTrees, ...rootFiles];

  if (includeFileUrls) {
    response = await addPresignedUrlsToFolderTree(response);
  }
  return response;
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

async function buildRootFolderTree(
  userId: number,
  parentFolderId: number | null,
  rootFolderTrees: FolderTreeFolder[],
  rootFiles: FolderTreeFile[],
  includeParentFolder: boolean
): Promise<FolderTreeFolder | null> {
  if (!includeParentFolder) return null;

  if (parentFolderId === null) {
    return {
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
  } else {
    const folder = (await db.getFolderById(parentFolderId)) as FolderTreeFolder;
    folder.folders = rootFolderTrees;
    folder.files = rootFiles;
    return folder;
  }
}
