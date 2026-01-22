# Bookmark Maintenance Report

**Generated:** {{ generated_at }}
**Workflow:** bookmark-maintenance

---

## 1. Executive Summary

**Total Bookmarks:** {{ bookmark_count }}
**Issues Found:** {{ issues_found }}
**Status:** {{ status }}

---

## 2. Bookmark Statistics

| Metric | Value |
|--------|-------|
| Total Bookmarks | {{ bookmark_count }} |
| With Descriptions | {{ with_descriptions }} |
| Without Descriptions | {{ without_descriptions }} |
| Tagged | {{ tagged }} |
| Untagged | {{ untagged }} |

---

## 3. Issues Found

### Duplicate URLs
{{ #if duplicate_urls }}
- {{ duplicate_urls }}
{{ else }}
- No duplicate URLs found
{{ /if }}

### Missing Metadata
{{ #if missing_metadata }}
- {{ missing_metadata }}
{{ else }}
- All bookmarks have required metadata
{{ /if }}

### Broken Links
{{ #if broken_links }}
- {{ broken_links }}
{{ else }}
- No broken links detected
{{ /if }}

---

## 4. Recommended Actions

{{ #each cleanup_suggestions }}
- [ ] {{ this }}
{{ /each }}

---

## 5. Next Steps

1. Review the issues identified above
2. Apply recommended cleanup actions
3. Re-run maintenance workflow to verify fixes
