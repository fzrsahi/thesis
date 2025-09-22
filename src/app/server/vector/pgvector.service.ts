import { PrismaVectorStore } from "@langchain/community/vectorstores/prisma";
import { Prisma, competitions, documentChunks, StudentDocumentChunk } from "@prisma/client";

import { prisma } from "@/app/server/prisma/prisma";

import { createEmbeddingClient } from "../model/azure/azure-openai.service";

export const getCompetitionVectorStore = () =>
  PrismaVectorStore.withModel<competitions>(prisma).create(createEmbeddingClient(), {
    prisma: Prisma,
    tableName: "competitions",
    vectorColumnName: "vector",
    columns: {
      id: PrismaVectorStore.IdColumn,
      content: PrismaVectorStore.ContentColumn,
    },
  });

export const getDocumentChunksVectorStore = () =>
  PrismaVectorStore.withModel<documentChunks>(prisma).create(createEmbeddingClient(), {
    prisma: Prisma,
    tableName: "documentChunks",
    vectorColumnName: "vector",
    columns: {
      id: PrismaVectorStore.IdColumn,
      content: PrismaVectorStore.ContentColumn,
    },
  });

export const getCompetitionRetriever = (k: number = 5) => {
  const vectorStore = getCompetitionVectorStore();
  return vectorStore.asRetriever(k);
};

export const getDocumentChunksRetriever = (competitionId: number, k: number = 5) => {
  const vectorStore = getDocumentChunksVectorStore();
  return vectorStore.asRetriever(k, {
    competitionId: {
      in: [competitionId],
    },
  });
};

export const getStudentDocumentChunksVectorStore = () =>
  PrismaVectorStore.withModel<StudentDocumentChunk>(prisma).create(createEmbeddingClient(), {
    prisma: Prisma,
    tableName: "studentDocumentChunks",
    vectorColumnName: "vector",
    columns: {
      id: PrismaVectorStore.IdColumn,
      content: PrismaVectorStore.ContentColumn,
    },
  } as never);

export const getStudentDocumentRetriever = (studentId: number, k: number = 5) => {
  const vectorStore = getStudentDocumentChunksVectorStore();
  return vectorStore.asRetriever(k, {
    studentId: {
      in: [studentId],
    },
  });
};
