import useCreateFile from '@/hooks/useCreateFile';
import {
  Card,
  FileUpload,
  Dialog,
  Portal,
  CloseButton,
  Button,
  useFileUpload,
} from '@chakra-ui/react';
import { HiUpload } from 'react-icons/hi';

type FileFormProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
};

const UploadFileContainer = ({ isOpen, setIsOpen }: FileFormProps) => {
  const { mutate: createFile } = useCreateFile();
  const handleUpload = () => {
    createFile({ files: fileUpload.acceptedFiles, folderId: null });
    setIsOpen(!isOpen);
  };

  const fileUpload = useFileUpload({
    maxFiles: 5,
  });
  console.log('accepted files: ', fileUpload.acceptedFiles);

  return (
    <Dialog.Root
      size="sm"
      placement="center"
      open={isOpen}
      onOpenChange={(e) => setIsOpen(e.open)}
    >
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>Upload file</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <FileUpload.RootProvider value={fileUpload}>
                <FileUpload.HiddenInput />
                <FileUpload.List showSize clearable />
                <FileUpload.Trigger>
                  <Card.Root size="sm">
                    <Card.Body cursor="pointer" color="fg.muted">
                      <HiUpload />
                    </Card.Body>
                  </Card.Root>
                </FileUpload.Trigger>
              </FileUpload.RootProvider>
            </Dialog.Body>
            <Dialog.Footer>
              <Dialog.ActionTrigger asChild>
                <Button size="xs" variant="outline">
                  Cancel
                </Button>
              </Dialog.ActionTrigger>
              <Button size="xs" onClick={handleUpload}>
                Upload
              </Button>
            </Dialog.Footer>
            <Dialog.CloseTrigger asChild>
              <CloseButton size="sm" />
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};

export default UploadFileContainer;
