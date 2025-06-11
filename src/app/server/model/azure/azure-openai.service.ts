import { AzureOpenAI } from "openai";

const authorize = async () => {
  const apiKey = process.env.AZURE_OPENAI_API_KEY;
  const apiVersion = "2024-04-01-preview";
  const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
  const deployment = "gpt-4o";
  const options = { endpoint, apiKey, deployment, apiVersion };

  return new AzureOpenAI(options);
};

export const sendPrompt = async (prompt: string, model = "gpt-4o") => {
  const client = await authorize();

  const response = await client.chat.completions.create({
    messages: [
      {
        role: "system",
        content: "You are a helpful assistant.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
    model,
    response_format: { type: "json_object" },
  });

  return response.choices[0].message.content;
};
