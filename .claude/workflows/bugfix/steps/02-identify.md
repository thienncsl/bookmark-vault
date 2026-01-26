# Identify Root Cause

Analyze the code to find the root cause of the bug.

## Input

From previous step:
- Bug description: $BUG_DESCRIPTION
- Affected components: $AFFECTED_COMPONENTS
- Reproduction steps: $REPRODUCTION_STEPS

## Tasks

1. **Analyze affected code**
   - Read the source files
   - Trace the execution flow
   - Identify where the bug occurs

2. **Find the root cause**
   - What is the underlying issue?
   - Why does it happen?
   - What conditions trigger it?

3. **Determine fix approach**
   - What needs to change?
   - Are there multiple solutions?
   - What is the minimal fix?

4. **Check for side effects**
   - Will the fix break Are there related issues anything?
   -?

## Output

```markdown
## Root Cause
[Explanation of why the bug occurs]

## Fix Approach
[How to fix it]

## Files to Modify
- `path/to/file1.tsx` - Line XX: [change]
- `path/to/file2.ts` - Line YY: [change]

## Risk Assessment
- Low: [explanation]
- Medium: [explanation]

## Alternative Solutions Considered
- Option 1: [why not chosen]
- Option 2: [why not chosen]
```
