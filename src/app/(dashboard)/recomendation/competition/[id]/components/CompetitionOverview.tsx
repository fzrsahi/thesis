"use client";

import { motion } from "framer-motion";
import { Users, Target, Calendar, MapPin, Building2, ExternalLink } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import Button from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface CompetitionData {
  title?: string;
  field?: string[];
  organizer?: string;
  location?: string;
  startDate?: string;
  minGPA?: string;
  sourceUrl?: string;
}

interface StatisticsData {
  overview?: {
    totalStudents?: number;
    averageMatchScore?: number;
    highestMatchScore?: number;
    lowestMatchScore?: number;
  };
  totalStudents?: number;
  averageMatchScore?: number;
  highestScore?: number;
  lowestScore?: number;
}

interface CompetitionOverviewProps {
  competition: CompetitionData | null;
  statistics: StatisticsData | null;
  isLoading: boolean;
  isLight?: boolean;
}

export const CompetitionOverview = ({
  competition,
  statistics,
  isLoading,
  isLight = false,
}: CompetitionOverviewProps) => {
  if (isLoading) {
    return (
      <div className="w-full">
        <div className="mb-6">
          <div className="h-8 w-64 animate-pulse rounded bg-zinc-200" />
          <div className="mt-2 h-4 w-96 animate-pulse rounded bg-zinc-200" />
        </div>
        <div className="grid gap-6">
          <div className="h-64 w-full animate-pulse rounded bg-zinc-200" />
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="h-80 w-full animate-pulse rounded bg-zinc-200" />
            <div className="h-80 w-full animate-pulse rounded bg-zinc-200" />
          </div>
        </div>
      </div>
    );
  }

  if (!competition) {
    return (
      <div className="w-full">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-zinc-900">Competition Not Found</h2>
          <p className="text-zinc-600">The requested competition could not be found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Competition Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <Card
          className={cn(
            "border-2 shadow-xl transition-colors",
            isLight
              ? "border-stone-300/70 bg-white/90 text-[#2F2A24]"
              : "border-zinc-700 bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 text-white"
          )}
        >
          <CardHeader
            className={cn(
              "border-b transition-colors",
              isLight ? "border-stone-300/70" : "border-zinc-700"
            )}
          >
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <CardTitle
                  className={cn("text-2xl font-bold", isLight ? "text-[#2F2A24]" : "text-white")}
                >
                  {competition.title}
                </CardTitle>
                <div className="flex flex-wrap gap-2">
                  {competition.field?.map((field: string) => (
                    <Badge
                      key={field}
                      variant="secondary"
                      className={cn(
                        isLight
                          ? "border-stone-300/70 bg-stone-100 text-[#2F2A24]"
                          : "bg-zinc-700 text-zinc-200"
                      )}
                    >
                      {field}
                    </Badge>
                  ))}
                </div>
              </div>
              {competition.sourceUrl && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(competition.sourceUrl, "_blank")}
                  className={cn(
                    "transition-colors",
                    isLight
                      ? "border-stone-300/70 bg-white/80 text-[#2F2A24] hover:bg-stone-100/80"
                      : "border-zinc-600 bg-zinc-800 text-white hover:bg-zinc-700"
                  )}
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Visit Competition
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              <div className="space-y-2">
                <div
                  className={cn(
                    "flex items-center gap-2",
                    isLight ? "text-[#5C5245]" : "text-zinc-400"
                  )}
                >
                  <Building2 className="h-4 w-4" />
                  <span className="text-sm">Organizer</span>
                </div>
                <p className={cn("font-medium", isLight ? "text-[#2F2A24]" : "text-white")}>
                  {competition.organizer || "N/A"}
                </p>
              </div>
              <div className="space-y-2">
                <div
                  className={cn(
                    "flex items-center gap-2",
                    isLight ? "text-[#5C5245]" : "text-zinc-400"
                  )}
                >
                  <MapPin className="h-4 w-4" />
                  <span className="text-sm">Location</span>
                </div>
                <p className={cn("font-medium", isLight ? "text-[#2F2A24]" : "text-white")}>
                  {competition.location || "N/A"}
                </p>
              </div>
              <div className="space-y-2">
                <div
                  className={cn(
                    "flex items-center gap-2",
                    isLight ? "text-[#5C5245]" : "text-zinc-400"
                  )}
                >
                  <Calendar className="h-4 w-4" />
                  <span className="text-sm">Start Date</span>
                </div>
                <p className={cn("font-medium", isLight ? "text-[#2F2A24]" : "text-white")}>
                  {competition.startDate
                    ? new Date(competition.startDate).toLocaleDateString()
                    : "N/A"}
                </p>
              </div>
              <div className="space-y-2">
                <div
                  className={cn(
                    "flex items-center gap-2",
                    isLight ? "text-[#5C5245]" : "text-zinc-400"
                  )}
                >
                  <Target className="h-4 w-4" />
                  <span className="text-sm">Min IPK</span>
                </div>
                <p className={cn("font-medium", isLight ? "text-[#2F2A24]" : "text-white")}>
                  {competition.minGPA || "N/A"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Statistics Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mb-8"
      >
        <div className="grid grid-cols-1 gap-6 md:grid-cols-1 lg:grid-cols-1">
          <Card
            className={cn(
              "border-2 transition-colors",
              isLight
                ? "border-stone-300/70 bg-white/90 text-[#2F2A24]"
                : "border-zinc-700 bg-gradient-to-br from-zinc-900 to-zinc-800 text-white"
            )}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p
                    className={cn(
                      "text-sm font-medium",
                      isLight ? "text-[#5C5245]" : "text-zinc-400"
                    )}
                  >
                    Total Students
                  </p>
                  <p
                    className={cn("text-3xl font-bold", isLight ? "text-[#2F2A24]" : "text-white")}
                  >
                    {statistics?.overview?.totalStudents || statistics?.totalStudents || 0}
                  </p>
                </div>
                <Users className={cn("h-8 w-8", isLight ? "text-blue-600" : "text-blue-400")} />
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </div>
  );
};
