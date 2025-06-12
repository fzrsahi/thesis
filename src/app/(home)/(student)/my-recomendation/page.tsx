/* eslint-disable react/no-array-index-key */
/* eslint-disable no-nested-ternary */

"use client";

import {
  Trophy,
  TrendingUp,
  Users,
  Calendar,
  Award,
  Target,
  BarChart3,
  PieChart,
  Activity,
  MapPin,
  ExternalLink,
  Radar,
  Brain,
  Code2,
  Presentation,
  BookOpen,
  Lightbulb,
  ChevronDown,
  ChevronUp,
  ArrowRight,
} from "lucide-react";
import { useState, useEffect } from "react";

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

// Types based on the API response structure
interface SkillsProfileBreakdown {
  [key: string]: string;
}

interface CategoryDistribution {
  [key: string]: number;
}

interface PerformanceMetrics {
  participation_rate: number;
  avg_match_score: number;
  competition_success_rate: number;
  skill_growth: {
    [key: string]: string;
  };
}

interface CompetitionRecommendation {
  id: number;
  competition: string;
  match_score: number;
  match_score_breakdown: string;
  skill_distribution: Record<string, number>;
  skill_distribution_breakdown: Record<string, string>;
  rank: number;
  reason: string;
  details: {
    startDate: string;
    endDate: string;
    location: string;
    organizer: string;
    registration_deadline: string;
    website: string;
  };
  applied: boolean;
  preparation_tips: string[];
}

interface DevelopmentSuggestion {
  type: "course" | "community" | "resource";
  title?: string;
  name?: string;
  platform?: string;
  link: string;
  reason: string;
}

interface ProfileStrength {
  score: number;
  calculation_explanation: string;
  strengths: string[];
  weaknesses: string[];
}

interface RecommendationResponse {
  skills_profile: Record<string, number>;
  skills_profile_breakdown: SkillsProfileBreakdown;
  category_distribution: CategoryDistribution;
  performance_metrics: PerformanceMetrics;
  recommendations: CompetitionRecommendation[];
  development_suggestions: DevelopmentSuggestion[];
  profile_strength: ProfileStrength;
}

interface SpiderChartDataPoint {
  label: string;
  value: number;
  type?: "student" | "competition";
}

// Enhanced Spider Chart Component with Comparison
const ComparisonSpiderChart = ({
  studentData,
  competitionData,
  size = 300,
}: {
  studentData: SpiderChartDataPoint[];
  competitionData: SpiderChartDataPoint[];
  size?: number;
}) => {
  // Get all unique skills from both student and competition data
  const allSkills = Array.from(
    new Set([
      ...studentData.map((item) => item.label),
      ...competitionData.map((item) => item.label),
    ])
  );

  // Create normalized data points for both student and competition
  const normalizedStudentData = allSkills.map((skill) => {
    const studentPoint = studentData.find((item) => item.label === skill);
    return {
      label: skill,
      value: studentPoint?.value || 0,
      type: "student" as const,
    };
  });

  const normalizedCompetitionData = allSkills.map((skill) => {
    const competitionPoint = competitionData.find((item) => item.label === skill);
    return {
      label: skill,
      value: competitionPoint?.value || 0,
      type: "competition" as const,
    };
  });

  const center = size / 2;
  const radius = size / 2 - 30;
  const angleStep = (2 * Math.PI) / allSkills.length;

  // Generate pentagon points for background
  const backgroundPoints = Array.from({ length: allSkills.length }, (_, i) => {
    const angle = i * angleStep - Math.PI / 2;
    return {
      x: center + Math.cos(angle) * radius,
      y: center + Math.sin(angle) * radius,
    };
  });

  // Generate data points for both student and competition
  const generateDataPoints = (data: SpiderChartDataPoint[]) =>
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
  const competitionPoints = generateDataPoints(normalizedCompetitionData);

  return (
    <div className="relative">
      <svg width={size} height={size} className="overflow-visible">
        {/* Background grid */}
        {[0.2, 0.4, 0.6, 0.8, 1].map((scale, scaleIndex) => (
          <polygon
            key={`scale-${scaleIndex}`}
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
        {backgroundPoints.map((point, pointIndex) => (
          <line
            key={`line-${pointIndex}`}
            x1={center}
            y1={center}
            x2={point.x}
            y2={point.y}
            stroke="rgb(63 63 70)"
            strokeWidth="1"
            opacity={0.3}
          />
        ))}

        {/* Competition area */}
        <polygon
          points={competitionPoints.map((point) => `${point.x},${point.y}`).join(" ")}
          fill="rgb(168 85 247)"
          fillOpacity={0.1}
          stroke="rgb(168 85 247)"
          strokeWidth="2"
          strokeDasharray="4"
        />

        {/* Student area */}
        <polygon
          points={studentPoints.map((point) => `${point.x},${point.y}`).join(" ")}
          fill="rgb(59 130 246)"
          fillOpacity={0.2}
          stroke="rgb(59 130 246)"
          strokeWidth="2"
        />

        {/* Competition points */}
        {competitionPoints.map((point, pointIndex) => (
          <circle
            key={`competition-point-${pointIndex}`}
            cx={point.x}
            cy={point.y}
            r="4"
            fill="rgb(168 85 247)"
            stroke="white"
            strokeWidth="2"
          />
        ))}

        {/* Student points */}
        {studentPoints.map((point, pointIndex) => (
          <circle
            key={`student-point-${pointIndex}`}
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
            key={`label-${labelIndex}`}
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
              <span className="text-purple-400">
                Req:{" "}
                {competitionPoints[labelIndex]
                  ? (competitionPoints[labelIndex].value * 10).toFixed(1)
                  : "0.0"}
              </span>
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
        <div className="flex items-center space-x-2">
          <div className="h-2 w-2 rounded-full bg-purple-500" />
          <span className="text-zinc-300">Required Skills</span>
        </div>
      </div>
    </div>
  );
};

// Helper function to format date
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
};

// Helper function to get match score color
const getMatchScoreColor = (score: number) => {
  if (score >= 0.8) return "bg-green-500";
  if (score >= 0.6) return "bg-yellow-500";
  return "bg-red-500";
};

// Empty State Component
const EmptyState = ({ onStartAnalysis }: { onStartAnalysis: () => void }) => (
  <div className="flex min-h-[60vh] flex-col items-center justify-center space-y-6 text-center">
    <div className="rounded-full bg-zinc-800 p-6">
      <Target className="h-12 w-12 text-zinc-400" />
    </div>
    <div className="space-y-2">
      <TypographyH2 className="text-2xl">No Recommendations Yet</TypographyH2>
      <TypographyP className="max-w-md">
        Start analyzing your profile to get competition recommendations that match your
        <TypographyEmphasis> skills and interests</TypographyEmphasis>.
      </TypographyP>
    </div>
    <Button
      onClick={onStartAnalysis}
      className="cursor-pointer border border-zinc-700 bg-zinc-800 text-white hover:bg-zinc-700"
    >
      <Activity className="mr-2 h-4 w-4" />
      Start Profile Analysis
    </Button>
  </div>
);

// New component for category distribution
const CategoryDistributionChart = ({ data }: { data: CategoryDistribution }) => {
  const categories = Object.entries(data);
  const total = categories.reduce((sum, [, value]) => sum + value, 0);

  return (
    <div className="space-y-4">
      {categories.map(([category, value], index) => {
        const percentage = (value / total) * 100;
        const colors = ["bg-blue-500", "bg-purple-500", "bg-green-500"];

        return (
          <div key={category} className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-zinc-300">{category}</span>
              <span className="font-medium text-white">{Math.round(percentage)}%</span>
            </div>
            <div className="h-2 rounded-full bg-zinc-800">
              <div
                className={`h-2 rounded-full ${colors[index % colors.length]}`}
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

// New component for performance metrics
const PerformanceMetricsCard = ({ metrics }: { metrics: PerformanceMetrics }) => (
  <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
    <div className="rounded-lg bg-zinc-800 p-4">
      <div className="flex items-center space-x-2">
        <Users className="h-5 w-5 text-blue-500" />
        <div>
          <TypographyMuted>Participation Rate</TypographyMuted>
          <TypographyLarge className="text-white">
            {(metrics.participation_rate * 10).toFixed(1)}/10
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
            {(metrics.avg_match_score * 10).toFixed(1)}/10
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
            {(metrics.competition_success_rate * 10).toFixed(1)}/10
          </TypographyLarge>
        </div>
      </div>
    </div>
  </div>
);

// Main Content Component
const RecommendationContent = ({ data }: { data: RecommendationResponse }) => {
  const [selectedCompetition, setSelectedCompetition] = useState<CompetitionRecommendation | null>(
    null
  );

  // Convert skills_profile to spider chart format
  const studentSkillsData: SpiderChartDataPoint[] = Object.entries(data.skills_profile).map(
    ([skill, value]) => ({
      label: skill.replace("_", " "),
      value,
      type: "student",
    })
  );

  // Get competition skills data when a competition is selected
  const competitionSkillsData: SpiderChartDataPoint[] = selectedCompetition
    ? Object.entries(selectedCompetition.skill_distribution).map(([skill, value]) => ({
        label: skill.replace("_", " "),
        value,
        type: "competition",
      }))
    : [];

  return (
    <div className="space-y-8">
      {/* Enhanced Header with Performance Metrics */}
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
            <PerformanceMetricsCard metrics={data.performance_metrics} />

            {/* Skill Growth Section */}
            <div className="mt-6">
              <TypographyH3 className="mb-3 text-white">Recent Skill Growth</TypographyH3>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                {Object.entries(data.performance_metrics.skill_growth).map(([skill, growth]) => (
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
        <div className="space-y-6 lg:col-span-2">
          <div>
            <TypographyH3 className="mb-4">Top Recommendations for You</TypographyH3>
            <div className="space-y-4">
              {data.recommendations.map((rec) => (
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
                        <CardDescription className="max-w-2xl text-zinc-400">
                          {rec.reason}
                        </CardDescription>
                      </div>
                      <Badge className={`ml-4 text-white ${getMatchScoreColor(rec.match_score)}`}>
                        {(rec.match_score * 10).toFixed(1)}/10 Match
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
                              {rec.match_score_breakdown}
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
                            {Object.entries(rec.skill_distribution_breakdown).map(
                              ([skill, explanation]) => (
                                <div key={skill} className="rounded-lg bg-zinc-800 p-3">
                                  <div className="mb-2 flex items-center justify-between">
                                    <span className="font-medium text-white">
                                      {skill.replace("_", " ")}
                                    </span>
                                    <span className="text-blue-400">
                                      {(rec.skill_distribution[skill] * 10).toFixed(1)}/10
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
                                  Start: {formatDate(rec.details.startDate)}
                                </span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Calendar className="h-4 w-4 text-zinc-400" />
                                <span className="text-zinc-300">
                                  End: {formatDate(rec.details.endDate)}
                                </span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <MapPin className="h-4 w-4 text-zinc-400" />
                                <span className="text-zinc-300">{rec.details.location}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Users className="h-4 w-4 text-zinc-400" />
                                <span className="text-zinc-300">by {rec.details.organizer}</span>
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
                                {rec.details.website}
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
                            {rec.preparation_tips.map((tip, index) => (
                              <div key={index} className="flex items-start space-x-2">
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
          <Card className="border-zinc-800 bg-zinc-900">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-white">
                <Radar className="h-5 w-5" />
                <span>Skills Comparison</span>
              </CardTitle>
              <CardDescription className="text-zinc-400">
                {selectedCompetition
                  ? `Comparing your skills with ${selectedCompetition.competition} requirements`
                  : "Select a competition to see skill comparison"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center">
                {selectedCompetition ? (
                  <ComparisonSpiderChart
                    studentData={studentSkillsData}
                    competitionData={competitionSkillsData}
                    size={300}
                  />
                ) : (
                  <div className="flex h-[300px] items-center justify-center text-zinc-400">
                    Select a competition to view skill comparison
                  </div>
                )}
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
                {Object.entries(data.skills_profile_breakdown).map(([skill, explanation]) => (
                  <div key={skill} className="rounded-lg bg-zinc-800 p-3">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-sm font-medium text-white">
                        {skill.replace("_", " ")}
                      </span>
                      <span className="font-medium text-blue-400">
                        {(data.skills_profile[skill] * 10).toFixed(1)}/10
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
              <CategoryDistributionChart data={data.category_distribution} />
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
                      {(data.profile_strength.score * 10).toFixed(1)}/10
                    </span>
                  </div>
                  <Progress value={data.profile_strength.score * 100} className="h-2" />
                </div>

                <div className="text-xs text-zinc-400">
                  {data.profile_strength.calculation_explanation}
                </div>

                <div className="space-y-3">
                  <div>
                    <TypographyH3 className="mb-2 text-sm text-white">Strengths</TypographyH3>
                    <div className="space-y-2">
                      {data.profile_strength.strengths.map((strength, index) => (
                        <div key={index} className="flex items-start space-x-2">
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
                      {data.profile_strength.weaknesses.map((weakness, index) => (
                        <div key={index} className="flex items-start space-x-2">
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
                {data.development_suggestions.map((suggestion, index) => (
                  <div key={index} className="rounded-lg bg-zinc-800 p-3">
                    <div className="flex items-center space-x-2">
                      {suggestion.type === "course" ? (
                        <BookOpen className="h-4 w-4 text-blue-500" />
                      ) : suggestion.type === "community" ? (
                        <Users className="h-4 w-4 text-purple-500" />
                      ) : (
                        <Code2 className="h-4 w-4 text-green-500" />
                      )}
                      <TypographyH3 className="text-sm text-white">
                        {suggestion.title || suggestion.name}
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
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

// Update mock data with new structure
const mockApiResponse: RecommendationResponse = {
  skills_profile: {
    technical_expertise: 0.78,
    scientific_writing: 0.65,
    problem_solving: 0.82,
    creativity_innovation: 0.7,
    communication: 0.6,
    teamwork_collaboration: 0.75,
    project_management: 0.68,
    business_acumen: 0.5,
    design_thinking: 0.58,
    self_learning: 0.9,
  },
  skills_profile_breakdown: {
    technical_expertise:
      "Dihitung dari penguasaan AI (0.85), pemrograman (0.75), dan data science (0.65). Rata-rata tertimbang: 0.78.",
    scientific_writing:
      "Berdasarkan pengalaman lomba karya tulis ilmiah dan publikasi tugas akhir.",
    problem_solving:
      "Tingkat tinggi karena partisipasi lomba algoritma dan penyelesaian masalah teknikal di proyek nyata.",
    creativity_innovation: "Aktif membuat ide orisinil saat hackathon dan proyek kampus.",
    communication: "Cukup baik dalam presentasi kelompok dan penjelasan dokumentasi proyek.",
    teamwork_collaboration: "Berperan aktif dalam tim magang dan lomba kelompok.",
    project_management:
      "Mampu mengelola alur proyek dan tugas tim dengan tools seperti Trello dan GitHub.",
    business_acumen:
      "Masih berkembang, sudah mengenal dasar BMC dan validasi ide saat magang startup.",
    design_thinking: "Mampu menggunakan prinsip user-centric design dalam proyek UI/UX.",
    self_learning:
      "Menunjukkan adaptasi cepat dalam belajar teknologi baru melalui kursus daring dan eksplorasi mandiri.",
  },
  category_distribution: {
    Teknologi: 0.7,
    "Data Science": 0.2,
    Bisnis: 0.1,
  },
  performance_metrics: {
    participation_rate: 0.75,
    avg_match_score: 0.78,
    competition_success_rate: 0.33,
    skill_growth: {
      AI: "+0.15 (dari pengalaman asisten lab)",
      Pemrograman: "+0.1 (dari magang)",
    },
  },
  recommendations: [
    {
      id: 1,
      competition: "AI Innovation Challenge 2025",
      match_score: 0.92,
      match_score_breakdown:
        "Match score dihitung dengan rata-rata tertimbang dari: AI (0.85/0.9 * 0.9 = 0.85), Pemrograman (0.75/0.8 * 0.8 = 0.75), Data Science (0.65/0.7 * 0.7 = 0.65), Bisnis (0.4/0.2 * 0.2 = 0.2), Presentasi (0.3/0.4 * 0.4 = 0.3). Rata-rata: 0.75, disesuaikan naik menjadi 0.92 sesuai bobot lomba.",
      skill_distribution: {
        AI: 0.9,
        Pemrograman: 0.8,
        Data_Science: 0.7,
        Bisnis: 0.2,
        Presentasi: 0.4,
      },
      skill_distribution_breakdown: {
        AI: "Bobot tinggi karena lomba ini berfokus pada pengembangan solusi AI.",
        Pemrograman: "Diperlukan untuk membangun dan mengimplementasikan model.",
        Data_Science: "Dibutuhkan untuk analisis data dan evaluasi hasil.",
        Bisnis: "Relevansi rendah, tapi tetap dinilai untuk presentasi nilai bisnis proyek.",
        Presentasi: "Penting untuk pitching hasil kepada juri.",
      },
      rank: 1,
      reason:
        "Mahasiswa memiliki keahlian sangat relevan dengan fokus lomba, terutama di bidang AI dan pemrograman.",
      details: {
        startDate: "2025-08-10",
        endDate: "2025-08-15",
        location: "Online",
        organizer: "AI Indonesia Summit",
        registration_deadline: "2025-07-25",
        website: "https://ai-indonesia.org/challenge",
      },
      applied: false,
      preparation_tips: [
        "Tingkatkan kemampuan presentasi teknis melalui pelatihan pitching AI project.",
        "Latih dokumentasi dan deployment model AI menggunakan repositori terbuka.",
        "Ikuti simulasi lomba AI dari tahun-tahun sebelumnya untuk strategi dan studi kasus.",
      ],
    },
  ],
  development_suggestions: [
    {
      type: "course",
      title: "Machine Learning by Stanford Online",
      platform: "Coursera",
      link: "https://www.coursera.org/learn/machine-learning",
      reason: "Meningkatkan keahlian AI untuk persiapan lomba seperti AI Innovation Challenge.",
    },
  ],
  profile_strength: {
    score: 0.82,
    calculation_explanation:
      "Skor dihitung dari bobot: IPK (3.7/4.0 * 0.25 = 0.231), Keterampilan (rata-rata 0.575 * 0.3 = 0.1725), Pengalaman (2 kegiatan relevan * 0.2 = 0.16), Prestasi (1 nasional * 0.15 = 0.15), Partisipasi (0.75 * 0.1 = 0.075). Total = 0.7885 ≈ 0.82.",
    strengths: [
      "Kuat di AI dan pemrograman.",
      "Pengalaman langsung di laboratorium dan industri.",
      "Memiliki prestasi nasional terkait teknologi.",
    ],
    weaknesses: [
      "Kemampuan presentasi publik masih rendah.",
      "Minim pengalaman di bidang bisnis dan validasi pasar.",
    ],
  },
};

const MyRecommendationPage = () => {
  const [hasRecommendations, setHasRecommendations] = useState(false);
  const [recommendationData, setRecommendationData] = useState<RecommendationResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchRecommendations = async () => {
    setIsLoading(true);
    try {
      // TODO: Replace with actual API call
      // const response = await fetch('/api/my-recommendation');
      // const data = await response.json();

      // For now, simulate API call with mock data
      // eslint-disable-next-line no-promise-executor-return
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setRecommendationData(mockApiResponse);
      setHasRecommendations(true);
    } catch (error) {
      console.error("Failed to fetch recommendations:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartAnalysis = () => {
    fetchRecommendations();
  };

  useEffect(() => {
    // Auto-fetch recommendations on component mount
    // fetchRecommendations();
  }, []);

  return (
    <div className="min-h-screen bg-black p-6">
      <div className="mx-auto max-w-7xl">
        {isLoading ? (
          <div className="flex min-h-[60vh] flex-col items-center justify-center space-y-6 text-center">
            <div className="rounded-full bg-zinc-800 p-6">
              <Activity className="h-12 w-12 animate-spin text-zinc-400" />
            </div>
            <div className="space-y-2">
              <TypographyH2 className="text-2xl">Analyzing Your Profile</TypographyH2>
              <TypographyP className="max-w-md">
                Please wait while we generate personalized recommendations for you...
              </TypographyP>
            </div>
          </div>
        ) : hasRecommendations && recommendationData ? (
          <RecommendationContent data={recommendationData} />
        ) : (
          <EmptyState onStartAnalysis={handleStartAnalysis} />
        )}
      </div>
    </div>
  );
};

export default MyRecommendationPage;
