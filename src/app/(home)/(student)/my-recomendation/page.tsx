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
} from "lucide-react";
import { useState, useEffect } from "react";

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

// Types based on OpenAPI specification
interface CompetitionRecommendation {
  id: number;
  competition: string;
  match_score: number;
  reason: string;
  skill_distribution: Record<string, number>;
  rank: number;
  details: {
    start_date: string;
    end_date: string;
    location: string;
    organizer: string;
  };
  applied: boolean;
}

interface RecommendationResponse {
  recommendations: CompetitionRecommendation[];
  skills_profile: Record<string, number>;
  category_distribution: Record<string, number>;
  performance_metrics: {
    participation_rate: number;
    avg_match_score: number;
  };
}

// Mock data matching API response structure
const mockApiResponse: RecommendationResponse = {
  recommendations: [
    {
      id: 1,
      competition: "Hackathon ZIA 2024",
      match_score: 0.87,
      reason:
        "Kompetisi ini sesuai karena Anda memiliki minat di bidang AI dan Pemrograman, serta IPK Anda (3.7) memenuhi persyaratan minimum (3.0). Pengalaman alumni menunjukkan mahasiswa dengan profil serupa sering berhasil di kompetisi ini.",
      skill_distribution: {
        AI: 0.7,
        Pemrograman: 0.6,
        Desain: 0.3,
      },
      rank: 1,
      details: {
        start_date: "2025-06-01",
        end_date: "2025-06-05",
        location: "Online",
        organizer: "ZIA Tech",
      },
      applied: false,
    },
    {
      id: 2,
      competition: "Business Plan Competition",
      match_score: 0.62,
      reason:
        "Kompetisi ini cukup sesuai karena Anda memiliki minat sekunder di bidang Bisnis, meskipun keterampilan utama Anda adalah AI dan Pemrograman. IPK Anda juga memenuhi syarat, tetapi pengalaman di bidang bisnis masih terbatas berdasarkan data Anda.",
      skill_distribution: {
        Bisnis: 0.5,
        Pemrograman: 0.4,
        Desain: 0.2,
      },
      rank: 2,
      details: {
        start_date: "2025-07-01",
        end_date: "2025-07-10",
        location: "Surabaya",
        organizer: "KADIN",
      },
      applied: true,
    },
    {
      id: 3,
      competition: "UI/UX Design Challenge 2024",
      match_score: 0.75,
      reason:
        "Kompetisi desain ini cocok dengan minat Anda di bidang UI/UX. Meskipun bukan keahlian utama, pengalaman Anda dalam pemrograman akan membantu dalam memahami aspek teknis dari desain aplikasi.",
      skill_distribution: {
        Desain: 0.8,
        UI_UX: 0.7,
        Pemrograman: 0.4,
      },
      rank: 3,
      details: {
        start_date: "2025-05-15",
        end_date: "2025-05-20",
        location: "Jakarta",
        organizer: "Design Community",
      },
      applied: false,
    },
  ],
  skills_profile: {
    AI: 0.7,
    Pemrograman: 0.6,
    Desain: 0.3,
    Bisnis: 0.2,
    UI_UX: 0.4,
  },
  category_distribution: {
    Teknologi: 0.6,
    Desain: 0.25,
    Bisnis: 0.15,
  },
  performance_metrics: {
    participation_rate: 0.65,
    avg_match_score: 0.78,
  },
};

interface SpiderChartDataPoint {
  label: string;
  value: number;
}

// Spider Chart Component
const SpiderChart = ({ data, size = 200 }: { data: SpiderChartDataPoint[]; size?: number }) => {
  const center = size / 2;
  const radius = size / 2 - 20;
  const angleStep = (2 * Math.PI) / data.length;

  // Generate pentagon points for background
  const backgroundPoints = Array.from({ length: data.length }, (_, i) => {
    const angle = i * angleStep - Math.PI / 2;
    return {
      x: center + Math.cos(angle) * radius,
      y: center + Math.sin(angle) * radius,
    };
  });

  // Generate data points
  const dataPoints = data.map((item, i) => {
    const angle = i * angleStep - Math.PI / 2;
    const value = item.value * radius;
    return {
      x: center + Math.cos(angle) * value,
      y: center + Math.sin(angle) * value,
      label: item.label,
      value: item.value,
    };
  });

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

        {/* Data area */}
        <polygon
          points={dataPoints.map((point) => `${point.x},${point.y}`).join(" ")}
          fill="rgb(59 130 246)"
          fillOpacity={0.2}
          stroke="rgb(59 130 246)"
          strokeWidth="2"
        />

        {/* Data points */}
        {dataPoints.map((point, pointIndex) => (
          <circle
            key={`point-${pointIndex}`}
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
      {dataPoints.map((point, labelIndex) => {
        const labelAngle = labelIndex * angleStep - Math.PI / 2;
        const labelRadius = radius + 15;
        const labelX = center + Math.cos(labelAngle) * labelRadius;
        const labelY = center + Math.sin(labelAngle) * labelRadius;

        return (
          <div
            key={`label-${labelIndex}`}
            className="absolute text-xs font-medium text-zinc-300"
            style={{
              left: labelX - 25,
              top: labelY - 10,
              width: 50,
              textAlign: "center",
            }}
          >
            {point.label}
            <div className="text-xs font-bold text-white">{Math.round(point.value * 100)}%</div>
          </div>
        );
      })}
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

// Helper function to get skill tags from skill distribution
const getSkillTags = (skillDistribution: Record<string, number>) =>
  Object.entries(skillDistribution)
    .filter(([_, value]) => value > 0.3) // Only show skills with >30% relevance
    .sort(([_, a], [__, b]) => b - a) // Sort by relevance
    .map(([skill, _]) => skill.replace("_", "/"));

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
      className="border border-zinc-700 bg-zinc-800 text-white hover:bg-zinc-700"
    >
      <Activity className="mr-2 h-4 w-4" />
      Start Profile Analysis
    </Button>
  </div>
);

// Main Content Component
const RecommendationContent = ({ data }: { data: RecommendationResponse }) => {
  // Convert skills_profile to spider chart format
  const skillsChartData: SpiderChartDataPoint[] = Object.entries(data.skills_profile).map(
    ([skill, value]) => ({
      label: skill.replace("_", "/"),
      value,
    })
  );

  // Convert category_distribution to progress format
  const categoryData = Object.entries(data.category_distribution).map(([category, value]) => ({
    name: category,
    value: Math.round(value * 100),
    color: "bg-blue-500", // You can customize colors based on category
  }));

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <TypographyH1 className="text-3xl md:text-4xl">
              Competition{" "}
              <span className="bg-gradient-to-r from-zinc-400 via-white to-zinc-500 bg-clip-text text-transparent">
                Recommendations
              </span>
            </TypographyH1>
            <TypographyP className="mt-2">
              Personalized competitions based on your{" "}
              <TypographyEmphasis>profile and preferences</TypographyEmphasis>
            </TypographyP>
          </div>
          <Button className="border border-zinc-700 bg-zinc-800 text-white hover:bg-zinc-700">
            <Activity className="mr-2 h-4 w-4" />
            Refresh Analysis
          </Button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <Card className="border-zinc-800 bg-zinc-900">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Trophy className="h-5 w-5 text-yellow-500" />
                <div>
                  <TypographyMuted>Total Recommendations</TypographyMuted>
                  <TypographyLarge className="text-white">
                    {data.recommendations.length}
                  </TypographyLarge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-zinc-800 bg-zinc-900">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-green-500" />
                <div>
                  <TypographyMuted>Average Match</TypographyMuted>
                  <TypographyLarge className="text-white">
                    {Math.round(data.performance_metrics.avg_match_score * 100)}%
                  </TypographyLarge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-zinc-800 bg-zinc-900">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5 text-blue-500" />
                <div>
                  <TypographyMuted>Categories Matched</TypographyMuted>
                  <TypographyLarge className="text-white">
                    {Object.keys(data.category_distribution).length}
                  </TypographyLarge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-zinc-800 bg-zinc-900">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Award className="h-5 w-5 text-purple-500" />
                <div>
                  <TypographyMuted>Participation Rate</TypographyMuted>
                  <TypographyLarge className="text-white">
                    {Math.round(data.performance_metrics.participation_rate * 100)}%
                  </TypographyLarge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
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
                  className="border-zinc-800 bg-zinc-900 transition-colors hover:border-zinc-700"
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
                        {Math.round(rec.match_score * 100)}% Match
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Skill Distribution Tags */}
                      <div className="flex flex-wrap gap-2">
                        {getSkillTags(rec.skill_distribution).map((skill, skillIndex) => (
                          <Badge key={skillIndex} variant="secondary">
                            {skill}
                          </Badge>
                        ))}
                      </div>

                      {/* Details Grid */}
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4 text-zinc-400" />
                          <span className="text-zinc-300">
                            Start: {formatDate(rec.details.start_date)}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4 text-zinc-400" />
                          <span className="text-zinc-300">
                            End: {formatDate(rec.details.end_date)}
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

                      {/* Skill Distribution Chart */}
                      <div className="space-y-2 rounded-lg bg-zinc-800 p-3">
                        <div className="text-xs text-zinc-400">Skill Relevance:</div>
                        <div className="space-y-2">
                          {Object.entries(rec.skill_distribution).map(([skill, value]) => (
                            <div key={skill} className="space-y-1">
                              <div className="flex justify-between text-xs">
                                <span className="text-zinc-300">{skill.replace("_", "/")}</span>
                                <span className="text-zinc-300">{Math.round(value * 100)}%</span>
                              </div>
                              <Progress value={value * 100} className="h-1" />
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          className="border border-zinc-700 bg-zinc-800 text-white hover:bg-zinc-700"
                          disabled={rec.applied}
                        >
                          <ExternalLink className="mr-2 h-4 w-4" />
                          {rec.applied ? "Already Applied" : "View Details"}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar - Analytics */}
        <div className="space-y-6">
          {/* Skills Profile Spider Chart */}
          <Card className="border-zinc-800 bg-zinc-900">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-white">
                <Radar className="h-5 w-5" />
                <span>Skills Profile</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center">
                <SpiderChart data={skillsChartData} size={200} />
              </div>
            </CardContent>
          </Card>

          {/* Category Distribution */}
          <Card className="border-zinc-800 bg-zinc-900">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-white">
                <PieChart className="h-5 w-5" />
                <span>Category Distribution</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {categoryData.map((category, categoryIndex) => (
                  <div key={categoryIndex} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-zinc-300">{category.name}</span>
                      <span className="font-medium text-white">{category.value}%</span>
                    </div>
                    <Progress value={category.value} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Performance Metrics */}
          <Card className="border-zinc-800 bg-zinc-900">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-white">
                <BarChart3 className="h-5 w-5" />
                <span>Performance Metrics</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-300">Average Match Score</span>
                    <span className="font-medium text-white">
                      {Math.round(data.performance_metrics.avg_match_score * 100)}%
                    </span>
                  </div>
                  <Progress
                    value={data.performance_metrics.avg_match_score * 100}
                    className="h-2"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-300">Participation Rate</span>
                    <span className="font-medium text-white">
                      {Math.round(data.performance_metrics.participation_rate * 100)}%
                    </span>
                  </div>
                  <Progress
                    value={data.performance_metrics.participation_rate * 100}
                    className="h-2"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
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
