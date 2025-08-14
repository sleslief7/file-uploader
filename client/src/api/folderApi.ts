import apiClient from './apiClient';

export const createFolder = async (
  name: string,
  parentFolderId: number | null = null
) => {
  try {
    const res = await apiClient.post(`/folders`, {
      name,
      parentFolderId,
    });
    return res.data;
  } catch (err) {
    console.error('Error creating folder', err);
    throw err;
  }
};

export const getItems = async (folderId: number | null = null) => {
  try {
    const res = await apiClient.get(`/folders/${folderId}/items`);
    return res.data;
  } catch (err) {
    console.error('Error getting items', err);
    throw err;
  }
};

export const getBreadcrumb = async (folderId: number | null = null) => {
  try {
    const res = await apiClient.get(`/folders/${folderId}/breadcrumb`);
    return res.data;
  } catch (err) {
    console.error('Error getting breadcrumb', err);
    throw err;
  }
};

export const deleteFolder = async (id: number) => {
  try {
    const res = await apiClient.delete(`/folders/${id}`);
    return res.data;
  } catch (err) {
    console.error('Error deleting folder', err);
    throw err;
  }
};

export const renameFolder = async (folderId: number, name: string) => {
try {
  const res = await apiClient.put(`/folders/${folderId}`, {
    data: {name}
  })
  return res.data.folder
} catch (err) {
    console.error('Error renaming folder', err);
    throw err;
  
}
}
