"use client";

import { Competition } from "@/app/(dashboard)/competition/page";
import Button from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

interface CompetitionDeleteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  data: Competition | null;
}

export const CompetitionDeleteModal = ({
  open,
  onOpenChange,
  onConfirm,
  data,
}: CompetitionDeleteModalProps) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Hapus Kompetisi</DialogTitle>
      </DialogHeader>
      <div className="py-4 text-center">
        Apakah Anda yakin ingin menghapus kompetisi{" "}
        <span className="font-bold text-red-400">{data?.title}</span>?
      </div>
      <DialogFooter>
        <Button variant="destructive" onClick={onConfirm}>
          Hapus
        </Button>
        <DialogClose asChild>
          <Button type="button" variant="ghost">
            Batal
          </Button>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);
