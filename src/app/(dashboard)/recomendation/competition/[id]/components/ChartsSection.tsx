"use client";

import { motion } from "framer-motion";
import { PieChart, BarChart3, Activity, Star } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import {
  ScoreDistributionChart,
  StudyProgramChart,
  EntryYearChart,
  TopPerformersList,
} from "./Charts";

interface StatisticsData {
  overview?: {
    scoreDistribution?: {
      excellent?: number;
      good?: number;
      fair?: number;
      poor?: number;
    };
  };
  studyPrograms?: Array<{
    studyProgram: {
      name: string;
    };
    studentCount: number;
    averageScore: number;
    percentage: number;
  }>;
  entryYears?: Array<{
    entryYear: number;
    studentCount: number;
    averageScore: number;
    percentage: number;
  }>;
  topPerformers?: Array<{
    student: {
      id: number;
      name: string;
      studentId: string;
      studyProgram: {
        id: number;
        name: string;
      };
      entryYear: number;
    };
    matchScore: number;
    rank: number;
  }>;
  scoreDistribution?: {
    excellent?: number;
    good?: number;
    fair?: number;
    poor?: number;
  };
  totalStudents?: number;
  averageMatchScore?: number;
  highestScore?: number;
  lowestScore?: number;
  averageGPA?: number;
  entryYearDistribution?: Record<string, number>;
  studyProgramDistribution?: Record<string, number>;
  relevantSkillsDistribution?: Record<string, number>;
}

interface TopPerformerData {
  rank: number;
  student: {
    name: string;
    studentId?: string;
    studyProgram?: {
      name: string;
    };
  };
  matchScore: number;
}

interface ChartsSectionProps {
  statistics: StatisticsData | null;
  topPerformers?: TopPerformerData[];
}

export const ChartsSection = ({ statistics }: ChartsSectionProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: 0.2 }}
    className="space-y-8"
  >
    {/* Score Distribution */}
    <Card className="border border-zinc-700 bg-gradient-to-br from-zinc-900 to-zinc-800 text-white">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <PieChart className="h-5 w-5" />
          Distribusi Skor Kecocokan
        </CardTitle>
        <p className="mt-2 text-sm text-zinc-400">
          Menampilkan distribusi skor kecocokan mahasiswa terhadap kompetisi ini berdasarkan
          kategori penilaian.
        </p>
      </CardHeader>
      <CardContent>
        <ScoreDistributionChart
          data={
            statistics?.overview?.scoreDistribution
              ? statistics.overview.scoreDistribution
              : statistics?.scoreDistribution
                ? statistics.scoreDistribution
                : null
          }
        />
      </CardContent>
    </Card>

    {/* Study Program Distribution */}
    <Card className="border border-zinc-700 bg-gradient-to-br from-zinc-900 to-zinc-800 text-white">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <BarChart3 className="h-5 w-5" />
          Distribusi Program Studi
        </CardTitle>
        <p className="mt-2 text-sm text-zinc-400">
          Menampilkan jumlah mahasiswa yang direkomendasikan untuk kompetisi ini berdasarkan program
          studi.
        </p>
      </CardHeader>
      <CardContent>
        <StudyProgramChart data={statistics?.studyPrograms || []} />
      </CardContent>
    </Card>

    {/* Entry Year Distribution */}
    <Card className="border border-zinc-700 bg-gradient-to-br from-zinc-900 to-zinc-800 text-white">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <Activity className="h-5 w-5" />
          Distribusi Tahun Masuk
        </CardTitle>
        <p className="mt-2 text-sm text-zinc-400">
          Menampilkan distribusi mahasiswa yang direkomendasikan berdasarkan tahun masuk mereka.
        </p>
      </CardHeader>
      <CardContent>
        <EntryYearChart data={statistics?.entryYears || []} />
      </CardContent>
    </Card>

    {/* Top Performers */}
    <Card className="border border-zinc-700 bg-gradient-to-br from-zinc-900 to-zinc-800 text-white">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <Star className="h-5 w-5" />
          Top Performers
        </CardTitle>
        <p className="mt-2 text-sm text-zinc-400">
          Menampilkan 5 mahasiswa dengan skor kecocokan tertinggi untuk kompetisi ini.
        </p>
      </CardHeader>
      <CardContent>
        <TopPerformersList data={statistics?.topPerformers || []} />
      </CardContent>
    </Card>

    {/* SVG Definitions for Gradients */}
    <svg width="0" height="0">
      <defs>
        <linearGradient id="programGradient" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.9} />
          <stop offset="100%" stopColor="#06b6d4" stopOpacity={0.9} />
        </linearGradient>
        <linearGradient id="performerGradient" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#f97316" stopOpacity={0.9} />
          <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.9} />
        </linearGradient>
      </defs>
    </svg>
  </motion.div>
);
