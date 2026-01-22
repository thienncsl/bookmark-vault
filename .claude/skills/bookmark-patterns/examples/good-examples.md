## Good Examples for Bookmark Vault

### 1. Client Component with localStorage

```tsx
"use client";

import { useState, useEffect } from "react";

export function Component() {
  const [data, setData] = useState<Bookmark[]>([]);

  useEffect(() => {
    // Safe: localStorage access inside useEffect (runs only on client)
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setData(JSON.parse(stored));
    }
  }, []);

  return <div>{/* JSX */}</div>;
}
```

### 2. Optimistic Update with useReducer

```tsx
// BookmarksContext pattern
function bookmarksReducer(state: State, action: Action): State {
  switch (action.type) {
    case "ADD_BOOKMARK":
      return {
        ...state,
        bookmarks: [action.payload, ...state.bookmarks],
        pendingAdds: new Set([...state.pendingAdds, action.payload.id]),
      };
    case "ADD_BOOKMARK_SUCCESS":
      const newPending = new Set(state.pendingAdds);
      newPending.delete(action.payload.id);
      return { ...state, pendingAdds: newPending };
    case "ADD_BOOKMARK_ERROR":
      return {
        ...state,
        bookmarks: state.bookmarks.filter((b) => b.id !== action.payload.id),
        pendingAdds: new Set([...state.pendingAdds].filter((id) => id !== action.payload.id)),
        error: action.payload.error,
      };
  }
}
```

### 3. Memoized Component for Performance

```tsx
import { memo, useMemo } from "react";

export const BookmarkCard = memo(function BookmarkCard({
  bookmark,
  onDelete,
}: BookmarkCardProps) {
  // Memoize handler to prevent re-renders when parent re-renders
  const handleDelete = useMemo(
    () => () => onDelete(bookmark.id),
    [onDelete, bookmark.id]
  );

  return <button onClick={handleDelete}>Delete</button>;
});
```

### 4. Zod Validation in Forms

```tsx
const result = bookmarkInputSchema.safeParse({
  title: formData.title,
  url: formData.url,
  tags: formData.tags.split(",").map((t) => t.trim()).filter(Boolean),
});

if (!result.success) {
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

await addBookmark(result.data);
```

### 5. Debounced Search

```tsx
const [searchTerm, setSearchTerm] = useState("");
const [debouncedSearch, setDebouncedSearch] = useState("");

useEffect(() => {
  const timer = setTimeout(() => {
    setDebouncedSearch(searchTerm);
  }, 300);
  return () => clearTimeout(timer);
}, [searchTerm]);

const filteredBookmarks = debouncedSearch.trim()
  ? searchBookmarks(debouncedSearch, state.bookmarks)
  : state.bookmarks;
```

### 6. Proper Key Prop in Lists

```tsx
{filteredBookmarks.map((bookmark) => (
  <BookmarkCard
    key={bookmark.id}  // Always use stable ID, not index
    bookmark={bookmark}
  />
))}
```

### 7. useCallback for Event Handlers

```tsx
const handleDelete = useCallback(
  (id: string) => {
    deleteBookmark(id);
  },
  [deleteBookmark]
);
```

### 8. Type-Safe Context Usage

```tsx
export function useBookmarksContext() {
  const context = useContext(BookmarksContext);
  if (!context) {
    throw new Error("useBookmarksContext must be used within a BookmarksProvider");
  }
  return context;
}
```

### 9. Tailwind Classes for Dark Mode

```tsx
<div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-200 dark:border-gray-700">
  <span className="text-blue-600 dark:text-blue-400" />
</div>
```

### 10. Accessibility Pattern

```tsx
<input
  type="text"
  id="title"
  aria-label="Bookmark title"
  aria-invalid={!!errors.title}
  aria-describedby={errors.title ? "title-error" : undefined}
/>
{errors.title && (
  <p id="title-error" className="text-red-600" role="alert">
    {errors.title}
  </p>
)}
```
