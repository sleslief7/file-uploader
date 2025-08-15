import {
  Button,
  Dialog,
  Field,
  Fieldset,
  Input,
  Text,
  Portal,
  CloseButton,
} from '@chakra-ui/react';
import useCreateFolder from '@/hooks/useCreateFolder';
import { zodResolver } from '@hookform/resolvers/zod';
import { type SubmitHandler, useForm } from 'react-hook-form';
import * as z from 'zod/v4';
import useFolderIdParam from '@/hooks/useFolderIdParam';

const schema = z.object({
  name: z.string().trim().min(1).max(18),
});

type FormFields = z.infer<typeof schema>;

type FolderFormProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
};

const FolderForm = ({ isOpen, setIsOpen }: FolderFormProps) => {
  const { mutate: createFolder } = useCreateFolder();
  const parentFolderId = useFolderIdParam();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormFields>({
    defaultValues: {
      name: '',
    },
    resolver: zodResolver(schema),
  });

  const handleCreateFolder: SubmitHandler<FormFields> = async (data) => {
    await createFolder(
      { name: data.name, parentFolderId },
      {
        onError: () => {
          setError('root', {
            message: 'Error creating folder',
          });
        },
      }
    );
    reset();
    setIsOpen(!isOpen);
  };

  return (
    <Dialog.Root
      size='xs'
      placement='center'
      open={isOpen}
      onOpenChange={(e) => setIsOpen(e.open)}
    >
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>Create Folder</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <form onSubmit={handleSubmit(handleCreateFolder)}>
                <Fieldset.Root size='md' maxW='sm'>
                  <Field.Root>
                    <Input
                      placeholder='Enter folder name'
                      {...register('name')}
                    />
                    {errors.name && (
                      <Text color={'fg.error'}>{errors.name.message}</Text>
                    )}
                  </Field.Root>
                  <Button type='submit'>
                    {isSubmitting ? 'Creating folder...' : 'Create folder'}
                  </Button>
                </Fieldset.Root>
              </form>
            </Dialog.Body>
            <Dialog.CloseTrigger asChild>
              <CloseButton size='sm' />
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};

export default FolderForm;
