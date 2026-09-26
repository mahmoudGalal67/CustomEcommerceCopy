"use client";

import { useEffect, useState } from "react";

import {
  useDeleteNewsletterSubscriberMutation,
  useGetNewsletterSubscribersQuery,
  useUpdateNewsletterSubscriberMutation,
  type NewsletterSubscriberStatus,
} from "@/services/newsletterSlice";

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

import { Button } from "@/components/ui/button";

import { Alert, AlertDescription } from "@/components/ui/alert";

import {
  AlertCircle,
  CheckCircle2,
  Trash2,
  Mail,
  Users,
  Loader2,
} from "lucide-react";

export default function NewsletterPage() {
  const [search, setSearch] = useState("");

  const [status, setStatus] = useState<NewsletterSubscriberStatus | "all">(
    "all",
  );

  const [page, setPage] = useState(1);

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const { data, isLoading, isFetching } = useGetNewsletterSubscribersQuery({
    search,
    status: status === "all" ? undefined : status,
    page,
    per_page: 15,
  });

  const [updateSubscriber, { isLoading: isUpdating }] =
    useUpdateNewsletterSubscriberMutation();

  const [deleteSubscriber, { isLoading: isDeleting }] =
    useDeleteNewsletterSubscriberMutation();

  useEffect(() => {
    if (!successMessage && !errorMessage) {
      return;
    }

    const timer = setTimeout(() => {
      setSuccessMessage("");
      setErrorMessage("");
    }, 4000);

    return () => clearTimeout(timer);
  }, [successMessage, errorMessage]);

  const handleStatusChange = async (
    id: number,
    newStatus: NewsletterSubscriberStatus,
  ) => {
    try {
      await updateSubscriber({
        id,
        status: newStatus,
      }).unwrap();

      setSuccessMessage("Subscriber status updated successfully.");
    } catch (error) {
      console.error(error);

      setErrorMessage("Failed to update subscriber status.");
    }
  };

  const handleDelete = async (id: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this subscriber?",
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteSubscriber(id).unwrap();

      setSuccessMessage("Subscriber deleted successfully.");
    } catch (error) {
      console.error(error);

      setErrorMessage("Failed to delete subscriber.");
    }
  };

  const formatDate = (date: string) => {
    return new Intl.DateTimeFormat("en", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(date));
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
              <Mail className="h-5 w-5 text-primary" />
            </div>

            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                Newsletter Subscribers
              </h1>

              <p className="text-sm text-muted-foreground">
                Manage your newsletter subscribers.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 rounded-xl border bg-card px-4 py-3">
          <Users className="h-4 w-4 text-muted-foreground" />

          <div>
            <p className="text-xs text-muted-foreground">Total Subscribers</p>

            <p className="font-semibold">{data?.total ?? 0}</p>
          </div>
        </div>
      </div>

      {/* Alerts */}

      {successMessage && (
        <Alert className="border-green-500/30 bg-green-500/10 text-green-700 dark:text-green-400">
          <CheckCircle2 className="h-4 w-4" />

          <AlertDescription>{successMessage}</AlertDescription>
        </Alert>
      )}

      {errorMessage && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />

          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}

      {/* Filters */}

      <div className="flex flex-col gap-3 rounded-xl border p-4 md:flex-row">
        <Input
          placeholder="Search by email..."
          value={search}
          onChange={(event) => {
            setSearch(event.target.value);
            setPage(1);
          }}
          className="md:max-w-sm"
        />

        <Select
          value={status}
          onValueChange={(value) => {
            setStatus(value as NewsletterSubscriberStatus | "all");
            setPage(1);
          }}
        >
          <SelectTrigger className="md:w-[180px]">
            <SelectValue placeholder="Filter status" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="all">All Subscribers</SelectItem>

            <SelectItem value="subscribed">Subscribed</SelectItem>

            <SelectItem value="unsubscribed">Unsubscribed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}

      <div className="overflow-hidden rounded-xl border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>

              <TableHead>Status</TableHead>

              <TableHead>Subscribed At</TableHead>

              <TableHead>Created At</TableHead>

              <TableHead className="w-[220px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center">
                  <div className="flex items-center justify-center gap-2 text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Loading subscribers...
                  </div>
                </TableCell>
              </TableRow>
            ) : data?.data?.length ? (
              data.data.map((subscriber) => (
                <TableRow key={subscriber.id}>
                  {/* Email */}

                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                      </div>

                      <span className="font-medium">{subscriber.email}</span>
                    </div>
                  </TableCell>

                  {/* Status */}

                  <TableCell>
                    {subscriber.status === "subscribed" ? (
                      <Badge
                        variant="outline"
                        className="border-green-500/30 bg-green-500/10 text-green-700 dark:text-green-400"
                      >
                        Subscribed
                      </Badge>
                    ) : (
                      <Badge
                        variant="outline"
                        className="border-muted-foreground/30 bg-muted text-muted-foreground"
                      >
                        Unsubscribed
                      </Badge>
                    )}
                  </TableCell>

                  {/* Subscribed */}

                  <TableCell className="text-muted-foreground">
                    {subscriber.subscribed_at
                      ? formatDate(subscriber.subscribed_at)
                      : "—"}
                  </TableCell>

                  {/* Created */}

                  <TableCell className="text-muted-foreground">
                    {formatDate(subscriber.created_at)}
                  </TableCell>

                  {/* Actions */}

                  <TableCell>
                    <div className="flex items-center justify-end gap-2">
                      <Select
                        value={subscriber.status}
                        disabled={isUpdating}
                        onValueChange={(value) =>
                          handleStatusChange(
                            subscriber.id,
                            value as NewsletterSubscriberStatus,
                          )
                        }
                      >
                        <SelectTrigger className="w-[130px]">
                          <SelectValue />
                        </SelectTrigger>

                        <SelectContent>
                          <SelectItem value="subscribed">Subscribed</SelectItem>

                          <SelectItem value="unsubscribed">
                            Unsubscribed
                          </SelectItem>
                        </SelectContent>
                      </Select>

                      <Button
                        variant="ghost"
                        size="icon"
                        disabled={isDeleting}
                        onClick={() => handleDelete(subscriber.id)}
                        className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                      >
                        {isDeleting ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="h-32 text-center text-muted-foreground"
                >
                  No newsletter subscribers found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {/* Loading indicator while changing filters */}

        {isFetching && !isLoading && (
          <div className="border-t px-4 py-2 text-xs text-muted-foreground">
            Updating...
          </div>
        )}
      </div>

      {/* Pagination */}

      {data && data.last_page > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing{" "}
            <span className="font-medium text-foreground">
              {data.from ?? 0}
            </span>{" "}
            to{" "}
            <span className="font-medium text-foreground">{data.to ?? 0}</span>{" "}
            of <span className="font-medium text-foreground">{data.total}</span>{" "}
            subscribers
          </p>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1 || isFetching}
              onClick={() => setPage((current) => current - 1)}
            >
              Previous
            </Button>

            <div className="rounded-md border px-3 py-2 text-sm">
              {data.current_page} / {data.last_page}
            </div>

            <Button
              variant="outline"
              size="sm"
              disabled={page >= data.last_page || isFetching}
              onClick={() => setPage((current) => current + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
