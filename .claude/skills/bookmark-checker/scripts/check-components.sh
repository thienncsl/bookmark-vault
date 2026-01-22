#!/bin/bash
cd "$(dirname "$0")/../../../.." # Navigate to project root

echo "Checking component sizes..."
ISSUES=0

for file in components/*.tsx; do
  if [ -f "$file" ]; then
    LINES=$(wc -l < "$file")
    if [ "$LINES" -gt 100 ]; then
      echo "WARN:$file has$LINES lines (max 100)"
      ISSUES=$((ISSUES + 1))
    fi
  fi
done

if [ $ISSUES -eq 0 ]; then
  echo "All components within size limits"
  exit 0
else
  echo "Found$ISSUES oversized components"
  exit 1
fi