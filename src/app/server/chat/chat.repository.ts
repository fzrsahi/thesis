import { prisma } from "../prisma/prisma";

export const findOrCreateLatestSessionForUser = async (userId: number) => {
  const latest = await prisma.lLMChatSession.findFirst({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
  if (latest) return latest;
  return prisma.lLMChatSession.create({
    data: {
      userId,
      title: null,
    },
  });
};

export const appendMessageToSession = async (
  sessionId: number,
  role: "user" | "assistant",
  content: string
) =>
  prisma.lLMChatMessage.create({
    data: { sessionId, role, content },
  });

export const getLastMessagesForUser = async (userId: number, limit = 10) => {
  const session = await prisma.lLMChatSession.findFirst({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  if (!session) return [];

  const messages = await prisma.lLMChatMessage.findMany({
    where: { sessionId: session.id },
    orderBy: { createdAt: "desc" },
    take: limit,
  });

  return messages.reverse();
};
