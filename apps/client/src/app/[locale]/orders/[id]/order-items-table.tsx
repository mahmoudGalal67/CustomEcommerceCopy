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

export function OrderItemsTable({ data, columns }: any) {
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <div className="rounded-md border mt-4">
            <Table>
                <TableHeader>
                    {table.getHeaderGroups().map((hg:any) => (
                        <TableRow key={hg.id}>
                            {hg.headers.map((h:any) => (
                                <TableHead key={h.id}>
                                    {flexRender(
                                        h.column.columnDef.header,
                                        h.getContext()
                                    )}
                                </TableHead>
                            ))}
                        </TableRow>
                    ))}
                </TableHeader>

                <TableBody>
                    {table.getRowModel().rows.map((row:any) => (
                        <TableRow key={row.id}>
                            {row.getVisibleCells().map((cell:any) => (
                                <TableCell key={cell.id}>
                                    {flexRender(
                                        cell.column.columnDef.cell,
                                        cell.getContext()
                                    )}
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
