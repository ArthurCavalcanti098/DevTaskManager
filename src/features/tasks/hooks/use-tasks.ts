"use client";

import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import type { Task, TaskStatus } from "@/types";

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const fetchedRef = useRef(false);

  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;

    async function load() {
      try {
        const res = await fetch("/api/tasks");
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.error || "Failed to fetch tasks");
        }
        const data = await res.json();
        setTasks(data);
      } catch (error) {
        console.error("Failed to load tasks:", error);
        toast.error("Failed to load tasks");
      } finally {
        setIsLoading(false);
      }
    }

    load();
  }, []);

  async function createTask(data: { title: string; description?: string; status?: string; priority?: string; tagIds?: string[] }) {
    const res = await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || "Failed to create task");
    }

    const task = await res.json();
    setTasks((prev) => [task, ...prev]);
    toast.success("Task created");
    return task;
  }

  async function updateTask(id: string, data: Record<string, unknown>) {
    const res = await fetch(`/api/tasks/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || "Failed to update task");
    }

    const task = await res.json();
    setTasks((prev) => prev.map((t) => (t.id === id ? task : t)));
    toast.success("Task updated");
    return task;
  }

  async function deleteTask(id: string) {
    const res = await fetch(`/api/tasks/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || "Failed to delete task");
    }

    setTasks((prev) => prev.filter((t) => t.id !== id));
    toast.success("Task deleted");
  }

  async function moveTask(
    taskId: string,
    newStatus: TaskStatus,
    newIndex: number,
  ): Promise<void> {
    const snapshot = tasks;

    const taskToMove = tasks.find((t) => t.id === taskId);
    if (!taskToMove) return;

    const previousStatus = taskToMove.status;
    const isCrossColumn = previousStatus !== newStatus;

    const remaining = tasks.filter((t) => t.id !== taskId);

    const tasksInDestination = remaining
      .filter((t) => t.status === newStatus)
      .sort((a, b) => a.order - b.order);

    tasksInDestination.splice(newIndex, 0, { ...taskToMove, status: newStatus });

    const reorderedDestination = tasksInDestination.map((t, i) => ({
      ...t,
      order: i,
    }));

    let reorderedSource: Task[] = [];
    if (isCrossColumn) {
      reorderedSource = remaining
        .filter((t) => t.status === previousStatus)
        .sort((a, b) => a.order - b.order)
        .map((t, i) => ({ ...t, order: i }));
    }

    const unaffected = remaining.filter(
      (t) => t.status !== newStatus && t.status !== previousStatus,
    );

    setTasks([...unaffected, ...reorderedSource, ...reorderedDestination]);

    try {
      const affectedTasks = [...reorderedSource, ...reorderedDestination];
      const reorderPayload = affectedTasks.map((t) => ({
        id: t.id,
        status: t.status,
        order: t.order,
      }));

      const res = await fetch("/api/tasks/reorder", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tasks: reorderPayload }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Failed to reorder tasks");
      }

      const serverTasks: Task[] = await res.json();
      setTasks(serverTasks);
    } catch (error) {
      setTasks(snapshot);
      toast.error("Erro ao mover tarefa");
      console.error("moveTask error:", error);
    }
  }

  return { tasks, isLoading, createTask, updateTask, deleteTask, moveTask };
}
