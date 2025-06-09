import axios from "axios";

export const generateVector = async (text: string) => {
  const response = await axios.post(
    process.env.AZURE_OPENAI_ENDPOINT as string,
    { input: text },
    {
      headers: {
        "Content-Type": "application/json",
        "api-key": process.env.AZURE_OPENAI_API_KEY as string,
      },
    }
  );

  return response.data.data[0].embedding;
};
