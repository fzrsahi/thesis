"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  Trophy,
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
  Sparkles,
  Zap,
  Star,
  TrendingUp,
  Rocket,
} from "lucide-react";
import { useEffect, useState } from "react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Button from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
  TypographyH1,
  TypographyH3,
  TypographyP,
  TypographyEmphasis,
} from "@/components/ui/typography";
import { cn } from "@/lib/utils";

import {
  useMyRecomendation,
  formatDate,
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
  isLight,
}: {
  onStartAnalysis: () => void;
  isCreating: boolean;
  isLight: boolean;
}) => (
  <div
    className={cn(
      "relative flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center overflow-hidden",
      isLight
        ? "bg-gradient-to-br from-zinc-200 via-stone-200 to-zinc-300 text-[#2F2A24]"
        : "bg-gradient-to-br from-zinc-900 via-black to-zinc-900 text-white"
    )}
  >
    {/* Animated Background Elements */}
    <div className="absolute inset-0">
      {isLight ? (
        <>
          <div className="absolute top-1/4 left-1/4 h-64 w-64 animate-pulse rounded-full bg-gradient-to-r from-[#F7C8A2]/25 to-[#E9A779]/25 blur-3xl" />
          <div className="absolute right-1/4 bottom-1/4 h-48 w-48 animate-pulse rounded-full bg-gradient-to-r from-[#F4B087]/25 to-[#E37B59]/25 blur-3xl delay-1000" />
          <div className="absolute top-1/2 right-1/3 h-32 w-32 animate-pulse rounded-full bg-gradient-to-r from-[#F2C190]/25 to-[#F6A964]/25 blur-2xl delay-500" />
        </>
      ) : (
        <>
          <div className="absolute top-1/4 left-1/4 h-64 w-64 animate-pulse rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-3xl" />
          <div className="absolute right-1/4 bottom-1/4 h-48 w-48 animate-pulse rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 blur-3xl delay-1000" />
          <div className="absolute top-1/2 right-1/3 h-32 w-32 animate-pulse rounded-full bg-gradient-to-r from-cyan-500/20 to-blue-500/20 blur-2xl delay-500" />
        </>
      )}
    </div>

    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className={cn("relative z-10 space-y-8 px-4 text-center", isLight && "text-[#2F2A24]")}
    >
      {/* Hero Icon */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        className={cn(
          "mx-auto flex h-24 w-24 items-center justify-center rounded-full shadow-2xl",
          isLight
            ? "bg-gradient-to-r from-[#F6A964] to-[#E36C3A]"
            : "bg-gradient-to-r from-blue-500 to-purple-600"
        )}
      >
        <Rocket className={cn("h-12 w-12", isLight ? "text-white" : "text-white")} />
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
          <TypographyP
            className={cn(
              "mx-auto max-w-2xl text-lg md:text-xl",
              isLight ? "text-[#5C5245]" : "text-zinc-300"
            )}
          >
            Dapatkan rekomendasi kompetisi yang disesuaikan dengan{" "}
            <span className="font-semibold text-blue-300">keterampilan</span>,{" "}
            <span className="font-semibold text-purple-300">minat</span>, dan{" "}
            <span className="font-semibold text-pink-300">profil akademik</span> Anda. Kami akan
            menganalisis profil Anda dan memberikan saran kompetisi terbaik.
          </TypographyP>
        </motion.div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
        >
          <Button
            size="lg"
            className={cn(
              "group relative overflow-hidden px-8 py-4 text-lg font-bold text-white shadow-2xl transition-all hover:scale-105",
              isLight
                ? "bg-gradient-to-r from-[#F6A964] to-[#E36C3A] hover:from-[#F2A558] hover:to-[#D86330] hover:shadow-[#E4986E]/30"
                : "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 hover:shadow-blue-500/25"
            )}
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

const RecommendationContent = ({
  data,
  isLight,
}: {
  data: RecommendationResponse;
  isLight: boolean;
}) => {
  // State untuk collapse/expand sections
  const [collapsedSections, setCollapsedSections] = useState({
    skillsComparison: false,
    skillsProfile: false,
    strengths: false,
    developmentSources: false,
  });

  const toggleSection = (section: keyof typeof collapsedSections) => {
    setCollapsedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const textPrimary = isLight ? "text-[#2F2A24]" : "text-white";
  const textSecondary = isLight ? "text-[#5C5245]" : "text-zinc-300";
  const cardSurface = isLight
    ? "border-stone-300/70 bg-white/90 shadow-[0_24px_50px_rgba(214,188,160,0.25)] hover:border-stone-400/80 hover:shadow-[0_28px_55px_rgba(214,188,160,0.32)]"
    : "border-zinc-800/50 bg-gradient-to-br from-zinc-900/50 to-zinc-800/50 hover:border-zinc-700/50 hover:shadow-[0_24px_45px_rgba(37,99,235,0.18)]";
  const chipLabelClass = isLight ? "text-xs text-[#7A6B5B]" : "text-xs text-zinc-400";
  const chipValueClass = isLight
    ? "text-sm font-semibold text-[#2F2A24]"
    : "text-sm font-semibold text-white";
  const recommendationCardBase = isLight
    ? "border-stone-300/70 bg-white/95 hover:border-stone-400/80 hover:shadow-[0_26px_48px_rgba(214,188,160,0.3)]"
    : "border-zinc-800/50 bg-gradient-to-br from-zinc-900/50 to-zinc-800/50 hover:border-zinc-700/50 hover:from-zinc-800/50 hover:to-zinc-700/50";
  const mutedLabel = isLight ? "text-xs text-[#7A6B5B]" : "text-xs text-zinc-400";

  return (
    <div
      className={cn(
        "relative min-h-screen",
        isLight
          ? "bg-gradient-to-br from-zinc-200 via-stone-200 to-zinc-300"
          : "bg-gradient-to-br from-zinc-900 via-black to-zinc-900"
      )}
    >
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 h-96 w-96 animate-pulse rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 blur-3xl" />
        <div className="absolute right-1/4 bottom-1/4 h-80 w-80 animate-pulse rounded-full bg-gradient-to-r from-purple-500/10 to-pink-500/10 blur-3xl delay-1000" />
        <div className="absolute top-1/2 right-1/3 h-64 w-64 animate-pulse rounded-full bg-gradient-to-r from-cyan-500/10 to-blue-500/10 blur-2xl delay-500" />
      </div>

      <div className={cn("relative z-10 space-y-8 p-6", isLight ? "text-[#2F2A24]" : "text-white")}>
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-6"
        >
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <TypographyH1 className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Rekomendasi{" "}
                <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Kompetisi
                </span>
              </TypographyH1>
              <TypographyP className={cn("text-lg", textSecondary)}>
                Rekomendasi yang disesuaikan dengan{" "}
                <TypographyEmphasis className={cn(isLight ? "text-[#D97742]" : "text-blue-300")}>
                  keterampilan
                </TypographyEmphasis>
                ,{" "}
                <TypographyEmphasis className={cn(isLight ? "text-[#C56834]" : "text-purple-300")}>
                  minat
                </TypographyEmphasis>
                , dan{" "}
                <TypographyEmphasis className={cn(isLight ? "text-[#B2542B]" : "text-pink-300")}>
                  tujuan
                </TypographyEmphasis>{" "}
                Anda
              </TypographyP>
            </div>
            {/* <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button className="group relative overflow-hidden border border-zinc-700/50 bg-gradient-to-r from-zinc-800/50 to-zinc-900/50 text-white backdrop-blur-sm transition-all hover:border-zinc-600/50 hover:from-zinc-700/50 hover:to-zinc-800/50">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 transition-opacity group-hover:opacity-100" />
                <Activity className="mr-2 h-4 w-4" />
                Perbarui Analisis
              </Button>
            </motion.div> */}
          </div>

          {/* Student Profile */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <Card
              className={cn(
                cardSurface,
                isLight
                  ? "border-stone-300/70 bg-white/90 shadow-[0_24px_50px_rgba(214,188,160,0.25)] hover:border-stone-400/80 hover:shadow-[0_28px_55px_rgba(214,188,160,0.32)]"
                  : "border-zinc-800/50 bg-gradient-to-br from-zinc-900/50 to-zinc-800/50 hover:border-zinc-700/50 hover:shadow-[0_24px_45px_rgba(37,99,235,0.18)]"
              )}
            >
              <div
                className={cn(
                  "absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100",
                  isLight
                    ? "bg-gradient-to-r from-[#F6A964]/15 to-[#E36C3A]/15"
                    : "bg-gradient-to-r from-blue-500/5 to-purple-500/5"
                )}
              />
              <CardHeader>
                <CardTitle className={cn("flex items-center space-x-3", textPrimary)}>
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg">
                    <Users className="h-5 w-5" />
                  </div>
                  <span className="text-xl">Profil Mahasiswa</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Student Information Grid */}
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.3, duration: 0.3 }}
                      className={cn(
                        "group/item relative overflow-hidden rounded-xl p-4 backdrop-blur-sm transition-all",
                        isLight
                          ? "border border-stone-300/70 bg-white hover:border-stone-400/80 hover:shadow-[0_16px_28px_rgba(214,188,160,0.25)]"
                          : "bg-gradient-to-br from-blue-500/10 to-cyan-500/10 hover:from-blue-500/20 hover:to-cyan-500/20"
                      )}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 shadow-lg">
                          <Users className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <span className={chipLabelClass}>Nama</span>
                          <p className={chipValueClass}>
                            {data.result.studentProfile?.name || "Tidak tersedia"}
                          </p>
                        </div>
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.4, duration: 0.3 }}
                      className={cn(
                        "group/item relative overflow-hidden rounded-xl p-4 backdrop-blur-sm transition-all",
                        isLight
                          ? "border border-stone-300/70 bg-white hover:border-stone-400/80 hover:shadow-[0_16px_28px_rgba(214,188,160,0.25)]"
                          : "bg-gradient-to-br from-purple-500/10 to-pink-500/10 hover:from-purple-500/20 hover:to-pink-500/20"
                      )}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg">
                          <BookOpen className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <span className={chipLabelClass}>NIM</span>
                          <p className={chipValueClass}>
                            {data.result.studentProfile?.studentId || "Tidak tersedia"}
                          </p>
                        </div>
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5, duration: 0.3 }}
                      className={cn(
                        "group/item relative overflow-hidden rounded-xl p-4 backdrop-blur-sm transition-all",
                        isLight
                          ? "border border-stone-300/70 bg-white hover:border-stone-400/80 hover:shadow-[0_16px_28px_rgba(214,188,160,0.25)]"
                          : "bg-gradient-to-br from-green-500/10 to-emerald-500/10 hover:from-green-500/20 hover:to-emerald-500/20"
                      )}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-green-500 to-emerald-500 shadow-lg">
                          <Trophy className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <span className={chipLabelClass}>IPK</span>
                          <p className={chipValueClass}>
                            {data.result.studentProfile?.gpa || "Tidak tersedia"}
                          </p>
                        </div>
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.6, duration: 0.3 }}
                      className={cn(
                        "group/item relative overflow-hidden rounded-xl p-4 backdrop-blur-sm transition-all",
                        isLight
                          ? "border border-stone-300/70 bg-white hover:border-stone-400/80 hover:shadow-[0_16px_28px_rgba(214,188,160,0.25)]"
                          : "bg-gradient-to-br from-orange-500/10 to-red-500/10 hover:from-orange-500/20 hover:to-red-500/20"
                      )}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-orange-500 to-red-500 shadow-lg">
                          <Calendar className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <span className={chipLabelClass}>Angkatan</span>
                          <p className={chipValueClass}>
                            {data.result.studentProfile?.entryYear || "Tidak tersedia"}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  </div>

                  {/* Additional Info */}
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.7, duration: 0.3 }}
                      className={cn(
                        "group/item relative overflow-hidden rounded-xl p-4 backdrop-blur-sm transition-all",
                        isLight
                          ? "border border-stone-300/70 bg-white hover:border-stone-400/80 hover:shadow-[0_16px_28px_rgba(214,188,160,0.25)]"
                          : "bg-gradient-to-br from-indigo-500/10 to-purple-500/10 hover:from-indigo-500/20 hover:to-purple-500/20"
                      )}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 shadow-lg">
                          <Code2 className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <span className={chipLabelClass}>Program Studi</span>
                          <p className={chipValueClass}>
                            {data.result.studentProfile?.studyProgram || "Tidak tersedia"}
                          </p>
                        </div>
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.8, duration: 0.3 }}
                      className={cn(
                        "group/item relative overflow-hidden rounded-xl p-4 backdrop-blur-sm transition-all",
                        isLight
                          ? "border border-stone-300/70 bg-white hover:border-stone-400/80 hover:shadow-[0_16px_28px_rgba(214,188,160,0.25)]"
                          : "bg-gradient-to-br from-cyan-500/10 to-blue-500/10 hover:from-cyan-500/20 hover:to-blue-500/20"
                      )}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 shadow-lg">
                          <ExternalLink className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <span className={chipLabelClass}>Email</span>
                          <p className={chipValueClass}>
                            {data.result.studentProfile?.email || "Tidak tersedia"}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  </div>

                  {/* Student Summary */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9, duration: 0.3 }}
                    className={cn(
                      "rounded-xl p-4 backdrop-blur-sm",
                      isLight
                        ? "border border-stone-300/60 bg-white/90 shadow-[0_18px_35px_rgba(214,188,160,0.22)]"
                        : "bg-gradient-to-r from-zinc-800/30 to-zinc-900/30"
                    )}
                  >
                    <div className="mb-3 flex items-center space-x-3">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-500 shadow-lg">
                        <Brain className="h-3 w-3 text-white" />
                      </div>
                      <span className={cn("text-sm font-semibold", textPrimary)}>
                        Ringkasan Profil
                      </span>
                    </div>
                    <TypographyP className={cn("leading-relaxed", textSecondary)}>
                      {data.result.studentSummary}
                    </TypographyP>
                  </motion.div>
                </div>
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
            <Card
              className={cn(
                "group relative overflow-hidden border backdrop-blur-sm transition-all",
                cardSurface
              )}
            >
              <div
                className={cn(
                  "absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100",
                  isLight
                    ? "bg-gradient-to-r from-[#EFD3BC]/40 to-[#F2A45E]/40"
                    : "bg-gradient-to-r from-purple-500/5 to-pink-500/5"
                )}
              />
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-pink-600 shadow-lg">
                      <Brain className="h-5 w-5" />
                    </div>
                    <span className={cn("text-xl", textPrimary)}>Profil Keterampilan</span>
                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleSection("skillsProfile")}
                        className={cn(
                          "backdrop-blur-sm",
                          isLight
                            ? "border border-stone-300/60 bg-white/80 text-[#2F2A24] hover:bg-white"
                            : "bg-zinc-800/50 text-white hover:bg-zinc-700/50"
                        )}
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
                <CardDescription className={textSecondary}>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                    {/* Legend Labels */}
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
                      {/* Description Cards */}
                      <div className="mb-6 grid grid-cols-1 gap-3 md:grid-cols-3">
                        {/* Tinggi Card */}
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 }}
                          className={cn(
                            "group relative overflow-hidden rounded-lg border-l-4 p-3.5 backdrop-blur-sm transition-all",
                            isLight
                              ? "border-l-green-500 bg-gradient-to-r from-green-50/80 via-green-50/60 to-green-50/40 hover:shadow-[0_8px_20px_rgba(34,197,94,0.15)]"
                              : "border-l-green-400 bg-gradient-to-r from-green-900/20 via-green-900/15 to-green-900/10 hover:from-green-900/30 hover:via-green-900/20 hover:to-green-900/15"
                          )}
                        >
                          <div
                            className={cn(
                              "absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity group-hover:opacity-100",
                              isLight
                                ? "from-green-100/30 to-emerald-100/20"
                                : "from-green-500/5 to-emerald-500/5"
                            )}
                          />
                          <div className="relative">
                            <div className="mb-2 flex items-center gap-2">
                              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-r from-green-400 to-green-500 shadow-sm">
                                <Star className="h-3.5 w-3.5 text-white" />
                              </div>
                              <span
                                className={cn(
                                  "text-sm font-semibold",
                                  isLight ? "text-green-700" : "text-green-300"
                                )}
                              >
                                Mahir (0.70-1.00)
                              </span>
                            </div>
                            <p
                              className={cn(
                                "text-xs leading-relaxed",
                                isLight ? "text-[#5C5245]" : "text-zinc-300"
                              )}
                            >
                              Kemampuan sangat baik dengan bukti prestasi dan pengalaman yang
                              menonjol.
                            </p>
                            <p
                              className={cn(
                                "mt-1.5 text-[10px] leading-relaxed",
                                isLight ? "text-[#7A6B5B]" : "text-zinc-400"
                              )}
                            >
                              <span className="font-medium">Contoh:</span> Juara kompetisi nasional,
                              pengalaman kerja/magang di perusahaan ternama, atau kontribusi
                              signifikan pada proyek besar.
                            </p>
                          </div>
                        </motion.div>

                        {/* Sedang Card */}
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 }}
                          className={cn(
                            "group relative overflow-hidden rounded-lg border-l-4 p-3.5 backdrop-blur-sm transition-all",
                            isLight
                              ? "border-l-blue-500 bg-gradient-to-r from-blue-50/80 via-blue-50/60 to-blue-50/40 hover:shadow-[0_8px_20px_rgba(59,130,246,0.15)]"
                              : "border-l-blue-400 bg-gradient-to-r from-blue-900/20 via-blue-900/15 to-blue-900/10 hover:from-blue-900/30 hover:via-blue-900/20 hover:to-blue-900/15"
                          )}
                        >
                          <div
                            className={cn(
                              "absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity group-hover:opacity-100",
                              isLight
                                ? "from-blue-100/30 to-cyan-100/20"
                                : "from-blue-500/5 to-cyan-500/5"
                            )}
                          />
                          <div className="relative">
                            <div className="mb-2 flex items-center gap-2">
                              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-r from-blue-400 to-blue-500 shadow-sm">
                                <Activity className="h-3.5 w-3.5 text-white" />
                              </div>
                              <span
                                className={cn(
                                  "text-sm font-semibold",
                                  isLight ? "text-blue-700" : "text-blue-300"
                                )}
                              >
                                Menengah (0.40-0.69)
                              </span>
                            </div>
                            <p
                              className={cn(
                                "text-xs leading-relaxed",
                                isLight ? "text-[#5C5245]" : "text-zinc-300"
                              )}
                            >
                              Kemampuan baik dengan beberapa pengalaman dan prestasi yang relevan.
                            </p>
                            <p
                              className={cn(
                                "mt-1.5 text-[10px] leading-relaxed",
                                isLight ? "text-[#7A6B5B]" : "text-zinc-400"
                              )}
                            >
                              <span className="font-medium">Contoh:</span> Finalis kompetisi, aktif
                              dalam organisasi/proyek tim, atau portofolio proyek yang cukup
                              kompleks.
                            </p>
                          </div>
                        </motion.div>

                        {/* Rendah Card */}
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 }}
                          className={cn(
                            "group relative overflow-hidden rounded-lg border-l-4 p-3.5 backdrop-blur-sm transition-all",
                            isLight
                              ? "border-l-orange-500 bg-gradient-to-r from-orange-50/80 via-orange-50/60 to-orange-50/40 hover:shadow-[0_8px_20px_rgba(239,68,68,0.15)]"
                              : "border-l-orange-400 bg-gradient-to-r from-orange-900/20 via-orange-900/15 to-orange-900/10 hover:from-orange-900/30 hover:via-orange-900/20 hover:to-orange-900/15"
                          )}
                        >
                          <div
                            className={cn(
                              "absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity group-hover:opacity-100",
                              isLight
                                ? "from-orange-100/30 to-red-100/20"
                                : "from-orange-500/5 to-red-500/5"
                            )}
                          />
                          <div className="relative">
                            <div className="mb-2 flex items-center gap-2">
                              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-r from-orange-400 to-orange-500 shadow-sm">
                                <TrendingUp className="h-3.5 w-3.5 text-white" />
                              </div>
                              <span
                                className={cn(
                                  "text-sm font-semibold",
                                  isLight ? "text-orange-700" : "text-orange-300"
                                )}
                              >
                                Dasar (0.10-0.39)
                              </span>
                            </div>
                            <p
                              className={cn(
                                "text-xs leading-relaxed",
                                isLight ? "text-[#5C5245]" : "text-zinc-300"
                              )}
                            >
                              Kemampuan dasar dengan pengalaman dari tugas kuliah atau proyek
                              sederhana.
                            </p>
                            <p
                              className={cn(
                                "mt-1.5 text-[10px] leading-relaxed",
                                isLight ? "text-[#7A6B5B]" : "text-zinc-400"
                              )}
                            >
                              <span className="font-medium">Contoh:</span> Dapat menyelesaikan tugas
                              standar, memahami konsep dasar, atau baru memulai pengembangan
                              keterampilan.
                            </p>
                          </div>
                        </motion.div>
                      </div>
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {Object.entries(data.result.skillsProfile).map(
                          ([skill, { score, breakdown }], index) => (
                            <motion.div
                              key={skill}
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: index * 0.1, duration: 0.3 }}
                              className={cn(
                                "group relative overflow-hidden rounded-xl p-4 backdrop-blur-sm transition-all hover:shadow-lg",
                                isLight
                                  ? "border border-stone-300/70 bg-white hover:border-stone-400/80 hover:shadow-[0_18px_32px_rgba(214,188,160,0.25)]"
                                  : "bg-gradient-to-br from-zinc-800/50 to-zinc-900/50 hover:from-zinc-700/50 hover:to-zinc-800/50 hover:shadow-purple-500/10"
                              )}
                            >
                              <div
                                className={cn(
                                  "absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100",
                                  isLight
                                    ? "bg-gradient-to-r from-[#EFD3BC]/30 to-[#F2A45E]/30"
                                    : "bg-gradient-to-r from-purple-500/5 to-pink-500/5"
                                )}
                              />
                              <div className="relative">
                                <div className="mb-3 flex items-center justify-between">
                                  <span
                                    className={cn("truncate text-sm font-semibold", textPrimary)}
                                  >
                                    {skillNameMapping[skill] || skill}
                                  </span>
                                  <span
                                    className={cn(
                                      "ml-2 text-sm font-bold",
                                      score >= 0.7
                                        ? "text-green-400"
                                        : score >= 0.4
                                          ? "text-blue-400"
                                          : "text-orange-400"
                                    )}
                                  >
                                    {(score * 10).toFixed(1)}/10
                                  </span>
                                </div>
                                <div className="relative mb-3">
                                  {/* Progress Bar dengan Skala */}
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <div
                                        className={cn(
                                          "relative h-2.5 cursor-help overflow-hidden rounded-full",
                                          isLight ? "bg-stone-200" : "bg-zinc-700/50"
                                        )}
                                      >
                                        {/* Background dengan zona warna */}
                                        <div className="absolute inset-0 flex">
                                          {/* Zona Dasar (0-0.39 approx) */}
                                          <div
                                            className="h-full"
                                            style={{
                                              width: "40%",
                                              backgroundColor: isLight
                                                ? "rgba(239, 68, 68, 0.2)"
                                                : "rgba(239, 68, 68, 0.3)",
                                            }}
                                          />
                                          {/* Zona Menengah (0.4-0.69) */}
                                          <div
                                            className="h-full"
                                            style={{
                                              width: "30%",
                                              backgroundColor: isLight
                                                ? "rgba(59, 130, 246, 0.2)"
                                                : "rgba(59, 130, 246, 0.3)",
                                            }}
                                          />
                                          {/* Zona Mahir (0.7-1.0) */}
                                          <div
                                            className="h-full"
                                            style={{
                                              width: "30%",
                                              backgroundColor: isLight
                                                ? "rgba(34, 197, 94, 0.2)"
                                                : "rgba(34, 197, 94, 0.3)",
                                            }}
                                          />
                                        </div>

                                        {/* Progress Fill */}
                                        <div
                                          className={cn(
                                            "absolute top-0 left-0 z-10 h-full rounded-full shadow-sm transition-all",
                                            score >= 0.7
                                              ? "bg-gradient-to-r from-green-400 to-green-500"
                                              : score >= 0.4
                                                ? "bg-gradient-to-r from-blue-400 to-blue-500"
                                                : "bg-gradient-to-r from-orange-400 to-orange-500"
                                          )}
                                          style={{ width: `${score * 100}%` }}
                                        />

                                        {/* Skala Markers */}
                                        <div className="absolute inset-0 z-20 flex">
                                          {/* Marker di 0% */}
                                          <div
                                            className={cn(
                                              "absolute top-0 left-0 h-full w-[1px]",
                                              isLight ? "bg-[#7A6B5B]/40" : "bg-zinc-500/50"
                                            )}
                                          />
                                          {/* Marker di 40% (batas Dasar-Menengah) */}
                                          <div
                                            className={cn(
                                              "absolute top-0 left-[40%] h-full w-[1px]",
                                              isLight ? "bg-[#7A6B5B]/40" : "bg-zinc-500/50"
                                            )}
                                          />
                                          {/* Marker di 70% (batas Menengah-Mahir) */}
                                          <div
                                            className={cn(
                                              "absolute top-0 left-[70%] h-full w-[1px]",
                                              isLight ? "bg-[#7A6B5B]/40" : "bg-zinc-500/50"
                                            )}
                                          />
                                          {/* Marker di 100% */}
                                          <div
                                            className={cn(
                                              "absolute top-0 right-0 h-full w-[1px]",
                                              isLight ? "bg-[#7A6B5B]/40" : "bg-zinc-500/50"
                                            )}
                                          />
                                        </div>
                                      </div>
                                    </TooltipTrigger>
                                    <TooltipContent
                                      side="top"
                                      className={cn(
                                        "max-w-xs",
                                        isLight
                                          ? "border-stone-300/70 bg-white text-[#2F2A24]"
                                          : "border-zinc-700 bg-zinc-900 text-white"
                                      )}
                                    >
                                      <div className="space-y-1">
                                        <p
                                          className={cn(
                                            "font-semibold",
                                            isLight ? "text-[#2F2A24]" : "text-white"
                                          )}
                                        >
                                          {score >= 0.7
                                            ? "Mahir (0.70-1.00)"
                                            : score >= 0.4
                                              ? "Menengah (0.40-0.69)"
                                              : "Dasar (0.10-0.39)"}
                                        </p>
                                        <p
                                          className={cn(
                                            "text-xs",
                                            isLight ? "text-[#5C5245]" : "text-zinc-300"
                                          )}
                                        >
                                          {score >= 0.7
                                            ? "Kemampuan sangat baik dengan bukti prestasi dan pengalaman yang menonjol."
                                            : score >= 0.4
                                              ? "Kemampuan baik dengan beberapa pengalaman dan prestasi yang relevan."
                                              : "Kemampuan dasar dengan pengalaman dari tugas kuliah atau proyek sederhana."}
                                        </p>
                                      </div>
                                    </TooltipContent>
                                  </Tooltip>

                                  {/* Skala Label di bawah */}
                                  <div className="mt-1 flex justify-between text-[10px]">
                                    <span
                                      className={cn(isLight ? "text-[#7A6B5B]" : "text-zinc-500")}
                                    >
                                      0
                                    </span>
                                    <span
                                      className={cn(isLight ? "text-[#7A6B5B]" : "text-zinc-500")}
                                    >
                                      0.4
                                    </span>
                                    <span
                                      className={cn(isLight ? "text-[#7A6B5B]" : "text-zinc-500")}
                                    >
                                      0.7
                                    </span>
                                    <span
                                      className={cn(isLight ? "text-[#7A6B5B]" : "text-zinc-500")}
                                    >
                                      1.0
                                    </span>
                                  </div>
                                </div>
                                <TypographyP
                                  className={cn("text-sm leading-relaxed", textSecondary)}
                                >
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
          {(data.result.overallAssessment?.strengths?.length > 0 ||
            data.result.overallAssessment?.weaknesses?.length > 0) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
            >
              <Card
                className={cn(
                  "group relative overflow-hidden border backdrop-blur-sm transition-all",
                  cardSurface
                )}
              >
                <div
                  className={cn(
                    "absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100",
                    isLight
                      ? "bg-gradient-to-r from-[#CFF3D6]/40 via-transparent to-[#A9EFC2]/30"
                      : "bg-gradient-to-r from-green-500/5 to-emerald-500/5"
                  )}
                />
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className={cn("flex items-center space-x-3", textPrimary)}>
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-green-500 to-emerald-600 shadow-lg">
                        <Target className="h-5 w-5" />
                      </div>
                      <span className="text-xl">Kekuatan Profil</span>
                      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleSection("strengths")}
                          className={cn(
                            "backdrop-blur-sm",
                            isLight
                              ? "border border-stone-300/60 bg-white/80 text-[#2F2A24] hover:bg-white"
                              : "bg-zinc-800/50 text-white hover:bg-zinc-700/50"
                          )}
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
                          {data.result.overallAssessment?.strengths?.length > 0 && (
                            <div className="space-y-4">
                              <div className="flex items-center space-x-3">
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-green-500 to-emerald-500 shadow-lg">
                                  <Star className="h-4 w-4 text-white" />
                                </div>
                                <TypographyH3 className={cn("text-lg", textPrimary)}>
                                  Kelebihan
                                </TypographyH3>
                              </div>
                              <div className="space-y-3">
                                {data.result.overallAssessment.strengths.map((strength, index) => (
                                  <motion.div
                                    key={`strength-${strength.slice(0, 20)}`}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1, duration: 0.3 }}
                                    className={cn(
                                      "group flex items-start space-x-3 rounded-lg p-3 backdrop-blur-sm transition-all",
                                      isLight
                                        ? "border border-stone-300/60 bg-white/85 hover:border-stone-400/80 hover:shadow-[0_14px_26px_rgba(190,230,205,0.4)]"
                                        : "bg-gradient-to-r from-green-500/10 to-emerald-500/10 hover:from-green-500/20 hover:to-emerald-500/20"
                                    )}
                                  >
                                    <div className="mt-1 h-2 w-2 rounded-full bg-gradient-to-r from-green-400 to-emerald-400 shadow-sm" />
                                    <TypographyP
                                      className={cn("text-sm leading-relaxed", textSecondary)}
                                    >
                                      {strength}
                                    </TypographyP>
                                  </motion.div>
                                ))}
                              </div>
                            </div>
                          )}

                          {data.result.overallAssessment?.weaknesses?.length > 0 && (
                            <div className="space-y-4">
                              <div className="flex items-center space-x-3">
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 shadow-lg">
                                  <TrendingUp className="h-4 w-4 text-white" />
                                </div>
                                <TypographyH3 className={cn("text-lg", textPrimary)}>
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
                                    className={cn(
                                      "group flex items-start space-x-3 rounded-lg p-3 backdrop-blur-sm transition-all",
                                      isLight
                                        ? "border border-stone-300/60 bg-white/85 hover:border-stone-400/80 hover:shadow-[0_14px_26px_rgba(242,195,142,0.35)]"
                                        : "bg-gradient-to-r from-yellow-500/10 to-orange-500/10 hover:from-yellow-500/20 hover:to-orange-500/20"
                                    )}
                                  >
                                    <div className="mt-1 h-2 w-2 rounded-full bg-gradient-to-r from-yellow-400 to-orange-400 shadow-sm" />
                                    <TypographyP
                                      className={cn("text-sm leading-relaxed", textSecondary)}
                                    >
                                      {weakness}
                                    </TypographyP>
                                  </motion.div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>
            </motion.div>
          )}

          {/* Section 4: Sumber Pengembangan */}
          {data.result.developmentSuggestions?.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0, duration: 0.8 }}
            >
              <Card
                className={cn(
                  "group relative overflow-hidden border backdrop-blur-sm transition-all",
                  cardSurface
                )}
              >
                <div
                  className={cn(
                    "absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100",
                    isLight
                      ? "bg-gradient-to-r from-[#D4ECF7]/40 via-transparent to-[#A8D9F4]/30"
                      : "bg-gradient-to-r from-cyan-500/5 to-blue-500/5"
                  )}
                />
                <CardHeader>
                  <CardTitle className={cn("flex items-center justify-between", textPrimary)}>
                    <div className={cn("flex items-center space-x-3", textPrimary)}>
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 shadow-lg">
                        <Lightbulb className="h-5 w-5" />
                      </div>
                      <span className="text-xl">Sumber Pengembangan</span>
                      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleSection("developmentSources")}
                          className={cn(
                            "backdrop-blur-sm",
                            isLight
                              ? "border border-stone-300/60 bg-white/80 text-[#2F2A24] hover:bg-white"
                              : "bg-zinc-800/50 text-white hover:bg-zinc-700/50"
                          )}
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
                                className={cn(
                                  "group relative overflow-hidden rounded-xl p-6 backdrop-blur-sm transition-all",
                                  isLight
                                    ? "border border-stone-300/60 bg-white/90 hover:border-stone-400/80 hover:shadow-[0_16px_32px_rgba(168,217,244,0.35)]"
                                    : "bg-gradient-to-br from-zinc-800/50 to-zinc-900/50 hover:from-zinc-700/50 hover:to-zinc-800/50 hover:shadow-cyan-500/10"
                                )}
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
                                    <TypographyH3
                                      className={cn("text-sm font-semibold", textPrimary)}
                                    >
                                      {suggestion.title}
                                    </TypographyH3>
                                  </div>
                                  <TypographyP
                                    className={cn("mb-4 text-sm leading-relaxed", textSecondary)}
                                  >
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
          )}

          {/* Daftar Rekomendasi */}
          {data.result.recommendations?.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.8 }}
            >
              <div className="mb-8 space-y-2">
                <TypographyH3 className="bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-2xl font-bold text-transparent md:text-3xl">
                  Rekomendasi Terbaik untuk Anda
                </TypographyH3>
                <TypographyP className={textSecondary}>
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
                      className={cn(
                        "group relative overflow-hidden border backdrop-blur-sm transition-all",
                        recommendationCardBase
                      )}
                    >
                      <div
                        className={cn(
                          "absolute inset-0 bg-gradient-to-r opacity-0 transition-opacity group-hover:opacity-10",
                          isLight ? "from-[#E9D8C8] to-[#DCC5B0]" : "from-zinc-500 to-zinc-600"
                        )}
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
                                <CardTitle className={cn("text-xl", textPrimary)}>
                                  {rec.competitionName}
                                </CardTitle>
                              </div>
                            </div>
                            <CardDescription className={cn("leading-relaxed", textSecondary)}>
                              {rec.matchScore.reason}
                            </CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="relative">
                        <Accordion type="single" collapsible className="space-y-4">
                          <AccordionItem
                            value="match-explanation"
                            className={cn(isLight ? "border-stone-300/60" : "border-zinc-700/50")}
                          >
                            <AccordionTrigger
                              className={cn("group hover:no-underline", textPrimary)}
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
                                <TypographyP
                                  className={cn("text-sm leading-relaxed", textSecondary)}
                                >
                                  {rec.matchScore.reason}
                                </TypographyP>
                                <div className="space-y-6">
                                  <div>
                                    <TypographyH3
                                      className={cn(
                                        "mb-3 flex items-center space-x-2 text-sm",
                                        textPrimary
                                      )}
                                    >
                                      <div className="h-2 w-2 rounded-full bg-gradient-to-r from-green-400 to-emerald-400" />
                                      <span>Kelebihan</span>
                                    </TypographyH3>
                                    <ul className="space-y-3">
                                      {rec.reasoning?.pros?.map((pro, proIndex) => (
                                        <motion.li
                                          key={`pro-${pro.slice(0, 20)}`}
                                          initial={{ opacity: 0, x: -20 }}
                                          animate={{ opacity: 1, x: 0 }}
                                          transition={{ delay: proIndex * 0.1, duration: 0.3 }}
                                          className={cn(
                                            "flex items-start space-x-3 rounded-lg p-3 backdrop-blur-sm",
                                            isLight
                                              ? "border border-stone-300/60 bg-white/85"
                                              : "bg-gradient-to-r from-green-500/10 to-emerald-500/10"
                                          )}
                                        >
                                          <div className="mt-1 h-1.5 w-1.5 rounded-full bg-gradient-to-r from-green-400 to-emerald-400" />
                                          <TypographyP
                                            className={cn("text-sm leading-relaxed", textSecondary)}
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
                                        textPrimary
                                      )}
                                    >
                                      <div className="h-2 w-2 rounded-full bg-gradient-to-r from-yellow-400 to-orange-400" />
                                      <span>Kekurangan</span>
                                    </TypographyH3>
                                    <ul className="space-y-3">
                                      {rec.reasoning?.cons?.map((con, conIndex) => (
                                        <motion.li
                                          key={`con-${con.slice(0, 20)}`}
                                          initial={{ opacity: 0, x: -20 }}
                                          animate={{ opacity: 1, x: 0 }}
                                          transition={{ delay: conIndex * 0.1, duration: 0.3 }}
                                          className={cn(
                                            "flex items-start space-x-3 rounded-lg p-3 backdrop-blur-sm",
                                            isLight
                                              ? "border border-stone-300/60 bg-white/85"
                                              : "bg-gradient-to-r from-yellow-500/10 to-orange-500/10"
                                          )}
                                        >
                                          <div className="mt-1 h-1.5 w-1.5 rounded-full bg-gradient-to-r from-yellow-400 to-orange-400" />
                                          <TypographyP
                                            className={cn("text-sm leading-relaxed", textSecondary)}
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

                          <AccordionItem
                            value="competition-details"
                            className={cn(isLight ? "border-stone-300/60" : "border-zinc-700/50")}
                          >
                            <AccordionTrigger
                              className={cn("group hover:no-underline", textPrimary)}
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
                                    className={cn("text-sm leading-relaxed", textSecondary)}
                                  >
                                    {rec.competition?.description ||
                                      "Deskripsi kompetisi tidak tersedia"}
                                  </TypographyP>

                                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    <div
                                      className={cn(
                                        "flex items-center space-x-3 rounded-lg p-3 backdrop-blur-sm",
                                        isLight
                                          ? "border border-stone-300/60 bg-white/85"
                                          : "bg-gradient-to-r from-emerald-500/10 to-teal-500/10"
                                      )}
                                    >
                                      <Calendar className="h-4 w-4 text-emerald-400" />
                                      <div>
                                        <span className={mutedLabel}>Mulai</span>
                                        <p className={cn("text-sm font-medium", textSecondary)}>
                                          {rec.competition?.startDate
                                            ? formatDate(rec.competition.startDate)
                                            : "Tidak tersedia"}
                                        </p>
                                      </div>
                                    </div>
                                    <div
                                      className={cn(
                                        "flex items-center space-x-3 rounded-lg p-3 backdrop-blur-sm",
                                        isLight
                                          ? "border border-stone-300/60 bg-white/85"
                                          : "bg-gradient-to-r from-emerald-500/10 to-teal-500/10"
                                      )}
                                    >
                                      <Calendar className="h-4 w-4 text-emerald-400" />
                                      <div>
                                        <span className={mutedLabel}>Selesai</span>
                                        <p className={cn("text-sm font-medium", textSecondary)}>
                                          {rec.competition?.endDate
                                            ? formatDate(rec.competition.endDate)
                                            : "Tidak tersedia"}
                                        </p>
                                      </div>
                                    </div>
                                    <div
                                      className={cn(
                                        "flex items-center space-x-3 rounded-lg p-3 backdrop-blur-sm",
                                        isLight
                                          ? "border border-stone-300/60 bg-white/85"
                                          : "bg-gradient-to-r from-emerald-500/10 to-teal-500/10"
                                      )}
                                    >
                                      <MapPin className="h-4 w-4 text-emerald-400" />
                                      <div>
                                        <span className={mutedLabel}>Lokasi</span>
                                        <p className={cn("text-sm font-medium", textSecondary)}>
                                          {rec.competition?.location || "Daring"}
                                        </p>
                                      </div>
                                    </div>
                                    <div
                                      className={cn(
                                        "flex items-center space-x-3 rounded-lg p-3 backdrop-blur-sm",
                                        isLight
                                          ? "border border-stone-300/60 bg-white/85"
                                          : "bg-gradient-to-r from-emerald-500/10 to-teal-500/10"
                                      )}
                                    >
                                      <Users className="h-4 w-4 text-emerald-400" />
                                      <div>
                                        <span className={mutedLabel}>Organizer</span>
                                        <p className={cn("text-sm font-medium", textSecondary)}>
                                          {rec.competition?.organizer || "Tidak tersedia"}
                                        </p>
                                      </div>
                                    </div>
                                  </div>

                                  {rec.competition?.sourceUrl && (
                                    <motion.div
                                      whileHover={{ scale: 1.02 }}
                                      whileTap={{ scale: 0.98 }}
                                    >
                                      <a
                                        href={rec.competition?.sourceUrl || "#"}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={cn(
                                          "group/link inline-flex items-center space-x-2 rounded-lg p-3 transition-all",
                                          isLight
                                            ? "border border-stone-300/60 bg-white/85 text-[#2F2A24] hover:border-stone-400/80 hover:bg-white"
                                            : "bg-gradient-to-r from-blue-500/10 to-purple-500/10 text-blue-400 hover:from-blue-500/20 hover:to-purple-500/20 hover:text-blue-300"
                                        )}
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

                          {rec.keyFactors && rec.keyFactors.length > 0 && (
                            <AccordionItem
                              value="key-factors"
                              className={cn(isLight ? "border-stone-300/60" : "border-zinc-700/50")}
                            >
                              <AccordionTrigger
                                className={cn("group hover:no-underline", textPrimary)}
                              >
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
                                      className={cn(
                                        "flex items-start space-x-3 rounded-lg p-3 backdrop-blur-sm",
                                        isLight
                                          ? "border border-stone-300/60 bg-white/85"
                                          : "bg-gradient-to-r from-orange-500/10 to-red-500/10"
                                      )}
                                    >
                                      <div className="mt-1 h-1.5 w-1.5 rounded-full bg-gradient-to-r from-orange-400 to-red-400" />
                                      <TypographyP
                                        className={cn("text-sm leading-relaxed", textSecondary)}
                                      >
                                        {factor}
                                      </TypographyP>
                                    </motion.div>
                                  ))}
                                </div>
                              </AccordionContent>
                            </AccordionItem>
                          )}

                          {rec.preparationTips && rec.preparationTips.length > 0 && (
                            <AccordionItem
                              value="preparation"
                              className={cn(isLight ? "border-stone-300/60" : "border-zinc-700/50")}
                            >
                              <AccordionTrigger
                                className={cn("group hover:no-underline", textPrimary)}
                              >
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
                                      className={cn(
                                        "flex items-start space-x-3 rounded-lg p-3 backdrop-blur-sm",
                                        isLight
                                          ? "border border-stone-300/60 bg-white/85"
                                          : "bg-gradient-to-r from-indigo-500/10 to-purple-500/10"
                                      )}
                                    >
                                      <ArrowRight className="mt-1 h-4 w-4 text-indigo-400" />
                                      <TypographyP
                                        className={cn("text-sm leading-relaxed", textSecondary)}
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
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

const MyRecommendationPage = () => {
  const { data, isLoading, error } = useMyRecomendation();
  const { createMyRecomendation, isCreating } = usePostMyRecomendation();
  const [isLight, setIsLight] = useState<boolean>(true);

  useEffect(() => {
    const stored = typeof window !== "undefined" ? localStorage.getItem("scout-theme") : null;
    if (stored) setIsLight(stored === "light");
  }, []);

  useEffect(() => {
    const handler = (e: Event) => {
      const customEvent = e as CustomEvent<{ theme: string }>;
      const theme = customEvent?.detail?.theme;
      if (!theme) return;
      setIsLight(theme === "light");
    };
    window.addEventListener("scout-theme-change", handler as EventListener);
    return () => window.removeEventListener("scout-theme-change", handler as EventListener);
  }, []);

  const handleStartAnalysis = () => {
    createMyRecomendation();
  };

  if (isLoading) {
    return (
      <div
        className={cn(
          "relative flex min-h-[calc(100vh-4rem)] items-center justify-center overflow-hidden",
          isLight
            ? "bg-gradient-to-br from-zinc-200 via-stone-200 to-zinc-300"
            : "bg-gradient-to-br from-zinc-900 via-black to-zinc-900"
        )}
      >
        {/* Background Elements */}
        <div className="absolute inset-0">
          {isLight ? (
            <>
              <div className="absolute top-1/4 left-1/4 h-64 w-64 animate-pulse rounded-full bg-gradient-to-r from-[#F7C8A2]/25 to-[#E9A779]/25 blur-3xl" />
              <div className="absolute right-1/4 bottom-1/4 h-48 w-48 animate-pulse rounded-full bg-gradient-to-r from-[#F4B087]/25 to-[#E37B59]/25 blur-3xl delay-1000" />
              <div className="absolute top-1/2 right-1/3 h-32 w-32 animate-pulse rounded-full bg-gradient-to-r from-[#F2C190]/25 to-[#F6A964]/25 blur-2xl delay-500" />
            </>
          ) : (
            <>
              <div className="absolute top-1/4 left-1/4 h-64 w-64 animate-pulse rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 blur-3xl" />
              <div className="absolute right-1/4 bottom-1/4 h-48 w-48 animate-pulse rounded-full bg-gradient-to-r from-purple-500/10 to-pink-500/10 blur-3xl delay-1000" />
            </>
          )}
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className={cn(
            "relative z-10 space-y-6 text-center",
            isLight ? "text-[#2F2A24]" : "text-white"
          )}
        >
          <div
            className={cn(
              "mx-auto flex h-20 w-20 items-center justify-center rounded-full shadow-2xl",
              isLight
                ? "bg-gradient-to-r from-[#F6A964] to-[#E36C3A]"
                : "bg-gradient-to-r from-blue-500 to-purple-600"
            )}
          >
            <Loader2 className="h-10 w-10 animate-spin text-white" />
          </div>
          <div className="space-y-2">
            <TypographyH3 className={cn("text-xl", isLight ? "text-[#2F2A24]" : "text-white")}>
              Memuat Rekomendasi Anda
            </TypographyH3>
            <TypographyP className={isLight ? "text-[#5C5245]" : "text-zinc-400"}>
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
        return (
          <EmptyState
            onStartAnalysis={handleStartAnalysis}
            isCreating={isCreating}
            isLight={isLight}
          />
        );
      }

      return (
        <div
          className={cn(
            "relative flex min-h-[calc(100vh-4rem)] items-center justify-center overflow-hidden",
            isLight
              ? "bg-gradient-to-br from-zinc-200 via-stone-200 to-zinc-300"
              : "bg-gradient-to-br from-zinc-900 via-black to-zinc-900"
          )}
        >
          {/* Background Elements */}
          <div className="absolute inset-0">
            {isLight ? (
              <>
                <div className="absolute top-1/4 left-1/4 h-64 w-64 animate-pulse rounded-full bg-gradient-to-r from-[#F4A582]/25 to-[#E37B59]/25 blur-3xl" />
                <div className="absolute right-1/4 bottom-1/4 h-48 w-48 animate-pulse rounded-full bg-gradient-to-r from-[#E37B59]/25 to-[#D97742]/25 blur-3xl delay-1000" />
                <div className="absolute top-1/2 right-1/3 h-32 w-32 animate-pulse rounded-full bg-gradient-to-r from-[#E4986E]/25 to-[#F2A558]/25 blur-2xl delay-500" />
              </>
            ) : (
              <>
                <div className="absolute top-1/4 left-1/4 h-64 w-64 animate-pulse rounded-full bg-gradient-to-r from-red-500/10 to-orange-500/10 blur-3xl" />
                <div className="absolute right-1/4 bottom-1/4 h-48 w-48 animate-pulse rounded-full bg-gradient-to-r from-orange-500/10 to-yellow-500/10 blur-3xl delay-1000" />
              </>
            )}
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className={cn(
              "relative z-10 space-y-6 text-center",
              isLight ? "text-[#2F2A24]" : "text-white"
            )}
          >
            <div
              className={cn(
                "mx-auto flex h-20 w-20 items-center justify-center rounded-full shadow-2xl",
                isLight
                  ? "bg-gradient-to-r from-[#E36C3A] to-[#D97742]"
                  : "bg-gradient-to-r from-red-500 to-orange-600"
              )}
            >
              <AlertCircle className="h-10 w-10 text-white" />
            </div>
            <div className="space-y-4">
              <TypographyH3 className={cn("text-xl", isLight ? "text-[#2F2A24]" : "text-white")}>
                Gagal Memuat Rekomendasi
              </TypographyH3>
              <TypographyP
                className={cn("mx-auto max-w-md", isLight ? "text-[#5C5245]" : "text-zinc-400")}
              >
                {errMessage}
              </TypographyP>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="outline"
                  className={cn(
                    "backdrop-blur-sm",
                    isLight
                      ? "border-stone-300/60 bg-white/90 text-[#2F2A24] hover:border-stone-400/80 hover:bg-white"
                      : "border-zinc-700 bg-zinc-800/50 text-white hover:bg-zinc-700/50"
                  )}
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
    return (
      <EmptyState onStartAnalysis={handleStartAnalysis} isCreating={isCreating} isLight={isLight} />
    );
  }

  return <RecommendationContent data={data} isLight={isLight} />;
};

export default MyRecommendationPage;
