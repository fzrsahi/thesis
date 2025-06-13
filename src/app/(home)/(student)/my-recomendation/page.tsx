"use client";

import {
  Trophy,
  Users,
  Calendar,
  Target,
  BarChart3,
  PieChart,
  Activity,
  MapPin,
  ExternalLink,
  Radar,
  Brain,
  Code2,
  BookOpen,
  Lightbulb,
  ArrowRight,
} from "lucide-react";
import { useEffect, useRef } from "react";

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

const EmptyState = ({
  onStartAnalysis,
  isCreating,
}: {
  onStartAnalysis: () => void;
  isCreating: boolean;
}) => (
  <div className="flex min-h-[60vh] flex-col items-center justify-center space-y-6 text-center">
    <div className="rounded-full bg-zinc-800 p-6">
      <Target className="h-12 w-12 text-zinc-400" />
    </div>
    <div className="space-y-2">
      <TypographyH2 className="text-2xl">Belum Ada Rekomendasi</TypographyH2>
      <TypographyP className="max-w-md">
        Mulai analisis profil Anda untuk mendapatkan rekomendasi kompetisi yang sesuai dengan
        <TypographyEmphasis> keterampilan dan minat Anda</TypographyEmphasis>.
      </TypographyP>
    </div>
    <Button
      onClick={onStartAnalysis}
      disabled={isCreating}
      className="cursor-pointer border border-zinc-700 bg-zinc-800 text-white hover:bg-zinc-700"
    >
      {isCreating ? (
        <>
          <Activity className="mr-2 h-4 w-4 animate-spin" />
          Menganalisis Profil...
        </>
      ) : (
        <>
          <Activity className="mr-2 h-4 w-4" />
          Mulai Analisis Profil
        </>
      )}
    </Button>
  </div>
);

const CategoryDistributionChart = ({ data }: { data: Record<string, number> }) => {
  const categories = Object.entries(data);
  const total = categories.reduce((sum, [, value]) => sum + value, 0);

  return (
    <div className="space-y-4">
      {categories.map(([category, value]) => {
        const percentage = (value / total) * 100;
        const colors = ["bg-blue-500", "bg-purple-500", "bg-green-500"];
        const colorIndex = categories.findIndex(([cat]) => cat === category);

        return (
          <div key={category} className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-zinc-300">{category}</span>
              <span className="font-medium text-white">{Math.round(percentage)}%</span>
            </div>
            <div className="h-2 rounded-full bg-zinc-800">
              <div
                className={`h-2 rounded-full ${colors[colorIndex % colors.length]}`}
                style={{ width: `${percentage}%` }}
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
  metrics: RecommendationResponse["performanceMetrics"];
}) => (
  <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
    <div className="rounded-lg bg-zinc-800 p-4">
      <div className="flex items-center space-x-2">
        <Users className="h-5 w-5 text-blue-500" />
        <div>
          <TypographyMuted>Participation Rate</TypographyMuted>
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
          <TypographyMuted>Avg Match Score</TypographyMuted>
          <TypographyLarge className="text-white">
            {(metrics.avgMatchScore * 10).toFixed(1)}/10
          </TypographyLarge>
        </div>
      </div>
    </div>

    <div className="rounded-lg bg-zinc-800 p-4">
      <div className="flex items-center space-x-2">
        <Trophy className="h-5 w-5 text-yellow-500" />
        <div>
          <TypographyMuted>Success Rate</TypographyMuted>
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
  studentData: Array<{ label: string; value: number; type?: "student" | "competition" }>;
  competitionData?: Array<{ label: string; value: number; type?: "student" | "competition" }>;
  size?: number;
  showOnlyStudent?: boolean;
}) => {
  const allSkills = Array.from(
    new Set([
      ...studentData.map((item) => item.label),
      ...(competitionData || []).map((item) => item.label),
    ])
  );

  const normalizedStudentData = allSkills.map((skill) => {
    const studentPoint = studentData.find((item) => item.label === skill);
    return {
      label: skill,
      value: studentPoint?.value || 0,
      type: "student" as const,
    };
  });

  const normalizedCompetitionData = competitionData
    ? allSkills.map((skill) => {
        const competitionPoint = competitionData.find((item) => item.label === skill);
        return {
          label: skill,
          value: competitionPoint?.value || 0,
          type: "competition" as const,
        };
      })
    : null;

  const center = size / 2;
  const radius = size / 2 - 30;
  const angleStep = (2 * Math.PI) / allSkills.length;

  const backgroundPoints = Array.from({ length: allSkills.length }, (_, i) => {
    const angle = i * angleStep - Math.PI / 2;
    return {
      x: center + Math.cos(angle) * radius,
      y: center + Math.sin(angle) * radius,
    };
  });

  const generateDataPoints = (
    data: Array<{ label: string; value: number; type?: "student" | "competition" }>
  ) =>
    data.map((item, i) => {
      const angle = i * angleStep - Math.PI / 2;
      const value = item.value * radius;
      return {
        x: center + Math.cos(angle) * value,
        y: center + Math.sin(angle) * value,
        label: item.label,
        value: item.value,
      };
    });

  const studentPoints = generateDataPoints(normalizedStudentData);
  const competitionPoints = normalizedCompetitionData
    ? generateDataPoints(normalizedCompetitionData)
    : null;

  return (
    <div className="relative">
      <svg width={size} height={size} className="overflow-visible">
        {/* Background grid */}
        {[0.2, 0.4, 0.6, 0.8, 1].map((scale) => (
          <polygon
            key={`scale-${scale}`}
            points={backgroundPoints
              .map(
                (point) =>
                  `${center + (point.x - center) * scale},${center + (point.y - center) * scale}`
              )
              .join(" ")}
            fill="none"
            stroke="rgb(63 63 70)"
            strokeWidth="1"
            opacity={0.3}
          />
        ))}

        {/* Grid lines */}
        {backgroundPoints.map((point) => (
          <line
            key={`line-${point.x}-${point.y}`}
            x1={center}
            y1={center}
            x2={point.x}
            y2={point.y}
            stroke="rgb(63 63 70)"
            strokeWidth="1"
            opacity={0.3}
          />
        ))}

        {/* Competition area - only show if competition data exists */}
        {!showOnlyStudent && competitionPoints && (
          <polygon
            points={competitionPoints.map((point) => `${point.x},${point.y}`).join(" ")}
            fill="rgb(168 85 247)"
            fillOpacity={0.1}
            stroke="rgb(168 85 247)"
            strokeWidth="2"
            strokeDasharray="4"
          />
        )}

        {/* Student area */}
        <polygon
          points={studentPoints.map((point) => `${point.x},${point.y}`).join(" ")}
          fill="rgb(59 130 246)"
          fillOpacity={0.2}
          stroke="rgb(59 130 246)"
          strokeWidth="2"
        />

        {/* Competition points - only show if competition data exists */}
        {!showOnlyStudent &&
          competitionPoints?.map((point) => (
            <circle
              key={`competition-point-${point.x}-${point.y}`}
              cx={point.x}
              cy={point.y}
              r="4"
              fill="rgb(168 85 247)"
              stroke="white"
              strokeWidth="2"
            />
          ))}

        {/* Student points */}
        {studentPoints.map((point) => (
          <circle
            key={`student-point-${point.x}-${point.y}`}
            cx={point.x}
            cy={point.y}
            r="4"
            fill="rgb(59 130 246)"
            stroke="white"
            strokeWidth="2"
          />
        ))}
      </svg>

      {/* Labels */}
      {studentPoints.map((point, labelIndex) => {
        const labelAngle = labelIndex * angleStep - Math.PI / 2;
        const labelRadius = radius + 20;
        const labelX = center + Math.cos(labelAngle) * labelRadius;
        const labelY = center + Math.sin(labelAngle) * labelRadius;

        return (
          <div
            key={`label-${point.label}`}
            className="absolute text-xs font-medium text-zinc-300"
            style={{
              left: labelX - 40,
              top: labelY - 10,
              width: 80,
              textAlign: "center",
            }}
          >
            <div className="truncate">{point.label}</div>
            <div className="flex justify-center space-x-2 text-[10px]">
              <span className="text-blue-400">You: {(point.value * 10).toFixed(1)}</span>
              {!showOnlyStudent && competitionPoints && (
                <span className="text-purple-400">
                  Req:{" "}
                  {competitionPoints[labelIndex]?.value
                    ? (competitionPoints[labelIndex].value * 10).toFixed(1)
                    : "0.0"}
                </span>
              )}
            </div>
          </div>
        );
      })}

      {/* Legend */}
      <div className="absolute right-0 -bottom-8 left-0 flex justify-center space-x-4 text-xs">
        <div className="flex items-center space-x-2">
          <div className="h-2 w-2 rounded-full bg-blue-500" />
          <span className="text-zinc-300">Your Skills</span>
        </div>
        {!showOnlyStudent && (
          <div className="flex items-center space-x-2">
            <div className="h-2 w-2 rounded-full bg-purple-500" />
            <span className="text-zinc-300">Required Skills</span>
          </div>
        )}
      </div>
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
        !recommendationsRef.current.contains(event.target as Node) &&
        selectedCompetition
      ) {
        setSelectedCompetition(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [selectedCompetition, setSelectedCompetition]);

  return (
    <div className="space-y-8">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <TypographyH1 className="text-3xl md:text-4xl">
              Your Competition{" "}
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-blue-500 bg-clip-text text-transparent">
                Recommendations
              </span>
            </TypographyH1>
            <TypographyP className="mt-2">
              Personalized recommendations based on your{" "}
              <TypographyEmphasis>skills, interests, and goals</TypographyEmphasis>
            </TypographyP>
          </div>
          <Button className="border border-zinc-700 bg-zinc-800 text-white hover:bg-zinc-700">
            <Activity className="mr-2 h-4 w-4" />
            Refresh Analysis
          </Button>
        </div>

        {/* Performance Metrics Overview */}
        <Card className="border-zinc-800 bg-zinc-900">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-white">
              <BarChart3 className="h-5 w-5" />
              <span>Performance Overview</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <PerformanceMetricsCard metrics={data.performanceMetrics} />

            {/* Skill Growth Section */}
            <div className="mt-6">
              <TypographyH3 className="mb-3 text-white">Recent Skill Growth</TypographyH3>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                {Object.entries(data.performanceMetrics.skillGrowth).map(([skill, growth]) => (
                  <div key={skill} className="rounded-lg bg-zinc-800 p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-zinc-300">{skill}</span>
                      <span className="font-medium text-green-400">{growth}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Main Content - Recommendations List */}
        <div className="space-y-6 lg:col-span-2" ref={recommendationsRef}>
          <div>
            <TypographyH3 className="mb-4">Top Recommendations for You</TypographyH3>
            <div className="space-y-4">
              {data.recommendations.map((rec) => (
                <Card
                  key={rec.id}
                  className={`cursor-pointer border-zinc-800 bg-zinc-900 transition-all hover:border-zinc-700 ${
                    selectedCompetition?.id === rec.id ? "ring-2 ring-blue-500" : ""
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedCompetition(rec);
                  }}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <CardTitle className="text-white">{rec.competition}</CardTitle>
                          <Badge variant="outline" className="text-xs">
                            Rank #{rec.rank}
                          </Badge>
                          {rec.applied && (
                            <Badge variant="success" className="text-xs">
                              Applied
                            </Badge>
                          )}
                        </div>
                        <CardDescription className="max-w-5xlxl mt-3 text-base leading-relaxed text-zinc-400">
                          {rec.reason}
                        </CardDescription>
                      </div>
                      <Badge className={`ml-4 text-white ${getMatchScoreColor(rec.matchScore)}`}>
                        {(rec.matchScore * 10).toFixed(1)}/10 Match
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Accordion type="single" collapsible className="space-y-4">
                      <AccordionItem value="match-explanation" className="border-zinc-800">
                        <AccordionTrigger className="text-white hover:no-underline">
                          <div className="flex items-center space-x-2">
                            <BarChart3 className="h-5 w-5" />
                            <span>Match Score Breakdown</span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-4 pl-7">
                            <TypographyP className="text-sm text-zinc-300">
                              {rec.matchScoreBreakdown}
                            </TypographyP>
                          </div>
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="skill-breakdown" className="border-zinc-800">
                        <AccordionTrigger className="text-white hover:no-underline">
                          <div className="flex items-center space-x-2">
                            <Radar className="h-5 w-5" />
                            <span>Skill Requirements Breakdown</span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-3 pl-7">
                            {Object.entries(rec.skillDistributionBreakdown).map(
                              ([skill, explanation]) => (
                                <div key={skill} className="rounded-lg bg-zinc-800 p-3">
                                  <div className="mb-2 flex items-center justify-between">
                                    <span className="font-medium text-white">
                                      {skill.replace("_", " ")}
                                    </span>
                                    <span className="text-blue-400">
                                      {(rec.skillDistribution[skill] * 10).toFixed(1)}/10
                                    </span>
                                  </div>
                                  <TypographyP className="text-sm text-zinc-400">
                                    {explanation}
                                  </TypographyP>
                                </div>
                              )
                            )}
                          </div>
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="details" className="border-zinc-800">
                        <AccordionTrigger className="text-white hover:no-underline">
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-5 w-5" />
                            <span>Competition Details</span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-4 pl-7">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div className="flex items-center space-x-2">
                                <Calendar className="h-4 w-4 text-zinc-400" />
                                <span className="text-zinc-300">
                                  Start:{" "}
                                  {rec.details.startDate
                                    ? formatDate(rec.details.startDate)
                                    : "TBD"}
                                </span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Calendar className="h-4 w-4 text-zinc-400" />
                                <span className="text-zinc-300">
                                  End:{" "}
                                  {rec.details.endDate ? formatDate(rec.details.endDate) : "TBD"}
                                </span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <MapPin className="h-4 w-4 text-zinc-400" />
                                <span className="text-zinc-300">
                                  {rec.details.location || "Online"}
                                </span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Users className="h-4 w-4 text-zinc-400" />
                                <span className="text-zinc-300">
                                  by {rec.details.organizer || "TBD"}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <ExternalLink className="h-4 w-4 text-zinc-400" />
                              <a
                                href={rec.details.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-400 hover:underline"
                              >
                                {rec.details.website || "Visit Website"}
                              </a>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="preparation" className="border-zinc-800">
                        <AccordionTrigger className="text-white hover:no-underline">
                          <div className="flex items-center space-x-2">
                            <BookOpen className="h-5 w-5" />
                            <span>Preparation Tips</span>
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

                    <div className="mt-4 flex justify-end">
                      <Button
                        size="sm"
                        className="border border-zinc-700 bg-zinc-800 text-white hover:bg-zinc-700"
                        disabled={rec.applied}
                      >
                        <ExternalLink className="mr-2 h-4 w-4" />
                        {rec.applied ? "Already Applied" : "View Details"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Enhanced Sidebar - Analytics */}
        <div className="space-y-6">
          {/* Skills Comparison Chart */}
          <Card
            className={`border-zinc-800 bg-zinc-900 transition-all ${
              selectedCompetition ? "ring-1 ring-blue-500/20" : ""
            }`}
          >
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-white">
                <div className="flex items-center space-x-2">
                  <Radar className="h-5 w-5" />
                  <span>Skills Comparison</span>
                </div>
                {selectedCompetition && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs text-zinc-400 hover:text-white"
                    onClick={() => setSelectedCompetition(null)}
                  >
                    Reset View
                  </Button>
                )}
              </CardTitle>
              <CardDescription className="text-zinc-400">
                {selectedCompetition
                  ? `Comparing your skills with ${selectedCompetition.competition} requirements`
                  : "Your current skills profile"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center">
                <ComparisonSpiderChart
                  studentData={studentSkillsData}
                  competitionData={selectedCompetition ? competitionSkillsData : undefined}
                  size={300}
                  showOnlyStudent={!selectedCompetition}
                />
              </div>
            </CardContent>
          </Card>

          {/* Skills Profile Breakdown */}
          <Card className="border-zinc-800 bg-zinc-900">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-white">
                <Brain className="h-5 w-5" />
                <span>Skills Profile Details</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(data.skillsProfileBreakdown).map(([skill, explanation]) => (
                  <div key={skill} className="rounded-lg bg-zinc-800 p-3">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-sm font-medium text-white">
                        {skill.replace("_", " ")}
                      </span>
                      <span className="font-medium text-blue-400">
                        {(data.skillsProfile[skill] * 10).toFixed(1)}/10
                      </span>
                    </div>
                    <TypographyP className="text-xs text-zinc-400">{explanation}</TypographyP>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Category Distribution */}
          <Card className="border-zinc-800 bg-zinc-900">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-white">
                <PieChart className="h-5 w-5" />
                <span>Category Interest Distribution</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CategoryDistributionChart data={data.categoryDistribution} />
            </CardContent>
          </Card>

          {/* Profile Strength Analysis */}
          <Card className="border-zinc-800 bg-zinc-900">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-white">
                <Target className="h-5 w-5" />
                <span>Profile Strength</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-300">Overall Score</span>
                    <span className="font-medium text-white">
                      {(data.profileStrength.score * 10).toFixed(1)}/10
                    </span>
                  </div>
                  <Progress value={data.profileStrength.score * 100} className="h-2" />
                </div>

                <div className="text-xs text-zinc-400">
                  {data.profileStrength.calculationExplanation}
                </div>

                <div className="space-y-3">
                  <div>
                    <TypographyH3 className="mb-2 text-sm text-white">Strengths</TypographyH3>
                    <div className="space-y-2">
                      {data.profileStrength.strengths.map((strength) => (
                        <div key={strength} className="flex items-start space-x-2">
                          <div className="mt-1 h-1.5 w-1.5 rounded-full bg-green-500" />
                          <TypographyP className="text-sm text-zinc-300">{strength}</TypographyP>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <TypographyH3 className="mb-2 text-sm text-white">
                      Areas for Improvement
                    </TypographyH3>
                    <div className="space-y-2">
                      {data.profileStrength.weaknesses.map((weakness) => (
                        <div key={weakness} className="flex items-start space-x-2">
                          <div className="mt-1 h-1.5 w-1.5 rounded-full bg-yellow-500" />
                          <TypographyP className="text-sm text-zinc-300">{weakness}</TypographyP>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Development Resources */}
          <Card className="border-zinc-800 bg-zinc-900">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-white">
                <Lightbulb className="h-5 w-5" />
                <span>Development Resources</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.developmentSuggestions.map((suggestion) => {
                  let icon;
                  if (suggestion.type === "course") {
                    icon = <BookOpen className="h-4 w-4 text-blue-500" />;
                  } else if (suggestion.type === "community") {
                    icon = <Users className="h-4 w-4 text-purple-500" />;
                  } else {
                    icon = <Code2 className="h-4 w-4 text-green-500" />;
                  }

                  return (
                    <div key={suggestion.link} className="rounded-lg bg-zinc-800 p-3">
                      <div className="flex items-center space-x-2">
                        {icon}
                        <TypographyH3 className="text-sm text-white">
                          {suggestion.title}
                        </TypographyH3>
                      </div>
                      {suggestion.platform && (
                        <TypographyP className="mt-1 text-xs text-zinc-500">
                          Platform: {suggestion.platform}
                        </TypographyP>
                      )}
                      <TypographyP className="mt-1 text-sm text-zinc-400">
                        {suggestion.reason}
                      </TypographyP>
                      <a
                        href={suggestion.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 inline-flex items-center text-xs text-blue-400 hover:underline"
                      >
                        Visit Resource
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
  );
};

const MyRecommendationPage = () => {
  const { data, isLoading, error } = useMyRecomendation();
  const { createMyRecomendation, isCreating, error: createError } = usePostMyRecomendation();

  const handleStartAnalysis = () => {
    createMyRecomendation();
  };

  if (isCreating) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center space-y-6 text-center">
        <div className="rounded-full bg-zinc-800 p-6">
          <Activity className="h-12 w-12 animate-spin text-zinc-400" />
        </div>
        <div className="space-y-2">
          <TypographyH2 className="text-2xl">Menganalisis Profil Anda</TypographyH2>
          <TypographyP className="max-w-md">
            Mohon tunggu sebentar, kami sedang menganalisis profil Anda untuk memberikan rekomendasi
            yang sesuai...
          </TypographyP>
        </div>
      </div>
    );
  }

  if (createError) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center space-y-6 text-center">
        <div className="rounded-full bg-zinc-800 p-6">
          <Activity className="h-12 w-12 text-zinc-400" />
        </div>
        <div className="space-y-2">
          <TypographyH2 className="text-2xl">
            Gagal Membuat Rekomendasi: <br />
            <span>{createError}</span>
          </TypographyH2>
        </div>
        <Button
          onClick={handleStartAnalysis}
          className="cursor-pointer border border-zinc-700 bg-zinc-800 text-white hover:bg-zinc-700"
        >
          <Activity className="mr-2 h-4 w-4" />
          Coba Lagi
        </Button>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-black p-6">
        <div className="mx-auto max-w-7xl">
          <EmptyState onStartAnalysis={handleStartAnalysis} isCreating={isCreating} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center space-y-6 text-center">
        <div className="rounded-full bg-zinc-800 p-6">
          <Activity className="h-12 w-12 text-zinc-400" />
        </div>
        <div className="space-y-2">
          <TypographyH2 className="text-2xl">Gagal Memuat Rekomendasi</TypographyH2>
          <TypographyP className="max-w-md">
            <span className="text-red-500">
              {error instanceof Error ? error.message : "Terjadi kesalahan saat memuat rekomendasi"}
            </span>
          </TypographyP>
        </div>
        <Button
          onClick={handleStartAnalysis}
          className="cursor-pointer border border-zinc-700 bg-zinc-800 text-white hover:bg-zinc-700"
        >
          <Activity className="mr-2 h-4 w-4" />
          Coba Lagi
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black p-6">
      <div className="mx-auto max-w-7xl">
        {isLoading && (
          <div className="flex min-h-[60vh] flex-col items-center justify-center space-y-6 text-center">
            <div className="rounded-full bg-zinc-800 p-6">
              <Activity className="h-12 w-12 animate-spin text-zinc-400" />
            </div>
            <div className="space-y-2">
              <TypographyH2 className="text-2xl">Memuat Rekomendasi</TypographyH2>
              <TypographyP className="max-w-md">
                Mohon tunggu sebentar, kami sedang memuat rekomendasi Anda...
              </TypographyP>
            </div>
          </div>
        )}
        {!isLoading && data && <RecommendationContent data={data} />}
        {!isLoading && !data && (
          <EmptyState onStartAnalysis={handleStartAnalysis} isCreating={isCreating} />
        )}
      </div>
    </div>
  );
};

export default MyRecommendationPage;
