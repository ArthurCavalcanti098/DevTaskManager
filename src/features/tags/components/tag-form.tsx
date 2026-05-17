"use client";

import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createTagSchema } from "@/validators/tag";
import type { Tag } from "@/types";

interface TagFormData {
  name: string;
  color: string;
}

interface TagFormProps {
  tag?: Tag | null;
  onSubmit: (data: TagFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const presetColors = [
  "#6366f1", "#8b5cf6", "#ec4899", "#ef4444",
  "#f59e0b", "#22c55e", "#3b82f6", "#06b6d4",
];

export function TagForm({ tag, onSubmit, onCancel, isLoading }: TagFormProps) {
  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<TagFormData>({
    // @ts-expect-error - zod resolver type mismatch with react-hook-form
    resolver: zodResolver(createTagSchema),
    defaultValues: {
      name: tag?.name ?? "",
      color: tag?.color ?? "#6366f1",
    },
  });

  const selectedColor = useWatch({ control, name: "color" });

  return (
    <form onSubmit={handleSubmit(onSubmit as never)} className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium text-text-primary">Name</label>
        <Input
          {...register("name")}
          placeholder="Tag name"
          className={errors.name ? "border-accent-danger" : ""}
        />
        {errors.name && (
          <p className="text-xs text-accent-danger">{errors.name.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-text-primary">Color</label>
        <div className="flex flex-wrap gap-2">
          {presetColors.map((color) => (
            <button
              key={color}
              type="button"
              onClick={() => setValue("color", color)}
              className={`h-8 w-8 rounded-full transition-all ${
                selectedColor === color ? "ring-2 ring-offset-2 ring-offset-bg-secondary ring-accent-primary scale-110" : ""
              }`}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
        <Input
          {...register("color")}
          placeholder="#6366f1"
          className="mt-2 font-mono text-sm"
        />
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (tag ? "Updating..." : "Creating...") : (tag ? "Update Tag" : "Create Tag")}
        </Button>
      </div>
    </form>
  );
}
