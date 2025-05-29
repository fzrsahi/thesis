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
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import Button from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

// Mock data untuk demonstrasi
const mockRecommendations = [
  {
    id: 1,
    title: "Hackathon AI Innovation 2024",
    category: "Technology",
    difficulty: "Advanced",
    matchScore: 95,
    deadline: "2024-02-15",
    location: "Jakarta",
    prize: "Rp 50,000,000",
    participants: 500,
    description: "Kompetisi pengembangan AI untuk solusi smart city",
    tags: ["AI", "Machine Learning", "Smart City"],
    organizer: "Tech Indonesia",
  },
  {
    id: 2,
    title: "Business Plan Competition",
    category: "Business",
    difficulty: "Intermediate",
    matchScore: 87,
    deadline: "2024-03-01",
    location: "Bandung",
    prize: "Rp 25,000,000",
    participants: 300,
    description: "Kompetisi rencana bisnis untuk startup teknologi",
    tags: ["Business", "Startup", "Innovation"],
    organizer: "Startup Hub",
  },
  {
    id: 3,
    title: "UI/UX Design Challenge",
    category: "Design",
    difficulty: "Beginner",
    matchScore: 78,
    deadline: "2024-02-28",
    location: "Online",
    prize: "Rp 15,000,000",
    participants: 200,
    description: "Desain aplikasi mobile untuk e-commerce",
    tags: ["UI/UX", "Mobile", "E-commerce"],
    organizer: "Design Community",
  },
];

const mockStats = {
  totalRecommendations: 12,
  averageMatch: 85,
  categoriesMatched: 5,
  successRate: 73,
};

const categoryData = [
  { name: "Technology", value: 40, color: "bg-blue-500" },
  { name: "Business", value: 25, color: "bg-green-500" },
  { name: "Design", value: 20, color: "bg-purple-500" },
  { name: "Science", value: 10, color: "bg-yellow-500" },
  { name: "Others", value: 5, color: "bg-gray-500" },
];

// Student stats data for spider chart
const studentStats = [
  { label: "Technical", value: 85 },
  { label: "Leadership", value: 78 },
  { label: "Creativity", value: 92 },
  { label: "Teamwork", value: 88 },
  { label: "Communication", value: 75 },
];

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
  const backgroundPoints = Array.from({ length: 5 }, (_, i) => {
    const angle = i * angleStep - Math.PI / 2;
    return {
      x: center + Math.cos(angle) * radius,
      y: center + Math.sin(angle) * radius,
    };
  });

  // Generate data points
  const dataPoints = data.map((item, i) => {
    const angle = i * angleStep - Math.PI / 2;
    const value = (item.value / 100) * radius;
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
            className="absolute text-xs text-zinc-300"
            style={{
              left: labelX - 25,
              top: labelY - 10,
              width: 50,
              textAlign: "center",
            }}
          >
            <div className="font-medium">{point.label}</div>
            <div className="text-zinc-400">{point.value}%</div>
          </div>
        );
      })}
    </div>
  );
};

// Empty State Component
const EmptyState = ({ onStartAnalysis }: { onStartAnalysis: () => void }) => (
  <div className="flex min-h-[60vh] flex-col items-center justify-center space-y-6 text-center">
    <div className="rounded-full bg-zinc-800/50 p-6">
      <Target className="h-16 w-16 text-zinc-400" />
    </div>

    <div className="space-y-2">
      <h2 className="text-2xl font-bold text-white">Belum Ada Rekomendasi</h2>
      <p className="max-w-md text-zinc-400">
        Anda belum mencoba fitur rekomendasi kami. Lengkapi profil Anda untuk mendapatkan
        rekomendasi lomba yang sesuai dengan minat dan kemampuan Anda.
      </p>
    </div>

    <div className="flex flex-col gap-4 sm:flex-row">
      <Button onClick={onStartAnalysis} className="bg-white text-black hover:bg-zinc-200">
        <Activity className="mr-2 h-4 w-4" />
        Mulai Analisis Profil
      </Button>
    </div>

    <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
      <Card className="border-zinc-800 bg-zinc-900/50">
        <CardContent className="p-4 text-center">
          <Trophy className="mx-auto mb-2 h-8 w-8 text-yellow-500" />
          <p className="text-sm text-zinc-400">Rekomendasi Personal</p>
        </CardContent>
      </Card>
      <Card className="border-zinc-800 bg-zinc-900/50">
        <CardContent className="p-4 text-center">
          <BarChart3 className="mx-auto mb-2 h-8 w-8 text-blue-500" />
          <p className="text-sm text-zinc-400">Analisis Kemampuan</p>
        </CardContent>
      </Card>
      <Card className="border-zinc-800 bg-zinc-900/50">
        <CardContent className="p-4 text-center">
          <TrendingUp className="mx-auto mb-2 h-8 w-8 text-green-500" />
          <p className="text-sm text-zinc-400">Tracking Progress</p>
        </CardContent>
      </Card>
    </div>
  </div>
);

// Recommendation Content Component
const RecommendationContent = () => (
  <div className="space-y-6">
    {/* Header */}
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold text-white">Rekomendasi Lomba</h1>
        <p className="text-zinc-300">Lomba yang cocok berdasarkan profil dan minat Anda</p>
      </div>
      <Button className="bg-white text-black hover:bg-zinc-200">
        <Activity className="mr-2 h-4 w-4" />
        Refresh Rekomendasi
      </Button>
    </div>

    {/* Stats Overview */}
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Card className="border-zinc-800 bg-zinc-900">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-zinc-300">Total Rekomendasi</p>
              <p className="text-2xl font-bold text-white">{mockStats.totalRecommendations}</p>
            </div>
            <Trophy className="h-8 w-8 text-yellow-500" />
          </div>
        </CardContent>
      </Card>

      <Card className="border-zinc-800 bg-zinc-900">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-zinc-300">Rata-rata Match</p>
              <p className="text-2xl font-bold text-white">{mockStats.averageMatch}%</p>
            </div>
            <Target className="h-8 w-8 text-blue-500" />
          </div>
        </CardContent>
      </Card>

      <Card className="border-zinc-800 bg-zinc-900">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-zinc-300">Kategori Cocok</p>
              <p className="text-2xl font-bold text-white">{mockStats.categoriesMatched}</p>
            </div>
            <PieChart className="h-8 w-8 text-purple-500" />
          </div>
        </CardContent>
      </Card>

      <Card className="border-zinc-800 bg-zinc-900">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-zinc-300">Success Rate</p>
              <p className="text-2xl font-bold text-white">{mockStats.successRate}%</p>
            </div>
            <TrendingUp className="h-8 w-8 text-green-500" />
          </div>
        </CardContent>
      </Card>
    </div>

    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      {/* Recommendations List */}
      <div className="lg:col-span-2">
        <Card className="border-zinc-800 bg-zinc-900">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Award className="h-5 w-5" />
              Rekomendasi Teratas
            </CardTitle>
            <CardDescription className="text-zinc-300">
              Lomba dengan tingkat kesesuaian tertinggi untuk profil Anda
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {mockRecommendations.map((rec) => (
              <div
                key={rec.id}
                className="rounded-lg border border-zinc-800 bg-zinc-800/50 p-4 transition-colors hover:bg-zinc-800/70"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-white">{rec.title}</h3>
                      <Badge
                        variant="secondary"
                        className={cn(
                          "text-xs",
                          rec.matchScore >= 90
                            ? "bg-green-500/20 text-green-400"
                            : rec.matchScore >= 80
                              ? "bg-yellow-500/20 text-yellow-400"
                              : "bg-blue-500/20 text-blue-400"
                        )}
                      >
                        {rec.matchScore}% Match
                      </Badge>
                    </div>

                    <p className="text-sm text-zinc-300">{rec.description}</p>

                    <div className="flex flex-wrap gap-1">
                      {rec.tags.map((tag, tagIndex) => (
                        <Badge
                          key={`${rec.id}-tag-${tagIndex}`}
                          variant="outline"
                          className="border-zinc-700 text-xs text-zinc-300"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex flex-wrap gap-4 text-xs text-zinc-300">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {rec.deadline}
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {rec.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <Trophy className="h-3 w-3" />
                        {rec.prize}
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {rec.participants} peserta
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <Progress value={rec.matchScore} className="w-20" />
                    <Button size="sm" className="bg-white text-black hover:bg-zinc-200">
                      <ExternalLink className="mr-1 h-3 w-3" />
                      Detail
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Analytics Sidebar */}
      <div className="space-y-6">
        {/* Student Skills Spider Chart */}
        <Card className="border-zinc-800 bg-zinc-900">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Radar className="h-5 w-5" />
              Profil Kemampuan
            </CardTitle>
            <CardDescription className="text-zinc-300">
              Analisis skill berdasarkan aktivitas Anda
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <SpiderChart data={studentStats} size={220} />
          </CardContent>
        </Card>

        {/* Category Distribution */}
        <Card className="border-zinc-800 bg-zinc-900">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <PieChart className="h-5 w-5" />
              Distribusi Kategori
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {categoryData.map((category, categoryIndex) => (
              <div key={`category-${categoryIndex}`} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-200">{category.name}</span>
                  <span className="text-zinc-300">{category.value}%</span>
                </div>
                <div className="h-2 rounded-full bg-zinc-800">
                  <div
                    className={cn("h-full rounded-full", category.color)}
                    style={{ width: `${category.value}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Performance Metrics */}
        <Card className="border-zinc-800 bg-zinc-900">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <BarChart3 className="h-5 w-5" />
              Metrik Performa
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-zinc-200">Skill Match</span>
                <span className="text-zinc-300">92%</span>
              </div>
              <Progress value={92} className="h-2" />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-zinc-200">Interest Alignment</span>
                <span className="text-zinc-300">88%</span>
              </div>
              <Progress value={88} className="h-2" />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-zinc-200">Experience Level</span>
                <span className="text-zinc-300">75%</span>
              </div>
              <Progress value={75} className="h-2" />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-zinc-200">Availability</span>
                <span className="text-zinc-300">95%</span>
              </div>
              <Progress value={95} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
);

const MyRecommendationPage = () => {
  const [hasRecommendations, setHasRecommendations] = useState(true); // Set to true untuk melihat content

  return (
    <div>
      {hasRecommendations ? (
        <RecommendationContent />
      ) : (
        <EmptyState onStartAnalysis={() => setHasRecommendations(true)} />
      )}
    </div>
  );
};

export default MyRecommendationPage;
