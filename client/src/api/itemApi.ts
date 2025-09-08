import type { MoveFileDto } from '@/interfaces/fileInterface';
import apiClient from './apiClient';
import type { MoveFolderDto } from '@/interfaces/folderInterface';
import { toaster } from '@/components/ui/toaster';
import type { ItemType } from '@/interfaces/ItemInterface';

export const moveItems = async (
  filesToMove: MoveFileDto[],
  foldersToMove: MoveFolderDto[]
) => {
  if (filesToMove.length === 0 && foldersToMove.length === 0) {
    toaster.error({
      title: 'Must provide at least one file or folder to be moved',
    });
    return;
  }

  try {
    await apiClient.post(`/items/move`, {
      filesToMove,
      foldersToMove,
    });
  } catch (err) {
    console.error('Error creating folder', err);
    throw err;
  }
};

export const makeFavoriteItem = async (item: ItemType) => {
  try {
    const res = await apiClient.put(
      `/${item.isFile ? 'files' : 'folders'}/${item.id}`,
      {
        data: {
          isFavorite: !item.isFavorite,
        },
      }
    );
    return res;
  } catch (err) {
    console.error('Updatng item', err);
    throw err;
  }
};
