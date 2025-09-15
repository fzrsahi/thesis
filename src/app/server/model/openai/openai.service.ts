import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";

const OPENAI_CONFIG = {
  apiKey: process.env.OPENAI_API_KEY!,
  temperature: 0.7,
  maxTokens: 1000,
  embeddingsModel: "text-embedding-3-small",
  baseURL: "https://openrouter.ai/api/v1",
};

export const createOpenAIClient = (modelName: string) => {
  return new ChatOpenAI({
    modelName: modelName,
    temperature: OPENAI_CONFIG.temperature,
    maxTokens: OPENAI_CONFIG.maxTokens,
    apiKey: OPENAI_CONFIG.apiKey,
    openAIApiKey: OPENAI_CONFIG.apiKey,
    configuration: {
      baseURL: OPENAI_CONFIG.baseURL,
    },
  });
};

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

  return Array.isArray(response.content)
    ? response.content
        .map((c: any) => (typeof c === "string" ? c : c?.text ?? ""))
        .join("")
    : (response.content as string);
};
