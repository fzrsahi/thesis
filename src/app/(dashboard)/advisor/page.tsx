"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UserCheck } from "lucide-react";
import { useState } from "react";

import { AdvisorSchema, type AdvisorPayload } from "@/app/shared/schema/advisor/AdvisorSchema";
import { createAdvisor } from "@/client/api/advisors";
import Button from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import Input from "@/components/ui/input";
import Pagination from "@/components/ui/pagination";
import { TypographyH2, TypographyP } from "@/components/ui/typography";

import { AdvisorAddModal } from "./components/AdvisorAddModal";
import { useAdvisorList } from "./hooks/useAdvisorList";

const AdvisorPage = () => {
  const { search, setSearch, tableRef, tableData, columns, pagination, handlePageChange } =
    useAdvisorList();

  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);

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

  return (
    <div className="w-full">
      <div className="mb-6">
        <TypographyH2 className="flex items-center gap-2 truncate text-zinc-900">
          <UserCheck className="h-10 w-10 font-extrabold" />
          Daftar Dosen Pembimbing
        </TypographyH2>
        <TypographyP className="border-b border-gray-300 pb-4 text-zinc-900">
          Kelola data dosen pembimbing dengan mudah dan efisien.
        </TypographyP>
        <div className="mb-6 border-t border-gray-500" />
      </div>

      <div className="flex justify-center">
        <Card className="w-full border-2 border-zinc-700 bg-zinc-900 text-zinc-100 shadow-lg">
          <CardHeader className="flex flex-col gap-4 border-b border-zinc-700 bg-zinc-900 pb-4 md:flex-row md:items-center md:justify-between">
            <div className="flex gap-2">
              <Input
                placeholder="Cari dosen pembimbing..."
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
              + Tambah Dosen Pembimbing
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
      <AdvisorAddModal
        open={open}
        onOpenChange={setOpen}
        onSubmit={handleCreate}
        submitText={isPending ? "Menyimpan..." : "Tambah"}
      />
    </div>
  );
};

export default AdvisorPage;
