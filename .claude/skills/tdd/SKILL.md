---
name: tdd
description: Enforce test-driven development workflow. Scaffold interfaces, generate tests FIRST, then implement minimal code to pass. Ensure 80%+ coverage.
allowed-tools: Read, Write, Glob, Bash
---

## TDD Workflow

Follow test-driven development discipline for new features and bug fixes.

## When to Use

- Adding new features
- Fixing bugs with test coverage
- Refactoring existing code
- Adding new components

## TDD Cycle

```
1. Write FAILING test
2. Write MINIMAL code to pass
3. Refactor if needed
4. Repeat for next test
```

## Step 1: Write Failing Test

Before writing implementation code:

1. **Identify test scenarios**
   - Happy path
   - Error cases
   - Edge cases
   - Boundary conditions

2. **Create test file**
   - Location: `components/__tests__/` or `hooks/__tests__/`
   - Naming: `ComponentName.test.tsx`
   - Use React Testing Library

3. **Mock dependencies**
   - Mock localStorage
   - Mock context providers
   - Mock fetch/API calls

### Test Template

```tsx
import { render, screen, fireEvent } from "@testing-library/react";
import { ComponentName } from "../ComponentName";

describe("ComponentName", () => {
  const defaultProps = { /* ... */ };

  it("renders without crashing", () => {
    render(<ComponentName {...defaultProps} />);
    expect(screen.getByText("expected")).toBeInTheDocument();
  });

  it("handles user interaction", () => {
    render(<ComponentName {...defaultProps} />);
    fireEvent.click(screen.getByRole("button"));
    expect(screen.getByText("changed")).toBeInTheDocument();
  });

  it("shows error for invalid input", () => {
    render(<ComponentName {...defaultProps} />);
    fireEvent.change(screen.getByRole("textbox"), {
      target: { value: "invalid" }
    });
    expect(screen.getByText("error message")).toBeInTheDocument();
  });
});
```

## Step 2: Run Failing Test

```bash
npm test -- --testPathPattern="ComponentName"
```

Expected: Test should FAIL with clear error message.

## Step 3: Write Minimal Implementation

Write ONLY enough code to pass the test:

```tsx
export function ComponentName({ prop }: Props) {
  return <div>minimal content</div>;
}
```

Do NOT:
- Add extra features
- Optimize prematurely
- Add styling before needed

## Step 4: Verify Test Passes

```bash
npm test -- --testPathPattern="ComponentName"
```

Expected: All tests PASS.

## Step 5: Add More Tests

Repeat the cycle for each scenario.

## Coverage Requirements

- Target: 80%+ coverage
- Check: `npm test -- --coverage`
- Focus on:
  - Component rendering
  - User interactions
  - Error states
  - Edge cases

## Test Categories

### Unit Tests (Components/Hooks)
- Test in isolation
- Mock all dependencies
- 100% coverage goal

### Integration Tests
- Test context/providers
- Test component interactions
- 80% coverage goal

### Edge Cases to Cover

| Scenario | Test Case |
|----------|-----------|
| Empty input | Render with no data |
| Loading state | Show spinner/loading |
| Error state | Display error message |
| Long content | Handle overflow |
| Special chars | Escape/sanitize |
| Multiple items | Render list correctly |

## Output Format

After completing TDD cycle:

```markdown
## TDD Completion Report

### Tests Written
- `components/__tests__/Feature.test.tsx`

### Tests Added
- renders correctly
- handles user interaction
- shows error for invalid input

### Coverage
- Statements: X%
- Branches: Y%
- Functions: Z%
- Lines: W%

### Implementation Files
- `components/Feature.tsx`
- `hooks/useFeature.ts`

## Status: READY / NEEDS_MORE_TESTS
```

## TDD Rules

1. **RED**: Always start with failing test
2. **GREEN**: Write minimal code to pass
3. **REFACTOR**: Improve code while keeping tests passing
4. **NO NEW TESTS** until current tests pass
5. **NO PREMATURE OPTIMIZATION**

## Quick Commands

```bash
# Run specific test file
npm test -- Feature.test.tsx

# Run with coverage
npm test -- --coverage

# Watch mode
npm test -- --watch

# Generate test for component
/generate-bookmark test ComponentName
```
