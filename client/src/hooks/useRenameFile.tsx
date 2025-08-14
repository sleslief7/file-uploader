import { renameFile } from "@/api/fileApi";
import { toaster } from "@/components/ui/toaster";
import { queryClient } from "@/tanstack/queryClient";
import { useMutation } from "@tanstack/react-query";

type RenameMutationProp = {
    fileId: number;
    name: string
}
const useRenameFile = () => useMutation({
    mutationFn: ({ fileId, name}: RenameMutationProp) => renameFile(fileId, name),
    onSuccess: () => {
        queryClient.invalidateQueries({
            queryKey: ['items']
        });
        toaster.create({
            title: 'File renamed!',
            type: 'success',
        });
    },
})
export default useRenameFile;