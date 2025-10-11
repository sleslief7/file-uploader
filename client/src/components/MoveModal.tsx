import { CloseButton, Dialog, Portal, Button, Box } from '@chakra-ui/react';
import Tree from './Tree';
import type { MoveFileDto } from '@/interfaces/fileInterface';
import type { MoveFolderDto } from '@/interfaces/folderInterface';
import useMoveItems from '@/hooks/useMoveItems';
import { useState } from 'react';
import { useEffect } from 'react';
import useFolderIdParam from '@/hooks/useFolderIdParam';

type MoveModalProps = {
  isOpen: boolean;
  setIsOpen: (d: boolean) => void;
  filesToMove: MoveFileDto[];
  foldersToMove: MoveFolderDto[];
};

const MoveModal = ({
  isOpen,
  setIsOpen,
  filesToMove,
  foldersToMove,
}: MoveModalProps) => {
  const [focusedValue, setFocusedValue] = useState<string | null>(null);
  const { mutate: moveItems, isPending } = useMoveItems();
  const folderId = useFolderIdParam();

  const isNodeDisabled = (nodeId: number | null) => {
    return (
      nodeId === null ||
      foldersToMove.map((f) => f.folderId).includes(nodeId) ||
      nodeId === (folderId ?? 0)
    );
  };

  const onSubmitHandler = async () => {
    if (focusedValue === null) return;
    const destinationFolderId =
      focusedValue === '0' ? null : Number(focusedValue);
    filesToMove = filesToMove.map((ftm) => {
      ftm.newFolderId = destinationFolderId;
      return ftm;
    });
    foldersToMove = foldersToMove.map((ftm) => {
      ftm.newFolderId = destinationFolderId;
      return ftm;
    });
    await moveItems(
      { filesToMove, foldersToMove },
      { onSuccess: () => setIsOpen(false) }
    );
  };

  useEffect(() => {
    if (!isOpen) {
      setFocusedValue(null);
    }
  }, [isOpen]);

  return (
    <Box onClick={(e) => e.stopPropagation()}>
      <Dialog.Root
        size='xs'
        placement='center'
        open={isOpen}
        onOpenChange={(e) => setIsOpen(e.open)}
      >
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content>
              <Dialog.Header>
                <Dialog.Title>Move item(s)</Dialog.Title>
              </Dialog.Header>
              <Dialog.Body>
                <Tree
                  focusedValue={focusedValue}
                  setFocusedValue={setFocusedValue}
                  isNodeDisabled={isNodeDisabled}
                  folderIdsBeingMoved={foldersToMove.map((f) => f.folderId)}
                />
              </Dialog.Body>
              <Dialog.Footer>
                <Dialog.ActionTrigger asChild>
                  <Button size='xs' variant='outline'>
                    Cancel
                  </Button>
                </Dialog.ActionTrigger>
                <Button
                  size='xs'
                  loading={isPending}
                  loadingText='Moving...'
                  disabled={
                    focusedValue === null ||
                    isNodeDisabled(
                      focusedValue === null ? null : Number(focusedValue)
                    )
                  }
                  onClick={onSubmitHandler}
                >
                  Move
                </Button>
              </Dialog.Footer>
              <Dialog.CloseTrigger asChild>
                <CloseButton size='sm' />
              </Dialog.CloseTrigger>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </Box>
  );
};

export default MoveModal;
