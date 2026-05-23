@echo off
echo ========================================
echo Android Build Helper Script
echo ========================================
echo.

echo 1. Stopping Gradle daemons...
call gradlew --stop

echo.
echo 2. Cleaning project...
call gradlew clean

echo.
echo 3. Clearing Gradle cache...
if exist "%USERPROFILE%\.gradle\caches" (
    echo Clearing Gradle cache...
    rmdir /s /q "%USERPROFILE%\.gradle\caches"
)

echo.
echo 4. Trying offline mode build...
echo If you have dependencies cached locally, this might work.
call gradlew build --offline

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo Offline build failed. Trying online build...
    call gradlew build
)

echo.
echo ========================================
echo Build process completed.
echo ========================================
pause