import type { MoveFileDto } from '@/interfaces/fileInterface';
import type { MoveFolderDto } from '@/interfaces/folderInterface';
import type { SelectionType } from '@/interfaces/ItemInterface';
import { getSelectedIds } from '@/util/selectionUtils';
import { useState } from 'react';

export default function useBulkMove(selection: SelectionType) {
  const [isMoveModalOpen, setIsMoveModalOpen] = useState(false);

  const getFilesToMove = (): MoveFileDto[] =>
    getSelectedIds('file', selection).map((fileId) => ({
      fileId,
      newFolderId: null,
    }));

  const getFoldersToMove = (): MoveFolderDto[] =>
    getSelectedIds('folder', selection).map((folderId) => ({
      folderId,
      newFolderId: null,
    }));

  return {
    getFilesToMove,
    getFoldersToMove,
    isMoveModalOpen,
    setIsMoveModalOpen,
  };
}
