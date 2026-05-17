"use client";

import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import type { Task } from "@/types";

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

  return { tasks, isLoading, createTask, updateTask, deleteTask };
}
