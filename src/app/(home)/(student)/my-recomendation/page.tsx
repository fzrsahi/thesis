"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  Trophy,
  Radar as RadarIcon,
  Users,
  Calendar,
  Target,
  BarChart3,
  Activity,
  MapPin,
  ExternalLink,
  Brain,
  Code2,
  BookOpen,
  Lightbulb,
  ArrowRight,
  Loader2,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Zap,
  Star,
  TrendingUp,
  Shield,
  Rocket,
} from "lucide-react";
import { useEffect, useRef, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
  Radar as RadarChartComponent,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Cell,
} from "recharts";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import Button from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  TypographyH1,
  TypographyH3,
  TypographyP,
  TypographyEmphasis,
} from "@/components/ui/typography";

import {
  useMyRecomendation,
  formatDate,
  getMatchScoreColor,
  type RecommendationResponse,
} from "./hooks/useMyRecomendation";
import { usePostMyRecomendation } from "./hooks/usePostMyRecomendation";

const skillNameMapping: Record<string, string> = {
  technicalExpertise: "Keahlian Teknis",
  scientificWriting: "Penulisan Ilmiah",
  problemSolving: "Pemecahan Masalah",
  creativityInnovation: "Kreativitas & Inovasi",
  communication: "Komunikasi",
  teamworkCollaboration: "Kerja Tim & Kolaborasi",
  projectManagement: "Manajemen Proyek",
  businessAcumen: "Pemahaman Bisnis",
  designThinking: "Design Thinking",
  selfLearning: "Pembelajaran Mandiri",
};

// Visual styles for rank highlighting
const getRankGradientClass = (rank: number): string => {
  if (rank === 1) return "from-yellow-400 via-amber-400 to-orange-400"; // Gold
  if (rank === 2) return "from-zinc-300 via-gray-300 to-zinc-400"; // Silver
  if (rank === 3) return "from-amber-700 via-orange-600 to-amber-600"; // Bronze
  return "from-blue-500 via-purple-500 to-pink-500"; // Default
};

const EmptyState = ({
  onStartAnalysis,
  isCreating,
}: {
  onStartAnalysis: () => void;
  isCreating: boolean;
}) => (
  <div className="relative flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-zinc-900 via-black to-zinc-900">
    {/* Animated Background Elements */}
    <div className="absolute inset-0">
      <div className="absolute top-1/4 left-1/4 h-64 w-64 animate-pulse rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-3xl" />
      <div className="absolute right-1/4 bottom-1/4 h-48 w-48 animate-pulse rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 blur-3xl delay-1000" />
      <div className="absolute top-1/2 right-1/3 h-32 w-32 animate-pulse rounded-full bg-gradient-to-r from-cyan-500/20 to-blue-500/20 blur-2xl delay-500" />
    </div>

    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="relative z-10 space-y-8 px-4 text-center"
    >
      {/* Hero Icon */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-600 shadow-2xl"
      >
        <Rocket className="h-12 w-12 text-white" />
      </motion.div>

      {/* Main Content */}
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="space-y-4"
        >
          <TypographyH1 className="bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-4xl font-bold text-transparent md:text-6xl">
            Mulai Perjalanan{" "}
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Kompetisi
            </span>{" "}
            Anda
          </TypographyH1>
          <TypographyP className="mx-auto max-w-2xl text-lg text-zinc-300 md:text-xl">
            Dapatkan rekomendasi kompetisi yang disesuaikan dengan{" "}
            <span className="font-semibold text-blue-300">keterampilan</span>,{" "}
            <span className="font-semibold text-purple-300">minat</span>, dan{" "}
            <span className="font-semibold text-pink-300">profil akademik</span> Anda. Kami akan
            menganalisis profil Anda dan memberikan saran kompetisi terbaik.
          </TypographyP>
        </motion.div>

        {/* Feature Highlights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="grid grid-cols-1 gap-4 md:grid-cols-3"
        >
          {[
            { icon: Brain, text: "AI-Powered Analysis", color: "from-blue-500 to-cyan-500" },
            { icon: Target, text: "Personalized Matches", color: "from-purple-500 to-pink-500" },
            { icon: TrendingUp, text: "Success Tracking", color: "from-green-500 to-emerald-500" },
          ].map((feature, index) => (
            <motion.div
              key={feature.text}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8 + index * 0.1, duration: 0.5 }}
              className="group relative overflow-hidden rounded-xl border border-zinc-800/50 bg-zinc-900/50 p-4 backdrop-blur-sm transition-all hover:border-zinc-700/50 hover:bg-zinc-800/50"
            >
              <div
                className={`mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r ${feature.color} shadow-lg`}
              >
                <feature.icon className="h-6 w-6 text-white" />
              </div>
              <TypographyP className="text-sm font-medium text-zinc-200">
                {feature.text}
              </TypographyP>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
        >
          <Button
            size="lg"
            className="group relative overflow-hidden bg-gradient-to-r from-blue-500 to-purple-600 px-8 py-4 text-lg font-bold text-white shadow-2xl transition-all hover:scale-105 hover:from-blue-600 hover:to-purple-700 hover:shadow-blue-500/25"
            onClick={onStartAnalysis}
            disabled={isCreating}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
            {isCreating ? (
              <>
                <Activity className="mr-3 h-6 w-6 animate-spin" />
                Menganalisis Profil Anda...
              </>
            ) : (
              <>
                <Sparkles className="mr-3 h-6 w-6" />
                Mulai Analisis
                <ArrowRight className="ml-3 h-6 w-6 transition-transform group-hover:translate-x-1" />
              </>
            )}
          </Button>
        </motion.div>
      </div>
    </motion.div>
  </div>
);

const ComparisonSpiderChart = ({
  studentData,
  competitionData,
  showOnlyStudent = false,
}: {
  studentData: ReturnType<typeof useMyRecomendation>["studentSkillsData"];
  competitionData?: ReturnType<typeof useMyRecomendation>["competitionSkillsData"];
  showOnlyStudent?: boolean;
}) => {
  // Persiapkan data untuk grafik radar
  const chartData = useMemo(() => {
    if (!studentData.length) return [];

    // Ambil semua keterampilan unik dari kedua dataset
    const allSkills = new Set([
      ...studentData.map((item) => item.label),
      ...(competitionData?.map((item) => item.label) || []),
    ]);

    // Buat peta keterampilan mahasiswa untuk pencarian cepat
    const studentSkillMap = new Map(studentData.map((item) => [item.label, item.value]));

    // Buat peta keterampilan kompetisi untuk pencarian cepat
    const competitionSkillMap = new Map(
      competitionData?.map((item) => [item.label, item.value]) || []
    );

    // Buat data grafik dengan semua keterampilan
    return Array.from(allSkills)
      .sort()
      .map((skill) => ({
        skill: skillNameMapping[skill] || skill,
        student: studentSkillMap.get(skill) || 0,
        competition: competitionSkillMap.get(skill) || 0,
      }));
  }, [studentData, competitionData]);

  if (chartData.length === 0) {
    return (
      <div className="flex h-[400px] items-center justify-center rounded-xl border border-zinc-800/50 bg-gradient-to-br from-zinc-900/50 to-zinc-800/50 backdrop-blur-sm">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-zinc-700 to-zinc-800">
            <RadarIcon className="h-8 w-8 text-zinc-400" />
          </div>
          <TypographyP className="text-zinc-400">Tidak ada data tersedia</TypographyP>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-[400px] w-full overflow-hidden rounded-xl border border-zinc-800/50 bg-gradient-to-br from-zinc-900/50 to-zinc-800/50 backdrop-blur-sm">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500/20 via-transparent to-purple-500/20" />
      </div>

      <div className="relative h-full w-full p-6">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart
            cx="50%"
            cy="50%"
            outerRadius="85%"
            data={chartData}
            margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
          >
            <defs>
              <linearGradient id="studentGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.8} />
                <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.3} />
              </linearGradient>
              <linearGradient id="competitionGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.8} />
                <stop offset="100%" stopColor="#ef4444" stopOpacity={0.3} />
              </linearGradient>
            </defs>
            <PolarGrid stroke="rgba(255, 255, 255, 0.1)" strokeWidth={1} strokeDasharray="2 2" />
            <PolarAngleAxis
              dataKey="skill"
              tick={{ fill: "#e4e4e7", fontSize: 11, fontWeight: 500 }}
              stroke="rgba(255, 255, 255, 0.1)"
            />
            <PolarRadiusAxis
              angle={30}
              domain={[0, 10]}
              tick={{ fill: "#a1a1aa", fontSize: 10 }}
              stroke="rgba(255, 255, 255, 0.1)"
              tickCount={6}
            />
            <RadarChartComponent
              name="Keterampilan Anda"
              dataKey="student"
              stroke="#3b82f6"
              fill="url(#studentGradient)"
              fillOpacity={0.4}
              strokeWidth={2}
            />
            {!showOnlyStudent && competitionData && competitionData.length > 0 && (
              <RadarChartComponent
                name="Keterampilan yang Dibutuhkan"
                dataKey="competition"
                stroke="#f59e0b"
                fill="url(#competitionGradient)"
                fillOpacity={0.4}
                strokeWidth={2}
              />
            )}
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(24, 24, 27, 0.95)",
                border: "1px solid rgba(63, 63, 70, 0.5)",
                borderRadius: "0.75rem",
                color: "#fff",
                backdropFilter: "blur(10px)",
                boxShadow:
                  "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
              }}
              formatter={(value: number, name: string) => [
                `${value.toFixed(1)}/10`,
                name === "student" ? "Keterampilan Anda" : "Keterampilan yang Dibutuhkan",
              ]}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

interface TooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    payload: {
      breakdown: string;
    };
  }>;
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: TooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border border-zinc-700 bg-zinc-900 p-3 shadow-lg">
        <p className="mb-1 font-medium text-white">{label}</p>
        <p className="text-sm text-zinc-300">
          <span className="font-medium text-blue-400">{payload[0].value.toFixed(1)}/10</span>{" "}
          tingkat kepentingan
        </p>
        <p className="mt-2 text-xs text-zinc-400">{payload[0].payload.breakdown}</p>
      </div>
    );
  }
  return null;
};

// Helper function untuk menentukan warna berdasarkan nilai
const getSkillColor = (value: number): string => {
  if (value >= 0.8) return "#22c55e";
  if (value >= 0.6) return "#3b82f6";
  return "#f59e0b";
};

const SkillRequirementsChart = ({
  requirements,
}: {
  requirements: Record<string, { weight: number; breakdown: string }>;
}) => {
  const chartData = useMemo(
    () =>
      Object.entries(requirements)
        .map(([skill, { weight }]) => ({
          name: skillNameMapping[skill] || skill,
          value: weight * 10,
          breakdown: requirements[skill].breakdown,
          color: getSkillColor(weight),
        }))
        .sort((a, b) => b.value - a.value),
    [requirements]
  );

  return (
    <div className="relative overflow-hidden rounded-xl border border-zinc-800/50 bg-gradient-to-br from-zinc-900/50 to-zinc-800/50 backdrop-blur-sm">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-500/20 via-transparent to-blue-500/20" />
      </div>

      {/* Gradient Accent Line */}
      <div className="absolute top-0 -left-2 h-full w-1 rounded-full bg-gradient-to-b from-blue-500 via-purple-500 to-pink-500 shadow-lg" />

      <div className="relative h-[400px] w-full pr-4 pl-6">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 10, right: 40, left: 20, bottom: 10 }}
            barSize={28}
          >
            <defs>
              <linearGradient id="barGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.9} />
                <stop offset="50%" stopColor="#8b5cf6" stopOpacity={0.9} />
                <stop offset="100%" stopColor="#ec4899" stopOpacity={0.9} />
              </linearGradient>
              <linearGradient id="backgroundGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="rgba(255, 255, 255, 0.05)" />
                <stop offset="100%" stopColor="rgba(255, 255, 255, 0.02)" />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="2 2"
              stroke="rgba(255, 255, 255, 0.08)"
              horizontal={false}
            />
            <XAxis
              type="number"
              domain={[0, 10]}
              tick={{ fill: "#e4e4e7", fontSize: 11, fontWeight: 500 }}
              stroke="rgba(255, 255, 255, 0.1)"
              tickLine={{ stroke: "rgba(255, 255, 255, 0.1)" }}
              axisLine={false}
            />
            <YAxis
              type="category"
              dataKey="name"
              tick={{ fill: "#e4e4e7", fontSize: 11, fontWeight: 500 }}
              stroke="rgba(255, 255, 255, 0.1)"
              width={200}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar
              dataKey="value"
              radius={[0, 14, 14, 0]}
              background={{ fill: "url(#backgroundGradient)", radius: 14 }}
            >
              {chartData.map((entry, _index) => (
                <Cell
                  key={`cell-${entry.name}`}
                  fill={entry.color}
                  className="transition-all duration-300 hover:scale-105 hover:opacity-80"
                  style={{
                    filter: `drop-shadow(0 4px 8px ${entry.color}20)`,
                  }}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

const RecommendationContent = ({ data }: { data: RecommendationResponse }) => {
  const { selectedCompetition, setSelectedCompetition, studentSkillsData, competitionSkillsData } =
    useMyRecomendation();
  const recommendationsRef = useRef<HTMLDivElement>(null);

  // State untuk collapse/expand sections
  const [collapsedSections, setCollapsedSections] = useState({
    skillsComparison: false,
    skillsProfile: false,
    strengths: false,
    developmentSources: false,
  });

  // Sidebar perbandingan keterampilan
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  // Portal mounting guard
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        recommendationsRef.current &&
        !recommendationsRef.current.contains(event.target as Node)
      ) {
        setSelectedCompetition(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setSelectedCompetition]);

  const toggleSection = (section: keyof typeof collapsedSections) => {
    setCollapsedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-zinc-900 via-black to-zinc-900">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 h-96 w-96 animate-pulse rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 blur-3xl" />
        <div className="absolute right-1/4 bottom-1/4 h-80 w-80 animate-pulse rounded-full bg-gradient-to-r from-purple-500/10 to-pink-500/10 blur-3xl delay-1000" />
        <div className="absolute top-1/2 right-1/3 h-64 w-64 animate-pulse rounded-full bg-gradient-to-r from-cyan-500/10 to-blue-500/10 blur-2xl delay-500" />
      </div>

      <div className="relative z-10 space-y-8 p-6">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-6"
        >
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <TypographyH1 className="bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-3xl font-bold text-transparent md:text-5xl">
                Rekomendasi{" "}
                <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Kompetisi
                </span>
              </TypographyH1>
              <TypographyP className="text-lg text-zinc-300">
                Rekomendasi yang disesuaikan dengan{" "}
                <TypographyEmphasis className="text-blue-300">keterampilan</TypographyEmphasis>,{" "}
                <TypographyEmphasis className="text-purple-300">minat</TypographyEmphasis>, dan{" "}
                <TypographyEmphasis className="text-pink-300">tujuan</TypographyEmphasis> Anda
              </TypographyP>
            </div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button className="group relative overflow-hidden border border-zinc-700/50 bg-gradient-to-r from-zinc-800/50 to-zinc-900/50 text-white backdrop-blur-sm transition-all hover:border-zinc-600/50 hover:from-zinc-700/50 hover:to-zinc-800/50">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 transition-opacity group-hover:opacity-100" />
                <Activity className="mr-2 h-4 w-4" />
                Perbarui Analisis
              </Button>
            </motion.div>
          </div>

          {/* Student Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <Card className="group relative overflow-hidden border border-zinc-800/50 bg-gradient-to-br from-zinc-900/50 to-zinc-800/50 backdrop-blur-sm transition-all hover:border-zinc-700/50">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 transition-opacity group-hover:opacity-100" />
              <CardHeader>
                <CardTitle className="flex items-center space-x-3 text-white">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg">
                    <Users className="h-5 w-5" />
                  </div>
                  <span className="text-xl">Profil Mahasiswa</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <TypographyP className="leading-relaxed text-zinc-300">
                  {data.result.studentSummary}
                </TypographyP>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* Layout Horizontal - 4 Section Independen */}
        <div className="space-y-8">
          {/* Section 1 dipindah ke sidebar kanan */}

          {/* Section 2: Profil Keterampilan */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <Card className="group relative overflow-hidden border border-zinc-800/50 bg-gradient-to-br from-zinc-900/50 to-zinc-800/50 backdrop-blur-sm transition-all hover:border-zinc-700/50">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-pink-500/5 opacity-0 transition-opacity group-hover:opacity-100" />
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-pink-600 shadow-lg">
                      <Brain className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-xl text-white">Profil Keterampilan</span>
                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleSection("skillsProfile")}
                        className="bg-zinc-800/50 text-white backdrop-blur-sm hover:bg-zinc-700/50"
                      >
                        {collapsedSections.skillsProfile ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronUp className="h-4 w-4" />
                        )}
                      </Button>
                    </motion.div>
                  </div>
                </CardTitle>
                <CardDescription>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                    <div className="flex items-center space-x-2">
                      <div className="h-2 w-2 rounded-full bg-gradient-to-r from-green-400 to-green-500 shadow-sm" />
                      <span className="text-xs text-zinc-400">Tinggi</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="h-2 w-2 rounded-full bg-gradient-to-r from-blue-400 to-blue-500 shadow-sm" />
                      <span className="text-xs text-zinc-400">Sedang</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="h-2 w-2 rounded-full bg-gradient-to-r from-orange-400 to-orange-500 shadow-sm" />
                      <span className="text-xs text-zinc-400">Rendah</span>
                    </div>
                  </div>
                </CardDescription>
              </CardHeader>
              <AnimatePresence>
                {!collapsedSections.skillsProfile && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <CardContent className="p-6">
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {Object.entries(data.result.skillsProfile).map(
                          ([skill, { score, breakdown }], index) => (
                            <motion.div
                              key={skill}
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: index * 0.1, duration: 0.3 }}
                              className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-zinc-800/50 to-zinc-900/50 p-4 backdrop-blur-sm transition-all hover:from-zinc-700/50 hover:to-zinc-800/50 hover:shadow-lg hover:shadow-purple-500/10"
                            >
                              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-pink-500/5 opacity-0 transition-opacity group-hover:opacity-100" />
                              <div className="relative">
                                <div className="mb-3 flex items-center justify-between">
                                  <span className="truncate text-sm font-semibold text-white">
                                    {skillNameMapping[skill] || skill}
                                  </span>
                                  <span className="ml-2 text-sm font-bold text-purple-400">
                                    {(score * 10).toFixed(1)}/10
                                  </span>
                                </div>
                                <div className="relative mb-3 h-2 overflow-hidden rounded-full bg-zinc-700/50">
                                  <div
                                    className="absolute top-0 left-0 h-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500 shadow-sm transition-all"
                                    style={{ width: `${score * 100}%` }}
                                  />
                                </div>
                                <TypographyP className="text-sm leading-relaxed text-zinc-400">
                                  {breakdown}
                                </TypographyP>
                              </div>
                            </motion.div>
                          )
                        )}
                      </div>
                    </CardContent>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          </motion.div>

          {/* Section 3: Kekuatan Profil */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            <Card className="group relative overflow-hidden border border-zinc-800/50 bg-gradient-to-br from-zinc-900/50 to-zinc-800/50 backdrop-blur-sm transition-all hover:border-zinc-700/50">
              <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-emerald-500/5 opacity-0 transition-opacity group-hover:opacity-100" />
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 text-white">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-green-500 to-emerald-600 shadow-lg">
                      <Target className="h-5 w-5" />
                    </div>
                    <span className="text-xl">Kekuatan Profil</span>
                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleSection("strengths")}
                        className="bg-zinc-800/50 text-white backdrop-blur-sm hover:bg-zinc-700/50"
                      >
                        {collapsedSections.strengths ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronUp className="h-4 w-4" />
                        )}
                      </Button>
                    </motion.div>
                  </div>
                </CardTitle>
              </CardHeader>
              <AnimatePresence>
                {!collapsedSections.strengths && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <CardContent className="p-6">
                      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                        <div className="space-y-4">
                          <div className="flex items-center space-x-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-green-500 to-emerald-500 shadow-lg">
                              <Star className="h-4 w-4 text-white" />
                            </div>
                            <TypographyH3 className="text-lg text-white">Kelebihan</TypographyH3>
                          </div>
                          <div className="space-y-3">
                            {data.result.overallAssessment.strengths.map((strength, index) => (
                              <motion.div
                                key={`strength-${strength.slice(0, 20)}`}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1, duration: 0.3 }}
                                className="group flex items-start space-x-3 rounded-lg bg-gradient-to-r from-green-500/10 to-emerald-500/10 p-3 backdrop-blur-sm transition-all hover:from-green-500/20 hover:to-emerald-500/20"
                              >
                                <div className="mt-1 h-2 w-2 rounded-full bg-gradient-to-r from-green-400 to-emerald-400 shadow-sm" />
                                <TypographyP className="text-sm leading-relaxed text-zinc-300">
                                  {strength}
                                </TypographyP>
                              </motion.div>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div className="flex items-center space-x-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 shadow-lg">
                              <TrendingUp className="h-4 w-4 text-white" />
                            </div>
                            <TypographyH3 className="text-lg text-white">
                              Area Pengembangan
                            </TypographyH3>
                          </div>
                          <div className="space-y-3">
                            {data.result.overallAssessment.weaknesses.map((weakness, index) => (
                              <motion.div
                                key={`weakness-${weakness.slice(0, 20)}`}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1, duration: 0.3 }}
                                className="group flex items-start space-x-3 rounded-lg bg-gradient-to-r from-yellow-500/10 to-orange-500/10 p-3 backdrop-blur-sm transition-all hover:from-yellow-500/20 hover:to-orange-500/20"
                              >
                                <div className="mt-1 h-2 w-2 rounded-full bg-gradient-to-r from-yellow-400 to-orange-400 shadow-sm" />
                                <TypographyP className="text-sm leading-relaxed text-zinc-300">
                                  {weakness}
                                </TypographyP>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          </motion.div>

          {/* Section 4: Sumber Pengembangan */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0, duration: 0.8 }}
          >
            <Card className="group relative overflow-hidden border border-zinc-800/50 bg-gradient-to-br from-zinc-900/50 to-zinc-800/50 backdrop-blur-sm transition-all hover:border-zinc-700/50">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-blue-500/5 opacity-0 transition-opacity group-hover:opacity-100" />
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 text-white">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 shadow-lg">
                      <Lightbulb className="h-5 w-5" />
                    </div>
                    <span className="text-xl">Sumber Pengembangan</span>
                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleSection("developmentSources")}
                        className="bg-zinc-800/50 text-white backdrop-blur-sm hover:bg-zinc-700/50"
                      >
                        {collapsedSections.developmentSources ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronUp className="h-4 w-4" />
                        )}
                      </Button>
                    </motion.div>
                  </div>
                </CardTitle>
              </CardHeader>
              <AnimatePresence>
                {!collapsedSections.developmentSources && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <CardContent className="p-6">
                      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {data.result.developmentSuggestions.map((suggestion, index) => {
                          let icon;
                          let gradientClass;
                          switch (suggestion.type) {
                            case "course":
                              icon = <BookOpen className="h-5 w-5 text-white" />;
                              gradientClass = "from-blue-500 to-cyan-500";
                              break;
                            case "practice":
                              icon = <Code2 className="h-5 w-5 text-white" />;
                              gradientClass = "from-green-500 to-emerald-500";
                              break;
                            case "certification":
                              icon = <Trophy className="h-5 w-5 text-white" />;
                              gradientClass = "from-yellow-500 to-orange-500";
                              break;
                            default:
                              icon = <Lightbulb className="h-5 w-5 text-white" />;
                              gradientClass = "from-purple-500 to-pink-500";
                          }

                          return (
                            <motion.div
                              key={`suggestion-${suggestion.title}`}
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: index * 0.1, duration: 0.3 }}
                              className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-zinc-800/50 to-zinc-900/50 p-6 backdrop-blur-sm transition-all hover:from-zinc-700/50 hover:to-zinc-800/50 hover:shadow-lg hover:shadow-cyan-500/10"
                            >
                              <div
                                className={`absolute inset-0 bg-gradient-to-r ${gradientClass} opacity-0 transition-opacity group-hover:opacity-5`}
                              />
                              <div className="relative">
                                <div className="mb-4 flex items-center space-x-3">
                                  <div
                                    className={`flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r ${gradientClass} shadow-lg`}
                                  >
                                    {icon}
                                  </div>
                                  <TypographyH3 className="text-sm font-semibold text-white">
                                    {suggestion.title}
                                  </TypographyH3>
                                </div>
                                <TypographyP className="mb-4 text-sm leading-relaxed text-zinc-400">
                                  {suggestion.reason}
                                </TypographyP>
                                <motion.a
                                  href={suggestion.link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="group/link inline-flex items-center text-sm font-medium text-cyan-400 transition-colors hover:text-cyan-300"
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                >
                                  Kunjungi Sumber
                                  <ExternalLink className="ml-2 h-3 w-3 transition-transform group-hover/link:translate-x-1" />
                                </motion.a>
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          </motion.div>

          {/* Daftar Rekomendasi */}
          <motion.div
            ref={recommendationsRef}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.8 }}
          >
            <div className="mb-8 space-y-2">
              <TypographyH3 className="bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-2xl font-bold text-transparent md:text-3xl">
                Rekomendasi Terbaik untuk Anda
              </TypographyH3>
              <TypographyP className="text-zinc-400">
                Kompetisi yang paling sesuai dengan profil dan tujuan Anda
              </TypographyP>
            </div>
            <div className="space-y-6">
              {data.result.recommendations.map((rec, index) => (
                <motion.div
                  key={rec.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.4 + index * 0.1, duration: 0.5 }}
                >
                  <Card
                    className={`group relative cursor-pointer overflow-hidden border transition-all hover:shadow-2xl ${
                      selectedCompetition?.id === rec.id
                        ? "border-blue-500/50 bg-gradient-to-br from-blue-900/20 to-purple-900/20 ring-2 shadow-blue-500/25 ring-blue-500/50"
                        : "border-zinc-800/50 bg-gradient-to-br from-zinc-900/50 to-zinc-800/50 hover:border-zinc-700/50 hover:from-zinc-800/50 hover:to-zinc-700/50"
                    } backdrop-blur-sm`}
                    onClick={() => setSelectedCompetition(rec)}
                  >
                    <div
                      className={`absolute inset-0 bg-gradient-to-r opacity-0 transition-opacity group-hover:opacity-5 ${
                        selectedCompetition?.id === rec.id
                          ? "from-blue-500 to-purple-500"
                          : "from-zinc-500 to-zinc-600"
                      }`}
                    />

                    <CardHeader className="relative">
                      <div className="flex items-start justify-between">
                        <div className="space-y-3">
                          <div className="flex items-center space-x-3">
                            <div
                              className={`flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r ${getRankGradientClass(
                                rec.rank
                              )} shadow-xl`}
                            >
                              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/95">
                                <span className="text-base font-extrabold text-zinc-900">
                                  #{rec.rank}
                                </span>
                              </div>
                            </div>
                            <div>
                              <CardTitle className="text-xl text-white">
                                {rec.competitionName}
                              </CardTitle>
                              <div className="mt-1 flex items-center space-x-2">
                                <Badge
                                  className={`text-xs text-white ${getMatchScoreColor(rec.matchScore.score)}`}
                                >
                                  <Shield className="mr-1 h-3 w-3" />
                                  {(rec.matchScore.score * 10).toFixed(1)}/10 Kecocokan
                                </Badge>
                              </div>
                            </div>
                          </div>
                          <CardDescription className="leading-relaxed text-zinc-300">
                            {rec.matchScore.reason}
                          </CardDescription>
                        </div>
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="flex items-center space-x-2"
                        >
                          <div
                            className={`h-3 w-3 rounded-full transition-colors ${
                              selectedCompetition?.id === rec.id ? "bg-blue-500" : "bg-zinc-500"
                            }`}
                          />
                          <span className="text-xs text-zinc-400">
                            {selectedCompetition?.id === rec.id ? "Dipilih" : "Klik untuk detail"}
                          </span>
                        </motion.div>
                      </div>
                    </CardHeader>
                    <CardContent className="relative">
                      <Accordion type="single" collapsible className="space-y-4">
                        <AccordionItem value="match-explanation" className="border-zinc-700/50">
                          <AccordionTrigger className="group text-white hover:no-underline">
                            <div className="flex items-center space-x-3">
                              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-500 shadow-lg">
                                <BarChart3 className="h-4 w-4" />
                              </div>
                              <span className="font-semibold">Penjelasan Kecocokan</span>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="space-y-6 pl-11">
                              <TypographyP className="text-sm leading-relaxed text-zinc-300">
                                {rec.matchScore.reason}
                              </TypographyP>
                              <div className="space-y-6">
                                <div>
                                  <TypographyH3 className="mb-3 flex items-center space-x-2 text-sm text-white">
                                    <div className="h-2 w-2 rounded-full bg-gradient-to-r from-green-400 to-emerald-400" />
                                    <span>Kelebihan</span>
                                  </TypographyH3>
                                  <ul className="space-y-3">
                                    {rec.reasoning.pros.map((pro, proIndex) => (
                                      <motion.li
                                        key={`pro-${pro.slice(0, 20)}`}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: proIndex * 0.1, duration: 0.3 }}
                                        className="flex items-start space-x-3 rounded-lg bg-gradient-to-r from-green-500/10 to-emerald-500/10 p-3 backdrop-blur-sm"
                                      >
                                        <div className="mt-1 h-1.5 w-1.5 rounded-full bg-gradient-to-r from-green-400 to-emerald-400" />
                                        <TypographyP className="text-sm leading-relaxed text-zinc-300">
                                          {pro}
                                        </TypographyP>
                                      </motion.li>
                                    ))}
                                  </ul>
                                </div>
                                <div>
                                  <TypographyH3 className="mb-3 flex items-center space-x-2 text-sm text-white">
                                    <div className="h-2 w-2 rounded-full bg-gradient-to-r from-yellow-400 to-orange-400" />
                                    <span>Kekurangan</span>
                                  </TypographyH3>
                                  <ul className="space-y-3">
                                    {rec.reasoning.cons.map((con, conIndex) => (
                                      <motion.li
                                        key={`con-${con.slice(0, 20)}`}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: conIndex * 0.1, duration: 0.3 }}
                                        className="flex items-start space-x-3 rounded-lg bg-gradient-to-r from-yellow-500/10 to-orange-500/10 p-3 backdrop-blur-sm"
                                      >
                                        <div className="mt-1 h-1.5 w-1.5 rounded-full bg-gradient-to-r from-yellow-400 to-orange-400" />
                                        <TypographyP className="text-sm leading-relaxed text-zinc-300">
                                          {con}
                                        </TypographyP>
                                      </motion.li>
                                    ))}
                                  </ul>
                                </div>
                              </div>
                            </div>
                          </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="skill-breakdown" className="border-zinc-700/50">
                          <AccordionTrigger className="group text-white hover:no-underline">
                            <div className="flex items-center space-x-3">
                              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg">
                                <RadarIcon className="h-4 w-4" />
                              </div>
                              <span className="font-semibold">Kebutuhan Keterampilan</span>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="space-y-6 pl-11">
                              <div className="overflow-hidden rounded-xl border border-zinc-800/50 bg-gradient-to-br from-zinc-900/50 to-zinc-800/50 p-6 backdrop-blur-sm">
                                <div className="mb-6 flex items-center justify-between">
                                  <div>
                                    <TypographyH3 className="text-lg text-white">
                                      Tingkat Kepentingan Keterampilan
                                    </TypographyH3>
                                    <TypographyP className="mt-1 text-sm text-zinc-400">
                                      Visualisasi kebutuhan keterampilan untuk kompetisi ini
                                    </TypographyP>
                                  </div>
                                  <div className="flex items-center space-x-4">
                                    <div className="flex items-center space-x-2">
                                      <div className="h-3 w-3 rounded-full bg-gradient-to-r from-green-400 to-green-500" />
                                      <span className="text-xs text-zinc-400">Tinggi (8-10)</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      <div className="h-3 w-3 rounded-full bg-gradient-to-r from-blue-400 to-blue-500" />
                                      <span className="text-xs text-zinc-400">Sedang (6-7.9)</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      <div className="h-3 w-3 rounded-full bg-gradient-to-r from-orange-400 to-orange-500" />
                                      <span className="text-xs text-zinc-400">Rendah (0-5.9)</span>
                                    </div>
                                  </div>
                                </div>
                                <SkillRequirementsChart requirements={rec.skillRequirements} />
                              </div>
                            </div>
                          </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="competition-details" className="border-zinc-700/50">
                          <AccordionTrigger className="group text-white hover:no-underline">
                            <div className="flex items-center space-x-3">
                              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 shadow-lg">
                                <Calendar className="h-4 w-4" />
                              </div>
                              <span className="font-semibold">Detail Kompetisi</span>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="space-y-6 pl-11">
                              <div className="space-y-6">
                                <TypographyP className="text-sm leading-relaxed text-zinc-300">
                                  {rec.competition.description}
                                </TypographyP>

                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                  <div className="flex items-center space-x-3 rounded-lg bg-gradient-to-r from-emerald-500/10 to-teal-500/10 p-3 backdrop-blur-sm">
                                    <Calendar className="h-4 w-4 text-emerald-400" />
                                    <div>
                                      <span className="text-xs text-zinc-400">Mulai</span>
                                      <p className="text-sm font-medium text-zinc-300">
                                        {formatDate(rec.competition.startDate)}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="flex items-center space-x-3 rounded-lg bg-gradient-to-r from-emerald-500/10 to-teal-500/10 p-3 backdrop-blur-sm">
                                    <Calendar className="h-4 w-4 text-emerald-400" />
                                    <div>
                                      <span className="text-xs text-zinc-400">Selesai</span>
                                      <p className="text-sm font-medium text-zinc-300">
                                        {formatDate(rec.competition.endDate)}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="flex items-center space-x-3 rounded-lg bg-gradient-to-r from-emerald-500/10 to-teal-500/10 p-3 backdrop-blur-sm">
                                    <MapPin className="h-4 w-4 text-emerald-400" />
                                    <div>
                                      <span className="text-xs text-zinc-400">Lokasi</span>
                                      <p className="text-sm font-medium text-zinc-300">
                                        {rec.competition.location || "Daring"}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="flex items-center space-x-3 rounded-lg bg-gradient-to-r from-emerald-500/10 to-teal-500/10 p-3 backdrop-blur-sm">
                                    <Users className="h-4 w-4 text-emerald-400" />
                                    <div>
                                      <span className="text-xs text-zinc-400">Organizer</span>
                                      <p className="text-sm font-medium text-zinc-300">
                                        {rec.competition.organizer}
                                      </p>
                                    </div>
                                  </div>
                                </div>

                                {rec.competition.sourceUrl && (
                                  <motion.div
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                  >
                                    <a
                                      href={rec.competition.sourceUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="group/link inline-flex items-center space-x-2 rounded-lg bg-gradient-to-r from-blue-500/10 to-purple-500/10 p-3 text-blue-400 transition-all hover:from-blue-500/20 hover:to-purple-500/20 hover:text-blue-300"
                                    >
                                      <ExternalLink className="h-4 w-4" />
                                      <span className="font-medium">Kunjungi Website</span>
                                    </a>
                                  </motion.div>
                                )}
                              </div>
                            </div>
                          </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="key-factors" className="border-zinc-700/50">
                          <AccordionTrigger className="group text-white hover:no-underline">
                            <div className="flex items-center space-x-3">
                              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-orange-500 to-red-500 shadow-lg">
                                <Target className="h-4 w-4" />
                              </div>
                              <span className="font-semibold">Faktor Kunci Keberhasilan</span>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="space-y-4 pl-11">
                              {rec.keyFactors.map((factor, factorIndex) => (
                                <motion.div
                                  key={`factor-${factor.slice(0, 20)}`}
                                  initial={{ opacity: 0, x: -20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: factorIndex * 0.1, duration: 0.3 }}
                                  className="flex items-start space-x-3 rounded-lg bg-gradient-to-r from-orange-500/10 to-red-500/10 p-3 backdrop-blur-sm"
                                >
                                  <div className="mt-1 h-1.5 w-1.5 rounded-full bg-gradient-to-r from-orange-400 to-red-400" />
                                  <TypographyP className="text-sm leading-relaxed text-zinc-300">
                                    {factor}
                                  </TypographyP>
                                </motion.div>
                              ))}
                            </div>
                          </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="preparation" className="border-zinc-700/50">
                          <AccordionTrigger className="group text-white hover:no-underline">
                            <div className="flex items-center space-x-3">
                              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 shadow-lg">
                                <BookOpen className="h-4 w-4" />
                              </div>
                              <span className="font-semibold">Tips Persiapan</span>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="space-y-4 pl-11">
                              {rec.preparationTips.map((tip, tipIndex) => (
                                <motion.div
                                  key={`tip-${tip.slice(0, 20)}`}
                                  initial={{ opacity: 0, x: -20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: tipIndex * 0.1, duration: 0.3 }}
                                  className="flex items-start space-x-3 rounded-lg bg-gradient-to-r from-indigo-500/10 to-purple-500/10 p-3 backdrop-blur-sm"
                                >
                                  <ArrowRight className="mt-1 h-4 w-4 text-indigo-400" />
                                  <TypographyP className="text-sm leading-relaxed text-zinc-300">
                                    {tip}
                                  </TypographyP>
                                </motion.div>
                              ))}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {isMounted &&
        createPortal(
          <>
            {/* Toggle Button untuk Sidebar */}
            <motion.button
              aria-label={
                isSidebarOpen ? "Tutup perbandingan keterampilan" : "Buka perbandingan keterampilan"
              }
              onClick={() => setIsSidebarOpen((prev) => !prev)}
              className="fixed top-1/2 right-4 z-[100] -translate-y-1/2 rounded-full border border-zinc-700/50 bg-zinc-900/80 p-2 text-white shadow-xl backdrop-blur-md hover:bg-zinc-800/80"
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
            >
              {isSidebarOpen ? (
                <ChevronRight className="h-5 w-5" />
              ) : (
                <ChevronLeft className="h-5 w-5" />
              )}
            </motion.button>

            {/* Sidebar Kanan: Perbandingan Keterampilan */}
            <AnimatePresence>
              {isSidebarOpen && (
                <motion.div
                  initial={{ x: 420, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: 420, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 260, damping: 26 }}
                  className="fixed top-1/2 right-4 z-[90] w-[420px] -translate-y-1/2 overflow-hidden rounded-2xl border border-zinc-800/60 bg-gradient-to-b from-zinc-900/95 to-black/95 shadow-2xl backdrop-blur-xl"
                >
                  <div className="flex max-h-[85vh] flex-col">
                    <div className="flex items-center justify-between border-b border-zinc-800/60 p-4">
                      <div className="flex items-center space-x-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg">
                          <RadarIcon className="h-4 w-4 text-white" />
                        </div>
                        <span className="text-sm font-semibold text-white">
                          Perbandingan Keterampilan
                        </span>
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
                    <div className="flex-1 overflow-auto p-4">
                      <Card className="relative overflow-hidden border border-zinc-800/50 bg-gradient-to-br from-zinc-900/50 to-zinc-800/50">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5" />
                        <CardHeader>
                          <CardDescription className="text-zinc-400">
                            {selectedCompetition
                              ? `Perbandingan dengan ${selectedCompetition.competitionName}`
                              : "Pilih kompetisi untuk melihat perbandingan keterampilan"}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="p-0">
                          <div className="p-4">
                            <ComparisonSpiderChart
                              studentData={studentSkillsData}
                              competitionData={
                                selectedCompetition ? competitionSkillsData : undefined
                              }
                              showOnlyStudent={!selectedCompetition}
                            />
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </>,
          document.body
        )}
    </div>
  );
};

const MyRecommendationPage = () => {
  const { data, isLoading, error } = useMyRecomendation();
  const { createMyRecomendation, isCreating } = usePostMyRecomendation();

  const handleStartAnalysis = () => {
    createMyRecomendation();
  };

  if (isLoading) {
    return (
      <div className="relative flex min-h-[calc(100vh-4rem)] items-center justify-center overflow-hidden bg-gradient-to-br from-zinc-900 via-black to-zinc-900">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 h-64 w-64 animate-pulse rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 blur-3xl" />
          <div className="absolute right-1/4 bottom-1/4 h-48 w-48 animate-pulse rounded-full bg-gradient-to-r from-purple-500/10 to-pink-500/10 blur-3xl delay-1000" />
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 space-y-6 text-center"
        >
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-600 shadow-2xl">
            <Loader2 className="h-10 w-10 animate-spin text-white" />
          </div>
          <div className="space-y-2">
            <TypographyH3 className="text-xl text-white">Memuat Rekomendasi Anda</TypographyH3>
            <TypographyP className="text-zinc-400">
              Menganalisis profil dan mencari kompetisi terbaik...
            </TypographyP>
          </div>
        </motion.div>
      </div>
    );
  }

  if (!data) {
    if (error) {
      const maybeAxios = error as unknown as {
        response?: { data?: { code?: string; message?: string } };
      };
      const errCode = maybeAxios?.response?.data?.code;
      const errMessage =
        maybeAxios?.response?.data?.message ||
        (error as Error).message ||
        "Terjadi kesalahan yang tidak terduga";

      if (errCode === "REC_002") {
        return <EmptyState onStartAnalysis={handleStartAnalysis} isCreating={isCreating} />;
      }

      return (
        <div className="relative flex min-h-[calc(100vh-4rem)] items-center justify-center overflow-hidden bg-gradient-to-br from-zinc-900 via-black to-zinc-900">
          {/* Background Elements */}
          <div className="absolute inset-0">
            <div className="absolute top-1/4 left-1/4 h-64 w-64 animate-pulse rounded-full bg-gradient-to-r from-red-500/10 to-orange-500/10 blur-3xl" />
            <div className="absolute right-1/4 bottom-1/4 h-48 w-48 animate-pulse rounded-full bg-gradient-to-r from-orange-500/10 to-yellow-500/10 blur-3xl delay-1000" />
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="relative z-10 space-y-6 text-center"
          >
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-r from-red-500 to-orange-600 shadow-2xl">
              <AlertCircle className="h-10 w-10 text-white" />
            </div>
            <div className="space-y-4">
              <TypographyH3 className="text-xl text-white">Gagal Memuat Rekomendasi</TypographyH3>
              <TypographyP className="mx-auto max-w-md text-zinc-400">{errMessage}</TypographyP>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="outline"
                  className="border-zinc-700 bg-zinc-800/50 text-white backdrop-blur-sm hover:bg-zinc-700/50"
                  onClick={() => window.location.reload()}
                >
                  <Zap className="mr-2 h-4 w-4" />
                  Coba Lagi
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      );
    }
    return <EmptyState onStartAnalysis={handleStartAnalysis} isCreating={isCreating} />;
  }

  return <RecommendationContent data={data} />;
};

export default MyRecommendationPage;
