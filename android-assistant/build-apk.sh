#!/bin/bash

# CyberShellX Android Assistant Build Script
# This script builds the APK automatically

set -e  # Exit on any error

echo "🚀 Building CyberShellX Android Assistant..."

# Check if Android SDK is available
if [ -z "$ANDROID_HOME" ]; then
    echo "❌ ANDROID_HOME not set. Please install Android SDK."
    echo "   Download from: https://developer.android.com/studio"
    exit 1
fi

# Check if Java is available
if ! command -v java &> /dev/null; then
    echo "❌ Java not found. Please install JDK 11 or newer."
    exit 1
fi

echo "✅ Environment check passed"

# Make gradlew executable
chmod +x gradlew

echo "📦 Building debug APK..."

# Clean and build
./gradlew clean
./gradlew assembleDebug

# Check if build was successful
if [ -f "app/build/outputs/apk/debug/app-debug.apk" ]; then
    echo "✅ Build successful!"
    echo "📱 APK location: app/build/outputs/apk/debug/app-debug.apk"
    echo ""
    echo "📋 Installation instructions:"
    echo "1. Enable Developer Options on your Android device"
    echo "2. Enable USB Debugging"
    echo "3. Connect device via USB"
    echo "4. Run: adb install app/build/outputs/apk/debug/app-debug.apk"
    echo ""
    echo "Or transfer the APK to your device and install manually."
else
    echo "❌ Build failed. Check the error messages above."
    exit 1
fi