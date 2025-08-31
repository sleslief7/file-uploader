import { getSignedUrl } from '@/api/fileApi';
import useDeleteFiles from '@/hooks/useDeleteFiles';
import useDeleteFolders from '@/hooks/useDeleteFolders';
import type { ItemType } from '@/interfaces/ItemInterface';
import { Button, Menu, Portal } from '@chakra-ui/react';
import { PiDotsThreeVerticalBold } from 'react-icons/pi';
import { toaster } from '../ui/toaster';
import RenameModal from '../RenameModal';
import { useState } from 'react';
import MoveModal from '../MoveModal';
import type { MoveFileDto } from '@/interfaces/fileInterface';
import type { MoveFolderDto } from '@/interfaces/folderInterface';

type ItemMenuProp = {
  item: ItemType;
};

const ItemMenu = ({ item }: ItemMenuProp) => {
  const [isRenameOpen, setIsRenameOpen] = useState(false);
  const [isMoveOpen, setIsMoveOpen] = useState(false);

  const { mutate: deleteFiles } = useDeleteFiles();
  const { mutate: deleteFolders } = useDeleteFolders();

  const handleDelete = () => {
    toaster.loading({
      title: `Deleting ${item.isFile ? 'file' : 'folder'}...`,
    });
    if (item.isFile) {
      deleteFiles([item.id]);
    } else {
      deleteFolders([item.id]);
    }

    toaster.dismiss();
    toaster.success({ title: 'Deleted successfully!' });
  };

  const handleDownload = async () => {
    if (!item.isFile) return;

    toaster.loading({ title: 'Downloading...' });
    try {
      const signedUrl = await getSignedUrl(item.id);
      const response = await fetch(signedUrl);
      const blob = await response.blob();

      const url = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = item.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(url);
      toaster.dismiss();
      toaster.success({ title: 'Successfully downloaded!' });
    } catch (err) {
      toaster.dismiss();
      toaster.error({ title: 'Download failed' });
      console.log('Error while downloading file', err);
    }
  };

  const filesToMove: MoveFileDto[] = item.isFile
    ? [{ fileId: item.id, newFolderId: null }]
    : [];
  const foldersToMove: MoveFolderDto[] = !item.isFile
    ? [{ folderId: item.id, newFolderId: null }]
    : [];

  return (
    <Menu.Root>
      <Menu.Trigger asChild onClick={(e) => e.stopPropagation()}>
        <Button variant='ghost' size='xs'>
          <PiDotsThreeVerticalBold />
        </Button>
      </Menu.Trigger>
      <Portal>
        <Menu.Positioner>
          <Menu.Content>
            <Menu.Item
              value='rename'
              onClick={() => setIsRenameOpen(!isRenameOpen)}
            >
              Rename
            </Menu.Item>
            <Menu.Item value='move' onClick={() => setIsMoveOpen(!isMoveOpen)}>
              Move
            </Menu.Item>
            {item.isFile && (
              <Menu.Item value='download' onClick={handleDownload}>
                Download
              </Menu.Item>
            )}
            <Menu.Item
              value='delete'
              color='fg.error'
              _hover={{ bg: 'bg.error', color: 'fg.error' }}
              onClick={handleDelete}
            >
              Delete...
            </Menu.Item>
          </Menu.Content>
        </Menu.Positioner>
      </Portal>
      <RenameModal
        isOpen={isRenameOpen}
        item={item}
        setIsOpen={setIsRenameOpen}
      />
      <MoveModal
        isOpen={isMoveOpen}
        setIsOpen={setIsMoveOpen}
        filesToMove={filesToMove}
        foldersToMove={foldersToMove}
      />
    </Menu.Root>
  );
};

export default ItemMenu;
