#!/bin/bash

# Screenshot helper for App Store submissions
# iPhone 16 Plus produces 1290 x 2796 pixels (6.7" display - App Store required size)

SCREENSHOT_DIR="$HOME/Desktop/Systemize-Screenshots"
mkdir -p "$SCREENSHOT_DIR"

echo "📸 Screenshot Helper for Systemize"
echo "=================================="
echo ""
echo "Screenshots will be saved to: $SCREENSHOT_DIR"
echo ""
echo "Instructions:"
echo "1. Navigate to the screen you want to capture in the simulator"
echo "2. Press ENTER to take a screenshot"
echo "3. Repeat for each screen"
echo "4. Press Ctrl+C when done"
echo ""

counter=1

while true; do
    read -p "Press ENTER to take screenshot #$counter (or Ctrl+C to quit)..."

    filename="$SCREENSHOT_DIR/screenshot-$counter.png"
    xcrun simctl io booted screenshot "$filename"

    # Get dimensions
    dimensions=$(sips -g pixelWidth -g pixelHeight "$filename" | grep -E 'pixelWidth|pixelHeight' | awk '{print $2}' | paste -sd 'x' -)

    echo "✅ Saved: screenshot-$counter.png ($dimensions)"
    echo ""

    ((counter++))
done
