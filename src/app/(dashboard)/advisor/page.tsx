"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { UserCheck, Filter } from "lucide-react";
import { useMemo, useState, useEffect } from "react";

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
import { cn } from "@/lib/utils";

import { AdvisorAddModal } from "./components/AdvisorAddModal";
import { AdvisorDeleteModal } from "./components/AdvisorDeleteModal";
import { AdvisorEditModal } from "./components/AdvisorEditModal";
import { useAdvisorList } from "./hooks/useAdvisorList";

const AdvisorPage = () => {
  const [isLight, setIsLight] = useState<boolean>(true);

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
      isLight,
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
    <div className="w-full">
      <div className="mb-6">
        <TypographyH2 className={cn("flex items-center gap-2 truncate", textPrimary)}>
          <UserCheck className="h-10 w-10 font-extrabold" />
          Daftar Pengelola Jurusan dan Koordinator Prodi
        </TypographyH2>
        <TypographyP className={cn("border-b pb-4", borderColor, textSecondary)}>
          Kelola data pengelola jurusan dan koordinator prodi
        </TypographyP>
        <div className={cn("mb-6 border-t", borderColor)} />
      </div>

      <div className="flex justify-center">
        <Card
          className={cn(
            "w-full border-2 shadow-lg transition-colors",
            cardBorder,
            cardBg,
            cardText
          )}
        >
          <CardHeader
            className={cn(
              "flex flex-col gap-4 border-b pb-4 md:flex-row md:items-center md:justify-between",
              headerBorder,
              cardBg
            )}
          >
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
              + Tambah Dosen
            </Button>
          </CardHeader>

          {/* Filters Panel */}
          {showFilters && (
            <div className={cn("border-b p-4", filterBorder, filterBg)}>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label
                    htmlFor="advisor-type"
                    className={cn("mb-2 block text-sm font-medium", filterLabel)}
                  >
                    Tipe Dosen
                  </label>
                  <select
                    id="advisor-type"
                    value={advisorType}
                    onChange={(e) => setAdvisorType(e.target.value)}
                    className={cn("w-full rounded-md border px-3 py-2", filterInput)}
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
          <CardContent ref={tableRef} className={cn("p-0 transition-colors md:p-4", cardBg)}>
            <div className="w-full">
              <DataTable
                columns={columnsWithEdit as unknown as ColumnDef<AdvisorListItem, unknown>[]}
                data={tableData as unknown as AdvisorListItem[]}
                isLight={isLight}
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
