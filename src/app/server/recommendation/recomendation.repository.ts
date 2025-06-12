import { Prisma } from "@prisma/client";

import { prisma } from "../prisma/prisma";
import { RecommendationResponse } from "../model/azure/azure.types";

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

export const createRecommendation = async (
  studentId: number,
  prompt: string,
  recommendation: RecommendationResponse
) =>
  prisma.recommendation.create({
    data: {
      studentId,
      prompt,
      response: JSON.stringify(recommendation),
    },
  });
