import { ActionBar, Button, Portal } from '@chakra-ui/react';
import { LuDownload, LuTrash2, LuMove, LuCopy } from 'react-icons/lu';
import { forwardRef } from 'react';
import useDeleteFiles from '@/hooks/useDeleteFiles';
import useDeleteFolders from '@/hooks/useDeleteFolders';
import { toaster } from '../ui/toaster';

interface ActionBarComponentProps {
  selection: { [key: string]: boolean };
  setSelection: (selection: { [key: string]: boolean }) => void;
}

const ActionBarComponent = forwardRef<HTMLDivElement, ActionBarComponentProps>(
  ({ selection, setSelection }, ref) => {
    const { mutateAsync: deleteFilesAsync, isPending: isDeletingFiles } =
      useDeleteFiles();
    const { mutateAsync: deleteFoldersAsync, isPending: isDeletingFolders } =
      useDeleteFolders();

    const hasSelection = Object.values(selection).some(Boolean);
    const selectionCount = Object.values(selection).filter(Boolean).length;

    const getSelectedIds = (type: 'file' | 'folder') =>
      Object.entries(selection)
        .filter(([key, value]) => value && key.startsWith(`${type}-`))
        .map(([key]) => Number(key.replace(`${type}-`, '')));

    const onBulkDeleteHandler = async () => {
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
    return (
      <ActionBar.Root open={hasSelection}>
        <Portal>
          <ActionBar.Positioner ref={ref}>
            <ActionBar.Content>
              <ActionBar.SelectionTrigger>
                {selectionCount} selected
              </ActionBar.SelectionTrigger>
              <ActionBar.Separator />
              <Button variant='outline' size='sm'>
                <LuDownload style={{ marginRight: 6 }} />
                Download
              </Button>
              <Button
                variant='outline'
                size='sm'
                onClick={onBulkDeleteHandler}
                loading={isDeletingFiles || isDeletingFolders}
                loadingText='Deleting...'
              >
                <LuTrash2 style={{ marginRight: 6 }} />
                Delete
              </Button>
              <Button variant='outline' size='sm'>
                <LuMove style={{ marginRight: 6 }} />
                Move
              </Button>
              <Button variant='outline' size='sm'>
                <LuCopy style={{ marginRight: 6 }} />
                Clone
              </Button>
            </ActionBar.Content>
          </ActionBar.Positioner>
        </Portal>
      </ActionBar.Root>
    );
  }
);

ActionBarComponent.displayName = 'ActionBarComponent';

export default ActionBarComponent;
