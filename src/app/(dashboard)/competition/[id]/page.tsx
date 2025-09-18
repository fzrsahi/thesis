"use client";

import { useQuery } from "@tanstack/react-query";
import {
  BookOpen,
  Calendar,
  Globe,
  MapPin,
  Tag,
  Building2,
  Award,
  Target,
  Users,
  Star,
  ExternalLink,
} from "lucide-react";
import { useParams } from "next/navigation";

import { getCompetitionDetail, type CompetitionItem } from "@/client/api/competitions";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Skeleton from "@/components/ui/skeleton";
import { TypographyH2, TypographyP } from "@/components/ui/typography";
import { formatDate } from "@/lib/utils";

const Label = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={`text-xs font-medium tracking-wide text-zinc-400 uppercase ${className ?? ""}`}>
    {children}
  </div>
);

const Field = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={`text-sm text-white ${className ?? ""}`}>{children}</div>
);

const Pills = ({ items }: { items?: string[] }) => (
  <div className="flex flex-wrap gap-2">
    {(items ?? []).length === 0 ? <span className="text-sm text-zinc-500">-</span> : null}
    {(items ?? []).map((it) => (
      <Badge
        key={it}
        variant="secondary"
        className="border border-zinc-600/50 bg-gradient-to-r from-zinc-800/50 to-zinc-700/50 text-zinc-100 backdrop-blur-sm transition-all hover:from-zinc-700/50 hover:to-zinc-600/50"
      >
        {it}
      </Badge>
    ))}
  </div>
);

const CompetitionDetailPage = () => {
  const params = useParams<{ id: string }>();
  const id = Number(params.id);

  const { data, isLoading } = useQuery({
    queryKey: ["competition-detail", id],
    queryFn: async () => getCompetitionDetail(id),
    enabled: Number.isFinite(id),
  });

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
  };

  const item = data?.data as CompetitionDetail | undefined;

  return (
    <div className="w-full">
      <div className="mb-6">
        <TypographyH2 className="flex items-center gap-2 truncate text-zinc-900">
          <BookOpen className="h-10 w-10 font-extrabold" />
          Detail Kompetisi
        </TypographyH2>
        <TypographyP className="border-b border-gray-300 pb-4 text-zinc-900">
          Informasi lengkap mengenai kompetisi yang dipilih.
        </TypographyP>
        <div className="mb-6 border-t border-gray-500" />
      </div>

      <div className="flex justify-center">
        <div className="w-full space-y-8 lg:max-h-[78vh] lg:overflow-y-auto lg:pr-3 lg:pb-2">
          {/* Header */}
          <Card className="border border-zinc-600/50 bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 text-white shadow-xl backdrop-blur-sm">
            <CardHeader className="border-b border-zinc-600/30 bg-gradient-to-r from-zinc-800/50 to-zinc-700/30">
              {isLoading ? (
                <div className="space-y-3">
                  <Skeleton className="h-8 w-2/3 bg-zinc-700" />
                  <Skeleton className="h-5 w-4/5 bg-zinc-700" />
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-3">
                      <h3 className="flex items-center gap-3 text-2xl font-bold text-white">
                        <div className="rounded-full bg-gradient-to-r from-blue-500 to-purple-600 p-2">
                          <BookOpen className="h-6 w-6 text-white" />
                        </div>
                        {item?.title ?? "-"}
                      </h3>
                      <TypographyP className="text-lg text-zinc-300">
                        {item?.description ?? "-"}
                      </TypographyP>
                    </div>
                    {item?.sourceUrl && (
                      <a
                        href={item.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-full bg-zinc-900/60 px-4 py-2 text-sm text-blue-300 ring-1 ring-zinc-600/40 transition-all hover:bg-zinc-800/60 hover:text-blue-200"
                      >
                        <Globe className="h-4 w-4" />
                        Website
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
                  <Skeleton className="h-6 w-2/3 bg-zinc-700" />
                  <Skeleton className="h-6 w-1/2 bg-zinc-700" />
                  <Skeleton className="h-6 w-3/5 bg-zinc-700" />
                  <Skeleton className="h-6 w-1/4 bg-zinc-700" />
                </>
              ) : (
                <>
                  <div className="space-y-2 rounded-lg bg-zinc-800/30 p-4 backdrop-blur-sm">
                    <Label className="text-zinc-300">Penyelenggara</Label>
                    <Field className="flex items-center gap-2 text-zinc-100">
                      <Building2 className="h-4 w-4 text-blue-400" />
                      {item?.organizer ?? "-"}
                    </Field>
                  </div>
                  <div className="space-y-2 rounded-lg bg-zinc-800/30 p-4 backdrop-blur-sm">
                    <Label className="text-zinc-300">Lokasi</Label>
                    <Field className="flex items-center gap-2 text-zinc-100">
                      <MapPin className="h-4 w-4 text-green-400" />
                      {item?.location ?? "-"}
                    </Field>
                  </div>
                  <div className="space-y-2 rounded-lg bg-zinc-800/30 p-4 backdrop-blur-sm">
                    <Label className="text-zinc-300">Bidang</Label>
                    <Pills items={item?.field} />
                  </div>
                  <div className="space-y-2 rounded-lg bg-zinc-800/30 p-4 backdrop-blur-sm">
                    <Label className="text-zinc-300">Periode</Label>
                    <Field className="flex items-center gap-2 text-zinc-100">
                      <Calendar className="h-4 w-4 text-purple-400" />
                      <span>{item?.startDate ? formatDate(item.startDate) : "-"}</span>
                      <span className="text-zinc-500">s/d</span>
                      <span>{item?.endDate ? formatDate(item.endDate) : "-"}</span>
                    </Field>
                  </div>
                  <div className="space-y-2 rounded-lg bg-zinc-800/30 p-4 backdrop-blur-sm">
                    <Label className="text-zinc-300">Tipe</Label>
                    <Field className="flex items-center gap-2 text-zinc-100">
                      <Tag className="h-4 w-4 text-yellow-400" />
                      {item?.type ?? "-"}
                    </Field>
                  </div>
                  <div className="space-y-2 rounded-lg bg-zinc-800/30 p-4 backdrop-blur-sm">
                    <Label className="text-zinc-300">Minimal GPA</Label>
                    <Field className="flex items-center gap-2 text-zinc-100">
                      <Star className="h-4 w-4 text-orange-400" />
                      {item?.minGPA ? item.minGPA : "-"}
                    </Field>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Requirements */}
          <Card className="border border-zinc-600/50 bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 text-white shadow-xl backdrop-blur-sm">
            <CardHeader className="border-b border-zinc-600/30 bg-gradient-to-r from-zinc-800/50 to-zinc-700/30">
              <h4 className="flex items-center gap-3 text-xl font-bold">
                <div className="rounded-full bg-gradient-to-r from-green-500 to-emerald-600 p-2">
                  <Users className="h-5 w-5 text-white" />
                </div>
                Persyaratan
              </h4>
            </CardHeader>
            <CardContent className="space-y-6 py-6">
              {isLoading ? (
                <>
                  <Skeleton className="h-6 w-2/3 bg-zinc-700" />
                  <Skeleton className="h-6 w-1/2 bg-zinc-700" />
                </>
              ) : (
                <div className="space-y-6">
                  <div className="rounded-lg border border-zinc-600/20 bg-zinc-800/30 p-6 backdrop-blur-sm">
                    <div className="space-y-2">
                      <Label className="text-zinc-300">Originalitas</Label>
                      <Field className="text-zinc-100">
                        {item?.requirements?.originality ?? "-"}
                      </Field>
                    </div>
                  </div>
                  <div className="rounded-lg border border-zinc-600/20 bg-zinc-800/30 p-6 backdrop-blur-sm">
                    <div className="space-y-2">
                      <Label className="text-zinc-300">Komposisi Tim</Label>
                      <Field className="text-zinc-100">
                        {item?.requirements?.teamComposition ?? "-"}
                      </Field>
                    </div>
                  </div>
                  <div className="rounded-lg border border-zinc-600/20 bg-zinc-800/30 p-6 backdrop-blur-sm">
                    <div className="space-y-2">
                      <Label className="text-zinc-300">Lainnya</Label>
                      <Field className="text-zinc-100">{item?.requirements?.other ?? "-"}</Field>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Evaluation Criteria */}
          <Card className="border border-zinc-600/50 bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 text-white shadow-xl backdrop-blur-sm">
            <CardHeader className="border-b border-zinc-600/30 bg-gradient-to-r from-zinc-800/50 to-zinc-700/30">
              <h4 className="flex items-center gap-3 text-xl font-bold">
                <div className="rounded-full bg-gradient-to-r from-yellow-500 to-orange-600 p-2">
                  <Target className="h-5 w-5 text-white" />
                </div>
                Kriteria Penilaian
              </h4>
            </CardHeader>
            <CardContent className="space-y-6 py-6">
              {isLoading ? (
                <>
                  <Skeleton className="h-6 w-3/5 bg-zinc-700" />
                  <Skeleton className="h-6 w-4/5 bg-zinc-700" />
                </>
              ) : (
                <div className="space-y-6">
                  <div className="rounded-lg border border-zinc-600/20 bg-zinc-800/30 p-6 backdrop-blur-sm">
                    <div className="space-y-2">
                      <Label className="text-zinc-300">Babak Penyisihan</Label>
                      <Field className="text-zinc-100">
                        {item?.evaluationCriteria?.preliminaryRound ?? "-"}
                      </Field>
                    </div>
                  </div>
                  <div className="rounded-lg border border-zinc-600/20 bg-zinc-800/30 p-6 backdrop-blur-sm">
                    <div className="space-y-2">
                      <Label className="text-zinc-300">Babak Final</Label>
                      <Field className="text-zinc-100">
                        {item?.evaluationCriteria?.finalRound ?? "-"}
                      </Field>
                    </div>
                  </div>
                  <div className="rounded-lg border border-zinc-600/20 bg-zinc-800/30 p-6 backdrop-blur-sm">
                    <div className="space-y-2">
                      <Label className="text-zinc-300">Lainnya</Label>
                      <Field className="text-zinc-100">
                        {item?.evaluationCriteria?.other ?? "-"}
                      </Field>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Relevansi */}
          <Card className="border border-zinc-600/50 bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 text-white shadow-xl backdrop-blur-sm">
            <CardHeader className="border-b border-zinc-600/30 bg-gradient-to-r from-zinc-800/50 to-zinc-700/30">
              <h4 className="flex items-center gap-3 text-xl font-bold">
                <div className="rounded-full bg-gradient-to-r from-purple-500 to-pink-600 p-2">
                  <Award className="h-5 w-5 text-white" />
                </div>
                Relevansi
              </h4>
            </CardHeader>
            <CardContent className="grid gap-8 py-6 md:grid-cols-2">
              {isLoading ? (
                <>
                  <Skeleton className="h-6 w-2/3 bg-zinc-700" />
                  <Skeleton className="h-6 w-1/2 bg-zinc-700" />
                </>
              ) : (
                <>
                  <div className="space-y-3 rounded-lg bg-zinc-800/30 p-6 backdrop-blur-sm">
                    <Label className="text-zinc-300">Mata Kuliah Terkait</Label>
                    <Pills items={item?.relevantCourses} />
                  </div>
                  <div className="space-y-3 rounded-lg bg-zinc-800/30 p-6 backdrop-blur-sm">
                    <Label className="text-zinc-300">Keterampilan Terkait</Label>
                    <Pills items={item?.relevantSkills} />
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
