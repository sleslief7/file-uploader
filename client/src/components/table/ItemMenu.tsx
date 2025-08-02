import { Button, Menu, Portal } from '@chakra-ui/react';
import { PiDotsThreeVerticalBold } from 'react-icons/pi';

const ItemMenu = () => {
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
