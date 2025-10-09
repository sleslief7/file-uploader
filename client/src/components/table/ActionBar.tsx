import { ActionBar, Button, Portal } from '@chakra-ui/react';
import { LuDownload, LuTrash2, LuMove, LuCopy } from 'react-icons/lu';
import { forwardRef } from 'react';
import useBulkDelete from '@/hooks/useBulkDelete';

interface ActionBarComponentProps {
  selection: { [key: string]: boolean };
  setSelection: (selection: { [key: string]: boolean }) => void;
}

const ActionBarComponent = forwardRef<HTMLDivElement, ActionBarComponentProps>(
  ({ selection, setSelection }, ref) => {
    const hasSelection = Object.values(selection).some(Boolean);
    const selectionCount = Object.values(selection).filter(Boolean).length;

    const { onBulkDelete, isDeleting } = useBulkDelete(selection, setSelection);

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
                onClick={onBulkDelete}
                loading={isDeleting}
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
