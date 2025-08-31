import { moveItems } from '@/api/itemApi';
import { toaster } from '@/components/ui/toaster';
import type { MoveFileDto } from '@/interfaces/fileInterface';
import type { MoveFolderDto } from '@/interfaces/folderInterface';
import { queryClient } from '@/tanstack/queryClient';
import { useMutation } from '@tanstack/react-query';

type MoveItemsMutationType = {
  filesToMove: MoveFileDto[];
  foldersToMove: MoveFolderDto[];
};

const useMoveItems = () =>
  useMutation({
    mutationFn: ({ filesToMove, foldersToMove }: MoveItemsMutationType) =>
      moveItems(filesToMove, foldersToMove),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] });
      queryClient.invalidateQueries({ queryKey: ['storage'] });
      queryClient.invalidateQueries({ queryKey: ['breadcrumb'] });

      toaster.success({ title: 'Item(s) successfully moved!' });
    },
  });

export default useMoveItems;
