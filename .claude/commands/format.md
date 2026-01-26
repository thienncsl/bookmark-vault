---
description: Format code with Prettier
---

## Format Command

Format code using Prettier for consistent style.

### Format Options

1. **Check formatting only**
   ```bash
   npx prettier --check .
   ```
   Reports which files need formatting without changing them.

2. **Format all files**
   ```bash
   npx prettier --write .
   ```
   Formats all supported files in place.

3. **Format specific files**
   ```bash
   npx prettier --write src/components/Button.tsx
   ```

### Output

```
=== Formatting Results ===

Files checked: X
Files formatted: Y
Files skipped: Z

=== Unformatted Files ===
- path/to/file1.tsx
- path/to/file2.ts
```

### Configuration

Prettier is configured in `.prettierrc`:
- Tab width: 2
- Semicolons: Yes
- Quotes: Single
- Trailing commas: ES5

### Integration

This command integrates with the pre-commit hook:
- Files are automatically formatted before commit
- Use `--cache` for faster repeated checks

### See Also

- `/lint` - Check code quality (via `/dev-check`)
- `/dev-check` - Combined lint, type, and build check
