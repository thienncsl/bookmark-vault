## Storage Patterns for Bookmark Vault

### Storage Abstraction Pattern

```tsx
// lib/storage.ts
import { v4 as uuidv4 } from "uuid";
import { type Bookmark, type CreateBookmarkInput, type UpdateBookmarkInput } from "./types";
import { bookmarkSchema } from "./validation";

const STORAGE_KEY = "bookmark-vault-data";

export { STORAGE_KEY };

// 1. Always check for SSR (typeof window !== "undefined")
// 2. Wrap all operations in try/catch
// 3. Validate with Zod on read
// 4. Return empty array on error, don't throw

export function getBookmarks(): Bookmark[] {
  if (typeof window === "undefined") return [];

  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];

    const parsed = JSON.parse(data);
    const result = bookmarkSchema.array().safeParse(parsed);
    return result.success ? result.data : [];
  } catch {
    console.error("Failed to read bookmarks from localStorage");
    return [];
  }
}

export function addBookmark(input: CreateBookmarkInput): Bookmark {
  const bookmark: Bookmark = {
    ...input,
    id: uuidv4(),
    createdAt: new Date().toISOString(),
  };

  try {
    const bookmarks = getBookmarks();
    bookmarks.unshift(bookmark); // Add to beginning
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarks));
  } catch {
    console.error("Failed to save bookmark to localStorage");
  }

  return bookmark;
}

export function deleteBookmark(id: string): void {
  if (typeof window === "undefined") return;

  try {
    const bookmarks = getBookmarks();
    const filtered = bookmarks.filter((b) => b.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch {
    console.error("Failed to delete bookmark from localStorage");
  }
}

export function updateBookmark(id: string, input: UpdateBookmarkInput): void {
  if (typeof window === "undefined") return;

  try {
    const bookmarks = getBookmarks();
    const index = bookmarks.findIndex((b) => b.id === id);
    if (index === -1) return;

    bookmarks[index] = {
      ...bookmarks[index],
      ...input,
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarks));
  } catch {
    console.error("Failed to update bookmark in localStorage");
  }
}

export function searchBookmarks(query: string, bookmarks?: Bookmark[]): Bookmark[] {
  const bookmarksToSearch = bookmarks || getBookmarks();
  const trimmedQuery = query.trim();
  if (!trimmedQuery) return bookmarksToSearch;

  const lowerQuery = trimmedQuery.toLowerCase();

  return bookmarksToSearch.filter(
    (b) =>
      b.title.toLowerCase().includes(lowerQuery) ||
      b.url.toLowerCase().includes(lowerQuery) ||
      b.description?.toLowerCase().includes(lowerQuery) ||
      b.tags.some((t) => t.toLowerCase().includes(lowerQuery))
  );
}
```

### Type Definitions Pattern

```tsx
// lib/types.ts
export interface Bookmark {
  id: string;
  title: string;
  url: string;
  description?: string;
  tags: string[];
  createdAt: string;
  updatedAt?: string;
}

export type CreateBookmarkInput = Omit<Bookmark, "id" | "createdAt" | "updatedAt">;
export type UpdateBookmarkInput = Partial<Omit<Bookmark, "id" | "createdAt">>;
```

### Zod Validation Pattern

```tsx
// lib/validation.ts
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
```

### Error Handling Pattern

```tsx
// Pattern for graceful degradation
async function safeGetBookmarks(): Promise<Bookmark[]> {
  try {
    return getBookmarks();
  } catch (error) {
    // Log error, return empty array, UI shows fallback
    console.error("Storage error:", error);
    return [];
  }
}
```
