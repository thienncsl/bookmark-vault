---
name: bookmark-validator
description: Validates bookmark data quality in Bookmark Vault. Use when checking bookmarks for broken links, missing descriptions, duplicate URLs, or suggesting tag improvements.
allowed-tools: Read, Grep, Glob, Bash
---

# Bookmark Validator

Use this skill to validate bookmark data quality in Bookmark Vault. Run all validation checks and report findings in a structured format.

## Validation Checks

Perform these checks in order:

### 1. Check for Empty Descriptions

Find all bookmarks where the description field is empty or only whitespace. These bookmarks need description improvements.

### 2. Detect Duplicate URLs

Scan all bookmarks for duplicate URLs (case-insensitive comparison). Report each set of duplicates with their bookmark IDs.

### 3. Missing Tags

Find all bookmarks where the tags array is empty or has no tags. These bookmarks are untagged.

| ID | Title | URL |
|----|-------|-----|
| xxx | title | url |

### 4. Tag Suggestions

For each bookmark, analyze the URL and suggest relevant tags:

1. **Extract domain from URL** - Parse the hostname (e.g., `github.com` from `https://github.com/user/repo`)
2. **Generate domain-based tags** - Convert domain to tag-friendly format:
   - Remove TLD (.com, .org, .net) → `github`
   - Remove subdomains → `youtube` from `www.youtube.com`
3. **Suggest contextual tags** based on domain analysis:
   - `github.com` → `dev`, `code`, `repository`
   - `stackoverflow.com` → `dev`, `programming`, `qa`
   - `youtube.com` → `video`, `watch`, `media`
   - `medium.com` → `blog`, `article`, `reading`
   - `docs.*` → `documentation`, `docs`, `guide`
   - `twitter.com` / `x.com` → `social`, `microblog`
   - `linkedin.com` → `professional`, `career`, `networking`
   - `reddit.com` → `social`, `discussion`, `community`
4. **Extract path segments** - Parse meaningful words from URL path:
   - `/docs/api` → `docs`, `api`
   - `/blog/2024/post` → `blog`
   - `/en/latest/guide` → `guide`
5. **Deduplicate** - Remove tags that already exist in the bookmark's tags
6. **Limit suggestions** - Return at most 5 suggested tags per bookmark

**Example tag analysis:**
- `https://github.com/user/repo` → domain: `github` → tags: `dev`, `code`, `repository`, `github`
- `https://stackoverflow.com/questions/123` → domain: `stackoverflow` → tags: `dev`, `programming`, `qa`, `stackoverflow`
- `https://docs.example.com/guide` → domain: `docs.example` → tags: `documentation`, `docs`, `guide`

### 5. Validate URL Format

Use this regex to validate URLs:

```typescript
const URL_REGEX = /^https?:\/\/[^\s]+$/;
```

Flag bookmarks with invalid URLs that don't match this pattern.

### 6. Report Findings

Present results in this structured format:

```markdown
## Bookmark Validation Report

### Empty Descriptions (N found)
| ID | Title | URL |
|----|-------|-----|
| xxx | title | url |

### Duplicate URLs (N groups found)
- URL: `http://example.com`
  - Bookmark IDs: [id1, id2]

### Missing Tags (N bookmarks)
| ID | Title | URL |
|----|-------|-----|
| xxx | title | url |

### Tag Suggestions (N bookmarks)
| ID | URL | Current Tags | Suggested Tags |
|----|-----|--------------|----------------|
| xxx | url | tag1, tag2 | tag1, tag2, dev |

### Invalid URLs (N found)
| ID | Title | URL |
|----|-------|-----|
| xxx | title | url |
```

## Implementation Steps

1. Read `lib/types.ts` to understand the Bookmark interface
2. Read `lib/validation.ts` to understand existing validation schemas
3. Read `lib/storage.ts` to understand how to access localStorage data
4. Run all validation checks
5. Output the structured report

## Example

**Input:** LocalStorage contains bookmarks with mixed quality

**Output:**
```markdown
## Bookmark Validation Report

### Empty Descriptions (2 found)
| ID | Title | URL |
|----|-------|-----|
| abc123 | My GitHub | https://github.com/user/repo |

### Duplicate URLs (1 group found)
- URL: `https://youtube.com/watch?v=xyz`
  - Bookmark IDs: [def456, ghi789]

### Missing Tags (3 bookmarks)
| ID | Title | URL |
|----|-------|-----|
| abc123 | My GitHub | https://github.com/user/repo |
| def456 | Stack Answer | https://stackoverflow.com/questions/123 |
| ghi789 | Tutorial | https://docs.example.com/guide |

### Tag Suggestions (3 bookmarks)
| ID | URL | Current Tags | Suggested Tags |
|----|-----|--------------|----------------|
| abc123 | https://github.com/org/repo | [] | dev, code, repository, github |
| def456 | https://stackoverflow.com/questions/123 | [] | dev, programming, qa, stackoverflow |
| ghi789 | https://docs.example.com/guide | [] | documentation, docs, guide |

### Invalid URLs (0 found)
No invalid URLs detected.
```
