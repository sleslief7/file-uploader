import apiClient from './apiClient';

export const createFolder = async (name: string) => {
  try {
    const res = await apiClient.post(`/folders`, {
      name,
    });
    return res.data;
  } catch (err) {
    console.error('Error creating folder', err);
    throw err;
  }
};
