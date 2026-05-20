"use client";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import type { Task, TaskPriority, TaskStatus } from "@/types";

interface RecentTasksProps {
  tasks: Task[];
  className?: string;
}

const priorityLabels: Record<TaskPriority, string> = {
  LOW: "Baixa",
  MEDIUM: "Média",
  HIGH: "Alta",
  URGENT: "Urgente",
};

const priorityColors: Record<TaskPriority, string> = {
  LOW: "bg-green-500/20 text-green-400",
  MEDIUM: "bg-amber-500/20 text-amber-400",
  HIGH: "bg-red-400/20 text-red-300",
  URGENT: "bg-red-600/30 text-red-500 font-semibold",
};

const statusLabels: Record<TaskStatus, string> = {
  BACKLOG: "Backlog",
  TODO: "A fazer",
  IN_PROGRESS: "Em andamento",
  REVIEW: "Em revisão",
  DONE: "Concluído",
};

const statusColors: Record<TaskStatus, string> = {
  BACKLOG: "text-text-muted",
  TODO: "text-blue-400",
  IN_PROGRESS: "text-amber-400",
  REVIEW: "text-purple-400",
  DONE: "text-green-400",
};

export function RecentTasks({ tasks, className }: RecentTasksProps) {
  const recent = [...tasks]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5);

  return (
    <div className={cn("rounded-lg border border-border-default bg-bg-secondary p-4", className)}>
      <h3 className="text-sm font-medium text-text-primary mb-4">Tarefas recentes</h3>
      {recent.length === 0 ? (
        <p className="text-sm text-text-muted">Nenhuma tarefa encontrada</p>
      ) : (
        <div className="space-y-2">
          {recent.map((task) => (
            <div
              key={task.id}
              className="flex items-center justify-between rounded-md bg-bg-tertiary px-3 py-2"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm text-text-primary truncate">{task.title}</p>
                <span className={cn("text-xs", statusColors[task.status])}>
                  {statusLabels[task.status]}
                </span>
              </div>
              <Badge className={cn("ml-3 flex-shrink-0", priorityColors[task.priority])}>
                {priorityLabels[task.priority]}
              </Badge>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
