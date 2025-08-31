import { useQuery } from '@tanstack/react-query';
import { getItems } from '../api/folderApi';
import type { ItemType } from '@/interfaces/ItemInterface';

const useItems = (
  folderId: number | string | null,
  query?: string,
  page?: number,
  pageSize?: number,
  favoritesOnly?: boolean
) => {
  const dataFallback: ItemType[] = [];
  const { data = dataFallback, ...queryRest } = useQuery<ItemType[]>({
    queryKey: ['items', folderId, query, page, pageSize, favoritesOnly],
    queryFn: () => getItems(folderId, query, page, pageSize, favoritesOnly),
    staleTime: 60 * 2000,
  });

  return { data, ...queryRest };
};

export default useItems;
