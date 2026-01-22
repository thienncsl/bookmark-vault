import { z } from "zod";

export const bookmarkInputSchema = z.object({
  title: z.string().min(1, "Title is required"),
  url: z.string().url("Must be a valid URL"),
  description: z.string().optional(),
  tags: z.array(z.string()).default([]),
});

export const bookmarkSchema = z.object({
  id: z.string(),
  title: z.string().min(1),
  url: z.string().url(),
  description: z.string().optional(),
  tags: z.array(z.string()),
  createdAt: z.string(),
  updatedAt: z.string().optional(),
});

export type BookmarkInput = z.infer<typeof bookmarkInputSchema>;
