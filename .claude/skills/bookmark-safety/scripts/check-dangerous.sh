#!/bin/bash
INPUT="$1"
if echo "$INPUT" | grep -qE "localStorage\.clear|localStorage\.removeItem.*BOOKMARKS"; then
  echo "BLOCKED: This operation would delete bookmark data"
  echo "To proceed, explicitly confirm deletion intent"
  exit 1
fi
exit 0
