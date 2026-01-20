---
name: code-review
description: Review code changes in the bookmark vault project
parameters:
  type: object
  properties:
    files:
      type: array
      items:
        type: string
      description: Files to review (optional)
    strict:
      type: boolean
      description: Enable strict mode checks
      default: true
---

# Code Review Skill for Bookmark Vault

This skill performs code review against project standards.

## Checklist

- [ ] Check TypeScript types
- [ ] Verify "use client" for localStorage
- [ ] Check component size (< 500 lines)
- [ ] Verify Zod validation
- [ ] Check TailwindCSS classes
- [ ] Verify test coverage
- [ ] Check for code smells
- [ ] Run linter

## Review Focus Areas

### React Components
- Functional components only
- Proper TypeScript types
- useEffect cleanup
- Missing dependencies

### localStorage Usage
- "use client" directive
- Hydration-safe patterns
- Error handling

### API Routes
- Proper error responses
- Input validation
- No sensitive data exposure

### Tests
- meaningful test descriptions
- Coverage of edge cases
- Proper cleanup

## Project Standards

| Area | Standard |
|------|----------|
| Components | Functional, < 500 lines |
| Types | Explicit, no implicit any |
| Storage | localStorage client-side |
| Validation | Zod |
| Styling | TailwindCSS |
| Testing | Jest + React Testing Library |

## Common Issues

- Missing type annotations
- Any type usage
- Missing "use client"
- Hydration mismatch
- No error boundaries
- Incomplete tests
