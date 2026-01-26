# Scaffold Feature Code

Create initial file structure for the feature.

## Input

From previous step:
- Feature description: $FEATURE_DESCRIPTION
- Implementation steps: $IMPLEMENTATION_STEPS
- Files affected: $FILES_AFFECTED

## Tasks

1. **Create new files**
   - Create component files with "use client" directive
   - Add TypeScript interfaces
   - Set up basic structure matching project patterns

2. **Update existing files**
   - Add exports for new components
   - Update type definitions
   - Add to existing context/hooks if needed

3. **Follow project patterns**
   - Components under 100 lines
   - Props interfaces defined
   - Import statements correct

## Output

List files created/modified:

```markdown
## Files Created
- `path/to/new-component.tsx`
- `path/to/new-hook.ts`

## Files Modified
- `path/to/existing-file.tsx` - Added export
- `lib/types.ts` - Added interface

## Next Steps
Proceed to implement feature logic