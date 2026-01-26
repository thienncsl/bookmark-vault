# Run Full Verification

Run all development checks to ensure the fix is complete.

## Input

From previous step:
- Tests pass: $TESTS_PASS

## Tasks

1. **TypeScript check**
   ```bash
   npx tsc --noEmit
   ```

2. **Lint check**
   ```bash
   npm run lint
   ```

3. **Build check**
   ```bash
   npm run build
   ```

4. **Full test suite**
   ```bash
   npm test
   ```

## Output

```markdown
## Verification Results

### TypeScript
Status: PASS/FAIL
Errors: X

### ESLint
Status: PASS/FAIL
Errors: X, Warnings: Y

### Build
Status: PASS/FAIL

### Tests
Status: PASS/FAIL
Passed: X, Failed: Y

## Status: FIXED / NEEDS_MORE_WORK
```
