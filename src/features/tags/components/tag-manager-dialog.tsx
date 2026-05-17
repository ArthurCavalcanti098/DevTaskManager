"use client";

import { useState } from "react";
import { Pencil, Trash2, Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { TagDialog } from "./tag-dialog";
import type { Tag } from "@/types";
import type { CreateTagInput } from "@/validators/tag";

interface TagManagerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tags: Tag[];
  onCreate: (data: CreateTagInput) => Promise<Tag>;
  onUpdate: (id: string, data: { name?: string; color?: string }) => Promise<Tag>;
  onDelete: (id: string) => Promise<void>;
}

export function TagManagerDialog({
  open,
  onOpenChange,
  tags,
  onCreate,
  onUpdate,
  onDelete,
}: TagManagerDialogProps) {
  const [createOpen, setCreateOpen] = useState(false);
  const [editingTag, setEditingTag] = useState<Tag | null>(null);
  const [deletingTag, setDeletingTag] = useState<Tag | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleCreate(data: CreateTagInput) {
    setIsSubmitting(true);
    try {
      await onCreate(data);
      setCreateOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleUpdate(data: CreateTagInput) {
    if (!editingTag) return;
    setIsSubmitting(true);
    try {
      await onUpdate(editingTag.id, data);
      setEditingTag(null);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete() {
    if (!deletingTag) return;
    setIsSubmitting(true);
    try {
      await onDelete(deletingTag.id);
      setDeletingTag(null);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[420px] bg-bg-secondary border-border-default">
          <DialogHeader>
            <DialogTitle className="text-text-primary">Gerenciar tags</DialogTitle>
            <DialogDescription className="sr-only">
              Crie, edite ou exclua tags
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3">
            {tags.length === 0 ? (
              <p className="text-sm text-text-muted py-4 text-center">Nenhuma tag ainda</p>
            ) : (
              <div className="space-y-1">
                {tags.map((tag) => (
                  <div
                    key={tag.id}
                    className="flex items-center justify-between rounded-md px-3 py-2 hover:bg-bg-hover"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="h-3 w-3 rounded-full flex-shrink-0"
                        style={{ backgroundColor: tag.color }}
                      />
                      <span className="text-sm text-text-primary">{tag.name}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => setEditingTag(tag)}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-accent-danger hover:text-accent-danger"
                        onClick={() => setDeletingTag(tag)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => setCreateOpen(true)}
            >
              <Plus className="h-4 w-4 mr-1" />
              Criar tag
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <TagDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onSubmit={handleCreate}
        isLoading={isSubmitting}
      />

      <TagDialog
        open={!!editingTag}
        onOpenChange={(open) => !open && setEditingTag(null)}
        tag={editingTag}
        onSubmit={handleUpdate}
        isLoading={isSubmitting}
      />

      <ConfirmDialog
        open={!!deletingTag}
        onOpenChange={(open) => !open && setDeletingTag(null)}
        title="Excluir tag"
        description={`Tem certeza que deseja excluir "${deletingTag?.name}"? Esta ação não pode ser desfeita.`}
        confirmLabel="Excluir"
        onConfirm={handleDelete}
        isLoading={isSubmitting}
      />
    </>
  );
}
