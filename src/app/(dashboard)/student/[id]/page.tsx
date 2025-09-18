"use client";

import { useQuery } from "@tanstack/react-query";
import {
  Award,
  Briefcase,
  GraduationCap,
  Mail,
  User2,
  FileText,
  Info,
  ExternalLink,
} from "lucide-react";
import { useParams } from "next/navigation";

import { getStudentDetail } from "@/client/api/students";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Skeleton from "@/components/ui/skeleton";
import { TypographyH2, TypographyP } from "@/components/ui/typography";

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

const StudentDetailPage = () => {
  const params = useParams<{ id: string }>();
  const id = Number(params.id);

  const { data, isLoading } = useQuery({
    queryKey: ["student-detail", id],
    queryFn: async () => {
      const res = await getStudentDetail(id);
      return res?.data ?? null;
    },
    enabled: Number.isFinite(id),
  });

  const student = data ?? undefined;

  return (
    <div className="w-full">
      <div className="mb-6">
        <TypographyH2 className="flex items-center gap-2 truncate text-zinc-900">
          <User2 className="h-10 w-10 font-extrabold" />
          Detail Mahasiswa
        </TypographyH2>
        <TypographyP className="border-b border-gray-300 pb-4 text-zinc-900">
          Informasi lengkap mengenai mahasiswa yang dipilih.
        </TypographyP>
        <div className="mb-6 border-t border-gray-500" />
      </div>

      <div className="flex justify-center">
        <div className="w-full space-y-8 lg:max-h-[78vh] lg:overflow-y-auto lg:pr-3 lg:pb-2">
          {/* Profil */}
          <Card className="border border-zinc-600/50 bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 text-white shadow-xl backdrop-blur-sm">
            <CardHeader className="border-b border-zinc-600/30 bg-gradient-to-r from-zinc-800/50 to-zinc-700/30">
              {isLoading ? (
                <div className="space-y-3">
                  <Skeleton className="h-8 w-2/3 bg-zinc-700" />
                  <Skeleton className="h-5 w-4/5 bg-zinc-700" />
                </div>
              ) : (
                <div className="space-y-3">
                  <h3 className="flex items-center gap-3 text-2xl font-bold text-white">
                    <div className="rounded-full bg-gradient-to-r from-blue-500 to-purple-600 p-2">
                      <GraduationCap className="h-6 w-6 text-white" />
                    </div>
                    {student?.user?.name ?? "-"}
                  </h3>
                  <TypographyP className="text-lg text-zinc-300">
                    NIM: {student?.studentId ?? "-"}
                  </TypographyP>
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
                    <Label className="text-zinc-300">Email</Label>
                    <Field className="flex items-center gap-2 text-zinc-100">
                      <Mail className="h-4 w-4 text-blue-400" />
                      {student?.user?.email ?? "-"}
                    </Field>
                  </div>
                  <div className="space-y-2 rounded-lg bg-zinc-800/30 p-4 backdrop-blur-sm">
                    <Label className="text-zinc-300">IPK</Label>
                    <Field className="text-zinc-100">{student?.gpa ?? "-"}</Field>
                  </div>
                  <div className="space-y-2 rounded-lg bg-zinc-800/30 p-4 backdrop-blur-sm">
                    <Label className="text-zinc-300">ID</Label>
                    <Field className="text-zinc-100">{student?.id?.toString() ?? "-"}</Field>
                  </div>
                  <div className="space-y-2 rounded-lg bg-zinc-800/30 p-4 backdrop-blur-sm">
                    <Label className="text-zinc-300">Dibuat</Label>
                    <Field className="text-zinc-100">
                      {student?.createdAt ? new Date(student.createdAt).toLocaleString() : "-"}
                    </Field>
                  </div>
                  <div className="space-y-2 rounded-lg bg-zinc-800/30 p-4 backdrop-blur-sm">
                    <Label className="text-zinc-300">Diperbarui</Label>
                    <Field className="text-zinc-100">
                      {student?.updatedAt ? new Date(student.updatedAt).toLocaleString() : "-"}
                    </Field>
                  </div>
                  <div className="space-y-2 rounded-lg bg-zinc-800/30 p-4 backdrop-blur-sm">
                    <Label className="text-zinc-300">Minat</Label>
                    <Pills items={student?.interests} />
                  </div>
                  <div className="space-y-2 rounded-lg bg-zinc-800/30 p-4 backdrop-blur-sm">
                    <Label className="text-zinc-300">Keahlian</Label>
                    <Pills items={student?.skills} />
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Transkrip */}
          <Card className="border border-zinc-600/50 bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 text-white shadow-xl backdrop-blur-sm">
            <CardHeader className="border-b border-zinc-600/30 bg-gradient-to-r from-zinc-800/50 to-zinc-700/30">
              <h4 className="flex items-center gap-3 text-xl font-bold">
                <div className="rounded-full bg-gradient-to-r from-green-500 to-emerald-600 p-2">
                  <FileText className="h-5 w-5 text-white" />
                </div>
                Transkrip
              </h4>
            </CardHeader>
            <CardContent className="space-y-4 py-6">
              {isLoading ? (
                <>
                  <Skeleton className="h-6 w-2/3 bg-zinc-700" />
                  <Skeleton className="h-6 w-1/2 bg-zinc-700" />
                </>
              ) : (student?.transcript ?? []).length === 0 ? (
                <div className="py-8 text-center text-zinc-400">Belum ada transkrip</div>
              ) : (
                <div className="space-y-4">
                  {(student?.transcript ?? []).map((t, idx) => (
                    <div
                      key={t?.id}
                      className="group rounded-xl border border-zinc-600/30 bg-zinc-800/30 p-6 shadow-lg backdrop-blur-sm transition-all hover:bg-zinc-800/40 hover:shadow-2xl md:p-7"
                      style={{
                        borderLeftWidth: 6,
                        borderLeftColor: idx % 2 === 0 ? "#60a5fa66" : "#a78bfa66",
                      }}
                    >
                      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-500/30 to-purple-600/30 px-3 py-1 text-sm font-medium text-zinc-100 ring-1 ring-zinc-600/40">
                            Semester
                            <span className="rounded bg-zinc-900/60 px-2 py-0.5 text-zinc-100 ring-1 ring-zinc-600/40">
                              {t?.semester ?? "-"}
                            </span>
                          </span>
                        </div>
                        {t?.fileUrl ? (
                          <a
                            href={t.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center rounded-full bg-zinc-900/60 px-3 py-1 text-xs text-blue-300 ring-1 ring-zinc-600/40 hover:underline"
                          >
                            Lihat File
                          </a>
                        ) : (
                          <span className="inline-flex items-center rounded-full bg-zinc-900/60 px-3 py-1 text-xs text-zinc-200 ring-1 ring-zinc-600/40">
                            File ID: {t?.fileId ?? "-"}
                          </span>
                        )}
                      </div>

                      <div>
                        <Label className="text-zinc-300">Teks Transkrip</Label>
                        <div className="mt-2 max-h-64 overflow-y-auto rounded-lg border border-zinc-600/40 bg-gradient-to-br from-zinc-900/70 to-zinc-800/60 ring-1 ring-zinc-600/20">
                          <pre className="p-4 font-mono text-[15px] leading-relaxed whitespace-pre-wrap text-zinc-100 selection:bg-blue-500/30 md:text-[16px]">
                            {t?.transcriptText ?? "-"}
                          </pre>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Prestasi */}
          <Card className="border border-zinc-600/50 bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 text-white shadow-xl backdrop-blur-sm">
            <CardHeader className="border-b border-zinc-600/30 bg-gradient-to-r from-zinc-800/50 to-zinc-700/30">
              <h4 className="flex items-center gap-3 text-xl font-bold">
                <div className="rounded-full bg-gradient-to-r from-yellow-500 to-orange-600 p-2">
                  <Award className="h-5 w-5 text-white" />
                </div>
                Prestasi
              </h4>
            </CardHeader>
            <CardContent className="space-y-4 py-6">
              {isLoading ? (
                <>
                  <Skeleton className="h-6 w-2/3 bg-zinc-700" />
                  <Skeleton className="h-6 w-1/2 bg-zinc-700" />
                </>
              ) : (student?.achievements ?? []).length === 0 ? (
                <div className="py-8 text-center text-zinc-400">Belum ada prestasi</div>
              ) : (
                <div className="space-y-4">
                  {(student?.achievements ?? []).map((a) => (
                    <div
                      key={a?.id}
                      className="rounded-lg border border-zinc-600/20 bg-zinc-800/30 p-6 backdrop-blur-sm"
                    >
                      <div className="grid gap-4 md:grid-cols-3">
                        <div className="space-y-1">
                          <Label className="text-zinc-300">Judul</Label>
                          <Field className="font-medium text-zinc-100">{a?.title ?? "-"}</Field>
                        </div>
                        <div className="space-y-1">
                          <Label className="text-zinc-300">Deskripsi</Label>
                          <Field className="text-zinc-100">{a?.description ?? ""}</Field>
                        </div>
                        <div className="space-y-1">
                          <Label className="text-zinc-300">Tanggal</Label>
                          <Field className="text-zinc-100">
                            {a?.date ? new Date(a.date).toLocaleDateString() : ""}
                          </Field>
                          <div className="text-xs text-zinc-400">
                            {a?.createdAt ? new Date(a.createdAt).toLocaleString() : ""}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Pengalaman */}
          <Card className="border border-zinc-600/50 bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 text-white shadow-xl backdrop-blur-sm">
            <CardHeader className="border-b border-zinc-600/30 bg-gradient-to-r from-zinc-800/50 to-zinc-700/30">
              <h4 className="flex items-center gap-3 text-xl font-bold">
                <div className="rounded-full bg-gradient-to-r from-purple-500 to-pink-600 p-2">
                  <Briefcase className="h-5 w-5 text-white" />
                </div>
                Pengalaman
              </h4>
            </CardHeader>
            <CardContent className="space-y-4 py-6">
              {isLoading ? (
                <>
                  <Skeleton className="h-6 w-2/3 bg-zinc-700" />
                  <Skeleton className="h-6 w-1/2 bg-zinc-700" />
                </>
              ) : (student?.experiences ?? []).length === 0 ? (
                <div className="py-8 text-center text-zinc-400">Belum ada pengalaman</div>
              ) : (
                <div className="space-y-4">
                  {(student?.experiences ?? []).map((e) => (
                    <div
                      key={e?.id}
                      className="rounded-lg border border-zinc-600/20 bg-zinc-800/30 p-6 backdrop-blur-sm"
                    >
                      <div className="grid gap-4 md:grid-cols-3">
                        <div className="space-y-1">
                          <Label className="text-zinc-300">Posisi</Label>
                          <Field className="font-medium text-zinc-100">{e?.position ?? "-"}</Field>
                        </div>
                        <div className="space-y-1">
                          <Label className="text-zinc-300">Organisasi</Label>
                          <Field className="text-zinc-100">{e?.organization ?? ""}</Field>
                        </div>
                        <div className="space-y-1">
                          <Label className="text-zinc-300">Periode</Label>
                          <Field className="text-zinc-100">
                            {[
                              e?.startDate ? new Date(e.startDate).toLocaleDateString() : "",
                              e?.endDate ? new Date(e.endDate).toLocaleDateString() : "",
                            ]
                              .filter(Boolean)
                              .join(" - ")}
                          </Field>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Rekomendasi */}
          <Card className="border border-zinc-600/50 bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 text-white shadow-xl backdrop-blur-sm">
            <CardHeader className="border-b border-zinc-600/30 bg-gradient-to-r from-zinc-800/50 to-zinc-700/30">
              <h4 className="flex items-center gap-3 text-xl font-bold">
                <div className="rounded-full bg-gradient-to-r from-indigo-500 to-blue-600 p-2">
                  <Info className="h-5 w-5 text-white" />
                </div>
                Rekomendasi
              </h4>
            </CardHeader>
            <CardContent className="space-y-6 py-6">
              {isLoading ? (
                <>
                  <Skeleton className="h-6 w-2/3 bg-zinc-700" />
                  <Skeleton className="h-6 w-1/2 bg-zinc-700" />
                </>
              ) : (student?.recommendations ?? []).length === 0 ? (
                <div className="py-8 text-center text-zinc-400">Belum ada rekomendasi</div>
              ) : (
                <div className="space-y-6">
                  {(student?.recommendations ?? []).map((r) => (
                    <div
                      key={r?.id}
                      className="rounded-lg border border-zinc-600/30 bg-zinc-800/20 p-6 backdrop-blur-sm"
                    >
                      <div className="grid gap-6 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label className="text-zinc-300">Ringkasan Mahasiswa</Label>
                          <Field className="text-zinc-100">{r?.studentSummary ?? "-"}</Field>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-zinc-300">Assessment Umum</Label>
                          <Field className="text-zinc-100">{r?.overallAssessment ?? "-"}</Field>
                        </div>
                      </div>

                      <div className="mt-6 space-y-3">
                        <Label className="text-zinc-300">Saran Pengembangan</Label>
                        {(r?.developmentSuggestions ?? []).length === 0 ? (
                          <div className="text-zinc-400">-</div>
                        ) : (
                          <div className="space-y-3">
                            {(r?.developmentSuggestions ?? []).map((d) => (
                              <div
                                key={d?.id}
                                className="rounded-lg border border-zinc-600/20 bg-zinc-800/30 p-4 backdrop-blur-sm"
                              >
                                <div className="flex items-start gap-3">
                                  <span className="rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 px-3 py-1 text-xs font-medium tracking-wide text-white uppercase">
                                    {d?.type ?? ""}
                                  </span>
                                  <div className="flex-1">
                                    <a
                                      href={d?.link ?? "#"}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center gap-2 text-blue-400 transition-colors hover:text-blue-300"
                                    >
                                      {d?.title ?? "Sumber"}
                                      <ExternalLink className="h-4 w-4" />
                                    </a>
                                    {d?.reason ? (
                                      <p className="mt-1 text-sm text-zinc-300">{d.reason}</p>
                                    ) : null}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="mt-6 space-y-3">
                        <Label className="text-zinc-300">Profil Keahlian</Label>
                        {(r?.skillsProfiles ?? []).length === 0 ? (
                          <div className="text-zinc-400">-</div>
                        ) : (
                          <div className="grid gap-3 md:grid-cols-2">
                            {(r?.skillsProfiles ?? []).map((s) => (
                              <div
                                key={s?.id}
                                className="rounded-lg border border-zinc-600/20 bg-zinc-800/30 p-4 backdrop-blur-sm"
                              >
                                <div className="mb-2 flex items-center justify-between">
                                  <div className="font-medium text-zinc-100">
                                    {s?.skillName ?? "-"}
                                  </div>
                                  <div className="text-sm font-bold text-blue-400">
                                    {typeof s?.score === "number" ? s.score.toFixed(2) : "-"}
                                  </div>
                                </div>
                                {s?.breakdown ? (
                                  <div className="text-sm text-zinc-300">{s.breakdown}</div>
                                ) : null}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="mt-6 space-y-3">
                        <Label className="text-zinc-300">Rekomendasi Kompetisi (Raw)</Label>
                        {(r?.competitionRecommendations ?? []).length === 0 ? (
                          <div className="text-zinc-400">-</div>
                        ) : (
                          <div className="max-h-64 overflow-y-auto">
                            <pre className="rounded-lg border border-zinc-600/50 bg-zinc-900/50 p-4 text-xs whitespace-pre-wrap text-zinc-200 backdrop-blur-sm">
                              {JSON.stringify(r?.competitionRecommendations, null, 2)}
                            </pre>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default StudentDetailPage;
