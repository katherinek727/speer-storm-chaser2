@echo off
echo === Storm Chaser Android Build Fix Script ===
echo.

echo 1. Cleaning project...
cd android
call gradlew clean
cd ..

echo 2. Clearing caches...
rmdir /s /q node_modules\.cache 2>nul
rmdir /s /q %TEMP%\react-* 2>nul
rmdir /s /q %TEMP%\metro-* 2>nul
rmdir /s /q %TEMP%\haste-* 2>nul

echo 3. Checking node modules...
if "%1"=="--reinstall" (
    echo Reinstalling node modules...
    call npm ci
) else if not exist "node_modules" (
    echo Reinstalling node modules...
    call npm ci
)

echo 4. Running React Native doctor...
call npx @react-native-community/cli doctor

echo 5. Starting Metro bundler...
start /B npx react-native start --reset-cache

echo 6. Waiting for Metro to start...
timeout /t 5 /nobreak >nul

echo 7. Building Android...
cd android
call gradlew assembleDebug
cd ..

echo.
echo === Build Complete ===
echo If build succeeded, you can now run:
echo   npx react-native run-android
echo.
echo If build failed, try:
echo   cd android && gradlew clean && cd .. && npx react-native run-android
echo.
echo If you need to set up Google Maps API key:
echo 1. Get API key from: https://console.cloud.google.com/google/maps-apis
echo 2. Update android\app\src\main\res\values\strings.xml
echo 3. Replace 'YOUR_GOOGLE_MAPS_API_KEY' with your actual key
echo.
pause