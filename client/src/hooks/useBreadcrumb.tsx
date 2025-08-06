import { getBreadcrumb } from '@/api/folderApi';
import type { BreadCrumb } from '@/interfaces/folderInterface';
import { useQuery } from '@tanstack/react-query';

const useBreadcrumb = (folderId: number | null = null) => {
  const dataFallback: BreadCrumb[] = [];

  const { data = dataFallback, ...queryRest } = useQuery<BreadCrumb[]>({
    queryKey: ['breadcrumb', folderId],
    queryFn: () => getBreadcrumb(folderId),
  });

  return { data, queryRest };
};

export default useBreadcrumb;
