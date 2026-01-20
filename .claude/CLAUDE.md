# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Linting
npm run lint

# Run all tests
npm run test

# Run specific test file
npm run test -- BookmarkCard.test.tsx

# Type checking
npx tsc --noEmit
```

## Tech Stack

- Next.js 16 with App Router
- React 19 with TypeScript strict mode
- TailwindCSS v4 for styling
- localStorage for persistence (client-side only)
- Zod for validation
- Jest + React Testing Library for tests

## Architecture

### Data Flow

`app/layout.tsx` wraps the app with two context providers in order:
1. `ThemeProvider` - dark/light theme state
2. `BookmarksProvider` - CRUD operations, search, optimistic updates

All bookmark data flows through `BookmarksContext` which uses `useReducer` for state management. The context handles:
- Optimistic updates (immediate UI feedback, revert on error)
- Pending state tracking (spinner indicators)
- Search with 300ms debounce

### Storage Pattern

`lib/storage.ts` provides localStorage abstraction with Zod validation:
- `getBookmarks()` - reads and validates with schema
- `addBookmark()` / `updateBookmark()` / `deleteBookmark()` - persist changes
- `searchBookmarks()` - filters by title, URL, description, tags

The storage key is `bookmark-vault-data`. All storage operations are client-side only (check `typeof window !== "undefined"`).

### Type Definitions

`lib/types.ts` exports TypeScript interfaces:
- `Bookmark` - full bookmark shape
- `CreateBookmarkInput` - for creating (omits id, timestamps)
- `UpdateBookmarkInput` - partial updates

`lib/validation.ts` exports Zod schemas that mirror the types.

### Component Organization

- `components/` - reusable UI components (all under 100 lines)
- `components/Bookmark*` - bookmark-specific components
- `components/*Form.tsx` - form components with Zod validation
- `components/__tests__/` - colocated test files
- `hooks/` - custom hooks (`useBookmarks`, `useKeyboardShortcuts`)
- `context/` - React context providers

## Code Standards

- **Functional components only** - no class components
- **`"use client"`** - required for any component using localStorage, hooks, or browser APIs
- **TypeScript strict mode** - no implicit `any`, explicit types everywhere
- **Zod validation** - for all user input validation
- **TailwindCSS** - for all styling (no CSS modules or inline styles)
- **useReducer** - for complex state with multiple actions (BookmarksContext pattern)
- **useCallback** - for callback memoization in providers

## Key Patterns

### Client Component Pattern
```tsx
"use client";

import { useState, useEffect } from "react";

export function Component() {
  const [data, setData] = useState(null);

  useEffect(() => {
    // Safe to use localStorage here
    const stored = localStorage.getItem("key");
  }, []);

  return <div>{/* JSX */}</div>;
}
```

### Optimistic Update Pattern (see BookmarksContext)
1. Dispatch action to update UI immediately
2. Perform async operation
3. On success: dispatch success action (clear pending state)
4. On error: dispatch error action (revert state, show error)

### Form Validation Pattern
```tsx
import { bookmarkInputSchema } from "@/lib/validation";

const result = bookmarkInputSchema.safeParse(formData);
if (!result.success) {
  // Handle validation errors
}
```
