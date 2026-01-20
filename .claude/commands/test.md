---
description: Run tests and report results
---

## Test Command

Run tests and report results:

1. **Run all tests:** `npm test`
2. **Run with coverage:** `npm test -- --coverage`
3. **Run specific test file:** `npm test -- <file-path>`
4. **Watch mode:** `npm test -- --watch`

## Reporting Format

Report results in this format:

```
Tests:       X passed, Y failed, Z skipped
Time:        A seconds
Coverage:    B%
```

## Handling Failures

1. For each failing test, read the test file and source file
2. Identify the root cause of the failure
3. Suggest a fix for each failing test
4. If tests pass, celebrate and summarize coverage

## Best Practices

- Always run tests after making changes
- Check coverage reports to identify untested code paths
- Prioritize fixing failing tests before new work
