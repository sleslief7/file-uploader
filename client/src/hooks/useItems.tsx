import { useQuery } from '@tanstack/react-query';
import { getItems } from '../api/folderApi';
import type { ItemType } from '@/interfaces/ItemInterface';

const useItems = (folderId: number | null = null) => {
  const dataFallback: ItemType[] = [];
  const { data = dataFallback, ...queryRest } = useQuery<ItemType[]>({
    queryKey: ['items', folderId],
    queryFn: () => getItems(folderId),
  });

  return { data, ...queryRest };
};

export default useItems;
