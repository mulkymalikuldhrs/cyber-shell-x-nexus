#!/bin/bash

# Cyber Assistant - Advanced AI Assistant for Termux
# Natural language to command execution with real-time Web UI

clear
echo "🤖 Cyber Assistant"
echo "=================="
echo "AI-Powered Command Assistant for Termux"
echo ""

# Function to check and install dependencies
check_dependencies() {
    echo "📦 Checking dependencies..."
    
    # Check Node.js
    if ! command -v node >/dev/null 2>&1; then
        echo "❌ Node.js not found. Installing..."
        pkg install nodejs -y
    fi
    
    # Check npm modules
    if [ ! -d "node_modules" ] || [ ! -f "package-lock.json" ]; then
        echo "📥 Installing AI Assistant modules..."
        npm install
    fi
    
    # Check for voice support
    if ! command -v termux-microphone-record >/dev/null 2>&1; then
        echo "🎤 Installing voice support..."
        pkg install termux-api -y
    fi
    
    echo "✅ Dependencies ready"
}

# Function to setup Ngrok for remote access
setup_ngrok() {
    if [ "$1" = "--remote" ]; then
        echo "🌐 Setting up remote access..."
        if command -v ngrok >/dev/null 2>&1; then
            echo "🚀 Starting Ngrok tunnel..."
            ngrok http 5000 &
            NGROK_PID=$!
            echo "Ngrok PID: $NGROK_PID"
            sleep 3
            curl -s http://localhost:4040/api/tunnels | grep -o 'https://[^"]*\.ngrok-free\.app' | head -1
        else
            echo "⚠️ Ngrok not installed. Install with: pkg install ngrok"
        fi
    fi
}

# Function to start the AI Assistant
start_assistant() {
    echo "🤖 Starting Cyber Assistant..."
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo "🚀 Features:"
    echo "  • Natural Language Command Processing"
    echo "  • Voice Input & Text Processing"
    echo "  • Real-time Command Execution"
    echo "  • Auto-fix Failed Commands"
    echo "  • AI Code Generation (Python, Shell, HTML)"
    echo "  • DevOps Automation (Git, Deploy, Setup)"
    echo "  • Multi-Agent Plugin System"
    echo "  • Activity Logging & Script Saving"
    echo ""
    echo "🌐 Web Interface: http://localhost:5000"
    echo "🎤 Voice Input: Available in web interface"
    echo "📱 Mobile Optimized: Fullscreen responsive UI"
    echo ""
    
    # Setup remote access if requested
    setup_ngrok "$1"
    
    echo "⚡ Starting AI Assistant server..."
    echo "Press Ctrl+C to stop"
    echo ""
    
    # Set environment variables
    export CYBER_ASSISTANT_MODE=true
    export NODE_ENV=development
    export ASSISTANT_NAME="Cyber Assistant"
    
    # Start the server with AI Agent integration
    npm run start
}

# Function to show AI status
show_status() {
    echo "🤖 Cyber Assistant Status"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    
    # Check server
    if curl -s http://localhost:5000/api/status >/dev/null 2>&1; then
        echo "✅ Server: Running on port 5000"
        echo "🌐 Web UI: http://localhost:5000"
    else
        echo "❌ Server: Not running"
    fi
    
    # Check AI providers
    if [ -f "config/assistant-config.json" ]; then
        echo "✅ AI Config: Found"
        api_count=$(grep -o "api_key.*:" config/assistant-config.json | wc -l)
        echo "🔑 API Keys: $api_count configured"
    else
        echo "❌ AI Config: Missing"
    fi
    
    # Check voice support
    if command -v termux-microphone-record >/dev/null 2>&1; then
        echo "✅ Voice Input: Available"
    else
        echo "❌ Voice Input: termux-api not installed"
    fi
    
    # Check Ngrok
    if command -v ngrok >/dev/null 2>&1; then
        echo "✅ Remote Access: Ngrok available"
    else
        echo "⚠️ Remote Access: Ngrok not installed"
    fi
    
    echo ""
}

# Function to setup initial configuration
setup_config() {
    echo "🔧 Setting up Cyber Assistant configuration..."
    
    # Create config directory
    mkdir -p config logs data/scripts data/automation
    
    # Create assistant config
    cat > config/assistant-config.json << 'EOF'
{
  "assistant": {
    "name": "Cyber Assistant",
    "version": "1.0.0",
    "capabilities": {
      "natural_language": true,
      "voice_input": true,
      "command_execution": true,
      "code_generation": true,
      "auto_fix": true,
      "multi_agent": true,
      "automation": true
    }
  },
  "ai_providers": {
    "openrouter": {
      "enabled": true,
      "api_key": "",
      "models": [
        "meta-llama/llama-3.1-8b-instruct:free",
        "microsoft/wizardlm-2-8x22b:nitro"
      ]
    },
    "poe": {
      "enabled": false,
      "api_key": "",
      "bot": "Assistant"
    },
    "local": {
      "enabled": true,
      "fallback": true
    }
  },
  "security": {
    "safe_commands": ["ls", "cat", "grep", "find", "pwd", "echo", "date", "whoami"],
    "dangerous_commands": ["rm -rf", "dd", "mkfs", "fdisk", "> /dev"],
    "require_confirmation": ["rm", "mv", "cp", "chmod", "chown"]
  },
  "automation": {
    "supabase": {
      "enabled": false,
      "url": "",
      "key": ""
    },
    "telegram": {
      "enabled": false,
      "token": "",
      "chat_id": ""
    },
    "github": {
      "enabled": false,
      "token": ""
    }
  }
}
EOF

    echo "✅ Configuration created"
    echo "📝 Edit config/assistant-config.json to add your API keys"
}

# Quick help
if [[ "$1" == "--help" || "$1" == "-h" ]]; then
    echo "🤖 Cyber Assistant - AI Command Assistant"
    echo ""
    echo "Usage:"
    echo "  ./cyber-assistant.sh [command] [options]"
    echo ""
    echo "Commands:"
    echo "  start         Start AI Assistant (default)"
    echo "  start --remote Start with Ngrok remote access"
    echo "  status        Show system status"
    echo "  setup         Initial configuration setup"
    echo "  stop          Stop all services"
    echo "  help          Show this help"
    echo ""
    echo "🎤 Voice Commands:"
    echo "  'Hey Assistant, list files'"
    echo "  'Create a Python script to..'"
    echo "  'Setup a React project'"
    echo "  'Deploy to GitHub'"
    echo ""
    echo "🌐 Web Interface Features:"
    echo "  • Natural language input"
    echo "  • Voice recognition"
    echo "  • Real-time command execution"
    echo "  • Auto-fix failed commands"
    echo "  • Save scripts and logs"
    echo "  • Dark mode responsive UI"
    echo ""
    exit 0
fi

# Command execution
case "$1" in
    "start"|"")
        check_dependencies
        start_assistant "$2"
        ;;
    "status")
        show_status
        ;;
    "setup")
        setup_config
        ;;
    "stop")
        echo "🛑 Stopping Cyber Assistant..."
        pkill -f "cyber-assistant-server"
        pkill -f "ngrok"
        echo "✅ Services stopped"
        ;;
    "help")
        $0 --help
        ;;
    *)
        echo "❌ Unknown command: $1"
        echo "💡 Use: ./cyber-assistant.sh help"
        exit 1
        ;;
esac
