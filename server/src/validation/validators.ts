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

export function validateFileIds(fileIds: string[] | undefined): number[] {
  if (!fileIds) 
    throw new BadRequestError('Provide fileIds');

  if (fileIds.length === 0) throw new BadRequestError('Must provide at least one file id to delete');

  return fileIds.map(i => validateFileId(i))
}

export async function validateFileExists(fileId: number) {
  const file = await db.getFileById(fileId);

  if (!file)
    throw new NotFoundError(`File with id '${fileId}' does not exist.`);

  return file;
}

export async function validateFilesExist(fileIds: number[]) {
  const files = await db.getFilesByIds(fileIds);

  if (files.length !== fileIds.length)
    throw new NotFoundError(`Some file(s) where not found`);

  return files;
}

export function validateNullableFolderId(
  folderId: string | undefined | null
): number | null {
  if (!folderId || folderId === 'home' || folderId === 'null')
    return null;

  const id = Number(folderId);
  if (isNaN(id)) {
    throw new BadRequestError('folderId must be a number or null.');
  }

  return id;
}

export function validateFolderId(folderId: string | undefined | null): number {
  const nullableFolderId = validateNullableFolderId(folderId);
  if (!nullableFolderId)
    throw new BadRequestError('folderId can not be null/home/undefined');
  return nullableFolderId;
}

export async function validateFolderExists(folderId: number) {
  const folder = await db.getFolderById(folderId);

  if (!folder)
    throw new NotFoundError(`Folder with id '${folderId}' does not exist.`);

  return folder;
}
