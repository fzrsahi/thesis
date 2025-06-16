"use client";

import {
  Trophy,
  Radar as RadarIcon,
  Users,
  Calendar,
  Target,
  BarChart3,
  PieChart,
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
} from "lucide-react";
import { useEffect, useRef, useMemo } from "react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import Button from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  TypographyH1,
  TypographyH2,
  TypographyH3,
  TypographyP,
  TypographyEmphasis,
  TypographyMuted,
  TypographyLarge,
} from "@/components/ui/typography";

import {
  useMyRecomendation,
  formatDate,
  getMatchScoreColor,
  type RecommendationResponse,
} from "./hooks/useMyRecomendation";
import { usePostMyRecomendation } from "./hooks/usePostMyRecomendation";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
  Radar as RadarChartComponent,
} from "recharts";

const EmptyState = ({
  onStartAnalysis,
  isCreating,
}: {
  onStartAnalysis: () => void;
  isCreating: boolean;
}) => (
  <div className="flex h-[calc(100vh-4rem)] flex-col items-center justify-center space-y-6 text-center">
    <div className="space-y-2">
      <TypographyH1 className="text-4xl md:text-5xl">Mulai Perjalanan Kompetisi Anda</TypographyH1>
      <TypographyP className="mx-auto max-w-2xl text-lg text-zinc-400">
        Dapatkan rekomendasi kompetisi yang disesuaikan dengan keterampilan, minat, dan profil
        akademik Anda. Kami akan menganalisis profil Anda dan memberikan saran kompetisi terbaik.
      </TypographyP>
    </div>
    <Button
      size="lg"
      className="bg-blue-500 text-white hover:bg-blue-600"
      onClick={onStartAnalysis}
      disabled={isCreating}
    >
      {isCreating ? (
        <>
          <Activity className="mr-2 h-5 w-5 animate-spin" />
          Menganalisis Profil Anda...
        </>
      ) : (
        <>
          Mulai Analisis <ArrowRight className="ml-2 h-5 w-5" />
        </>
      )}
    </Button>
  </div>
);

const CategoryDistributionChart = ({
  data,
}: {
  data: { categories: string[]; values: number[] };
}) => {
  const total = data.values.reduce((sum, val) => sum + val, 0);
  const maxValue = Math.max(...data.values);

  return (
    <div className="space-y-4">
      {data.categories.map((category, index) => {
        const percentage = (data.values[index] / total) * 100;
        const width = (data.values[index] / maxValue) * 100;

        return (
          <div key={category} className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-zinc-300">{category}</span>
              <span className="text-zinc-400">{percentage.toFixed(1)}%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-800">
              <div
                className="h-full rounded-full bg-blue-500 transition-all"
                style={{ width: `${width}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

const PerformanceMetricsCard = ({
  metrics,
}: {
  metrics: ReturnType<typeof useMyRecomendation>["performanceMetrics"];
}) => (
  <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
    <div className="rounded-lg bg-zinc-800 p-4">
      <div className="flex items-center space-x-2">
        <Users className="h-5 w-5 text-blue-500" />
        <div>
          <TypographyMuted>Tingkat Partisipasi</TypographyMuted>
          <TypographyLarge className="text-white">
            {(metrics.participationRate * 10).toFixed(1)}/10
          </TypographyLarge>
        </div>
      </div>
    </div>

    <div className="rounded-lg bg-zinc-800 p-4">
      <div className="flex items-center space-x-2">
        <Target className="h-5 w-5 text-purple-500" />
        <div>
          <TypographyMuted>Rata-rata Kecocokan</TypographyMuted>
          <TypographyLarge className="text-white">
            {(metrics.averageMatchScore * 10).toFixed(1)}/10
          </TypographyLarge>
        </div>
      </div>
    </div>

    <div className="rounded-lg bg-zinc-800 p-4">
      <div className="flex items-center space-x-2">
        <Trophy className="h-5 w-5 text-yellow-500" />
        <div>
          <TypographyMuted>Tingkat Keberhasilan</TypographyMuted>
          <TypographyLarge className="text-white">
            {(metrics.competitionSuccessRate * 10).toFixed(1)}/10
          </TypographyLarge>
        </div>
      </div>
    </div>
  </div>
);

const ComparisonSpiderChart = ({
  studentData,
  competitionData,
  size = 300,
  showOnlyStudent = false,
}: {
  studentData: ReturnType<typeof useMyRecomendation>["studentSkillsData"];
  competitionData?: ReturnType<typeof useMyRecomendation>["competitionSkillsData"];
  size?: number;
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
        skill,
        student: studentSkillMap.get(skill) || 0,
        competition: competitionSkillMap.get(skill) || 0,
      }));
  }, [studentData, competitionData]);

  if (chartData.length === 0) {
    return (
      <div className="flex h-[300px] items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900">
        <TypographyP className="text-zinc-400">Tidak ada data tersedia</TypographyP>
      </div>
    );
  }

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart
          cx="50%"
          cy="50%"
          outerRadius="80%"
          data={chartData}
          margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
        >
          <PolarGrid stroke="rgba(255, 255, 255, 0.1)" />
          <PolarAngleAxis
            dataKey="skill"
            tick={{ fill: "#a1a1aa", fontSize: 12 }}
            stroke="rgba(255, 255, 255, 0.1)"
          />
          <PolarRadiusAxis
            angle={30}
            domain={[0, 10]}
            tick={{ fill: "#a1a1aa", fontSize: 10 }}
            stroke="rgba(255, 255, 255, 0.1)"
          />
          <RadarChartComponent
            name="Keterampilan Anda"
            dataKey="student"
            stroke="#3b82f6"
            fill="#3b82f6"
            fillOpacity={0.3}
          />
          {!showOnlyStudent && competitionData && competitionData.length > 0 && (
            <RadarChartComponent
              name="Keterampilan yang Dibutuhkan"
              dataKey="competition"
              stroke="#f59e0b"
              fill="#f59e0b"
              fillOpacity={0.3}
            />
          )}
          <Tooltip
            contentStyle={{
              backgroundColor: "rgb(24, 24, 27)",
              border: "1px solid rgb(63, 63, 70)",
              borderRadius: "0.375rem",
              color: "#fff",
            }}
            formatter={(value: number, name: string) => [
              `${value.toFixed(1)}/10`,
              name === "student" ? "Keterampilan Anda" : "Keterampilan yang Dibutuhkan",
            ]}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

const RecommendationContent = ({ data }: { data: RecommendationResponse }) => {
  const { selectedCompetition, setSelectedCompetition, studentSkillsData, competitionSkillsData } =
    useMyRecomendation();
  const recommendationsRef = useRef<HTMLDivElement>(null);

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

  return (
    <div className="space-y-8">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <TypographyH1 className="text-3xl md:text-4xl">
              Rekomendasi{" "}
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-blue-500 bg-clip-text text-transparent">
                Kompetisi
              </span>
            </TypographyH1>
            <TypographyP className="mt-2">
              Rekomendasi yang disesuaikan dengan{" "}
              <TypographyEmphasis>keterampilan, minat, dan tujuan</TypographyEmphasis> Anda
            </TypographyP>
          </div>
          <Button className="border border-zinc-700 bg-zinc-800 text-white hover:bg-zinc-700">
            <Activity className="mr-2 h-4 w-4" />
            Perbarui Analisis
          </Button>
        </div>

        {/* Student Summary */}
        <Card className="border-zinc-800 bg-zinc-900">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-white">
              <Users className="h-5 w-5" />
              <span>Profil Mahasiswa</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <TypographyP className="text-zinc-300">{data.result.studentSummary}</TypographyP>
          </CardContent>
        </Card>

        {/* Grid Konten Utama */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Daftar Rekomendasi */}
          <div className="space-y-6 lg:col-span-2" ref={recommendationsRef}>
            <div>
              <TypographyH3 className="mb-4">Rekomendasi Terbaik untuk Anda</TypographyH3>
              <div className="space-y-4">
                {data.result.recommendations.map((rec) => (
                  <Card
                    key={rec.id}
                    className={`cursor-pointer border-zinc-800 bg-zinc-900 transition-all hover:border-zinc-700 ${
                      selectedCompetition?.id === rec.id ? "ring-2 ring-blue-500" : ""
                    }`}
                    onClick={() => setSelectedCompetition(rec)}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <CardTitle className="text-white">{rec.competitionName}</CardTitle>
                            <Badge variant="outline" className="text-xs">
                              Peringkat #{rec.rank}
                            </Badge>
                          </div>
                          <CardDescription className="text-zinc-400">
                            {rec.matchScore.reason}
                          </CardDescription>
                        </div>
                        <Badge
                          className={`ml-4 text-white ${getMatchScoreColor(rec.matchScore.score)}`}
                        >
                          {(rec.matchScore.score * 10).toFixed(1)}/10 Kecocokan
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <Accordion type="single" collapsible className="space-y-4">
                        <AccordionItem value="match-explanation" className="border-zinc-800">
                          <AccordionTrigger className="text-white hover:no-underline">
                            <div className="flex items-center space-x-2">
                              <BarChart3 className="h-5 w-5" />
                              <span>Penjelasan Kecocokan</span>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="space-y-4 pl-7">
                              <TypographyP className="text-sm text-zinc-300">
                                {rec.matchScore.reason}
                              </TypographyP>
                              <div className="mt-4 space-y-4">
                                <div>
                                  <TypographyH3 className="mb-2 text-sm text-white">
                                    Kelebihan
                                  </TypographyH3>
                                  <ul className="space-y-2">
                                    {rec.reasoning.pros.map((pro) => (
                                      <li key={pro} className="flex items-start space-x-2">
                                        <div className="mt-1 h-1.5 w-1.5 rounded-full bg-green-500" />
                                        <TypographyP className="text-sm text-zinc-300">
                                          {pro}
                                        </TypographyP>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                                <div>
                                  <TypographyH3 className="mb-2 text-sm text-white">
                                    Kekurangan
                                  </TypographyH3>
                                  <ul className="space-y-2">
                                    {rec.reasoning.cons.map((con) => (
                                      <li key={con} className="flex items-start space-x-2">
                                        <div className="mt-1 h-1.5 w-1.5 rounded-full bg-yellow-500" />
                                        <TypographyP className="text-sm text-zinc-300">
                                          {con}
                                        </TypographyP>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              </div>
                            </div>
                          </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="skill-breakdown" className="border-zinc-800">
                          <AccordionTrigger className="text-white hover:no-underline">
                            <div className="flex items-center space-x-2">
                              <RadarIcon className="h-5 w-5" />
                              <span>Kebutuhan Keterampilan</span>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="space-y-3 pl-7">
                              {Object.entries(rec.skillRequirements).map(
                                ([skill, { weight, breakdown }]) => (
                                  <div key={skill} className="rounded-lg bg-zinc-800 p-3">
                                    <div className="mb-2 flex items-center justify-between">
                                      <span className="font-medium text-white">
                                        {skill.replace(/_/g, " ")}
                                      </span>
                                      <span className="text-blue-400">
                                        {(weight * 10).toFixed(1)}/10
                                      </span>
                                    </div>
                                    <TypographyP className="text-sm text-zinc-400">
                                      {breakdown}
                                    </TypographyP>
                                  </div>
                                )
                              )}
                            </div>
                          </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="competition-details" className="border-zinc-800">
                          <AccordionTrigger className="text-white hover:no-underline">
                            <div className="flex items-center space-x-2">
                              <Calendar className="h-5 w-5" />
                              <span>Detail Kompetisi</span>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="space-y-6 pl-7">
                              <div className="space-y-4">
                                <TypographyP className="text-sm text-zinc-300">
                                  {rec.competition.description}
                                </TypographyP>

                                <div className="grid grid-cols-2 gap-4 text-sm">
                                  <div className="flex items-center space-x-2">
                                    <Calendar className="h-4 w-4 text-zinc-400" />
                                    <span className="text-zinc-300">
                                      Mulai: {formatDate(rec.competition.startDate)}
                                    </span>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <Calendar className="h-4 w-4 text-zinc-400" />
                                    <span className="text-zinc-300">
                                      Selesai: {formatDate(rec.competition.endDate)}
                                    </span>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <MapPin className="h-4 w-4 text-zinc-400" />
                                    <span className="text-zinc-300">
                                      {rec.competition.location || "Daring"}
                                    </span>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <Users className="h-4 w-4 text-zinc-400" />
                                    <span className="text-zinc-300">
                                      oleh {rec.competition.organizer}
                                    </span>
                                  </div>
                                </div>

                                {rec.competition.sourceUrl && (
                                  <div className="flex items-center space-x-2">
                                    <ExternalLink className="h-4 w-4 text-zinc-400" />
                                    <a
                                      href={rec.competition.sourceUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-blue-400 hover:underline"
                                    >
                                      Kunjungi Website
                                    </a>
                                  </div>
                                )}
                              </div>
                            </div>
                          </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="key-factors" className="border-zinc-800">
                          <AccordionTrigger className="text-white hover:no-underline">
                            <div className="flex items-center space-x-2">
                              <Target className="h-5 w-5" />
                              <span>Faktor Kunci Keberhasilan</span>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="space-y-3 pl-7">
                              {rec.keyFactors.map((factor) => (
                                <div key={factor} className="flex items-start space-x-2">
                                  <div className="mt-1 h-1.5 w-1.5 rounded-full bg-blue-500" />
                                  <TypographyP className="text-sm text-zinc-300">
                                    {factor}
                                  </TypographyP>
                                </div>
                              ))}
                            </div>
                          </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="preparation" className="border-zinc-800">
                          <AccordionTrigger className="text-white hover:no-underline">
                            <div className="flex items-center space-x-2">
                              <BookOpen className="h-5 w-5" />
                              <span>Tips Persiapan</span>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="space-y-3 pl-7">
                              {rec.preparationTips.map((tip) => (
                                <div key={tip} className="flex items-start space-x-2">
                                  <ArrowRight className="mt-1 h-4 w-4 text-blue-500" />
                                  <TypographyP className="text-sm text-zinc-300">{tip}</TypographyP>
                                </div>
                              ))}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar - Analitik */}
          <div className="space-y-6">
            {/* Grafik Perbandingan Keterampilan */}
            <Card className="border-zinc-800 bg-zinc-900">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Perbandingan Keterampilan</span>
                  {selectedCompetition && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedCompetition(null)}
                      className="text-xs"
                    >
                      Reset Tampilan
                    </Button>
                  )}
                </CardTitle>
                <CardDescription>
                  {selectedCompetition
                    ? `Perbandingan keterampilan Anda dengan ${selectedCompetition.competitionName}`
                    : "Pilih kompetisi untuk melihat perbandingan keterampilan"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ComparisonSpiderChart
                  studentData={studentSkillsData}
                  competitionData={selectedCompetition ? competitionSkillsData : undefined}
                  size={300}
                />
              </CardContent>
            </Card>

            {/* Profil Keterampilan */}
            <Card className="border-zinc-800 bg-zinc-900">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-white">
                  <Brain className="h-5 w-5" />
                  <span>Profil Keterampilan</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(data.result.skillsProfile).map(
                    ([skill, { score, breakdown }]) => (
                      <div key={skill} className="rounded-lg bg-zinc-800 p-3">
                        <div className="mb-2 flex items-center justify-between">
                          <span className="text-sm font-medium text-white">
                            {skill.replace(/_/g, " ")}
                          </span>
                          <span className="font-medium text-blue-400">
                            {(score * 10).toFixed(1)}/10
                          </span>
                        </div>
                        <TypographyP className="text-xs text-zinc-400">{breakdown}</TypographyP>
                      </div>
                    )
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Kekuatan Profil */}
            <Card className="border-zinc-800 bg-zinc-900">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-white">
                  <Target className="h-5 w-5" />
                  <span>Kekuatan Profil</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <TypographyH3 className="mb-2 text-sm text-white">Kelebihan</TypographyH3>
                    <div className="space-y-2">
                      {data.result.overallAssessment.strengths.map((strength) => (
                        <div key={strength} className="flex items-start space-x-2">
                          <div className="mt-1 h-1.5 w-1.5 rounded-full bg-green-500" />
                          <TypographyP className="text-sm text-zinc-300">{strength}</TypographyP>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <TypographyH3 className="mb-2 text-sm text-white">
                      Area Pengembangan
                    </TypographyH3>
                    <div className="space-y-2">
                      {data.result.overallAssessment.weaknesses.map((weakness) => (
                        <div key={weakness} className="flex items-start space-x-2">
                          <div className="mt-1 h-1.5 w-1.5 rounded-full bg-yellow-500" />
                          <TypographyP className="text-sm text-zinc-300">{weakness}</TypographyP>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Sumber Pengembangan */}
            <Card className="border-zinc-800 bg-zinc-900">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-white">
                  <Lightbulb className="h-5 w-5" />
                  <span>Sumber Pengembangan</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data.result.developmentSuggestions.map((suggestion) => {
                    let icon;
                    switch (suggestion.type) {
                      case "course":
                        icon = <BookOpen className="h-4 w-4 text-blue-500" />;
                        break;
                      case "practice":
                        icon = <Code2 className="h-4 w-4 text-green-500" />;
                        break;
                      case "certification":
                        icon = <Trophy className="h-4 w-4 text-yellow-500" />;
                        break;
                      default:
                        icon = <Lightbulb className="h-4 w-4 text-purple-500" />;
                    }

                    return (
                      <div key={suggestion.title} className="rounded-lg bg-zinc-800 p-3">
                        <div className="flex items-center space-x-2">
                          {icon}
                          <TypographyH3 className="text-sm text-white">
                            {suggestion.title}
                          </TypographyH3>
                        </div>
                        <TypographyP className="mt-1 text-sm text-zinc-400">
                          {suggestion.reason}
                        </TypographyP>
                        <a
                          href={suggestion.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-2 inline-flex items-center text-xs text-blue-400 hover:underline"
                        >
                          Kunjungi Sumber
                          <ExternalLink className="ml-1 h-3 w-3" />
                        </a>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
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
      <div className="flex h-[50vh] items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-zinc-400" />
          <p className="mt-4 text-sm text-zinc-400">Memuat rekomendasi Anda...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="text-center">
          <AlertCircle className="mx-auto h-8 w-8 text-red-500" />
          <h3 className="mt-4 text-lg font-semibold text-zinc-100">Gagal Memuat Rekomendasi</h3>
          <p className="mt-2 text-sm text-zinc-400">
            {error instanceof Error ? error.message : "Terjadi kesalahan yang tidak terduga"}
          </p>
          <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
            Coba Lagi
          </Button>
        </div>
      </div>
    );
  }

  if (!data) {
    return <EmptyState onStartAnalysis={handleStartAnalysis} isCreating={isCreating} />;
  }

  return <RecommendationContent data={data} />;
};

export default MyRecommendationPage;
