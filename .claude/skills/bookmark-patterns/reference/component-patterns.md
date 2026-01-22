## Component Patterns for Bookmark Vault

### Form Component Pattern

```tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { useBookmarksContext } from "@/hooks/useBookmarks";
import { bookmarkInputSchema } from "@/lib/validation";

// 1. Use controlled inputs with useState
// 2. Validate on submit, not on change (Zod safeParse)
// 3. Clear form after successful save
// 4. Show inline errors near fields
// 5. Handle duplicate detection (exclude current when editing)

interface FormData {
  title: string;
  url: string;
  description: string;
  tags: string;
}

interface FormErrors {
  title?: string;
  url?: string;
  description?: string;
  tags?: string;
}

export function AddBookmarkForm() {
  const { addBookmark, bookmarks } = useBookmarksContext();
  const [formData, setFormData] = useState<FormData>({...});
  const [errors, setErrors] = useState<FormErrors>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Parse and validate with Zod
    const result = bookmarkInputSchema.safeParse({
      ...formData,
      tags: formData.tags.split(",").map(t => t.trim()).filter(Boolean),
    });

    if (!result.success) {
      // Map Zod errors to field errors
      const fieldErrors: FormErrors = {};
      result.error.issues.forEach((err) => {
        const path = err.path[0];
        if (typeof path === "string") {
          fieldErrors[path] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    // Check for duplicates (normalized URL comparison)
    const normalizedUrl = formData.url.toLowerCase().trim();
    const isDuplicate = bookmarks.some(
      (b) => b.url.toLowerCase().trim() === normalizedUrl
    );

    await addBookmark(result.data);
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Inline error display */}
      {errors.title && (
        <p className="text-sm text-red-600">{errors.title}</p>
      )}
      <input {.../* controlled input props */} />
    </form>
  );
}
```

### List Component Pattern

```tsx
"use client";

import { useRef, useEffect, useCallback } from "react";
import { BookmarkCard } from "@/components/BookmarkCard";

export function BookmarkList() {
  const { filteredBookmarks, deleteBookmark, pendingAdds, pendingDeletes } =
    useBookmarksContext();

  // Memoize handlers to maintain stable references for React.memo
  const handleDelete = useCallback(
    (id: string) => deleteBookmark(id),
    [deleteBookmark]
  );

  // Handle loading/empty states explicitly
  if (loading) {
    return <div>Loading...</div>;
  }

  const showEmptyState = filteredBookmarks.length === 0 && !searchTerm;
  const showNoResults = filteredBookmarks.length === 0 && searchTerm;

  return (
    <div>
      {showEmptyState && <EmptyState message="No bookmarks yet" />}
      {showNoResults && <EmptyState message="No results" />}

      {filteredBookmarks.length > 0 && (
        <div className="grid gap-4">
          {filteredBookmarks.map((bookmark, index) => (
            <BookmarkCard
              key={bookmark.id}
              bookmark={bookmark}
              onDelete={handleDelete}
              isPendingAdd={pendingAdds.has(bookmark.id)}
              isPendingDelete={pendingDeletes.has(bookmark.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
```

### Card Component Pattern

```tsx
import { memo, useMemo } from "react";
import { type Bookmark } from "@/lib/types";

// Memoize to prevent unnecessary re-renders when parent re-renders
export const BookmarkCard = memo(function BookmarkCard({
  bookmark,
  onDelete,
  isPending = false,
}: {
  bookmark: Bookmark;
  onDelete: (id: string) => void;
  isPending?: boolean;
}) {
  // Memoize derived state
  const handleDelete = useMemo(
    () => () => onDelete(bookmark.id),
    [onDelete, bookmark.id]
  );

  return (
    <div className={isPending ? "opacity-50" : ""}>
      <h3>{bookmark.title}</h3>
      <a href={bookmark.url} target="_blank" rel="noopener noreferrer">
        {bookmark.url}
      </a>
      {bookmark.description && <p>{bookmark.description}</p>}
      {bookmark.tags.length > 0 && (
        <div className="flex gap-1">
          {bookmark.tags.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
      )}
      <button onClick={handleDelete}>Delete</button>
    </div>
  );
});
```

### Modal Component Pattern

```tsx
"use client";

import { useEffect } from "react";

interface BookmarkModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookmark: Bookmark;
}

export function BookmarkModal({ isOpen, onClose, bookmark }: BookmarkModalProps) {
  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()}>
        <AddBookmarkForm bookmark={bookmark} onClose={onClose} />
      </div>
    </div>
  );
}
```

### DevTools Pattern

```tsx
"use client";

import { useBookmarksContext } from "@/hooks/useBookmarks";

export function DevTools() {
  const { simulateError, setSimulateError, error } = useBookmarksContext();

  if (process.env.NODE_ENV !== "development") return null;

  return (
    <div className="fixed bottom-4 right-4">
      <label>
        <input
          type="checkbox"
          checked={simulateError}
          onChange={(e) => setSimulateError(e.target.checked)}
        />
        Simulate Error
      </label>
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
}
```
