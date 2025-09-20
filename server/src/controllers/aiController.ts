import expressAsyncHandler from 'express-async-handler';
import { AIGenerateRequest } from '../interfaces';
import { aiGenerate } from '../services/aiService';

export const aiGenerateHandler = expressAsyncHandler(async (req, res) => {
  const { userInput, history, currentFolderId } = req.body as AIGenerateRequest;

  const geminiResponse = await aiGenerate(
    req.user!.id,
    userInput,
    history,
    currentFolderId
  );

  res.status(200).send(geminiResponse);
});
