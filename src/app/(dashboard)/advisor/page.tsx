"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { UserCheck, Filter } from "lucide-react";
import { useMemo, useState } from "react";

import { AdvisorListItem } from "@/app/server/advisor/advisor.repository";
import { ADVISOR_TYPES_ID_LABEL } from "@/app/shared/const/role";
import { AdvisorSchema, type AdvisorPayload } from "@/app/shared/schema/advisor/AdvisorSchema";
import { createAdvisor, deleteAdvisor } from "@/client/api/advisors";
import Button from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import Input from "@/components/ui/input";
import Pagination from "@/components/ui/pagination";
import { TypographyH2, TypographyP } from "@/components/ui/typography";

import { AdvisorAddModal } from "./components/AdvisorAddModal";
import { AdvisorDeleteModal } from "./components/AdvisorDeleteModal";
import { AdvisorEditModal } from "./components/AdvisorEditModal";
import { useAdvisorList } from "./hooks/useAdvisorList";

const AdvisorPage = () => {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [editDefaults, setEditDefaults] = useState<Partial<AdvisorPayload> | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [advisorType, setAdvisorType] = useState<string>("");

  const { search, setSearch, tableRef, tableData, columns, pagination, handlePageChange } =
    useAdvisorList({
      onDelete: (id: number) => {
        setSelectedId(id);
        setDeleteOpen(true);
      },
      onEdit: (item) => {
        setEditDefaults({
          name: item.name,
          email: item.email,
          type: (item.type ?? "HeadOfDepartment") as AdvisorPayload["type"],
          studyProgramId: item.studyProgramId ?? null,
        });
        setEditOpen(true);
      },
      advisorType: advisorType || undefined,
    });

  const displayColumns = useMemo(
    () =>
      columns.map((col) => {
        if ((col as unknown as { accessorKey: string }).accessorKey === "type") {
          return {
            ...col,
            cell: ({ row }: { row: { original: { type: string } } }) =>
              ADVISOR_TYPES_ID_LABEL[row.original.type as keyof typeof ADVISOR_TYPES_ID_LABEL] ??
              row.original.type ??
              "-",
          };
        }
        return col;
      }),
    [columns]
  );

  const { mutateAsync: doCreate, isPending } = useMutation({
    mutationFn: async (payload: AdvisorPayload) => {
      const parsed = AdvisorSchema.parse(payload);
      return createAdvisor(parsed);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["advisors"] });
    },
  });

  const handleCreate = async (values: AdvisorPayload) => {
    const res = await doCreate(values);
    return res?.success === true;
  };

  const { mutateAsync: doDelete } = useMutation({
    mutationFn: async (id: number) => deleteAdvisor(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["advisors"] });
    },
  });

  const handleConfirmDelete = async () => {
    if (selectedId == null) return false;
    const res = await doDelete(selectedId);
    return res?.success === true;
  };

  // keep original columns; edit handled via hook's action button
  const columnsWithEdit = displayColumns;

  return (
    <div className="w-full">
      <div className="mb-6">
        <TypographyH2 className="flex items-center gap-2 truncate text-zinc-900">
          <UserCheck className="h-10 w-10 font-extrabold" />
          Daftar Dosen
        </TypographyH2>
        <TypographyP className="border-b border-gray-300 pb-4 text-zinc-900">
          Kelola data dosen dengan mudah dan efisien.
        </TypographyP>
        <div className="mb-6 border-t border-gray-500" />
      </div>

      <div className="flex justify-center">
        <Card className="w-full border-2 border-zinc-700 bg-zinc-900 text-zinc-100 shadow-lg">
          <CardHeader className="flex flex-col gap-4 border-b border-zinc-700 bg-zinc-900 pb-4 md:flex-row md:items-center md:justify-between">
            {/* Search and Filters */}
            <div className="flex gap-2">
              <Input
                placeholder="Cari dosen..."
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
              + Tambah Dosen
            </Button>
          </CardHeader>

          {/* Filters Panel */}
          {showFilters && (
            <div className="border-b border-zinc-700 bg-zinc-800 p-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label
                    htmlFor="advisor-type"
                    className="mb-2 block text-sm font-medium text-zinc-300"
                  >
                    Tipe Dosen
                  </label>
                  <select
                    id="advisor-type"
                    value={advisorType}
                    onChange={(e) => setAdvisorType(e.target.value)}
                    className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-zinc-100"
                  >
                    <option value="">Semua Tipe</option>
                    {Object.entries(ADVISOR_TYPES_ID_LABEL).map(([key, label]) => (
                      <option key={key} value={key}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex items-end">
                  <Button
                    variant="outline"
                    onClick={() => setAdvisorType("")}
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
              <DataTable
                columns={columnsWithEdit as unknown as ColumnDef<AdvisorListItem, unknown>[]}
                data={tableData as unknown as AdvisorListItem[]}
              />
            </div>
            <Pagination pagination={pagination} onPageChange={handlePageChange} />
          </CardContent>
        </Card>
      </div>
      <AdvisorAddModal
        open={open}
        onOpenChange={setOpen}
        onSubmit={handleCreate}
        submitText={isPending ? "Menyimpan..." : "Tambah"}
      />
      <AdvisorDeleteModal
        open={deleteOpen}
        onOpenChange={(v) => {
          setDeleteOpen(v);
          if (!v) setSelectedId(null);
        }}
        onConfirm={handleConfirmDelete}
        confirmText="Hapus"
      />
      <AdvisorEditModal
        open={editOpen}
        onOpenChange={(v) => {
          setEditOpen(v);
          if (!v) setEditDefaults(null);
        }}
        onSubmit={async () => true}
        defaultValues={editDefaults ?? undefined}
        title="Edit Dosen"
        submitText="Simpan"
      />
    </div>
  );
};

export default AdvisorPage;
