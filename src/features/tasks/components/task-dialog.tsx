"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { TaskForm } from "./task-form";
import type { Task, Tag } from "@/types";
import type { CreateTaskInput } from "@/validators/task";

interface TaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task?: Task | null;
  tags: Tag[];
  onSubmit: (data: CreateTaskInput) => void;
  isLoading?: boolean;
}

export function TaskDialog({
  open,
  onOpenChange,
  task,
  tags,
  onSubmit,
  isLoading,
}: TaskDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-bg-secondary border-border-default">
        <DialogHeader>
          <DialogTitle className="text-text-primary">
            {task ? "Editar tarefa" : "Nova tarefa"}
          </DialogTitle>
          <DialogDescription className="sr-only">
            {task ? "Edite os dados da tarefa" : "Preencha os dados para criar uma nova tarefa"}
          </DialogDescription>
        </DialogHeader>
        <TaskForm
          task={task}
          tags={tags}
          onSubmit={onSubmit}
          onCancel={() => onOpenChange(false)}
          isLoading={isLoading}
        />
      </DialogContent>
    </Dialog>
  );
}
