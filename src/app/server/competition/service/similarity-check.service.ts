import { PrismaVectorStore } from "@langchain/community/vectorstores/prisma";
import { Document } from "@langchain/core/documents";
import { Prisma } from "@prisma/client";

import { prisma } from "@/app/server/prisma/prisma";
import { getLogger } from "@/app/server/utils/helpers/pino.helper";

import { createEmbeddingClient } from "../../model/azure/azure-openai.service";

const logger = getLogger({ module: "competition/similarity-check" });

// Threshold untuk menentukan similarity (0-1, semakin tinggi semakin mirip)
const SIMILARITY_THRESHOLD = 0.85;

export interface SimilarityResult {
  isSimilar: boolean;
  similarityScore: number;
  existingCompetitionId?: number;
  existingContent?: string;
}

export interface ChunkSimilarityResult {
  chunkIndex: number;
  isSimilar: boolean;
  similarityScore: number;
  existingChunkId?: string;
  existingContent?: string;
}

/**
 * Mengecek similarity antara konten baru dengan kompetisi yang sudah ada
 */
export const checkCompetitionSimilarity = async (
  newContent: string,
  excludeCompetitionId?: number
): Promise<SimilarityResult> => {
  try {
    const vectorStore = PrismaVectorStore.withModel(prisma).create(createEmbeddingClient(), {
      prisma: Prisma,
      tableName: "competitions",
      vectorColumnName: "vector",
      columns: {
        id: PrismaVectorStore.IdColumn,
        content: PrismaVectorStore.ContentColumn,
      },
    });

    // Query untuk mencari kompetisi yang mirip
    const similarCompetitions = await vectorStore.similaritySearchWithScore(
      newContent,
      5, // Ambil 5 hasil teratas
      {
        ...(excludeCompetitionId && {
          id: {
            not: excludeCompetitionId,
          },
        }),
      }
    );

    if (similarCompetitions.length === 0) {
      logger.info("No similar competitions found");
      return {
        isSimilar: false,
        similarityScore: 0,
      };
    }

    // Ambil similarity score tertinggi
    const [mostSimilarCompetition, highestScore] = similarCompetitions[0];

    logger.info(
      {
        highestScore,
        competitionId: mostSimilarCompetition.id,
        threshold: SIMILARITY_THRESHOLD,
      },
      "Similarity check completed"
    );

    return {
      isSimilar: highestScore >= SIMILARITY_THRESHOLD,
      similarityScore: highestScore,
      existingCompetitionId: mostSimilarCompetition.id as unknown as number,
      existingContent: mostSimilarCompetition.pageContent,
    };
  } catch (error) {
    logger.error({ error: String(error) }, "Error checking competition similarity");
    throw error;
  }
};

/**
 * Mengecek similarity untuk setiap chunk dokumen
 */
export const checkDocumentChunksSimilarity = async (
  chunks: Document[],
  excludeCompetitionId?: number
): Promise<ChunkSimilarityResult[]> => {
  try {
    const vectorStore = PrismaVectorStore.withModel(prisma).create(createEmbeddingClient(), {
      prisma: Prisma,
      tableName: "documentChunks",
      vectorColumnName: "vector",
      columns: {
        id: PrismaVectorStore.IdColumn,
        content: PrismaVectorStore.ContentColumn,
      },
    });

    // Process all chunks in parallel to avoid await in loop
    const chunkPromises = chunks.map(async (chunk, i) => {
      try {
        // Query untuk mencari chunk yang mirip
        const similarChunks = await vectorStore.similaritySearchWithScore(
          chunk.pageContent,
          3, // Ambil 3 hasil teratas
          {
            ...(excludeCompetitionId && {
              competitionId: {
                not: excludeCompetitionId,
              },
            }),
          }
        );

        if (similarChunks.length === 0) {
          return {
            chunkIndex: i,
            isSimilar: false,
            similarityScore: 0,
          };
        }
        // Ambil similarity score tertinggi
        const [mostSimilarChunk, highestScore] = similarChunks[0];

        const isSimilar = highestScore >= SIMILARITY_THRESHOLD;

        logger.debug(
          {
            chunkIndex: i,
            highestScore,
            isSimilar,
            threshold: SIMILARITY_THRESHOLD,
          },
          "Chunk similarity check completed"
        );

        return {
          chunkIndex: i,
          isSimilar,
          similarityScore: highestScore,
          existingChunkId: mostSimilarChunk.id as string,
          existingContent: mostSimilarChunk.pageContent,
        };
      } catch (chunkError) {
        logger.error(
          { chunkIndex: i, error: String(chunkError) },
          "Error checking chunk similarity"
        );

        // Jika error, anggap tidak similar dan lanjutkan
        return {
          chunkIndex: i,
          isSimilar: false,
          similarityScore: 0,
        };
      }
    });

    const results = await Promise.all(chunkPromises);

    logger.info(
      {
        totalChunks: chunks.length,
        similarChunks: results.filter((r) => r.isSimilar).length,
        uniqueChunks: results.filter((r) => !r.isSimilar).length,
      },
      "Document chunks similarity check completed"
    );

    return results;
  } catch (error) {
    logger.error({ error: String(error) }, "Error checking document chunks similarity");
    throw error;
  }
};

/**
 * Filter chunks berdasarkan similarity check
 * Mengembalikan hanya chunks yang tidak similar (unique)
 */
export const filterUniqueChunks = (
  chunks: Document[],
  similarityResults: ChunkSimilarityResult[]
): Document[] => {
  const uniqueChunks: Document[] = [];

  for (let i = 0; i < chunks.length; i += 1) {
    const similarityResult = similarityResults.find((r) => r.chunkIndex === i);

    if (!similarityResult || !similarityResult.isSimilar) {
      uniqueChunks.push(chunks[i]);
    } else {
      logger.debug(
        {
          chunkIndex: i,
          similarityScore: similarityResult.similarityScore,
          existingChunkId: similarityResult.existingChunkId,
        },
        "Skipping similar chunk"
      );
    }
  }

  logger.info(
    {
      originalChunks: chunks.length,
      uniqueChunks: uniqueChunks.length,
      skippedChunks: chunks.length - uniqueChunks.length,
    },
    "Chunks filtered based on similarity"
  );

  return uniqueChunks;
};

/**
 * Mendapatkan summary similarity check untuk logging
 */
export const getSimilaritySummary = (
  similarityResults: ChunkSimilarityResult[]
): {
  totalChunks: number;
  similarChunks: number;
  uniqueChunks: number;
  averageSimilarity: number;
} => {
  const totalChunks = similarityResults.length;
  const similarChunks = similarityResults.filter((r) => r.isSimilar).length;
  const uniqueChunks = totalChunks - similarChunks;
  const averageSimilarity =
    similarityResults.reduce((sum, r) => sum + r.similarityScore, 0) / totalChunks;

  return {
    totalChunks,
    similarChunks,
    uniqueChunks,
    averageSimilarity: Math.round(averageSimilarity * 100) / 100,
  };
};
