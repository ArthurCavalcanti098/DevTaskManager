"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { TagForm } from "./tag-form";
import type { Tag } from "@/types";
import type { CreateTagInput } from "@/validators/tag";

interface TagDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tag?: Tag | null;
  onSubmit: (data: CreateTagInput) => void;
  isLoading?: boolean;
}

export function TagDialog({ open, onOpenChange, tag, onSubmit, isLoading }: TagDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px] bg-bg-secondary border-border-default">
        <DialogHeader>
          <DialogTitle className="text-text-primary">{tag ? "Edit Tag" : "Create Tag"}</DialogTitle>
        </DialogHeader>
        <TagForm
          tag={tag}
          onSubmit={onSubmit}
          onCancel={() => onOpenChange(false)}
          isLoading={isLoading}
        />
      </DialogContent>
    </Dialog>
  );
}
