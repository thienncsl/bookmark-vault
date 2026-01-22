---
name: bookmark-patterns
description: Teaches Bookmark Vault coding patterns. Use when asking about best practices, patterns, or how to implement features in the bookmark app.
---

## Bookmark Vault Patterns

Quick reference for Bookmark Vault development patterns.

## Pattern Categories

- **Component patterns**: See [component-patterns.md](reference/component-patterns.md)
  - Form pattern (controlled inputs, Zod validation)
  - List pattern (derived state, empty states)
  - Card pattern (memoization, pending states)
  - Modal pattern (Escape key, click outside)
  - DevTools pattern (dev-only components)

- **Hook patterns**: See [hook-patterns.md](reference/hook-patterns.md)
  - useBookmarks context consumer
  - useKeyboardShortcuts pattern
  - Generic custom hook pattern

- **Storage patterns**: See [storage-patterns.md](reference/storage-patterns.md)
  - localStorage abstraction
  - Zod validation on read/write
  - Type definitions
  - Error handling

## Examples

- **Good examples**: See [good-examples.md](examples/good-examples.md)
  - Client component with localStorage
  - Optimistic updates with useReducer
  - Memoized components
  - Debounced search
  - Type-safe context

- **Anti-patterns to avoid**: See [anti-patterns.md](examples/anti-patterns.md)
  - SSR errors
  - Missing "use client"
  - Inline handlers
  - Missing validation

## Core Principles

1. **"use client"** - Required for localStorage, hooks, or browser APIs
2. **TypeScript strict mode** - No implicit `any`, explicit types everywhere
3. **Zod validation** - For all user input validation
4. **TailwindCSS** - For all styling (no CSS modules)
5. **useReducer** - For complex state with optimistic updates
6. **useCallback/useMemo** - For stable references and performance

## Quick Reference

| Pattern | Key Points |
|---------|------------|
| Client Component | `"use client"` at top, localStorage in useEffect |
| Form | Controlled inputs, Zod validation on submit |
| Storage | SSR check, try/catch, Zod validation |
| Optimistic Update | Dispatch first, async op, success/error action |
| Search | 300ms debounce, derived state |
| Memo | Memoize handlers for stable references |
