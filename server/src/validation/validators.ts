import { BadRequestError, NotFoundError } from './errors';
import db from '../db';

export function validateFileId(fileId: string | undefined): number {
  if (!fileId) {
    throw new BadRequestError('Provide fileId.');
  }

  const id = Number(fileId);
  if (isNaN(id)) {
    throw new BadRequestError('fileId must be a number.');
  }

  return id;
}

export async function validateFileExists(fileId: number) {
  const file = await db.getFileById(fileId);

  if (!file)
    throw new NotFoundError(`File with id '${fileId}' does not exist.`);

  return file;
}

export function validateFolderId(folderId: string | undefined): number {
  if (!folderId) {
    throw new BadRequestError('Provide folderId.');
  }

  const id = Number(folderId);
  if (isNaN(id)) {
    throw new BadRequestError('folderId must be a number.');
  }

  return id;
}

export async function validateFolderExists(folderId: number) {
  const folder = await db.getFolderById(folderId);

  if (!folder)
    throw new NotFoundError(`Folder with id '${folderId}' does not exist.`);

  return folder;
}
