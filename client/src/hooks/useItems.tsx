import { useQuery } from '@tanstack/react-query';
import { getItems } from '../api/folderApi';
import type { ItemType } from '@/interfaces/ItemInterface';

const useItems = (
  folderId: number | null = null,
  query?: string | undefined
) => {
  const dataFallback: ItemType[] = [];
  const { data = dataFallback, ...queryRest } = useQuery<ItemType[]>({
    queryKey: ['items', folderId, query],
    queryFn: () => getItems(folderId, query),
    staleTime: 60 * 1000,
  });

  return { data, ...queryRest };
};

export default useItems;
