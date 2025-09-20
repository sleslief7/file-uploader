import { useMutation } from '@tanstack/react-query';
import useFolderIdParam from './useFolderIdParam';
import { aiGenerate, type AIGenerateResponse } from '../api/aiApi';
import { type ContentListUnion } from '@google/genai';
import { queryClient } from '@/tanstack/queryClient';

const useAiChat = () => {
  const currentFolderId = useFolderIdParam();

  const mutation = useMutation({
    mutationFn: async (data: {
      userInput: string;
      history: ContentListUnion;
    }): Promise<AIGenerateResponse> => {
      const { userInput, history } = data;

      const response = await aiGenerate({
        userInput,
        history,
        currentFolderId,
      });

      return response;
    },
    onSettled: () => {
      queryClient.invalidateQueries();
    },
  });

  const sendMessage = async (message: string, history: ContentListUnion) => {
    return await mutation.mutateAsync({
      userInput: message,
      history,
    });
  };

  return {
    sendMessage,
    isPending: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
  };
};

export default useAiChat;
