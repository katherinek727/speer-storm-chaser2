#!/bin/bash

echo "=== Storm Chaser Android Build Fix Script ==="
echo ""

# Clean project
echo "1. Cleaning project..."
cd android
./gradlew clean
cd ..

# Clear caches
echo "2. Clearing caches..."
rm -rf node_modules/.cache
rm -rf $TMPDIR/react-*
rm -rf $TMPDIR/metro-*
rm -rf $TMPDIR/haste-*

# Reinstall node modules if needed
echo "3. Checking node modules..."
if [ ! -d "node_modules" ] || [ "$1" == "--reinstall" ]; then
    echo "Reinstalling node modules..."
    npm ci
fi

# Install pods for iOS (if on macOS)
if [[ "$OSTYPE" == "darwin"* ]]; then
    echo "4. Installing iOS pods..."
    cd ios
    pod install
    cd ..
fi

# Link native modules
echo "5. Linking native modules..."
npx react-native link react-native-vector-icons
npx react-native link react-native-safe-area-context
npx react-native link react-native-permissions
npx react-native link @react-native-async-storage/async-storage
npx react-native link react-native-maps
npx react-native link react-native-camera
npx react-native link react-native-splash-screen
npx react-native link react-native-gesture-handler

# Start Metro bundler in background
echo "6. Starting Metro bundler..."
npx react-native start --reset-cache &

# Wait for Metro to start
sleep 5

# Build Android
echo "7. Building Android..."
cd android
./gradlew assembleDebug

echo ""
echo "=== Build Complete ==="
echo "If build succeeded, you can now run:"
echo "  npx react-native run-android"
echo ""
echo "If you need to set up Google Maps API key:"
echo "1. Get API key from: https://console.cloud.google.com/google/maps-apis"
echo "2. Update android/app/src/main/res/values/strings.xml"
echo "3. Replace 'YOUR_GOOGLE_MAPS_API_KEY' with your actual key"