"use client";

import { motion } from "framer-motion";
import {
  Trophy,
  Award,
  Target,
  Star,
  Calendar,
  MapPin,
  Users,
  ExternalLink,
  BarChart3,
  BookOpen,
  ArrowRight,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { TypographyH3, TypographyP } from "@/components/ui/typography";
import { cn } from "@/lib/utils";

// Mapping nama skill ke bahasa Indonesia
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

// Helper functions
const formatDate = (dateString: string | null | undefined) => {
  if (!dateString) return "TBD";
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
};

// Score Distribution Chart
interface ScoreDistributionData {
  excellent?: number;
  good?: number;
  fair?: number;
  poor?: number;
}

export const ScoreDistributionChart = ({ data }: { data: ScoreDistributionData | null }) => {
  if (!data) {
    return (
      <div className="flex h-64 items-center justify-center rounded-lg border border-zinc-600 bg-zinc-800/50">
        <div className="text-center">
          <Trophy className="mx-auto h-12 w-12 text-zinc-400" />
          <p className="mt-2 text-sm text-zinc-400">Tidak ada data tersedia</p>
        </div>
      </div>
    );
  }

  const chartData = [
    { name: "Excellent (8-10)", value: data.excellent || 0, color: "#10b981" },
    { name: "Good (6-7.9)", value: data.good || 0, color: "#3b82f6" },
    { name: "Fair (4-5.9)", value: data.fair || 0, color: "#f59e0b" },
    { name: "Poor (0-3.9)", value: data.poor || 0, color: "#ef4444" },
  ].filter((item) => item.value > 0);

  if (chartData.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center rounded-lg border border-zinc-600 bg-zinc-800/50">
        <div className="text-center">
          <Trophy className="mx-auto h-12 w-12 text-zinc-400" />
          <p className="mt-2 text-sm text-zinc-400">Tidak ada data tersedia</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={5}
            dataKey="value"
          >
            {chartData.map((entry) => (
              <Cell key={`cell-${entry.name}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: "rgba(24, 24, 27, 0.95)",
              border: "1px solid rgba(63, 63, 70, 0.5)",
              borderRadius: "0.75rem",
              color: "#fff",
            }}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="mt-4 flex flex-wrap justify-center gap-4">
        {chartData.map((item) => (
          <div key={item.name} className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
            <span className="text-sm text-zinc-300">{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Competition Type Chart
interface CompetitionTypeData {
  type: string;
  count: number;
  averageScore: number;
  percentage: number;
}

export const CompetitionTypeChart = ({ data }: { data: CompetitionTypeData[] }) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center rounded-lg border border-zinc-600 bg-zinc-800/50">
        <div className="text-center">
          <Award className="mx-auto h-12 w-12 text-zinc-400" />
          <p className="mt-2 text-sm text-zinc-400">Tidak ada data tersedia</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
          <XAxis
            dataKey="type"
            tick={{ fill: "#e4e4e7", fontSize: 12 }}
            stroke="rgba(255, 255, 255, 0.1)"
          />
          <YAxis tick={{ fill: "#e4e4e7", fontSize: 12 }} stroke="rgba(255, 255, 255, 0.1)" />
          <Tooltip
            contentStyle={{
              backgroundColor: "rgba(24, 24, 27, 0.95)",
              border: "1px solid rgba(63, 63, 70, 0.5)",
              borderRadius: "0.75rem",
              color: "#fff",
            }}
            formatter={(value: number, name: string) => [
              `${value}`,
              name === "count" ? "Jumlah" : "Skor Rata-rata",
            ]}
          />
          <Bar dataKey="count" fill="url(#competitionGradient)" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

// Skill Comparison Chart
interface SkillComparisonData {
  skill: string;
  studentScore: number;
  averageScore: number;
  difference: number;
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

export const SkillComparisonChart = ({
  data,
  selectedCompetition,
  isLight = false,
}: {
  data: SkillComparisonData[];
  selectedCompetition?: CompetitionData | null;
  isLight?: boolean;
}) => {
  if (!data || data.length === 0) {
    return (
      <div
        className={cn(
          "flex h-[400px] items-center justify-center rounded-xl border backdrop-blur-sm",
          isLight
            ? "border-stone-300/70 bg-stone-50/80"
            : "border-zinc-800/50 bg-gradient-to-br from-zinc-900/50 to-zinc-800/50"
        )}
      >
        <div className="text-center">
          <div
            className={cn(
              "mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full",
              isLight ? "bg-stone-200" : "bg-gradient-to-r from-zinc-700 to-zinc-800"
            )}
          >
            <Target className={cn("h-8 w-8", isLight ? "text-[#5C5245]" : "text-zinc-400")} />
          </div>
          <p className={cn("text-sm", isLight ? "text-[#5C5245]" : "text-zinc-400")}>
            Tidak ada data tersedia
          </p>
        </div>
      </div>
    );
  }

  // Generate competition skill requirements based on selected competition
  const generateCompetitionSkills = (competition: CompetitionData | null) => {
    if (!competition) return {};

    // Mock skill requirements based on competition field
    const skillMap: Record<string, number> = {};
    competition.field.forEach((field) => {
      switch (field.toLowerCase()) {
        case "programming":
        case "algorithm":
          skillMap.technicalExpertise = 8.5;
          skillMap.problemSolving = 8.0;
          skillMap.selfLearning = 7.5;
          skillMap.creativityInnovation = 6.0;
          skillMap.communication = 6.5;
          skillMap.scientificWriting = 5.0;
          skillMap.designThinking = 5.5;
          skillMap.teamworkCollaboration = 6.0;
          skillMap.projectManagement = 5.5;
          skillMap.businessAcumen = 4.0;
          break;
        case "data science":
        case "machine learning":
          skillMap.technicalExpertise = 8.0;
          skillMap.problemSolving = 8.5;
          skillMap.scientificWriting = 7.0;
          skillMap.selfLearning = 7.0;
          skillMap.creativityInnovation = 6.5;
          skillMap.communication = 6.0;
          skillMap.designThinking = 5.0;
          skillMap.teamworkCollaboration = 5.5;
          skillMap.projectManagement = 6.0;
          skillMap.businessAcumen = 5.5;
          break;
        case "web development":
        case "frontend":
          skillMap.technicalExpertise = 7.5;
          skillMap.creativityInnovation = 8.0;
          skillMap.communication = 7.0;
          skillMap.designThinking = 7.5;
          skillMap.problemSolving = 7.0;
          skillMap.selfLearning = 6.5;
          skillMap.scientificWriting = 4.0;
          skillMap.teamworkCollaboration = 6.5;
          skillMap.projectManagement = 6.0;
          skillMap.businessAcumen = 5.0;
          break;
        case "mobile development":
        case "android":
          skillMap.technicalExpertise = 8.0;
          skillMap.problemSolving = 7.5;
          skillMap.designThinking = 7.0;
          skillMap.creativityInnovation = 6.5;
          skillMap.selfLearning = 6.0;
          skillMap.communication = 5.5;
          skillMap.scientificWriting = 3.0;
          skillMap.teamworkCollaboration = 5.0;
          skillMap.projectManagement = 5.5;
          skillMap.businessAcumen = 4.5;
          break;
        case "artificial intelligence":
        case "innovation":
          skillMap.technicalExpertise = 8.5;
          skillMap.creativityInnovation = 8.5;
          skillMap.problemSolving = 8.0;
          skillMap.selfLearning = 7.5;
          skillMap.scientificWriting = 6.0;
          skillMap.communication = 6.0;
          skillMap.designThinking = 6.5;
          skillMap.teamworkCollaboration = 6.0;
          skillMap.projectManagement = 6.5;
          skillMap.businessAcumen = 6.0;
          break;
        default:
          skillMap.technicalExpertise = 7.0;
          skillMap.problemSolving = 7.0;
          skillMap.communication = 6.5;
          skillMap.creativityInnovation = 6.0;
          skillMap.selfLearning = 6.0;
          skillMap.scientificWriting = 5.0;
          skillMap.designThinking = 5.0;
          skillMap.teamworkCollaboration = 5.5;
          skillMap.projectManagement = 5.0;
          skillMap.businessAcumen = 4.5;
      }
    });
    return skillMap;
  };

  const competitionSkills = generateCompetitionSkills(selectedCompetition || null);

  const chartData = data.map((item) => ({
    skill: skillNameMapping[item.skill] || item.skill.replace(/_/g, " "),
    student: item.studentScore,
    competition: competitionSkills[item.skill] || 0,
  }));

  return (
    <div
      className={cn(
        "relative h-[400px] w-full overflow-hidden rounded-xl border backdrop-blur-sm",
        isLight
          ? "border-stone-300/70 bg-stone-50/80"
          : "border-zinc-800/50 bg-gradient-to-br from-zinc-900/50 to-zinc-800/50"
      )}
    >
      {/* Background Pattern */}
      {!isLight && (
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500/20 via-transparent to-purple-500/20" />
        </div>
      )}

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
            <PolarGrid
              stroke={isLight ? "rgba(0,0,0,0.1)" : "rgba(255, 255, 255, 0.1)"}
              strokeWidth={1}
              strokeDasharray="2 2"
            />
            <PolarAngleAxis
              dataKey="skill"
              tick={{
                fill: isLight ? "#2F2A24" : "#e4e4e7",
                fontSize: 11,
                fontWeight: 500,
              }}
              stroke={isLight ? "rgba(0,0,0,0.1)" : "rgba(255, 255, 255, 0.1)"}
            />
            <PolarRadiusAxis
              angle={30}
              domain={[0, 10]}
              tick={{ fill: isLight ? "#5C5245" : "#a1a1aa", fontSize: 10 }}
              stroke={isLight ? "rgba(0,0,0,0.1)" : "rgba(255, 255, 255, 0.1)"}
              tickCount={6}
            />
            <Radar
              name="Keterampilan Mahasiswa"
              dataKey="student"
              stroke="#3b82f6"
              fill="url(#studentGradient)"
              fillOpacity={0.4}
              strokeWidth={2}
            />
            {selectedCompetition && chartData.some((item) => item.competition > 0) && (
              <Radar
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
                backgroundColor: isLight ? "rgba(255, 255, 255, 0.95)" : "rgba(24, 24, 27, 0.95)",
                border: isLight
                  ? "1px solid rgba(214, 211, 209, 0.5)"
                  : "1px solid rgba(63, 63, 70, 0.5)",
                borderRadius: "0.75rem",
                color: isLight ? "#2F2A24" : "#fff",
                backdropFilter: "blur(10px)",
                boxShadow:
                  "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
              }}
              formatter={(value: number, name: string) =>
                // name sudah berisi "Keterampilan Mahasiswa" atau "Keterampilan yang Dibutuhkan" dari Radar component
                // Tapi kita perlu memastikan menggunakan name yang benar berdasarkan dataKey
                // Untuk keamanan, kita cek apakah name sudah sesuai, jika tidak, gunakan dataKey
                [`${value.toFixed(1)}/10`, name]
              }
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

// Top Competitions List
interface TopCompetitionData {
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
}

export const TopCompetitionsList = ({
  data,
  competitions,
  onCompetitionSelect,
  selectedCompetition,
  isLight = false,
}: {
  data: TopCompetitionData[];
  competitions: CompetitionData[];
  onCompetitionSelect?: (competition: CompetitionData) => void;
  selectedCompetition?: CompetitionData | null;
  isLight?: boolean;
}) => {
  const displayData =
    data.length > 0
      ? data
      : competitions.map((comp, index) => ({
          competition: {
            id: comp.id,
            title: comp.title,
            field: comp.field,
            organizer: comp.organizer,
            description: comp.description,
            startDate: comp.startDate,
            endDate: comp.endDate,
            location: comp.location,
            sourceUrl: comp.sourceUrl,
            type: comp.type,
            minGPA: comp.minGPA,
            relevantSkills: comp.relevantSkills,
          },
          matchScore: comp.matchScore || 0.8,
          rank: comp.rank || index + 1,
          reasoning: undefined,
          keyFactors: undefined,
          preparationTips: undefined,
          skillRequirements: undefined,
        }));

  if (!displayData || displayData.length === 0) {
    return (
      <div
        className={cn(
          "flex h-64 items-center justify-center rounded-lg border",
          isLight ? "border-stone-300/70 bg-stone-50/80" : "border-zinc-600 bg-zinc-800/50"
        )}
      >
        <div className="text-center">
          <Star className={cn("mx-auto h-12 w-12", isLight ? "text-[#5C5245]" : "text-zinc-400")} />
          <p className={cn("mt-2 text-sm", isLight ? "text-[#5C5245]" : "text-zinc-400")}>
            Tidak ada data tersedia
          </p>
        </div>
      </div>
    );
  }

  const getRankGradientClass = (rank: number): string => {
    if (rank === 1) return "from-yellow-400 via-amber-400 to-orange-400";
    if (rank === 2) return "from-zinc-300 via-gray-300 to-zinc-400";
    if (rank === 3) return "from-amber-700 via-orange-600 to-amber-600";
    return "from-blue-500 via-purple-500 to-pink-500";
  };

  return (
    <div className="space-y-6">
      {displayData.slice(0, 5).map((item) => (
        <motion.div
          key={item.competition.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.3 }}
        >
          <Card
            className={cn(
              "group relative cursor-pointer overflow-hidden border backdrop-blur-sm transition-all hover:shadow-2xl",
              selectedCompetition?.id === item.competition.id
                ? isLight
                  ? "border-blue-400/50 bg-blue-50/80 ring-2 ring-blue-400/30"
                  : "border-blue-500/50 bg-gradient-to-br from-blue-900/20 to-purple-900/20 ring-2 shadow-blue-500/25 ring-blue-500/50"
                : isLight
                  ? "border-stone-300/70 bg-white/90 hover:border-stone-400/70 hover:bg-stone-50/90"
                  : "border-zinc-800/50 bg-gradient-to-br from-zinc-900/50 to-zinc-800/50 hover:border-zinc-700/50 hover:from-zinc-800/50 hover:to-zinc-700/50"
            )}
            onClick={() => {
              const selectedComp = competitions.find((c) => c.id === item.competition.id);
              if (selectedComp) {
                onCompetitionSelect?.(selectedComp);
              } else {
                // Create a CompetitionData object from TopCompetitionData
                const compData: CompetitionData = {
                  id: item.competition.id,
                  title: item.competition.title,
                  field: item.competition.field,
                  organizer: item.competition.organizer,
                  description: item.competition.description,
                  startDate: item.competition.startDate,
                  endDate: item.competition.endDate,
                  location: item.competition.location,
                  sourceUrl: item.competition.sourceUrl,
                  type: item.competition.type,
                  minGPA: item.competition.minGPA,
                  relevantSkills: item.competition.relevantSkills,
                  matchScore: item.matchScore,
                  rank: item.rank,
                };
                onCompetitionSelect?.(compData);
              }
            }}
          >
            <div
              className={`absolute inset-0 bg-gradient-to-r opacity-0 transition-opacity group-hover:opacity-5 ${
                selectedCompetition?.id === item.competition.id
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
                        item.rank
                      )} shadow-xl`}
                    >
                      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/95">
                        <span className="text-base font-extrabold text-zinc-900">#{item.rank}</span>
                      </div>
                    </div>
                    <div>
                      <CardTitle
                        className={cn("text-xl", isLight ? "text-[#2F2A24]" : "text-white")}
                      >
                        {item.competition.title}
                      </CardTitle>
                    </div>
                  </div>
                  <CardDescription
                    className={cn("leading-relaxed", isLight ? "text-[#5C5245]" : "text-zinc-300")}
                  >
                    {item.competition.description ||
                      "Kompetisi yang sangat cocok dengan profil mahasiswa ini."}
                  </CardDescription>
                </div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center space-x-2"
                >
                  <div
                    className={`h-3 w-3 rounded-full transition-colors ${
                      selectedCompetition?.id === item.competition.id
                        ? "bg-blue-500"
                        : "bg-zinc-500"
                    }`}
                  />
                  <span className={cn("text-xs", isLight ? "text-[#5C5245]" : "text-zinc-400")}>
                    {selectedCompetition?.id === item.competition.id
                      ? "Dipilih"
                      : "Klik untuk detail"}
                  </span>
                </motion.div>
              </div>
            </CardHeader>
            <CardContent className="relative">
              <Accordion type="single" collapsible className="space-y-4">
                <AccordionItem
                  value="competition-details"
                  className={cn(isLight ? "border-stone-300/50" : "border-zinc-700/50")}
                >
                  <AccordionTrigger
                    className={cn(
                      "group hover:no-underline",
                      isLight ? "text-[#2F2A24]" : "text-white"
                    )}
                  >
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
                        <TypographyP
                          className={cn(
                            "text-sm leading-relaxed",
                            isLight ? "text-[#5C5245]" : "text-zinc-300"
                          )}
                        >
                          {item.competition.description ||
                            "Kompetisi yang sangat cocok dengan profil mahasiswa ini."}
                        </TypographyP>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                          <div
                            className={cn(
                              "flex items-center space-x-3 rounded-lg p-3 backdrop-blur-sm",
                              isLight
                                ? "bg-emerald-50/80"
                                : "bg-gradient-to-r from-emerald-500/10 to-teal-500/10"
                            )}
                          >
                            <Calendar
                              className={cn(
                                "h-4 w-4",
                                isLight ? "text-emerald-600" : "text-emerald-400"
                              )}
                            />
                            <div>
                              <span
                                className={cn(
                                  "text-xs",
                                  isLight ? "text-[#5C5245]" : "text-zinc-400"
                                )}
                              >
                                Mulai
                              </span>
                              <p
                                className={cn(
                                  "text-sm font-medium",
                                  isLight ? "text-[#2F2A24]" : "text-zinc-300"
                                )}
                              >
                                {formatDate(item.competition.startDate)}
                              </p>
                            </div>
                          </div>
                          <div
                            className={cn(
                              "flex items-center space-x-3 rounded-lg p-3 backdrop-blur-sm",
                              isLight
                                ? "bg-emerald-50/80"
                                : "bg-gradient-to-r from-emerald-500/10 to-teal-500/10"
                            )}
                          >
                            <Calendar
                              className={cn(
                                "h-4 w-4",
                                isLight ? "text-emerald-600" : "text-emerald-400"
                              )}
                            />
                            <div>
                              <span
                                className={cn(
                                  "text-xs",
                                  isLight ? "text-[#5C5245]" : "text-zinc-400"
                                )}
                              >
                                Selesai
                              </span>
                              <p
                                className={cn(
                                  "text-sm font-medium",
                                  isLight ? "text-[#2F2A24]" : "text-zinc-300"
                                )}
                              >
                                {formatDate(item.competition.endDate)}
                              </p>
                            </div>
                          </div>
                          <div
                            className={cn(
                              "flex items-center space-x-3 rounded-lg p-3 backdrop-blur-sm",
                              isLight
                                ? "bg-emerald-50/80"
                                : "bg-gradient-to-r from-emerald-500/10 to-teal-500/10"
                            )}
                          >
                            <MapPin
                              className={cn(
                                "h-4 w-4",
                                isLight ? "text-emerald-600" : "text-emerald-400"
                              )}
                            />
                            <div>
                              <span
                                className={cn(
                                  "text-xs",
                                  isLight ? "text-[#5C5245]" : "text-zinc-400"
                                )}
                              >
                                Lokasi
                              </span>
                              <p
                                className={cn(
                                  "text-sm font-medium",
                                  isLight ? "text-[#2F2A24]" : "text-zinc-300"
                                )}
                              >
                                {item.competition.location || "Daring"}
                              </p>
                            </div>
                          </div>
                          <div
                            className={cn(
                              "flex items-center space-x-3 rounded-lg p-3 backdrop-blur-sm",
                              isLight
                                ? "bg-emerald-50/80"
                                : "bg-gradient-to-r from-emerald-500/10 to-teal-500/10"
                            )}
                          >
                            <Users
                              className={cn(
                                "h-4 w-4",
                                isLight ? "text-emerald-600" : "text-emerald-400"
                              )}
                            />
                            <div>
                              <span
                                className={cn(
                                  "text-xs",
                                  isLight ? "text-[#5C5245]" : "text-zinc-400"
                                )}
                              >
                                Organizer
                              </span>
                              <p
                                className={cn(
                                  "text-sm font-medium",
                                  isLight ? "text-[#2F2A24]" : "text-zinc-300"
                                )}
                              >
                                {item.competition.organizer}
                              </p>
                            </div>
                          </div>
                        </div>

                        {item.competition.sourceUrl && (
                          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                            <a
                              href={item.competition.sourceUrl}
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

                {item.reasoning && (
                  <AccordionItem
                    value="match-explanation"
                    className={cn(isLight ? "border-stone-300/50" : "border-zinc-700/50")}
                  >
                    <AccordionTrigger
                      className={cn(
                        "group hover:no-underline",
                        isLight ? "text-[#2F2A24]" : "text-white"
                      )}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-500 shadow-lg">
                          <BarChart3 className="h-4 w-4" />
                        </div>
                        <span className="font-semibold">Penjelasan Kecocokan</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-6 pl-11">
                        <div className="space-y-6">
                          <div>
                            <TypographyH3
                              className={cn(
                                "mb-3 flex items-center space-x-2 text-sm",
                                isLight ? "text-[#2F2A24]" : "text-white"
                              )}
                            >
                              <div className="h-2 w-2 rounded-full bg-gradient-to-r from-green-400 to-emerald-400" />
                              <span>Kelebihan</span>
                            </TypographyH3>
                            <ul className="space-y-3">
                              {item.reasoning.pros.map((pro, proIndex) => (
                                <motion.li
                                  key={`pro-${pro.slice(0, 20)}`}
                                  initial={{ opacity: 0, x: -20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: proIndex * 0.1, duration: 0.3 }}
                                  className={cn(
                                    "flex items-start space-x-3 rounded-lg p-3 backdrop-blur-sm",
                                    isLight
                                      ? "bg-green-50/80"
                                      : "bg-gradient-to-r from-green-500/10 to-emerald-500/10"
                                  )}
                                >
                                  <div className="mt-1 h-1.5 w-1.5 rounded-full bg-gradient-to-r from-green-400 to-emerald-400" />
                                  <TypographyP
                                    className={cn(
                                      "text-sm leading-relaxed",
                                      isLight ? "text-[#5C5245]" : "text-zinc-300"
                                    )}
                                  >
                                    {pro}
                                  </TypographyP>
                                </motion.li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <TypographyH3
                              className={cn(
                                "mb-3 flex items-center space-x-2 text-sm",
                                isLight ? "text-[#2F2A24]" : "text-white"
                              )}
                            >
                              <div className="h-2 w-2 rounded-full bg-gradient-to-r from-yellow-400 to-orange-400" />
                              <span>Kekurangan</span>
                            </TypographyH3>
                            <ul className="space-y-3">
                              {item.reasoning.cons.map((con, conIndex) => (
                                <motion.li
                                  key={`con-${con.slice(0, 20)}`}
                                  initial={{ opacity: 0, x: -20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: conIndex * 0.1, duration: 0.3 }}
                                  className={cn(
                                    "flex items-start space-x-3 rounded-lg p-3 backdrop-blur-sm",
                                    isLight
                                      ? "bg-yellow-50/80"
                                      : "bg-gradient-to-r from-yellow-500/10 to-orange-500/10"
                                  )}
                                >
                                  <div className="mt-1 h-1.5 w-1.5 rounded-full bg-gradient-to-r from-yellow-400 to-orange-400" />
                                  <TypographyP
                                    className={cn(
                                      "text-sm leading-relaxed",
                                      isLight ? "text-[#5C5245]" : "text-zinc-300"
                                    )}
                                  >
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
                )}

                {item.keyFactors && (
                  <AccordionItem
                    value="key-factors"
                    className={cn(isLight ? "border-stone-300/50" : "border-zinc-700/50")}
                  >
                    <AccordionTrigger
                      className={cn(
                        "group hover:no-underline",
                        isLight ? "text-[#2F2A24]" : "text-white"
                      )}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-orange-500 to-red-500 shadow-lg">
                          <Target className="h-4 w-4 text-white" />
                        </div>
                        <span className="font-semibold">Faktor Kunci Keberhasilan</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4 pl-11">
                        {item.keyFactors.map((factor, factorIndex) => (
                          <motion.div
                            key={`factor-${factor.slice(0, 20)}`}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: factorIndex * 0.1, duration: 0.3 }}
                            className={cn(
                              "flex items-start space-x-3 rounded-lg p-3 backdrop-blur-sm",
                              isLight
                                ? "bg-orange-50/80"
                                : "bg-gradient-to-r from-orange-500/10 to-red-500/10"
                            )}
                          >
                            <div className="mt-1 h-1.5 w-1.5 rounded-full bg-gradient-to-r from-orange-400 to-red-400" />
                            <TypographyP
                              className={cn(
                                "text-sm leading-relaxed",
                                isLight ? "text-[#5C5245]" : "text-zinc-300"
                              )}
                            >
                              {factor}
                            </TypographyP>
                          </motion.div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                )}

                {item.preparationTips && (
                  <AccordionItem
                    value="preparation"
                    className={cn(isLight ? "border-stone-300/50" : "border-zinc-700/50")}
                  >
                    <AccordionTrigger
                      className={cn(
                        "group hover:no-underline",
                        isLight ? "text-[#2F2A24]" : "text-white"
                      )}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 shadow-lg">
                          <BookOpen className="h-4 w-4 text-white" />
                        </div>
                        <span className="font-semibold">Tips Persiapan</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4 pl-11">
                        {item.preparationTips.map((tip, tipIndex) => (
                          <motion.div
                            key={`tip-${tip.slice(0, 20)}`}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: tipIndex * 0.1, duration: 0.3 }}
                            className={cn(
                              "flex items-start space-x-3 rounded-lg p-3 backdrop-blur-sm",
                              isLight
                                ? "bg-indigo-50/80"
                                : "bg-gradient-to-r from-indigo-500/10 to-purple-500/10"
                            )}
                          >
                            <ArrowRight
                              className={cn(
                                "mt-1 h-4 w-4",
                                isLight ? "text-indigo-600" : "text-indigo-400"
                              )}
                            />
                            <TypographyP
                              className={cn(
                                "text-sm leading-relaxed",
                                isLight ? "text-[#5C5245]" : "text-zinc-300"
                              )}
                            >
                              {tip}
                            </TypographyP>
                          </motion.div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                )}
              </Accordion>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};
