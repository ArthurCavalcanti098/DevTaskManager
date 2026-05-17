"use client";

import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createTaskSchema } from "@/validators/task";
import type { Task, Tag, TaskStatus, TaskPriority } from "@/types";

interface TaskFormProps {
  task?: Task | null;
  tags: Tag[];
  onSubmit: (data: TaskFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

interface TaskFormData {
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  tagIds?: string[];
}

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

export function TaskForm({ task, tags, onSubmit, onCancel, isLoading }: TaskFormProps) {
  const {
    register,
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<TaskFormData>({
    // @ts-expect-error - zod resolver type mismatch with react-hook-form
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      title: task?.title ?? "",
      description: task?.description ?? "",
      status: task?.status ?? "TODO",
      priority: task?.priority ?? "MEDIUM",
      tagIds: task?.tags?.map((t) => t.tagId) ?? [],
    },
  });

  const selectedTagIds = useWatch({ control, name: "tagIds" }) ?? [];

  useEffect(() => {
    if (task) {
      reset({
        title: task.title,
        description: task.description ?? "",
        status: task.status,
        priority: task.priority,
        tagIds: task.tags?.map((t) => t.tagId) ?? [],
      });
    }
  }, [task, reset]);

  function toggleTag(tagId: string) {
    const current = selectedTagIds;
    if (current.includes(tagId)) {
      setValue("tagIds", current.filter((id) => id !== tagId));
    } else {
      setValue("tagIds", [...current, tagId]);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit as never)} className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium text-text-primary">Título</label>
        <Input
          {...register("title")}
          placeholder="Título da tarefa"
          className={errors.title ? "border-accent-danger" : ""}
        />
        {errors.title && (
          <p className="text-xs text-accent-danger">{errors.title.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-text-primary">Descrição</label>
        <textarea
          {...register("description")}
          placeholder="Adicione uma descrição..."
          rows={3}
          className="flex w-full rounded-md border border-border-default bg-bg-tertiary px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary resize-none"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-text-primary">Status</label>

          <select
            {...register("status")}
            className="flex h-10 w-full rounded-md border border-border-default bg-bg-tertiary px-3 py-2 text-sm text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary"
          >
            {statusOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-text-primary">Prioridade</label>
          <select
            {...register("priority")}
            className="flex h-10 w-full rounded-md border border-border-default bg-bg-tertiary px-3 py-2 text-sm text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary"
          >
            {priorityOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {tags.length > 0 && (
        <div className="space-y-2">
          <label className="text-sm font-medium text-text-primary">Tags</label>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <button
                key={tag.id}
                type="button"
                onClick={() => toggleTag(tag.id)}
                className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                  selectedTagIds.includes(tag.id)
                    ? "ring-2 ring-accent-primary"
                    : "opacity-60 hover:opacity-100"
                }`}
                style={{
                  backgroundColor: `${tag.color}20`,
                  color: tag.color,
                }}
              >
                {tag.name}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Salvando..." : task ? "Salvar" : "Criar tarefa"}
        </Button>
      </div>
    </form>
  );
}
