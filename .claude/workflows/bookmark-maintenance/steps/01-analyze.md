## Analyze Bookmark Vault

Perform initial analysis of bookmark data.

## Tasks

1. Read all bookmark data from localStorage
2. Count total bookmarks
3. Identify potential issues:
   - Empty descriptions
   - Missing tags
   - Duplicate URLs
   - Invalid URL formats

## Output Variables

Set these variables for next steps:
- bookmark_count: Total number of bookmarks
- issues_found: Number of issues detected

## Output Format

```json
{
  "bookmark_count": <number>,
  "issues_found": <number>,
  "issue_breakdown": {
    "empty_descriptions": <count>,
    "missing_tags": <count>,
    "duplicates": <count>,
    "invalid_urls": <count>
  }
}
```