# Plan Feature Implementation

Analyze the feature request and create an implementation plan.

## Input

The feature request from the user: $FEATURE_REQUEST

## Tasks

1. **Understand the feature**
   - What problem does it solve?
   - What are the acceptance criteria?
   - Are there existing patterns to follow?

2. **Identify affected areas**
   - Which components need modification?
   - Which hooks/contexts are involved?
   - Which types need updates?
   - Are new tests needed?

3. **Plan implementation steps**
   - Break down into logical steps
   - Identify dependencies between changes
   - Note any risks or considerations

4. **Review against project standards**
   - Does it follow CLAUDE.md patterns?
   - Are TypeScript types needed?
   - Is Zod validation required?

## Output

Provide a structured plan:

```markdown
## Feature Overview
[Description of the feature]

## Implementation Steps
1. [Step 1]
2. [Step 2]
3. [Step 3]

## Files Affected
- `path/to/file1.tsx` - description
- `path/to/file2.ts` - description

## Types Needed
- [New types or modifications]

## Tests Required
- [Test cases to write]

## Considerations
- [Any edge cases or concerns]
```
