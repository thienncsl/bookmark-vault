# Investigate Bug

Gather information about the bug.

## Input

Bug report or description: $BUG_REPORT

## Tasks

1. **Understand the bug**
   - What is the expected behavior?
   - What is the actual behavior?
   - When does it occur?

2. **Identify affected components**
   - Search for related code
   - Check recent changes that might have caused it
   - Look at error logs if available

3. **Reproduce the bug**
   - Find steps to reproduce
   - Identify the conditions that trigger it
   - Note any error messages

4. **Gather evidence**
   - Read relevant source files
   - Check test coverage
   - Look at git history for recent changes

## Output

```markdown
## Bug Description
[Clear description of the bug]

## Expected Behavior
[What should happen]

## Actual Behavior
[What actually happens]

## Affected Components
- `path/to/component.tsx`
- `path/to/hook.ts`

## Reproduction Steps
1. Step 1
2. Step 2
3. Step 3

## Error Messages
[Any console errors or warnings]

## Related Files
- `lib/types.ts` - Type definitions
- `context/BookmarksContext.ts` - State management
```
