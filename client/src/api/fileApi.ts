import apiClient from './apiClient';

export const createFile = async (
  files: File[],
  folderId: number | null = null
) => {
  try {
    const formData = new FormData();
    files.forEach((f) => formData.append('files', f));

    const res = await apiClient.post(
      `folders/${folderId ?? 'home'}/files`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return res.data;
  } catch (err) {
    console.error('Error creating file', err);
    throw err;
  }
};

export const deleteFile = async (id: number) => {
  try {
    const res = await apiClient.delete(`files/${id}`);
    return res.data;
  } catch (err) {
    console.error('Error deleting file', err);
    throw err;
  }
};

export const getSignedUrl = async (fileId: number): Promise<string> => {
  try {
    const res = await apiClient.get(`/files/${fileId}/signed_url`);
    return res.data.signedUrl;
  } catch (err) {
    console.error('Error deleting file', err);
    throw err;
  }
};
