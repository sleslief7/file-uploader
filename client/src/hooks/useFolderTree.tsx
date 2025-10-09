import { getFolderTree } from '@/api/authApi';
import type { FolderTreeFolder } from '@/interfaces/UserInterface';
import { useQuery } from '@tanstack/react-query';

const useFolderTree = (userId?: number) => {
  const dataFallback: FolderTreeFolder | null = null;

  const { data = dataFallback, ...queryRest } = useQuery<FolderTreeFolder>({
    queryKey: ['folder_tree', userId],
    queryFn: () => getFolderTree(userId!),
    enabled: !!userId,
  });

  return { data, ...queryRest };
};

export default useFolderTree;
