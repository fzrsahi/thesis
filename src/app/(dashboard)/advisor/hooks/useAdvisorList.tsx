"use client";

import { useQuery } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { Pencil, Trash2 } from "lucide-react";
import { useState, useMemo, useRef, useEffect } from "react";

import { getAdvisors, type GetAdvisorsResponse } from "@/client/api/advisors";
import Button from "@/components/ui/button";

export type Advisor = {
  id: number;
  name: string;
  email: string;
  type?: string;
  studyProgramName?: string;
  studyProgramId?: number | null;
  phone?: string;
  specialization?: string[];
  department?: string;
  title?: string;
};

type UseAdvisorListOptions = {
  onDelete?: (id: number) => void;
  onEdit?: (item: Advisor) => void;
  advisorType?: string;
};

export const useAdvisorList = (options?: UseAdvisorListOptions) => {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const tableRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(t);
  }, [search]);

  const { data, isLoading } = useQuery<GetAdvisorsResponse>({
    queryKey: ["advisors", { page, limit: pageSize, keywords: debouncedSearch }],
    queryFn: async () => {
      const res = await getAdvisors({
        page,
        limit: pageSize,
        keywords: debouncedSearch || undefined,
      });
      return res;
    },
  });

  type ApiAdvisorListItem = {
    id?: number;
    type?: string;
    user?: { name?: string; email?: string };
    studyProgram?: { id?: number; name?: string } | null;
  };

  const tableData: Advisor[] = useMemo(() => {
    const list = (data?.data ?? []) as ApiAdvisorListItem[];
    let filteredList = list;

    // Apply advisorType filter on frontend
    if (options?.advisorType) {
      filteredList = list.filter((item) => item.type === options.advisorType);
    }

    return filteredList.map((item, idx) => ({
      id: item.id ?? idx + 1,
      name: item.user?.name ?? "-",
      email: item.user?.email ?? "-",
      type: item.type ?? "-",
      studyProgramName: item.studyProgram?.name ?? "-",
      studyProgramId: item.studyProgram?.id ?? null,
      phone: undefined,
      specialization: [],
      department: undefined,
      title: undefined,
    }));
  }, [data, options?.advisorType]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    setTimeout(() => {
      tableRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  const handleEdit = (item: Advisor) => {
    options?.onEdit?.(item);
  };
  const handleDelete = (item: Advisor) => {
    const { id } = item;
    if (typeof id === "number") options?.onDelete?.(id);
  };

  const columns: ColumnDef<Advisor>[] = [
    { header: "Nama", accessorKey: "name" },
    { header: "Email", accessorKey: "email" },
    { header: "Tipe", accessorKey: "type" },
    { header: "Program Studi", accessorKey: "studyProgramName" },
    {
      header: "Aksi",
      accessorKey: "actions",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="border-zinc-700 bg-zinc-900 p-2 text-white hover:bg-zinc-800"
            onClick={() => handleEdit(row.original)}
            aria-label="Edit"
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="border-zinc-700 bg-zinc-900 p-2 text-red-400 hover:bg-zinc-800"
            onClick={() => handleDelete(row.original)}
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
