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

const schema = z.object({
  name: z.string().trim().min(1),
});

type FormFields = z.infer<typeof schema>;

type FolderFormProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
};

const FolderForm = ({ isOpen, setIsOpen }: FolderFormProps) => {
  const { mutate: createFolder } = useCreateFolder();

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
    await createFolder(data.name, {
      onError: () => {
        setError('root', {
          message: 'Error creating folder',
        });
      },
    });
    reset();
    setIsOpen(!isOpen);
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={(e) => setIsOpen(e.open)}>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <form onSubmit={handleSubmit(handleCreateFolder)}>
              <Fieldset.Root size="lg" maxW="md">
                <Fieldset.Legend fontSize="xl">Folder name</Fieldset.Legend>
                <Field.Root>
                  <Field.Label id="name">name: </Field.Label>
                  <Input
                    placeholder="Enter folder name"
                    {...register('name')}
                  />
                  {errors.name && (
                    <Text color={'fg.error'}>{errors.name.message}</Text>
                  )}
                </Field.Root>
                <Button type="submit">
                  {isSubmitting ? 'Creating folder...' : 'Create folder'}
                </Button>
              </Fieldset.Root>
            </form>
            <Dialog.CloseTrigger asChild>
              <CloseButton size="sm" />
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};

export default FolderForm;
