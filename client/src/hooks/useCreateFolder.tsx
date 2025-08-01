import { createFolder } from '@/api/folderApi';
import { toaster } from '@/components/ui/toaster';
import { queryClient } from '@/tanstack/queryClient';
import { useMutation } from '@tanstack/react-query';

const useCreateFolder = () =>
  useMutation({
    mutationFn: (name: string) => createFolder(name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] });
      toaster.create({
        title: 'Folder created!',
        type: 'success',
      });
    },
  });

export default useCreateFolder;
