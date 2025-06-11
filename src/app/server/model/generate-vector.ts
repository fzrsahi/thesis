import axios from "axios";

export const generateVector = async (text: string) => {
  const response = await axios.post(
    process.env.AZURE_EMBEDDINGS_ENDPOINT as string,
    { input: text },
    {
      headers: {
        "Content-Type": "application/json",
        "api-key": process.env.AZURE_EMBEDDINGS_API_KEY as string,
      },
    }
  );

  return response.data.data[0].embedding;
};
