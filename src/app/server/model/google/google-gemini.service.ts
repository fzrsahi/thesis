import { GoogleGenAI } from "@google/genai";

const GOOGLE_CONFIG = {
  apiKey: process.env.GOOGLE_API_KEY!,
  apiVersion: "2024-04-01-preview",
  endpoint: process.env.GOOGLE_ENDPOINT!,
  chatDeployment: "gemini-2.0-flash-001",
};

const createGeminiClient = () => {
  const options = {
    endpoint: GOOGLE_CONFIG.endpoint,
    apiKey: GOOGLE_CONFIG.apiKey,
    deployment: GOOGLE_CONFIG.chatDeployment,
    apiVersion: GOOGLE_CONFIG.apiVersion,
  };

  return new GoogleGenAI(options);
};

export const sendPrompt = async (prompt: string) => {
  const response = await createGeminiClient().models.generateContent({
    model: "gemini-2.5-flash-001",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        name: "competition",
        schema: {
          type: "object",
          properties: {
            title: {
              type: "string",
            },
          },
        },
      },
    },
  });
};
