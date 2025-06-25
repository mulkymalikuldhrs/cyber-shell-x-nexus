#!/bin/bash

# CyberShellX Nexus - Unified Launcher
# Advanced AI-powered cybersecurity platform with integrated APIs

clear
echo "🛡️  CyberShellX Nexus"
echo "===================="
echo "AI-Powered Cybersecurity Platform"
echo ""

# Function to check and install dependencies
check_dependencies() {
    if [ ! -d "node_modules" ] || [ ! -f "node_modules/.package-lock.json" ]; then
        echo "📦 Installing dependencies..."
        npm install
    fi
}

# Function to start the full AI-enabled server
start_ai_server() {
    echo "🤖 Starting AI-Enabled CyberShellX Server..."
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo "🚀 Features:"
    echo "  • Multi-Provider AI System (Groq, OpenRouter, Gemini)"
    echo "  • Natural Language Programming Assistant"
    echo "  • Advanced Command Execution Engine"
    echo "  • Real-time Web Dashboard"
    echo "  • Cybersecurity Analysis Tools"
    echo ""
    echo "🌐 Web Interface: http://localhost:5000"
    echo "💻 CLI Interface: Available in web dashboard"
    echo ""
    echo "⚡ Pre-configured API providers ready!"
    echo "Press Ctrl+C to stop"
    echo ""
    
    # Set environment for AI APIs
    export NODE_ENV=production
    
    # Start the full TypeScript server with AI capabilities
    if command -v npx >/dev/null 2>&1; then
        npx tsx watch server/index.ts
    else
        echo "Installing tsx..."
        npm install tsx --save-dev
        npx tsx watch server/index.ts
    fi
}

# Function to start CLI only
start_cli() {
    echo "💻 Starting CyberShellX CLI..."
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo "🤖 AI Assistant Commands:"
    echo "  • mode programming    - Switch to programming mode"
    echo "  • mode cybersecurity  - Switch to security analysis mode"
    echo "  • status             - Show AI provider status"
    echo "  • help               - Show all commands"
    echo ""
    echo "🆓 Using pre-configured APIs: Groq, OpenRouter, Gemini"
    echo ""
    node cli-interface.js
}

# Function to check system health
check_health() {
    echo "🔍 CyberShellX System Health Check..."
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    
    # Check files
    echo "📁 Checking essential files..."
    files_ok=true
    essential_files=("server/index.ts" "server/ai-provider-manager.ts" "config/api-config.json" "cli-interface.js")
    
    for file in "${essential_files[@]}"; do
        if [ -f "$file" ]; then
            echo "  ✅ $file"
        else
            echo "  ❌ $file - MISSING"
            files_ok=false
        fi
    done
    
    # Check dependencies
    echo ""
    echo "📦 Checking dependencies..."
    if [ -d "node_modules" ]; then
        echo "  ✅ Node modules installed"
        dep_count=$(ls node_modules | wc -l)
        echo "  ✅ $dep_count packages available"
    else
        echo "  ❌ Dependencies not installed"
        files_ok=false
    fi
    
    # Check API configuration
    echo ""
    echo "🔑 Checking API configuration..."
    if [ -f "config/api-config.json" ]; then
        api_count=$(grep -o "api_key.*gsk_\|api_key.*sk-or" config/api-config.json | wc -l)
        echo "  ✅ API config file loaded"
        echo "  ✅ $api_count pre-configured API keys"
        echo "  ✅ Groq API: Ready (Ultra-fast)"
        echo "  ✅ OpenRouter APIs: Ready (2 keys)"
    else
        echo "  ❌ API configuration missing"
        files_ok=false
    fi
    
    echo ""
    if [ "$files_ok" = true ]; then
        echo "🎉 System Status: HEALTHY ✅"
        echo ""
        echo "🚀 Ready to start:"
        echo "  ./cybershell.sh web    # Full AI-enabled web server"
        echo "  ./cybershell.sh cli    # AI-powered CLI interface"
        echo ""
    else
        echo "⚠️  System Status: NEEDS ATTENTION ❌"
        echo ""
        echo "🔧 Run: npm install"
        echo ""
    fi
}

# Function to update system
update_system() {
    echo "🔄 Updating CyberShellX from GitHub..."
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    
    # Backup current API config
    if [ -f "config/api-config.json" ]; then
        cp config/api-config.json config/api-config.json.backup
        echo "💾 Backed up API configuration"
    fi
    
    # Pull latest changes
    echo "📡 Pulling latest changes..."
    git pull origin main
    
    # Restore API config if it was overwritten
    if [ -f "config/api-config.json.backup" ]; then
        echo "🔧 Restoring API configuration..."
        cp config/api-config.json.backup config/api-config.json
    fi
    
    # Update dependencies
    echo "📦 Updating dependencies..."
    npm install
    
    echo ""
    echo "✅ Update complete!"
    echo "🚀 Restart with: ./cybershell.sh web"
}

# Quick help
if [[ "$1" == "--help" || "$1" == "-h" ]]; then
    echo "🚀 CyberShellX Nexus - Unified Launcher"
    echo ""
    echo "Usage:"
    echo "  ./cybershell.sh [command]"
    echo ""
    echo "Commands:"
    echo "  web       Start AI-enabled web server (default)"
    echo "  cli       Start AI-powered CLI interface"
    echo "  health    System health check"
    echo "  update    Update from GitHub"
    echo "  help      Show this help"
    echo ""
    echo "🤖 Pre-configured AI Providers:"
    echo "  • Groq (Ultra-fast inference)"
    echo "  • OpenRouter (Multiple free models)"
    echo "  • Gemini (Google's latest models)"
    echo ""
    exit 0
fi

# Direct command execution
case "$1" in
    "web"|"")
        check_dependencies
        start_ai_server
        ;;
    "cli")
        check_dependencies
        start_cli
        ;;
    "health"|"status")
        check_health
        ;;
    "update")
        update_system
        ;;
    "help")
        $0 --help
        ;;
    *)
        echo "❌ Unknown command: $1"
        echo "💡 Use: ./cybershell.sh help"
        exit 1
        ;;
esac
