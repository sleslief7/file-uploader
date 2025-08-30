import { getFolderTrees } from '@/api/authApi';
import type { FolderTree } from '@/interfaces/UserInterface';
import { useQuery } from '@tanstack/react-query';

const useFolderTrees = (userId?: number) => {
  const dataFallback: FolderTree[] = [];

  const { data = dataFallback, ...queryRest } = useQuery<FolderTree[]>({
    queryKey: ['folder_trees', userId],
    queryFn: () => getFolderTrees(userId!),
    enabled: !!userId,
  });

  return { data, queryRest };
};

export default useFolderTrees;
