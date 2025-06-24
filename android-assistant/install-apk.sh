#!/bin/bash

# CyberShellX Android Assistant Install Script
# This script installs the APK to connected Android device

set -e

APK_PATH="app/build/outputs/apk/debug/app-debug.apk"

echo "📱 Installing CyberShellX Assistant to Android device..."

# Check if APK exists
if [ ! -f "$APK_PATH" ]; then
    echo "❌ APK not found. Please build the app first:"
    echo "   ./build-apk.sh"
    exit 1
fi

# Check if adb is available
if ! command -v adb &> /dev/null; then
    echo "❌ ADB not found. Please install Android SDK Platform Tools."
    echo "   Or use Android Studio to install the APK."
    exit 1
fi

# Check if device is connected
DEVICES=$(adb devices | grep -v "List of devices" | grep -c "device$" || true)
if [ "$DEVICES" -eq 0 ]; then
    echo "❌ No Android device connected."
    echo "   Please connect your device via USB and enable USB Debugging."
    echo ""
    echo "📋 Setup instructions:"
    echo "1. Go to Settings → About Phone"
    echo "2. Tap Build Number 7 times to enable Developer Options"
    echo "3. Go to Settings → Developer Options"
    echo "4. Enable USB Debugging"
    echo "5. Connect device via USB"
    echo "6. Allow USB Debugging when prompted"
    exit 1
fi

echo "✅ Found $DEVICES connected device(s)"

# Install APK
echo "📦 Installing APK..."
adb install -r "$APK_PATH"

echo "✅ Installation complete!"
echo ""
echo "📋 Next steps:"
echo "1. Open CyberShellX Assistant on your device"
echo "2. Grant microphone permission when prompted"
echo "3. Tap 'Start Always Listening' for background operation"
echo "4. Say 'Hey CyberShell' followed by your commands"
echo ""
echo "🔧 Make sure your CyberShellX server is running:"
echo "   python cybershellx_server.py"