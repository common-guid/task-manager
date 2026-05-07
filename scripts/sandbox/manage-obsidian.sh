#!/bin/bash
# manage-obsidian.sh: Download and extract a specific version of Obsidian

set -e

VERSION=${1:-"1.5.12"}
BIN_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../" && pwd)/.obsidian-bin"
VERSION_DIR="$BIN_DIR/obsidian-$VERSION"
EXTRACT_DIR="$VERSION_DIR/squashfs-root"
APPIMAGE_PATH="$VERSION_DIR/Obsidian-$VERSION.AppImage"
SYMLINK_PATH="$BIN_DIR/squashfs-root"

mkdir -p "$VERSION_DIR"

if [ ! -d "$EXTRACT_DIR" ]; then
    echo "Obsidian $VERSION not found in cache. Downloading..."
    
    URL="https://github.com/obsidianmd/obsidian-releases/releases/download/v$VERSION/Obsidian-$VERSION.AppImage"
    
    if [ ! -f "$APPIMAGE_PATH" ]; then
        curl -L "$URL" -o "$APPIMAGE_PATH"
    fi
    
    chmod +x "$APPIMAGE_PATH"
    
    echo "Extracting AppImage..."
    cd "$VERSION_DIR"
    # Extract AppImage. It creates a 'squashfs-root' directory by default.
    ./Obsidian-"$VERSION".AppImage --appimage-extract > /dev/null
    cd - > /dev/null
    
    echo "Extraction complete."
else
    echo "Obsidian $VERSION is already cached and extracted."
fi

# Update symlink to point to the requested version
echo "Updating symlink $SYMLINK_PATH -> $EXTRACT_DIR"
rm -f "$SYMLINK_PATH"
ln -s "$EXTRACT_DIR" "$SYMLINK_PATH"

echo "Obsidian binary is ready at $SYMLINK_PATH"
