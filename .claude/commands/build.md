---
description: Run production build and verify output
---

## Build Command

Build the project for production and verify the output.

### Build Steps

1. **Run production build**
   ```bash
   npm run build
   ```

2. **Verify build output**
   - Check for errors
   - Verify output directory created
   - Check for any warnings

### Build Output

```
=== Build Results ===

Status: SUCCESS/FAILED
Errors: X
Warnings: Y

Output directory: .next/
Build size: ~XX MB

Key outputs:
- Static pages: X
- Dynamic pages: Y
- API routes: Z
```

### Handling Build Failures

1. **TypeScript errors**
   - Run `npx tsc --noEmit` to see all type errors
   - Fix type mismatches

2. **Lint errors**
   - Run `npm run lint` to see lint issues
   - Fix style and quality issues

3. **Next.js errors**
   - Check page exports
   - Verify dynamic routes
   - Check environment variables

### Post-Build Checks

- Verify `.next/` directory exists
- Check that critical pages built
- Ensure no missing assets

### See Also

- `/dev-check` - Quick development verification
- `/test` - Run test suite
- `/audit` - Comprehensive code audit
