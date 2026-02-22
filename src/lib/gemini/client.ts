import { GoogleGenAI } from "@google/genai";

export function createGeminiClient(apiKey: string): GoogleGenAI {
  return new GoogleGenAI({ apiKey });
}

export const MODEL_MAP = {
  "gemini-2.5-flash": "gemini-2.5-flash",
  "gemini-3-flash-preview": "gemini-3-flash-preview",
} as const;

export type ModelKey = keyof typeof MODEL_MAP;
