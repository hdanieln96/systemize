#!/bin/bash

# LifePlanner App Store Deployment Script
# Run this script to deploy your app to the App Store

set -e  # Exit on error

echo "=========================================="
echo "LifePlanner - App Store Deployment"
echo "=========================================="
echo ""

# Step 1: Initialize EAS project (if not already done)
echo "Step 1: Initializing EAS project..."
if ! npx eas project:info 2>/dev/null; then
    echo "Creating EAS project..."
    npx eas project:init
else
    echo "✓ EAS project already configured"
fi
echo ""

# Step 2: Build for production
echo "Step 2: Building for production..."
echo "This will:"
echo "  - Create iOS distribution certificate (if needed)"
echo "  - Create provisioning profile (if needed)"
echo "  - Build your app in the cloud"
echo "  - Upload to EAS servers"
echo ""
read -p "Press Enter to start the build..."
npx eas build --platform ios --profile production
echo ""

# Step 3: Submit to App Store
echo "=========================================="
echo "Build completed!"
echo "=========================================="
echo ""
echo "Next steps:"
echo "1. Wait for the build to complete (check status with: npx eas build:list)"
echo "2. Submit to App Store with: npx eas submit --platform ios --latest"
echo "3. Complete your App Store Connect listing"
echo "4. Submit for review"
echo ""
echo "See APP_STORE_DEPLOYMENT.md for detailed instructions"
