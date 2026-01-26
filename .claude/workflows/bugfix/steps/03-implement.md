# Implement Fix

Apply the fix to resolve the bug.

## Input

From previous step:
- Root cause: $ROOT_CAUSE
- Fix approach: $FIX_APPROACH
- Files to modify: $FILES_TO_MODIFY

## Tasks

1. **Apply the fix**
   - Make minimal changes to fix the issue
   - Follow project coding standards
   - Maintain TypeScript types

2. **Verify the fix**
   - Check that the issue is resolved
   - Ensure no regressions
   - Run relevant tests

3. **Update related code if needed**
   - Fix any closely related issues
   - Improve error handling if beneficial

## Output

```markdown
## Fix Applied

Changes made:
- `path/to/file1.tsx` - [description of change]
- `path/to/file2.ts` - [description of change]

## Verification
- Reproduction steps now work correctly
- No new errors introduced
- Related functionality still works
```
