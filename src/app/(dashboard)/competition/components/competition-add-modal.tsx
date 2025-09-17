"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { X, AlertCircle } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";

import {
  competitionGenerateSchema,
  type CreateCompetitionGeneratePayload,
} from "@/app/shared/schema/competition/CompetitionGenerateSchema";
import Button from "@/components/ui/button";
import { DarkModal } from "@/components/ui/dark-modal";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import Input from "@/components/ui/input";

// Typed backend error helpers (no any)
type BackendErrorData = {
  code?: string;
  message?: string;
  error?: { message?: string };
};

type BackendHttpError = {
  response?: { data?: BackendErrorData };
  message?: string;
};

const isBackendHttpError = (e: unknown): e is BackendHttpError => {
  if (!e || typeof e !== "object") return false;
  const maybe = e as Record<string, unknown>;
  const hasResponse = typeof maybe.response === "object" && maybe.response !== null;
  const hasMessage = typeof maybe.message === "string";
  return hasResponse || hasMessage;
};

const extractBackendMessage = (e: unknown): string | null => {
  if (isBackendHttpError(e)) {
    const data = (e.response as { data?: BackendErrorData } | undefined)?.data;
    if (data?.message) return data.message;
    if (data?.error?.message) return data.error.message;
    if (e.message) return e.message;
  } else if (e instanceof Error) {
    return e.message;
  }
  return null;
};

type CompetitionGenerateModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: CreateCompetitionGeneratePayload) => void | boolean | Promise<void | boolean>;
  defaultValues?: Partial<CreateCompetitionGeneratePayload>;
  title?: string;
  submitText?: string;
};

export const CompetitionAddModal = ({
  open,
  onOpenChange,
  onSubmit,
  defaultValues,
  title = "Tambah Kompetisi",
  submitText = "Tambah",
}: CompetitionGenerateModalProps) => {
  const resolver = useMemo(() => zodResolver(competitionGenerateSchema), []);

  const form = useForm<CreateCompetitionGeneratePayload>({
    resolver,
    defaultValues: {
      title: "",
      description: "",
      website: "",
      additionalDetails: undefined,
      file: undefined,
      startPage: undefined,
      endPage: undefined,
      ...defaultValues,
    },
  });

  useEffect(() => {
    if (open)
      form.reset({
        title: "",
        description: "",
        website: "",
        additionalDetails: undefined,
        file: undefined,
        startPage: undefined,
        endPage: undefined,
        ...defaultValues,
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [backendError, setBackendError] = useState<string | null>(null);

  const handleSubmit = async (values: CreateCompetitionGeneratePayload) => {
    setBackendError(null);
    setIsSubmitting(true);
    try {
      const result = await onSubmit(values);
      const isOk = result === true; // Only close when handler explicitly returns true
      if (isOk) {
        onOpenChange(false);
        form.reset();
      } else {
        setBackendError(
          typeof result === "string" ? result : "Gagal menyimpan. Periksa isian atau coba lagi."
        );
      }
    } catch (e: unknown) {
      const message = extractBackendMessage(e) ?? "Terjadi kesalahan pada server";
      setBackendError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const fileSelected = !!form.watch("file");

  // Dynamic additional details (key-value pairs) handled locally and serialized to string field
  type DetailPair = { id: string; key: string; value: string };
  const parseDefaultDetails = (): DetailPair[] => {
    const raw = defaultValues?.additionalDetails;
    if (!raw) return [];
    try {
      const obj = JSON.parse(raw as string) as Record<string, string>;
      return Object.entries(obj).map(([k, v], idx) => ({ id: `${idx}`, key: k, value: v ?? "" }));
    } catch {
      return [];
    }
  };
  const [detailPairs, setDetailPairs] = useState<DetailPair[]>(parseDefaultDetails());

  useEffect(() => {
    // keep additionalDetails in sync as JSON string
    if (!detailPairs.length) {
      form.setValue("additionalDetails", undefined as unknown as string | undefined);
      return;
    }
    const obj: Record<string, string> = {};
    detailPairs.forEach((p) => {
      if (p.key.trim()) obj[p.key.trim()] = p.value;
    });
    const json = JSON.stringify(obj);
    form.setValue("additionalDetails", json);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [detailPairs]);

  const addPair = () =>
    setDetailPairs((prev) => [...prev, { id: `${Date.now()}`, key: "", value: "" }]);
  const removePair = (id: string) => setDetailPairs((prev) => prev.filter((p) => p.id !== id));
  const updatePair = (id: string, patch: Partial<DetailPair>) =>
    setDetailPairs((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p)));

  return (
    <DarkModal.Root open={open} onOpenChange={onOpenChange}>
      <DarkModal.Content className="max-h-[85vh] overflow-y-auto border-2">
        <DarkModal.Header>
          <DarkModal.Title>{title}</DarkModal.Title>
        </DarkModal.Header>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            {backendError && (
              <div className="flex items-center gap-2 rounded-lg border border-red-700 bg-red-900/20 p-3">
                <AlertCircle className="h-4 w-4 text-red-400" />
                <p className="text-sm text-red-400">{backendError}</p>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setBackendError(null)}
                  className="ml-auto h-6 w-6 p-0 text-red-400 hover:bg-red-800 hover:text-red-300"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            )}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-zinc-200">Judul</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Judul kompetisi"
                      className="border-zinc-700 bg-zinc-900 text-zinc-100 placeholder:text-zinc-400"
                      {...field}
                    />
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
                  <FormLabel className="text-zinc-200">Deskripsi</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Deskripsi singkat"
                      className="border-zinc-700 bg-zinc-900 text-zinc-100 placeholder:text-zinc-400"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="website"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-zinc-200">Website</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://..."
                      className="border-zinc-700 bg-zinc-900 text-zinc-100 placeholder:text-zinc-400"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Dynamic Additional Details (Key-Value) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <FormLabel className="text-zinc-200">Detail Tambahan (opsional)</FormLabel>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addPair}
                  className="border-zinc-700 bg-zinc-800 text-zinc-100 hover:bg-zinc-700"
                >
                  + Tambah Field
                </Button>
              </div>
              <div className="space-y-2">
                {detailPairs.length === 0 && (
                  <div className="rounded-md border border-dashed border-zinc-700 p-3 text-sm text-zinc-400">
                    Belum ada detail tambahan. Klik &quot;Tambah Field&quot; untuk menambahkan.
                  </div>
                )}
                {detailPairs.map((pair) => (
                  <div key={pair.id} className="grid grid-cols-1 gap-2 md:grid-cols-12">
                    <div className="md:col-span-4">
                      <Input
                        placeholder="Key (mis: kontak, biaya)"
                        value={pair.key}
                        onChange={(e) => updatePair(pair.id, { key: e.target.value })}
                        className="border-zinc-700 bg-zinc-900 text-zinc-100 placeholder:text-zinc-400"
                      />
                    </div>
                    <div className="md:col-span-8">
                      <div className="flex items-center gap-2">
                        <Input
                          placeholder="Value"
                          value={pair.value}
                          onChange={(e) => updatePair(pair.id, { value: e.target.value })}
                          className="flex-1 border-zinc-700 bg-zinc-900 text-zinc-100 placeholder:text-zinc-400"
                        />
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          onClick={() => removePair(pair.id)}
                          className="min-w-[72px] shrink-0 px-2 text-red-400 hover:bg-red-900/20 hover:text-red-300"
                        >
                          <span className="hidden sm:inline">Hapus</span>
                          <X className="h-4 w-4 sm:ml-1" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {/* Hidden field to register with RHF and show validation error if any */}
              <FormField
                control={form.control}
                name="additionalDetails"
                render={({ field }) => (
                  <FormItem className="hidden">
                    <FormControl>
                      <input type="hidden" value={field.value ?? ""} onChange={field.onChange} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="file"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-zinc-200">File (opsional)</FormLabel>
                  <FormControl>
                    <input
                      type="file"
                      accept="application/pdf,image/*"
                      onChange={(e) => field.onChange(e.target.files?.[0])}
                      className="w-full rounded-md border border-zinc-700 bg-zinc-900 text-zinc-100 file:mr-4 file:rounded-md file:border-0 file:bg-zinc-800 file:px-4 file:py-2 file:text-sm file:text-zinc-100"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-2">
              <FormField
                control={form.control}
                name="startPage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-zinc-200">Halaman Mulai (opsional)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        disabled={!fileSelected}
                        value={field.value ?? ""}
                        onChange={(e) =>
                          field.onChange(e.target.value ? Number(e.target.value) : undefined)
                        }
                        className="border-zinc-700 bg-zinc-900 text-zinc-100 placeholder:text-zinc-400 disabled:cursor-not-allowed disabled:opacity-60"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="endPage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-zinc-200">Halaman Akhir (opsional)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        disabled={!fileSelected}
                        value={field.value ?? ""}
                        onChange={(e) =>
                          field.onChange(e.target.value ? Number(e.target.value) : undefined)
                        }
                        className="border-zinc-700 bg-zinc-900 text-zinc-100 placeholder:text-zinc-400 disabled:cursor-not-allowed disabled:opacity-60"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DarkModal.Footer className="pt-4">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-white text-black hover:bg-zinc-200 disabled:opacity-60"
              >
                {submitText}
              </Button>
              <DarkModal.Close asChild>
                <Button
                  type="button"
                  variant="ghost"
                  disabled={isSubmitting}
                  className="bg-red-600 text-white hover:bg-red-700 disabled:opacity-60"
                >
                  Batal
                </Button>
              </DarkModal.Close>
            </DarkModal.Footer>
          </form>
        </Form>
      </DarkModal.Content>
    </DarkModal.Root>
  );
};
