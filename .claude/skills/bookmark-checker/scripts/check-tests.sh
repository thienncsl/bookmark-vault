#!/bin/bash
cd "$(dirname "$0")/../../../.." # Navigate to project root

echo "Running tests..."
npm run test -- --passWithNoTests

if [ $? -eq 0 ]; then
  echo "All tests passed"
  exit 0
else
  echo "Tests failed"
  exit 1
fi
