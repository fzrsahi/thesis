"use client";

import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";

import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  isLight?: boolean;
}

export const DataTable = <TData, TValue>({
  columns,
  data,
  isLight = false,
}: DataTableProps<TData, TValue>) => {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const borderColor = isLight ? "border-stone-300" : "border-zinc-700";
  const bgHeader = isLight ? "bg-[#F6E5D4]/60" : "bg-zinc-800";
  const bgRowEven = isLight ? "bg-white" : "bg-zinc-900";
  const bgRowOdd = isLight ? "bg-stone-50/50" : "bg-zinc-800";
  const bgHover = isLight ? "hover:bg-stone-100/80" : "hover:bg-zinc-700/40";
  const textHeader = isLight ? "text-[#2F2A24]" : "text-zinc-100";
  const textCell = isLight ? "text-[#2F2A24]" : "text-zinc-100";
  const textNoResults = isLight ? "text-[#7A6B5B]" : "text-zinc-400";

  return (
    <div
      className={cn(
        "rounded-xl border shadow-sm",
        isLight ? "border-stone-300/70 bg-white/90" : "border-zinc-700 bg-zinc-900"
      )}
    >
      <Table className={isLight ? "bg-white/90" : "bg-zinc-900"}>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className={cn("border-b", borderColor, bgHeader)}>
              {headerGroup.headers.map((header) => {
                const meta = header.column.columnDef.meta as
                  | { headerClassName?: string }
                  | undefined;
                return (
                  <TableHead
                    key={header.id}
                    className={cn(
                      "sticky top-0 z-10 border-b font-semibold",
                      borderColor,
                      bgHeader,
                      textHeader,
                      meta?.headerClassName
                    )}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row, idx) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
                className={cn(
                  "border-b transition-colors",
                  borderColor,
                  idx % 2 === 1 ? bgRowOdd : bgRowEven,
                  bgHover
                )}
              >
                {row.getVisibleCells().map((cell) => {
                  // Handle field/array columns with badges
                  if (cell.column.id === "field" || cell.column.id === "specialization") {
                    const fields = cell.getValue() as string[];
                    return (
                      <TableCell key={cell.id} className={cn("space-x-1", textCell)}>
                        {fields && fields.length > 0
                          ? fields.map((f) => <Badge key={f}>{f}</Badge>)
                          : "-"}
                      </TableCell>
                    );
                  }

                  return (
                    <TableCell key={cell.id} className={cn("align-top", textCell)}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))
          ) : (
            <TableRow className={bgRowEven}>
              <TableCell colSpan={columns.length} className={cn("h-24 text-center", textNoResults)}>
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
