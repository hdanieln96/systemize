#!/bin/bash

# Resize screenshots to App Store accepted dimensions
# Converts 1290 x 2796 (iPhone 16 Plus) to 1284 x 2778 (accepted format)

echo "📐 Screenshot Resizer for App Store"
echo "===================================="
echo ""

# Ask for input directory
read -p "Enter path to screenshots (or drag folder here): " input_dir

# Remove quotes if present
input_dir="${input_dir//\'/}"
input_dir="${input_dir//\"/}"

# Remove trailing slash
input_dir="${input_dir%/}"

if [ ! -d "$input_dir" ]; then
    echo "❌ Directory not found: $input_dir"
    exit 1
fi

# Create output directory
output_dir="$input_dir/resized"
mkdir -p "$output_dir"

echo ""
echo "Resizing screenshots from: $input_dir"
echo "Saving to: $output_dir"
echo ""

count=0

# Process all PNG files
for file in "$input_dir"/*.png; do
    if [ -f "$file" ]; then
        filename=$(basename "$file")

        # Get current dimensions
        width=$(sips -g pixelWidth "$file" | grep pixelWidth | awk '{print $2}')
        height=$(sips -g pixelHeight "$file" | grep pixelHeight | awk '{print $2}')

        # Check if it needs resizing
        if [ "$width" = "1290" ] && [ "$height" = "2796" ]; then
            # Resize to 1284 x 2778 (accepted by App Store)
            sips -z 2778 1284 "$file" --out "$output_dir/$filename" > /dev/null
            echo "✅ Resized: $filename (1290x2796 → 1284x2778)"
            ((count++))
        elif [ "$width" = "2796" ] && [ "$height" = "1290" ]; then
            # Landscape: resize to 2778 x 1284
            sips -z 1284 2778 "$file" --out "$output_dir/$filename" > /dev/null
            echo "✅ Resized: $filename (2796x1290 → 2778x1284)"
            ((count++))
        else
            # Copy as-is if already correct size
            cp "$file" "$output_dir/$filename"
            echo "ℹ️  Copied: $filename (${width}x${height} - no resize needed)"
            ((count++))
        fi
    fi
done

echo ""
echo "✨ Done! Processed $count screenshot(s)"
echo "📁 Resized screenshots: $output_dir"
echo ""
echo "Upload these screenshots to App Store Connect!"
