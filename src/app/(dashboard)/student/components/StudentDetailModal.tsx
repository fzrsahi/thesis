"use client";

import { Fragment } from "react";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { DarkModal } from "@/components/ui/dark-modal";
import { TypographyH2, TypographyP } from "@/components/ui/typography";

type StudentDetail = {
  id?: number;
  user?: { name?: string; email?: string };
  studentId?: string | null;
  gpa?: string | null;
  interests?: string[];
  skills?: string[];
  achievements?: { id?: number; title?: string; description?: string; date?: string }[];
  experiences?: {
    id?: number;
    organization?: string;
    position?: string;
    startDate?: string;
    endDate?: string;
    description?: string;
  }[];
};

export type StudentDetailModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data?: StudentDetail | null;
  isLoading?: boolean;
};

export const StudentDetailModal = ({
  open,
  onOpenChange,
  data,
  isLoading,
}: StudentDetailModalProps) => (
  <DarkModal.Root open={open} onOpenChange={onOpenChange}>
    <DarkModal.Content className="max-h-[85vh] w-full max-w-3xl overflow-y-auto border-2">
      <DarkModal.Header>
        <DarkModal.Title>Detail Mahasiswa</DarkModal.Title>
      </DarkModal.Header>
      <div className="space-y-4 p-2 md:p-4">
        <Card className="border-zinc-700 bg-zinc-900 text-zinc-100">
          <CardHeader className="border-b border-zinc-700">
            <TypographyH2 className="text-lg md:text-xl">Profil</TypographyH2>
            <TypographyP className="text-zinc-300">Informasi dasar mahasiswa</TypographyP>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-3 p-4 md:grid-cols-2">
            <Field label="Nama" value={data?.user?.name || "-"} />
            <Field label="Email" value={data?.user?.email || "-"} />
            <Field label="NIM" value={data?.studentId || "-"} />
            <Field label="IPK" value={data?.gpa || "-"} />
            <Field label="Minat" value={(data?.interests || []).join(", ") || "-"} />
            <Field label="Keahlian" value={(data?.skills || []).join(", ") || "-"} />
          </CardContent>
        </Card>

        <TwoColList
          title="Prestasi"
          emptyText="Belum ada prestasi"
          items={(data?.achievements || []).map((a) => ({
            id: String(a?.id ?? Math.random()),
            primary: a?.title || "-",
            secondary: a?.description || "",
            meta: a?.date ? new Date(a.date).toLocaleDateString() : undefined,
          }))}
          loading={isLoading}
        />

        <TwoColList
          title="Pengalaman"
          emptyText="Belum ada pengalaman"
          items={(data?.experiences || []).map((e) => ({
            id: String(e?.id ?? Math.random()),
            primary: e?.position || "-",
            secondary: e?.organization || "",
            meta:
              [e?.startDate, e?.endDate]
                .filter(Boolean)
                .map((d) => (d ? new Date(d).toLocaleDateString() : ""))
                .join(" - ") || undefined,
          }))}
          loading={isLoading}
        />
      </div>
    </DarkModal.Content>
  </DarkModal.Root>
);

const Field = ({ label, value }: { label: string; value?: string }) => (
  <div className="space-y-1">
    <p className="text-xs tracking-wide text-zinc-400 uppercase">{label}</p>
    <p className="rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-zinc-100">{value}</p>
  </div>
);

type TwoColListProps = {
  title: string;
  emptyText: string;
  items: { id: string; primary: string; secondary?: string; meta?: string }[];
  loading?: boolean;
};

const TwoColList = ({ title, emptyText, items, loading }: TwoColListProps) => {
  let content;
  if (loading) {
    content = <div className="p-4 text-zinc-300">Memuat...</div>;
  } else if (items.length === 0) {
    content = <div className="p-4 text-zinc-400">{emptyText}</div>;
  } else {
    content = (
      <div className="divide-y divide-zinc-800">
        {items.map((item) => (
          <Fragment key={item.id}>
            <div className="grid grid-cols-1 gap-2 p-4 md:grid-cols-3">
              <div className="font-medium md:col-span-1">{item.primary}</div>
              <div className="text-zinc-300 md:col-span-1">{item.secondary}</div>
              <div className="text-zinc-400 md:col-span-1">{item.meta}</div>
            </div>
          </Fragment>
        ))}
      </div>
    );
  }

  return (
    <Card className="border-zinc-700 bg-zinc-900 text-zinc-100">
      <CardHeader className="border-b border-zinc-700">
        <TypographyH2 className="text-lg md:text-xl">{title}</TypographyH2>
      </CardHeader>
      <CardContent className="p-0">{content}</CardContent>
    </Card>
  );
};

export default StudentDetailModal;
