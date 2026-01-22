---
description: Generate bookmark-related code (component, hook, test, or type)
---

## Generate Bookmark Code

Generate code for the Bookmark Vault project based on the argument provided.

Argument: $ARGUMENTS

## Generation Rules

Based on the argument, generate appropriate code:

### If argument contains "component":
Generate a new React component following project patterns:
- "use client" directive
- TypeScript with proper types
- TailwindCSS styling
- Under 100 lines

### If argument contains "hook":
Generate a custom hook:
- Follows useBookmarks pattern
- Handles loading state
- Includes error handling

### If argument contains "test":
Generate Jest test file:
- Mock localStorage
- Test happy path and error cases
- Use React Testing Library

### If argument contains "type":
Generate TypeScript types:
- Extend existing Bookmark interface
- Add Zod schema
- Export from lib/types.ts

## Output
1. Show the generated code
2. Explain where to place it
3. List any imports needed