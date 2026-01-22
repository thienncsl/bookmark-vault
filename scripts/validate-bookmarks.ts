// Bookmark Validation Script
// Run with: npx ts-node --esm scripts/validate-bookmarks.ts

const URL_REGEX = /^https?:\/\/[^\s]+$/;

const TAG_SUGGESTIONS: [RegExp, string[]][] = [
  [/github\.com/i, ["dev", "opensource"]],
  [/youtube\.com/i, ["video", "media"]],
  [/twitter\.com|x\.com/i, ["social", "microblog"]],
  [/linkedin\.com/i, ["professional", "career"]],
  [/medium\.com/i, ["blog", "article"]],
  [/stackoverflow\.com/i, ["dev", "qa", "programming"]],
  [/docs\./i, ["documentation"]],
  [/wikipedia\.org/i, ["reference", "research"]],
  [/amazon\.com/i, ["shopping"]],
  [/netflix\.com|hulu\.com/i, ["entertainment"]],
];

// Bookmark interface (from lib/types.ts)
interface Bookmark {
  id: string;
  title: string;
  url: string;
  description?: string;
  tags: string[];
  createdAt: string;
  updatedAt?: string;
}

function getBookmarks(): Bookmark[] {
  try {
    const data = localStorage.getItem("bookmark-vault-data");
    if (!data) return [];
    return JSON.parse(data);
  } catch {
    console.error("Failed to read bookmarks");
    return [];
  }
}

// Alternative: Parse from a JSON export file
function loadFromJson(filePath: string): Bookmark[] {
  const fs = require("fs");
  const data = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(data);
}

// Validation functions
function checkEmptyDescriptions(bookmarks: Bookmark[]) {
  return bookmarks.filter(b => !b.description || b.description.trim() === "");
}

function checkDuplicateUrls(bookmarks: Bookmark[]) {
  const urlMap = new Map<string, string[]>();
  bookmarks.forEach(b => {
    const url = b.url.toLowerCase();
    if (!urlMap.has(url)) urlMap.set(url, []);
    urlMap.get(url)!.push(b.id);
  });
  return Array.from(urlMap.entries()).filter(([_, ids]) => ids.length > 1);
}

function suggestTags(url: string, currentTags: string[]): string[] {
  const suggestions: string[] = [];
  for (const [pattern, tags] of TAG_SUGGESTIONS) {
    if (pattern.test(url)) {
      tags.forEach(t => {
        if (!currentTags.includes(t)) suggestions.push(t);
      });
    }
  }
  return suggestions;
}

function validateUrlFormat(url: string): boolean {
  return URL_REGEX.test(url);
}

// Main validation
function validate(bookmarks: Bookmark[]) {
  const emptyDescriptions = checkEmptyDescriptions(bookmarks);
  const duplicateUrls = checkDuplicateUrls(bookmarks);
  const tagSuggestions = bookmarks.map(b => ({
    ...b,
    suggestedTags: suggestTags(b.url, b.tags)
  })).filter(b => b.suggestedTags.length > 0);
  const invalidUrls = bookmarks.filter(b => !validateUrlFormat(b.url));

  // Generate report
  console.log("## Bookmark Validation Report\n");

  console.log(`### Empty Descriptions (${emptyDescriptions.length} found)`);
  if (emptyDescriptions.length > 0) {
    console.log("| ID | Title | URL |");
    console.log("|----|-------|-----|");
    emptyDescriptions.forEach(b => console.log(`| ${b.id} | ${b.title} | ${b.url} |`));
  } else {
    console.log("No empty descriptions found.");
  }
  console.log("");

  console.log(`### Duplicate URLs (${duplicateUrls.length} groups found)`);
  if (duplicateUrls.length > 0) {
    duplicateUrls.forEach(([url, ids]) => {
      console.log(`- URL: \`${url}\``);
      console.log(`  - Bookmark IDs: [${ids.join(", ")}]`);
    });
  } else {
    console.log("No duplicate URLs found.");
  }
  console.log("");

  console.log(`### Tag Suggestions (${tagSuggestions.length} bookmarks)`);
  if (tagSuggestions.length > 0) {
    console.log("| ID | URL | Current Tags | Suggested Tags |");
    console.log("|----|-----|--------------|----------------|");
    tagSuggestions.forEach(b => {
      const current = b.tags.length > 0 ? b.tags.join(", ") : "(none)";
      const suggested = b.suggestedTags.join(", ");
      console.log(`| ${b.id} | ${b.url} | ${current} | ${suggested} |`);
    });
  } else {
    console.log("No tag suggestions needed.");
  }
  console.log("");

  console.log(`### Invalid URLs (${invalidUrls.length} found)`);
  if (invalidUrls.length > 0) {
    console.log("| ID | Title | URL |");
    console.log("|----|-------|-----|");
    invalidUrls.forEach(b => console.log(`| ${b.id} | ${b.title} | ${b.url} |`));
  } else {
    console.log("No invalid URLs detected.");
  }
}

// Export for module usage
export { validate, getBookmarks, loadFromJson };

// Run if executed directly
if (typeof window !== "undefined") {
  const bookmarks = getBookmarks();
  validate(bookmarks);
}
