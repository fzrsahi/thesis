"use client";

import { motion } from "framer-motion";
import { BarChart3, Activity, Star } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

import { StudyProgramChart, EntryYearChart, TopPerformersList } from "./Charts";

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
  isLight?: boolean;
}

export const ChartsSection = ({ statistics, isLight = false }: ChartsSectionProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: 0.2 }}
    className="space-y-8"
  >
    {/* Study Program Distribution */}
    <Card
      className={cn(
        "border transition-colors",
        isLight
          ? "border-stone-300/70 bg-white/90 text-[#2F2A24]"
          : "border-zinc-700 bg-gradient-to-br from-zinc-900 to-zinc-800 text-white"
      )}
    >
      <CardHeader>
        <CardTitle
          className={cn("flex items-center gap-2", isLight ? "text-[#2F2A24]" : "text-white")}
        >
          <BarChart3 className="h-5 w-5" />
          Distribusi Program Studi
        </CardTitle>
        <p className={cn("mt-2 text-sm", isLight ? "text-[#5C5245]" : "text-zinc-400")}>
          Menampilkan jumlah mahasiswa yang direkomendasikan untuk kompetisi ini berdasarkan program
          studi.
        </p>
      </CardHeader>
      <CardContent>
        <StudyProgramChart data={statistics?.studyPrograms || []} isLight={isLight} />
      </CardContent>
    </Card>

    {/* Entry Year Distribution */}
    <Card
      className={cn(
        "border transition-colors",
        isLight
          ? "border-stone-300/70 bg-white/90 text-[#2F2A24]"
          : "border-zinc-700 bg-gradient-to-br from-zinc-900 to-zinc-800 text-white"
      )}
    >
      <CardHeader>
        <CardTitle
          className={cn("flex items-center gap-2", isLight ? "text-[#2F2A24]" : "text-white")}
        >
          <Activity className="h-5 w-5" />
          Distribusi Tahun Masuk
        </CardTitle>
        <p className={cn("mt-2 text-sm", isLight ? "text-[#5C5245]" : "text-zinc-400")}>
          Menampilkan distribusi mahasiswa yang direkomendasikan berdasarkan tahun masuk mereka.
        </p>
      </CardHeader>
      <CardContent>
        <EntryYearChart data={statistics?.entryYears || []} isLight={isLight} />
      </CardContent>
    </Card>

    {/* Top Performers */}
    <Card
      className={cn(
        "border transition-colors",
        isLight
          ? "border-stone-300/70 bg-white/90 text-[#2F2A24]"
          : "border-zinc-700 bg-gradient-to-br from-zinc-900 to-zinc-800 text-white"
      )}
    >
      <CardHeader>
        <CardTitle
          className={cn("flex items-center gap-2", isLight ? "text-[#2F2A24]" : "text-white")}
        >
          <Star className="h-5 w-5" />
          Top Mahasiswa
        </CardTitle>
        <p className={cn("mt-2 text-sm", isLight ? "text-[#5C5245]" : "text-zinc-400")}>
          Menampilkan daftar mahasiswa yang direkomendasikan untuk kompetisi ini.
        </p>
      </CardHeader>
      <CardContent>
        <TopPerformersList data={statistics?.topPerformers || []} isLight={isLight} />
      </CardContent>
    </Card>

    {/* SVG Definitions for Gradients */}
    <svg width="0" height="0">
      <defs>
        <linearGradient id="programGradient" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.9} />
          <stop offset="100%" stopColor="#06b6d4" stopOpacity={0.9} />
        </linearGradient>
      </defs>
    </svg>
  </motion.div>
);
