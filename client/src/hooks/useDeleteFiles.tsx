import { deleteFiles } from '@/api/fileApi';
import { queryClient } from '@/tanstack/queryClient';
import { useMutation } from '@tanstack/react-query';

const useDeleteFiles = () =>
  useMutation({
    mutationFn: (fileIds: number[]) => deleteFiles(fileIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] });
      queryClient.invalidateQueries({ queryKey: ['storage'] });
    },
  });

export default useDeleteFiles;
