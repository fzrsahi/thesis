"use client";

import { ColumnDef } from "@tanstack/react-table";
import { BookOpen } from "lucide-react";
import { useState, useMemo, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";

import Button from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import Input from "@/components/ui/input";
import { TypographyH2, TypographyP } from "@/components/ui/typography";

import { DataTable } from "./components/data-table";

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

const initialData: Competition[] = [
  {
    id: 1,
    title: "Program Kreativitas Mahasiswa Karsa Cipta",
    description: "Kompetisi inovasi mahasiswa tingkat nasional.",
    field: ["Kecerdasan Buatan", "Aplikasi Mobile"],
    type: "Team",
    minGPA: "3.0",
    startDate: "2024-07-01",
    endDate: "2024-08-01",
    organizer: "Kemdikbud",
    sourceUrl: "https://pkm.kemdikbud.go.id",
  },
  {
    id: 2,
    title: "Kompetisi Sains Nasional",
    description: "Kompetisi sains untuk mahasiswa seluruh Indonesia.",
    field: ["Fisika", "Matematika"],
    type: "Individual",
    minGPA: "2.75",
    startDate: "2024-09-10",
    endDate: "2024-10-10",
    organizer: "Pusat Prestasi Nasional",
    sourceUrl: "https://ksn.puspresnas.id",
  },
];

const columns: ColumnDef<Competition>[] = [
  { header: "Judul", accessorKey: "title" },
  { header: "Bidang", accessorKey: "field" },
  { header: "Tipe", accessorKey: "type" },
  { header: "Mulai", accessorKey: "startDate" },
  { header: "Selesai", accessorKey: "endDate" },
  { header: "Penyelenggara", accessorKey: "organizer" },
  { header: "Aksi", accessorKey: "aksi" },
];

const CompetitionPage = () => {
  const [data, setData] = useState<Competition[]>(initialData);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const tableRef = useRef<HTMLDivElement>(null);

  const filteredData = useMemo(() => {
    if (!search) return data;
    return data.filter(
      (item) =>
        item.title.toLowerCase().includes(search.toLowerCase()) ||
        item.field.some((f) => f.toLowerCase().includes(search.toLowerCase())) ||
        (item.organizer?.toLowerCase().includes(search.toLowerCase()) ?? false)
    );
  }, [search, data]);

  const totalPage = Math.max(1, Math.ceil(filteredData.length / pageSize));
  const pagedData = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, page, pageSize]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    setTimeout(() => {
      tableRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  useEffect(() => {
    setPage(1);
  }, [search, filteredData.length]);

  const form = useForm<Competition>({
    defaultValues: {
      id: data.length + 1,
      title: "",
      description: "",
      field: [],
      type: "",
      minGPA: "",
      startDate: "",
      endDate: "",
      organizer: "",
      sourceUrl: "",
    },
  });

  const onSubmit = (values: Competition) => {
    setData((prev) => [...prev, { ...values, id: prev.length + 1 }]);
    setOpen(false);
    form.reset();
  };

  return (
    <div className="w-full">
      <div className="mb-6">
        <TypographyH2 className="flex items-center gap-2 truncate text-zinc-900">
          <BookOpen className="h-10 w-10 font-extrabold" />
          Daftar Kompetisi
        </TypographyH2>
        <TypographyP className="border-b border-gray-300 pb-4 text-zinc-900">
          Temukan dan kelola berbagai kompetisi untuk mahasiswa secara mudah.
        </TypographyP>
        <div className="mb-6 border-t border-gray-500" />
      </div>

      <div className="flex justify-center">
        <Card className="w-full border-2 border-zinc-700 bg-zinc-900 text-zinc-100 shadow-lg">
          <CardHeader className="flex flex-col gap-4 border-b border-zinc-700 bg-zinc-900 pb-4 md:flex-row md:items-center md:justify-between">
            <div className="flex gap-2">
              <Input
                placeholder="Cari kompetisi..."
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
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="border-gray-600 bg-gray-600 text-white hover:border-gray-700 hover:bg-gray-700 hover:text-white"
                >
                  + Tambah Kompetisi
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Tambah Kompetisi</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Judul</FormLabel>
                          <FormControl>
                            <Input placeholder="Judul kompetisi" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Deskripsi</FormLabel>
                          <FormControl>
                            <Input placeholder="Deskripsi singkat" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="field"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Bidang (pisahkan dengan koma)</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Contoh: AI, Mobile, Data Science"
                              value={field.value?.join(", ")}
                              onChange={(e) =>
                                field.onChange(
                                  e.target.value
                                    .split(",")
                                    .map((s) => s.trim())
                                    .filter(Boolean)
                                )
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <FormField
                        control={form.control}
                        name="type"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Tipe</FormLabel>
                            <FormControl>
                              <Input placeholder="Individual/Team" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="minGPA"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Min. IPK</FormLabel>
                            <FormControl>
                              <Input placeholder="Contoh: 3.0" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <FormField
                        control={form.control}
                        name="startDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Mulai</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="endDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Selesai</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={form.control}
                      name="organizer"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Penyelenggara</FormLabel>
                          <FormControl>
                            <Input placeholder="Nama penyelenggara" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="sourceUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>URL</FormLabel>
                          <FormControl>
                            <Input placeholder="https://..." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <DialogFooter>
                      <Button type="submit">Simpan</Button>
                      <DialogClose asChild>
                        <Button type="button" variant="ghost">
                          Batal
                        </Button>
                      </DialogClose>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent ref={tableRef} className="bg-zinc-900 p-0 md:p-4">
            <div className="w-full">
              <DataTable columns={columns} data={pagedData} />
            </div>
            {/* Pagination */}
            <div className="mt-6 flex flex-col gap-4 px-2 pb-2 md:flex-row md:items-center md:justify-between">
              <div className="text-muted-foreground text-sm">
                Menampilkan {pagedData.length ? (page - 1) * pageSize + 1 : 0} -{" "}
                {(page - 1) * pageSize + pagedData.length} dari {filteredData.length} kompetisi
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 1}
                  className={
                    page === 1
                      ? "cursor-not-allowed border-zinc-800 bg-zinc-900 text-zinc-600"
                      : "border-zinc-700 bg-gradient-to-r from-zinc-800 to-zinc-900 text-white hover:bg-zinc-700 hover:ring-2 hover:ring-blue-400"
                  }
                >
                  Sebelumnya
                </Button>
                <span className="text-sm font-medium">
                  Halaman {page} dari {totalPage}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page === totalPage}
                  className={
                    page === totalPage
                      ? "cursor-not-allowed border-zinc-800 bg-zinc-900 text-zinc-600"
                      : "border-zinc-700 bg-gradient-to-r from-zinc-800 to-zinc-900 text-white hover:bg-zinc-700 hover:ring-2 hover:ring-blue-400"
                  }
                >
                  Berikutnya
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CompetitionPage;
