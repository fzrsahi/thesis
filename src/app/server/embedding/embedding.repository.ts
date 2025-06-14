import { prisma } from "../prisma/prisma";

interface CreateEmbeddingPayload {
  model: string;
  vector: number[];
  metadata: {
    type: string;
    id: number;
  };
}

