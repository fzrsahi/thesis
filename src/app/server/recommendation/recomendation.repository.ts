import { Prisma } from "@prisma/client";

import { RecommendationResponse } from "../model/azure/types/recomendation.types";
import { prisma } from "../prisma/prisma";

export const findRecommendationByStudentId = async (
  studentId: number,
  select: Prisma.RecommendationSelect = {
    id: true,
    studentId: true,
    prompt: true,
    studentSummary: true,
    overallAssessment: true,
    createdAt: true,
    skillsProfiles: {
      select: {
        skillName: true,
        score: true,
        breakdown: true,
      },
    },
    competitionRecommendations: {
      select: {
        competitionId: true,
        competitionName: true,
        rank: true,
        matchScore: true,
        matchReason: true,
        reasoning: true,
        keyFactors: true,
        preparationTips: true,
        skillRequirements: true,
        feedbackScore: true,
        feedbackReason: true,
        createdAt: true,
      },
    },
    developmentSuggestions: {
      select: {
        type: true,
        title: true,
        link: true,
        reason: true,
      },
    },
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
  prompt: string;
  recommendation: RecommendationResponse;
};

export const createRecommendation = async ({
  studentId,
  prompt,
  recommendation,
}: CreateRecommendationArgs) =>
  prisma.$transaction(async (tx) => {
    // Create main recommendation record
    const mainRecommendation = await tx.recommendation.create({
      data: {
        studentId,
        prompt,
        studentSummary: recommendation.studentSummary,
        overallAssessment: JSON.stringify(recommendation.overallAssessment),
      },
    });

    // Create skill profiles
    await tx.recommendationSkillProfile.createMany({
      data: Object.entries(recommendation.skillsProfile).map(([skillName, profile]) => ({
        recommendationId: mainRecommendation.id,
        skillName,
        score: profile.score,
        breakdown: profile.breakdown,
      })),
    });

    // Create competition recommendations
    await tx.recommendationCompetition.createMany({
      data: recommendation.recommendations.map((rec) => ({
        recommendationId: mainRecommendation.id,
        competitionId: rec.id,
        competitionName: rec.competitionName,
        rank: rec.rank,
        matchScore: rec.matchScore.score,
        matchReason: rec.matchScore.reason,
        reasoning: JSON.stringify(rec.reasoning),
        keyFactors: rec.keyFactors ? JSON.stringify(rec.keyFactors) : null,
        preparationTips: rec.preparationTips ? JSON.stringify(rec.preparationTips) : null,
        skillRequirements: JSON.stringify(rec.skillRequirements),
      })),
    });

    // Create development suggestions
    await tx.recommendationDevelopmentSuggestion.createMany({
      data: recommendation.developmentSuggestions.map((suggestion) => ({
        recommendationId: mainRecommendation.id,
        type: suggestion.type,
        title: suggestion.title,
        link: suggestion.link,
        reason: suggestion.reason,
      })),
    });

    return mainRecommendation;
  });
