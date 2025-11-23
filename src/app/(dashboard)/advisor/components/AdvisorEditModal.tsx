"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";

import { ADVISOR_TYPES } from "@/app/shared/const/role";
import { AdvisorSchema, type AdvisorPayload } from "@/app/shared/schema/advisor/AdvisorSchema";
import Button from "@/components/ui/button";
import { DarkModal } from "@/components/ui/dark-modal";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import Input from "@/components/ui/input";

// Simple fetcher for study programs
const fetchStudyPrograms = async () => {
  const res = await fetch("/api/study-programs", { cache: "no-store" });
  if (!res.ok) throw new Error("Gagal memuat program studi");
  const json = (await res.json()) as { success?: boolean; data?: { id: number; name: string }[] };
  return json.data ?? [];
};

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

const extractBackendMessage = (e: unknown): string | undefined => {
  if (isBackendHttpError(e)) {
    const data = (e.response as { data?: BackendErrorData } | undefined)?.data;
    if (data?.message) return data.message;
    if (data?.error?.message) return data.error.message;
    if (typeof (e as BackendHttpError).message === "string") return (e as BackendHttpError).message;
  } else if (e instanceof Error) {
    return e.message;
  }
  return undefined;
};

type AdvisorEditModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: AdvisorPayload) => void | boolean | Promise<void | boolean>;
  defaultValues?: Partial<AdvisorPayload> & { id?: number };
  title?: string;
  submitText?: string;
};

export const AdvisorEditModal = ({
  open,
  onOpenChange,
  onSubmit,
  defaultValues,
  title = "Edit Dosen",
  submitText = "Simpan",
}: AdvisorEditModalProps) => {
  const resolver = useMemo(() => zodResolver(AdvisorSchema), []);

  const form = useForm<AdvisorPayload>({
    resolver,
    defaultValues: {
      name: defaultValues?.name ?? "",
      email: defaultValues?.email ?? "",
      type: (defaultValues?.type ?? "HeadOfDepartment") as AdvisorPayload["type"],
      studyProgramId: defaultValues?.studyProgramId ?? null,
    },
    values: open
      ? {
          name: defaultValues?.name ?? "",
          email: defaultValues?.email ?? "",
          type: (defaultValues?.type ?? "HeadOfDepartment") as AdvisorPayload["type"],
          studyProgramId: defaultValues?.studyProgramId ?? null,
        }
      : undefined,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [backendError, setBackendError] = useState<string | null>(null);
  const [studyPrograms, setStudyPrograms] = useState<{ id: number; name: string }[]>([]);
  const [_loadingPrograms, setLoadingPrograms] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        setLoadingPrograms(true);
        const list = await fetchStudyPrograms();
        setStudyPrograms(list);
      } catch (e) {
        // ignore, will be handled by selection state
      } finally {
        setLoadingPrograms(false);
      }
    };
    if (open) load();
  }, [open]);

  const handleSubmit = async (values: AdvisorPayload) => {
    setBackendError(null);
    setIsSubmitting(true);
    try {
      const result = await onSubmit(values);
      const isOk = result === true;
      if (isOk) {
        onOpenChange(false);
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
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-zinc-200">Nama</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Nama lengkap"
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
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-zinc-200">Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="email@contoh.com"
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
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-zinc-200">Tipe Dosen</FormLabel>
                  <FormControl>
                    <select
                      value={field.value}
                      onChange={(e) => field.onChange(e.target.value)}
                      className="rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-zinc-100"
                    >
                      <option value={ADVISOR_TYPES.HEAD_OF_DEPARTMENT}>Ketua Jurusan</option>
                      <option value={ADVISOR_TYPES.HEAD_OF_STUDY_PROGRAM}>
                        Kepala Program Studi
                      </option>
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {form.watch("type") === ADVISOR_TYPES.HEAD_OF_STUDY_PROGRAM && (
              <FormField
                control={form.control}
                name="studyProgramId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-zinc-200">Program Studi</FormLabel>
                    <FormControl>
                      <select
                        value={field.value == null ? "" : String(field.value)}
                        onChange={(e) =>
                          field.onChange(e.target.value ? Number(e.target.value) : null)
                        }
                        className="rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-zinc-100"
                      >
                        <option value="">Pilih Program Studi</option>
                        {studyPrograms.map((sp) => (
                          <option key={sp.id} value={sp.id}>
                            {sp.name}
                          </option>
                        ))}
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

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

export default AdvisorEditModal;
