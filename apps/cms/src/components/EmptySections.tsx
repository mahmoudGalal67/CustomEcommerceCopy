"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptySectionsProps {
  onAddSection: () => void;
}

export default function EmptySections({ onAddSection }: EmptySectionsProps) {
  return (
    <div className="flex min-h-75 flex-col items-center justify-center rounded-xl border border-dashed bg-muted/20 p-8 text-center">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
        <Plus className="h-6 w-6 text-primary" />
      </div>

      <h3 className="text-lg font-semibold">No sections yet</h3>

      <p className="mt-1 max-w-sm text-sm text-muted-foreground">
        Start building your page by adding your first section.
      </p>

      <Button
        type="button"
        className="mt-5 cursor-pointer"
        onClick={onAddSection}
      >
        <Plus className="mr-2 h-4 w-4" />
        Add New Section
      </Button>
    </div>
  );
}
