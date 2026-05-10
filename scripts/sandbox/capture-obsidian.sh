#!/bin/bash
# capture-obsidian.sh: Launch Obsidian and capture a screenshot for verification

PROJECT_ROOT="/home/guid/projects/obsidian_dev/task-manager"
VAULT_PATH="$PROJECT_ROOT/test-vault"
SCREENSHOT_DIR="/home/guid/.gemini/tmp/task-manager/verification"
SCREENSHOT_PATH="$SCREENSHOT_DIR/obsidian-capture-$(date +%Y%m%d-%H%M%S).png"
LOG_BOOK="$PROJECT_ROOT/LOG_BOOK.md"
PLUGIN_DIR="$VAULT_PATH/.obsidian/plugins/task-view"

# 1. Build the plugin
echo "Building Task View plugin..."
cd "$PROJECT_ROOT"
npm run build

# 2. Ensure Obsidian binary is available
echo "Ensuring Obsidian binary is available..."
./scripts/sandbox/manage-obsidian.sh "1.5.12"

# 3. Inject the plugin into the test vault
echo "Injecting plugin into test vault..."
mkdir -p "$PLUGIN_DIR"
cp main.js manifest.json "$PLUGIN_DIR/"
if [ -f styles.css ]; then
    cp styles.css "$PLUGIN_DIR/"
fi

# Use a writable directory for Obsidian's configuration
export HOME=/tmp/obsidian-home
export XDG_CONFIG_HOME=/tmp/obsidian-home/.config
mkdir -p "$XDG_CONFIG_HOME"
mkdir -p "$SCREENSHOT_DIR"

OBSIDIAN_BIN="$(pwd)/.obsidian-bin/squashfs-root/chrome-sandbox"
# The actual executable inside squashfs-root is often 'obsidian' or 'AppRun'
# We'll use the symlink created by manage-obsidian.sh
OBSIDIAN_EXEC="$(pwd)/.obsidian-bin/squashfs-root/obsidian"

echo "Launching Obsidian (headless)..."
# Start Obsidian with --no-sandbox and --disable-gpu
"$OBSIDIAN_EXEC" --no-sandbox --disable-gpu "$VAULT_PATH" &
OBSIDIAN_PID=$!

echo "Waiting for Obsidian window to appear..."
# Wait up to 30 seconds for the window to be managed by the window manager
MAX_WAIT=30
WAIT_COUNT=0
WINDOW_DETECTED=false

while [ $WAIT_COUNT -lt $MAX_WAIT ]; do
    if wmctrl -l | grep -i "Obsidian" > /dev/null; then
        echo "Obsidian window detected via wmctrl."
        WINDOW_DETECTED=true
        break
    fi
    # Check if the process died early
    if ! kill -0 $OBSIDIAN_PID 2>/dev/null; then
        echo "Error: Obsidian process died prematurely."
        exit 1
    fi
    sleep 1
    let WAIT_COUNT=WAIT_COUNT+1
done

if [ "$WINDOW_DETECTED" = false ]; then
    echo "Warning: Obsidian window not detected via wmctrl, but process is running."
    echo "Attempting capture anyway after extra wait..."
    sleep 10
fi

# 3. UI Automation to open the view
echo "Opening Bases view via Command Palette..."
# Focus the window
xdotool search --name "Obsidian" windowactivate --sync
sleep 2
# Open Command Palette
xdotool key ctrl+p
sleep 1
# Type the command
xdotool type "Bases: Open Bases"
sleep 1
# Execute
xdotool key Return

# Give it a few more seconds to finish rendering the content
echo "Waiting for rendering to complete..."
sleep 5

echo "Capturing screenshot to $SCREENSHOT_PATH..."
scrot -z "$SCREENSHOT_PATH"

echo "Updating LOG_BOOK.md..."
echo -e "\n## Visual Verification | $(date +%Y-%m-%d)\nScreenshot captured: \`$SCREENSHOT_PATH\`\n" >> "$LOG_BOOK"

echo "Cleaning up..."
kill $OBSIDIAN_PID

echo "Verification complete."
