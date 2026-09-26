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
import { cn } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export type User = {
  id: string;
  name: string;
  email: string;
  role: "admin" | "client" | "seller";
  status: "approved" | "pending" | "rejected";
  profile_image?: string;
};

export const columns: ColumnDef<User>[] = [
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
    accessorKey: "avatar",
    header: "Avatar",
    enableSorting: false,
    cell: ({ row }) => {
      const user = row.original;
      return (
        <div className="w-9 h-9 relative">

          {user.profile_image ?

            <Image
              src={`${process.env.NEXT_PUBLIC_API_URL}/storage/${user.profile_image}`}
              alt={user.name}
              fill
              className="rounded-full object-cover"
            />
            : <User className="w-9 h-9" />}

        </div>
      );
    },
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          User
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "email",
    enableSorting: false,
    header: "Email",
  },
  {
    accessorKey: "role",
    header: "Role",
    enableSorting: false,
    cell: ({ row }) => {
      const role = row.getValue("role");

      return (
        <div
          className={cn(
            `p-1 rounded-md w-max text-xs`,
            role === "admin" && "bg-green-500/40",
            role === "seller" && "bg-yellow-500/40",
            role === "client" && "bg-gray-500/40",
          )}
        >
          {role as string}
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    enableSorting: false,
    cell: ({ row }) => {
      const status = row.getValue("status");

      return (
        <div
          className={cn(
            `p-1 rounded-md w-max text-xs`,
            status === "approved" && "bg-green-500/40",
            status === "pending" && "bg-yellow-500/40",
            status === "rejected" && "bg-red-500/40",
          )}
        >
          {status as string}
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const user = row.original;

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
              onClick={() => navigator.clipboard.writeText(user.id)}
            >
              Copy user ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link href={`/users/${user.id}`}>View customer</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
