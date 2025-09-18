import { User, File } from '../../generated/prisma';
import {
  validateFilesExist,
  validateFileExists,
  validateFolderExists,
} from '../validation/validators';
import { BadRequestError } from '../validation/errors';
import supabase from '../storage/supabase';
import db from '../db';
import { MoveFileDto } from '../interfaces';
import { cloneFilePathName } from '../util/util';

export const updateFile = async (fileId: number, data: any): Promise<File> => {
  await validateFileExists(fileId);
  return await db.updateFile(fileId, data);
};

export const renameFile = async (
  fileId: number,
  name: string
): Promise<File> => {
  if (!name) throw new BadRequestError('Invalid name provided');

  let file = await validateFileExists(fileId);

  const extension = file.name.split('.').at(-1);
  const newNameWithExtension = `${name}.${extension}`;
  const newPath = file.path.replace(file.name, newNameWithExtension);

  await supabase.copyFile(file.path, newPath);
  await supabase.deleteFiles([file.path]);

  file.name = newNameWithExtension;
  file.path = newPath;

  return await db.updateFile(file.id, file);
};

export const getFileById = async (fileId: number): Promise<File> => {
  return await validateFileExists(fileId);
};

export const getFiles = async (
  userId: number,
  folderId: number | null
): Promise<File[]> => {
  return await db.getFiles(userId, folderId);
};

export const getFileUrl = async (fileId: number): Promise<string> => {
  const file = await validateFileExists(fileId);
  return await supabase.createSignedUrl(file.path);
};

export const cloneFiles = async (fileIds: number[]): Promise<File[]> => {
  let files = await validateFilesExist(fileIds);
  let clonedFiles = [];

  for (const file of files) {
    const fileNameDuplicate = await db.getFileNameDuplicate(
      file.id,
      file.folderId
    );
    const newPath = cloneFilePathName(file, file.folderId, fileNameDuplicate);
    await supabase.copyFile(file.path, newPath);
    try {
      const clonedFile = await db.cloneFile(file);
      clonedFiles.push(clonedFile);
    } catch (error) {
      await supabase.deleteFiles([newPath]);
      throw error;
    }
  }

  return clonedFiles;
};

export const moveFiles = async (moveFileDtos: MoveFileDto[]): Promise<void> => {
  for (const moveFileDto of moveFileDtos) {
    if (moveFileDto.newFolderId !== null)
      await validateFolderExists(moveFileDto.newFolderId);
    let file = await validateFileExists(moveFileDto.fileId);

    const fileExistsInDestFolder = await db.fileNameExistsInFolder(
      file.ownerId,
      moveFileDto.newFolderId,
      file.name
    );
    if (fileExistsInDestFolder)
      throw new BadRequestError(
        'File with same name already exists in destination folder'
      );

    const oldPath = file.path;
    const newPath = cloneFilePathName(file, moveFileDto.newFolderId);
    await supabase.moveFile(file.path, newPath);
    try {
      await db.moveFile(file.id, moveFileDto.newFolderId);
    } catch (error) {
      await supabase.moveFile(newPath, oldPath);
      throw error;
    }
  }
};

export const createFiles = async (
  user: User,
  files: Express.Multer.File[],
  folderId: number | null
) => {
  if (!files || files.length === 0)
    throw new BadRequestError('No files uploaded');

  const bucket = process.env.SUPABASE_BUCKET_NAME || 'uploads';
  const uploaded = [];
  const failed = [];

  for (const file of files) {
    const rawName = file.originalname;
    const sanitizedName = rawName.replace(/[^\w.-]+/g, '');
    const name = `${sanitizedName}`;
    const path = `${user.id}/${folderId ?? 'home'}/${name}`;

    try {
      await supabase.uploadFile(path, file);
    } catch {
      failed.push(name);
      continue;
    }

    try {
      const prismaFile = await db.createFile({
        name,
        owner: { connect: { id: user.id } },
        mimeType: file.mimetype,
        path,
        bucket,
        size: file.size,
        ...(folderId && {
          folder: { connect: { id: folderId } },
        }),
      });
      uploaded.push(prismaFile);
    } catch (err) {
      console.error(`Failed to save file ${name} to DB:`, err);
      await supabase.deleteFiles([path]);
      throw err;
    }
  }

  return { uploaded, failed };
};

export const deleteFiles = async (fileIds: number[]) => {
  let files = await validateFilesExist(fileIds);
  const filePaths = files.map((f: any) => f.path);
  await supabase.deleteFiles(filePaths);
  await db.deleteFiles(fileIds);
};
