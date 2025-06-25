
#!/bin/bash

# CyberShellX Nexus - Starter Script
# Memastikan semua dependencies dan skrip tersedia

echo "🛡️  CyberShellX Nexus - Starting System"
echo "======================================"

# Periksa apakah Node.js tersedia
if ! command -v node >/dev/null 2>&1; then
    echo "❌ Node.js tidak ditemukan. Silakan install Node.js terlebih dahulu."
    exit 1
fi

# Periksa apakah npm tersedia
if ! command -v npm >/dev/null 2>&1; then
    echo "❌ npm tidak ditemukan. Silakan install npm terlebih dahulu."
    exit 1
fi

echo "✅ Node.js dan npm tersedia"

# Perbaiki konfigurasi build jika diperlukan
echo "🔧 Memeriksa konfigurasi build..."
if [ -f "scripts/fix-build.js" ]; then
    node scripts/fix-build.js
else
    echo "⚠️  Script perbaikan tidak ditemukan, melanjutkan..."
fi

# Install dependencies jika diperlukan
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Jalankan launcher utama
echo "🚀 Menjalankan CyberShellX Launcher..."
if [ -f "launcher.sh" ]; then
    chmod +x launcher.sh
    ./launcher.sh "$@"
else
    echo "❌ launcher.sh tidak ditemukan!"
    echo "Menjalankan web server langsung..."
    npm run dev
fi
