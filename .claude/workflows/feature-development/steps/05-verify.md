# Verify All Checks Pass

Run development checks to verify implementation.

## Input

From previous step:
- Tests pass: $TESTS_PASS

## Tasks

1. **Run TypeScript check**
   ```bash
   npx tsc --noEmit
   ```

2. **Run linting**
   ```bash
   npm run lint
   ```

3. **Run build**
   ```bash
   npm run build
   ```

4. **Fix any issues**
   - Address type errors
   - Fix linting issues
   - Resolve build problems

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

## Status: READY_FOR_REVIEW / NEEDS_FIXES
```
