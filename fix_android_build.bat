@echo off
echo ========================================
echo Storm Chaser Android Build Fix Script
echo ========================================
echo.

echo 1. Cleaning project...
cd android
call gradlew clean

echo.
echo 2. Checking Java version...
java -version

echo.
echo 3. Setting up environment for Java 17...
echo If you have Java 17 installed, set JAVA_HOME to its path.
echo Example: set JAVA_HOME=C:\Program Files\Java\jdk-17
echo.

echo 4. Running Gradle sync...
call gradlew --stop
timeout /t 2 /nobreak > nul
call gradlew build --info

echo.
echo ========================================
echo Build process completed.
echo If you still have issues:
echo 1. Install Java 17 from https://adoptium.net/
echo 2. Set JAVA_HOME environment variable
echo 3. In Android Studio: File -> Settings -> Build Tools -> Gradle
echo    Set Gradle JDK to version 17
echo ========================================
pause