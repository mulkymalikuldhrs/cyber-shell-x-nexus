#!/bin/bash

# CyberShellX Nexus - Interactive Launcher
# Author: Mulky Malikul Dhaher

clear
echo "🛡️  CyberShellX Nexus - Interactive Launcher"
echo "=============================================="
echo ""
echo "Select the component you want to run:"
echo ""
echo "1) CLI Terminal Interface (Command Line)"
echo "2) Web Server (Browser Interface)"
echo "3) Android GUI (Mobile Application)"
echo "4) Update System (Pull latest changes)"
echo "5) All Components (Full System)" 
echo "6) Exit"
echo ""
read -p "Enter your choice (1-5): " choice

case $choice in
    1)
        echo ""
        echo "🖥️  Starting CLI Terminal Interface..."
        echo "──────────────────────────────────────"
        echo ""
        echo "Enhanced Cybersecurity Shell with AI Integration"
        echo "Type 'help' for commands | 'status' for AI status | 'exit' to quit"
        echo ""
        
        # Check if cli-interface.js exists
        if [ -f "cli-interface.js" ]; then
            node cli-interface.js
        else
            echo "❌ CLI interface not found!"
            echo "Please ensure cli-interface.js exists in the current directory"
            echo ""
            read -p "Press Enter to continue..."
        fi
        ;;
        
    2)
        echo ""
        echo "🌐 Starting Web Server (Offline Mode)..."
        echo "───────────────────────────────────────"
        echo ""
        echo "Termux-compatible web interface"
        echo "Perfect for offline usage without native dependencies"
        echo ""
        echo "Server starting on port 5000..."
        echo "Access at: http://localhost:5000"
        echo "Press Ctrl+C to stop"
        echo ""
        if [ -f "server/index.js" ]; then
            echo "🚀 Starting offline server..."
            node server/index.js
        else
            echo "⚠️ Offline server not found. Setting up..."
            ./termux-offline-setup.sh
            if [ -f "server/index.js" ]; then
                node server/index.js
            else
                echo "Using basic fallback server..."
                node -e "
const http = require('http');
const server = http.createServer((req, res) => {
  if (req.url === '/') {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end(\`
<!DOCTYPE html>
<html><head><title>CyberShellX Offline</title>
<style>body{font-family:monospace;background:#000;color:#0f0;padding:20px}</style>
</head><body>
<h1>🛡️ CyberShellX Nexus - Offline Mode</h1>
<p>✅ Server running successfully</p>
<p>💻 CLI Interface: <code>node cli-interface.js</code></p>
<p>🌐 This is a basic fallback server</p>
<p>🔧 Run <code>./termux-offline-setup.sh</code> for full interface</p>
</body></html>
\`);
  } else if (req.url === '/api/status') {
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.end(JSON.stringify({status:'offline',mode:'fallback',timestamp:new Date()}));
  } else {
    res.writeHead(404);
    res.end('Not Found');
  }
});
server.listen(5000, () => console.log('🌐 Fallback server running on http://localhost:5000'));
"
            fi
        fi
        ;;
        
    3)
        echo ""
        echo "📱 Android GUI Application"
        echo "─────────────────────────────"
        echo ""
        
        if [ -d "android-assistant" ]; then
            echo "🔧 Building Android APK..."
            cd android-assistant
            
            if [ -f "build-apk.sh" ]; then
                chmod +x build-apk.sh
                echo "Building CyberShellX Android Assistant..."
                ./build-apk.sh
                
                if [ -f "app/build/outputs/apk/debug/app-debug.apk" ]; then
                    echo ""
                    echo "✅ APK built successfully!"
                    echo "📱 Install: app/build/outputs/apk/debug/app-debug.apk"
                    echo ""
                    echo "🎤 Voice Commands Available:"
                    echo "• 'Hey CyberShell' - Wake word activation"
                    echo "• Security tool commands"
                    echo "• System control (WiFi, Bluetooth, etc.)"
                    echo ""
                    
                    read -p "Install APK now? (y/n): " install_choice
                    if [[ $install_choice =~ ^[Yy]$ ]]; then
                        if [ -f "install-apk.sh" ]; then
                            chmod +x install-apk.sh
                            ./install-apk.sh
                        else
                            echo "Installing APK..."
                            adb install app/build/outputs/apk/debug/app-debug.apk
                        fi
                    fi
                else
                    echo "❌ Build failed. Check android-assistant directory."
                fi
            else
                echo "❌ Build script not found. Check android-assistant setup."
            fi
            cd ..
        else
            echo "❌ Android project not found."
            echo "📁 Expected directory: android-assistant"
            echo "🔗 Clone full repository to access Android GUI"
        fi
        ;;
        
    4)
        echo ""
        echo "🤖 Starting Android Server (Voice Assistant)..."
        echo "──────────────────────────────────────────────"
        echo ""
        echo "Backend server for Android voice assistant app"
        echo "Provides API endpoints for mobile app communication"
        echo ""
        
        # Check if Android directory exists
        if [ -d "android-assistant" ]; then
            echo "✅ Android components found"
            echo ""
            echo "Starting server for Android app..."
            echo "Server will run on port 5000"
            echo "Android app can connect to this server"
            echo ""
            echo "To build Android APK:"
            echo "  ./android-assistant/build-apk.sh"
            echo "To install APK:"
            echo "  ./android-assistant/install-apk.sh"
            echo ""
            echo "Press Ctrl+C to stop server"
            echo ""
            ANDROID_MODE=true npm run dev
        else
            echo "❌ Android components not found!"
            echo "Please clone the full repository to access Android features"
            echo ""
            read -p "Press Enter to continue..."
        fi
        ;;
        
    5)
        echo ""
        echo "🚀 Starting All Components..."
        echo "────────────────────────────────"
        echo ""
        
        # Start PostgreSQL if available
        if command -v pg_ctl >/dev/null 2>&1; then
            echo "🗄️  Starting PostgreSQL..."
            pg_ctl -D $PREFIX/var/lib/postgresql start >/dev/null 2>&1 || true
            sleep 2
        fi
        
        # Set environment
        export DATABASE_URL="postgresql://$(whoami)@localhost:5432/cybershellx"
        
        echo "🌐 Starting Web Server in background..."
        npm run dev &
        WEB_PID=$!
        
        echo "📱 Building Android APK..."
        if [ -d "android-assistant" ]; then
            cd android-assistant && ./build-apk.sh && cd ..
        fi
        
        echo ""
        echo "✅ All components started!"
        echo "🌐 Web Interface: http://localhost:5000"
        echo "📱 Android APK: android-assistant/app/build/outputs/apk/debug/"
        echo "🖥️  CLI: Run this script again and choose option 1"
        echo ""
        echo "Press Enter to stop all services..."
        read
        
        echo "🛑 Stopping services..."
        kill $WEB_PID 2>/dev/null || true
        ;;
        
    6)
        echo ""
        echo "👋 Exiting CyberShellX Nexus Launcher"
        echo "Thank you for using CyberShellX!"
        exit 0
        ;;
        
    *)
        echo ""
        echo "❌ Invalid choice. Please select 1-6."
        echo "Press Enter to continue..."
        read
        exec "$0"
        ;;
esac

echo ""
echo "🔄 Returning to main menu..."
sleep 2
exec "$0"