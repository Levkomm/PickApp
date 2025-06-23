#!/bin/bash

set -e

# Step 1: Replace 'dist/index.js' with 'dist/index.cjs' in scoped package's package.json
PACKAGE_JSON="./node_modules/@base44/package.json"

if [ ! -f "$PACKAGE_JSON" ]; then
  echo "ERROR: $PACKAGE_JSON not found."
  exit 1
fi

echo "Updating $PACKAGE_JSON..."
sed -i 's|dist/index\.js|dist/index.cjs|g' "$PACKAGE_JSON"
echo "✅ Updated references in package.json."

# Step 2: Rename index.js to index.cjs in sdk/dist
ORIGINAL_FILE="./node_modules/@base44/sdk/dist/index.js"
RENAMED_FILE="./node_modules/@base44/sdk/dist/index.cjs"

if [ ! -f "$ORIGINAL_FILE" ]; then
  echo "ERROR: $ORIGINAL_FILE not found."
  exit 1
fi

mv "$ORIGINAL_FILE" "$RENAMED_FILE"
echo "✅ Renamed $ORIGINAL_FILE to $RENAMED_FILE"
