import useDeleteFiles from '@/hooks/useDeleteFiles';
import useDeleteFolders from '@/hooks/useDeleteFolders';
import { toaster } from '@/components/ui/toaster';
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

  const getSelectedIds = (type: 'file' | 'folder'): number[] =>
    Object.entries(selection)
      .filter(([key, value]) => value && key.startsWith(`${type}-`))
      .map(([key]) => Number(key.replace(`${type}-`, '')));

  const onBulkDelete = async () => {
    const selectedFileIds = getSelectedIds('file');
    const selectedFolderIds = getSelectedIds('folder');
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
