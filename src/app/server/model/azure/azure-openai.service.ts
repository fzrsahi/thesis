import { AzureOpenAIEmbeddings, AzureChatOpenAI } from "@langchain/openai";

const AZURE_CONFIG = {
  apiKey: process.env.AZURE_OPENAI_API_KEY!,
  apiVersion: "2024-08-01-preview",
  gptEndpoint: process.env.AZURE_OPENAI_GPT_ENDPOINT!,
  chatDeployment: "gpt-4o",
  embeddingsDeployment: "text-embedding-3-small",
  instanceName: process.env.AZURE_OPENAI_INSTANCE_NAME,
  embeddingsApiVersion: "2024-04-01-preview",
};

export const createOpenAIClient = () =>
  new AzureChatOpenAI({
    modelName: AZURE_CONFIG.chatDeployment,
    temperature: 0.3,
    maxTokens: 40000,
    azureOpenAIApiKey: AZURE_CONFIG.apiKey,
    azureOpenAIApiInstanceName: AZURE_CONFIG.instanceName,
    azureOpenAIApiDeploymentName: AZURE_CONFIG.chatDeployment,
    azureOpenAIApiVersion: AZURE_CONFIG.apiVersion,
  });

export const createEmbeddingClient = () =>
  new AzureOpenAIEmbeddings({
    azureOpenAIApiKey: AZURE_CONFIG.apiKey,
    azureOpenAIApiInstanceName: AZURE_CONFIG.instanceName,
    azureOpenAIApiEmbeddingsDeploymentName: AZURE_CONFIG.embeddingsDeployment,
    azureOpenAIApiVersion: AZURE_CONFIG.embeddingsApiVersion,
  });

export const sendChatCompletion = async (prompt: string) => {
  const model = createOpenAIClient();
  const response = await model.invoke(prompt);
  const content = response.content as unknown;
  if (typeof content === "string") return content;
  if (Array.isArray(content)) {
    return content
      .map((part: string | { type?: string; text?: string }) => {
        if (typeof part === "string") return part;
        if (
          typeof part === "object" &&
          part !== null &&
          part.type === "text" &&
          typeof part.text === "string"
        ) {
          return part.text;
        }
        return "";
      })
      .join("");
  }
  return String(content ?? "");
};
