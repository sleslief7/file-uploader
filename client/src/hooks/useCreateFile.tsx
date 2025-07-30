import { createFile } from '@/api/fileApi';
import { toaster } from '@/components/ui/toaster';
// import { queryClient } from '@/tanstack/queryClient';
import { useMutation } from '@tanstack/react-query';

type FileMutationType = {
  file: File;
  folderId: number | null;
};
const useCreateFile = () =>
  useMutation({
    mutationFn: ({ file, folderId }: FileMutationType) =>
      createFile(file, folderId),
    onSuccess: (file) => {
      // TODO: invalidate query for the get items
      console.log(file);
      toaster.create({
        title: 'File created!',
        type: 'success',
      });
    },
  });

export default useCreateFile;
