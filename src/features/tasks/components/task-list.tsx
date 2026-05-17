"use client";

import { useState } from "react";
import { Plus, Search, ClipboardList } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TaskCard } from "./task-card";
import { TaskDialog } from "./task-dialog";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { ColumnSkeleton } from "@/components/common/skeleton";
import { useTasks } from "../hooks/use-tasks";
import { useTags } from "@/features/tags/hooks/use-tags";
import type { Task, TaskStatus, TaskPriority } from "@/types";
import type { CreateTaskInput } from "@/validators/task";

const statusColumns: { id: TaskStatus; label: string }[] = [
  { id: "BACKLOG", label: "Backlog" },
  { id: "TODO", label: "To Do" },
  { id: "IN_PROGRESS", label: "In Progress" },
  { id: "DONE", label: "Done" },
];

const statusOptions: { value: TaskStatus; label: string }[] = [
  { value: "BACKLOG", label: "Backlog" },
  { value: "TODO", label: "To Do" },
  { value: "IN_PROGRESS", label: "In Progress" },
  { value: "DONE", label: "Done" },
];

const priorityOptions: { value: TaskPriority; label: string }[] = [
  { value: "LOW", label: "Low" },
  { value: "MEDIUM", label: "Medium" },
  { value: "HIGH", label: "High" },
  { value: "URGENT", label: "Urgent" },
];

export function TaskList() {
  const { tasks, isLoading, createTask, updateTask, deleteTask } = useTasks();
  const { tags } = useTags();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<TaskStatus | "">("");
  const [priorityFilter, setPriorityFilter] = useState<TaskPriority | "">("");
  const [tagFilter, setTagFilter] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deletingTask, setDeletingTask] = useState<Task | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filteredTasks = tasks.filter((task) => {
    if (search) {
      const q = search.toLowerCase();
      const matchesSearch =
        task.title.toLowerCase().includes(q) ||
        task.description?.toLowerCase().includes(q);
      if (!matchesSearch) return false;
    }
    if (statusFilter && task.status !== statusFilter) return false;
    if (priorityFilter && task.priority !== priorityFilter) return false;
    if (tagFilter && !task.tags?.some((t) => t.tagId === tagFilter)) return false;
    return true;
  });

  const tasksByStatus = statusColumns.map((col) => ({
    ...col,
    tasks: filteredTasks.filter((t) => t.status === col.id),
  }));

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

  if (isLoading) {
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
          <Input
            placeholder="Search tasks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as TaskStatus | "")}
            className="flex h-9 rounded-md border border-border-default bg-bg-tertiary px-3 py-1 text-sm text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary"
          >
            <option value="">All Status</option>
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
            <option value="">All Priority</option>
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
              <option value="">All Tags</option>
              {tags.map((tag) => (
                <option key={tag.id} value={tag.id}>
                  {tag.name}
                </option>
              ))}
            </select>
          )}
          <Button onClick={() => setDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Task
          </Button>
        </div>
      </div>

      {tasks.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border-default py-16">
          <ClipboardList className="h-12 w-12 text-text-muted mb-4" />
          <h3 className="text-lg font-medium text-text-primary mb-1">No tasks yet</h3>
          <p className="text-sm text-text-secondary mb-4">Create your first task to get started</p>
          <Button onClick={() => setDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Task
          </Button>
        </div>
      )}

      {tasks.length > 0 && (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {tasksByStatus.map((column) => (
          <div key={column.id} className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-medium text-text-secondary">{column.label}</h2>
              <span className="text-xs text-text-muted bg-bg-tertiary px-2 py-1 rounded-full">
                {column.tasks.length}
              </span>
            </div>
            <div className="space-y-2">
              {column.tasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onEdit={setEditingTask}
                  onDelete={setDeletingTask}
                />
              ))}
              {column.tasks.length === 0 && (
                <div className="rounded-lg border border-dashed border-border-default p-4 text-center text-xs text-text-muted">
                  No tasks
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
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
    </div>
  );
}
