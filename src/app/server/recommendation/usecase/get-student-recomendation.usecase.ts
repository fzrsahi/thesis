import { HttpStatusCode } from "axios";

import { findManyCompetitionsByIds } from "../../competition/competition.repository";
import {
  RecommendationResponse,
  SkillsProfileKey,
  SkillsProfileEntry,
} from "../../model/azure/types/recomendation.types";
import { STUDENT_ERROR_RESPONSE } from "../../student/student.error";
import { findStudentByUserId } from "../../student/student.repository";
import { customError } from "../../utils/error/custom-error";
import { RECOMMENDATION_ERROR_RESPONSE } from "../recomendation.error";
import { findRecommendationByStudentId } from "../recomendation.repository";

type ExtendedCompetitionData = {
  id: number;
  title: string;
  description: string;
  field: string[];
  type: string | null;
  minGPA: string | null;
  location: string | null;
  organizer: string | null;
  startDate: Date | null;
  endDate: Date | null;
  sourceUrl: string | null;
  relevantCourses: string[];
  relevantSkills: string[];
  requirements: Record<string, unknown> | null;
  evaluationCriteria: Record<string, unknown> | null;
  competitionStats: {
    totalApplicantsPastYear: number;
    pastUngParticipants: number;
  };
};

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

  const competitions = await findManyCompetitionsByIds(
    recommendation.competitionRecommendations.map((r) => r.competitionId),
    {
      id: true,
      title: true,
      description: true,
      field: true,
      type: true,
      minGPA: true,
      location: true,
      organizer: true,
      startDate: true,
      endDate: true,
      sourceUrl: true,
      relevantCourses: true,
      relevantSkills: true,
      requirements: true,
      evaluationCriteria: true,
      competitionStats: {
        include: {
          totalApplicantsPastYear: true,
          pastUngParticipants: true,
        },
      },
    }
  );

  const competitionMap = new Map(
    competitions.map((comp) => [comp.id, comp as unknown as ExtendedCompetitionData])
  );

  const skillsProfileEntries = recommendation.skillsProfiles as SkillsProfileEntry[];
  const skillsProfile = Object.fromEntries(
    skillsProfileEntries.map((profile) => [
      profile.skillName,
      {
        score: profile.score,
        breakdown: profile.breakdown,
      },
    ])
  ) as Record<SkillsProfileKey, { score: number; breakdown: string }>;

  const response: RecommendationResponse = {
    studentSummary: recommendation.studentSummary || "",
    skillsProfile,
    overallAssessment: JSON.parse(recommendation.overallAssessment || "{}"),
    recommendations: recommendation.competitionRecommendations.map((rec) => {
      const competition = competitionMap.get(rec.competitionId);
      return {
        id: rec.competitionId,
        competitionName: competition?.title || rec.competitionName,
        rank: rec.rank,
        matchScore: {
          score: rec.matchScore,
          reason: rec.matchReason || "",
        },
        skillRequirements: JSON.parse(rec.skillRequirements || "{}"),
        reasoning: JSON.parse(rec.reasoning || "{}"),
        keyFactors: rec.keyFactors ? JSON.parse(rec.keyFactors) : null,
        preparationTips: rec.preparationTips ? JSON.parse(rec.preparationTips) : null,
        competition: competition
          ? {
              description: competition.description,
              field: competition.field,
              type: competition.type,
              minGPA: competition.minGPA,
              location: competition.location,
              organizer: competition.organizer,
              startDate: competition.startDate,
              endDate: competition.endDate,
              sourceUrl: competition.sourceUrl,
              relevantCourses: competition.relevantCourses,
              relevantSkills: competition.relevantSkills,
              requirements: competition.requirements,
              evaluationCriteria: competition.evaluationCriteria,
              competitionStats: competition.competitionStats,
            }
          : null,
      };
    }),
    developmentSuggestions: recommendation.developmentSuggestions.map((suggestion) => ({
      type: suggestion.type,
      title: suggestion.title,
      link: suggestion.link,
      reason: suggestion.reason,
    })),
  };

  return {
    student: {
      name: student.user.name,
      email: student.user.email,
    },
    result: response,
  };
};
