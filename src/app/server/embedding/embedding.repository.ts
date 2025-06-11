import { prisma } from "../prisma/prisma";

interface CreateEmbeddingPayload {
  model: string;
  vector: number[];
  metadata: {
    type: string;
    id: number;
  };
}

export const createEmbedding = async (payload: CreateEmbeddingPayload) => {
  const vectorString = `[${payload.vector.join(",")}]`;

  return prisma.$executeRaw`
    INSERT INTO "embeddings" (model, vector, metadata, "createdAt")
    VALUES (${payload.model}, ${vectorString}::vector, ${payload.metadata}::jsonb, ${new Date()})
  `;
};
