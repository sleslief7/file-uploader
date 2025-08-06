import { getSignedUrl } from '@/api/fileApi';
import useDeleteFile from '@/hooks/useDeleteFile';
import useDeleteFolder from '@/hooks/useDeleteFolder';
import type { ItemType } from '@/interfaces/ItemInterface';
import { Button, Menu, Portal } from '@chakra-ui/react';
import { PiDotsThreeVerticalBold } from 'react-icons/pi';
import { toaster } from '../ui/toaster';

type ItemMenuProp = {
  item: ItemType;
};
const ItemMenu = ({ item }: ItemMenuProp) => {
  const { mutate: deleteFile } = useDeleteFile();
  const { mutate: deleteFolder } = useDeleteFolder();

  const handleDelete = () => {
    toaster.loading({
      title: `Deleting ${item.isFile ? 'file' : 'folder'}...`,
    });
    if (item.isFile) {
      deleteFile(item.id);
    } else {
      deleteFolder(item.id);
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

  return (
    <Menu.Root>
      <Menu.Trigger asChild>
        <Button variant="outline" size="xs">
          <PiDotsThreeVerticalBold />
        </Button>
      </Menu.Trigger>
      <Portal>
        <Menu.Positioner>
          <Menu.Content>
            <Menu.Item value="rename">Rename</Menu.Item>
            {item.isFile && (
              <Menu.Item value="download" onClick={handleDownload}>
                Download
              </Menu.Item>
            )}
            <Menu.Item
              value="delete"
              color="fg.error"
              _hover={{ bg: 'bg.error', color: 'fg.error' }}
              onClick={handleDelete}
            >
              Delete...
            </Menu.Item>
          </Menu.Content>
        </Menu.Positioner>
      </Portal>
    </Menu.Root>
  );
};

export default ItemMenu;
