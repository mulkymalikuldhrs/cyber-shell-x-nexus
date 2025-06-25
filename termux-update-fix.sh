#!/bin/bash

# CyberShellX Termux Update Fix
# Fixes issues after git update that breaks Termux compatibility

echo "🛠️  CyberShellX Termux Update Fix"
echo "================================="
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ] || [ ! -f "cli-interface.js" ]; then
    echo "❌ Please run this from the CyberShellX directory"
    exit 1
fi

echo "📁 Working directory: $(pwd)"
echo ""

# Backup current state
echo "💾 Creating backup..."
cp package.json package.json.backup 2>/dev/null || true
cp scripts/fix-build.js scripts/fix-build.js.backup 2>/dev/null || true

# Fix the shebang issue in fix-build.js
echo "🔧 Fixing script compatibility issues..."
if [ -f "scripts/fix-build.js" ]; then
    # Remove shebang if it exists and fix imports
    cat > scripts/fix-build.js << 'EOF'
// Fix build script untuk CyberShellX
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔧 Memperbaiki konfigurasi build CyberShellX...');

// Baca package.json
const packageJsonPath = path.join(process.cwd(), 'package.json');
let packageJson;

try {
  packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
} catch (error) {
  console.error('❌ Tidak dapat membaca package.json:', error.message);
  process.exit(1);
}

// Tambahkan script build:dev jika belum ada
if (!packageJson.scripts['build:dev']) {
  packageJson.scripts['build:dev'] = 'echo "Build not needed for offline mode"';
  console.log('✅ Menambahkan script build:dev (offline mode)');
}

// Script untuk offline mode
const offlineScripts = {
  'dev': 'node server/index.js',
  'offline': 'node cli-interface.js',
  'cli': 'node cli-interface.js',
  'start': 'node server/index.js',
  'build': 'echo "Build not needed for offline mode"',
  'build:dev': 'echo "Build not needed for offline mode"'
};

Object.entries(offlineScripts).forEach(([key, value]) => {
  packageJson.scripts[key] = value;
  console.log(`✅ Updated script ${key} for offline mode`);
});

// Tulis kembali package.json
try {
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
  console.log('✅ package.json berhasil diperbarui untuk offline mode');
} catch (error) {
  console.error('❌ Gagal menulis package.json:', error.message);
  process.exit(1);
}

console.log('🚀 Konfigurasi offline mode selesai diperbaiki!');
EOF
    echo "✅ Fixed scripts/fix-build.js"
fi

# Run the offline setup to fix everything
echo "🔄 Running offline setup to fix all issues..."
if [ -f "termux-offline-setup.sh" ]; then
    chmod +x termux-offline-setup.sh
    ./termux-offline-setup.sh
else
    echo "❌ termux-offline-setup.sh not found. Creating it..."
    
    # Download or recreate the setup script
    cat > termux-offline-setup.sh << 'EOF'
#!/bin/bash

# CyberShellX Termux Offline Setup
# Simplified setup untuk Termux tanpa database

echo "🛡️  CyberShellX Nexus - Termux Offline Setup"
echo "============================================="
echo ""

# Set working directory (check multiple possible locations)
if [ -f "package.json" ] && [ -f "cli-interface.js" ]; then
    echo "✅ Already in CyberShellX directory"
elif [ -d "cyber-shell-x-nexus" ]; then
    cd cyber-shell-x-nexus
    echo "✅ Found cyber-shell-x-nexus directory"
elif [ -d "~/cyber-shell-x-nexus" ]; then
    cd ~/cyber-shell-x-nexus
    echo "✅ Found ~/cyber-shell-x-nexus directory"
else
    echo "❌ CyberShellX directory tidak ditemukan"
    echo "Pastikan Anda berada di directory yang benar atau clone repository:"
    echo "git clone https://github.com/mulkymalikuldhrs/cyber-shell-x-nexus.git"
    exit 1
fi

echo "📁 Working directory: $(pwd)"
echo ""

# Update package.json untuk offline mode
echo "🔧 Configuring offline mode..."

# Fix package.json scripts untuk Termux
cat > package.json.tmp << 'PACKAGE_EOF'
{
  "name": "cybershellx-nexus",
  "version": "1.0.0",
  "type": "module",
  "license": "MIT",
  "scripts": {
    "dev": "node server/index.js",
    "dev-ts": "npx tsx server/index.ts",
    "build": "echo 'Build not needed for offline mode'",
    "build:dev": "echo 'Build not needed for offline mode'",
    "start": "node server/index.js",
    "offline": "node cli-interface.js",
    "cli": "node cli-interface.js",
    "health": "node scripts/health-check.js"
  },
  "dependencies": {
    "express": "^4.21.2",
    "ws": "^8.18.0",
    "node-fetch": "^3.3.2"
  },
  "engines": {
    "node": ">=16.0.0"
  }
}
PACKAGE_EOF

cp package.json.tmp package.json
rm package.json.tmp

echo "✅ Package.json updated for offline mode"

# Create simplified server/index.js for offline mode
echo "🔧 Creating offline server..."

mkdir -p server

cat > server/index.js << 'SERVER_EOF'
// CyberShellX Offline Server
import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(express.static(join(__dirname, '../client/dist')));

// Offline API endpoints
app.get('/api/status', (req, res) => {
  res.json({
    status: 'offline',
    mode: 'termux',
    timestamp: new Date().toISOString(),
    message: 'CyberShellX running in offline mode'
  });
});

app.get('/api/ai/status', (req, res) => {
  res.json({
    status: 'offline',
    providers: ['local'],
    message: 'AI providers not available in offline mode'
  });
});

app.post('/api/ai/generate', (req, res) => {
  const { prompt } = req.body;
  res.json({
    success: false,
    message: 'AI generation not available in offline mode. Use CLI interface for offline commands.',
    suggestion: 'Run: node cli-interface.js'
  });
});

app.get('*', (req, res) => {
  res.sendFile(join(__dirname, '../client/dist/index.html'));
});

app.listen(PORT, () => {
  console.log(`🛡️  CyberShellX Offline Server running on port ${PORT}`);
  console.log(`📱 Termux Web Interface: http://localhost:${PORT}`);
  console.log(`💻 CLI Interface: node cli-interface.js`);
});
SERVER_EOF

echo "✅ Offline server created"

# Install minimal dependencies
echo "📦 Installing minimal dependencies..."
npm install express ws node-fetch --save --no-optional

echo ""
echo "🎉 CyberShellX Offline Setup Complete!"
echo ""
echo "🚀 Start Commands:"
echo "   node cli-interface.js        # Direct CLI (recommended)"
echo "   ./launcher.sh cli           # CLI via launcher"
echo "   npm run offline             # Same as CLI"
echo "   npm run dev                 # Web server (offline mode)"
echo ""
echo "🛡️  Ready to use in Termux!"
EOF

    chmod +x termux-offline-setup.sh
    ./termux-offline-setup.sh
fi

echo ""
echo "🎉 Termux Update Fix Complete!"
echo ""
echo "✅ Fixed Issues:"
echo "   - SyntaxError in fix-build.js"
echo "   - Native binding compilation errors"
echo "   - Package.json scripts for offline mode"
echo "   - Termux compatibility issues"
echo ""
echo "🚀 Ready Commands:"
echo "   node cli-interface.js        # Start CLI (works perfectly)"
echo "   npm run dev                  # Start web server"
echo "   npm run offline             # Same as CLI"
echo ""
echo "💡 Tip: Setelah update dari GitHub, selalu jalankan:"
echo "   ./termux-update-fix.sh"
echo ""
echo "🛡️  CyberShellX siap digunakan di Termux!"
