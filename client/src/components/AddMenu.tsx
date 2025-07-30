import { Menu, Portal, IconButton, Text, Flex } from '@chakra-ui/react';
import { GoPlus } from 'react-icons/go';
import UploadFileContainer from './UploadFileContainer';
import FolderForm from './forms/FolderForm';
import { useState } from 'react';
import { HiUpload } from 'react-icons/hi';
import { HiFolderAdd } from 'react-icons/hi';

const AddMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isFileOpen, setIsFileOpen] = useState(false);

  return (
    <Menu.Root>
      <Menu.Trigger>
        <IconButton size="sm" rounded="sm" px={1}>
          <GoPlus /> New
        </IconButton>
      </Menu.Trigger>
      <Portal>
        <Menu.Positioner>
          <Menu.Content>
            <Menu.Item cursor="pointer" value="new-folder">
              <Text onClick={() => setIsOpen(!isOpen)}>
                <Flex gap={1} alignItems={'center'}>
                  <HiFolderAdd />
                  New Folder
                </Flex>
              </Text>
            </Menu.Item>
            <Menu.Item cursor="pointer" value="new-file">
              <Text onClick={() => setIsFileOpen(!isFileOpen)}>
                <Flex gap={1} alignItems={'center'}>
                  <HiUpload />
                  Upload File
                </Flex>
              </Text>
            </Menu.Item>
          </Menu.Content>
        </Menu.Positioner>
      </Portal>
      <UploadFileContainer isOpen={isFileOpen} setIsOpen={setIsFileOpen} />
      <FolderForm isOpen={isOpen} setIsOpen={setIsOpen} />
    </Menu.Root>
  );
};

export default AddMenu;
