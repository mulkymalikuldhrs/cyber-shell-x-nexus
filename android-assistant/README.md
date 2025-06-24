# CyberShellX Android Voice Assistant

A native Android voice assistant that replaces Google Assistant/Siri with CyberShellX functionality.

**Created by:** Mulky Malikul Dhaher

## Features
- **Wake Word Detection**: Say "Hey CyberShell" to activate
- **Always Listening**: Background service for continuous voice recognition
- **Voice Commands**: Execute CyberShellX commands via speech
- **Text-to-Speech**: Spoken responses from the assistant
- **Dark Theme**: Cyberpunk-styled UI matching CyberShellX
- **Background Service**: Works even when app is minimized

## Installation

### Build from Source
1. Open Android Studio
2. Import this project
3. Build and run on your Android device

### APK Installation
1. Enable "Unknown Sources" in Android settings
2. Install the generated APK file
3. Grant microphone permissions

## Setup
1. Ensure your CyberShellX Python server is running on port 8765
2. Connect your Android device to the same network
3. Update the WebSocket URL in the code if needed
4. Launch the app and grant permissions

## Usage

### Manual Activation
- Tap "Tap to Speak" button
- Speak your command
- Wait for response

### Always Listening Mode
- Tap "Start Always Listening"
- Say "Hey CyberShell" followed by your command
- The assistant will respond and continue listening

### Voice Commands
- "Hey CyberShell, install metasploit"
- "Hey CyberShell, scan network"
- "Hey CyberShell, check system status"
- Any command supported by your CyberShellX server

## Replacing Default Assistant

### Set as Default Assistant
1. Go to Android Settings → Apps → Default Apps
2. Select "Digital assistant app"
3. Choose "CyberShellX Assistant"

### Voice Action Integration
The app registers for voice intents and can be triggered by:
- Long-pressing home button
- "OK Google" replacement
- Voice command shortcuts

## Configuration

### Server Connection
Edit `MainActivity.kt` or `CyberShellXService.kt`:
```kotlin
// Change localhost to your server IP
val request = Request.Builder()
    .url("ws://YOUR_SERVER_IP:8765")
```

### Wake Word Customization
Modify the wake word detection in `processSpeechResult()`:
```kotlin
if (lowerText.contains("your_custom_wake_word")) {
    // Activation logic
}
```

## Permissions Required
- `RECORD_AUDIO`: Voice recognition
- `INTERNET`: Server communication
- `FOREGROUND_SERVICE`: Background operation
- `WAKE_LOCK`: Keep device responsive

## Architecture
- **MainActivity**: Main UI and manual voice interaction
- **CyberShellXService**: Background service for always-listening mode
- **WebSocket Client**: Real-time communication with CyberShellX server
- **Speech Recognition**: Android native speech-to-text
- **Text-to-Speech**: Android native voice synthesis

## Troubleshooting

### Connection Issues
- Ensure CyberShellX server is running
- Check network connectivity
- Verify WebSocket URL and port

### Voice Recognition Issues
- Check microphone permissions
- Ensure quiet environment
- Restart the service if needed

### Battery Optimization
- Disable battery optimization for the app
- Add to whitelist for background operation

## Customization
- Modify UI colors in `MainActivity.kt`
- Add custom voice commands in command processing
- Integrate with additional CyberShellX features
- Customize wake word sensitivity