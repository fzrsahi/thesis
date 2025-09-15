import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";

const OPENAI_CONFIG = {
  apiKey: process.env.OPENAI_API_KEY!,
  temperature: 0.7,
  maxTokens: 1000,
  embeddingsModel: "text-embedding-3-small",
  baseURL: "https://openrouter.ai/api/v1",
};

export const createOpenAIClient = (modelName: string) =>
  new ChatOpenAI({
    modelName,
    temperature: OPENAI_CONFIG.temperature,
    maxTokens: OPENAI_CONFIG.maxTokens,
    apiKey: OPENAI_CONFIG.apiKey,
    openAIApiKey: OPENAI_CONFIG.apiKey,
    configuration: {
      baseURL: OPENAI_CONFIG.baseURL,
    },
  });

export const createEmbeddingClient = () =>
  new OpenAIEmbeddings({
    modelName: OPENAI_CONFIG.embeddingsModel,
    apiKey: OPENAI_CONFIG.apiKey,
    configuration: {
      baseURL: OPENAI_CONFIG.baseURL,
    },
  });

export const sendChatCompletion = async (prompt: string, modelName: string) => {
  const model = createOpenAIClient(modelName);
  const response = await model.invoke(prompt);

  if (Array.isArray(response.content)) {
    return response.content
      .map((c) => {
        if (typeof c === "string") {
          return c;
        }
        if (c && "text" in c) {
          return c.text;
        }
        return "";
      })
      .join("");
  }
  return response.content;
};
