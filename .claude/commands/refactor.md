---
description: Refactor code to improve quality
---

## Refactor Command

Refactor code while maintaining functionality:

### Before Refactoring

1. Read the target file(s) to understand current implementation
2. Identify code smells and improvement opportunities
3. Plan the refactoring steps
4. Ensure tests exist before starting

### Common Refactoring Targets

- Extract reusable functions/components
- Simplify complex conditionals
- Remove duplicate code
- Improve naming for clarity
- Replace inline functions with useCallback
- Add memoization where needed
- Simplify useEffect hooks

### Safety Rules

1. Run tests after each significant change
2. Make one logical change at a time
3. Commit before starting major refactors
4. Keep changes focused and minimal

### Output

After refactoring:
- Summarize changes made
- Note any files that need review
- Indicate if tests pass
