import { deleteFolders } from '@/api/folderApi';
import { queryClient } from '@/tanstack/queryClient';
import { useMutation } from '@tanstack/react-query';

const useDeleteFolders = () =>
  useMutation({
    mutationFn: (ids: number[]) => deleteFolders(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] });
      queryClient.invalidateQueries({ queryKey: ['storage'] });
    },
  });

export default useDeleteFolders;
