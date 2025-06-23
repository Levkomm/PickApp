#!/bin/bash

# Step 1: Update package.json
PACKAGE_JSON="./node_modules/base44/package.json"
TEMP_JSON="${PACKAGE_JSON}.tmp"

# Use sed to replace the line
sed 's/"main"[[:space:]]*:[[:space:]]*"dist\/index\.js"/"main": "dist\/index.cjs"/' "$PACKAGE_JSON" > "$TEMP_JSON"

# Check if sed succeeded
if [ $? -eq 0 ]; then
  mv "$TEMP_JSON" "$PACKAGE_JSON"
  echo "Updated main field in package.json"
else
  echo "Failed to update package.json"
  exit 1
fi

# Step 2: Rename index.js to index.cjs
ORIGINAL_FILE="./node_modules/base44/sdk/dist/index.js"
RENAMED_FILE="./node_modules/base44/sdk/dist/index.cjs"

if [ -f "$ORIGINAL_FILE" ]; then
  mv "$ORIGINAL_FILE" "$RENAMED_FILE"
  echo "Renamed index.js to index.cjs"
else
  echo "ERROR: File $ORIGINAL_FILE does not exist."
  exit 1
fi
