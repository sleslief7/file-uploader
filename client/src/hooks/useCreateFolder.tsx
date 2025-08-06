import { createFolder } from '@/api/folderApi';
import { toaster } from '@/components/ui/toaster';
import { queryClient } from '@/tanstack/queryClient';
import { useMutation } from '@tanstack/react-query';
import useFolderIdParam from './useFolderIdParam';

type CreateFolderRequest = {
  name: string;
  parentFolderId: number | null;
};

const useCreateFolder = () => {
  const folderId = useFolderIdParam();

  return useMutation({
    mutationFn: ({ name, parentFolderId }: CreateFolderRequest) =>
      createFolder(name, parentFolderId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items', folderId] });
      toaster.create({
        title: 'Folder created!',
        type: 'success',
      });
    },
  });
};

export default useCreateFolder;
