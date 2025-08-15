import { renameFolder } from '@/api/folderApi';
import { toaster } from '@/components/ui/toaster';
import { queryClient } from '@/tanstack/queryClient';
import { useMutation } from '@tanstack/react-query';

type RenameMutationProp = {
  folderId: number;
  name: string;
};
const useRenameFolder = () =>
  useMutation({
    mutationFn: ({ folderId, name }: RenameMutationProp) =>
      renameFolder(folderId, name),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['items'],
      });
      toaster.create({
        title: 'Folder renamed!',
        type: 'success',
      });
    },
  });
export default useRenameFolder;
