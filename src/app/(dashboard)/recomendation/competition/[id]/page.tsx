"use client";

import { Trophy } from "lucide-react";
import { useParams } from "next/navigation";

import { TypographyH2, TypographyP } from "@/components/ui/typography";

import { ChartsSection } from "./components/ChartsSection";
import { CompetitionOverview } from "./components/CompetitionOverview";
import { useCompetitionDetail } from "./hooks/useCompetitionDetail";

const CompetitionDetailPage = () => {
  const params = useParams<{ id: string }>();
  const competitionId = Number(params.id);

  const { competition, statistics, topPerformers, isLoading } = useCompetitionDetail(competitionId);

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-6">
        <div className="mb-4 flex items-center gap-4">
          <TypographyH2 className="flex items-center gap-2 text-zinc-900">
            <Trophy className="h-8 w-8" />
            {competition?.title || "Competition Detail"}
          </TypographyH2>
        </div>
        <TypographyP className="border-b border-gray-300 pb-4 text-zinc-900">
          Detailed analysis and recommendations for this competition.
        </TypographyP>
        <div className="mb-6 border-t border-gray-500" />
      </div>

      <div className="flex justify-center">
        <div className="w-full space-y-8 lg:max-h-[78vh] lg:overflow-y-auto lg:pr-3 lg:pb-2">
          {/* Competition Overview */}
          <CompetitionOverview
            competition={competition || null}
            statistics={statistics || null}
            isLoading={isLoading}
          />

          {/* Charts Section */}
          <ChartsSection statistics={statistics || null} topPerformers={topPerformers} />
        </div>
      </div>
    </div>
  );
};

export default CompetitionDetailPage;
