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
read -p "Enter your choice (1-6): " choice

case $choice in
    1)
        echo ""
        echo "🖥️  Starting CLI Terminal Interface..."
        echo "────────────────────────────────────────"
        echo ""
        
        echo "Starting CyberShellX CLI Interface..."
        echo ""
        
        if [ -f "cli-interface.js" ]; then
            node cli-interface.js
        else
            echo "CLI interface not found. Starting basic simulation..."
            echo ""
            echo "CyberShellX Terminal Simulator"
            echo "Commands: nmap, metasploit, wireshark, sqlmap, exit"
            echo ""
            while true; do
                read -p "cybershell@nexus:~$ " cmd
                case $cmd in
                    "exit") break ;;
                    "nmap") echo "Nmap scan simulation: Found open ports 22, 80, 443" ;;
                    "metasploit") echo "Metasploit Framework loaded" ;;
                    "wireshark") echo "Packet capture started" ;;
                    "sqlmap") echo "SQL injection testing initiated" ;;
                    *) echo "Command '$cmd' simulated" ;;
                esac
            done
        fi
        ;;
        
    2)
        echo ""
        echo "🌐 Starting Web Server..."
        echo "────────────────────────────"
        echo ""
        
        # Check if PostgreSQL is needed and running
        if command -v pg_ctl >/dev/null 2>&1; then
            echo "🗄️  Checking PostgreSQL status..."
            if ! pg_ctl status -D $PREFIX/var/lib/postgresql >/dev/null 2>&1; then
                echo "Starting PostgreSQL..."
                pg_ctl -D $PREFIX/var/lib/postgresql start
                sleep 2
            fi
        fi
        
        # Set database URL if not set
        if [ -z "$DATABASE_URL" ]; then
            export DATABASE_URL="postgresql://$(whoami)@localhost:5432/cybershellx"
        fi
        
        echo "🚀 Starting CyberShellX Web Interface..."
        echo "📱 Access at: http://localhost:5000"
        echo "🛑 Press Ctrl+C to stop the server"
        echo ""
        
        npm run dev
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
        echo "🔄 Updating System..."
        echo "────────────────────────"
        echo ""
        
        # Check if git is available
        if command -v git >/dev/null 2>&1; then
            echo "📡 Pulling latest changes from repository..."
            git pull origin main 2>/dev/null || git pull 2>/dev/null || {
                echo "⚠️  Git pull failed or not in a git repository"
                echo "Manual update may be required"
            }
            
            echo "📦 Updating dependencies..."
            npm install
            
            echo "🗄️  Updating database schema..."
            npm run db:push
            
            echo ""
            echo "✅ System updated successfully!"
            echo "🔄 Restart the launcher to use updated features"
        else
            echo "❌ Git not available. Update manually by:"
            echo "   1. Download latest code from GitHub"
            echo "   2. Replace files in current directory" 
            echo "   3. Run: npm install && npm run db:push"
        fi
        
        echo ""
        read -p "Press Enter to continue..."
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