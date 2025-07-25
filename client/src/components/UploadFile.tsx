import { FileUpload, Flex } from '@chakra-ui/react';
import { HiUpload } from 'react-icons/hi';

const UploadFile = () => {
  return (
    <FileUpload.Root>
      <FileUpload.HiddenInput />
      <FileUpload.Trigger>
        <Flex gap={1} alignItems={'center'}>
          <HiUpload /> Upload file
        </Flex>
      </FileUpload.Trigger>
      <FileUpload.List />
    </FileUpload.Root>
  );
};

export default UploadFile;
