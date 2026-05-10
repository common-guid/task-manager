#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

# Configuration
TARGET_VAULT="/home/guid/Sync/change_management/"
PLUGIN_ID="task-view"
TARGET_DIR="${TARGET_VAULT}.obsidian/plugins/${PLUGIN_ID}"

echo "Building task-manager..."
npm run build

echo "Ensuring target directory exists: ${TARGET_DIR}"
mkdir -p "${TARGET_DIR}"

echo "Deploying files to ${TARGET_DIR}..."
mv main.js "${TARGET_DIR}/main.js"

# Also copy styles.css if it exists
if [ -f "styles.css" ]; then
    mv styles.css "${TARGET_DIR}/styles.css"
fi

# Also copy manifest.json if it exists (Obsidian requires it)
if [ -f "manifest.json" ]; then
    mv manifest.json "${TARGET_DIR}/manifest.json"
fi

echo "Deployment complete!"
