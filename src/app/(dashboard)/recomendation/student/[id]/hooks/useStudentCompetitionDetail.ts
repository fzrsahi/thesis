import { useMemo } from "react";

import { paths } from "@/app/shared/types/api";

import { useQueryGetStudentCompetitionDetail } from "../_api/useQueryGetStudentCompetitionDetail";

// Types based on API response
export type StudentCompetitionDetailResponse =
  paths["/recomendations/students/{id}"]["get"]["responses"]["200"]["content"]["application/json"]["data"];

// Types are defined inline in the hook to avoid unused interface warnings

export const useStudentCompetitionDetail = (userId: number) => {
  const { data: apiData, isLoading, error } = useQueryGetStudentCompetitionDetail(userId);

  // Transform API data to match our interface
  const transformedData = useMemo(() => {
    if (!apiData) return null;

    // Transform API response to match our interface
    const transformedRecommendations = apiData.result.recommendations.map((rec) => ({
      competition: {
        id: rec.id,
        title: rec.competitionName,
        field: rec.competition.field || [],
        organizer: rec.competition.organizer || "Unknown",
        description: rec.competition.description || undefined,
        startDate: rec.competition.startDate || undefined,
        endDate: rec.competition.endDate || undefined,
        location: rec.competition.location || undefined,
        sourceUrl: rec.competition.sourceUrl || undefined,
        type: rec.competition.type || undefined,
        minGPA: rec.competition.minGPA || undefined,
        relevantSkills: rec.competition.relevantSkills || undefined,
      },
      matchScore: rec.matchScore.score,
      rank: rec.rank,
      reasoning: {
        pros: rec.reasoning.pros,
        cons: rec.reasoning.cons,
      },
      keyFactors: rec.keyFactors,
      preparationTips: rec.preparationTips,
      skillRequirements: rec.skillRequirements,
    }));

    return {
      student: {
        id: 0, // Not available in current API response
        userId: 0, // Not available in current API response
        name: apiData.result.studentProfile?.name || "Unknown",
        email: apiData.result.studentProfile?.email || "Unknown",
        studentId: apiData.result.studentProfile?.studentId || null,
        studyProgram: {
          id: 0, // Not available in current API response
          name: apiData.result.studentProfile?.studyProgram || "Unknown",
        },
        entryYear: apiData.result.studentProfile?.entryYear || 0,
        gpa: apiData.result.studentProfile?.gpa || null,
      },
      statistics: {
        totalCompetitions: transformedRecommendations.length,
        averageScore:
          transformedRecommendations.reduce((sum, rec) => sum + rec.matchScore, 0) /
          transformedRecommendations.length,
        highestScore: Math.max(...transformedRecommendations.map((rec) => rec.matchScore)),
        lowestScore: Math.min(...transformedRecommendations.map((rec) => rec.matchScore)),
        totalRecommendations: transformedRecommendations.length,
        studentSummary: apiData.result.studentSummary,
        skillProfile: apiData.result.skillsProfile,
        strengths: apiData.result.overallAssessment.strengths,
        weaknesses: apiData.result.overallAssessment.weaknesses,
        skillComparison: Object.entries(apiData.result.skillsProfile).map(([skill, { score }]) => ({
          skill,
          studentScore: score * 10, // Convert to 0-10 scale
          averageScore: 6.5, // Mock average score
          difference: score * 10 - 6.5, // Difference from average
        })),
        topCompetitions: transformedRecommendations.slice(0, 5),
      },
      competitions: transformedRecommendations.map((rec) => ({
        id: rec.competition.id,
        title: rec.competition.title,
        field: rec.competition.field,
        organizer: rec.competition.organizer,
        description: rec.competition.description,
        startDate: rec.competition.startDate,
        endDate: rec.competition.endDate,
        location: rec.competition.location,
        sourceUrl: rec.competition.sourceUrl,
        type: rec.competition.type,
        minGPA: rec.competition.minGPA,
        relevantSkills: rec.competition.relevantSkills,
        matchScore: rec.matchScore,
        rank: rec.rank,
      })),
    };
  }, [apiData]);

  return {
    data: transformedData,
    isLoading,
    error,
  };
};
