"use client";

import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { Eye, Pencil, Trash } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import Button from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export const DataTable = <TData, TValue>({ columns, data }: DataTableProps<TData, TValue>) => {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="rounded-xl border border-zinc-700 bg-zinc-900 shadow-sm">
      <Table className="bg-zinc-900 text-zinc-100">
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="border-b border-zinc-700 bg-zinc-800">
              {headerGroup.headers.map((header) => (
                <TableHead
                  key={header.id}
                  className="sticky top-0 z-10 border-b border-zinc-700 bg-zinc-800 text-zinc-100"
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row, idx) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
                className={`${
                  idx % 2 === 1 ? "bg-zinc-800" : "bg-zinc-900"
                } border-b border-zinc-700 transition-colors hover:bg-zinc-700/40`}
              >
                {row.getVisibleCells().map((cell) => {
                  if (cell.column.id === "field") {
                    const fields = cell.getValue() as string[];
                    return (
                      <TableCell key={cell.id} className="space-x-1 text-zinc-100">
                        {fields && fields.length > 0
                          ? fields.map((f) => <Badge key={f}>{f}</Badge>)
                          : "-"}
                      </TableCell>
                    );
                  }
                  if (cell.column.id === "aksi") {
                    return (
                      <TableCell key={cell.id} className="text-zinc-100">
                        <div className="flex gap-1">
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-zinc-700 bg-gradient-to-r from-zinc-800 to-zinc-900 text-zinc-100 shadow-sm hover:ring-2 hover:ring-blue-400"
                          >
                            <Eye className="h-4 w-4 text-blue-400" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-zinc-700 bg-gradient-to-r from-zinc-800 to-zinc-900 text-zinc-100 shadow-sm hover:ring-2 hover:ring-amber-400"
                          >
                            <Pencil className="h-4 w-4 text-amber-400" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-zinc-700 bg-gradient-to-r from-zinc-800 to-zinc-900 text-zinc-100 shadow-sm hover:ring-2 hover:ring-red-400"
                          >
                            <Trash className="h-4 w-4 text-red-400" />
                          </Button>
                        </div>
                      </TableCell>
                    );
                  }
                  return (
                    <TableCell key={cell.id} className="text-zinc-100">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))
          ) : (
            <TableRow className="bg-zinc-900">
              <TableCell colSpan={columns.length} className="h-24 text-center text-zinc-400">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
