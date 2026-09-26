"use client";

import { useState } from "react";
import { useGetContactMessagesQuery } from "@/services/contactSlice";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Input } from "@/components/ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Badge } from "@/components/ui/badge";

import ContactMessageSheet from "@/components/ContactMessageSheet";
import { Button } from "@/components/ui/button";

export default function ContactMessagesPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<string>("all");
  const [page, setPage] = useState(1);

  const { data, isLoading, isFetching } = useGetContactMessagesQuery({
    search: search || undefined,
    status: status === "all" ? undefined : (status as any),
    page,
    per_page: 15,
  });

  const [selectedMessageId, setSelectedMessageId] = useState<number | null>(
    null,
  );

  const [sheetOpen, setSheetOpen] = useState(false);

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold">Contact Messages</h1>

        <p className="text-sm text-muted-foreground">
          Manage messages received from your customers.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <Input
          placeholder="Search messages..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="max-w-sm"
        />

        <Select
          value={status}
          onValueChange={(value) => {
            setStatus(value);
            setPage(1);
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter status" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="all">All messages</SelectItem>

            <SelectItem value="new">New</SelectItem>

            <SelectItem value="read">Read</SelectItem>

            <SelectItem value="replied">Replied</SelectItem>

            <SelectItem value="closed">Closed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="rounded-xl border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>

              <TableHead>Subject</TableHead>

              <TableHead>Status</TableHead>

              <TableHead>Date</TableHead>

              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center">
                  Loading messages...
                </TableCell>
              </TableRow>
            ) : data?.data?.length ? (
              data.data.map((message) => (
                <TableRow key={message.id}>
                  {/* Customer */}
                  <TableCell>
                    <div>
                      <p className="font-medium">{message.name}</p>

                      <p className="text-sm text-muted-foreground">
                        {message.email}
                      </p>
                    </div>
                  </TableCell>

                  {/* Subject */}
                  <TableCell>
                    <div className="max-w-[300px] truncate">
                      {message.subject}
                    </div>
                  </TableCell>

                  {/* Status */}
                  <TableCell>
                    <StatusBadge status={message.status} />
                  </TableCell>

                  {/* Date */}
                  <TableCell>
                    <span className="text-sm text-muted-foreground">
                      {new Date(message.created_at).toLocaleDateString()}
                    </span>
                  </TableCell>

                  {/* Actions */}
                  <TableCell className="text-right ">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="cursor-pointer"
                      onClick={() => {
                        setSelectedMessageId(message.id);
                        setSheetOpen(true);
                      }}
                    >
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="h-32 text-center text-muted-foreground"
                >
                  No contact messages found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {data?.from ?? 0}–{data?.to ?? 0} of {data?.total ?? 0}
        </p>

        <div className="flex gap-2">
          <button
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
            className="rounded-md border px-3 py-2 text-sm disabled:opacity-50"
          >
            Previous
          </button>

          <button
            disabled={!data || page >= data.last_page}
            onClick={() => setPage((p) => p + 1)}
            className="rounded-md border px-3 py-2 text-sm disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
      <ContactMessageSheet
        messageId={selectedMessageId}
        open={sheetOpen}
        onOpenChange={(open) => {
          setSheetOpen(open);

          if (!open) {
            setSelectedMessageId(null);
          }
        }}
      />
    </div>
  );
}

function StatusBadge({
  status,
}: {
  status: "new" | "read" | "replied" | "closed";
}) {
  const config = {
    new: {
      label: "New",
      className: "bg-blue-500/10 text-blue-600 border-blue-500/20",
    },

    read: {
      label: "Read",
      className: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
    },

    replied: {
      label: "Replied",
      className: "bg-green-500/10 text-green-600 border-green-500/20",
    },

    closed: {
      label: "Closed",
      className: "bg-muted text-muted-foreground",
    },
  };

  const item = config[status];

  return (
    <Badge variant="outline" className={item.className}>
      {item.label}
    </Badge>
  );
}
