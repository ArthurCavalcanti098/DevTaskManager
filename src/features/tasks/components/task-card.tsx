"use client";

import { useState } from "react";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Task, TaskPriority } from "@/types";

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

const priorityColors: Record<TaskPriority, string> = {
  LOW: "bg-green-500/20 text-green-400",
  MEDIUM: "bg-amber-500/20 text-amber-400",
  HIGH: "bg-red-400/20 text-red-300",
  URGENT: "bg-red-600/30 text-red-500 font-semibold",
};

const priorityLabels: Record<TaskPriority, string> = {
  LOW: "Baixa",
  MEDIUM: "Média",
  HIGH: "Alta",
  URGENT: "Urgente",
};

export function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div
      className={cn(
        "group rounded-lg border border-border-default bg-bg-secondary p-4",
        "hover:border-border-strong hover:bg-bg-elevated transition-colors"
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-sm font-medium text-text-primary line-clamp-2">
          {task.title}
        </h3>
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => setShowMenu(!showMenu)}
          >
            <MoreHorizontal className="h-3 w-3" />
          </Button>
          {showMenu && (
            <div className="absolute right-0 top-7 z-10 w-36 rounded-lg border border-border-default bg-bg-elevated py-1 shadow-lg">
              <button
                className="flex w-full items-center gap-2 px-3 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-bg-hover"
                onClick={() => {
                  onEdit(task);
                  setShowMenu(false);
                }}
              >
                <Pencil className="h-3 w-3" />
                Edit
              </button>
              <button
                className="flex w-full items-center gap-2 px-3 py-2 text-sm text-accent-danger hover:bg-bg-hover"
                onClick={() => {
                  onDelete(task);
                  setShowMenu(false);
                }}
              >
                <Trash2 className="h-3 w-3" />
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {task.description && (
        <p className="mt-2 text-xs text-text-tertiary line-clamp-2">
          {task.description}
        </p>
      )}

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <Badge variant="secondary" className={priorityColors[task.priority]}>
          {priorityLabels[task.priority]}
        </Badge>
        {task.tags?.map((taskTag) => (
          <Badge
            key={taskTag.id}
            style={{ backgroundColor: `${taskTag.tag.color}20`, color: taskTag.tag.color }}
          >
            {taskTag.tag.name}
          </Badge>
        ))}
      </div>
    </div>
  );
}
