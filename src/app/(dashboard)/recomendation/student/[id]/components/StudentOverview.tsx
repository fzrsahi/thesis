"use client";

import { motion } from "framer-motion";
import { User, Award, Target, Calendar, Building2, GraduationCap } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StudentData {
  id?: number;
  userId?: number;
  name?: string;
  studentId?: string | null;
  email?: string;
  entryYear?: number;
  gpa?: string | null;
  studyProgram?: {
    id?: number;
    name?: string;
  };
}

interface StatisticsData {
  overview?: {
    totalCompetitions?: number;
    averageMatchScore?: number;
    highestMatchScore?: number;
    lowestMatchScore?: number;
    totalRecommendations?: number;
    scoreDistribution?: {
      excellent?: number;
      good?: number;
      fair?: number;
      poor?: number;
    };
  };
  totalCompetitions?: number;
  averageMatchScore?: number;
  highestScore?: number;
  lowestScore?: number;
  totalRecommendations?: number;
  studentSummary?: string;
  skillProfile?: Record<string, { score: number; breakdown: string }>;
  strengths?: string[];
  weaknesses?: string[];
  scoreDistribution?: {
    excellent?: number;
    good?: number;
    fair?: number;
    poor?: number;
  };
  competitionTypes?: Array<{
    type: string;
    count: number;
    averageScore: number;
    percentage: number;
  }>;
  skillComparison?: Array<{
    skill: string;
    studentScore: number;
    averageScore: number;
    difference: number;
  }>;
  topCompetitions?: Array<{
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
  }>;
}

interface StudentOverviewProps {
  student: StudentData | null;
  statistics: StatisticsData | null;
  isLoading: boolean;
}

export const StudentOverview = ({ student, statistics, isLoading }: StudentOverviewProps) => {
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

  if (!student) {
    return (
      <div className="w-full">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-zinc-900">Student Not Found</h2>
          <p className="text-zinc-600">The requested student could not be found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Student Overview */}
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
                <CardTitle className="text-2xl font-bold text-white">{student.name}</CardTitle>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary" className="bg-zinc-700 text-zinc-200">
                    {student.studentId}
                  </Badge>
                  {student.studyProgram?.name && (
                    <Badge variant="secondary" className="bg-blue-600 text-white">
                      {student.studyProgram.name}
                    </Badge>
                  )}
                  {student.entryYear && (
                    <Badge variant="secondary" className="bg-green-600 text-white">
                      Angkatan {student.entryYear}
                    </Badge>
                  )}
                </div>
              </div>
              <div className="text-right">
                {student.gpa && <div className="text-sm text-zinc-400">IPK</div>}
                {student.gpa && (
                  <div className="text-2xl font-bold text-yellow-400">{student.gpa}</div>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-zinc-400">
                  <Building2 className="h-4 w-4" />
                  <span className="text-sm">Program Studi</span>
                </div>
                <p className="font-medium text-white">{student.studyProgram?.name || "N/A"}</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-zinc-400">
                  <Calendar className="h-4 w-4" />
                  <span className="text-sm">Tahun Masuk</span>
                </div>
                <p className="font-medium text-white">{student.entryYear || "N/A"}</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-zinc-400">
                  <GraduationCap className="h-4 w-4" />
                  <span className="text-sm">IPK</span>
                </div>
                <p className="font-medium text-white">{student.gpa || "N/A"}</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-zinc-400">
                  <User className="h-4 w-4" />
                  <span className="text-sm">Email</span>
                </div>
                <p className="font-medium text-white">{student.email || "N/A"}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Student Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mb-8"
      >
        <Card className="group relative overflow-hidden border border-zinc-800/50 bg-gradient-to-br from-zinc-900/50 to-zinc-800/50 backdrop-blur-sm transition-all hover:border-zinc-700/50">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 transition-opacity group-hover:opacity-100" />
          <CardHeader>
            <CardTitle className="flex items-center space-x-3 text-white">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg">
                <User className="h-5 w-5" />
              </div>
              <span className="text-xl">Deskripsi Hasil Rekomendasi</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="leading-relaxed text-zinc-300">
              {statistics?.studentSummary ||
                "Mahasiswa ini memiliki profil yang sangat baik dengan keterampilan teknis yang kuat dan kemampuan pembelajaran mandiri yang excellent. " +
                  "Dengan IPK yang tinggi dan pengalaman yang solid, mahasiswa ini sangat cocok untuk kompetisi-kompetisi yang membutuhkan pemecahan masalah sistematis dan kreativitas. " +
                  "Rekomendasi kompetisi telah disesuaikan berdasarkan analisis mendalam terhadap profil akademik, keterampilan teknis, dan potensi pengembangan yang dimiliki."}
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Student Profile Summary */}
      {statistics?.skillProfile && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-8"
        >
          <Card className="border border-zinc-700 bg-gradient-to-br from-zinc-900 to-zinc-800 text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <User className="h-5 w-5" />
                Profil Keterampilan Mahasiswa
              </CardTitle>
              <p className="mt-2 text-sm text-zinc-400">
                Ringkasan keterampilan dan kemampuan mahasiswa berdasarkan analisis profil.
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {Object.entries(statistics.skillProfile).map(
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
                          <span className="truncate text-sm font-semibold text-white">{skill}</span>
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
                        <p className="text-sm leading-relaxed text-zinc-400">{breakdown}</p>
                      </div>
                    </motion.div>
                  )
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Strengths and Weaknesses */}
      {(statistics?.strengths || statistics?.weaknesses) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mb-8"
        >
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Strengths */}
            {statistics?.strengths && statistics.strengths.length > 0 && (
              <Card className="border border-zinc-700 bg-gradient-to-br from-zinc-900 to-zinc-800 text-white">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Award className="h-5 w-5 text-green-400" />
                    Kelebihan
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {statistics.strengths.map((strength, index) => (
                      <motion.div
                        key={`strength-${strength.slice(0, 20)}`}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1, duration: 0.3 }}
                        className="group flex items-start space-x-3 rounded-lg bg-gradient-to-r from-green-500/10 to-emerald-500/10 p-3 backdrop-blur-sm transition-all hover:from-green-500/20 hover:to-emerald-500/20"
                      >
                        <div className="mt-1 h-2 w-2 rounded-full bg-gradient-to-r from-green-400 to-emerald-400 shadow-sm" />
                        <p className="text-sm leading-relaxed text-zinc-300">{strength}</p>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Weaknesses */}
            {statistics?.weaknesses && statistics.weaknesses.length > 0 && (
              <Card className="border border-zinc-700 bg-gradient-to-br from-zinc-900 to-zinc-800 text-white">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Target className="h-5 w-5 text-yellow-400" />
                    Area Pengembangan
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {statistics.weaknesses.map((weakness, index) => (
                      <motion.div
                        key={`weakness-${weakness.slice(0, 20)}`}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1, duration: 0.3 }}
                        className="group flex items-start space-x-3 rounded-lg bg-gradient-to-r from-yellow-500/10 to-orange-500/10 p-3 backdrop-blur-sm transition-all hover:from-yellow-500/20 hover:to-orange-500/20"
                      >
                        <div className="mt-1 h-2 w-2 rounded-full bg-gradient-to-r from-yellow-400 to-orange-400 shadow-sm" />
                        <p className="text-sm leading-relaxed text-zinc-300">{weakness}</p>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
};
