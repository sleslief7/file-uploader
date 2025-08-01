import apiClient from './apiClient';

export const createFile = async (
  files: File[],
  folderId: number | null = null
) => {
  try {
    const res = await apiClient.post(`/files`, {
      files,
      folderId,
    });
    return res.data;
  } catch (err) {
    console.error('Error creating file', err);
    throw err;
  }
};
