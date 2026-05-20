"use client";

import { cn } from "@/lib/utils";
import type { Task, TaskStatus } from "@/types";

interface TasksByStatusProps {
  tasks: Task[];
  className?: string;
}

const statusConfig: Record<TaskStatus, { label: string; color: string; bg: string }> = {
  BACKLOG: { label: "Backlog", color: "text-text-muted", bg: "bg-text-muted" },
  TODO: { label: "A fazer", color: "text-blue-400", bg: "bg-blue-400" },
  IN_PROGRESS: { label: "Em andamento", color: "text-amber-400", bg: "bg-amber-400" },
  REVIEW: { label: "Em revisão", color: "text-purple-400", bg: "bg-purple-400" },
  DONE: { label: "Concluído", color: "text-green-400", bg: "bg-green-400" },
};

const statusOrder: TaskStatus[] = ["BACKLOG", "TODO", "IN_PROGRESS", "REVIEW", "DONE"];

export function TasksByStatus({ tasks, className }: TasksByStatusProps) {
  const counts = statusOrder.map((status) => ({
    status,
    count: tasks.filter((t) => t.status === status).length,
    ...statusConfig[status],
  }));

  const max = Math.max(...counts.map((c) => c.count), 1);

  return (
    <div className={cn("rounded-lg border border-border-default bg-bg-secondary p-4", className)}>
      <h3 className="text-sm font-medium text-text-primary mb-4">Tarefas por status</h3>
      <div className="space-y-3">
        {counts.map(({ status, count, label, color, bg }) => (
          <div key={status} className="flex items-center gap-3">
            <span className={cn("w-24 text-xs", color)}>{label}</span>
            <div className="flex-1 h-2 rounded-full bg-bg-tertiary">
              <div
                className={cn("h-full rounded-full transition-all duration-300", bg)}
                style={{ width: `${(count / max) * 100}%` }}
              />
            </div>
            <span className="w-8 text-right text-xs text-text-secondary">{count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
