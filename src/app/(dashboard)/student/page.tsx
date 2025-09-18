"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Users } from "lucide-react";
import { useState } from "react";

import { StudentSchema, type StudentPayload } from "@/app/shared/schema/student/StudentSchema";
import { createStudent, deleteStudent, getStudentDetail } from "@/client/api/students";
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
  const [deleteOpen, setDeleteOpen] = useState(false);
  const { search, setSearch, tableRef, tableData, columns, pagination, handlePageChange } =
    useStudentList({
      onDelete: (id: number) => {
        setSelectedId(id);
        setDeleteOpen(true);
      },
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

  const { mutateAsync: doCreate, isPending } = useMutation({
    mutationFn: async (payload: StudentPayload) => {
      // Ensure payload matches schema
      const parsed = StudentSchema.parse(payload);
      return createStudent(parsed);
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
            <div className="flex gap-2">
              <Input
                placeholder="Cari mahasiswa..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full md:w-56"
              />
              <Button
                variant="outline"
                className="border-zinc-700 bg-gradient-to-r from-zinc-800 to-zinc-900 text-white hover:bg-zinc-700 hover:ring-2 hover:ring-blue-400"
              >
                Cari
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
