import { useState } from "react";

import { paths } from "@/app/shared/types/api";

import { useQueryGetMyRecomendation } from "../_api/useQueryGetMyRecomendation";

export type RecommendationResponse =
  paths["/my-recommendation"]["get"]["responses"]["200"]["content"]["application/json"]["data"];

export interface SkillsProfileBreakdown {
  [key: string]: string;
}

export interface CategoryDistribution {
  [key: string]: number;
}

export interface PerformanceMetrics {
  participation_rate: number;
  avg_match_score: number;
  competition_success_rate: number;
  skill_growth: {
    [key: string]: string;
  };
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

export const formatDate = (dateString: string) => {
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
    RecommendationResponse["recommendations"][number] | null
  >(null);

  const studentSkillsData: SpiderChartDataPoint[] = apiData?.skillsProfile
    ? Object.entries(apiData.skillsProfile).map(([skill, value]) => ({
        label: skill.replace("_", " "),
        value,
        type: "student",
      }))
    : [];

  const competitionSkillsData: SpiderChartDataPoint[] = selectedCompetition
    ? Object.entries(selectedCompetition.skillDistribution).map(([skill, value]) => ({
        label: skill.replace("_", " "),
        value,
        type: "competition",
      }))
    : [];

  const handleStartAnalysis = () => {};

  return {
    data: apiData,
    isLoading: apiLoading,
    error: apiError,
    selectedCompetition,
    setSelectedCompetition,
    studentSkillsData,
    competitionSkillsData,
    handleStartAnalysis,
  };
};

export { useMyRecomendation };
