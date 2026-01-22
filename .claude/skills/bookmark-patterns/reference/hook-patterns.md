## Hook Patterns for Bookmark Vault

### useBookmarks Hook (Context Consumer)

```tsx
// hooks/useBookmarks.ts
"use client";

export { useBookmarksContext } from "@/context/BookmarksContext";

export type { BookmarksAction } from "@/context/BookmarksContext";
```

**Usage:**
```tsx
const {
  bookmarks,           // All bookmarks
  filteredBookmarks,   // Search-filtered bookmarks
  loading,             // Initial load state
  searchTerm,          // Current search term
  setSearchTerm,       // Update search term
  addBookmark,         // Add new bookmark
  updateBookmark,      // Update existing bookmark
  deleteBookmark,      // Delete bookmark by ID
  error,               // Error message or null
  pendingAdds,         // Set of IDs pending add
  pendingDeletes,      // Set of IDs pending delete
} = useBookmarksContext();
```

### useKeyboardShortcuts Hook

```tsx
// hooks/useKeyboardShortcuts.ts
"use client";

import { useEffect, useRef, useCallback } from "react";

interface UseKeyboardShortcutsProps {
  titleInputRef: React.RefObject<HTMLInputElement | null>;
  searchInputRef: React.RefObject<HTMLInputElement | null>;
  onClearForm: () => void;
  onSetFocusedIndex: (index: number) => void;
  onBlurActiveElement: () => void;
  bookmarkCount: number;
}

export function useKeyboardShortcuts({
  titleInputRef,
  searchInputRef,
  onClearForm,
  onSetFocusedIndex,
  onBlurActiveElement,
  bookmarkCount,
}: UseKeyboardShortcutsProps): void {
  const focusedIndexRef = useRef(0);

  // Memoize callbacks to avoid creating new functions
  const focusTitleInput = useCallback(() => {
    titleInputRef.current?.focus();
  }, [titleInputRef]);

  const focusSearchInput = useCallback(() => {
    searchInputRef.current?.focus();
  }, [searchInputRef]);

  const handleArrowDown = useCallback(() => {
    if (bookmarkCount === 0) return;
    focusedIndexRef.current = Math.min(focusedIndexRef.current + 1, bookmarkCount - 1);
    onSetFocusedIndex(focusedIndexRef.current);
  }, [bookmarkCount, onSetFocusedIndex]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isModifierPressed = e.ctrlKey || e.metaKey;

      // Cmd+N - Focus title input
      if ((e.key === "n" || e.key === "N") && isModifierPressed) {
        e.preventDefault();
        focusTitleInput();
        return;
      }

      // Cmd+F - Focus search input
      if ((e.key === "f" || e.key === "F") && isModifierPressed) {
        e.preventDefault();
        focusSearchInput();
        return;
      }

      // Escape - Clear form and unfocus
      if (e.key === "Escape") {
        e.preventDefault();
        onClearForm();
        onBlurActiveElement();
        return;
      }

      // Arrow keys - Navigate bookmark list
      if (e.key === "ArrowDown" || e.key === "ArrowRight") {
        e.preventDefault();
        handleArrowDown();
        return;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [focusTitleInput, focusSearchInput, onClearForm, onBlurActiveElement, handleArrowDown]);
}
```

### Custom Hook Pattern (Generic)

```tsx
// Generic pattern for creating custom hooks
"use client";

import { useState, useEffect, useCallback } from "react";

function useLocalStorage<T>(key: string, initialValue: T) {
  // State for SSR-safe initialization
  const [storedValue, setStoredValue] = useState<T>(initialValue);

  // Load from localStorage on mount (client-side only)
  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        setStoredValue(JSON.parse(item));
      }
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
    }
  }, [key]);

  // Memoized setter
  const setValue = useCallback((value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  return [storedValue, setValue] as const;
}
```
