import apiClient from './apiClient';
import { type ContentListUnion } from '@google/genai';

type AIGenerateRequest = {
  userInput: string;
  history: ContentListUnion;
  currentFolderId: number | null;
};

export type AIGenerateResponse = {
  text: string;
  totalTokenCount: number;
  history: ContentListUnion;
};

export const aiGenerate = async (
  data: AIGenerateRequest
): Promise<AIGenerateResponse> => {
  const response = await apiClient.post<AIGenerateResponse>('/ai', data);
  return response.data;
};
