---
name: bookmark-checker
description: Runs automated checks on Bookmark Vault code. Use when asked to verify code quality, run checks, or validate the project.
allowed-tools: Read, Bash, Glob
---

## Bookmark Checker

Automated validation for Bookmark Vault.

## Available Checks

### Type Check
Run: `./scripts/check-types.sh`
Verifies TypeScript compilation without errors.

### Component Check
Run: `./scripts/check-components.sh`
Validates component size and structure.

### Test Check
Run: `./scripts/check-tests.sh`
Runs test suite and reports coverage.

## Execution

When asked to check the project:
1. Run all three scripts in order
2. Collect output from each
3. Report pass/fail status
4. Summarize issues found

## Script Outputs

Scripts exit with:
- 0: All checks passed
- 1: Issues found (details in stdout)