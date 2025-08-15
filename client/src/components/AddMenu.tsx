import { Menu, Portal, Text, Flex, IconButton } from '@chakra-ui/react';
import UploadFileContainer from './UploadFileContainer';
import FolderForm from './forms/FolderForm';
import { HiUpload } from 'react-icons/hi';
import { HiFolderAdd } from 'react-icons/hi';
import { IoMdAdd } from 'react-icons/io';
import { useModal } from '@/hooks/useModal';

const AddMenu = () => {
  const { isFolderOpen, setIsFolderOpen, isFileOpen, setIsFileOpen } =
    useModal();

  return (
    <Menu.Root>
      <Menu.Trigger>
        <IconButton
          aria-label='Add Menu'
          variant='outline'
          size='sm'
          cursor='pointer'
          px={2}
        >
          <IoMdAdd /> New
        </IconButton>
      </Menu.Trigger>
      <Portal>
        <Menu.Positioner>
          <Menu.Content>
            <Menu.Item cursor='pointer' value='new-folder'>
              <Text onClick={() => setIsFolderOpen(!isFolderOpen)}>
                <Flex gap={1} alignItems={'center'}>
                  <HiFolderAdd />
                  New Folder
                </Flex>
              </Text>
            </Menu.Item>
            <Menu.Item cursor='pointer' value='new-file'>
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
      <FolderForm isOpen={isFolderOpen} setIsOpen={setIsFolderOpen} />
    </Menu.Root>
  );
};

export default AddMenu;
