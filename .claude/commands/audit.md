---
description: Audit codebase for quality and best practices
---

## Code Audit Command

Perform a comprehensive code audit:

### Audit Checklist

1. **TypeScript Errors**
   - Run `npx tsc --noEmit`
   - Report all type errors

2. **Lint Issues**
   - Run `npx next lint`
   - Report warnings and errors

3. **Security Vulnerabilities**
   - Run `npm audit`
   - Check for XSS, SQL injection patterns in code

4. **Performance Issues**
   - Check for missing React.memo
   - Identify expensive computations without useMemo
   - Look for inline functions in JSX

5. **Accessibility**
   - Check for missing alt tags
   - Verify form labels exist
   - Check keyboard navigation support

6. **Code Coverage**
   - Run tests with coverage
   - Identify files with low coverage

### Output Format

```
=== TypeScript ===
X errors, Y warnings

=== ESLint ===
X errors, Y warnings

=== Security ===
X vulnerabilities found

=== Performance ===
Y optimization opportunities

=== Accessibility ===
Z issues found

=== Coverage ===
Overall: X%
Files needing coverage: [...]
```

### Recommendations

Prioritize fixes by:
1. Security vulnerabilities (critical)
2. TypeScript errors (blocking)
3. Lint errors (important)
4. Performance improvements (nice to have)
