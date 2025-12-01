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
import { DarkModal, type DarkModalVariant } from "@/components/ui/dark-modal";
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
  variant?: DarkModalVariant;
};

export const CompetitionAddModal = ({
  open,
  onOpenChange,
  onSubmit,
  defaultValues,
  title = "Tambah Kompetisi",
  submitText = "Tambah",
  variant = "dark",
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
    if (!raw) return [{ id: "default", key: "", value: "" }]; // Always start with at least 1 field
    try {
      const obj = JSON.parse(raw as string) as Record<string, string>;
      const pairs = Object.entries(obj).map(([k, v], idx) => ({
        id: `${idx}`,
        key: k,
        value: v ?? "",
      }));
      return pairs.length > 0 ? pairs : [{ id: "default", key: "", value: "" }];
    } catch {
      return [{ id: "default", key: "", value: "" }];
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
  const removePair = (id: string) => {
    // Don't allow removing if it's the last field
    if (detailPairs.length <= 1) return;
    setDetailPairs((prev) => prev.filter((p) => p.id !== id));
  };
  const updatePair = (id: string, patch: Partial<DetailPair>) =>
    setDetailPairs((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p)));

  const isLight = variant === "light";
  const formLabelClass = isLight ? "text-zinc-900" : "text-zinc-200";
  const helperTextClass = isLight ? "text-zinc-600" : "text-zinc-400";
  const inputClass = isLight
    ? "border-zinc-300 bg-white text-zinc-900 placeholder:text-zinc-500"
    : "border-zinc-700 bg-zinc-900 text-zinc-100 placeholder:text-zinc-400";
  const textareaClass = `${inputClass} min-h-[100px] w-full rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500`;
  const disabledFieldClass = "disabled:cursor-not-allowed disabled:opacity-60";
  const detailRemoveButtonClass = isLight
    ? "text-red-600 hover:bg-red-100 hover:text-red-700"
    : "text-red-400 hover:bg-red-900/20 hover:text-red-300";
  const errorContainerClass = isLight ? "border-red-300 bg-red-50" : "border-red-700 bg-red-900/20";
  const errorTextClass = isLight ? "text-red-700" : "text-red-400";
  const errorCloseButtonClass = isLight
    ? "text-red-600 hover:bg-red-100 hover:text-red-800"
    : "text-red-400 hover:bg-red-800 hover:text-red-300";
  const addFieldButtonClass = isLight
    ? "border-zinc-300 bg-white text-zinc-900 hover:bg-zinc-100"
    : "border-zinc-700 bg-zinc-800 text-zinc-100 hover:bg-zinc-700";
  const primaryButtonClass = isLight
    ? "bg-zinc-900 text-white hover:bg-zinc-800"
    : "bg-white text-black hover:bg-zinc-200";
  const cancelButtonClass = isLight
    ? "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
    : "bg-red-600 text-white hover:bg-red-700";
  const fileInputClass = isLight
    ? "w-full rounded-md border border-zinc-300 bg-white text-zinc-900 file:mr-4 file:rounded-md file:border file:border-zinc-300 file:bg-zinc-100 file:px-4 file:py-2 file:text-sm file:text-zinc-900"
    : "w-full rounded-md border border-zinc-700 bg-zinc-900 text-zinc-100 file:mr-4 file:rounded-md file:border-0 file:bg-zinc-800 file:px-4 file:py-2 file:text-sm file:text-zinc-100";

  return (
    <DarkModal.Root open={open} onOpenChange={onOpenChange} variant={variant}>
      <DarkModal.Content className="max-h-[85vh] overflow-y-auto border-2">
        <DarkModal.Header>
          <DarkModal.Title>{title}</DarkModal.Title>
        </DarkModal.Header>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            {backendError && (
              <div
                className={`flex items-center gap-2 rounded-lg border p-3 ${errorContainerClass}`}
              >
                <AlertCircle className={`h-4 w-4 ${errorTextClass}`} />
                <p className={`text-sm ${errorTextClass}`}>{backendError}</p>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setBackendError(null)}
                  className={`ml-auto h-6 w-6 p-0 ${errorCloseButtonClass}`}
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
                  <FormLabel className={formLabelClass}>Judul</FormLabel>
                  <FormControl>
                    <Input placeholder="Judul kompetisi" className={inputClass} {...field} />
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
                  <FormLabel className={formLabelClass}>Deskripsi</FormLabel>
                  <FormControl>
                    <textarea
                      placeholder="Deskripsi singkat kompetisi..."
                      className={textareaClass}
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
                  <FormLabel className={formLabelClass}>Website</FormLabel>
                  <FormControl>
                    <Input placeholder="https://..." className={inputClass} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Dynamic Additional Details (Key-Value) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <FormLabel className={formLabelClass}>Detail Tambahan</FormLabel>
                  <p className={`mt-1 text-xs ${helperTextClass}`}>
                    Contoh: Penilaian, Kriteria, Biaya Pendaftaran, Kontak, dll.
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addPair}
                  className={addFieldButtonClass}
                >
                  + Tambah Field
                </Button>
              </div>
              <div className="space-y-2">
                {detailPairs.map((pair) => (
                  <div key={pair.id} className="grid grid-cols-1 gap-2 md:grid-cols-12">
                    <div className="md:col-span-4">
                      <Input
                        placeholder="Key (mis: kontak, biaya)"
                        value={pair.key}
                        onChange={(e) => updatePair(pair.id, { key: e.target.value })}
                        className={inputClass}
                      />
                    </div>
                    <div className="md:col-span-8">
                      <div className="flex items-center gap-2">
                        <Input
                          placeholder="Value"
                          value={pair.value}
                          onChange={(e) => updatePair(pair.id, { value: e.target.value })}
                          className={`flex-1 ${inputClass}`}
                        />
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          onClick={() => removePair(pair.id)}
                          disabled={detailPairs.length <= 1}
                          className={`min-w-[72px] shrink-0 px-2 ${detailRemoveButtonClass} disabled:cursor-not-allowed disabled:opacity-50`}
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
                  <FormLabel className={formLabelClass}>File</FormLabel>
                  <FormControl>
                    <input
                      type="file"
                      accept="application/pdf,image/*"
                      onChange={(e) => field.onChange(e.target.files?.[0])}
                      className={fileInputClass}
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
                    <FormLabel className={formLabelClass}>Halaman Mulai</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        disabled={!fileSelected}
                        value={field.value ?? ""}
                        onChange={(e) =>
                          field.onChange(e.target.value ? Number(e.target.value) : undefined)
                        }
                        className={`${inputClass} ${disabledFieldClass}`}
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
                    <FormLabel className={formLabelClass}>Halaman Akhir</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        disabled={!fileSelected}
                        value={field.value ?? ""}
                        onChange={(e) =>
                          field.onChange(e.target.value ? Number(e.target.value) : undefined)
                        }
                        className={`${inputClass} ${disabledFieldClass}`}
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
                className={`${primaryButtonClass} disabled:opacity-60`}
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600" />
                    <span>Menyimpan...</span>
                  </div>
                ) : (
                  submitText
                )}
              </Button>
              <DarkModal.Close asChild>
                <Button
                  type="button"
                  variant="ghost"
                  disabled={isSubmitting}
                  className={`${cancelButtonClass} disabled:opacity-60`}
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
