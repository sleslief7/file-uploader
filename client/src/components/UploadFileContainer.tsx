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
import { toaster } from './ui/toaster';
import useFolderIdParam from '@/hooks/useFolderIdParam';

type FileFormProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
};

const UploadFileContainer = ({ isOpen, setIsOpen }: FileFormProps) => {
  const folderId = useFolderIdParam();
  const { mutate: createFile, isPending } = useCreateFile();

  const handleUpload = () => {
    if (isPending) return;

    toaster.loading({ title: 'Uploading...' });
    createFile(
      { files: fileUpload.acceptedFiles, folderId },
      {
        onSuccess: () => {
          toaster.dismiss();
          toaster.success({ title: 'Uploaded successfully!' });
          setIsOpen(!isOpen);
          fileUpload.clearFiles();
        },
        onError: () => {
          toaster.dismiss();
          toaster.error({ title: 'Error while uploading file(s)' });
        },
      }
    );
  };

  const fileUpload = useFileUpload({
    maxFiles: 5,
    maxFileSize: 5 * 1024 * 1024, // 5MB
  });

  const handleOnOpenChange = (e: { open: boolean }) => {
    setIsOpen(e.open);
    fileUpload.clearFiles();
  };

  return (
    <Dialog.Root
      size='sm'
      placement='center'
      open={isOpen}
      onOpenChange={handleOnOpenChange}
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
                  <Card.Root size='sm'>
                    <Card.Body cursor='pointer' color='fg.muted'>
                      <HiUpload />
                    </Card.Body>
                  </Card.Root>
                </FileUpload.Trigger>
              </FileUpload.RootProvider>
            </Dialog.Body>
            <Dialog.Footer>
              <Dialog.ActionTrigger asChild>
                <Button size='xs' variant='outline'>
                  Cancel
                </Button>
              </Dialog.ActionTrigger>
              <Button
                size='xs'
                loading={isPending}
                loadingText='Uploading...'
                onClick={handleUpload}
              >
                Upload
              </Button>
            </Dialog.Footer>
            <Dialog.CloseTrigger asChild>
              <CloseButton size='sm' />
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};

export default UploadFileContainer;
