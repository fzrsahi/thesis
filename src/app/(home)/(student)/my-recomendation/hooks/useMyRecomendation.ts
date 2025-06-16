import { useState, useMemo } from "react";

import { paths } from "@/app/shared/types/api";

import { useQueryGetMyRecomendation } from "../_api/useQueryGetMyRecomendation";

export type RecommendationResponse =
  paths["/my-recommendation"]["get"]["responses"]["200"]["content"]["application/json"]["data"];

export interface SkillsProfileBreakdown {
  [key: string]: string;
}

export interface CompetitionRecommendation {
  id: number;
  competition: string;
  match_score: number;
  match_score_breakdown: string;
  skill_distribution: Record<string, number>;
  skill_distribution_breakdown: Record<string, string>;
  rank: number;
  reason: string;
  details: {
    startDate: string;
    endDate: string;
    location: string;
    organizer: string;
    registration_deadline: string;
    website: string;
  };
  applied: boolean;
  preparation_tips: string[];
}

export interface DevelopmentSuggestion {
  type: "course" | "community" | "resource";
  title?: string;
  name?: string;
  platform?: string;
  link: string;
  reason: string;
}

export interface ProfileStrength {
  score: number;
  calculation_explanation: string;
  strengths: string[];
  weaknesses: string[];
}

export interface SpiderChartDataPoint {
  label: string;
  value: number;
  type?: "student" | "competition";
}

export const formatDate = (dateString: string | null) => {
  if (!dateString) return "TBD";
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
};

export const getMatchScoreColor = (score: number) => {
  if (score >= 0.8) return "bg-green-500";
  if (score >= 0.6) return "bg-yellow-500";
  return "bg-red-500";
};

const useMyRecomendation = () => {
  const { data: apiData, isLoading: apiLoading, error: apiError } = useQueryGetMyRecomendation();
  const [selectedCompetition, setSelectedCompetition] = useState<
    RecommendationResponse["result"]["recommendations"][number] | null
  >(null);

  const studentSkillsData = useMemo<SpiderChartDataPoint[]>(() => {
    if (!apiData?.result.skillsProfile) return [];
    return Object.entries(apiData.result.skillsProfile)
      .map(([skill, { score }]) => ({
        label: skill.replace(/_/g, " "),
        value: score * 10, // Convert to 0-10 scale
        type: "student" as const,
      }))
      .sort((a, b) => a.label.localeCompare(b.label)); // Sort alphabetically for consistent display
  }, [apiData?.result.skillsProfile]);

  const competitionSkillsData = useMemo<SpiderChartDataPoint[]>(() => {
    if (!selectedCompetition?.skillRequirements) return [];
    return Object.entries(selectedCompetition.skillRequirements)
      .map(([skill, { weight }]) => ({
        label: skill.replace(/_/g, " "),
        value: weight * 10, // Convert to 0-10 scale
        type: "competition" as const,
      }))
      .sort((a, b) => a.label.localeCompare(b.label)); // Sort alphabetically for consistent display
  }, [selectedCompetition?.skillRequirements]);

  const performanceMetrics = useMemo(() => {
    if (!apiData?.result) {
      return {
        participationRate: 0,
        averageMatchScore: 0,
        competitionSuccessRate: 0,
        skillGrowth: {},
      };
    }

    const { recommendations } = apiData.result;
    const totalRecommendations = recommendations.length;
    const totalMatchScore = recommendations.reduce((sum, rec) => sum + rec.matchScore.score, 0);
    const averageMatchScore = totalRecommendations > 0 ? totalMatchScore / totalRecommendations : 0;

    // Calculate skill growth from recommendations
    const skillGrowth: Record<string, number> = {};
    recommendations.forEach((rec) => {
      Object.entries(rec.skillRequirements).forEach(([skill, { weight }]) => {
        if (!skillGrowth[skill]) {
          skillGrowth[skill] = 0;
        }
        skillGrowth[skill] += weight;
      });
    });

    // Normalize skill growth values
    Object.keys(skillGrowth).forEach((skill) => {
      skillGrowth[skill] = (skillGrowth[skill] / totalRecommendations) * 10;
    });

    return {
      participationRate: 0.75, // Placeholder - should be calculated from actual data
      averageMatchScore,
      competitionSuccessRate: 0.65, // Placeholder - should be calculated from actual data
      skillGrowth,
    };
  }, [apiData?.result]);

  const profileStrength = useMemo(() => {
    if (!apiData?.result) {
      return {
        score: 0,
        calculationExplanation: "Based on your skills profile and competition performance",
        strengths: [],
        weaknesses: [],
      };
    }

    const { overallAssessment, skillsProfile } = apiData.result;
    const skillScores = Object.values(skillsProfile).map(({ score }) => score);
    const averageScore = skillScores.reduce((sum, score) => sum + score, 0) / skillScores.length;

    return {
      score: averageScore,
      calculationExplanation: "Based on your skills profile and competition performance",
      strengths: overallAssessment.strengths,
      weaknesses: overallAssessment.weaknesses,
    };
  }, [apiData?.result]);

  const categoryDistribution = useMemo(() => {
    if (!apiData?.result.recommendations) {
      return {
        categories: [],
        values: [],
      };
    }

    const categories = new Map<string, number>();
    apiData.result.recommendations.forEach((rec) => {
      if (rec.competition?.field) {
        rec.competition.field.forEach((field) => {
          const count = categories.get(field) || 0;
          categories.set(field, count + 1);
        });
      }
    });

    return {
      categories: Array.from(categories.keys()),
      values: Array.from(categories.values()),
    };
  }, [apiData?.result.recommendations]);

  const handleStartAnalysis = () => {
    // TODO: Implement analysis start logic
  };

  return {
    data: apiData,
    isLoading: apiLoading,
    error: apiError,
    selectedCompetition,
    setSelectedCompetition,
    studentSkillsData,
    competitionSkillsData,
    performanceMetrics,
    profileStrength,
    categoryDistribution,
    handleStartAnalysis,
  };
};

export { useMyRecomendation };
