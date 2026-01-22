#!/bin/bash
cd "$(dirname "$0")/../../../.." # Navigate to project root

echo "Running type check..."
npx tsc --noEmit

if [ $? -eq 0 ]; then
  echo "Type check passed"
  exit 0
else
  echo "Type check failed"
  exit 1
fi
