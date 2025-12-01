"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Users, Filter } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

import { ADVISOR_TYPES, ROLES } from "@/app/shared/const/role";
import { StudentSchema, type StudentPayload } from "@/app/shared/schema/student/StudentSchema";
import {
  createStudent,
  deleteStudent,
  getStudentDetail,
  getStudyPrograms,
} from "@/client/api/students";
import Button from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import Input from "@/components/ui/input";
import Pagination from "@/components/ui/pagination";
import { TypographyH2, TypographyP } from "@/components/ui/typography";
import { cn } from "@/lib/utils";

import { StudentAddModal } from "./components/StudentAddModal";
import { StudentDeleteModal } from "./components/StudentDeleteModal";
import { StudentDetailModal } from "./components/StudentDetailModal";
import { StudentEditModal } from "./components/StudentEditModal";
import { StudentResetPasswordModal } from "./components/StudentResetPasswordModal";
import { useStudentList } from "./hooks/useStudentList";

const StudentPage = () => {
  const { data: session } = useSession();
  const [isLight, setIsLight] = useState<boolean>(true);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [resetPasswordOpen, setResetPasswordOpen] = useState(false);
  const [entryYear, setEntryYear] = useState<string>("");
  const [studyProgramId, setStudyProgramId] = useState<string>("");
  const [showFilters, setShowFilters] = useState(false);
  const [editDefaults, setEditDefaults] = useState<Partial<StudentPayload> | null>(null);

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
  const { search, setSearch, tableRef, tableData, columns, pagination, handlePageChange } =
    useStudentList({
      onDelete: (id: number) => {
        setSelectedId(id);
        setDeleteOpen(true);
      },
      onEdit: (item) => {
        setEditDefaults({
          name: item.name,
          email: item.email,
          studentId: item.nim,
        });
        setEditOpen(true);
      },
      onResetPassword: (item) => {
        setResetPasswordData({
          id: item.id,
          name: item.name,
          studentId: item.nim,
        });
        setResetPasswordOpen(true);
      },
      entryYear: entryYear ? Number(entryYear) : undefined,
      studyProgramId: studyProgramId ? Number(studyProgramId) : undefined,
      isLight,
    });

  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [resetPasswordData, setResetPasswordData] = useState<{
    id: number;
    name: string;
    studentId: string;
  } | null>(null);

  const { data: detailData, isLoading: isDetailLoading } = useQuery({
    queryKey: ["student-detail", selectedId],
    queryFn: async () => {
      if (selectedId == null) return null;
      const res = await getStudentDetail(selectedId);
      return res?.data ?? null;
    },
    enabled: selectedId != null && detailOpen,
  });

  const { data: studyPrograms } = useQuery({
    queryKey: ["study-programs"],
    queryFn: async () => {
      const res = await getStudyPrograms();
      return res?.data ?? [];
    },
  });

  const canFilterStudyProgram =
    session?.user?.role === ROLES.ADMIN ||
    session?.user?.advisorType === ADVISOR_TYPES.HEAD_OF_DEPARTMENT;

  // Keep list in sync by invalidating when filters change
  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ["students"] });
  }, [entryYear, studyProgramId, queryClient]);

  const { mutateAsync: doCreate, isPending } = useMutation({
    mutationFn: async (payload: StudentPayload) => {
      // Ensure payload matches schema
      const parsed = StudentSchema.parse(payload);
      // Map to API request shape (ensure required fields exist)
      return createStudent({
        name: parsed.name,
        email: parsed.email,
        studentId: parsed.studentId,
        studyProgramId: 1,
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["students"] });
    },
  });

  const { mutateAsync: doDelete, isPending: isDeleting } = useMutation({
    mutationFn: async (id: number) => deleteStudent(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["students"] });
    },
  });

  const handleCreate = async (values: StudentPayload) => {
    const res = await doCreate(values);
    return res?.success === true;
  };

  const handleConfirmDelete = async () => {
    if (selectedId == null) return false;
    const res = await doDelete(selectedId);
    return res?.success === true;
  };

  const handleResetPassword = async () => {
    if (!resetPasswordData) return false;
    // Simulate API call
    await new Promise<void>((resolve) => {
      setTimeout(() => resolve(), 1000);
    });
    // For now, just return true to simulate success
    return true;
  };

  const modalVariant = isLight ? "light" : "dark";
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

  return (
    <div className="flex h-full flex-col">
      <div className="mb-6 flex-shrink-0">
        <TypographyH2 className={cn("flex items-center gap-2 truncate", textPrimary)}>
          <Users className="h-10 w-10 font-extrabold" />
          Daftar Mahasiswa
        </TypographyH2>
        <TypographyP className={cn("border-b pb-4", borderColor, textSecondary)}>
          Kelola data mahasiswa dengan mudah dan efisien.
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
            {/* Search and Filters */}
            <div className="flex gap-2">
              <Input
                placeholder="Cari mahasiswa..."
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
            <Button
              variant="outline"
              className={cn(
                "transition-colors",
                isLight
                  ? "border-stone-400/70 bg-gradient-to-r from-[#F6A964] to-[#E36C3A] text-white hover:from-[#F2A558] hover:to-[#D86330]"
                  : "border-gray-600 bg-gray-600 text-white hover:border-gray-700 hover:bg-gray-700"
              )}
              onClick={() => setOpen(true)}
            >
              + Tambah Mahasiswa
            </Button>
          </CardHeader>

          {/* Filters Panel */}
          {showFilters && (
            <div className={cn("flex-shrink-0 border-b p-4", filterBorder, filterBg)}>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
                    value={entryYear}
                    onChange={(e) => setEntryYear(e.target.value)}
                    className={cn("transition-colors", filterInput)}
                  />
                </div>
                {canFilterStudyProgram && (
                  <div>
                    <label
                      htmlFor="study-program"
                      className={cn("mb-2 block text-sm font-medium", filterLabel)}
                    >
                      Program Studi
                    </label>
                    <select
                      id="study-program"
                      value={studyProgramId}
                      onChange={(e) => setStudyProgramId(e.target.value)}
                      className={cn(
                        "w-full rounded-md border px-3 py-2 transition-colors",
                        filterInput
                      )}
                    >
                      <option value="">Semua Program Studi</option>
                      {(studyPrograms ?? []).map((sp) => (
                        <option key={sp.id} value={sp.id}>
                          {sp.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
                <div className="flex items-end">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setEntryYear("");
                      setStudyProgramId("");
                    }}
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
              <DataTable columns={columns} data={tableData} isLight={isLight} />
            </div>
            <div className="flex-shrink-0">
              <Pagination pagination={pagination} onPageChange={handlePageChange} />
            </div>
          </CardContent>
        </Card>
      </div>
      <StudentAddModal
        open={open}
        onOpenChange={setOpen}
        onSubmit={handleCreate}
        submitText={isPending ? "Menyimpan..." : "Tambah"}
        variant={modalVariant}
      />
      <StudentDetailModal
        open={detailOpen}
        onOpenChange={(v) => {
          setDetailOpen(v);
          if (!v) setSelectedId(null);
        }}
        data={detailData ?? null}
        isLoading={isDetailLoading}
      />
      <StudentEditModal
        open={editOpen}
        onOpenChange={(v) => {
          setEditOpen(v);
          if (!v) setEditDefaults(null);
        }}
        onSubmit={async () => true}
        defaultValues={editDefaults ?? undefined}
        title="Edit Mahasiswa"
        submitText="Simpan"
        variant={modalVariant}
      />
      <StudentDeleteModal
        open={deleteOpen}
        onOpenChange={(v) => {
          setDeleteOpen(v);
          if (!v) setSelectedId(null);
        }}
        onConfirm={handleConfirmDelete}
        confirmText={isDeleting ? "Menghapus..." : "Hapus"}
        variant={modalVariant}
      />
      <StudentResetPasswordModal
        open={resetPasswordOpen}
        onOpenChange={(v) => {
          setResetPasswordOpen(v);
          if (!v) setResetPasswordData(null);
        }}
        onSubmit={handleResetPassword}
        studentName={resetPasswordData?.name}
        studentId={resetPasswordData?.studentId}
        submitText="Reset Password"
      />
    </div>
  );
};

export default StudentPage;
