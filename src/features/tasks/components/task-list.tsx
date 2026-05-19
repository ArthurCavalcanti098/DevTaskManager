"use client";

import { useState, useCallback } from "react";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragOverEvent,
  type DragEndEvent,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { Plus, Search, ClipboardList, Tag as TagIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TaskCard } from "./task-card";
import { TaskDialog } from "./task-dialog";
import { KanbanColumn } from "./kanban-column";
import { TagManagerDialog } from "@/features/tags/components/tag-manager-dialog";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { ColumnSkeleton } from "@/components/common/skeleton";
import type { Task, Tag, TaskStatus, TaskPriority } from "@/types";
import type { CreateTaskInput } from "@/validators/task";

const statusColumns: { id: TaskStatus; label: string }[] = [
  { id: "BACKLOG", label: "Backlog" },
  { id: "TODO", label: "A fazer" },
  { id: "IN_PROGRESS", label: "Em andamento" },
  { id: "REVIEW", label: "Revisão" },
  { id: "DONE", label: "Concluído" },
];

const statusOptions: { value: TaskStatus; label: string }[] = [
  { value: "BACKLOG", label: "Backlog" },
  { value: "TODO", label: "A fazer" },
  { value: "IN_PROGRESS", label: "Em andamento" },
  { value: "REVIEW", label: "Revisão" },
  { value: "DONE", label: "Concluído" },
];

const priorityOptions: { value: TaskPriority; label: string }[] = [
  { value: "LOW", label: "Baixa" },
  { value: "MEDIUM", label: "Média" },
  { value: "HIGH", label: "Alta" },
  { value: "URGENT", label: "Urgente" },
];

interface TaskListProps {
  tasks: Task[];
  isLoadingTasks: boolean;
  createTask: (data: CreateTaskInput) => Promise<Task>;
  updateTask: (id: string, data: Record<string, unknown>) => Promise<Task>;
  deleteTask: (id: string) => Promise<void>;
  moveTask: (taskId: string, newStatus: TaskStatus, newIndex: number) => Promise<void>;
  tags: Tag[];
  createTag: (data: { name: string; color?: string }) => Promise<Tag>;
  updateTag: (id: string, data: { name?: string; color?: string }) => Promise<Tag>;
  deleteTag: (id: string) => Promise<void>;
  tagManagerOpen?: boolean;
  onTagManagerChange?: (open: boolean) => void;
}

export function TaskList({
  tasks,
  isLoadingTasks,
  createTask,
  updateTask,
  deleteTask,
  moveTask,
  tags,
  createTag,
  updateTag,
  deleteTag,
  tagManagerOpen: tagManagerOpenProp,
  onTagManagerChange,
}: TaskListProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<TaskStatus | "">("");
  const [priorityFilter, setPriorityFilter] = useState<TaskPriority | "">("");
  const [tagFilter, setTagFilter] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deletingTask, setDeletingTask] = useState<Task | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tagManagerOpenLocal, setTagManagerOpenLocal] = useState(false);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [activeStatus, setActiveStatus] = useState<TaskStatus | null>(null);
  const tagManagerOpen = tagManagerOpenProp ?? tagManagerOpenLocal;
  const setTagManagerOpen = onTagManagerChange ?? setTagManagerOpenLocal;

  const hasFilters = Boolean(search || statusFilter || priorityFilter || tagFilter);

  const filteredTasks = tasks.filter((task) => {
    if (search) {
      const q = search.toLowerCase();
      if (!task.title.toLowerCase().includes(q)) return false;
    }
    if (statusFilter && task.status !== statusFilter) return false;
    if (priorityFilter && task.priority !== priorityFilter) return false;
    if (tagFilter && !task.tags?.some((t) => t.tagId === tagFilter)) return false;
    return true;
  });

  const tasksByStatus = statusColumns.map((col) => ({
    ...col,
    tasks: filteredTasks
      .filter((t) => t.status === col.id)
      .sort((a, b) => a.order - b.order),
  }));

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const handleDragStart = useCallback(
    (event: DragStartEvent) => {
      const { active } = event;
      const task = tasks.find((t) => t.id === active.id);
      if (task) {
        setActiveTask(task);
        setActiveStatus(task.status);
      }
    },
    [tasks],
  );

  const handleDragOver = useCallback(
    (event: DragOverEvent) => {
      if (hasFilters) return;
      const { over } = event;
      if (!over) return;

      const overId = over.id as string;
      const overTask = tasks.find((t) => t.id === overId);
      const overColumn = statusColumns.find((col) => col.id === overId);
      const newStatus = overTask?.status ?? overColumn?.id;

      if (newStatus) {
        setActiveStatus(newStatus);
      }
    },
    [tasks, hasFilters],
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const currentStatus = activeStatus;
      setActiveTask(null);
      setActiveStatus(null);
      if (hasFilters) return;

      const { active, over } = event;
      if (!over) return;

      const activeId = active.id as string;
      const overId = over.id as string;

      if (activeId === overId) return;

      if (!currentStatus) return;

      const overTask = tasks.find((t) => t.id === overId);
      const overColumn = statusColumns.find((col) => col.id === overId);
      const targetStatus = overTask?.status ?? overColumn?.id ?? currentStatus;

      const tasksInTarget = tasks
        .filter((t) => t.status === targetStatus && t.id !== activeId)
        .sort((a, b) => a.order - b.order);

      const overIndex = overTask
        ? tasksInTarget.findIndex((t) => t.id === overId)
        : tasksInTarget.length;

      moveTask(activeId, targetStatus, Math.max(0, overIndex));
    },
    [tasks, hasFilters, activeStatus, moveTask],
  );

  function handleClearFilters() {
    setSearch("");
    setStatusFilter("");
    setPriorityFilter("");
    setTagFilter("");
  }

  async function handleCreate(data: CreateTaskInput) {
    setIsSubmitting(true);
    try {
      await createTask(data);
      setDialogOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleUpdate(data: CreateTaskInput) {
    if (!editingTask) return;
    setIsSubmitting(true);
    try {
      await updateTask(editingTask.id, data);
      setEditingTask(null);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete() {
    if (!deletingTask) return;
    setIsSubmitting(true);
    try {
      await deleteTask(deletingTask.id);
      setDeletingTask(null);
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoadingTasks) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="h-9 w-64 animate-pulse rounded-md bg-bg-tertiary" />
          <div className="flex items-center gap-2">
            <div className="h-9 w-28 animate-pulse rounded-md bg-bg-tertiary" />
            <div className="h-9 w-28 animate-pulse rounded-md bg-bg-tertiary" />
            <div className="h-9 w-24 animate-pulse rounded-md bg-bg-tertiary" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
          <ColumnSkeleton />
          <ColumnSkeleton />
          <ColumnSkeleton />
          <ColumnSkeleton />
          <ColumnSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute left-4 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-text-muted"
          />
          <Input
            placeholder="Buscar tarefas..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="!pl-12"
          />
        </div>
        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as TaskStatus | "")}
            className="flex h-9 rounded-md border border-border-default bg-bg-tertiary px-3 py-1 text-sm text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary"
          >
            <option value="">Todos os status</option>
            {statusOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value as TaskPriority | "")}
            className="flex h-9 rounded-md border border-border-default bg-bg-tertiary px-3 py-1 text-sm text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary"
          >
            <option value="">Todas as prioridades</option>
            {priorityOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          {tags.length > 0 && (
            <select
              value={tagFilter}
              onChange={(e) => setTagFilter(e.target.value)}
              className="flex h-9 rounded-md border border-border-default bg-bg-tertiary px-3 py-1 text-sm text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary"
            >
              <option value="">Todas as tags</option>
              {tags.map((tag) => (
                <option key={tag.id} value={tag.id}>
                  {tag.name}
                </option>
              ))}
            </select>
          )}
          <Button variant="ghost" size="sm" onClick={() => setTagManagerOpen(true)}>
            <TagIcon className="h-4 w-4 mr-1" />
            Tags
          </Button>
          <Button onClick={() => setDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Nova tarefa
          </Button>
        </div>
      </div>

      {hasFilters && (
        <div className="flex items-center justify-between rounded-md bg-bg-tertiary px-3 py-2 text-xs text-text-muted">
          <span>Limpe os filtros para reorganizar tarefas.</span>
          <Button variant="ghost" size="sm" onClick={handleClearFilters} className="h-6 text-xs">
            Limpar filtros
          </Button>
        </div>
      )}

      {tasks.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border-default py-16">
          <ClipboardList className="h-12 w-12 text-text-muted mb-4" />
          <h3 className="text-lg font-medium text-text-primary mb-1">Nenhuma tarefa ainda</h3>
          <p className="text-sm text-text-secondary mb-4">Crie sua primeira tarefa para começar</p>
          <Button onClick={() => setDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Criar tarefa
          </Button>
        </div>
      )}

      {tasks.length > 0 && (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
            {tasksByStatus.map((column) => (
              <KanbanColumn
                key={column.id}
                id={column.id}
                label={column.label}
                tasks={column.tasks}
                onEdit={setEditingTask}
                onDelete={setDeletingTask}
                disabled={hasFilters}
              />
            ))}
          </div>
          <DragOverlay dropAnimation={null}>
            {activeTask && (
              <TaskCard
                task={activeTask}
                onEdit={() => {}}
                onDelete={() => {}}
              />
            )}
          </DragOverlay>
        </DndContext>
      )}

      <TaskDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        tags={tags}
        onSubmit={handleCreate}
        isLoading={isSubmitting}
      />

      <TaskDialog
        open={!!editingTask}
        onOpenChange={(open) => !open && setEditingTask(null)}
        task={editingTask}
        tags={tags}
        onSubmit={handleUpdate}
        isLoading={isSubmitting}
      />

      <ConfirmDialog
        open={!!deletingTask}
        onOpenChange={(open) => !open && setDeletingTask(null)}
        title="Delete Task"
        description={`Are you sure you want to delete "${deletingTask?.title}"? This action cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={handleDelete}
        isLoading={isSubmitting}
      />

      <TagManagerDialog
        open={tagManagerOpen}
        onOpenChange={setTagManagerOpen}
        tags={tags}
        onCreate={createTag}
        onUpdate={updateTag}
        onDelete={deleteTag}
      />
    </div>
  );
}
