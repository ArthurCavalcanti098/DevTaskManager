"use client";

import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { KanbanCard } from "./kanban-card";
import type { Task, TaskStatus } from "@/types";

interface KanbanColumnProps {
  id: TaskStatus;
  label: string;
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  disabled?: boolean;
}

export function KanbanColumn({
  id,
  label,
  tasks,
  onEdit,
  onDelete,
  disabled,
}: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id,
    data: { type: "column", status: id },
    disabled,
  });

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-medium text-text-secondary">{label}</h2>
        <span className="text-xs text-text-muted bg-bg-tertiary px-2 py-1 rounded-full">
          {tasks.length}
        </span>
      </div>
      <div
        ref={setNodeRef}
        className={`space-y-2 min-h-[120px] rounded-lg p-1 transition-colors ${
          isOver && !disabled
            ? "bg-accent-primary/5 ring-1 ring-accent-primary/20"
            : ""
        }`}
      >
        <SortableContext
          items={tasks.map((t) => t.id)}
          strategy={verticalListSortingStrategy}
          disabled={disabled}
        >
          {tasks.map((task) => (
            <KanbanCard
              key={task.id}
              task={task}
              onEdit={onEdit}
              onDelete={onDelete}
              disabled={disabled}
            />
          ))}
        </SortableContext>
        {tasks.length === 0 && (
          <div className="rounded-lg border border-dashed border-border-default p-4 text-center text-xs text-text-muted">
            Sem tarefas
          </div>
        )}
      </div>
    </div>
  );
}
