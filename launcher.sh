#!/bin/bash

# CyberShellX Nexus - Main Launcher
# Official launcher for all CyberShellX components
# Repository: https://github.com/mulkymalikuldhrs/cyber-shell-x-nexus

clear
echo "🛡️  CyberShellX Nexus"
echo "===================="
echo "Advanced Cybersecurity Platform"
echo ""

# Quick help
if [[ "$1" == "--help" || "$1" == "-h" ]]; then
    echo "Usage:"
    echo "  ./launcher.sh          - Interactive menu"
    echo "  ./launcher.sh cli      - CLI interface"
    echo "  ./launcher.sh web      - Web server"
    echo "  ./launcher.sh android  - Android server"
    echo "  ./launcher.sh update   - Update system"
    echo "  ./launcher.sh status   - Health check"
    echo ""
    exit 0
fi

# Direct command execution
case "$1" in
    "cli")
        echo "🖥️  Starting CLI Interface..."
        exec node cli-interface.js
        ;;
    "web")
        echo "🌐 Starting Web Server..."
        echo "Access at: http://localhost:5000"
        exec npm run dev
        ;;
    "android")
        echo "📱 Starting Android Server..."
        exec env ANDROID_MODE=true npm run dev
        ;;
    "update")
        echo "🔄 Updating system..."
        if [ -f "update-system.sh" ]; then
            chmod +x update-system.sh
            exec ./update-system.sh
        else
            echo "Update script not found. Using fallback..."
            git pull origin main && npm install && npm run db:push
        fi
        ;;
    "status")
        echo "🔍 System Health Check..."
        exec node scripts/health-check.js
        ;;
esac

# Interactive menu
echo "Select component to run:"
echo ""
echo "1) CLI Terminal Interface (Enhanced Cybersecurity Shell)"
echo "2) Web Server (Desktop/Laptop Browser Interface)"  
echo "3) Termux Server (Mobile Web Interface)"
echo "4) Android Server (Voice Assistant Backend)"
echo "5) Update System (Pull latest changes)"
echo "6) System Status (Health Check)"
echo "0) Exit"
echo ""

while true; do
    read -p "Enter your choice (0-6): " choice
    
    case $choice in
        1)
            echo ""
            echo "🖥️  Starting CLI Terminal Interface..."
            echo "Enhanced Cybersecurity Shell with AI Integration"
            echo ""
            if [ -f "cli-interface.js" ]; then
                node cli-interface.js
            else
                echo "CLI interface not found!"
            fi
            break
            ;;
        2)
            echo ""
            echo "🌐 Starting Web Server (Desktop/Laptop)..."
            echo "Access at: http://localhost:5000"
            echo "Press Ctrl+C to stop"
            echo ""
            npm run dev
            break
            ;;
        3)
            echo ""
            echo "📱 Starting Termux Server (Mobile Web)..."
            echo "Mobile-optimized interface"
            echo "Access at: http://localhost:5000"
            echo ""
            MOBILE_MODE=true npm run dev
            break
            ;;
        4)
            echo ""
            echo "🤖 Starting Android Server (Voice Assistant)..."
            echo "Backend for Android voice assistant app"
            echo ""
            ANDROID_MODE=true npm run dev
            break
            ;;
        5)
            echo ""
            echo "🔄 Update System..."
            if [ -f "update-system.sh" ]; then
                chmod +x update-system.sh
                ./update-system.sh
            else
                echo "Updating from repository..."
                git pull origin main && npm install && npm run db:push
            fi
            echo ""
            read -p "Press Enter to continue..."
            ;;
        6)
            echo ""
            echo "🔍 System Health Check..."
            node scripts/health-check.js
            echo ""
            read -p "Press Enter to continue..."
            ;;
        0)
            echo ""
            echo "Goodbye! Stay secure!"
            exit 0
            ;;
        *)
            echo "Invalid choice. Please select 0-6."
            ;;
    esac
done