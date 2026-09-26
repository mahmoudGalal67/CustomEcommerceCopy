"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, FilterIcon, MoreHorizontal } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export type Category = {
  id: string;
  name: string;
  description: string;
  icon?: string;
  slug: string;
  translations: { name: string }[];
};

export const columns: ColumnDef<Category>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        checked={row.getIsSelected()}
      />
    ),
  },
  {
    id: "id",
    header: "#Id",
    accessorKey: "id",
    enableSorting: false,
  },
  {
    accessorKey: "icon",
    header: "Icon",
    enableSorting: false,
    cell: ({ row }) => {
      const category = row.original;
      return (
        <div className="w-9 h-9 relative">
          {category.icon ? (
            <Image
              src={`${process.env.NEXT_PUBLIC_API_URL}/storage/${category.icon}`}
              alt={category.name}
              fill
              className="rounded-full object-cover"
            />
          ) : (
            <FilterIcon className="w-9 h-9" />
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "translations",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Category
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const name = row.original.translations[0].name;
      return <span>{name}</span>;
    },
  },

  {
    accessorKey: "description",
    enableSorting: false,
    header: "Description",
  },

  {
    id: "actions",
    cell: ({ row }) => {
      const category = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(category.id)}
            >
              Copy Category ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link href={`/categories/${category.id}/edit`}>
                View Category
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
