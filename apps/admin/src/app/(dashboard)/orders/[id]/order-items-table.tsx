"use client";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Package } from "lucide-react";
export function OrderItemsTable({ data, columns }: any) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });
  return (
    <div className="overflow-hidden rounded-xl border bg-background shadow-sm">
      {" "}
      <div className="overflow-x-auto">
        {" "}
        <Table>
          {" "}
          <TableHeader className="bg-muted/40">
            {" "}
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-transparent">
                {" "}
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="h-12 whitespace-nowrap px-5 text-xs font-semibold uppercase tracking-wide text-muted-foreground"
                  >
                    {" "}
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}{" "}
                  </TableHead>
                ))}{" "}
              </TableRow>
            ))}{" "}
          </TableHeader>{" "}
          <TableBody>
            {" "}
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className="group border-b transition-colors hover:bg-muted/30"
                >
                  {" "}
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="px-5 py-4 align-middle">
                      {" "}
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}{" "}
                    </TableCell>
                  ))}{" "}
                </TableRow>
              ))
            ) : (
              <TableRow>
                {" "}
                <TableCell
                  colSpan={columns.length}
                  className="h-32 text-center"
                >
                  {" "}
                  <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                    {" "}
                    <Package className="h-8 w-8 opacity-40" />{" "}
                    <p className="text-sm">No items found</p>{" "}
                  </div>{" "}
                </TableCell>{" "}
              </TableRow>
            )}{" "}
          </TableBody>{" "}
        </Table>{" "}
      </div>{" "}
    </div>
  );
}
