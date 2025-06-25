
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
    echo "  ./launcher.sh cli      - 01. CLI cybersecurity shell"
    echo "  ./launcher.sh web      - 02. Web server"
    echo "  ./launcher.sh android  - 03. Android voice assistant backend"
    echo "  ./launcher.sh update   - 04. Update system from GitHub"
    echo "  ./launcher.sh status   - 05. System health check"
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
echo "01. CLI Cybersecurity Shell"
echo "02. Web Server (Desktop/Mobile)"  
echo "03. Android Voice Assistant Backend"
echo "04. Update System from GitHub"
echo "05. System Health Check"
echo "00. Exit"
echo ""

while true; do
    read -p "Enter your choice (00-05): " choice
    
    case $choice in
        "01"|"1")
            echo ""
            echo "🖥️  Starting CLI Cybersecurity Shell..."
            echo "Enhanced terminal with AI integration"
            echo ""
            if [ -f "cli-interface.js" ]; then
                node cli-interface.js
            else
                echo "CLI interface not found!"
            fi
            break
            ;;
        "02"|"2")
            echo ""
            echo "🌐 Starting Web Server..."
            echo "Access at: http://localhost:5000"
            echo "Press Ctrl+C to stop"
            echo ""
            npm run dev
            break
            ;;
        "03"|"3")
            echo ""
            echo "🤖 Starting Android Voice Assistant Backend..."
            echo "Server for Android app communication"
            echo "Access at: http://localhost:5000"
            echo ""
            ANDROID_MODE=true npm run dev
            break
            ;;
        "04"|"4")
            echo ""
            echo "🔄 Updating System from GitHub..."
            echo "Repository: https://github.com/mulkymalikuldhrs/cyber-shell-x-nexus"
            echo ""
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
        "05"|"5")
            echo ""
            echo "🔍 System Health Check..."
            node scripts/health-check.js
            echo ""
            read -p "Press Enter to continue..."
            ;;
        "00"|"0")
            echo ""
            echo "Goodbye! Stay secure!"
            exit 0
            ;;
        *)
            echo "Invalid choice. Please select 00-05."
            ;;
    esac
done
