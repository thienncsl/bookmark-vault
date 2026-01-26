---
name: bookmark-checker
description: Runs automated checks on Bookmark Vault code. Use when asked to verify code quality, run checks, or validate the project.
allowed-tools: Read, Bash, Glob
---

## Bookmark Checker

Automated validation for Bookmark Vault.

## Available Checks

### Type Check
Run: `npx tsc --noEmit`
Verifies TypeScript compilation without errors.

### Lint Check
Run: `npm run lint`
Checks code quality and style issues.

### Build Check
Run: `npm run build`
Verifies production build succeeds.

### Test Check
Run: `npm test -- --coverage`
Runs test suite and reports coverage.

## Execution

When asked to check the project:
1. Run all checks in order
2. Collect output from each
3. Report pass/fail status
4. Summarize issues found

## Output Format

```
=== TypeScript ===
Status: PASS/FAIL
Errors: X

=== ESLint ===
Status: PASS/FAIL
Errors: X, Warnings: Y

=== Build ===
Status: PASS/FAIL
Errors: X

=== Tests ===
Status: PASS/FAIL
Passed: X, Failed: Y
Coverage: Z%
```

## Handling Failures

1. **TypeScript errors**: Review type definitions and fix type mismatches
2. **Lint errors**: Fix style and code quality issues
3. **Build errors**: Check component exports and imports
4. **Test failures**: Fix failing tests before continuing

## Quick Commands

```bash
# Run all checks
npx tsc --noEmit && npm run lint && npm run build && npm test
```
