import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

import { getDetailedCompetition, getRecommendationsByStudent } from "@/client/api/recommendations";

export const useCompetitionDetail = (competitionId: number) => {
  const { data: competitionData, isLoading: isLoadingCompetition } = useQuery({
    queryKey: ["detailed-competition", competitionId],
    queryFn: () => getDetailedCompetition(competitionId),
    enabled: Number.isFinite(competitionId),
  });

  const { isLoading: isLoadingStudents } = useQuery({
    queryKey: ["recommendations-by-student", competitionId],
    queryFn: () => getRecommendationsByStudent({ competitionId, limit: 100 }),
    enabled: Number.isFinite(competitionId),
  });

  const competition = competitionData?.data?.competition;
  const statistics = competitionData?.data?.statistics;
  const students = useMemo(
    () => competitionData?.data?.students || [],
    [competitionData?.data?.students]
  );

  const topPerformers = useMemo(() => {
    if (!students || students.length === 0) return [];

    return students
      .filter(
        (student) =>
          student &&
          student.recommendation &&
          typeof student.recommendation.matchScore === "number" &&
          !Number.isNaN(student.recommendation.matchScore)
      )
      .sort((a, b) => b.recommendation.matchScore - a.recommendation.matchScore)
      .slice(0, 5)
      .map((student, index) => ({
        rank: index + 1,
        student: student.student,
        matchScore: Number(student.recommendation.matchScore) || 0,
      }));
  }, [students]);

  return {
    competition,
    statistics,
    students,
    topPerformers,
    isLoading: isLoadingCompetition || isLoadingStudents,
  };
};
