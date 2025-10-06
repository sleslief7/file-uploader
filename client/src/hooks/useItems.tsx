import { useQuery } from '@tanstack/react-query';
import { getItems } from '../api/folderApi';
import type { ItemType } from '@/interfaces/ItemInterface';

export type GetItemsResponse = {
  items: ItemType[];
  totalCount: number;
  page?: number;
  pageSize?: number;
};

const useItems = (
  folderId?: number | string | null,
  search?: string,
  page?: number,
  pageSize?: number,
  favoritesOnly?: boolean
) => {
  const dataFallback: GetItemsResponse = { items: [], totalCount: 0 };
  const { data = dataFallback, ...queryRest } = useQuery<GetItemsResponse>({
    queryKey: ['items', folderId, search, page, pageSize, favoritesOnly],
    queryFn: () => getItems(folderId, search, page, pageSize, favoritesOnly),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  return { data, ...queryRest };
};

export default useItems;
