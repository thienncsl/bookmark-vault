## Validate Bookmark Data

Deep validation of bookmark quality.

## Validation Rules

1. URL format: Must be valid URL with protocol
2. Title: Non-empty, under 200 characters
3. Description: Recommended but optional
4. Tags: At least one tag recommended
5. Created date: Must be valid timestamp

## For Each Bookmark

Check all rules and categorize:
- PASS: All rules satisfied
- WARN: Optional rules failed
- FAIL: Required rules failed

## Output

List of validation results per bookmark with severity.