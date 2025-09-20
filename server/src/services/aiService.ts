import { Content } from '@google/genai';
import aiGen from '../gemini/gemini';
import { GeminiResponse } from '../gemini/types';
import { BadRequestError } from '../validation/errors';

export const aiGenerate = async (
  userId: number,
  userInput: string,
  history: Content[],
  currentFolderId: number | null
): Promise<GeminiResponse> => {
  if (!userInput) throw new BadRequestError('Must provide user input');
  if (currentFolderId === undefined)
    throw new BadRequestError('Must provide current folder id');
  return await aiGen(userId, userInput, history, currentFolderId);
};
