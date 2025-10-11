import useDeleteFiles from '@/hooks/useDeleteFiles';
import useDeleteFolders from '@/hooks/useDeleteFolders';
import { toaster } from '@/components/ui/toaster';
import { getSelectedIds } from '@/util/selectionUtils';
import type {
  SelectionType,
  SetSelectionType,
} from '@/interfaces/ItemInterface';

export default function useBulkDelete(
  selection: SelectionType,
  setSelection: SetSelectionType
) {
  const { mutateAsync: deleteFilesAsync, isPending: isDeletingFiles } =
    useDeleteFiles();
  const { mutateAsync: deleteFoldersAsync, isPending: isDeletingFolders } =
    useDeleteFolders();

  const onBulkDelete = async () => {
    const selectedFileIds = getSelectedIds('file', selection);
    const selectedFolderIds = getSelectedIds('folder', selection);
    try {
      if (selectedFileIds.length > 0) {
        await deleteFilesAsync(selectedFileIds);
      }
      if (selectedFolderIds.length > 0) {
        await deleteFoldersAsync(selectedFolderIds);
      }
      toaster.success({ title: 'Selected items have been deleted.' });
      setSelection({});
    } catch (err) {
      toaster.error({ title: 'Failed to delete some files or folders.' });
    }
  };

  return {
    onBulkDelete,
    isDeleting: isDeletingFiles || isDeletingFolders,
  };
}
