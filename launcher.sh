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
    echo "  ./launcher.sh          - Start the main CLI"
    echo "  ./launcher.sh tools    - Run the tool manager"
    echo "  ./launcher.sh update   - Update system from GitHub"
    echo ""
    exit 0
fi

# Direct command execution
case "$1" in
    "tools")
        echo "🛠️  Managing Tools..."
        exec node cli/index.js --manage-tools
        ;;
    "update")
        echo "🔄 Updating system..."
        if [ -f "update-system.sh" ]; then
            chmod +x update-system.sh
            exec ./update-system.sh
        else
            echo "Update script not found. Using fallback..."
            git pull origin main && npm install
        fi
        ;;
    *)
        echo "🖥️  Starting CLI Cybersecurity Shell..."
        echo "Enhanced terminal with AI integration"
        echo ""
        if [ -f "cli/index.js" ]; then
            exec node cli/index.js
        else
            echo "CLI entry point not found!"
        fi
        ;;
esac
