import { getBreadcrumb } from '@/api/folderApi';
import type { FolderBreadcrumbItem } from '@/interfaces/folderInterface';
import { useQuery } from '@tanstack/react-query';

const useBreadcrumb = (folderId: number | null = null) => {
  const dataFallback: FolderBreadcrumbItem[] = [];

  const { data = dataFallback, ...queryRest } = useQuery<
    FolderBreadcrumbItem[]
  >({
    queryKey: ['breadcrumb', folderId],
    queryFn: () => getBreadcrumb(folderId),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return { data, queryRest };
};

export default useBreadcrumb;
