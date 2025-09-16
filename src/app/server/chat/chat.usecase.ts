import { sendChatCompletion } from "../model/openai/openai.service";

const MODEL_NAME = process.env.OPENAI_CHAT_MODEL || "gpt-4o-mini";

export const chatUseCase = async (message: string) => {
  try {
    const data = await sendChatCompletion(message, MODEL_NAME);
    return {
      id: "msg_1",
      content: data,
    };
  } catch (e) {
    return {
      id: "msg_1",
      content: "Maaf, sesi chat dibatalkan atau terjadi kesalahan.",
    };
  }
};
