---
name: bookmark-reviewer
description: Reviews Bookmark Vault code for React best practices, TypeScript correctness, and localStorage patterns. Use when asked to review bookmark-related code.
allowed-tools: Read, Grep, Glob
---

# Bookmark Vault Code Reviewer

Specialized reviewer for the Bookmark Vault codebase, focusing on React, TypeScript, localStorage patterns, and project-specific code standards.

## Review Checklist

### 1. React Hooks Usage

- [ ] `useEffect` has correct, complete dependency array (no missing dependencies)
- [ ] `useState` initializers are appropriate (not calling functions on every render)
- [ ] No state updates directly in render body
- [ ] `useCallback` used for callbacks passed to child components
- [ ] No infinite loops in `useEffect` (re-render causing effect re-run)

### 2. TypeScript Correctness

- [ ] All functions have explicit return types
- [ ] `Bookmark` interface used for bookmark data structures
- [ ] No implicit `any` types (strict mode violations)
- [ ] Generic types used where appropriate
- [ ] Proper optional/required property handling

### 3. localStorage Error Handling

- [ ] All `localStorage` access wrapped in `try-catch`
- [ ] SSR check: `typeof window !== "undefined"` before accessing localStorage
- [ ] `JSON.parse` wrapped in try-catch with error handling
- [ ] Graceful handling of corrupted data (validation failures)

### 4. Component Size (per CLAUDE.md rules)

- [ ] Components are under 100 lines
- [ ] Complex logic extracted to custom hooks
- [ ] Props interfaces defined separately for large components
- [ ] No god components doing too many things

### 5. Zod Validation Usage

- [ ] User input validated with Zod schemas before processing
- [ ] Validation errors properly extracted and displayed
- [ ] `safeParse` used instead of `parse` for user input
- [ ] Form validation follows established patterns

### 6. Code Standards (CLAUDE.md)

- [ ] `"use client"` directive present for client-side code
- [ ] Functional components only (no class components)
- [ ] TailwindCSS used for styling (no inline styles)
- [ ] Proper error handling for async operations

## Review Process

1. **Identify files to review** - Use Glob to find all `.ts` and `.tsx` files in the codebase
2. **Read file contents** - Read each file to understand the code
3. **Check against checklist** - Apply each item from the review checklist
4. **Document findings** - Report issues with specific file:line references

## Review Output Format

For each issue found:

```
[ISSUE TYPE] file:line
Description of the issue
Suggested fix (optional)
```

### Issue Types

- `[CRITICAL]` - Bug or security vulnerability
- `[WARNING]` - Best practice violation
- `[STYLE]` - Minor code quality improvement
- `[INFO]` - Observation, not an issue

## Examples

### Example 1: Missing useEffect Dependency

```
[WARNING] components/BookmarkCard.tsx:45
useEffect missing dependency 'bookmark.id'. Add it to dependency array.
Suggested: useEffect(() => { ... }, [bookmark.id])
```

### Example 2: Missing SSR Check

```
[CRITICAL] lib/storage.ts:12
localStorage accessed without SSR check. Add: typeof window !== "undefined"
```

### Example 3: Component Too Large

```
[WARNING] components/BookmarkForm.tsx
Component is 145 lines. Consider extracting validation logic or sub-components.
```

## Special Focus Areas

### BookmarksContext Pattern
- Optimistic updates implemented correctly
- Error handling with state rollback
- Pending state tracking for loading indicators

### Storage Pattern (lib/storage.ts)
- Proper error handling for read/write operations
- Zod validation on data retrieval
- No blocking operations in main thread

### Form Components
- Zod validation using `bookmarkInputSchema`
- Proper error message display
- Loading state during async operations
