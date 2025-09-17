"use client";

import { useQuery } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { useState, useMemo, useRef, useEffect } from "react";

import { getStudents, type GetStudentsResponse } from "@/client/api/students";
import Button from "@/components/ui/button";

import { Student } from "../types";

// eslint-disable-next-line no-empty-pattern
export const useStudentList = () => {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const tableRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(t);
  }, [search]);

  const { data, isLoading } = useQuery<GetStudentsResponse>({
    queryKey: ["students", { page, limit: pageSize, keywords: debouncedSearch }],
    queryFn: async () => {
      const res = await getStudents({
        page,
        limit: pageSize,
        keywords: debouncedSearch || undefined,
      });
      return res;
    },
  });

  type ApiStudentListItem = {
    id?: number;
    studentId?: string | null;
    gpa?: string | null;
    user?: { name?: string; email?: string };
  };

  const tableData: Student[] = useMemo(() => {
    const list = (data?.data ?? []) as ApiStudentListItem[];
    return list.map((item, idx) => ({
      id: item.id ?? idx + 1,
      name: item.user?.name ?? "-",
      nim: item.studentId ?? "-",
      email: item.user?.email ?? "-",
      gpa: item.gpa ? parseFloat(item.gpa) : undefined,
      semester: undefined,
      major: undefined,
      phone: undefined,
    }));
  }, [data]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    setTimeout(() => {
      tableRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  const columns: ColumnDef<Student>[] = [
    { header: "NIM", accessorKey: "nim" },
    { header: "Nama", accessorKey: "name" },
    { header: "Email", accessorKey: "email" },
    {
      header: "IPK",
      accessorKey: "gpa",
      cell: ({ row }) => (row.original.gpa ? row.original.gpa.toFixed(2) : "-"),
    },
    {
      header: "Semester",
      accessorKey: "semester",
      cell: ({ row }) => row.original.semester ?? "-",
    },
    {
      header: "Jurusan",
      accessorKey: "major",
      cell: ({ row }) => row.original.major ?? "-",
    },
    {
      header: "Aksi",
      accessorKey: "actions",
      // eslint-disable-next-line no-empty-pattern
      cell: ({}) => (
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="border-zinc-700 bg-zinc-900 p-2 text-white hover:bg-zinc-800"
            onClick={() => {}}
            aria-label="Detail"
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="border-zinc-700 bg-zinc-900 p-2 text-white hover:bg-zinc-800"
            onClick={() => {}}
            aria-label="Edit"
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="border-zinc-700 bg-zinc-900 p-2 text-red-400 hover:bg-zinc-800"
            onClick={() => {}}
            aria-label="Hapus"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  const pagination = {
    total: data?.pagination?.total ?? 0,
    page: data?.pagination?.page ?? page,
    limit: data?.pagination?.limit ?? pageSize,
    totalPages: data?.pagination?.totalPages ?? 1,
    hasNextPage: data?.pagination?.hasNextPage ?? false,
    hasPrevPage: data?.pagination?.hasPrevPage ?? false,
  };

  return {
    search,
    setSearch,
    page,
    tableRef,
    tableData,
    columns,
    pagination,
    isLoading,
    handlePageChange,
  };
};
