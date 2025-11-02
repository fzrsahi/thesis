"use client";

import { useQuery } from "@tanstack/react-query";
import {
  BookOpen,
  Calendar,
  MapPin,
  Tag,
  Building2,
  Award,
  Target,
  Users,
  Star,
  ExternalLink,
  BookAIcon,
} from "lucide-react";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";

import { getCompetitionDetail, type CompetitionItem } from "@/client/api/competitions";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Skeleton from "@/components/ui/skeleton";
import { TypographyH2, TypographyP } from "@/components/ui/typography";
import { formatDate, cn } from "@/lib/utils";

const Label = ({
  children,
  className,
  isLight = false,
}: {
  children: React.ReactNode;
  className?: string;
  isLight?: boolean;
}) => (
  <div
    className={cn(
      "text-xs font-medium tracking-wide uppercase",
      isLight ? "text-[#5C5245]" : "text-zinc-400",
      className ?? ""
    )}
  >
    {children}
  </div>
);

const Field = ({
  children,
  className,
  isLight = false,
}: {
  children: React.ReactNode;
  className?: string;
  isLight?: boolean;
}) => (
  <div className={cn("text-sm", isLight ? "text-[#2F2A24]" : "text-white", className ?? "")}>
    {children}
  </div>
);

const Pills = ({ items, isLight = false }: { items?: string[]; isLight?: boolean }) => (
  <div className="flex flex-wrap gap-2">
    {(items ?? []).length === 0 ? (
      <span className={cn("text-sm", isLight ? "text-[#7A6B5B]" : "text-zinc-500")}>-</span>
    ) : null}
    {(items ?? []).map((it) => (
      <Badge
        key={it}
        variant="secondary"
        className={cn(
          "border backdrop-blur-sm transition-all",
          isLight
            ? "border-stone-300/70 bg-stone-100/80 text-[#2F2A24] hover:bg-stone-200/80"
            : "border-zinc-600/50 bg-gradient-to-r from-zinc-800/50 to-zinc-700/50 text-zinc-100 hover:from-zinc-700/50 hover:to-zinc-600/50"
        )}
      >
        {it}
      </Badge>
    ))}
  </div>
);

const CompetitionDetailPage = () => {
  const params = useParams<{ id: string }>();
  const id = Number(params.id);
  const [isLight, setIsLight] = useState<boolean>(true);

  const { data, isLoading } = useQuery({
    queryKey: ["competition-detail", id],
    queryFn: async () => getCompetitionDetail(id),
    enabled: Number.isFinite(id),
  });

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

  type CompetitionDetail = CompetitionItem & {
    sourceUrl?: string | null;
    location?: string | null;
    minGPA?: string | null;
    requirements?: {
      originality?: string | null;
      teamComposition?: string | null;
      other?: string | null;
    } | null;
    evaluationCriteria?: {
      preliminaryRound?: string | null;
      finalRound?: string | null;
      other?: string | null;
    } | null;
    relevantCourses?: string[];
    relevantSkills?: string[];
    fileId?: string;
  };

  const item = data?.data as CompetitionDetail | undefined;

  const textPrimary = isLight ? "text-[#2F2A24]" : "text-white";
  const textSecondary = isLight ? "text-[#5C5245]" : "text-zinc-400";
  const borderColor = isLight ? "border-stone-300" : "border-gray-500";

  return (
    <div className="w-full">
      <div className="mb-6">
        <TypographyH2 className={cn("flex items-center gap-2 truncate", textPrimary)}>
          <BookOpen className="h-10 w-10 font-extrabold" />
          Detail Kompetisi
        </TypographyH2>
        <TypographyP className={cn("border-b pb-4", borderColor, textSecondary)}>
          Informasi lengkap mengenai kompetisi yang dipilih.
        </TypographyP>
        <div className={cn("mb-6 border-t", borderColor)} />
      </div>

      <div className="flex justify-center">
        <div className="w-full space-y-8 lg:max-h-[78vh] lg:overflow-y-auto lg:pr-3 lg:pb-2">
          {/* Header */}
          <Card
            className={cn(
              "border shadow-xl backdrop-blur-sm transition-colors",
              isLight
                ? "border-stone-300/70 bg-white/90 text-[#2F2A24]"
                : "border-zinc-600/50 bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 text-white"
            )}
          >
            <CardHeader
              className={cn(
                "border-b transition-colors",
                isLight
                  ? "border-stone-300/70 bg-white/90"
                  : "border-zinc-600/30 bg-gradient-to-r from-zinc-800/50 to-zinc-700/30"
              )}
            >
              {isLoading ? (
                <div className="space-y-3">
                  <Skeleton className={cn("h-8 w-2/3", isLight ? "bg-stone-200" : "bg-zinc-700")} />
                  <Skeleton className={cn("h-5 w-4/5", isLight ? "bg-stone-200" : "bg-zinc-700")} />
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-3">
                      <h3
                        className={cn(
                          "flex items-center gap-3 text-2xl font-bold",
                          isLight ? "text-[#2F2A24]" : "text-white"
                        )}
                      >
                        <div className="rounded-full bg-gradient-to-r from-blue-500 to-purple-600 p-2">
                          <BookOpen className="h-6 w-6 text-white" />
                        </div>
                        {item?.title ?? "-"}
                      </h3>
                      <TypographyP
                        className={cn("text-lg", isLight ? "text-[#5C5245]" : "text-zinc-300")}
                      >
                        {item?.description ?? "-"}
                      </TypographyP>
                    </div>
                    {item?.fileId && (
                      <a
                        href={item.fileId}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={cn(
                          "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm ring-1 transition-all",
                          isLight
                            ? "bg-blue-50/80 text-blue-700 ring-blue-200/40 hover:bg-blue-100/80 hover:text-blue-800"
                            : "bg-zinc-900/60 text-blue-300 ring-zinc-600/40 hover:bg-zinc-800/60 hover:text-blue-200"
                        )}
                      >
                        <BookAIcon className="h-4 w-4" />
                        Panduan
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                  </div>
                </div>
              )}
            </CardHeader>
            <CardContent className="grid gap-8 py-8 md:grid-cols-2">
              {isLoading ? (
                <>
                  <Skeleton className={cn("h-6 w-2/3", isLight ? "bg-stone-200" : "bg-zinc-700")} />
                  <Skeleton className={cn("h-6 w-1/2", isLight ? "bg-stone-200" : "bg-zinc-700")} />
                  <Skeleton className={cn("h-6 w-3/5", isLight ? "bg-stone-200" : "bg-zinc-700")} />
                  <Skeleton className={cn("h-6 w-1/4", isLight ? "bg-stone-200" : "bg-zinc-700")} />
                </>
              ) : (
                <>
                  <div
                    className={cn(
                      "space-y-2 rounded-lg p-4 backdrop-blur-sm transition-colors",
                      isLight ? "bg-stone-50/80" : "bg-zinc-800/30"
                    )}
                  >
                    <Label isLight={isLight}>Penyelenggara</Label>
                    <Field isLight={isLight} className="flex items-center gap-2">
                      <Building2
                        className={cn("h-4 w-4", isLight ? "text-blue-600" : "text-blue-400")}
                      />
                      {item?.organizer ?? "-"}
                    </Field>
                  </div>
                  <div
                    className={cn(
                      "space-y-2 rounded-lg p-4 backdrop-blur-sm transition-colors",
                      isLight ? "bg-stone-50/80" : "bg-zinc-800/30"
                    )}
                  >
                    <Label isLight={isLight}>Lokasi</Label>
                    <Field isLight={isLight} className="flex items-center gap-2">
                      <MapPin
                        className={cn("h-4 w-4", isLight ? "text-green-600" : "text-green-400")}
                      />
                      {item?.location ?? "-"}
                    </Field>
                  </div>
                  <div
                    className={cn(
                      "space-y-2 rounded-lg p-4 backdrop-blur-sm transition-colors",
                      isLight ? "bg-stone-50/80" : "bg-zinc-800/30"
                    )}
                  >
                    <Label isLight={isLight}>Bidang</Label>
                    <Pills items={item?.field} isLight={isLight} />
                  </div>
                  <div
                    className={cn(
                      "space-y-2 rounded-lg p-4 backdrop-blur-sm transition-colors",
                      isLight ? "bg-stone-50/80" : "bg-zinc-800/30"
                    )}
                  >
                    <Label isLight={isLight}>Periode</Label>
                    <Field isLight={isLight} className="flex items-center gap-2">
                      <Calendar
                        className={cn("h-4 w-4", isLight ? "text-purple-600" : "text-purple-400")}
                      />
                      <span>{item?.startDate ? formatDate(item.startDate) : "-"}</span>
                      <span className={cn(isLight ? "text-[#7A6B5B]" : "text-zinc-500")}>s/d</span>
                      <span>{item?.endDate ? formatDate(item.endDate) : "-"}</span>
                    </Field>
                  </div>
                  <div
                    className={cn(
                      "space-y-2 rounded-lg p-4 backdrop-blur-sm transition-colors",
                      isLight ? "bg-stone-50/80" : "bg-zinc-800/30"
                    )}
                  >
                    <Label isLight={isLight}>Tipe</Label>
                    <Field isLight={isLight} className="flex items-center gap-2">
                      <Tag
                        className={cn("h-4 w-4", isLight ? "text-yellow-600" : "text-yellow-400")}
                      />
                      {item?.type ?? "-"}
                    </Field>
                  </div>
                  <div
                    className={cn(
                      "space-y-2 rounded-lg p-4 backdrop-blur-sm transition-colors",
                      isLight ? "bg-stone-50/80" : "bg-zinc-800/30"
                    )}
                  >
                    <Label isLight={isLight}>Minimal IPK</Label>
                    <Field isLight={isLight} className="flex items-center gap-2">
                      <Star
                        className={cn("h-4 w-4", isLight ? "text-orange-600" : "text-orange-400")}
                      />
                      {item?.minGPA ? item.minGPA : "-"}
                    </Field>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Requirements */}
          <Card
            className={cn(
              "border shadow-xl backdrop-blur-sm transition-colors",
              isLight
                ? "border-stone-300/70 bg-white/90 text-[#2F2A24]"
                : "border-zinc-600/50 bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 text-white"
            )}
          >
            <CardHeader
              className={cn(
                "border-b transition-colors",
                isLight
                  ? "border-stone-300/70 bg-white/90"
                  : "border-zinc-600/30 bg-gradient-to-r from-zinc-800/50 to-zinc-700/30"
              )}
            >
              <h4
                className={cn(
                  "flex items-center gap-3 text-xl font-bold",
                  isLight ? "text-[#2F2A24]" : "text-white"
                )}
              >
                <div className="rounded-full bg-gradient-to-r from-green-500 to-emerald-600 p-2">
                  <Users className="h-5 w-5 text-white" />
                </div>
                Persyaratan
              </h4>
            </CardHeader>
            <CardContent className="space-y-6 py-6">
              {isLoading ? (
                <>
                  <Skeleton className={cn("h-6 w-2/3", isLight ? "bg-stone-200" : "bg-zinc-700")} />
                  <Skeleton className={cn("h-6 w-1/2", isLight ? "bg-stone-200" : "bg-zinc-700")} />
                </>
              ) : (
                <div className="space-y-6">
                  <div
                    className={cn(
                      "rounded-lg border p-6 backdrop-blur-sm transition-colors",
                      isLight
                        ? "border-stone-300/50 bg-stone-50/80"
                        : "border-zinc-600/20 bg-zinc-800/30"
                    )}
                  >
                    <div className="space-y-2">
                      <Label isLight={isLight}>Originalitas</Label>
                      <Field isLight={isLight}>{item?.requirements?.originality ?? "-"}</Field>
                    </div>
                  </div>
                  <div
                    className={cn(
                      "rounded-lg border p-6 backdrop-blur-sm transition-colors",
                      isLight
                        ? "border-stone-300/50 bg-stone-50/80"
                        : "border-zinc-600/20 bg-zinc-800/30"
                    )}
                  >
                    <div className="space-y-2">
                      <Label isLight={isLight}>Komposisi Tim</Label>
                      <Field isLight={isLight}>{item?.requirements?.teamComposition ?? "-"}</Field>
                    </div>
                  </div>
                  <div
                    className={cn(
                      "rounded-lg border p-6 backdrop-blur-sm transition-colors",
                      isLight
                        ? "border-stone-300/50 bg-stone-50/80"
                        : "border-zinc-600/20 bg-zinc-800/30"
                    )}
                  >
                    <div className="space-y-2">
                      <Label isLight={isLight}>Lainnya</Label>
                      <Field isLight={isLight}>{item?.requirements?.other ?? "-"}</Field>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Evaluation Criteria */}
          <Card
            className={cn(
              "border shadow-xl backdrop-blur-sm transition-colors",
              isLight
                ? "border-stone-300/70 bg-white/90 text-[#2F2A24]"
                : "border-zinc-600/50 bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 text-white"
            )}
          >
            <CardHeader
              className={cn(
                "border-b transition-colors",
                isLight
                  ? "border-stone-300/70 bg-white/90"
                  : "border-zinc-600/30 bg-gradient-to-r from-zinc-800/50 to-zinc-700/30"
              )}
            >
              <h4
                className={cn(
                  "flex items-center gap-3 text-xl font-bold",
                  isLight ? "text-[#2F2A24]" : "text-white"
                )}
              >
                <div className="rounded-full bg-gradient-to-r from-yellow-500 to-orange-600 p-2">
                  <Target className="h-5 w-5 text-white" />
                </div>
                Kriteria Penilaian
              </h4>
            </CardHeader>
            <CardContent className="space-y-6 py-6">
              {isLoading ? (
                <>
                  <Skeleton className={cn("h-6 w-3/5", isLight ? "bg-stone-200" : "bg-zinc-700")} />
                  <Skeleton className={cn("h-6 w-4/5", isLight ? "bg-stone-200" : "bg-zinc-700")} />
                </>
              ) : (
                <div className="space-y-6">
                  <div
                    className={cn(
                      "rounded-lg border p-6 backdrop-blur-sm transition-colors",
                      isLight
                        ? "border-stone-300/50 bg-stone-50/80"
                        : "border-zinc-600/20 bg-zinc-800/30"
                    )}
                  >
                    <div className="space-y-2">
                      <Label isLight={isLight}>Babak Penyisihan</Label>
                      <Field isLight={isLight}>
                        {item?.evaluationCriteria?.preliminaryRound ?? "-"}
                      </Field>
                    </div>
                  </div>
                  <div
                    className={cn(
                      "rounded-lg border p-6 backdrop-blur-sm transition-colors",
                      isLight
                        ? "border-stone-300/50 bg-stone-50/80"
                        : "border-zinc-600/20 bg-zinc-800/30"
                    )}
                  >
                    <div className="space-y-2">
                      <Label isLight={isLight}>Babak Final</Label>
                      <Field isLight={isLight}>{item?.evaluationCriteria?.finalRound ?? "-"}</Field>
                    </div>
                  </div>
                  <div
                    className={cn(
                      "rounded-lg border p-6 backdrop-blur-sm transition-colors",
                      isLight
                        ? "border-stone-300/50 bg-stone-50/80"
                        : "border-zinc-600/20 bg-zinc-800/30"
                    )}
                  >
                    <div className="space-y-2">
                      <Label isLight={isLight}>Lainnya</Label>
                      <Field isLight={isLight}>{item?.evaluationCriteria?.other ?? "-"}</Field>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Relevansi */}
          <Card
            className={cn(
              "border shadow-xl backdrop-blur-sm transition-colors",
              isLight
                ? "border-stone-300/70 bg-white/90 text-[#2F2A24]"
                : "border-zinc-600/50 bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 text-white"
            )}
          >
            <CardHeader
              className={cn(
                "border-b transition-colors",
                isLight
                  ? "border-stone-300/70 bg-white/90"
                  : "border-zinc-600/30 bg-gradient-to-r from-zinc-800/50 to-zinc-700/30"
              )}
            >
              <h4
                className={cn(
                  "flex items-center gap-3 text-xl font-bold",
                  isLight ? "text-[#2F2A24]" : "text-white"
                )}
              >
                <div className="rounded-full bg-gradient-to-r from-purple-500 to-pink-600 p-2">
                  <Award className="h-5 w-5 text-white" />
                </div>
                Relevansi
              </h4>
            </CardHeader>
            <CardContent className="grid gap-8 py-6 md:grid-cols-2">
              {isLoading ? (
                <>
                  <Skeleton className={cn("h-6 w-2/3", isLight ? "bg-stone-200" : "bg-zinc-700")} />
                  <Skeleton className={cn("h-6 w-1/2", isLight ? "bg-stone-200" : "bg-zinc-700")} />
                </>
              ) : (
                <>
                  <div
                    className={cn(
                      "space-y-3 rounded-lg p-6 backdrop-blur-sm transition-colors",
                      isLight ? "bg-stone-50/80" : "bg-zinc-800/30"
                    )}
                  >
                    <Label isLight={isLight}>Mata Kuliah Terkait</Label>
                    <Pills items={item?.relevantCourses} isLight={isLight} />
                  </div>
                  <div
                    className={cn(
                      "space-y-3 rounded-lg p-6 backdrop-blur-sm transition-colors",
                      isLight ? "bg-stone-50/80" : "bg-zinc-800/30"
                    )}
                  >
                    <Label isLight={isLight}>Keterampilan Terkait</Label>
                    <Pills items={item?.relevantSkills} isLight={isLight} />
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CompetitionDetailPage;
