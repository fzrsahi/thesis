import { Prisma } from "@prisma/client";

import { RecommendationResponse } from "../model/azure/azure.types";
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

export const createOrUpdateRecomendation = async (
  studentId: number,
  prompt: string,
  recommendation: RecommendationResponse
) =>
  prisma.recommendation.upsert({
    create: {
      studentId,
      prompt,
      response: JSON.stringify(recommendation),
    },
    update: {
      prompt,
      response: JSON.stringify(recommendation),
    },
    where: {
      studentId,
      id: 0,
    },
  });

export const createStudentCompetition = async (
  studentId: number,
  competitionIds: number[],
  matchScores: number[],
  feedbacks: string[]
) => {
  await prisma.studentCompetition.deleteMany({
    where: {
      studentId,
    },
  });

  prisma.studentCompetition.createMany({
    data: competitionIds.map((competitionId, index) => ({
      studentId,
      competitionId,
      matchScore: matchScores[index],
      feedback: feedbacks[index],
    })),
  });
};
