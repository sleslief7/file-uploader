import { GoogleGenAI, Content, FunctionResponse } from '@google/genai';
import systemInstructions from './systemInstructions';
import FUNCTION_DECLARATIONS from './functionDeclarations';
import executeFunctionCall from './executeFunctionCall';
import { GeminiResponse } from './types';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

const aiGen = async (
  userId: number,
  userInput: string,
  history: Content[],
  currentFolderId: number | null
): Promise<GeminiResponse> => {
  try {
    let contents: Content[] = [
      ...history,
      { role: 'user', parts: [{ text: userInput }] },
    ];

    const model = process.env.GEMINI_MODEL!;

    const config = {
      systemInstruction: [
        { text: systemInstructions(userId, currentFolderId) },
      ],
      thinkingConfig: {
        thinkingBudget: Number(process.env.GEMINI_THINKING_BUDGET!),
      },
      tools: [{ functionDeclarations: FUNCTION_DECLARATIONS }],
      candidateCount: 1,
      //responseSchema: RESPONSE_SCHEMA,
    };

    let response = await ai.models.generateContent({ model, contents, config });
    let functionCalls = response.functionCalls;

    let totalTokenCount = response.usageMetadata?.totalTokenCount!;
    let callCount = 1;

    while (functionCalls) {
      if (totalTokenCount > 40_000 || callCount > 15)
        throw new Error('Request is too big, please break it down');

      contents.push(response.candidates![0].content!);

      for (const functionCall of functionCalls) {
        const { id, name } = functionCall;

        const functionCallResponseOutput = await executeFunctionCall(
          functionCall,
          userId,
          currentFolderId
        );

        const functionResponse: FunctionResponse = {
          id,
          name,
          response: { ...functionCallResponseOutput },
        };

        contents.push({
          parts: [{ functionResponse }],
        });
      }

      response = await ai.models.generateContent({ model, contents, config });
      functionCalls = response.functionCalls;
      totalTokenCount += response.usageMetadata?.totalTokenCount ?? 0;

      callCount += 1;
    }

    const candidate = response.candidates![0];
    const { content, finishMessage, tokenCount, finishReason } = candidate;
    const text = response.text;

    if (!text) {
      const candidateString = JSON.stringify(candidate);
      const errMsg = `Text response not found in candidate {${candidateString}}`;
      console.log(errMsg);
      throw new Error(errMsg);
    }

    contents.push(content!);

    return {
      text: text,
      totalTokenCount,
      history: contents,
    };
  } catch (error) {
    console.error('Error generating gemini response:', error);
    throw error;
  }
};

export default aiGen;
