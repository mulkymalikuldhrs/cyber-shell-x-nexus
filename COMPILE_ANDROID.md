# Kompilasi Aplikasi Android CyberShellX

## Cara Tercepat (Termux)

### 1. Install Android Studio di PC/Laptop
```bash
# Download dari: https://developer.android.com/studio
# Install JDK 11+ juga
```

### 2. Kompilasi APK
```bash
# Di folder android-assistant
cd android-assistant

# Build otomatis
./build-apk.sh

# Manual build
./gradlew assembleDebug
```

### 3. Install ke Android
```bash
# Otomatis via ADB
./install-apk.sh

# Manual: transfer APK ke HP dan install
# File location: app/build/outputs/apk/debug/app-debug.apk
```

## Tanpa Android Studio (Termux)

### 1. Install Tools di Termux
```bash
# Update Termux
pkg update && pkg upgrade

# Install tools
pkg install openjdk-17 gradle android-tools

# Set JAVA_HOME
export JAVA_HOME=$PREFIX/opt/openjdk
```

### 2. Download Android SDK
```bash
# Download command line tools
wget https://dl.google.com/android/repository/commandlinetools-linux-9477386_latest.zip

# Extract
unzip commandlinetools-linux-9477386_latest.zip

# Setup SDK
export ANDROID_HOME=$HOME/android-sdk
mkdir -p $ANDROID_HOME/cmdline-tools
mv cmdline-tools $ANDROID_HOME/cmdline-tools/latest

# Add to PATH
export PATH=$PATH:$ANDROID_HOME/cmdline-tools/latest/bin:$ANDROID_HOME/platform-tools
```

### 3. Install SDK Components
```bash
# Accept licenses
yes | sdkmanager --licenses

# Install required components
sdkmanager "platform-tools" "platforms;android-34" "build-tools;34.0.0"
```

### 4. Build APK di Termux
```bash
cd android-assistant

# Make executable
chmod +x gradlew

# Build
./gradlew assembleDebug
```

## Struktur File APK
```
android-assistant/
├── app/build/outputs/apk/debug/
│   └── app-debug.apk          # File APK yang siap install
├── build-apk.sh               # Script build otomatis
├── install-apk.sh             # Script install otomatis
└── BUILD_INSTRUCTIONS.md      # Panduan lengkap
```

## Fitur Aplikasi
- **Wake Word**: "Hey CyberShell"
- **Always Listening**: Background service
- **Voice Commands**: Semua perintah CyberShellX
- **Text-to-Speech**: Respon suara
- **Dark Theme**: UI cyberpunk
- **WebSocket**: Koneksi ke server CyberShellX

## Konfigurasi
Edit `MainActivity.kt` line 200+ untuk server URL:
```kotlin
.url("ws://IP_SERVER_ANDA:8765")
```

## Testing
1. Install APK ke Android
2. Buka aplikasi
3. Grant permission microphone
4. Start CyberShellX server di Termux
5. Test dengan "Hey CyberShell, check system"

## Troubleshooting

### Build Error
```bash
# Clean project
./gradlew clean

# Check Java version
java -version

# Update Gradle wrapper
./gradlew wrapper --gradle-version 8.0
```

### Permission Error
```bash
# Fix gradlew permissions
chmod +x gradlew

# Fix Android SDK permissions
chmod -R 755 $ANDROID_HOME
```

### Connection Error
- Pastikan server CyberShellX running
- Cek IP address di kode aplikasi
- Test koneksi: `telnet IP_SERVER 8765`

## Output
APK siap install: `app/build/outputs/apk/debug/app-debug.apk`