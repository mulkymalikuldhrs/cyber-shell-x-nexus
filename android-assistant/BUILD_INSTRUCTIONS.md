# CyberShellX Android Assistant - Build Instructions

## Prerequisites
- Android Studio Arctic Fox (2020.3.1) or newer
- Android SDK 34
- JDK 11 or newer
- Minimum device API level 24 (Android 7.0)

## Setup Steps

### 1. Install Android Studio
Download from: https://developer.android.com/studio

### 2. Open Project
1. Launch Android Studio
2. Select "Open an existing project"
3. Navigate to the `android-assistant` folder
4. Click "OK"

### 3. Sync Project
Android Studio will automatically sync the project. If not:
1. Click "File" → "Sync Project with Gradle Files"
2. Wait for sync to complete

### 4. Configure SDK
1. Go to "File" → "Project Structure"
2. Select "SDK Location"
3. Ensure Android SDK is installed
4. Install SDK 34 if not available

### 5. Build APK
```bash
# Debug build (for testing)
./gradlew assembleDebug

# Release build (for distribution)
./gradlew assembleRelease
```

### 6. Install on Device
```bash
# Install debug APK
adb install app/build/outputs/apk/debug/app-debug.apk

# Or use Android Studio's "Run" button
```

## Build Commands

### Using Android Studio
1. Select "Build" → "Build Bundle(s) / APK(s)" → "Build APK(s)"
2. APK will be generated in `app/build/outputs/apk/`

### Using Command Line
```bash
# Navigate to android-assistant folder
cd android-assistant

# Make gradlew executable (Linux/Mac)
chmod +x gradlew

# Build debug APK
./gradlew assembleDebug

# Build release APK (requires signing)
./gradlew assembleRelease
```

## APK Locations
- Debug: `app/build/outputs/apk/debug/app-debug.apk`
- Release: `app/build/outputs/apk/release/app-release.apk`

## Installation on Android Device

### Method 1: ADB (Developer Mode)
1. Enable Developer Options on your device
2. Enable USB Debugging
3. Connect device via USB
4. Run: `adb install app-debug.apk`

### Method 2: Direct Install
1. Transfer APK to your device
2. Open file manager
3. Tap on APK file
4. Allow installation from unknown sources
5. Follow installation prompts

## Configuration

### Server Connection
Edit `MainActivity.kt` line 200+ to change server URL:
```kotlin
.url("ws://YOUR_SERVER_IP:8765") // Change to your CyberShellX server
```

### Wake Word
Edit `processSpeechResult()` in `MainActivity.kt`:
```kotlin
if (lowerText.contains("your_wake_word")) {
    // Custom wake word
}
```

## Troubleshooting

### Build Errors
1. Clean project: "Build" → "Clean Project"
2. Rebuild: "Build" → "Rebuild Project"
3. Check SDK versions in `build.gradle.kts`

### Permission Issues
Ensure these permissions are in `AndroidManifest.xml`:
- `RECORD_AUDIO`
- `INTERNET`
- `FOREGROUND_SERVICE`

### Connection Issues
1. Verify CyberShellX server is running
2. Check device is on same network
3. Test server URL in browser: `http://YOUR_IP:8765`

## Signing for Release

### Generate Keystore
```bash
keytool -genkey -v -keystore cybershellx.keystore -alias cybershellx -keyalg RSA -keysize 2048 -validity 10000
```

### Configure Signing
Add to `app/build.gradle.kts`:
```kotlin
android {
    signingConfigs {
        release {
            storeFile file("cybershellx.keystore")
            storePassword "your_password"
            keyAlias "cybershellx"
            keyPassword "your_password"
        }
    }
    buildTypes {
        release {
            signingConfig signingConfigs.release
        }
    }
}
```

## Features Included
- Voice recognition with wake word detection
- Background service for always-listening mode
- WebSocket connection to CyberShellX server
- Text-to-speech responses
- Material Design 3 UI
- Notification for background operation

## File Structure
```
android-assistant/
├── app/
│   ├── src/main/
│   │   ├── java/com/cybershellx/assistant/
│   │   │   ├── MainActivity.kt
│   │   │   └── CyberShellXService.kt
│   │   ├── res/
│   │   └── AndroidManifest.xml
│   └── build.gradle.kts
├── gradle/
├── build.gradle.kts
└── settings.gradle.kts
```

## Next Steps
1. Build and install the APK
2. Grant microphone permissions
3. Set as default assistant (optional)
4. Start your CyberShellX server
5. Test with "Hey CyberShell" commands