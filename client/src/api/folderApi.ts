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

export const getItems = async (
  folderId?: number | string | null,
  search?: string,
  page?: number,
  pageSize?: number,
  favoritesOnly?: boolean
) => {
  const params = new URLSearchParams();

  if (search) params.append('q', search);
  if (folderId !== undefined)
    params.append('folderId', folderId?.toString() ?? 'null');
  if (page) params.append('page', page.toString());
  if (pageSize) params.append('pageSize', pageSize.toString());
  if (favoritesOnly) params.append('favoritesOnly', favoritesOnly.toString());

  const path = `/items/?${params.toString()}`;

  try {
    const res = await apiClient.get(path);
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

export const deleteFolders = async (folderIds: number[]) => {
  try {
    const res = await apiClient.delete(`/folders`, { data: { folderIds } });
    return res.data;
  } catch (err) {
    console.error('Error deleting folder', err);
    throw err;
  }
};

export const renameFolder = async (folderId: number, name: string) => {
  try {
    const res = await apiClient.put(`/folders/${folderId}`, {
      data: { name },
    });
    return res.data.folder;
  } catch (err) {
    console.error('Error renaming folder', err);
    throw err;
  }
};
