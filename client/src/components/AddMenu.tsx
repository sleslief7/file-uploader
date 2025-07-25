import { Menu, Portal, IconButton, Text } from '@chakra-ui/react';
import { GoPlus } from 'react-icons/go';
import UploadFile from './UploadFile';
import FolderForm from './forms/FolderForm';
import { useState } from 'react';

const AddMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Menu.Root>
      <Menu.Trigger>
        <IconButton rounded="2xl" p={3}>
          <GoPlus /> New
        </IconButton>
      </Menu.Trigger>
      <Portal>
        <Menu.Positioner>
          <Menu.Content>
            <Menu.Item value="new-file">
              <UploadFile />
            </Menu.Item>
            <Menu.Item value="new-folder">
              <Text onClick={() => setIsOpen(!isOpen)}>New Folder</Text>
            </Menu.Item>
          </Menu.Content>
        </Menu.Positioner>
      </Portal>
      <FolderForm isOpen={isOpen} setIsOpen={setIsOpen} />
    </Menu.Root>
  );
};

export default AddMenu;
