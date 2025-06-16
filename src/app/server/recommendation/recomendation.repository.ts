import { Prisma } from "@prisma/client";

import { RecommendationResponse } from "../model/azure/types/recomendation.types";
import { prisma } from "../prisma/prisma";

export const findRecommendationByStudentId = async (
  studentId: number,
  select: Prisma.RecommendationSelect = {
    id: true,
    studentId: true,
    prompt: true,
    response: true,
    createdAt: true,
  }
) =>
  prisma.recommendation.findFirst({
    where: {
      studentId,
    },
    select,
  });

type CreateRecommendationArgs = {
  studentId: number;
  competitionIds: number[];
};

type RecommendationMetadata = {
  prompt: string;
  recommendation: RecommendationResponse;
};

export const createRecommendation = async (
  { studentId, competitionIds }: CreateRecommendationArgs,
  { prompt, recommendation }: RecommendationMetadata,
  matchScore: number
) => {
  return prisma.recommendation.createMany({
    data: competitionIds.map((competitionId) => ({
      studentId,
      competitionId,
      prompt,
      response: JSON.stringify(recommendation),
      matchScore,
    })),
  });
};
