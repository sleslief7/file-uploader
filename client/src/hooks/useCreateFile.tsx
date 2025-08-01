import { createFile } from '@/api/fileApi';
import { toaster } from '@/components/ui/toaster';
// import { queryClient } from '@/tanstack/queryClient';
import { useMutation } from '@tanstack/react-query';

type FileMutationType = {
  files: File[];
  folderId: number | null;
};

const useCreateFile = () =>
  useMutation({
    mutationFn: ({ files, folderId }: FileMutationType) =>
      createFile(files, folderId),
    onSuccess: (files) => {
      // TODO: invalidate query for the get items
      console.log(files);
      toaster.create({
        title: 'File created!',
        type: 'success',
      });
    },
  });

export default useCreateFile;
