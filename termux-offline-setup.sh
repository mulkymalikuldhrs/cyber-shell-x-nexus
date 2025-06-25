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
cat > package.json.tmp << 'EOF'
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
    "node-fetch": "^3.3.2",
    "fs": "^0.0.1-security",
    "path": "^0.12.7"
  },
  "engines": {
    "node": ">=16.0.0"
  }
}
EOF

cp package.json.tmp package.json
rm package.json.tmp

echo "✅ Package.json updated for offline mode"

# Create simplified server/index.js for offline mode
echo "🔧 Creating offline server..."

mkdir -p server

cat > server/index.js << 'EOF'
// CyberShellX Offline Server
import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

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
EOF

echo "✅ Offline server created"

# Create basic HTML client
echo "🔧 Creating basic web interface..."

mkdir -p client/dist

cat > client/dist/index.html << 'EOF'
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CyberShellX Nexus - Offline Mode</title>
    <style>
        body {
            font-family: 'Courier New', monospace;
            background: #0d1117;
            color: #c9d1d9;
            margin: 0;
            padding: 20px;
            line-height: 1.6;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
            background: #161b22;
            border: 1px solid #30363d;
            border-radius: 8px;
            padding: 20px;
        }
        .header {
            text-align: center;
            border-bottom: 1px solid #30363d;
            padding-bottom: 20px;
            margin-bottom: 20px;
        }
        .title {
            color: #58a6ff;
            font-size: 2em;
            margin: 0;
        }
        .subtitle {
            color: #7d8590;
            margin: 10px 0;
        }
        .section {
            margin: 20px 0;
            padding: 15px;
            border: 1px solid #30363d;
            border-radius: 6px;
        }
        .command {
            background: #0d1117;
            border: 1px solid #30363d;
            border-radius: 4px;
            padding: 10px;
            font-family: 'Courier New', monospace;
            color: #7ee787;
            margin: 10px 0;
        }
        .warning {
            background: #fffbf0;
            border: 1px solid #d1a646;
            color: #9a6700;
            border-radius: 4px;
            padding: 10px;
            margin: 10px 0;
        }
        .success {
            background: #dcffd6;
            border: 1px solid #28a745;
            color: #1b5e20;
            border-radius: 4px;
            padding: 10px;
            margin: 10px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1 class="title">🛡️ CyberShellX Nexus</h1>
            <p class="subtitle">Offline Mode - Termux Compatible</p>
        </div>

        <div class="section">
            <h3>🚀 Quick Start</h3>
            <p>CyberShellX is running in offline mode. Use the CLI interface for full functionality:</p>
            <div class="command">node cli-interface.js</div>
        </div>

        <div class="section">
            <h3>📱 Available Commands</h3>
            <div class="command">./launcher.sh cli    # Start CLI interface</div>
            <div class="command">./launcher.sh status # System health check</div>
            <div class="command">npm run offline     # Direct CLI access</div>
            <div class="command">npm run dev         # Start web server</div>
        </div>

        <div class="section">
            <h3>🤖 AI Features (Offline Mode)</h3>
            <div class="warning">
                AI providers are not available in offline mode. The CLI interface provides:
                <ul>
                    <li>Command simulations</li>
                    <li>Educational cybersecurity tools</li>
                    <li>System information</li>
                    <li>Basic terminal operations</li>
                </ul>
            </div>
        </div>

        <div class="section">
            <h3>🌐 Enable Online Mode</h3>
            <p>To enable AI features, configure API keys and restart:</p>
            <div class="command">export GROQ_API_KEY="your_key_here"</div>
            <div class="command">export OPENROUTER_API_KEY="your_key_here"</div>
            <div class="command">npm run dev-ts</div>
        </div>

        <div class="section">
            <h3>📞 Status</h3>
            <div id="status" class="success">
                ✅ Offline mode active<br>
                📱 Termux compatible<br>
                💻 CLI interface ready
            </div>
        </div>
    </div>

    <script>
        // Simple status check
        fetch('/api/status')
            .then(r => r.json())
            .then(data => {
                document.getElementById('status').innerHTML = 
                    `✅ Status: ${data.status}<br>` +
                    `📱 Mode: ${data.mode}<br>` +
                    `⏰ Time: ${new Date(data.timestamp).toLocaleString()}`;
            })
            .catch(e => {
                document.getElementById('status').innerHTML = 
                    `❌ Server not responding<br>` +
                    `💡 Try: npm run dev`;
            });
    </script>
</body>
</html>
EOF

echo "✅ Basic web interface created"

# Make scripts executable
echo "🔧 Setting permissions..."
chmod +x launcher.sh 2>/dev/null || true
chmod +x run.sh 2>/dev/null || true
chmod +x start.sh 2>/dev/null || true
chmod +x termux-offline-setup.sh 2>/dev/null || true

echo "✅ Permissions set"

# Install minimal dependencies
echo "📦 Installing minimal dependencies..."
npm install express ws node-fetch --save

echo ""
echo "🎉 CyberShellX Offline Setup Complete!"
echo ""
echo "🚀 Start Commands:"
echo "   node cli-interface.js        # Direct CLI (recommended)"
echo "   ./launcher.sh cli           # CLI via launcher"
echo "   npm run offline             # Same as CLI"
echo "   npm run dev                 # Web server (offline mode)"
echo ""
echo "💡 For full AI features, add API keys and use:"
echo "   npm run dev-ts              # Full TypeScript server"
echo ""
echo "🛡️  Ready to use in Termux!"
