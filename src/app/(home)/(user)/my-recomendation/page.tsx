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
import {
  TypographyH1,
  TypographyH2,
  TypographyH3,
  TypographyP,
  TypographyEmphasis,
  TypographyMuted,
  TypographyLarge,
} from "@/components/ui/typography";

// Mock data untuk demonstrasi berdasarkan schema Prisma
const mockRecommendations = [
  {
    id: 1,
    title: "Hackathon AI Innovation 2024",
    description: "Kompetisi pengembangan AI untuk solusi smart city",
    category: "TECHNOLOGY",
    difficulty: "ADVANCED",
    registrationStart: new Date("2024-01-15"),
    registrationEnd: new Date("2024-02-10"),
    eventStart: new Date("2024-02-15"),
    eventEnd: new Date("2024-02-17"),
    location: "Jakarta",
    maxParticipants: 500,
    currentParticipants: 350,
    prizes: [
      { position: 1, amount: 50000000, description: "Juara 1" },
      { position: 2, amount: 25000000, description: "Juara 2" },
      { position: 3, amount: 15000000, description: "Juara 3" },
    ],
    requirements: ["Mahasiswa aktif", "Tim 3-5 orang", "Pengalaman programming"],
    tags: ["AI", "Machine Learning", "Smart City"],
    organizer: "Tech Indonesia",
    isActive: true,
    matchScore: 95,
  },
  {
    id: 2,
    title: "Business Plan Competition",
    description: "Kompetisi rencana bisnis untuk startup teknologi",
    category: "BUSINESS",
    difficulty: "INTERMEDIATE",
    registrationStart: new Date("2024-01-20"),
    registrationEnd: new Date("2024-02-25"),
    eventStart: new Date("2024-03-01"),
    eventEnd: new Date("2024-03-03"),
    location: "Bandung",
    maxParticipants: 300,
    currentParticipants: 180,
    prizes: [
      { position: 1, amount: 25000000, description: "Juara 1" },
      { position: 2, amount: 15000000, description: "Juara 2" },
      { position: 3, amount: 10000000, description: "Juara 3" },
    ],
    requirements: ["Mahasiswa S1/S2", "Tim maksimal 4 orang", "Business plan lengkap"],
    tags: ["Business", "Startup", "Innovation"],
    organizer: "Startup Hub",
    isActive: true,
    matchScore: 87,
  },
  {
    id: 3,
    title: "UI/UX Design Challenge",
    description: "Desain aplikasi mobile untuk e-commerce",
    category: "DESIGN",
    difficulty: "BEGINNER",
    registrationStart: new Date("2024-01-10"),
    registrationEnd: new Date("2024-02-20"),
    eventStart: new Date("2024-02-28"),
    eventEnd: new Date("2024-03-01"),
    location: "Online",
    maxParticipants: 200,
    currentParticipants: 120,
    prizes: [
      { position: 1, amount: 15000000, description: "Juara 1" },
      { position: 2, amount: 10000000, description: "Juara 2" },
      { position: 3, amount: 5000000, description: "Juara 3" },
    ],
    requirements: ["Portfolio design", "Software design tools", "Presentasi"],
    tags: ["UI/UX", "Mobile", "E-commerce"],
    organizer: "Design Community",
    isActive: true,
    matchScore: 78,
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
            className="absolute text-xs font-medium text-zinc-300"
            style={{
              left: labelX - 25,
              top: labelY - 10,
              width: 50,
              textAlign: "center",
            }}
          >
            {point.label}
            <div className="text-xs font-bold text-white">{point.value}%</div>
          </div>
        );
      })}
    </div>
  );
};

// Helper function to format currency
const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);

// Helper function to format date
const formatDate = (date: Date) =>
  new Intl.DateTimeFormat("id-ID", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);

// Helper function to get difficulty badge color
const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case "BEGINNER":
      return "bg-green-500";
    case "INTERMEDIATE":
      return "bg-yellow-500";
    case "ADVANCED":
      return "bg-red-500";
    default:
      return "bg-gray-500";
  }
};

// Empty State Component
const EmptyState = ({ onStartAnalysis }: { onStartAnalysis: () => void }) => (
  <div className="flex min-h-[60vh] flex-col items-center justify-center space-y-6 text-center">
    <div className="rounded-full bg-zinc-800 p-6">
      <Target className="h-12 w-12 text-zinc-400" />
    </div>
    <div className="space-y-2">
      <TypographyH2 className="text-2xl">Belum Ada Rekomendasi</TypographyH2>
      <TypographyP className="max-w-md">
        Mulai analisis profil Anda untuk mendapatkan rekomendasi kompetisi yang sesuai dengan
        <TypographyEmphasis> keahlian dan minat</TypographyEmphasis> Anda.
      </TypographyP>
    </div>
    <Button
      onClick={onStartAnalysis}
      className="border border-zinc-700 bg-zinc-800 text-white hover:bg-zinc-700"
    >
      <Activity className="mr-2 h-4 w-4" />
      Mulai Analisis Profil
    </Button>
  </div>
);

// Main Content Component
const RecommendationContent = () => (
  <div className="space-y-8">
    {/* Header */}
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <TypographyH1 className="text-3xl md:text-4xl">
            Rekomendasi{" "}
            <span className="bg-gradient-to-r from-zinc-400 via-white to-zinc-500 bg-clip-text text-transparent">
              Kompetisi
            </span>
          </TypographyH1>
          <TypographyP className="mt-2">
            Kompetisi yang dipersonalisasi berdasarkan{" "}
            <TypographyEmphasis>profil dan preferensi</TypographyEmphasis> Anda
          </TypographyP>
        </div>
        <Button className="border border-zinc-700 bg-zinc-800 text-white hover:bg-zinc-700">
          <Activity className="mr-2 h-4 w-4" />
          Refresh Analisis
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <Card className="border-zinc-800 bg-zinc-900">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Trophy className="h-5 w-5 text-yellow-500" />
              <div>
                <TypographyMuted>Total Rekomendasi</TypographyMuted>
                <TypographyLarge className="text-white">
                  {mockStats.totalRecommendations}
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
                <TypographyMuted>Rata-rata Match</TypographyMuted>
                <TypographyLarge className="text-white">{mockStats.averageMatch}%</TypographyLarge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-zinc-800 bg-zinc-900">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5 text-blue-500" />
              <div>
                <TypographyMuted>Kategori Cocok</TypographyMuted>
                <TypographyLarge className="text-white">
                  {mockStats.categoriesMatched}
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
                <TypographyMuted>Success Rate</TypographyMuted>
                <TypographyLarge className="text-white">{mockStats.successRate}%</TypographyLarge>
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
          <TypographyH3 className="mb-4">Top Rekomendasi untuk Anda</TypographyH3>
          <div className="space-y-4">
            {mockRecommendations.map((rec) => (
              <Card
                key={rec.id}
                className="border-zinc-800 bg-zinc-900 transition-colors hover:border-zinc-700"
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <CardTitle className="text-white">{rec.title}</CardTitle>
                        <Badge
                          className={`text-xs ${getDifficultyColor(rec.difficulty)} text-white`}
                        >
                          {rec.difficulty}
                        </Badge>
                      </div>
                      <CardDescription className="text-zinc-400">{rec.description}</CardDescription>
                    </div>
                    <Badge variant="gradient" className="ml-4">
                      {rec.matchScore}% Match
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Tags */}
                    <div className="flex flex-wrap gap-2">
                      {rec.tags.map((tag, tagIndex) => (
                        <Badge key={tagIndex} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-zinc-400" />
                        <span className="text-zinc-300">
                          Deadline: {formatDate(rec.registrationEnd)}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-zinc-400" />
                        <span className="text-zinc-300">{rec.location}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Trophy className="h-4 w-4 text-zinc-400" />
                        <span className="text-zinc-300">
                          Prize: {formatCurrency(rec.prizes[0].amount)}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4 text-zinc-400" />
                        <span className="text-zinc-300">
                          {rec.currentParticipants}/{rec.maxParticipants} peserta
                        </span>
                      </div>
                    </div>

                    {/* Event Timeline */}
                    <div className="space-y-2 rounded-lg bg-zinc-800 p-3">
                      <div className="text-xs text-zinc-400">Timeline Event:</div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-zinc-400">Registrasi:</span>
                          <div className="text-zinc-300">
                            {formatDate(rec.registrationStart)} - {formatDate(rec.registrationEnd)}
                          </div>
                        </div>
                        <div>
                          <span className="text-zinc-400">Event:</span>
                          <div className="text-zinc-300">
                            {formatDate(rec.eventStart)} - {formatDate(rec.eventEnd)}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Requirements */}
                    <div className="space-y-2">
                      <div className="text-xs text-zinc-400">Requirements:</div>
                      <div className="flex flex-wrap gap-1">
                        {rec.requirements.map((req, reqIndex) => (
                          <Badge key={reqIndex} variant="outline" className="text-xs">
                            {req}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Participation Progress */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-zinc-400">Partisipasi</span>
                        <span className="text-zinc-300">
                          {Math.round((rec.currentParticipants / rec.maxParticipants) * 100)}%
                        </span>
                      </div>
                      <Progress
                        value={(rec.currentParticipants / rec.maxParticipants) * 100}
                        className="h-2"
                      />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        className="border border-zinc-700 bg-zinc-800 text-white hover:bg-zinc-700"
                      >
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Lihat Detail
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-zinc-700 text-zinc-300 hover:bg-zinc-800"
                      >
                        Simpan
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
        {/* Student Stats Spider Chart */}
        <Card className="border-zinc-800 bg-zinc-900">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-white">
              <Radar className="h-5 w-5" />
              <span>Profil Kemampuan</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center">
              <SpiderChart data={studentStats} size={200} />
            </div>
          </CardContent>
        </Card>

        {/* Category Distribution */}
        <Card className="border-zinc-800 bg-zinc-900">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-white">
              <PieChart className="h-5 w-5" />
              <span>Distribusi Kategori</span>
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
              <span>Metrik Performa</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-300">Akurasi Prediksi</span>
                  <span className="font-medium text-white">87%</span>
                </div>
                <Progress value={87} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-300">Tingkat Partisipasi</span>
                  <span className="font-medium text-white">73%</span>
                </div>
                <Progress value={73} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-300">Kepuasan Rekomendasi</span>
                  <span className="font-medium text-white">91%</span>
                </div>
                <Progress value={91} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="border-zinc-800 bg-zinc-900">
          <CardHeader>
            <CardTitle className="text-white">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Button className="w-full justify-start border border-zinc-700 bg-zinc-800 text-white hover:bg-zinc-700">
                <Calendar className="mr-2 h-4 w-4" />
                Set Reminder
              </Button>
              <Button className="w-full justify-start border border-zinc-700 bg-zinc-800 text-white hover:bg-zinc-700">
                <Users className="mr-2 h-4 w-4" />
                Find Team
              </Button>
              <Button className="w-full justify-start border border-zinc-700 bg-zinc-800 text-white hover:bg-zinc-700">
                <Activity className="mr-2 h-4 w-4" />
                Update Profile
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
);

// Main Page Component
const MyRecommendationPage = () => {
  const [hasRecommendations, setHasRecommendations] = useState(true);

  const handleStartAnalysis = () => {
    // Simulate analysis process
    setTimeout(() => {
      setHasRecommendations(true);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-black p-6">
      <div className="mx-auto max-w-7xl">
        {hasRecommendations ? (
          <RecommendationContent />
        ) : (
          <EmptyState onStartAnalysis={handleStartAnalysis} />
        )}
      </div>
    </div>
  );
};

export default MyRecommendationPage;
