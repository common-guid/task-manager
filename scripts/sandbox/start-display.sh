#!/bin/bash
# start-display.sh: Initialize Xvfb for headless GUI testing

echo "Starting Xvfb on DISPLAY :99..."
Xvfb :99 -screen 0 1280x800x24 &
XVFB_PID=$!

# Wait for Xvfb to be ready
timeout 10 bash -c 'until xset -q &>/dev/null; do sleep 0.5; done'

if [ $? -eq 0 ]; then
    echo "Xvfb started successfully (PID: $XVFB_PID)"
else
    echo "Error: Xvfb failed to start within 10 seconds"
    exit 1
fi
