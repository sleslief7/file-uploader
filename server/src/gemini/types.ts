import { Content, ContentListUnion } from '@google/genai';

export interface FunctionCallResponseOutput {
  message: string;
  output: Record<string, any>;
  error?: string | null;
}

export interface GeminiResponse {
  text: string;
  totalTokenCount: number;
  history: ContentListUnion;
}
