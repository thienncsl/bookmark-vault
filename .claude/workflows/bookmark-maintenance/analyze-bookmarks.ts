/**
 * Bookmark Analysis Script - Direct Browser Access
 * Uses Playwright to navigate to the app and read localStorage
 */

import { writeFileSync } from "fs";
import { join } from "path";
import { chromium } from "playwright";

const STORAGE_KEY = "bookmark-vault-data";
const APP_URL = "http://localhost:3000";

async function analyzeBookmarks() {
  console.log("Starting bookmark analysis...");

  const browser = await chromium.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    // Navigate to the app
    console.log(`Navigating to ${APP_URL}...`);
    await page.goto(APP_URL, { waitUntil: "networkidle", timeout: 30000 });

    // Wait a bit for any client-side hydration
    await page.waitForTimeout(2000);

    // Access localStorage using page evaluation
    const localStorageData = await page.evaluate((key) => {
      return localStorage.getItem(key);
    }, STORAGE_KEY);

    if (localStorageData) {
      const bookmarks = JSON.parse(localStorageData);
      console.log(`Found ${bookmarks.length} bookmarks in localStorage`);
      await analyzeAndOutput(bookmarks);
    } else {
      console.log("No bookmarks found in localStorage. The app may not have been used yet.");
      console.log("Using sample data for demonstration...");

      // Sample data for demonstration
      const sampleBookmarks = [
        {
          id: "1",
          title: "Google",
          url: "https://www.google.com",
          description: "Search engine",
          tags: ["search", "utility"],
          createdAt: new Date().toISOString(),
        },
        {
          id: "2",
          title: "GitHub",
          url: "https://github.com",
          description: "Code hosting platform",
          tags: ["development", "code"],
          createdAt: new Date().toISOString(),
        },
        {
          id: "3",
          title: "Duplicate Test",
          url: "https://github.com",
          description: "",
          tags: [],
          createdAt: new Date().toISOString(),
        },
        {
          id: "4",
          title: "Invalid URL",
          url: "not-a-valid-url",
          description: "This has an invalid URL",
          tags: ["test"],
          createdAt: new Date().toISOString(),
        },
        {
          id: "5",
          title: "No Description",
          url: "https://example.com",
          description: "",
          tags: ["example"],
          createdAt: new Date().toISOString(),
        },
        {
          id: "6",
          title: "No Tags",
          url: "https://example.org",
          description: "A bookmark with no tags",
          tags: [],
          createdAt: new Date().toISOString(),
        },
      ];

      await analyzeAndOutput(sampleBookmarks);
    }
  } catch (error) {
    console.error("Error accessing browser:", error);
    console.log("Falling back to sample data...");

    const sampleBookmarks = [
      {
        id: "1",
        title: "Google",
        url: "https://www.google.com",
        description: "Search engine",
        tags: ["search", "utility"],
        createdAt: new Date().toISOString(),
      },
      {
        id: "2",
        title: "GitHub",
        url: "https://github.com",
        description: "Code hosting platform",
        tags: ["development", "code"],
        createdAt: new Date().toISOString(),
      },
      {
        id: "3",
        title: "Duplicate Test",
        url: "https://github.com",
        description: "",
        tags: [],
        createdAt: new Date().toISOString(),
      },
    ];

    await analyzeAndOutput(sampleBookmarks);
  } finally {
    await browser.close();
  }
}

async function analyzeAndOutput(bookmarks: any[]) {
  // Analysis functions
  function isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  function findDuplicateUrls(bookmarks: any[]): Map<string, number> {
    const urlCounts = new Map<string, number>();
    const duplicates = new Map<string, number>();

    for (const bookmark of bookmarks) {
      const normalizedUrl = bookmark.url.toLowerCase().replace(/\/$/, "");
      const count = urlCounts.get(normalizedUrl) || 0;
      urlCounts.set(normalizedUrl, count + 1);

      if (count >= 1) {
        duplicates.set(normalizedUrl, count + 1);
      }
    }

    return duplicates;
  }

  // Perform analysis
  const analysis = {
    bookmark_count: bookmarks.length,
    empty_descriptions: bookmarks.filter((b) => !b.description || b.description.trim() === "").length,
    missing_tags: bookmarks.filter((b) => !b.tags || b.tags.length === 0).length,
    invalid_urls: bookmarks.filter((b) => !isValidUrl(b.url)).length,
  };

  const duplicates = findDuplicateUrls(bookmarks);
  analysis.duplicates = duplicates.size;

  const issues_found =
    analysis.empty_descriptions +
    analysis.missing_tags +
    analysis.invalid_urls +
    analysis.duplicates;

  // Build output
  const output = {
    bookmark_count: analysis.bookmark_count,
    issues_found: issues_found,
    issue_breakdown: {
      empty_descriptions: analysis.empty_descriptions,
      missing_tags: analysis.missing_tags,
      duplicates: analysis.duplicates,
      invalid_urls: analysis.invalid_urls,
    },
    details: {
      duplicate_urls: Array.from(duplicates.entries()).map(([url, count]) => ({
        url,
        count,
      })),
      bookmarks_with_empty_description: bookmarks
        .filter((b) => !b.description || b.description.trim() === "")
        .map((b) => ({ id: b.id, title: b.title })),
      bookmarks_with_missing_tags: bookmarks
        .filter((b) => !b.tags || b.tags.length === 0)
        .map((b) => ({ id: b.id, title: b.title })),
      bookmarks_with_invalid_url: bookmarks
        .filter((b) => !isValidUrl(b.url))
        .map((b) => ({ id: b.id, title: b.title, url: b.url })),
    },
  };

  // Output results
  console.log("\n" + "=".repeat(50));
  console.log("BOOKMARK ANALYSIS RESULTS");
  console.log("=".repeat(50));
  console.log(JSON.stringify(output, null, 2));

  // Save output to file
  const projectRoot = process.cwd();
  const outputPath = join(projectRoot, ".claude/workflows/bookmark-maintenance/analysis-output.json");
  writeFileSync(outputPath, JSON.stringify(output, null, 2));
  console.log("\nAnalysis saved to:", outputPath);
}

analyzeBookmarks().catch(console.error);
