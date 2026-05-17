"use client";

import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import type { Tag } from "@/types";

export function useTags() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const fetchedRef = useRef(false);

  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;

    async function load() {
      try {
        const res = await fetch("/api/tags");
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.error || "Failed to fetch tags");
        }
        const data = await res.json();
        setTags(data);
      } catch (error) {
        console.error("Failed to load tags:", error);
        toast.error("Failed to load tags");
      } finally {
        setIsLoading(false);
      }
    }

    load();
  }, []);

  async function createTag(data: { name: string; color?: string }) {
    const res = await fetch("/api/tags", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      if (res.status === 409) {
        toast.error("Tag with this name already exists");
        throw new Error("Tag already exists");
      }
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || "Failed to create tag");
    }

    const tag = await res.json();
    setTags((prev) => [...prev, tag]);
    toast.success("Tag created");
    return tag;
  }

  async function deleteTag(id: string) {
    const res = await fetch(`/api/tags/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || "Failed to delete tag");
    }

    setTags((prev) => prev.filter((t) => t.id !== id));
    toast.success("Tag deleted");
  }

  return { tags, isLoading, createTag, deleteTag };
}
