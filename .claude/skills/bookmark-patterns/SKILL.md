---
name: bookmark-patterns
description: Teaches Bookmark Vault coding patterns. Use when asking about best practices, patterns, or how to implement features in the bookmark app.
---

## Bookmark Vault Patterns

Quick reference for Bookmark Vault development patterns.

## Component Patterns

### Form Pattern
```tsx
"use client";

import { useState } from "react";
import { bookmarkInputSchema } from "@/lib/validation";

export function BookmarkForm() {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const result = bookmarkInputSchema.safeParse(Object.fromEntries(formData));

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) fieldErrors[err.path[0] as string] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }
    // Handle valid submission
  };

  return <form onSubmit={handleSubmit}>{/* ... */}</form>;
}
```

### List Pattern
```tsx
export function BookmarkList({ bookmarks }: { bookmarks: Bookmark[] }) {
  if (bookmarks.length === 0) {
    return <div className="text-muted">No bookmarks found</div>;
  }

  return (
    <ul>
      {bookmarks.map((bookmark) => (
        <BookmarkItem key={bookmark.id} bookmark={bookmark} />
      ))}
    </ul>
  );
}
```

### Card Pattern
```tsx
import { memo } from "react";

interface BookmarkCardProps {
  bookmark: Bookmark;
  onDelete: (id: string) => void;
}

export const BookmarkCard = memo(function BookmarkCard({
  bookmark,
  onDelete,
}: BookmarkCardProps) {
  return (
    <div className="card">
      <h3>{bookmark.title}</h3>
      <button onClick={() => onDelete(bookmark.id)}>Delete</button>
    </div>
  );
});
```

### Modal Pattern
```tsx
"use client";

import { useEffect, useRef } from "react";

export function Modal({ isOpen, onClose, children }: ModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div ref={overlayRef} onClick={(e) => e.target === overlayRef && onClose()}>
      {children}
    </div>
  );
}
```

## Hook Patterns

### useBookmarks Context Consumer
```tsx
import { useContext } from "react";
import { BookmarksContext } from "@/context/BookmarksContext";

export function useBookmarks() {
  const context = useContext(BookmarksContext);
  if (!context) throw new Error("useBookmarks must be used within BookmarksProvider");
  return context;
}
```

### useKeyboardShortcuts Pattern
```tsx
import { useEffect } from "react";

export function useKeyboardShortcuts(shortcuts: Record<string, () => void>) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const handler = shortcuts[e.key];
      if (handler) handler();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [shortcuts]);
}
```

## Storage Patterns

### localStorage Abstraction
```tsx
import { bookmarkSchema, type Bookmark } from "@/lib/validation";

const STORAGE_KEY = "bookmark-vault-data";

export function getBookmarks(): Bookmark[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    const parsed = JSON.parse(stored);
    const result = bookmarkSchema.array().safeParse(parsed);
    return result.success ? result.data : [];
  } catch {
    return [];
  }
}
```

### Optimistic Update Pattern
```tsx
// In useReducer or context
function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "DELETE_BOOKMARK":
      return {
        ...state,
        bookmarks: state.bookmarks.filter((b) => b.id !== action.payload),
        pendingIds: [...state.pendingIds, action.payload],
      };
    case "DELETE_BOOKMARK_SUCCESS":
      return {
        ...state,
        pendingIds: state.pendingIds.filter((id) => id !== action.payload),
      };
    case "DELETE_BOOKMARK_FAILURE":
      return {
        ...state,
        bookmarks: [...state.bookmarks, action.payload.bookmark],
        pendingIds: state.pendingIds.filter((id) => id !== action.payload.id),
      };
  }
}
```

## Core Principles

1. **"use client"** - Required for localStorage, hooks, or browser APIs
2. **TypeScript strict mode** - No implicit `any`, explicit types everywhere
3. **Zod validation** - For all user input validation
4. **TailwindCSS** - For all styling (no CSS modules)
5. **useReducer** - For complex state with optimistic updates
6. **useCallback/useMemo** - For stable references and performance

## Anti-Patterns to Avoid

| Anti-Pattern | Problem | Fix |
|--------------|---------|-----|
| No SSR check | `localStorage` fails on server | `typeof window !== "undefined"` check |
| Missing "use client" | Server Component accesses browser API | Add directive at top |
| Inline handlers | New function on every render | Use `useCallback` |
| Missing validation | Invalid data stored | Use Zod schemas |
| No error handling | Crashes on corrupted data | Wrap in try/catch |

## Quick Reference

| Pattern | Command/Key Points |
|---------|-------------------|
| Client Component | `"use client"` at top, localStorage in useEffect |
| Form | Controlled inputs, Zod validation on submit |
| Storage | SSR check, try/catch, Zod validation |
| Optimistic Update | Dispatch first, async op, success/error action |
| Search | 300ms debounce, derived state |
| Memo | Memoize handlers for stable references |
