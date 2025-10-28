"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { BookOpen, Eye, Pencil, Trash2, Filter } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useMemo, useRef, useEffect } from "react";
import { toast } from "sonner";

import { CreateCompetitionGeneratePayload } from "@/app/shared/schema/competition/CompetitionGenerateSchema";
import {
  deleteCompetition,
  getCompetitions,
  type GetCompetitionsResponse,
} from "@/client/api/competitions";
import Button from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import Input from "@/components/ui/input";
import Pagination from "@/components/ui/pagination";
import { TypographyH2, TypographyP } from "@/components/ui/typography";
import { formatDate } from "@/lib/utils";

import { CompetitionAddModal } from "./components/competition-add-modal";
import { CompetitionDeleteModal } from "./components/competition-delete-modal";
import { CompetitionEditModal } from "./components/competition-edit-modal";
import { useGenerateCompetition } from "./hooks/useGenerateCompetition";

export type Competition = {
  id: number;
  title: string;
  description: string;
  field: string[];
  type?: string;
  minGPA?: string;
  startDate?: string;
  endDate?: string;
  organizer?: string;
  sourceUrl?: string;
};

// Move the CompetitionActions component out of CompetitionPage to avoid defining components during render
type CompetitionActionsProps = {
  item: Competition;
  onView: (item: Competition) => void;
  onEdit: (item: Competition) => void;
  onDelete: (item: Competition) => void;
};

const CompetitionActions = ({ item, onView, onEdit, onDelete }: CompetitionActionsProps) => (
  <div className="flex items-center gap-2">
    <Button
      variant="outline"
      size="sm"
      className="border-zinc-700 bg-zinc-900 p-2 text-white hover:bg-zinc-800"
      onClick={() => onView(item)}
      aria-label="Detail"
    >
      <Eye className="h-4 w-4" />
    </Button>
    <Button
      variant="outline"
      size="sm"
      className="border-zinc-700 bg-zinc-900 p-2 text-white hover:bg-zinc-800"
      onClick={() => onEdit(item)}
      aria-label="Edit"
    >
      <Pencil className="h-4 w-4" />
    </Button>
    <Button
      variant="outline"
      size="sm"
      className="border-zinc-700 bg-zinc-900 p-2 text-red-400 hover:bg-zinc-800"
      onClick={() => onDelete(item)}
      aria-label="Hapus"
    >
      <Trash2 className="h-4 w-4" />
    </Button>
  </div>
);

const columnsDef = (
  handleView: (item: Competition) => void,
  handleEdit: (item: Competition) => void,
  handleDelete: (item: Competition) => void
): ColumnDef<Competition>[] => [
  { header: "Judul", accessorKey: "title" },
  {
    header: "Mulai",
    accessorKey: "startDate",
    cell: ({ row }) => formatDate(row.original.startDate),
  },
  {
    header: "Selesai",
    accessorKey: "endDate",
    cell: ({ row }) => formatDate(row.original.endDate),
  },
  {
    header: "Aksi",
    accessorKey: "actions",
    cell: ({ row }) => (
      <CompetitionActions
        item={row.original}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    ),
  },
];

const CompetitionPage = () => {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Competition | null>(null);
  const [editDefaults, setEditDefaults] =
    useState<Partial<CreateCompetitionGeneratePayload> | null>(null);
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [competitionType, setCompetitionType] = useState<string>("");
  const [fieldFilter, setFieldFilter] = useState<string>("");
  const pageSize = 10;
  const tableRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();
  const router = useRouter();

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(t);
  }, [search]);

  const { data } = useQuery<GetCompetitionsResponse>({
    queryKey: ["competitions", { page, limit: pageSize, keywords: debouncedSearch }],
    queryFn: async () => {
      const res = await getCompetitions({
        page,
        limit: pageSize,
        keywords: debouncedSearch || undefined,
      });
      return res;
    },
  });

  const tableData: Competition[] = useMemo(() => {
    const list = data?.data ?? [];
    let filteredList = list;

    // Apply filters on frontend
    if (competitionType) {
      filteredList = filteredList.filter((item) => item.type === competitionType);
    }

    if (fieldFilter) {
      filteredList = filteredList.filter((item) =>
        item.field?.some((field) => field.toLowerCase().includes(fieldFilter.toLowerCase()))
      );
    }

    return filteredList.map((item, idx) => ({
      id: item.id ?? idx + 1,
      title: item.title ?? "-",
      description: item.description ?? "",
      field: item.field ?? [],
      type: item.type ?? undefined,
      minGPA: undefined,
      startDate: item.startDate ?? undefined,
      endDate: item.endDate ?? undefined,
      organizer: item.organizer ?? undefined,
      sourceUrl: undefined,
    }));
  }, [data, competitionType, fieldFilter]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    setTimeout(() => {
      tableRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  const { handleGenerate } = useGenerateCompetition();

  const onGenerate = async (values: {
    title: string;
    description: string;
    website: string;
    additionalDetails?: string;
    file?: File;
    startPage?: number;
    endPage?: number;
  }): Promise<boolean> => {
    try {
      const ok = await handleGenerate(values);
      if (ok) {
        toast.success("Kompetisi berhasil ditambahkan");
        queryClient.invalidateQueries({ queryKey: ["competitions"] });
      }
      return ok;
    } catch (e: unknown) {
      const maybe = e as { response?: { data?: { message?: string } }; message?: string };
      const message =
        maybe?.response?.data?.message ?? maybe?.message ?? "Gagal Menambahkan kompetisi";
      toast.error(message);
      throw new Error(message);
    }
  };

  const handleView = (item: Competition) => {
    router.push(`/competition/${item.id}`);
  };

  const handleEdit = (item: Competition) => {
    // Map existing fields to edit form (we reuse generate-style fields)
    setEditDefaults({
      title: item.title,
      description: item.description,
      website: item.sourceUrl ?? "",
      additionalDetails: undefined,
      startPage: undefined,
      endPage: undefined,
    });
    setEditOpen(true);
  };

  const handleDelete = (item: Competition) => {
    setSelectedItem(item);
    setDeleteOpen(true);
  };

  // Use columnsDef factory to avoid defining components during render
  const columns = useMemo(
    () => columnsDef(handleView, handleEdit, handleDelete),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const { mutateAsync: doDelete } = useMutation({
    mutationFn: async (id: number) => deleteCompetition(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["competitions"] });
    },
  });

  const onConfirmDelete = async () => {
    if (!selectedItem?.id) return;
    const res = await doDelete(selectedItem.id);
    if (res?.success) {
      setDeleteOpen(false);
      setSelectedItem(null);
    }
  };

  return (
    <>
      <div className="flex h-full flex-col">
        <div className="mb-6 flex-shrink-0">
          <TypographyH2 className="flex items-center gap-2 truncate text-zinc-900">
            <BookOpen className="h-10 w-10 font-extrabold" />
            Daftar Kompetisi
          </TypographyH2>
          <TypographyP className="border-b border-gray-300 pb-4 text-zinc-900">
            Temukan dan kelola berbagai kompetisi untuk mahasiswa secara mudah.
          </TypographyP>
          <div className="mb-6 border-t border-gray-500" />
        </div>

        <div className="flex min-h-0 flex-1 flex-col">
          <Card className="flex h-full flex-col border-2 border-zinc-700 bg-zinc-900 text-zinc-100 shadow-lg">
            <CardHeader className="flex flex-shrink-0 flex-col gap-4 border-b border-zinc-700 bg-zinc-900 pb-4 md:flex-row md:items-center md:justify-between">
              {/* Search and Filters */}
              <div className="flex gap-2">
                <Input
                  placeholder="Cari kompetisi..."
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
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="border-gray-600 bg-gray-600 text-white hover:border-gray-700 hover:bg-gray-700 hover:text-white"
                  >
                    + Tambah Kompetisi
                  </Button>
                </DialogTrigger>
                <CompetitionAddModal open={open} onOpenChange={setOpen} onSubmit={onGenerate} />
              </Dialog>
            </CardHeader>

            {/* Filters Panel */}
            {showFilters && (
              <div className="flex-shrink-0 border-b border-zinc-700 bg-zinc-800 p-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label
                      htmlFor="competition-type"
                      className="mb-2 block text-sm font-medium text-zinc-300"
                    >
                      Tipe Kompetisi
                    </label>
                    <select
                      id="competition-type"
                      value={competitionType}
                      onChange={(e) => setCompetitionType(e.target.value)}
                      className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-zinc-100"
                    >
                      <option value="">Semua Tipe</option>
                      <option value="Programming">Programming</option>
                      <option value="Design">Design</option>
                      <option value="Business">Business</option>
                      <option value="Academic">Academic</option>
                      <option value="Sports">Sports</option>
                      <option value="Art">Art</option>
                    </select>
                  </div>
                  <div>
                    <label
                      htmlFor="field-filter"
                      className="mb-2 block text-sm font-medium text-zinc-300"
                    >
                      Bidang Kompetisi
                    </label>
                    <Input
                      id="field-filter"
                      placeholder="Cari bidang..."
                      value={fieldFilter}
                      onChange={(e) => setFieldFilter(e.target.value)}
                      className="border-zinc-700 bg-zinc-900 text-white"
                    />
                  </div>
                  <div className="flex items-end">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setCompetitionType("");
                        setFieldFilter("");
                      }}
                      className="border-zinc-700 bg-zinc-900 text-white hover:bg-zinc-700"
                    >
                      Reset Filter
                    </Button>
                  </div>
                </div>
              </div>
            )}
            <CardContent
              ref={tableRef}
              className="flex min-h-0 flex-1 flex-col bg-zinc-900 p-0 md:p-4"
            >
              <div className="flex-1 overflow-auto">
                <DataTable columns={columns} data={tableData} />
              </div>
              <div className="flex-shrink-0">
                <Pagination
                  pagination={{
                    total: data?.pagination?.total ?? 0,
                    page: data?.pagination?.page ?? page,
                    limit: data?.pagination?.limit ?? pageSize,
                    totalPages: data?.pagination?.totalPages ?? 1,
                    hasNextPage: data?.pagination?.hasNextPage ?? false,
                    hasPrevPage: data?.pagination?.hasPrevPage ?? false,
                  }}
                  onPageChange={handlePageChange}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <CompetitionDeleteModal
        open={deleteOpen}
        onOpenChange={(v) => {
          setDeleteOpen(v);
          if (!v) setSelectedItem(null);
        }}
        onConfirm={async () => {
          await onConfirmDelete();
          return true;
        }}
        data={selectedItem}
      />
      <CompetitionEditModal
        open={editOpen}
        onOpenChange={(v) => {
          setEditOpen(v);
          if (!v) setEditDefaults(null);
        }}
        onSubmit={async () => true}
        defaultValues={editDefaults ?? undefined}
        title="Edit Kompetisi"
        submitText="Simpan"
      />
    </>
  );
};

export default CompetitionPage;
