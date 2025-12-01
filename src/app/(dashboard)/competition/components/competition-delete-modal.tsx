"use client";

import { AlertTriangle, X } from "lucide-react";
import { useState } from "react";

import Button from "@/components/ui/button";
import { DarkModal, type DarkModalVariant } from "@/components/ui/dark-modal";

type CompetitionLike = {
  id: number;
  title?: string;
};

interface CompetitionDeleteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => Promise<boolean>;
  data: CompetitionLike | null;
  title?: string;
  description?: string;
  confirmText?: string;
  variant?: DarkModalVariant;
}

export const CompetitionDeleteModal = ({
  open,
  onOpenChange,
  onConfirm,
  data,
  title = "Hapus Kompetisi",
  description,
  confirmText = "Hapus",
  variant = "dark",
}: CompetitionDeleteModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConfirm = async () => {
    setError(null);
    setIsSubmitting(true);
    try {
      const result = await onConfirm();
      const ok = result === true || result === undefined;
      if (ok) {
        onOpenChange(false);
      } else if (typeof result === "string") {
        setError(result);
      } else {
        setError("Gagal menghapus. Coba lagi.");
      }
    } catch (e) {
      const message = e instanceof Error ? e.message : "Terjadi kesalahan pada server";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isLight = variant === "light";
  const errorContainerClass = isLight ? "border-red-300 bg-red-50" : "border-red-700 bg-red-900/20";
  const errorTextClass = isLight ? "text-red-700" : "text-red-400";
  const errorCloseButtonClass = isLight
    ? "text-red-600 hover:bg-red-100 hover:text-red-800"
    : "text-red-400 hover:bg-red-800 hover:text-red-300";
  const warningBoxClass = isLight ? "text-zinc-800" : "text-zinc-100";
  const warningWrapperClass = isLight
    ? "flex items-start gap-3 rounded-md border border-zinc-200 bg-zinc-50 p-4"
    : "flex items-start gap-3 rounded-md border border-zinc-700 bg-zinc-800 p-4";
  const warningIconClass = isLight ? "text-yellow-500" : "text-yellow-400";
  const warningHighlightClass = isLight ? "text-red-600" : "text-red-400";
  const confirmButtonClass = "bg-red-600 text-white hover:bg-red-700";
  const cancelButtonClass = isLight
    ? "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
    : "bg-zinc-800 text-zinc-100 hover:bg-zinc-700";

  return (
    <DarkModal.Root open={open} onOpenChange={onOpenChange} variant={variant}>
      <DarkModal.Content className="border-2">
        <DarkModal.Header>
          <DarkModal.Title>{title}</DarkModal.Title>
        </DarkModal.Header>
        <div className="space-y-4">
          {error && (
            <div className={`flex items-center gap-2 rounded-lg border p-3 ${errorContainerClass}`}>
              <AlertTriangle className={`h-4 w-4 ${errorTextClass}`} />
              <p className={`text-sm ${errorTextClass}`}>{error}</p>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setError(null)}
                className={`ml-auto h-6 w-6 p-0 ${errorCloseButtonClass}`}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          )}
          <div className="py-4 text-center">
            <div className={warningWrapperClass}>
              <AlertTriangle className={`mt-0.5 h-5 w-5 ${warningIconClass}`} />
              <p className={`text-sm leading-6 ${warningBoxClass}`}>
                {description ?? (
                  <>
                    Tindakan ini tidak dapat dibatalkan. Kompetisi{" "}
                    <span className={`font-bold ${warningHighlightClass}`}>{data?.title}</span> akan
                    dihapus permanen.
                  </>
                )}
              </p>
            </div>
          </div>
        </div>
        <DarkModal.Footer className="pt-4">
          <Button
            type="button"
            onClick={handleConfirm}
            disabled={isSubmitting}
            className={`${confirmButtonClass} disabled:opacity-60`}
          >
            {confirmText}
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
      </DarkModal.Content>
    </DarkModal.Root>
  );
};

export default CompetitionDeleteModal;
