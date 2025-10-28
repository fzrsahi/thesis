"use client";

import { useQuery } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { Users, Trophy, Eye, Filter } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useMemo, useRef, useEffect, useCallback } from "react";

import {
  getRecommendations,
  getRecommendationsByStudent,
  type CompetitionRecommendationGroup,
  type StudentRecommendationGroup,
  type GetRecommendationsParams,
} from "@/client/api/recommendations";
import Button from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import Input from "@/components/ui/input";
import Pagination from "@/components/ui/pagination";
import { TypographyH2, TypographyP } from "@/components/ui/typography";
import { cn } from "@/lib/utils";

type ViewMode = "competitions" | "students";

// Competition Actions Component
type CompetitionActionsProps = {
  item: CompetitionRecommendationGroup;
  onView: (item: CompetitionRecommendationGroup) => void;
};

const CompetitionActions = ({ item, onView }: CompetitionActionsProps) => (
  <div className="flex items-center gap-2">
    <Button
      variant="outline"
      size="sm"
      className="border-zinc-700 bg-zinc-900 p-2 text-white hover:bg-zinc-800"
      onClick={() => onView(item)}
      aria-label="Detail"
    >
      <Eye className="h-4 w-4" />
    </Button>
  </div>
);

// Student Actions Component
type StudentActionsProps = {
  item: StudentRecommendationGroup;
  onView: (item: StudentRecommendationGroup) => void;
};

const StudentActions = ({ item, onView }: StudentActionsProps) => (
  <div className="flex items-center gap-2">
    <Button
      variant="outline"
      size="sm"
      className="border-zinc-700 bg-zinc-900 p-2 text-white hover:bg-zinc-800"
      onClick={() => onView(item)}
      aria-label="Detail"
    >
      <Eye className="h-4 w-4" />
    </Button>
  </div>
);

// Competition Columns
const competitionColumnsDef = (
  handleView: (item: CompetitionRecommendationGroup) => void
): ColumnDef<CompetitionRecommendationGroup>[] => [
  {
    header: "Kompetisi",
    accessorKey: "competition.title",
    cell: ({ row }) => (
      <div className="space-y-1">
        <div className="font-medium text-white">{row.original.competition.title}</div>
        <div className="text-sm text-zinc-400">{row.original.competition.field.join(", ")}</div>
        {row.original.competition.organizer && (
          <div className="text-xs text-zinc-500">{row.original.competition.organizer}</div>
        )}
      </div>
    ),
  },
  {
    header: "Jumlah Mahasiswa",
    accessorKey: "statistics.totalStudents",
    cell: ({ row }) => (
      <div className="text-center">
        <div className="text-lg font-semibold text-white">
          {row.original.statistics.totalStudents}
        </div>
        <div className="text-sm text-zinc-400">mahasiswa</div>
      </div>
    ),
  },
  {
    header: "Rata-rata Skor",
    accessorKey: "statistics.averageMatchScore",
    cell: ({ row }) => (
      <div className="text-center">
        <div className="text-lg font-semibold text-green-400">
          {parseFloat(row.original.statistics.averageMatchScore.toFixed(3))}
        </div>
        <div className="text-sm text-zinc-400">match score</div>
      </div>
    ),
  },
  {
    header: "Skor Tertinggi",
    accessorKey: "statistics.highestScore",
    cell: ({ row }) => (
      <div className="text-center">
        <div className="text-lg font-semibold text-yellow-400">
          {parseFloat(row.original.statistics.highestScore.toFixed(3))}
        </div>
        <div className="text-sm text-zinc-400">tertinggi</div>
      </div>
    ),
  },
  {
    header: "Aksi",
    accessorKey: "actions",
    cell: ({ row }) => <CompetitionActions item={row.original} onView={handleView} />,
  },
];

// Student Columns
const studentColumnsDef = (
  handleView: (item: StudentRecommendationGroup) => void
): ColumnDef<StudentRecommendationGroup>[] => [
  {
    header: "Mahasiswa",
    accessorKey: "student.name",
    cell: ({ row }) => (
      <div className="space-y-1">
        <div className="font-medium text-white">{row.original.student.name}</div>
        <div className="text-sm text-zinc-400">
          ID: {row.original.student.userId} | NIM:{" "}
          {row.original.student.studentId || "N/A"}
        </div>
        <div className="text-xs text-zinc-500">
          Program Studi: {row.original.student.studyProgram.name}
        </div>
        <div className="text-xs text-zinc-500">Tahun Masuk: {row.original.student.entryYear}</div>
        <div className="text-xs text-zinc-500">IPK: {row.original.student.gpa || "N/A"}</div>
      </div>
    ),
  },
  {
    header: "Jumlah Kompetisi",
    accessorKey: "statistics.totalCompetitions",
    cell: ({ row }) => (
      <div className="text-center">
        <div className="text-lg font-semibold text-white">
          {row.original.statistics.totalCompetitions}
        </div>
        <div className="text-sm text-zinc-400">kompetisi</div>
      </div>
    ),
  },
  {
    header: "Rata-rata Skor",
    accessorKey: "statistics.averageMatchScore",
    cell: ({ row }) => (
      <div className="text-center">
        <div className="text-lg font-semibold text-green-400">
          {parseFloat(row.original.statistics.averageMatchScore.toFixed(3))}
        </div>
        <div className="text-sm text-zinc-400">match score</div>
      </div>
    ),
  },
  {
    header: "Skor Tertinggi",
    accessorKey: "statistics.highestScore",
    cell: ({ row }) => (
      <div className="text-center">
        <div className="text-lg font-semibold text-yellow-400">
          {parseFloat(row.original.statistics.highestScore.toFixed(3))}
        </div>
        <div className="text-sm text-zinc-400">tertinggi</div>
      </div>
    ),
  },
  {
    header: "Aksi",
    accessorKey: "actions",
    cell: ({ row }) => <StudentActions item={row.original} onView={handleView} />,
  },
];

const RecomendationPage = () => {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<ViewMode>("competitions");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<Partial<GetRecommendationsParams>>({});

  const pageSize = 10;
  const tableRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(t);
  }, [search]);

  // Query for competitions view
  const { data: competitionsData, isLoading: isLoadingCompetitions } = useQuery({
    queryKey: [
      "recommendations-competitions",
      { page, limit: pageSize, keywords: debouncedSearch, ...filters },
    ],
    queryFn: async () => {
      const res = await getRecommendations({
        page,
        limit: pageSize,
        keywords: debouncedSearch || undefined,
        ...filters,
      });
      return res;
    },
    enabled: viewMode === "competitions",
  });

  // Query for students view
  const { data: studentsData, isLoading: isLoadingStudents } = useQuery({
    queryKey: [
      "recommendations-students",
      { page, limit: pageSize, keywords: debouncedSearch, ...filters },
    ],
    queryFn: async () => {
      const res = await getRecommendationsByStudent({
        page,
        limit: pageSize,
        keywords: debouncedSearch || undefined,
        ...filters,
      });
      return res;
    },
    enabled: viewMode === "students",
  });

  const currentData = viewMode === "competitions" ? competitionsData : studentsData;
  const isLoading = viewMode === "competitions" ? isLoadingCompetitions : isLoadingStudents;

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    setTimeout(() => {
      tableRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, viewMode]);

  const handleViewCompetition = useCallback(
    (item: CompetitionRecommendationGroup) => {
      router.push(`/recomendation/competition/${item.competition.id}`);
    },
    [router]
  );

  const handleViewStudent = useCallback(
    (item: StudentRecommendationGroup) => {
      router.push(`/recomendation/student/${item.student.userId}`);
    },
    [router]
  );

  // Use columnsDef factory to avoid defining components during render
  const competitionColumns = useMemo(
    () => competitionColumnsDef(handleViewCompetition),
    [handleViewCompetition]
  );

  const studentColumns = useMemo(() => studentColumnsDef(handleViewStudent), [handleViewStudent]);

  return (
    <div className="h-full flex flex-col">
      <div className="mb-6 flex-shrink-0">
        <TypographyH2 className="flex items-center gap-2 truncate text-zinc-900">
          <Trophy className="h-10 w-10 font-extrabold" />
          Rekomendasi Mahasiswa
        </TypographyH2>
        <TypographyP className="border-b border-gray-300 pb-4 text-zinc-900">
          Lihat rekomendasi kompetisi untuk mahasiswa berdasarkan analisis kecocokan.
        </TypographyP>
        <div className="mb-6 border-t border-gray-500" />
      </div>

      <div className="flex-1 flex flex-col min-h-0">
        <Card className="flex flex-col h-full border-2 border-zinc-700 bg-zinc-900 text-zinc-100 shadow-lg">
          <CardHeader className="flex-shrink-0 flex flex-col gap-4 border-b border-zinc-700 bg-zinc-900 pb-4 md:flex-row md:items-center md:justify-between">
            {/* View Mode Toggle */}
            <div className="flex gap-2">
              <div className="flex rounded-lg bg-zinc-800 p-1">
                <button
                  type="button"
                  onClick={() => setViewMode("competitions")}
                  className={cn(
                    "flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-all",
                    viewMode === "competitions"
                      ? "bg-white text-black shadow-sm"
                      : "text-zinc-400 hover:bg-zinc-700 hover:text-white"
                  )}
                >
                  <Trophy className="h-4 w-4" />
                  Berdasarkan Kompetisi
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("students")}
                  className={cn(
                    "flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-all",
                    viewMode === "students"
                      ? "bg-white text-black shadow-sm"
                      : "text-zinc-400 hover:bg-zinc-700 hover:text-white"
                  )}
                >
                  <Users className="h-4 w-4" />
                  Berdasarkan Mahasiswa
                </button>
              </div>
            </div>

            {/* Search and Filters */}
            <div className="flex gap-2">
              <Input
                placeholder={`Cari ${viewMode === "competitions" ? "kompetisi" : "mahasiswa"}...`}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full md:w-56"
              />
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="border-zinc-700 bg-gradient-to-r from-zinc-800 to-zinc-900 text-white hover:bg-zinc-700 hover:ring-2 hover:ring-blue-400"
              >
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>

          {/* Filters Panel */}
          {showFilters && (
            <div className="flex-shrink-0 border-b border-zinc-700 bg-zinc-800 p-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {viewMode === "students" && (
                  <div>
                    <label
                      htmlFor="entry-year"
                      className="mb-2 block text-sm font-medium text-zinc-300"
                    >
                      Tahun Masuk
                    </label>
                    <Input
                      id="entry-year"
                      type="number"
                      placeholder="2020"
                      value={filters.entryYear || ""}
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          entryYear: e.target.value ? parseInt(e.target.value, 10) : undefined,
                        }))
                      }
                      className="border-zinc-700 bg-zinc-900 text-white"
                    />
                  </div>
                )}
                <div>
                  <label
                    htmlFor="min-score"
                    className="mb-2 block text-sm font-medium text-zinc-300"
                  >
                    Skor Minimum (0-1)
                  </label>
                  <Input
                    id="min-score"
                    type="number"
                    placeholder="0.7"
                    min="0"
                    max="1"
                    step="0.1"
                    value={
                      filters.minMatchScore ? parseFloat(filters.minMatchScore.toFixed(3)) : ""
                    }
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        minMatchScore: e.target.value ? parseFloat(e.target.value) : undefined,
                      }))
                    }
                    className="border-zinc-700 bg-zinc-900 text-white"
                  />
                </div>
                <div className="flex items-end">
                  <Button
                    variant="outline"
                    onClick={() => setFilters({})}
                    className="border-zinc-700 bg-zinc-900 text-white hover:bg-zinc-700"
                  >
                    Reset Filter
                  </Button>
                </div>
              </div>
            </div>
          )}

          <CardContent ref={tableRef} className="flex-1 flex flex-col bg-zinc-900 p-0 md:p-4 min-h-0">
            <div className="flex-1 overflow-auto">
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="text-zinc-400">Loading...</div>
                </div>
              ) : viewMode === "competitions" ? (
                <DataTable columns={competitionColumns} data={competitionsData?.data ?? []} />
              ) : (
                <DataTable columns={studentColumns} data={studentsData?.data ?? []} />
              )}
            </div>
            {currentData && (
              <div className="flex-shrink-0">
                <Pagination
                  pagination={{
                    total: currentData.pagination?.total ?? 0,
                    page: currentData.pagination?.page ?? page,
                    limit: currentData.pagination?.limit ?? pageSize,
                    totalPages: currentData.pagination?.totalPages ?? 1,
                    hasNextPage: currentData.pagination?.hasNextPage ?? false,
                    hasPrevPage: currentData.pagination?.hasPrevPage ?? false,
                  }}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RecomendationPage;
