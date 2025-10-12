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

import { StudentAddModal } from "./components/StudentAddModal";
import { StudentDeleteModal } from "./components/StudentDeleteModal";
import { StudentDetailModal } from "./components/StudentDetailModal";
import { useStudentList } from "./hooks/useStudentList";

const StudentPage = () => {
  const { data: session } = useSession();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [entryYear, setEntryYear] = useState<string>("");
  const [studyProgramId, setStudyProgramId] = useState<string>("");
  const [showFilters, setShowFilters] = useState(false);
  const { search, setSearch, tableRef, tableData, columns, pagination, handlePageChange } =
    useStudentList({
      onDelete: (id: number) => {
        setSelectedId(id);
        setDeleteOpen(true);
      },
      entryYear: entryYear ? Number(entryYear) : undefined,
      studyProgramId: studyProgramId ? Number(studyProgramId) : undefined,
    });

  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);

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

  return (
    <div className="w-full">
      <div className="mb-6">
        <TypographyH2 className="flex items-center gap-2 truncate text-zinc-900">
          <Users className="h-10 w-10 font-extrabold" />
          Daftar Mahasiswa
        </TypographyH2>
        <TypographyP className="border-b border-gray-300 pb-4 text-zinc-900">
          Kelola data mahasiswa dengan mudah dan efisien.
        </TypographyP>
        <div className="mb-6 border-t border-gray-500" />
      </div>

      <div className="flex justify-center">
        <Card className="w-full border-2 border-zinc-700 bg-zinc-900 text-zinc-100 shadow-lg">
          <CardHeader className="flex flex-col gap-4 border-b border-zinc-700 bg-zinc-900 pb-4 md:flex-row md:items-center md:justify-between">
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
                className="border-zinc-700 bg-gradient-to-r from-zinc-800 to-zinc-900 text-white hover:bg-zinc-700 hover:ring-2 hover:ring-blue-400"
              >
                <Filter className="h-4 w-4" />
              </Button>
            </div>
            <Button
              variant="outline"
              className="border-gray-600 bg-gray-600 text-white hover:border-gray-700 hover:bg-gray-700 hover:text-white"
              onClick={() => setOpen(true)}
            >
              + Tambah Mahasiswa
            </Button>
          </CardHeader>

          {/* Filters Panel */}
          {showFilters && (
            <div className="border-b border-zinc-700 bg-zinc-800 p-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
                    value={entryYear}
                    onChange={(e) => setEntryYear(e.target.value)}
                    className="border-zinc-700 bg-zinc-900 text-white"
                  />
                </div>
                {canFilterStudyProgram && (
                  <div>
                    <label
                      htmlFor="study-program"
                      className="mb-2 block text-sm font-medium text-zinc-300"
                    >
                      Program Studi
                    </label>
                    <select
                      id="study-program"
                      value={studyProgramId}
                      onChange={(e) => setStudyProgramId(e.target.value)}
                      className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-zinc-100"
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
                    className="border-zinc-700 bg-zinc-900 text-white hover:bg-zinc-700"
                  >
                    Reset Filter
                  </Button>
                </div>
              </div>
            </div>
          )}
          <CardContent ref={tableRef} className="bg-zinc-900 p-0 md:p-4">
            <div className="w-full">
              <DataTable columns={columns} data={tableData} />
            </div>
            <Pagination pagination={pagination} onPageChange={handlePageChange} />
          </CardContent>
        </Card>
      </div>
      <StudentAddModal
        open={open}
        onOpenChange={setOpen}
        onSubmit={handleCreate}
        submitText={isPending ? "Menyimpan..." : "Tambah"}
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
      <StudentDeleteModal
        open={deleteOpen}
        onOpenChange={(v) => {
          setDeleteOpen(v);
          if (!v) setSelectedId(null);
        }}
        onConfirm={handleConfirmDelete}
        confirmText={isDeleting ? "Menghapus..." : "Hapus"}
      />
    </div>
  );
};

export default StudentPage;
