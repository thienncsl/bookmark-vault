---
description: Check and update project dependencies
---

## Dependencies Command

### Check Current Dependencies

1. Run `npm outdated` to see outdated packages
2. Run `npm audit` to check for security vulnerabilities
3. Check package.json for unused dependencies

### Security Audit

Run `npm audit` and report:
- Critical/High severity vulnerabilities
- Affected packages
- Recommended fixes

### Updating Strategy

- **Patch updates:** Safe to update (e.g., 1.0.0 -> 1.0.5)
- **Minor updates:** Usually safe, check changelog (e.g., 1.0.0 -> 1.5.0)
- **Major updates:** Review breaking changes, test thoroughly (e.g., 1.0.0 -> 2.0.0)

### Output Format

Report dependencies status:

```
=== Outdated Packages ===
Package          Current  Wanted  Latest
react            18.2.0   18.2.0  18.3.1

=== Security Audit ===
Found 3 vulnerabilities (1 high, 2 moderate)
Run npm audit fix to apply security patches
```

### Recommendations

- Prioritize security fixes
- Update patch versions regularly
- Test after any dependency change
