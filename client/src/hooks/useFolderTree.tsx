import { getFolderTree } from '@/api/authApi';
import type { FolderTree } from '@/interfaces/UserInterface';
import { useQuery } from '@tanstack/react-query';

const useFolderTree = (userId?: number) => {
  const dataFallback: FolderTree | null = null;

  const { data = dataFallback, ...queryRest } = useQuery<FolderTree>({
    queryKey: ['folder_tree', userId],
    queryFn: () => getFolderTree(userId!),
    enabled: !!userId,
  });

  return { data, ...queryRest };
};

export default useFolderTree;
