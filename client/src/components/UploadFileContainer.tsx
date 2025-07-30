import {
  Card,
  FileUpload,
  Dialog,
  Portal,
  CloseButton,
  Button,
} from '@chakra-ui/react';
import { HiUpload } from 'react-icons/hi';

type FileFormProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
};

const UploadFileContainer = ({ isOpen, setIsOpen }: FileFormProps) => {
  const handleUpload = () => {
    setIsOpen(!isOpen);
  };

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
              <FileUpload.Root maxFiles={5}>
                <FileUpload.HiddenInput />
                <FileUpload.List showSize clearable />
                <FileUpload.Trigger>
                  <Card.Root size="sm">
                    <Card.Body cursor="pointer" color="fg.muted">
                      <HiUpload />
                    </Card.Body>
                  </Card.Root>
                </FileUpload.Trigger>
              </FileUpload.Root>
            </Dialog.Body>
            <Dialog.Footer>
              <Dialog.ActionTrigger asChild>
                <Button size="xs" variant="outline">
                  Cancel
                </Button>
              </Dialog.ActionTrigger>
              <Button disabled={true} size="xs" onClick={handleUpload}>
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
