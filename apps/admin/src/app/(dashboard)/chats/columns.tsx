"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export type Chat = {
  id: string;
  user: any;
  status: string;
  ai_handled: boolean;
  unread_by_admin: number;
  last_message_at: string;
  messages: any[];
};

export const columns: ColumnDef<Chat>[] = [
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
    accessorKey: "id",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Chat
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "user",
    header: "User",
    enableSorting: false,
    cell: ({ row }) => {
      const chat = row.original;
      return (
        <div className="w-9 h-9 relative flex items-center justify-center">

          {chat.user ? chat.user.profile_image ?

            <Image
              src={`${process.env.NEXT_PUBLIC_API_URL}/storage/${chat.user.profile_image}`}
              alt={chat.user.name}
              fill
              className="rounded-full object-cover"
            />
            : <div>{chat.user.name}</div> : <User className="w-9 h-9" />}
        </div>
      );
    },
  },

  {
    accessorKey: "status",
    enableSorting: false,
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;

      return (
        <Badge
          className={`
          capitalize px-3 py-1 rounded-full text-xs font-medium
          
          ${status === "resolved"
              ? "bg-green-100 text-green-700 border border-green-200"
              : ""}

          ${status === "pending_admin"
              ? "bg-yellow-100 text-yellow-700 border border-yellow-200"
              : ""}

          ${status === "open"
              ? "bg-blue-100 text-blue-700 border border-blue-200"
              : ""}

          ${status === "closed"
              ? "bg-red-100 text-red-700 border border-red-200"
              : ""}
        `}
        >
          {status}
        </Badge>
      );
    },
  },
  {
    accessorKey: "unread_by_admin",
    enableSorting: false,
    header: "Unread_count",
    cell: ({ row }) => {
      const unreadCount = row.original.unread_by_admin ?? 0;
      return (
        <Badge
          className={`
          capitalize px-3 py-1 rounded-full text-xs font-medium

          ${unreadCount > 0
              ? "bg-yellow-100 text-yellow-700 border border-yellow-200"
              : "bg-green-100 text-green-700 border border-green-200"}
        `}
        >
          {unreadCount}
        </Badge>
      );
    }
  },
  {
    accessorKey: "ai_handled",
    enableSorting: false,
    header: "AI_handled",
    cell: ({ row }) => {
      const ai_handled = row.original.ai_handled;

      return (
        <Badge
          className={`
          capitalize px-3 py-1 rounded-full text-xs font-medium
          
          ${ai_handled
              ? "bg-yellow-100 text-yellow-700 border border-yellow-200"
              : "bg-green-100 text-green-700 border border-green-200"}
        `}
        >
          {ai_handled}
        </Badge>
      );
    }
  },
  {
    accessorKey: "last_message_at",
    enableSorting: false,
    header: "Last_message_at",
  },

  {
    id: "actions",
    cell: ({ row }) => {
      const chat = row.original;

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
              onClick={() => navigator.clipboard.writeText(chat.id)}
            >
              Copy user ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link href={`/chats/${chat.id}`}>View Chat messages</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
