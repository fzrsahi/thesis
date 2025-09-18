"use client";

import { useQuery } from "@tanstack/react-query";
import { BookOpen, Calendar, Globe, MapPin, Tag, Building2 } from "lucide-react";
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
      <Badge key={it} variant="secondary" className="border-zinc-700 bg-zinc-800 text-zinc-100">
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
        <div className="w-full space-y-6 lg:max-h-[78vh] lg:overflow-y-auto lg:pr-3 lg:pb-2">
          {/* Header */}
          <Card className="border-2 border-zinc-700 bg-zinc-900 text-white">
            <CardHeader className="border-b border-zinc-700">
              {isLoading ? (
                <div className="space-y-2">
                  <Skeleton className="h-7 w-2/3" />
                  <Skeleton className="h-4 w-4/5" />
                </div>
              ) : (
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold">{item?.title ?? "-"}</h3>
                    <TypographyP className="text-zinc-400">{item?.description ?? "-"}</TypographyP>
                  </div>
                  {item?.sourceUrl && (
                    <a
                      href={item.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white hover:bg-zinc-700"
                    >
                      <Globe className="h-4 w-4" /> Website
                    </a>
                  )}
                </div>
              )}
            </CardHeader>
            <CardContent className="grid gap-6 py-6 md:grid-cols-2">
              {isLoading ? (
                <>
                  <Skeleton className="h-5 w-2/3" />
                  <Skeleton className="h-5 w-1/2" />
                  <Skeleton className="h-5 w-3/5" />
                  <Skeleton className="h-5 w-1/4" />
                </>
              ) : (
                <>
                  <div className="space-y-1">
                    <Label>Penyelenggara</Label>
                    <Field className="flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-zinc-400" />
                      {item?.organizer ?? "-"}
                    </Field>
                  </div>
                  <div className="space-y-1">
                    <Label>Lokasi</Label>
                    <Field className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-zinc-400" />
                      {item?.location ?? "-"}
                    </Field>
                  </div>
                  <div className="space-y-1">
                    <Label>Bidang</Label>
                    <Pills items={item?.field} />
                  </div>
                  <div className="space-y-1">
                    <Label>Periode</Label>
                    <Field className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-zinc-400" />
                      <span>{item?.startDate ? formatDate(item.startDate) : "-"}</span>
                      <span className="text-zinc-500">s/d</span>
                      <span>{item?.endDate ? formatDate(item.endDate) : "-"}</span>
                    </Field>
                  </div>
                  <div className="space-y-1">
                    <Label>Tipe</Label>
                    <Field className="flex items-center gap-2">
                      <Tag className="h-4 w-4 text-zinc-400" />
                      {item?.type ?? "-"}
                    </Field>
                  </div>
                  <div className="space-y-1">
                    <Label>Minimal GPA</Label>
                    <Field>{item?.minGPA ? item.minGPA : "-"}</Field>
                  </div>
                  <div className="space-y-1">
                    <Label>ID</Label>
                    <Field>{item?.id?.toString() ?? "-"}</Field>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Requirements */}
          <Card className="border-2 border-zinc-700 bg-zinc-900 text-white">
            <CardHeader className="border-b border-zinc-700">
              <h4 className="text-lg font-semibold">Persyaratan</h4>
            </CardHeader>
            <CardContent className="space-y-3 py-4">
              {isLoading ? (
                <>
                  <Skeleton className="h-5 w-2/3" />
                  <Skeleton className="h-5 w-1/2" />
                </>
              ) : (
                <div className="space-y-3">
                  <div>
                    <Label>Originalitas</Label>
                    <Field>{item?.requirements?.originality ?? "-"}</Field>
                  </div>
                  <div>
                    <Label>Komposisi Tim</Label>
                    <Field>{item?.requirements?.teamComposition ?? "-"}</Field>
                  </div>
                  <div>
                    <Label>Lainnya</Label>
                    <Field>{item?.requirements?.other ?? "-"}</Field>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Evaluation Criteria */}
          <Card className="border-2 border-zinc-700 bg-zinc-900 text-white">
            <CardHeader className="border-b border-zinc-700">
              <h4 className="text-lg font-semibold">Kriteria Penilaian</h4>
            </CardHeader>
            <CardContent className="space-y-4 py-4">
              {isLoading ? (
                <>
                  <Skeleton className="h-5 w-3/5" />
                  <Skeleton className="h-5 w-4/5" />
                </>
              ) : (
                <div className="space-y-4">
                  <div>
                    <Label>Babak Penyisihan</Label>
                    <Field>{item?.evaluationCriteria?.preliminaryRound ?? "-"}</Field>
                  </div>
                  <div>
                    <Label>Babak Final</Label>
                    <Field>{item?.evaluationCriteria?.finalRound ?? "-"}</Field>
                  </div>
                  <div>
                    <Label>Lainnya</Label>
                    <Field>{item?.evaluationCriteria?.other ?? "-"}</Field>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Relevansi */}
          <Card className="border-2 border-zinc-700 bg-zinc-900 text-white">
            <CardHeader className="border-b border-zinc-700">
              <h4 className="text-lg font-semibold">Relevansi</h4>
            </CardHeader>
            <CardContent className="grid gap-6 py-4 md:grid-cols-2">
              {isLoading ? (
                <>
                  <Skeleton className="h-5 w-2/3" />
                  <Skeleton className="h-5 w-1/2" />
                </>
              ) : (
                <>
                  <div className="space-y-2">
                    <Label>Mata Kuliah Terkait</Label>
                    <Pills items={item?.relevantCourses} />
                  </div>
                  <div className="space-y-2">
                    <Label>Keterampilan Terkait</Label>
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
