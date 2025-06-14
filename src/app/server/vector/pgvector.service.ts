import { PrismaVectorStore } from "@langchain/community/vectorstores/prisma";
import { Prisma, competitions } from "@prisma/client";

import { prisma } from "@/app/server/prisma/prisma";
import { createEmbeddingClient } from "../model/azure/azure-openai.service";

export const getCompetitionVectorStore = () => {
  return PrismaVectorStore.withModel<competitions>(prisma).create(createEmbeddingClient(), {
    prisma: Prisma,
    tableName: "competitions",
    vectorColumnName: "vector",
    columns: {
      id: PrismaVectorStore.IdColumn,
      content: PrismaVectorStore.ContentColumn,
    },
  });
};

export const getCompetitionRetriever = (k: number = 5) => {
  const vectorStore = getCompetitionVectorStore();
  return vectorStore.asRetriever(k);
};
