"use client";

import { useQuery } from "@tanstack/react-query";
import { Award, Briefcase, GraduationCap, Mail, User2, FileText } from "lucide-react";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";

import { getStudentDetail } from "@/client/api/students";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Skeleton from "@/components/ui/skeleton";
import { TypographyH2, TypographyP } from "@/components/ui/typography";
import { cn } from "@/lib/utils";

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

const StudentDetailPage = () => {
  const params = useParams<{ id: string }>();
  const id = Number(params.id);
  const [isLight, setIsLight] = useState<boolean>(true);

  const { data, isLoading } = useQuery({
    queryKey: ["student-detail", id],
    queryFn: async () => {
      const res = await getStudentDetail(id);
      return res?.data ?? null;
    },
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

  const student = data ?? undefined;
  type StudentExtra = { studyProgram?: { name?: string } | null; entryYear?: number | null };
  const sExtra = student as unknown as StudentExtra;

  const textPrimary = isLight ? "text-[#2F2A24]" : "text-white";
  const textSecondary = isLight ? "text-[#5C5245]" : "text-zinc-400";
  const borderColor = isLight ? "border-stone-300" : "border-gray-500";

  return (
    <div className="w-full">
      <div className="mb-6">
        <TypographyH2 className={cn("flex items-center gap-2 truncate", textPrimary)}>
          <User2 className="h-10 w-10 font-extrabold" />
          Detail Mahasiswa
        </TypographyH2>
        <TypographyP className={cn("border-b pb-4", borderColor, textSecondary)}>
          Informasi lengkap mengenai mahasiswa yang dipilih.
        </TypographyP>
        <div className={cn("mb-6 border-t", borderColor)} />
      </div>

      <div className="flex justify-center">
        <div className="w-full space-y-8 lg:max-h-[78vh] lg:overflow-y-auto lg:pr-3 lg:pb-2">
          {/* Profil */}
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
                <div className="space-y-3">
                  <h3
                    className={cn(
                      "flex items-center gap-3 text-2xl font-bold",
                      isLight ? "text-[#2F2A24]" : "text-white"
                    )}
                  >
                    <div className="rounded-full bg-gradient-to-r from-blue-500 to-purple-600 p-2">
                      <GraduationCap className="h-6 w-6 text-white" />
                    </div>
                    {student?.user?.name ?? "-"}
                  </h3>
                  <TypographyP
                    className={cn("text-lg", isLight ? "text-[#5C5245]" : "text-zinc-300")}
                  >
                    NIM: {student?.studentId ?? "-"}
                  </TypographyP>
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
                    <Label isLight={isLight}>Email</Label>
                    <Field isLight={isLight} className="flex items-center gap-2">
                      <Mail
                        className={cn("h-4 w-4", isLight ? "text-blue-600" : "text-blue-400")}
                      />
                      {student?.user?.email ?? "-"}
                    </Field>
                  </div>
                  <div
                    className={cn(
                      "space-y-2 rounded-lg p-4 backdrop-blur-sm transition-colors",
                      isLight ? "bg-stone-50/80" : "bg-zinc-800/30"
                    )}
                  >
                    <Label isLight={isLight}>IPK</Label>
                    <Field isLight={isLight}>{student?.gpa ?? "-"}</Field>
                  </div>
                  <div
                    className={cn(
                      "space-y-2 rounded-lg p-4 backdrop-blur-sm transition-colors",
                      isLight ? "bg-stone-50/80" : "bg-zinc-800/30"
                    )}
                  >
                    <Label isLight={isLight}>Program Studi</Label>
                    <Field isLight={isLight}>{sExtra?.studyProgram?.name ?? "-"}</Field>
                  </div>
                  <div
                    className={cn(
                      "space-y-2 rounded-lg p-4 backdrop-blur-sm transition-colors",
                      isLight ? "bg-stone-50/80" : "bg-zinc-800/30"
                    )}
                  >
                    <Label isLight={isLight}>Angkatan</Label>
                    <Field isLight={isLight}>{sExtra?.entryYear ?? "-"}</Field>
                  </div>
                  <div
                    className={cn(
                      "space-y-2 rounded-lg p-4 backdrop-blur-sm transition-colors",
                      isLight ? "bg-stone-50/80" : "bg-zinc-800/30"
                    )}
                  >
                    <Label isLight={isLight}>ID</Label>
                    <Field isLight={isLight}>{student?.id?.toString() ?? "-"}</Field>
                  </div>
                  <div
                    className={cn(
                      "space-y-2 rounded-lg p-4 backdrop-blur-sm transition-colors",
                      isLight ? "bg-stone-50/80" : "bg-zinc-800/30"
                    )}
                  >
                    <Label isLight={isLight}>Dibuat</Label>
                    <Field isLight={isLight}>
                      {student?.createdAt ? new Date(student.createdAt).toLocaleString() : "-"}
                    </Field>
                  </div>
                  <div
                    className={cn(
                      "space-y-2 rounded-lg p-4 backdrop-blur-sm transition-colors",
                      isLight ? "bg-stone-50/80" : "bg-zinc-800/30"
                    )}
                  >
                    <Label isLight={isLight}>Diperbarui</Label>
                    <Field isLight={isLight}>
                      {student?.updatedAt ? new Date(student.updatedAt).toLocaleString() : "-"}
                    </Field>
                  </div>
                  <div
                    className={cn(
                      "space-y-2 rounded-lg p-4 backdrop-blur-sm transition-colors",
                      isLight ? "bg-stone-50/80" : "bg-zinc-800/30"
                    )}
                  >
                    <Label isLight={isLight}>Minat</Label>
                    <Pills items={student?.interests} isLight={isLight} />
                  </div>
                  <div
                    className={cn(
                      "space-y-2 rounded-lg p-4 backdrop-blur-sm transition-colors",
                      isLight ? "bg-stone-50/80" : "bg-zinc-800/30"
                    )}
                  >
                    <Label isLight={isLight}>Keahlian</Label>
                    <Pills items={student?.skills} isLight={isLight} />
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Transkrip */}
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
                  <FileText className="h-5 w-5 text-white" />
                </div>
                Transkrip
              </h4>
            </CardHeader>
            <CardContent className="space-y-4 py-6">
              {isLoading ? (
                <>
                  <Skeleton className={cn("h-6 w-2/3", isLight ? "bg-stone-200" : "bg-zinc-700")} />
                  <Skeleton className={cn("h-6 w-1/2", isLight ? "bg-stone-200" : "bg-zinc-700")} />
                </>
              ) : (student?.transcript ?? []).length === 0 ? (
                <div
                  className={cn("py-8 text-center", isLight ? "text-[#5C5245]" : "text-zinc-400")}
                >
                  Belum ada transkrip
                </div>
              ) : (
                <div className="space-y-4">
                  {(student?.transcript ?? []).map((t, idx) => (
                    <div
                      key={t?.id}
                      className={cn(
                        "group rounded-xl border p-6 shadow-lg backdrop-blur-sm transition-all hover:shadow-2xl md:p-7",
                        isLight
                          ? "border-stone-300/50 bg-stone-50/80 hover:bg-stone-100/80"
                          : "border-zinc-600/30 bg-zinc-800/30 hover:bg-zinc-800/40"
                      )}
                      style={{
                        borderLeftWidth: 6,
                        borderLeftColor: idx % 2 === 0 ? "#60a5fa66" : "#a78bfa66",
                      }}
                    >
                      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <span
                            className={cn(
                              "inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium ring-1",
                              isLight
                                ? "bg-blue-100/80 text-blue-900 ring-blue-200/40"
                                : "bg-gradient-to-r from-blue-500/30 to-purple-600/30 text-zinc-100 ring-zinc-600/40"
                            )}
                          >
                            Semester
                            <span
                              className={cn(
                                "rounded px-2 py-0.5 ring-1",
                                isLight
                                  ? "bg-blue-200/60 text-blue-900 ring-blue-300/40"
                                  : "bg-zinc-900/60 text-zinc-100 ring-zinc-600/40"
                              )}
                            >
                              {t?.semester ?? "-"}
                            </span>
                          </span>
                        </div>
                        {t?.fileUrl ? (
                          <a
                            href={t.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={cn(
                              "inline-flex items-center rounded-full px-3 py-1 text-xs ring-1 transition-colors hover:underline",
                              isLight
                                ? "bg-blue-50/80 text-blue-700 ring-blue-200/40 hover:bg-blue-100/80"
                                : "bg-zinc-900/60 text-blue-300 ring-zinc-600/40"
                            )}
                          >
                            Lihat File
                          </a>
                        ) : (
                          <span
                            className={cn(
                              "inline-flex items-center rounded-full px-3 py-1 text-xs ring-1",
                              isLight
                                ? "bg-stone-100/80 text-[#5C5245] ring-stone-300/40"
                                : "bg-zinc-900/60 text-zinc-200 ring-zinc-600/40"
                            )}
                          >
                            File ID: {t?.fileId ?? "-"}
                          </span>
                        )}
                      </div>

                      <div>
                        <Label isLight={isLight}>Teks Transkrip</Label>
                        <div
                          className={cn(
                            "mt-2 max-h-64 overflow-y-auto rounded-lg border ring-1",
                            isLight
                              ? "border-stone-300/50 bg-stone-50/80 ring-stone-200/40"
                              : "border-zinc-600/40 bg-gradient-to-br from-zinc-900/70 to-zinc-800/60 ring-zinc-600/20"
                          )}
                        >
                          <pre
                            className={cn(
                              "p-4 font-mono text-[15px] leading-relaxed whitespace-pre-wrap selection:bg-blue-500/30 md:text-[16px]",
                              isLight ? "text-[#2F2A24]" : "text-zinc-100"
                            )}
                          >
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
                  <Award className="h-5 w-5 text-white" />
                </div>
                Prestasi
              </h4>
            </CardHeader>
            <CardContent className="space-y-4 py-6">
              {isLoading ? (
                <>
                  <Skeleton className={cn("h-6 w-2/3", isLight ? "bg-stone-200" : "bg-zinc-700")} />
                  <Skeleton className={cn("h-6 w-1/2", isLight ? "bg-stone-200" : "bg-zinc-700")} />
                </>
              ) : (student?.achievements ?? []).length === 0 ? (
                <div
                  className={cn("py-8 text-center", isLight ? "text-[#5C5245]" : "text-zinc-400")}
                >
                  Belum ada prestasi
                </div>
              ) : (
                <div className="space-y-4">
                  {(student?.achievements ?? []).map((a) => (
                    <div
                      key={a?.id}
                      className={cn(
                        "rounded-lg border p-6 backdrop-blur-sm transition-colors",
                        isLight
                          ? "border-stone-300/50 bg-stone-50/80"
                          : "border-zinc-600/20 bg-zinc-800/30"
                      )}
                    >
                      <div className="grid gap-4 md:grid-cols-3">
                        <div className="space-y-1">
                          <Label isLight={isLight}>Judul</Label>
                          <Field isLight={isLight}>{a?.title ?? "-"}</Field>
                        </div>
                        <div className="space-y-1">
                          <Label isLight={isLight}>Deskripsi</Label>
                          <Field isLight={isLight}>{a?.description ?? ""}</Field>
                        </div>
                        <div className="space-y-1">
                          <Label isLight={isLight}>Tanggal</Label>
                          <Field isLight={isLight}>
                            {a?.date ? new Date(a.date).toLocaleDateString() : ""}
                          </Field>
                          <div
                            className={cn("text-xs", isLight ? "text-[#5C5245]" : "text-zinc-400")}
                          >
                            {a?.createdAt ? new Date(a.createdAt).toLocaleString() : ""}
                          </div>
                        </div>
                      </div>
                      {a?.fileUrl && (
                        <div
                          className={cn(
                            "mt-3 flex items-center justify-between rounded-md border p-2 transition-colors",
                            isLight
                              ? "border-stone-300/70 bg-stone-100/80"
                              : "border-zinc-700 bg-zinc-900/50"
                          )}
                        >
                          <span
                            className={cn("text-xs", isLight ? "text-[#5C5245]" : "text-zinc-300")}
                          >
                            Bukti prestasi
                          </span>
                          <a
                            href={a.fileUrl as string}
                            target="_blank"
                            rel="noreferrer"
                            className={cn(
                              "rounded-md px-3 py-1 text-xs text-white transition-colors",
                              isLight
                                ? "bg-blue-600 hover:bg-blue-700"
                                : "bg-zinc-700 hover:bg-zinc-600"
                            )}
                          >
                            View
                          </a>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Pengalaman */}
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
                  <Briefcase className="h-5 w-5 text-white" />
                </div>
                Pengalaman
              </h4>
            </CardHeader>
            <CardContent className="space-y-4 py-6">
              {isLoading ? (
                <>
                  <Skeleton className={cn("h-6 w-2/3", isLight ? "bg-stone-200" : "bg-zinc-700")} />
                  <Skeleton className={cn("h-6 w-1/2", isLight ? "bg-stone-200" : "bg-zinc-700")} />
                </>
              ) : (student?.experiences ?? []).length === 0 ? (
                <div
                  className={cn("py-8 text-center", isLight ? "text-[#5C5245]" : "text-zinc-400")}
                >
                  Belum ada pengalaman
                </div>
              ) : (
                <div className="space-y-4">
                  {(student?.experiences ?? []).map((e) => (
                    <div
                      key={e?.id}
                      className={cn(
                        "rounded-lg border p-6 backdrop-blur-sm transition-colors",
                        isLight
                          ? "border-stone-300/50 bg-stone-50/80"
                          : "border-zinc-600/20 bg-zinc-800/30"
                      )}
                    >
                      <div className="grid gap-4 md:grid-cols-3">
                        <div className="space-y-1">
                          <Label isLight={isLight}>Posisi</Label>
                          <Field isLight={isLight} className="font-medium">
                            {e?.position ?? "-"}
                          </Field>
                        </div>
                        <div className="space-y-1">
                          <Label isLight={isLight}>Organisasi</Label>
                          <Field isLight={isLight}>{e?.organization ?? ""}</Field>
                        </div>
                        <div className="space-y-1">
                          <Label isLight={isLight}>Periode</Label>
                          <Field isLight={isLight}>
                            {[
                              e?.startDate ? new Date(e.startDate).toLocaleDateString() : "",
                              e?.endDate ? new Date(e.endDate).toLocaleDateString() : "",
                            ]
                              .filter(Boolean)
                              .join(" - ")}
                          </Field>
                        </div>
                      </div>
                      {e?.fileUrl && (
                        <div
                          className={cn(
                            "mt-3 flex items-center justify-between rounded-md border p-2 transition-colors",
                            isLight
                              ? "border-stone-300/70 bg-stone-100/80"
                              : "border-zinc-700 bg-zinc-900/50"
                          )}
                        >
                          <span
                            className={cn("text-xs", isLight ? "text-[#5C5245]" : "text-zinc-300")}
                          >
                            Bukti pengalaman
                          </span>
                          <a
                            href={e.fileUrl as string}
                            target="_blank"
                            rel="noreferrer"
                            className={cn(
                              "rounded-md px-3 py-1 text-xs text-white transition-colors",
                              isLight
                                ? "bg-blue-600 hover:bg-blue-700"
                                : "bg-zinc-700 hover:bg-zinc-600"
                            )}
                          >
                            View
                          </a>
                        </div>
                      )}
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
