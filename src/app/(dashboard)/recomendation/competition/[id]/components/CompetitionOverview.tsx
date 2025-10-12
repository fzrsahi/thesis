"use client";

import { motion } from "framer-motion";
import {
  Users,
  TrendingUp,
  Award,
  Target,
  Calendar,
  MapPin,
  Building2,
  ExternalLink,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import Button from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
}

export const CompetitionOverview = ({
  competition,
  statistics,
  isLoading,
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
        <Card className="border-2 border-zinc-700 bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 text-white shadow-xl">
          <CardHeader className="border-b border-zinc-700">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <CardTitle className="text-2xl font-bold text-white">{competition.title}</CardTitle>
                <div className="flex flex-wrap gap-2">
                  {competition.field?.map((field: string) => (
                    <Badge key={field} variant="secondary" className="bg-zinc-700 text-zinc-200">
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
                  className="border-zinc-600 bg-zinc-800 text-white hover:bg-zinc-700"
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
                <div className="flex items-center gap-2 text-zinc-400">
                  <Building2 className="h-4 w-4" />
                  <span className="text-sm">Organizer</span>
                </div>
                <p className="font-medium text-white">{competition.organizer || "N/A"}</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-zinc-400">
                  <MapPin className="h-4 w-4" />
                  <span className="text-sm">Location</span>
                </div>
                <p className="font-medium text-white">{competition.location || "N/A"}</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-zinc-400">
                  <Calendar className="h-4 w-4" />
                  <span className="text-sm">Start Date</span>
                </div>
                <p className="font-medium text-white">
                  {competition.startDate
                    ? new Date(competition.startDate).toLocaleDateString()
                    : "N/A"}
                </p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-zinc-400">
                  <Target className="h-4 w-4" />
                  <span className="text-sm">Min IPK</span>
                </div>
                <p className="font-medium text-white">{competition.minGPA || "N/A"}</p>
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
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="border border-zinc-700 bg-gradient-to-br from-zinc-900 to-zinc-800 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-zinc-400">Total Students</p>
                  <p className="text-3xl font-bold text-white">
                    {statistics?.overview?.totalStudents || statistics?.totalStudents || 0}
                  </p>
                </div>
                <Users className="h-8 w-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="border border-zinc-700 bg-gradient-to-br from-zinc-900 to-zinc-800 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-zinc-400">Average Score</p>
                  <p className="text-3xl font-bold text-green-400">
                    {parseFloat(
                      (
                        statistics?.overview?.averageMatchScore ||
                        statistics?.averageMatchScore ||
                        0
                      ).toFixed(3)
                    )}
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="border border-zinc-700 bg-gradient-to-br from-zinc-900 to-zinc-800 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-zinc-400">Highest Score</p>
                  <p className="text-3xl font-bold text-yellow-400">
                    {parseFloat(
                      (
                        statistics?.overview?.highestMatchScore ||
                        statistics?.highestScore ||
                        0
                      ).toFixed(3)
                    )}
                  </p>
                </div>
                <Award className="h-8 w-8 text-yellow-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="border border-zinc-700 bg-gradient-to-br from-zinc-900 to-zinc-800 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-zinc-400">Lowest Score</p>
                  <p className="text-3xl font-bold text-red-400">
                    {parseFloat(
                      (
                        statistics?.overview?.lowestMatchScore ||
                        statistics?.lowestScore ||
                        0
                      ).toFixed(3)
                    )}
                  </p>
                </div>
                <Target className="h-8 w-8 text-red-400" />
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </div>
  );
};
