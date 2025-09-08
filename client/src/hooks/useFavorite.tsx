import { makeFavoriteItem } from '@/api/itemApi';
import type { ItemType } from '@/interfaces/ItemInterface';
import { queryClient } from '@/tanstack/queryClient';
import { useMutation } from '@tanstack/react-query';

const useFavorite = () =>
  useMutation({
    mutationFn: (item: ItemType) => makeFavoriteItem(item),
    onSuccess: ({ data }) => {
      const folderIdToInvalite = data.folderId ?? data.parentFolderId ?? null;
      queryClient.invalidateQueries({
        queryKey: ['items', folderIdToInvalite],
      });
    },
  });

export default useFavorite;
