"use client";

import { Trophy } from "lucide-react";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";

import { TypographyH2, TypographyP } from "@/components/ui/typography";
import { cn } from "@/lib/utils";

import { ChartsSection } from "./components/ChartsSection";
import { CompetitionOverview } from "./components/CompetitionOverview";
import { useCompetitionDetail } from "./hooks/useCompetitionDetail";

const CompetitionDetailPage = () => {
  const params = useParams<{ id: string }>();
  const competitionId = Number(params.id);
  const [isLight, setIsLight] = useState<boolean>(true);

  const { competition, statistics, topPerformers, isLoading } = useCompetitionDetail(competitionId);

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

  const textPrimary = isLight ? "text-[#2F2A24]" : "text-white";
  const textSecondary = isLight ? "text-[#5C5245]" : "text-zinc-400";
  const borderColor = isLight ? "border-stone-300" : "border-gray-500";

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-6">
        <div className="mb-4 flex items-center gap-4">
          <TypographyH2 className={cn("flex items-center gap-2", textPrimary)}>
            <Trophy className="h-8 w-8" />
            {competition?.title || "Competition Detail"}
          </TypographyH2>
        </div>
        <TypographyP className={cn("border-b pb-4", borderColor, textSecondary)}>
          Detail Kompetisi dan rekomendasi untuk kompetisi ini.
        </TypographyP>
        <div className={cn("mb-6 border-t", borderColor)} />
      </div>

      <div className="flex justify-center">
        <div className="w-full space-y-8 lg:max-h-[78vh] lg:overflow-y-auto lg:pr-3 lg:pb-2">
          {/* Competition Overview */}
          <CompetitionOverview
            competition={competition || null}
            statistics={statistics || null}
            isLoading={isLoading}
            isLight={isLight}
          />

          {/* Charts Section */}
          <ChartsSection
            statistics={statistics || null}
            topPerformers={topPerformers}
            isLight={isLight}
          />
        </div>
      </div>
    </div>
  );
};

export default CompetitionDetailPage;
