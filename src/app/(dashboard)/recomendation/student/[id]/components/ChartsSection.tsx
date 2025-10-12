"use client";

import { motion } from "framer-motion";
import { Star, Target, Zap } from "lucide-react";
import { useState } from "react";

import Button from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { SkillComparisonChart, TopCompetitionsList } from "./Charts";

interface StatisticsData {
  overview?: {
    totalCompetitions?: number;
    averageMatchScore?: number;
    highestMatchScore?: number;
    lowestMatchScore?: number;
    totalRecommendations?: number;
    scoreDistribution?: {
      excellent?: number;
      good?: number;
      fair?: number;
      poor?: number;
    };
  };
  competitionTypes?: Array<{
    type: string;
    count: number;
    averageScore: number;
    percentage: number;
  }>;
  skillComparison?: Array<{
    skill: string;
    studentScore: number;
    averageScore: number;
    difference: number;
  }>;
  topCompetitions?: Array<{
    competition: {
      id: number;
      title: string;
      field: string[];
      organizer: string;
      description?: string;
      startDate?: string;
      endDate?: string;
      location?: string;
      sourceUrl?: string;
      type?: string;
      minGPA?: string;
      relevantSkills?: string[];
    };
    matchScore: number;
    rank: number;
    reasoning?: {
      pros: string[];
      cons: string[];
    };
    keyFactors?: string[];
    preparationTips?: string[];
    skillRequirements?: Record<string, { weight: number; breakdown: string }>;
  }>;
  scoreDistribution?: {
    excellent?: number;
    good?: number;
    fair?: number;
    poor?: number;
  };
  totalCompetitions?: number;
  averageMatchScore?: number;
  highestScore?: number;
  lowestScore?: number;
  totalRecommendations?: number;
  studentSummary?: string;
  skillProfile?: Record<string, { score: number; breakdown: string }>;
  strengths?: string[];
  weaknesses?: string[];
}

interface CompetitionData {
  id: number;
  title: string;
  field: string[];
  organizer: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  location?: string;
  sourceUrl?: string;
  type?: string;
  minGPA?: string;
  relevantSkills?: string[];
  matchScore?: number;
  rank?: number;
}

interface ChartsSectionProps {
  statistics: StatisticsData | null;
  competitions?: CompetitionData[];
}

export const ChartsSection = ({ statistics, competitions }: ChartsSectionProps) => {
  const [selectedCompetition, setSelectedCompetition] = useState<CompetitionData | null>(null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="space-y-8"
    >
      {/* Skill Comparison */}
      <Card className="border border-zinc-700 bg-gradient-to-br from-zinc-900 to-zinc-800 text-white">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-white">
                <Target className="h-5 w-5" />
                Perbandingan Keterampilan
              </CardTitle>
              <p className="mt-2 text-sm text-zinc-400">
                {selectedCompetition
                  ? `Membandingkan keterampilan mahasiswa dengan kebutuhan kompetisi "${selectedCompetition.title}"`
                  : "Klik kompetisi di bawah untuk melihat perbandingan keterampilan"}
              </p>
            </div>
            {selectedCompetition && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedCompetition(null)}
                className="bg-gradient-to-r from-zinc-800/50 to-zinc-900/50 text-xs text-white backdrop-blur-sm hover:from-zinc-700/50 hover:to-zinc-800/50"
              >
                <Zap className="mr-1 h-3 w-3" />
                Reset
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <SkillComparisonChart
            data={statistics?.skillComparison || []}
            selectedCompetition={selectedCompetition}
          />
        </CardContent>
      </Card>

      {/* Top Competitions */}
      <Card className="border border-zinc-700 bg-gradient-to-br from-zinc-900 to-zinc-800 text-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Star className="h-5 w-5" />
            Top Rekomendasi Kompetisi
          </CardTitle>
          <p className="mt-2 text-sm text-zinc-400">
            Menampilkan kompetisi dengan skor kecocokan tertinggi untuk mahasiswa ini. Klik untuk
            melihat perbandingan keterampilan.
          </p>
        </CardHeader>
        <CardContent>
          <TopCompetitionsList
            data={statistics?.topCompetitions || []}
            competitions={competitions || []}
            onCompetitionSelect={setSelectedCompetition}
            selectedCompetition={selectedCompetition}
          />
        </CardContent>
      </Card>

      {/* SVG Definitions for Gradients */}
      <svg width="0" height="0">
        <defs>
          <linearGradient id="competitionGradient" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.9} />
            <stop offset="100%" stopColor="#06b6d4" stopOpacity={0.9} />
          </linearGradient>
          <linearGradient id="skillGradient" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#f97316" stopOpacity={0.9} />
            <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.9} />
          </linearGradient>
          <linearGradient id="performanceGradient" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#10b981" stopOpacity={0.9} />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.9} />
          </linearGradient>
        </defs>
      </svg>
    </motion.div>
  );
};
