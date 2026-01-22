---
name: bookmark-safety
description: Protects Bookmark Vault data from accidental deletion. Activates for all file operations in the project.
hooks:
  PreToolUse:
    - matcher: "Edit|Write"
      hooks:
        - type: command
          command: "bash -c 'echo \"$TOOL_INPUT\" | grep -q \"localStorage.clear\\|removeItem\" && echo \"BLOCKED: Attempting to clear bookmark data\" && exit 1 || exit 0'"
---

# Bookmark Safety Skill

This skill protects bookmark data from accidental deletion by intercepting Edit and Write tool calls that attempt to modify localStorage operations.

## Hook Behavior

When activated, the hook:
1. Intercepts Edit and Write tool calls
2. Checks if the change includes `localStorage.clear()` or `removeItem` patterns
3. Blocks dangerous operations with a clear error message
4. Allows safe operations to proceed

## Protected Operations

The hook specifically protects against:
- `localStorage.clear()` - would delete all bookmark data
- `localStorage.removeItem()` - could delete specific bookmark storage keys

## Test Script

Run the test script to verify hook behavior:
```bash
.claude/skills/bookmark-safety/scripts/check-dangerous.sh "<tool-input>"
```

## Safe Editing Guidelines

When working with localStorage:
- Use read operations (`getItem`, direct property access) freely
- Avoid modifying storage operations in production code
- If deletion is truly needed, add a confirmation step
