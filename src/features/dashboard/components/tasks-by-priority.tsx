"use client";

import { cn } from "@/lib/utils";
import type { Task, TaskPriority } from "@/types";

interface TasksByPriorityProps {
  tasks: Task[];
  className?: string;
}

const priorityConfig: Record<TaskPriority, { label: string; color: string; bg: string }> = {
  LOW: { label: "Baixa", color: "text-green-400", bg: "bg-green-400" },
  MEDIUM: { label: "Média", color: "text-amber-400", bg: "bg-amber-400" },
  HIGH: { label: "Alta", color: "text-red-300", bg: "bg-red-300" },
  URGENT: { label: "Urgente", color: "text-red-500", bg: "bg-red-500" },
};

const priorityOrder: TaskPriority[] = ["URGENT", "HIGH", "MEDIUM", "LOW"];

export function TasksByPriority({ tasks, className }: TasksByPriorityProps) {
  const counts = priorityOrder.map((priority) => ({
    priority,
    count: tasks.filter((t) => t.priority === priority).length,
    ...priorityConfig[priority],
  }));

  const max = Math.max(...counts.map((c) => c.count), 1);

  return (
    <div className={cn("rounded-lg border border-border-default bg-bg-secondary p-4", className)}>
      <h3 className="text-sm font-medium text-text-primary mb-4">Tarefas por prioridade</h3>
      <div className="space-y-3">
        {counts.map(({ priority, count, label, color, bg }) => (
          <div key={priority} className="flex items-center gap-3">
            <span className={cn("w-16 text-xs", color)}>{label}</span>
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
