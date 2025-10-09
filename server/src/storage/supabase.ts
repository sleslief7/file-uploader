import { createClient } from '@supabase/supabase-js';
import { PresignedUrlDto } from '../interfaces';

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

const defaultBucket = process.env.SUPABASE_BUCKET_NAME!;

export const deleteFiles = async (
  filePaths: string[],
  bucket: string = defaultBucket
) => {
  if (filePaths.length === 0) return;

  const { error } = await supabase.storage.from(bucket).remove(filePaths);

  if (error)
    throw new Error(
      'Failed to delete the following files: ' +
        filePaths.join(', ') +
        '\nError message: ' +
        error.message
    );
};

export const uploadFile = async (
  path: string,
  file: Express.Multer.File,
  bucket: string = defaultBucket
) => {
  const { error } = await supabase.storage
    .from(bucket)
    .upload(path, file.buffer, { contentType: file.mimetype });

  if (error) throw error;
};

export const copyFile = async (
  sourcePath: string,
  destinationPath: string,
  bucket: string = defaultBucket
) => {
  const { error } = await supabase.storage
    .from(bucket)
    .copy(sourcePath, destinationPath);

  if (error) throw error;
};

export const moveFile = async (
  sourcePath: string,
  destinationPath: string,
  bucket: string = defaultBucket
) => {
  const { error } = await supabase.storage
    .from(bucket)
    .move(sourcePath, destinationPath);

  if (error) throw error;
};

export const createSignedUrl = async (
  path: string,
  bucket: string = defaultBucket,
  expiresIn: number = 60
): Promise<string> => {
  const { data, error } = await supabase.storage
    .from(bucket)
    .createSignedUrl(path, expiresIn);

  if (error) throw error;

  return data.signedUrl;
};

export const getPresignedUrls = async (
  paths: string[],
  bucket: string = defaultBucket,
  expiresIn: number = 60
): Promise<PresignedUrlDto[]> => {
  const { data, error } = await supabase.storage
    .from(bucket)
    .createSignedUrls(paths, expiresIn);

  if (error) throw error;

  return data as PresignedUrlDto[];
};

export default {
  deleteFiles,
  uploadFile,
  copyFile,
  moveFile,
  createSignedUrl,
  getPresignedUrls,
};
