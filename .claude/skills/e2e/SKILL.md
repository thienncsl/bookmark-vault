---
name: e2e
description: Generate and run end-to-end tests with Playwright. Creates test journeys, runs tests, captures screenshots/videos/traces, and uploads artifacts.
allowed-tools: Read, Write, Glob, Bash, mcp__plugin_playwright_playwright__*
---

## E2E Testing Workflow

End-to-end testing using Playwright for critical user journeys.

## When to Use

- Testing complete user workflows
- Verifying multi-page interactions
- Testing authentication flows
- Cross-browser testing
- Visual regression testing

## Test Journey Template

### 1. Define User Journey

```typescript
import { test, expect } from '@playwright/test';

test.describe('Bookmark Journey', () => {
  test('user can add and manage bookmarks', async ({ page }) => {
    // 1. Navigate to app
    await page.goto('/');

    // 2. Add new bookmark
    await page.click('button:has-text("Add Bookmark")');
    await page.fill('input[name="title"]', 'Test Bookmark');
    await page.fill('input[name="url"]', 'https://example.com');
    await page.click('button:has-text("Save")');

    // 3. Verify bookmark appears
    await expect(page.locator('text=Test Bookmark')).toBeVisible();

    // 4. Search for bookmark
    await page.fill('input[placeholder="Search..."]', 'Test');
    await expect(page.locator('text=Test Bookmark')).toBeVisible();

    // 5. Delete bookmark
    await page.click('button[aria-label="Delete"]');
    await expect(page.locator('text=Test Bookmark')).not.toBeVisible();
  });
});
```

## 2. Create Test File

Location: `e2e/` directory
Naming: `journey-name.spec.ts`

### Common Test Patterns

### Authentication Flow
```typescript
test('user can sign in and access dashboard', async ({ page }) => {
  await page.goto('/login');
  await page.fill('input[name="email"]', 'user@example.com');
  await page.fill('input[name="password"]', 'password123');
  await page.click('button:has-text("Sign In")');
  await expect(page).toHaveURL('/dashboard');
  await expect(page.locator('text=Welcome')).toBeVisible();
});
```

### Form Submission
```typescript
test('form validation works correctly', async ({ page }) => {
  await page.goto('/bookmarks/new');
  await page.click('button:has-text("Save")');
  await expect(page.locator('text=Title is required')).toBeVisible();
  await page.fill('input[name="title"]', 'Valid Title');
  await expect(page.locator('text=Title is required')).not.toBeVisible();
});
```

### Search Functionality
```typescript
test('search filters results correctly', async ({ page }) => {
  await page.goto('/');
  await page.fill('input[placeholder="Search"]', 'javascript');
  const results = page.locator('[data-testid="bookmark-list"] li');
  await expect(results).toHaveCount(3);
});
```

## 3. Run E2E Tests

```bash
# Run all e2e tests
npx playwright test

# Run specific test file
npx playwright test e2e/bookmark-journey.spec.ts

# Run with headed browser
npx playwright test --headed

# Run on specific browser
npx playwright test --browser=chromium
npx playwright test --browser=webkit
npx playwright test --browser=firefox
```

## 4. Debug and Fix

### Use Playwright Tools

```bash
# Open UI mode
npx playwright test --ui

# Generate test from actions
npx playwright codegen https://localhost:3000

# Take screenshot on failure
npx playwright test --screenshot=only-on-failure

# Record trace
npx playwright test --trace=on
```

### Debug Commands

```bash
# Debug specific test
npx playwright test e2e/test.spec.ts --debug

# Show test report
npx playwright show-report
```

## Test Coverage Areas

### Critical User Journeys

| Journey | Priority | Test File |
|---------|----------|-----------|
| Add bookmark | Critical | `add-bookmark.spec.ts` |
| Search bookmarks | Critical | `search-bookmarks.spec.ts` |
| Delete bookmark | Critical | `delete-bookmark.spec.ts` |
| Edit bookmark | High | `edit-bookmark.spec.ts` |
| Filter by tag | Medium | `filter-by-tag.spec.ts` |
| Theme toggle | Low | `theme-toggle.spec.ts` |

### Browser Support

- Chromium (default)
- Firefox
- Webkit (Safari)

## Artifacts

After test run, artifacts are available:

| Artifact | Location | Purpose |
|----------|----------|---------|
| Screenshots | `test-results/` | Visual debugging |
| Videos | `test-results/` | Test replay |
| Traces | `test-results/` | Detailed timing |
| HTML Report | `playwright-report/` | Test summary |

## Output Format

```markdown
## E2E Test Results

### Journey Tests
- add-bookmark: PASS/FAIL
- search-bookmarks: PASS/FAIL
- delete-bookmark: PASS/FAIL

### Browser Results
| Browser | Passed | Failed |
|---------|--------|--------|
| Chromium | X | Y |
| Firefox | X | Y |
| Webkit | X | Y |

### Artifacts
- Report: `playwright-report/index.html`
- Screenshots: `test-results/`
- Trace: `test-results/trace.zip`

## Status: READY / FAILED
```

## Configuration

### playwright.config.ts

```typescript
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  timeout: 30000,
  retries: 0,
  use: {
    baseURL: 'http://localhost:3000',
    headless: true,
  },
  projects: [
    { name: 'chromium', use: { browserName: 'chromium' } },
    { name: 'firefox', use: { browserName: 'firefox' } },
    { name: 'webkit', use: { browserName: 'webkit' } },
  ],
});
```

## Best Practices

1. **Isolate tests** - Each test should be independent
2. **Clean up** - Use test.afterEach to reset state
3. **Use locators** - Prefer data-testid over CSS selectors
4. **Wait properly** - Use auto-waiting, not sleep()
5. **Handle auth** - Use storageState for authenticated sessions
6. **Parallelize** - Run tests in parallel when possible

## Quick Commands

```bash
# Install Playwright browsers
npx playwright install

# Run all e2e tests
npx playwright test

# Generate test from UI
npx playwright codegen

# Show report
npx playwright show-report
```
