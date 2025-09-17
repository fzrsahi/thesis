"use client";

import React from "react";

import Button from "./button";

export type PaginationMeta = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
};

type PaginationProps = {
  pagination: PaginationMeta;
  onPageChange: (page: number) => void;
  className?: string;
};

const Pagination: React.FC<PaginationProps> = ({ pagination, onPageChange, className }) => {
  const { page, totalPages, hasPrevPage, hasNextPage } = pagination;

  return (
    <div className={className}>
      <div className="mt-6 flex flex-col gap-4 px-2 pb-2 md:flex-row md:items-center md:justify-between">
        <div className="text-muted-foreground text-sm">
          Halaman {page} dari {totalPages}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(page - 1)}
            disabled={!hasPrevPage}
            className={
              !hasPrevPage
                ? "cursor-not-allowed border-zinc-800 bg-zinc-900 text-zinc-600"
                : "border-zinc-700 bg-gradient-to-r from-zinc-800 to-zinc-900 text-white hover:bg-zinc-700 hover:ring-2 hover:ring-blue-400"
            }
          >
            Sebelumnya
          </Button>
          <span className="text-sm font-medium">
            {page} / {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(page + 1)}
            disabled={!hasNextPage}
            className={
              !hasNextPage
                ? "cursor-not-allowed border-zinc-800 bg-zinc-900 text-zinc-600"
                : "border-zinc-700 bg-gradient-to-r from-zinc-800 to-zinc-900 text-white hover:bg-zinc-700 hover:ring-2 hover:ring-blue-400"
            }
          >
            Berikutnya
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Pagination;
