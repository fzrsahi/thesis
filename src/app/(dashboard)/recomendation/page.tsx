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

const CompetitionActions = ({
  item,
  onView,
  isLight = false,
}: CompetitionActionsProps & { isLight?: boolean }) => (
  <div className="flex items-center gap-2">
    <Button
      variant="outline"
      size="sm"
      className={cn(
        "p-2 transition-colors",
        isLight
          ? "border-stone-300/70 bg-white/80 text-[#2F2A24] hover:bg-stone-100/80"
          : "border-zinc-700 bg-zinc-900 text-white hover:bg-zinc-800"
      )}
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
  isLight?: boolean;
};

const StudentActions = ({ item, onView, isLight = false }: StudentActionsProps) => (
  <div className="flex items-center gap-2">
    <Button
      variant="outline"
      size="sm"
      className={cn(
        "p-2 transition-colors",
        isLight
          ? "border-stone-300/70 bg-white/80 text-[#2F2A24] hover:bg-stone-100/80"
          : "border-zinc-700 bg-zinc-900 text-white hover:bg-zinc-800"
      )}
      onClick={() => onView(item)}
      aria-label="Detail"
    >
      <Eye className="h-4 w-4" />
    </Button>
  </div>
);

// Competition Columns
const competitionColumnsDef = (
  handleView: (item: CompetitionRecommendationGroup) => void,
  isLight = false
): ColumnDef<CompetitionRecommendationGroup>[] => [
  {
    header: "Kompetisi",
    accessorKey: "competition.title",
    cell: ({ row }) => {
      const textPrimary = isLight ? "text-[#2F2A24]" : "text-white";
      const textSecondary = isLight ? "text-[#5C5245]" : "text-zinc-400";
      const textTertiary = isLight ? "text-[#7A6B5B]" : "text-zinc-500";
      return (
        <div className="space-y-1">
          <div className={cn("font-medium", textPrimary)}>{row.original.competition.title}</div>
          <div className={cn("text-sm", textSecondary)}>
            {row.original.competition.field.join(", ")}
          </div>
          {row.original.competition.organizer && (
            <div className={cn("text-xs", textTertiary)}>{row.original.competition.organizer}</div>
          )}
        </div>
      );
    },
  },
  {
    header: () => <div className="w-full text-center">Jumlah Mahasiswa</div>,
    accessorKey: "statistics.totalStudents",
    meta: {
      headerClassName: "text-center",
    },
    cell: ({ row }) => {
      const textPrimary = isLight ? "text-[#2F2A24]" : "text-white";
      const textSecondary = isLight ? "text-[#5C5245]" : "text-zinc-400";
      return (
        <div className="text-center">
          <div className={cn("text-lg font-semibold", textPrimary)}>
            {row.original.statistics.totalStudents}
          </div>
          <div className={cn("text-sm", textSecondary)}>mahasiswa</div>
        </div>
      );
    },
  },
  {
    header: "Aksi",
    accessorKey: "actions",
    cell: ({ row }) => (
      <CompetitionActions item={row.original} onView={handleView} isLight={isLight} />
    ),
  },
];

// Student Columns
const studentColumnsDef = (
  handleView: (item: StudentRecommendationGroup) => void,
  isLight = false
): ColumnDef<StudentRecommendationGroup>[] => [
  {
    header: "Mahasiswa",
    accessorKey: "student.name",
    cell: ({ row }) => {
      const textPrimary = isLight ? "text-[#2F2A24]" : "text-white";
      const textSecondary = isLight ? "text-[#5C5245]" : "text-zinc-400";
      const textTertiary = isLight ? "text-[#7A6B5B]" : "text-zinc-500";
      return (
        <div className="space-y-1">
          <div className={cn("font-medium", textPrimary)}>{row.original.student.name}</div>
          <div className={cn("text-sm", textSecondary)}>
            ID: {row.original.student.userId} | NIM: {row.original.student.studentId || "N/A"}
          </div>
          <div className={cn("text-xs", textTertiary)}>
            Program Studi: {row.original.student.studyProgram.name}
          </div>
          <div className={cn("text-xs", textTertiary)}>
            Tahun Masuk: {row.original.student.entryYear}
          </div>
          <div className={cn("text-xs", textTertiary)}>
            IPK: {row.original.student.gpa || "N/A"}
          </div>
        </div>
      );
    },
  },
  {
    header: () => <div className="w-full text-center">Jumlah Kompetisi</div>,
    accessorKey: "statistics.totalCompetitions",
    meta: {
      headerClassName: "text-center",
    },
    cell: ({ row }) => {
      const textPrimary = isLight ? "text-[#2F2A24]" : "text-white";
      const textSecondary = isLight ? "text-[#5C5245]" : "text-zinc-400";
      return (
        <div className="text-center">
          <div className={cn("text-lg font-semibold", textPrimary)}>
            {row.original.statistics.totalCompetitions}
          </div>
          <div className={cn("text-sm", textSecondary)}>kompetisi</div>
        </div>
      );
    },
  },
  {
    header: "Aksi",
    accessorKey: "actions",
    cell: ({ row }) => <StudentActions item={row.original} onView={handleView} isLight={isLight} />,
  },
];

const RecomendationPage = () => {
  const router = useRouter();
  const [isLight, setIsLight] = useState<boolean>(true);
  const [viewMode, setViewMode] = useState<ViewMode>("competitions");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<Partial<GetRecommendationsParams>>({});

  const pageSize = 10;
  const tableRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stored = typeof window !== "undefined" ? localStorage.getItem("scout-theme") : null;
    if (stored) setIsLight(stored === "light");
  }, []);

  useEffect(() => {
    const handler = (e: Event) => {
      const customEvent = e as CustomEvent<{ theme: string }>;
      const theme = customEvent?.detail?.theme;
      if (!theme) return;
      setIsLight(theme === "light");
    };
    window.addEventListener("scout-theme-change", handler as EventListener);
    return () => window.removeEventListener("scout-theme-change", handler as EventListener);
  }, []);

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
    () => competitionColumnsDef(handleViewCompetition, isLight),
    [handleViewCompetition, isLight]
  );

  const studentColumns = useMemo(
    () => studentColumnsDef(handleViewStudent, isLight),
    [handleViewStudent, isLight]
  );

  const textPrimary = isLight ? "text-[#2F2A24]" : "text-white";
  const textSecondary = isLight ? "text-[#5C5245]" : "text-zinc-400";
  const borderColor = isLight ? "border-stone-300" : "border-gray-500";
  const cardBorder = isLight ? "border-stone-300/70" : "border-zinc-700";
  const cardBg = isLight ? "bg-white/90" : "bg-zinc-900";
  const cardText = isLight ? "text-[#2F2A24]" : "text-zinc-100";
  const headerBorder = isLight ? "border-stone-300/70" : "border-zinc-700";
  const filterBg = isLight ? "bg-stone-50/80" : "bg-zinc-800";
  const filterBorder = isLight ? "border-stone-300/70" : "border-zinc-700";
  const filterLabel = isLight ? "text-[#5C5245]" : "text-zinc-300";
  const filterInput = isLight
    ? "border-stone-300/70 bg-white text-[#2F2A24]"
    : "border-zinc-700 bg-zinc-900 text-zinc-100";
  const toggleActiveBg = isLight ? "bg-white text-black" : "bg-white text-black";
  const toggleInactive = isLight
    ? "text-[#5C5245] hover:bg-stone-100/80 hover:text-[#2F2A24]"
    : "text-zinc-400 hover:bg-zinc-700 hover:text-white";

  return (
    <div className="flex h-full flex-col">
      <div className="mb-6 flex-shrink-0">
        <TypographyH2 className={cn("flex items-center gap-2 truncate", textPrimary)}>
          <Trophy className="h-10 w-10 font-extrabold" />
          Rekomendasi Mahasiswa
        </TypographyH2>
        <TypographyP className={cn("border-b pb-4", borderColor, textSecondary)}>
          Lihat rekomendasi kompetisi untuk mahasiswa berdasarkan analisis kecocokan.
        </TypographyP>
        <div className={cn("mb-6 border-t", borderColor)} />
      </div>

      <div className="flex min-h-0 flex-1 flex-col">
        <Card
          className={cn(
            "flex h-full flex-col border-2 shadow-lg transition-colors",
            cardBorder,
            cardBg,
            cardText
          )}
        >
          <CardHeader
            className={cn(
              "flex flex-shrink-0 flex-col gap-4 border-b pb-4 md:flex-row md:items-center md:justify-between",
              headerBorder,
              cardBg
            )}
          >
            {/* View Mode Toggle */}
            <div className="flex gap-2">
              <div
                className={cn(
                  "flex rounded-lg p-1 transition-colors",
                  isLight ? "bg-stone-200/60" : "bg-zinc-800"
                )}
              >
                <button
                  type="button"
                  onClick={() => setViewMode("competitions")}
                  className={cn(
                    "flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-all",
                    viewMode === "competitions" ? toggleActiveBg : toggleInactive
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
                    viewMode === "students" ? toggleActiveBg : toggleInactive
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
                className={cn(
                  "transition-colors hover:ring-2 hover:ring-blue-400",
                  isLight
                    ? "border-stone-300/70 bg-white/80 text-[#2F2A24] hover:bg-stone-100/80"
                    : "border-zinc-700 bg-gradient-to-r from-zinc-800 to-zinc-900 text-white hover:bg-zinc-700"
                )}
              >
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>

          {/* Filters Panel */}
          {showFilters && (
            <div className={cn("flex-shrink-0 border-b p-4", filterBorder, filterBg)}>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {viewMode === "students" && (
                  <div>
                    <label
                      htmlFor="entry-year"
                      className={cn("mb-2 block text-sm font-medium", filterLabel)}
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
                      className={cn("transition-colors", filterInput)}
                    />
                  </div>
                )}
                <div>
                  <label
                    htmlFor="min-score"
                    className={cn("mb-2 block text-sm font-medium", filterLabel)}
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
                    className={cn("transition-colors", filterInput)}
                  />
                </div>
                <div className="flex items-end">
                  <Button
                    variant="outline"
                    onClick={() => setFilters({})}
                    className={cn(
                      "transition-colors",
                      isLight
                        ? "border-stone-300/70 bg-white/80 text-[#2F2A24] hover:bg-stone-100/80"
                        : "border-zinc-700 bg-zinc-900 text-white hover:bg-zinc-700"
                    )}
                  >
                    Reset Filter
                  </Button>
                </div>
              </div>
            </div>
          )}

          <CardContent
            ref={tableRef}
            className={cn("flex min-h-0 flex-1 flex-col p-0 transition-colors md:p-4", cardBg)}
          >
            <div className="flex-1 overflow-auto">
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className={cn("transition-colors", textSecondary)}>Loading...</div>
                </div>
              ) : viewMode === "competitions" ? (
                <DataTable
                  columns={competitionColumns}
                  data={competitionsData?.data ?? []}
                  isLight={isLight}
                />
              ) : (
                <DataTable
                  columns={studentColumns}
                  data={studentsData?.data ?? []}
                  isLight={isLight}
                />
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
