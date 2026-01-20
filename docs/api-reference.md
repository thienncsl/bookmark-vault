# API Reference

Technical documentation for Bookmark Vault's Context APIs, hooks, and utilities.

## Contexts

### BookmarksContext

Provides bookmark CRUD operations, search functionality, and optimistic update state management.

**Provider:** `BookmarksProvider({ children })`
**Hook:** `useBookmarksContext()`
**Location:** `@/context/BookmarksContext`

#### Context Value

```typescript
interface BookmarksContextType {
  bookmarks: Bookmark[];
  filteredBookmarks: Bookmark[];
  loading: boolean;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  addBookmark: (input: CreateBookmarkInput) => void;
  updateBookmark: (id: string, input: UpdateBookmarkInput) => void;
  deleteBookmark: (id: string) => void;
  error: string | null;
  simulateError: boolean;
  setSimulateError: (value: boolean) => void;
  refreshBookmarks: () => void;
  pendingAdds: Set<string>;
  pendingDeletes: Set<string>;
}
```

#### Properties

| Property | Type | Description |
|----------|------|-------------|
| `bookmarks` | `Bookmark[]` | All bookmarks loaded from storage |
| `filteredBookmarks` | `Bookmark[]` | Bookmarks matching current search term |
| `loading` | `boolean` | Initial data loading state |
| `searchTerm` | `string` | Current search query |
| `setSearchTerm` | `(term: string) => void` | Update search query |
| `addBookmark` | `(input: CreateBookmarkInput) => void` | Add a new bookmark |
| `updateBookmark` | `(id: string, input: UpdateBookmarkInput) => void` | Update existing bookmark |
| `deleteBookmark` | `(id: string) => void` | Delete a bookmark |
| `error` | `string \| null` | Current error message |
| `simulateError` | `boolean` | Dev mode: toggle error simulation |
| `setSimulateError` | `(value: boolean) => void` | Set error simulation mode |
| `refreshBookmarks` | `() => void` | Reload bookmarks from storage |
| `pendingAdds` | `Set<string>` | IDs of bookmarks being added |
| `pendingDeletes` | `Set<string>` | IDs of bookmarks being deleted |

#### Methods

**addBookmark(input)**
- Performs optimistic update (immediately adds to UI)
- Persists to localStorage asynchronously
- Reverts on error and sets `error` state

**updateBookmark(id, input)**
- Finds existing bookmark and merges updates
- Sets `updatedAt` timestamp
- Reverts on error

**deleteBookmark(id)**
- Marks bookmark as pending delete
- Removes from localStorage asynchronously
- Reverts on error

**refreshBookmarks()**
- Reloads all bookmarks from localStorage
- Useful after external import operations

#### State Management

Uses `useReducer` with the following action types:

```typescript
type BookmarksAction =
  | { type: "ADD_BOOKMARK"; payload: Bookmark }
  | { type: "ADD_BOOKMARK_SUCCESS"; payload: { id: string } }
  | { type: "ADD_BOOKMARK_ERROR"; payload: { id: string; error: string } }
  | { type: "DELETE_BOOKMARK"; payload: { id: string } }
  | { type: "DELETE_BOOKMARK_SUCCESS"; payload: { id: string } }
  | { type: "DELETE_BOOKMARK_ERROR"; payload: { id: string; error: string } }
  | { type: "UPDATE_BOOKMARK"; payload: Bookmark }
  | { type: "UPDATE_BOOKMARK_SUCCESS"; payload: { id: string } }
  | { type: "UPDATE_BOOKMARK_ERROR"; payload: { id: string; error: string } }
  | { type: "SET_BOOKMARKS"; payload: Bookmark[] }
  | { type: "CLEAR_ERROR" };
```

#### Usage Example

```tsx
"use client";

import { useBookmarksContext } from "@/hooks/useBookmarks";

function MyComponent() {
  const { bookmarks, addBookmark, deleteBookmark, searchTerm, setSearchTerm } =
    useBookmarksContext();

  return (
    <div>
      <input
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      {bookmarks.map((bookmark) => (
        <div key={bookmark.id}>{bookmark.title}</div>
      ))}
    </div>
  );
}
```

---

### ThemeContext

Manages light/dark theme state with system preference detection.

**Provider:** `ThemeProvider({ children })`
**Hook:** `useTheme()`
**Location:** `@/context/ThemeContext`

#### Context Value

```typescript
interface ThemeContextType {
  theme: "light" | "dark";
  toggleTheme: () => void;
}
```

#### Behavior

- Reads `theme` from localStorage on mount
- Falls back to system preference (`prefers-color-scheme: dark`)
- Applies `dark` class to `document.documentElement`
- Persists preference to localStorage

#### Usage Example

```tsx
"use client";

import { useTheme } from "@/context/ThemeContext";

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button onClick={toggleTheme}>
      Switch to {theme === "light" ? "Dark" : "Light"} Mode
    </button>
  );
}
```

---

## Hooks

### useBookmarksContext

Re-exports the bookmarks context hook for convenience.

```typescript
import { useBookmarksContext } from "@/hooks/useBookmarks";
```

**See:** [BookmarksContext](#bookmarkscontext)

---

### useTheme

Re-exports the theme context hook for convenience.

```typescript
import { useTheme } from "@/context/ThemeContext";
```

**See:** [ThemeContext](#themecontext)

---

### useKeyboardShortcuts

Provides keyboard navigation and shortcuts for the bookmark UI.

```typescript
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";

interface UseKeyboardShortcutsProps {
  titleInputRef: React.RefObject<HTMLInputElement | null>;
  searchInputRef: React.RefObject<HTMLInputElement | null>;
  onClearForm: () => void;
  onSetFocusedIndex: (index: number) => void;
  onBlurActiveElement: () => void;
  bookmarkCount: number;
}

useKeyboardShortcuts(props);
```

#### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `titleInputRef` | `RefObject<HTMLInputElement \| null>` | Reference to title input |
| `searchInputRef` | `RefObject<HTMLInputElement \| null>` | Reference to search input |
| `onClearForm` | `() => void` | Callback to clear form |
| `onSetFocusedIndex` | `(index: number) => void` | Callback when focused bookmark changes |
| `onBlurActiveElement` | `() => void` | Callback to unfocus active element |
| `bookmarkCount` | `number` | Total number of bookmarks to navigate |

#### Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Ctrl/Cmd + N` | Focus title input |
| `Ctrl/Cmd + F` | Focus search input |
| `Escape` | Clear form and unfocus |
| `ArrowUp` / `ArrowDown` | Navigate bookmarks |
| `ArrowLeft` / `ArrowRight` | Navigate bookmarks |

#### Usage Example

```tsx
"use client";

import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { useRef } from "react";

function BookmarkList() {
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [focusedIndex, setFocusedIndex] = useState(0);

  useKeyboardShortcuts({
    titleInputRef: { current: null },
    searchInputRef,
    onClearForm: () => console.log("clear"),
    onSetFocusedIndex: setFocusedIndex,
    onBlurActiveElement: () => document.activeElement?.blur(),
    bookmarkCount: bookmarks.length,
  });

  return <input ref={searchInputRef} />;
}
```

---

## Types

### Bookmark

The main bookmark data structure.

```typescript
interface Bookmark {
  id: string;
  title: string;
  url: string;
  description?: string;
  tags: string[];
  createdAt: string;
  updatedAt?: string;
}
```

### CreateBookmarkInput

Input type for creating a new bookmark.

```typescript
type CreateBookmarkInput = Omit<Bookmark, "id" | "createdAt" | "updatedAt">;
// {
//   title: string;
//   url: string;
//   description?: string;
//   tags: string[];
// }
```

### UpdateBookmarkInput

Input type for updating a bookmark.

```typescript
type UpdateBookmarkInput = Partial<Omit<Bookmark, "id" | "createdAt">>;
// {
//   title?: string;
//   url?: string;
//   description?: string;
//   tags?: string[];
//   updatedAt?: string;
// }
```

---

## Storage Utilities

### getBookmarks()

```typescript
function getBookmarks(): Bookmark[];
```

Reads all bookmarks from localStorage. Returns empty array if no data or validation fails.

**Throws:** Never (handles errors gracefully)

---

### addBookmark(input)

```typescript
function addBookmark(input: CreateBookmarkInput): Bookmark;
```

Creates a new bookmark with generated UUID and timestamp.

**Returns:** The created bookmark

---

### updateBookmark(id, input)

```typescript
function updateBookmark(id: string, input: UpdateBookmarkInput): void;
```

Updates an existing bookmark. Sets `updatedAt` timestamp.

---

### deleteBookmark(id)

```typescript
function deleteBookmark(id: string): void;
```

Removes a bookmark by ID.

---

### searchBookmarks(query, bookmarks?)

```typescript
function searchBookmarks(query: string, bookmarks?: Bookmark[]): Bookmark[];
```

Filters bookmarks by search query.

**Searches in:**
- Title (case-insensitive)
- URL (case-insensitive)
- Description (case-insensitive)
- Tags (case-insensitive)

**Parameters:**
- `query` - Search string (trimmed before searching)
- `bookmarks` - Optional bookmarks array (defaults to all from storage)

**Returns:** Filtered bookmarks (all if query is empty)

---

## Validation

### bookmarkInputSchema

Zod schema for validating bookmark input (create/update).

```typescript
const bookmarkInputSchema = z.object({
  title: z.string().min(1, "Title is required"),
  url: z.string().url("Must be a valid URL"),
  description: z.string().optional(),
  tags: z.array(z.string()).default([]),
});

type BookmarkInput = z.infer<typeof bookmarkInputSchema>;
```

### bookmarkSchema

Zod schema for validating complete bookmarks (including from import).

```typescript
const bookmarkSchema = z.object({
  id: z.string(),
  title: z.string().min(1),
  url: z.string().url(),
  description: z.string().optional(),
  tags: z.array(z.string()),
  createdAt: z.string(),
});
```

**Usage:**

```typescript
import { bookmarkInputSchema } from "@/lib/validation";

const result = bookmarkInputSchema.safeParse(formData);
if (result.success) {
  // Valid input
  const input = result.data;
} else {
  // Validation errors
  const errors = result.error.issues;
}
```

---

## Constants

### Storage Key

```typescript
const STORAGE_KEY = "bookmark-vault-data";
```

All bookmarks are stored in localStorage under this key.
