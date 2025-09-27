"use client";

import { Trophy, PieChart, BarChart3, Activity } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
} from "recharts";

const COLORS = {
  excellent: "#10b981", // emerald-500
  good: "#3b82f6", // blue-500
  fair: "#f59e0b", // amber-500
  poor: "#ef4444", // red-500
  primary: "#8b5cf6", // violet-500
  secondary: "#06b6d4", // cyan-500
  accent: "#f97316", // orange-500
};

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border border-zinc-700 bg-zinc-900 p-3 shadow-lg">
        <p className="text-sm font-medium text-white">{label}</p>
        {payload.map((entry) => (
          <p key={entry.name} className="text-sm" style={{ color: entry.color }}>
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

interface ScoreDistributionData {
  excellent?: number;
  good?: number;
  fair?: number;
  poor?: number;
}

export const ScoreDistributionChart = ({ data }: { data: ScoreDistributionData | null }) => {
  if (!data) {
    return (
      <div className="flex h-80 w-full items-center justify-center">
        <div className="text-center text-zinc-400">
          <PieChart className="mx-auto mb-2 h-12 w-12 opacity-50" />
          <p>No score distribution data available</p>
        </div>
      </div>
    );
  }

  const chartData = [
    { name: "Excellent (≥0.8)", value: Number(data.excellent) || 0, color: COLORS.excellent },
    { name: "Good (0.6-0.8)", value: Number(data.good) || 0, color: COLORS.good },
    { name: "Fair (0.4-0.6)", value: Number(data.fair) || 0, color: COLORS.fair },
    { name: "Poor (<0.4)", value: Number(data.poor) || 0, color: COLORS.poor },
  ].filter((item) => item.value > 0);

  if (chartData.length === 0) {
    return (
      <div className="flex h-80 w-full items-center justify-center">
        <div className="text-center text-zinc-400">
          <PieChart className="mx-auto mb-2 h-12 w-12 opacity-50" />
          <p>No score distribution data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RechartsPieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={120}
            paddingAngle={5}
            dataKey="value"
          >
            {chartData.map((entry) => (
              <Cell key={`cell-${entry.name}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </RechartsPieChart>
      </ResponsiveContainer>
    </div>
  );
};

interface StudyProgramData {
  studyProgram: {
    name: string;
  };
  studentCount: number;
  averageScore: number;
  percentage: number;
}

export const StudyProgramChart = ({ data }: { data: StudyProgramData[] }) => {
  // Create initial data for Sistem Informasi and Pendidikan Teknologi Informasi
  const initialData = [
    { name: "Sistem Informasi", students: 0, averageScore: 0, percentage: 0 },
    { name: "Pendidikan Teknologi Informasi", students: 0, averageScore: 0, percentage: 0 },
  ];

  if (!data || data.length === 0) {
    return (
      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={initialData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis
              dataKey="name"
              tick={{ fill: "#e4e4e7", fontSize: 12 }}
              stroke="rgba(255,255,255,0.1)"
            />
            <YAxis tick={{ fill: "#e4e4e7", fontSize: 12 }} stroke="rgba(255,255,255,0.1)" />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="students" fill="url(#programGradient)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  }

  const chartData = data
    .filter((item) => item && item.studyProgram && item.studyProgram.name)
    .map((item) => ({
      name: item.studyProgram.name,
      students: Number(item.studentCount) || 0,
      averageScore: Number(item.averageScore) || 0,
      percentage: Number(item.percentage) || 0,
    }));

  // Merge with initial data, keeping existing data and filling missing ones with 0
  const mergedData = initialData.map((initial) => {
    const existing = chartData.find((item) => item.name === initial.name);
    return existing || initial;
  });

  if (mergedData.length === 0) {
    return (
      <div className="flex h-80 w-full items-center justify-center">
        <div className="text-center text-zinc-400">
          <BarChart3 className="mx-auto mb-2 h-12 w-12 opacity-50" />
          <p>No study program data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={mergedData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
          <XAxis
            dataKey="name"
            tick={{ fill: "#e4e4e7", fontSize: 12 }}
            stroke="rgba(255,255,255,0.1)"
          />
          <YAxis tick={{ fill: "#e4e4e7", fontSize: 12 }} stroke="rgba(255,255,255,0.1)" />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="students" fill="url(#programGradient)" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

interface EntryYearData {
  entryYear: number;
  studentCount: number;
  averageScore: number;
  percentage: number;
}

export const EntryYearChart = ({ data }: { data: EntryYearData[] }) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex h-80 w-full items-center justify-center">
        <div className="text-center text-zinc-400">
          <Activity className="mx-auto mb-2 h-12 w-12 opacity-50" />
          <p>No entry year data available</p>
        </div>
      </div>
    );
  }

  const chartData = data
    .filter((item) => item && typeof item.entryYear === "number" && !Number.isNaN(item.entryYear))
    .map((item) => ({
      year: `20${item.entryYear}`, // Convert 21 to 2021
      students: Number(item.studentCount) || 0,
      averageScore: Number(item.averageScore) || 0,
      percentage: Number(item.percentage) || 0,
    }));

  if (chartData.length === 0) {
    return (
      <div className="flex h-80 w-full items-center justify-center">
        <div className="text-center text-zinc-400">
          <Activity className="mx-auto mb-2 h-12 w-12 opacity-50" />
          <p>No entry year data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <defs>
            <linearGradient id="yearGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.9} />
              <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.9} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
          <XAxis
            dataKey="year"
            tick={{ fill: "#e4e4e7", fontSize: 12 }}
            stroke="rgba(255,255,255,0.1)"
          />
          <YAxis tick={{ fill: "#e4e4e7", fontSize: 12 }} stroke="rgba(255,255,255,0.1)" />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="students" fill="url(#yearGradient)" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

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

export const TopPerformersList = ({ data }: { data: TopPerformerData[] }) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex h-80 w-full items-center justify-center">
        <div className="text-center text-zinc-400">
          <Trophy className="mx-auto mb-2 h-12 w-12 opacity-50" />
          <p>No performance data available</p>
        </div>
      </div>
    );
  }

  const performers = data
    .filter(
      (performer) =>
        performer &&
        performer.student &&
        typeof performer.matchScore === "number" &&
        !Number.isNaN(performer.matchScore)
    )
    .map((performer) => ({
      rank: performer.rank,
      name: performer.student.name || "Unknown",
      score: Number(performer.matchScore) || 0,
      studentId: performer.student.studentId || "N/A",
      studyProgram: performer.student.studyProgram?.name || "N/A",
    }));

  if (performers.length === 0) {
    return (
      <div className="flex h-80 w-full items-center justify-center">
        <div className="text-center text-zinc-400">
          <Trophy className="mx-auto mb-2 h-12 w-12 opacity-50" />
          <p>No performance data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {performers.map((performer) => (
        <div
          key={performer.studentId}
          className="flex items-center justify-between rounded-lg border border-zinc-600/30 bg-zinc-800/30 p-4 backdrop-blur-sm"
        >
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 text-sm font-bold text-white">
              {performer.rank}
            </div>
            <div>
              <h4 className="font-medium text-white">{performer.name}</h4>
              <p className="text-sm text-zinc-400">NIM: {performer.studentId}</p>
              <p className="text-xs text-zinc-500">Program: {performer.studyProgram}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold text-green-400">
              {parseFloat(performer.score.toFixed(3))}
            </p>
            <p className="text-xs text-zinc-400">Match Score</p>
          </div>
        </div>
      ))}
    </div>
  );
};
