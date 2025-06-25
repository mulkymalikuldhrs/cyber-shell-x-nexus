#!/bin/bash

# CyberShellX Nexus - Direct Commands
# Quick access to all CyberShellX features

case "$1" in
    "cli"|"1")
        echo "🖥️  Starting CLI Interface..."
        node cli-interface.js
        ;;
    "web"|"2")
        echo "🌐 Starting Web Server..."
        echo "Access at: http://localhost:5000"
        npm run dev
        ;;
    "android"|"3")
        echo "📱 Android Server..."
        ANDROID_MODE=true npm run dev
        ;;
    "update"|"4")
        echo "🔄 Updating system..."
        if [ -f "update-system.sh" ]; then
            chmod +x update-system.sh
            ./update-system.sh
        else
            git pull origin main && npm install && npm run db:push
        fi
        ;;
    "status"|"check")
        echo "🔍 System Health Check..."
        node scripts/health-check.js
        ;;
    "launcher"|"menu"|"")
        echo "🚀 Starting Interactive Launcher..."
        chmod +x run.sh
        ./run.sh
        ;;
    *)
        echo "🛡️  CyberShellX Nexus - Usage:"
        echo ""
        echo "Commands:"
        echo "  ./cyber.sh cli      - Start CLI interface"
        echo "  ./cyber.sh web      - Start web server"
        echo "  ./cyber.sh android  - Start Android server"
        echo "  ./cyber.sh update   - Update system"
        echo "  ./cyber.sh status   - Health check"
        echo "  ./cyber.sh          - Interactive launcher"
        echo ""
        echo "Quick start: ./cyber.sh"
        ;;
esac