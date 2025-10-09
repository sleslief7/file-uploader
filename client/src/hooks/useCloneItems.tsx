import { cloneItems } from '@/api/itemApi';
import { toaster } from '@/components/ui/toaster';
import type { CloneFileDto } from '@/interfaces/fileInterface';
import type { CloneFolderDto } from '@/interfaces/folderInterface';
import { queryClient } from '@/tanstack/queryClient';
import { useMutation } from '@tanstack/react-query';

type CloneItemsMutationType = {
  filesToClone: CloneFileDto[];
  foldersToClone: CloneFolderDto[];
};

const useCloneItems = () =>
  useMutation({
    mutationFn: ({ filesToClone, foldersToClone }: CloneItemsMutationType) =>
      cloneItems(filesToClone, foldersToClone),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] });
      queryClient.invalidateQueries({ queryKey: ['storage'] });
      queryClient.invalidateQueries({ queryKey: ['breadcrumb'] });

      toaster.success({ title: 'Item(s) successfully cloned!' });
    },
  });

export default useCloneItems;
