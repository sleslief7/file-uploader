import useRenameFile from "@/hooks/useRenameFile";
import useRenameFolder from "@/hooks/useRenameFolder";
import type { ItemType } from "@/interfaces/ItemInterface";
import { Button, CloseButton, Dialog, Field, Fieldset, Input, Portal } from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import * as z from 'zod/v4';

const schema = z.object({
  name: z.string().trim().min(1),
});

type FormFields = z.infer<typeof schema>;

type RenameModalProps = {
  isOpen: boolean;
  setIsOpen: (d: boolean) => void;
  item: ItemType
};

const RenameModal = ({ isOpen,setIsOpen, item }: RenameModalProps) => {
    const { mutate: renameFile} = useRenameFile();
    const { mutate: renameFolder } = useRenameFolder();
      const {
        register,
        handleSubmit,
        formState: { isSubmitting },
        reset,
      } = useForm<FormFields>({
        defaultValues: {
          name: item.name,
        },
        resolver: zodResolver(schema),
      });
      
    const handleRename: SubmitHandler<FormFields> = async(data) => {
        if(item.isFile) {
            await renameFile({fileId: item.id, name: data.name})
        } else {
            await renameFolder({folderId: item.id, name: data.name})
        }
        reset();
        setIsOpen(!isOpen)
    }

    return (
      <Dialog.Root
        size="xs"
        placement="center"
        open={isOpen}
        onOpenChange={(e) => setIsOpen(e.open)}
      >
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content>
              <Dialog.Header>
                <Dialog.Title>Rename {`${item.isFile ? 'File' : 'Folder'}`}</Dialog.Title>
              </Dialog.Header>
              <Dialog.Body>
                <form onSubmit={handleSubmit(handleRename)}>
                  <Fieldset.Root size="md" maxW="sm">
                    <Field.Root>
                      <Input
                        placeholder="Enter new name"
                        {...register('name')}
                      />
                    </Field.Root>
                    <Button type="submit">
                      {isSubmitting ? 'Renaming...' : 'Rename'}
                    </Button>
                  </Fieldset.Root>
                </form>
              </Dialog.Body>
              <Dialog.CloseTrigger asChild>
                <CloseButton size="sm" />
              </Dialog.CloseTrigger>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    );
}

export default RenameModal