import { z } from "zod";

export const createTagSchema = z.object({
  name: z.string().min(1, "Name is required").max(50),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Invalid color hex").default("#6366f1"),
});

export const updateTagSchema = z.object({
  name: z.string().min(1).max(50).optional(),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
});

export type CreateTagInput = z.infer<typeof createTagSchema>;
export type UpdateTagInput = z.infer<typeof updateTagSchema>;
