import useDeleteFile from '@/hooks/useDeleteFile';
import useDeleteFolder from '@/hooks/useDeleteFolder';
import type { ItemType } from '@/interfaces/ItemInterface';
import { Button, Menu, Portal } from '@chakra-ui/react';
import { PiDotsThreeVerticalBold } from 'react-icons/pi';

type ItemMenuProp = {
  item: ItemType;
};
const ItemMenu = ({ item }: ItemMenuProp) => {
  const { mutate: deleteFile } = useDeleteFile();
  const { mutate: deleteFolder } = useDeleteFolder();

  const handleDelete = () => {
    if (item.isFile) {
      deleteFile(item.id);
    } else {
      deleteFolder(item.id);
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
            <Menu.Item value="download">Download</Menu.Item>
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
