import { HttpStatusCode } from "axios";

import { RecommendationResponse } from "../../model/azure/types/recomendation.types";
import { STUDENT_ERROR_RESPONSE } from "../../student/student.error";
import { findStudentByUserId } from "../../student/student.repository";
import { customError } from "../../utils/error/custom-error";
import { RECOMMENDATION_ERROR_RESPONSE } from "../recomendation.error";
import { findRecommendationByStudentId } from "../recomendation.repository";
import { findManyCompetitionsByIds } from "../../competition/competition.repository";

export const getStudentRecomendationUsecase = async (userId: number) => {
  const student = await findStudentByUserId(userId, {
    id: true,
    user: {
      select: {
        name: true,
        email: true,
      },
    },
  });
  if (!student) {
    throw customError(
      STUDENT_ERROR_RESPONSE.STUDENT_NOT_FOUND.code,
      STUDENT_ERROR_RESPONSE.STUDENT_NOT_FOUND.message,
      HttpStatusCode.NotFound
    );
  }

  const recommendation = await findRecommendationByStudentId(student.id);
  if (!recommendation) {
    throw customError(
      RECOMMENDATION_ERROR_RESPONSE.NOT_FOUND.code,
      RECOMMENDATION_ERROR_RESPONSE.NOT_FOUND.message,
      HttpStatusCode.NotFound
    );
  }

  // Get competition details for additional information
  const competitions = await findManyCompetitionsByIds(
    recommendation.competitionRecommendations.map((r) => r.competitionId)
  );

  const competitionMap = new Map(competitions.map(comp => [comp.id, comp]));

  // Transform the data into the expected RecommendationResponse format
  const response: RecommendationResponse = {
    studentSummary: recommendation.studentSummary || "",
    skillsProfile: Object.fromEntries(
      recommendation.skillsProfiles.map(profile => [
        profile.skillName,
        {
          score: profile.score,
          breakdown: profile.breakdown
        }
      ])
    ) as any, // Type assertion needed due to dynamic keys
    overallAssessment: JSON.parse(recommendation.overallAssessment || "{}"),
    recommendations: recommendation.competitionRecommendations.map(rec => {
      const competition = competitionMap.get(rec.competitionId);
      return {
        id: rec.competitionId,
        competitionName: competition?.title || rec.competitionName,
        rank: rec.rank,
        matchScore: {
          score: rec.matchScore,
          reason: rec.matchReason || ""
        },
        skillRequirements: JSON.parse(rec.skillRequirements || "{}"),
        reasoning: JSON.parse(rec.reasoning || "{}"),
        keyFactors: rec.keyFactors ? JSON.parse(rec.keyFactors) : null,
        preparationTips: rec.preparationTips ? JSON.parse(rec.preparationTips) : null
      };
    }),
    developmentSuggestions: recommendation.developmentSuggestions.map(suggestion => ({
      type: suggestion.type,
      title: suggestion.title,
      link: suggestion.link,
      reason: suggestion.reason
    }))
  };

  return {
    student: {
      name: student.user.name,
      email: student.user.email,
    },
    result: response,
  };
};
