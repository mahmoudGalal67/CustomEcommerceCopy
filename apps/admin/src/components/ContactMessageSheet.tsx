"use client";

import { useEffect, useState } from "react";
import {
  useGetContactMessageQuery,
  useUpdateContactMessageMutation,
  useDeleteContactMessageMutation,
  useSendContactReplyMutation,
  type ContactMessageStatus,
} from "@/services/contactSlice";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Textarea } from "@/components/ui/textarea";

import { Button } from "@/components/ui/button";

import { Label } from "@/components/ui/label";

import { Separator } from "@/components/ui/separator";

import { Badge } from "@/components/ui/badge";

import {
  Loader2,
  Mail,
  Phone,
  User,
  Calendar,
  Trash2,
  Save,
} from "lucide-react";

type ContactMessageSheetProps = {
  messageId: number | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function ContactMessageSheet({
  messageId,
  open,
  onOpenChange,
}: ContactMessageSheetProps) {
  const {
    data: message,
    isLoading,
    isFetching,
  } = useGetContactMessageQuery(messageId as number, {
    skip: !messageId || !open,
  });

  const [updateContactMessage, { isLoading: isUpdating }] =
    useUpdateContactMessageMutation();

  const [deleteContactMessage, { isLoading: isDeleting }] =
    useDeleteContactMessageMutation();
  const [sendContactReply, { isLoading: isReplying }] =
    useSendContactReplyMutation();
  const [status, setStatus] = useState<ContactMessageStatus>("new");

  const [adminNotes, setAdminNotes] = useState("");
  const [replyMessage, setReplyMessage] = useState("");

  /*
  |--------------------------------------------------------------------------
  | Sync form with API data
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    if (!message) return;

    setStatus(message.status);
    setAdminNotes(message.admin_notes ?? "");
  }, [message]);

  /*
  |--------------------------------------------------------------------------
  | Save changes
  |--------------------------------------------------------------------------
  */

  const handleSave = async () => {
    if (!message) return;

    try {
      await updateContactMessage({
        id: message.id,
        status,
        admin_notes: adminNotes || null,
      }).unwrap();
    } catch (error) {
      console.error("Failed to update contact message:", error);
    }
  };
  const handleReply = async () => {
    if (!message || !replyMessage.trim()) {
      return;
    }

    try {
      await sendContactReply({
        id: message.id,
        message: replyMessage.trim(),
      }).unwrap();

      setReplyMessage("");

      // Refresh the message
      // because status becomes "replied"
    } catch (error) {
      console.error("Failed to send contact reply:", error);
    }
  };
  /*
  |--------------------------------------------------------------------------
  | Delete
  |--------------------------------------------------------------------------
  */

  const handleDelete = async () => {
    if (!message) return;

    const confirmed = window.confirm(
      "Are you sure you want to delete this message?",
    );

    if (!confirmed) return;

    try {
      await deleteContactMessage(message.id).unwrap();

      onOpenChange(false);
    } catch (error) {
      console.error("Failed to delete contact message:", error);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="flex w-full flex-col p-0 sm:max-w-xl"
      >
        {/* Header */}
        <SheetHeader className="border-b px-6 py-5">
          <SheetTitle>Contact Message</SheetTitle>

          <SheetDescription>
            View and manage this customer message.
          </SheetDescription>
        </SheetHeader>

        {/* Loading */}
        {isLoading || isFetching ? (
          <div className="flex flex-1 items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : message ? (
          <>
            {/* Content */}
            <div className="flex-1 overflow-y-auto">
              <div className="space-y-6 p-6">
                {/* Customer */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">Customer</h3>

                    <StatusBadge status={message.status} />
                  </div>

                  <div className="rounded-xl border bg-muted/30 p-4 space-y-4">
                    {/* Name */}
                    <div className="flex items-start gap-3">
                      <User className="mt-0.5 h-4 w-4 text-muted-foreground" />

                      <div>
                        <p className="text-xs text-muted-foreground">Name</p>

                        <p className="font-medium">{message.name}</p>
                      </div>
                    </div>

                    {/* Email */}
                    <div className="flex items-start gap-3">
                      <Mail className="mt-0.5 h-4 w-4 text-muted-foreground" />

                      <div>
                        <p className="text-xs text-muted-foreground">Email</p>

                        <a
                          href={`mailto:${message.email}`}
                          className="font-medium hover:underline"
                        >
                          {message.email}
                        </a>
                      </div>
                    </div>

                    {/* Phone */}
                    {message.phone && (
                      <div className="flex items-start gap-3">
                        <Phone className="mt-0.5 h-4 w-4 text-muted-foreground" />

                        <div>
                          <p className="text-xs text-muted-foreground">Phone</p>

                          <a
                            href={`tel:${message.phone}`}
                            className="font-medium hover:underline"
                          >
                            {message.phone}
                          </a>
                        </div>
                      </div>
                    )}

                    {/* Date */}
                    <div className="flex items-start gap-3">
                      <Calendar className="mt-0.5 h-4 w-4 text-muted-foreground" />

                      <div>
                        <p className="text-xs text-muted-foreground">
                          Received
                        </p>

                        <p className="font-medium">
                          {new Date(message.created_at).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Message */}
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-muted-foreground">Subject</p>

                    <h3 className="mt-1 text-lg font-semibold">
                      {message.subject}
                    </h3>
                  </div>

                  <div className="rounded-xl border bg-muted/20 p-4">
                    <p className="whitespace-pre-wrap text-sm leading-7">
                      {message.message}
                    </p>
                  </div>
                </div>

                <Separator />

                {/* Status */}
                <div className="space-y-2">
                  <Label>Status</Label>

                  <Select
                    value={status}
                    onValueChange={(value) =>
                      setStatus(value as ContactMessageStatus)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>

                    <SelectContent>
                      <SelectItem value="new">New</SelectItem>

                      <SelectItem value="read">Read</SelectItem>

                      <SelectItem value="replied">Replied</SelectItem>

                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-3">
                  <div>
                    <Label className="text-base font-semibold">
                      Reply to Customer
                    </Label>

                    <p className="mt-1 text-xs text-muted-foreground">
                      This message will be sent to {message.email}
                    </p>
                  </div>

                  <Textarea
                    value={replyMessage}
                    onChange={(e) => setReplyMessage(e.target.value)}
                    placeholder="Write your reply..."
                    className="min-h-36 resize-none"
                  />

                  <Button
                    onClick={handleReply}
                    disabled={isReplying || !replyMessage.trim()}
                    className="w-full sm:w-auto"
                  >
                    {isReplying ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Mail className="mr-2 h-4 w-4" />
                        Send Reply
                      </>
                    )}
                  </Button>
                </div>
                {/* Admin Notes */}
                <div className="space-y-2">
                  <Label>Private Admin Notes</Label>

                  <Textarea
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    placeholder="Add private notes about this customer or message..."
                    className="min-h-32 resize-none"
                  />

                  <p className="text-xs text-muted-foreground">
                    These notes are only visible to admins.
                  </p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t bg-background p-4">
              <div className="flex items-center justify-between gap-3">
                <Button
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={isDeleting || isUpdating}
                >
                  {isDeleting ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="mr-2 h-4 w-4" />
                  )}
                  Delete
                </Button>

                <Button
                  onClick={handleSave}
                  disabled={isUpdating || isDeleting}
                >
                  {isUpdating ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="mr-2 h-4 w-4" />
                  )}
                  Save Changes
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-1 items-center justify-center text-muted-foreground">
            Message not found.
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}

/*
|--------------------------------------------------------------------------
| Status Badge
|--------------------------------------------------------------------------
*/

function StatusBadge({ status }: { status: ContactMessageStatus }) {
  const config = {
    new: {
      label: "New",
      className: "border-blue-500/20 bg-blue-500/10 text-blue-600",
    },

    read: {
      label: "Read",
      className: "border-yellow-500/20 bg-yellow-500/10 text-yellow-600",
    },

    replied: {
      label: "Replied",
      className: "border-green-500/20 bg-green-500/10 text-green-600",
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
