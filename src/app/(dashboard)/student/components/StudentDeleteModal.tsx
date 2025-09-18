"use client";

import { AlertTriangle, X } from "lucide-react";
import { useState } from "react";

import Button from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

type StudentDeleteModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => Promise<boolean> | boolean | void;
  title?: string;
  description?: string;
  confirmText?: string;
};

export const StudentDeleteModal = ({
  open,
  onOpenChange,
  onConfirm,
  title = "Hapus Mahasiswa",
  description = "Tindakan ini tidak dapat dibatalkan. Data mahasiswa akan dihapus permanen.",
  confirmText = "Hapus",
}: StudentDeleteModalProps) => {
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-2 border-zinc-700 bg-zinc-900 text-zinc-100">
        <DialogHeader>
          <DialogTitle className="text-zinc-100">{title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {error && (
            <div className="flex items-center gap-2 rounded-lg border border-red-700 bg-red-900/20 p-3">
              <AlertTriangle className="h-4 w-4 text-red-400" />
              <p className="text-sm text-red-400">{error}</p>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setError(null)}
                className="ml-auto h-6 w-6 p-0 text-red-400 hover:bg-red-800 hover:text-red-300"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          )}
          <div className="py-4 text-center text-zinc-100">
            <div className="flex items-start gap-3 rounded-md border border-zinc-700 bg-zinc-800 p-4 text-zinc-100">
              <AlertTriangle className="mt-0.5 h-5 w-5 text-yellow-400" />
              <p className="text-sm leading-6">{description}</p>
            </div>
          </div>
        </div>
        <DialogFooter className="pt-4">
          <Button
            type="button"
            onClick={handleConfirm}
            disabled={isSubmitting}
            className="bg-red-600 text-white hover:bg-red-700 disabled:opacity-60"
          >
            {confirmText}
          </Button>
          <DialogClose asChild>
            <Button
              type="button"
              variant="ghost"
              disabled={isSubmitting}
              className="bg-zinc-800 text-zinc-100 hover:bg-zinc-700"
            >
              Batal
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default StudentDeleteModal;
