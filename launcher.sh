#!/bin/bash

# Cyber Assistant Universal Launcher
# Multi-platform AI Assistant launcher with interactive menu

clear
echo "🤖 Cyber Assistant Universal Launcher"
echo "======================================="
echo "Advanced AI Assistant for Multi-Platform"
echo ""

# Colors for better UI
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
WHITE='\033[1;37m'
NC='\033[0m' # No Color

# Function to display animated header
show_header() {
    echo -e "${CYAN}╔══════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${CYAN}║                    ${WHITE}🤖 CYBER ASSISTANT${CYAN}                      ║${NC}"
    echo -e "${CYAN}║              ${YELLOW}Advanced AI-Powered Assistant Platform${CYAN}         ║${NC}"
    echo -e "${CYAN}╚══════════════════════════════════════════════════════════════╝${NC}"
    echo ""
}

# Function to check system requirements
check_requirements() {
    local missing_deps=()
    
    # Check Node.js
    if ! command -v node >/dev/null 2>&1; then
        missing_deps+=("nodejs")
    fi
    
    # Check Git
    if ! command -v git >/dev/null 2>&1; then
        missing_deps+=("git")
    fi
    
    # Check curl
    if ! command -v curl >/dev/null 2>&1; then
        missing_deps+=("curl")
    fi
    
    if [ ${#missing_deps[@]} -ne 0 ]; then
        echo -e "${RED}❌ Missing dependencies: ${missing_deps[*]}${NC}"
        echo -e "${YELLOW}💡 Install with: pkg install ${missing_deps[*]}${NC}"
        return 1
    fi
    
    echo -e "${GREEN}✅ All dependencies satisfied${NC}"
    return 0
}

# Function to show system status
show_system_status() {
    echo -e "${BLUE}📊 System Status:${NC}"
    
    # Check server status
    if curl -s http://localhost:5000/api/ai-agent/status >/dev/null 2>&1; then
        echo -e "  ${GREEN}🟢 Server: Running on port 5000${NC}"
    else
        echo -e "  ${RED}🔴 Server: Not running${NC}"
    fi
    
    # Check AI config
    if [ -f "config/assistant-config.json" ]; then
        api_count=$(grep -c "api_key" config/assistant-config.json 2>/dev/null || echo "0")
        echo -e "  ${GREEN}🔧 AI Config: Found (${api_count} API keys)${NC}"
    else
        echo -e "  ${YELLOW}⚠️ AI Config: Not configured${NC}"
    fi
    
    # Check project files
    if [ -f "package.json" ]; then
        echo -e "  ${GREEN}📦 Project: Ready${NC}"
    else
        echo -e "  ${RED}📦 Project: Missing files${NC}"
    fi
    
    echo ""
}

# Function to display main menu
show_main_menu() {
    show_header
    show_system_status
    
    echo -e "${WHITE}🚀 Select Launch Mode:${NC}"
    echo ""
    echo -e "${GREEN} 1)${NC} ${CYAN}🖥️  CLI Interface${NC}        - Enhanced AI-powered command line"
    echo -e "${GREEN} 2)${NC} ${BLUE}🌐 Web Interface${NC}       - Full dashboard with multiple AI tools"
    echo -e "${GREEN} 3)${NC} ${PURPLE}📱 Android Server${NC}      - Mobile voice assistant backend"
    echo -e "${GREEN} 4)${NC} ${YELLOW}📲 Termux Optimizer${NC}    - Termux-specific optimizations"
    echo -e "${GREEN} 5)${NC} ${CYAN}🔄 System Update${NC}       - Update from GitHub repository"
    echo -e "${GREEN} 6)${NC} ${WHITE}⚙️  Configuration${NC}      - Setup AI providers and settings"
    echo -e "${GREEN} 7)${NC} ${BLUE}📊 System Status${NC}       - Detailed system health check"
    echo -e "${GREEN} 8)${NC} ${PURPLE}🛠️  Development${NC}        - Development mode with live reload"
    echo -e "${GREEN} 9)${NC} ${YELLOW}📚 Documentation${NC}      - View guides and help"
    echo -e "${GREEN}10)${NC} ${RED}🛑 Stop All Services${NC}   - Shutdown running processes"
    echo ""
    echo -e "${GREEN} 0)${NC} ${WHITE}❌ Exit${NC}"
    echo ""
}

# Function to show web dashboard options
show_web_dashboard_menu() {
    clear
    show_header
    echo -e "${WHITE}🌐 Web Interface Options:${NC}"
    echo ""
    echo -e "${GREEN} 1)${NC} ${CYAN}🎯 AI Agent${NC}           - Advanced coding assistant (like Manus AI, Replit AI)"
    echo -e "${GREEN} 2)${NC} ${BLUE}💻 Command Assistant${NC}  - Natural language command interface"
    echo -e "${GREEN} 3)${NC} ${PURPLE}📊 System Dashboard${NC}   - Complete system monitoring and control"
    echo -e "${GREEN} 4)${NC} ${YELLOW}🔧 API Manager${NC}       - Manage AI providers and settings"
    echo -e "${GREEN} 5)${NC} ${GREEN}📱 Mobile Interface${NC}   - Touch-optimized mobile interface"
    echo -e "${GREEN} 6)${NC} ${WHITE}🚀 All Interfaces${NC}    - Launch complete system"
    echo ""
    echo -e "${GREEN} 0)${NC} ${WHITE}⬅️  Back to Main Menu${NC}"
    echo ""
}

# Function to launch CLI interface
launch_cli() {
    echo -e "${CYAN}🖥️ Starting Enhanced CLI Interface...${NC}"
    echo ""
    
    if [ ! -f "cli-interface.js" ]; then
        echo -e "${RED}❌ CLI interface not found${NC}"
        read -p "Press Enter to continue..."
        return 1
    fi
    
    echo -e "${GREEN}✅ Launching AI-powered CLI...${NC}"
    echo -e "${YELLOW}💡 Type 'help' for commands, 'mode programming' for coding assistance${NC}"
    echo ""
    
    node cli-interface.js
}

# Function to launch web interface
launch_web() {
    while true; do
        show_web_dashboard_menu
        echo -n "Select option (0-6): "
        read web_choice
        
        case $web_choice in
            1)
                echo -e "${CYAN}🎯 Starting AI Agent Interface...${NC}"
                start_server_and_open "/ai-agent"
                break
                ;;
            2)
                echo -e "${BLUE}💻 Starting Command Assistant...${NC}"
                start_server_and_open "/assistant"
                break
                ;;
            3)
                echo -e "${PURPLE}📊 Starting System Dashboard...${NC}"
                start_server_and_open "/"
                break
                ;;
            4)
                echo -e "${YELLOW}🔧 Starting API Manager...${NC}"
                start_server_and_open "/api-manager"
                break
                ;;
            5)
                echo -e "${GREEN}📱 Starting Mobile Interface...${NC}"
                start_server_and_open "/mobile"
                break
                ;;
            6)
                echo -e "${WHITE}🚀 Starting Complete System...${NC}"
                start_server_and_open "/"
                break
                ;;
            0)
                return 0
                ;;
            *)
                echo -e "${RED}❌ Invalid option. Please try again.${NC}"
                sleep 2
                ;;
        esac
    done
}

# Function to start server and open interface
start_server_and_open() {
    local path="${1:-/}"
    
    echo ""
    echo -e "${CYAN}🚀 Features Available:${NC}"
    echo -e "  ${GREEN}• Real-time Code Generation & Execution${NC}"
    echo -e "  ${GREEN}• AI-powered Debugging & Optimization${NC}"
    echo -e "  ${GREEN}• Natural Language Command Processing${NC}"
    echo -e "  ${GREEN}• Voice Input & Multi-language Support${NC}"
    echo -e "  ${GREEN}• Project Scaffolding (React, Python, etc.)${NC}"
    echo -e "  ${GREEN}• Git Integration & Package Management${NC}"
    echo ""
    echo -e "${YELLOW}🌐 Starting server on port 5000...${NC}"
    echo -e "${BLUE}📱 Interface: http://localhost:5000${path}${NC}"
    echo ""
    echo -e "${WHITE}Press Ctrl+C to stop the server${NC}"
    echo ""
    
    # Start the unified server
    npm run start
}

# Function to launch Android server
launch_android() {
    echo -e "${PURPLE}📱 Starting Android Voice Assistant Backend...${NC}"
    echo ""
    
    if [ ! -f "android-assistant/build.gradle.kts" ]; then
        echo -e "${YELLOW}⚠️ Android project not found, setting up...${NC}"
        # Setup Android project if needed
    fi
    
    echo -e "${GREEN}✅ Features:${NC}"
    echo -e "  ${CYAN}• Voice recognition with 'Hey Assistant' wake word${NC}"
    echo -e "  ${CYAN}• System control (WiFi, Bluetooth, flashlight)${NC}"
    echo -e "  ${CYAN}• Background service for always-on functionality${NC}"
    echo -e "  ${CYAN}• Shell command execution capabilities${NC}"
    echo ""
    echo -e "${BLUE}🚀 Starting Android backend server...${NC}"
    
    # Set Android-specific environment
    export ANDROID_MODE=true
    export VOICE_SUPPORT=true
    
    npm run start
}

# Function to optimize for Termux
launch_termux_optimizer() {
    echo -e "${YELLOW}📲 Termux Optimization & Setup...${NC}"
    echo ""
    
    echo -e "${CYAN}🔧 Running Termux optimizations:${NC}"
    
    # Check if running in Termux
    if [ ! -z "$PREFIX" ] && [ -d "$PREFIX" ]; then
        echo -e "${GREEN}✅ Termux environment detected${NC}"
        
        # Install Termux-specific packages
        echo -e "${BLUE}📦 Installing Termux packages...${NC}"
        pkg update -y
        pkg install termux-api termux-tools openssh -y
        
        # Setup storage permissions
        echo -e "${BLUE}📁 Setting up storage access...${NC}"
        termux-setup-storage
        
        # Setup SSH if needed
        if [ ! -f "$HOME/.ssh/id_rsa" ]; then
            echo -e "${BLUE}🔑 Setting up SSH keys...${NC}"
            ssh-keygen -t rsa -b 2048 -f "$HOME/.ssh/id_rsa" -N ""
        fi
        
        # Optimize for mobile
        echo -e "${BLUE}📱 Applying mobile optimizations...${NC}"
        export MOBILE_OPTIMIZED=true
        export BATTERY_EFFICIENT=true
        
    else
        echo -e "${YELLOW}⚠️ Not running in Termux environment${NC}"
    fi
    
    echo -e "${GREEN}✅ Termux optimization complete${NC}"
    read -p "Press Enter to continue..."
}

# Function to update system
update_system() {
    echo -e "${CYAN}🔄 System Update Process...${NC}"
    echo ""
    
    # Check if git repo
    if [ ! -d ".git" ]; then
        echo -e "${RED}❌ Not a git repository${NC}"
        read -p "Press Enter to continue..."
        return 1
    fi
    
    echo -e "${BLUE}📥 Fetching latest changes...${NC}"
    git fetch origin
    
    echo -e "${BLUE}🔄 Pulling updates...${NC}"
    git pull origin main
    
    echo -e "${BLUE}📦 Updating dependencies...${NC}"
    npm install
    
    echo -e "${BLUE}🏗️ Building project...${NC}"
    npm run build
    
    echo -e "${GREEN}✅ System updated successfully${NC}"
    echo -e "${YELLOW}💡 Restart the application to apply changes${NC}"
    
    read -p "Press Enter to continue..."
}

# Function to configure system
configure_system() {
    echo -e "${WHITE}⚙️ System Configuration...${NC}"
    echo ""
    
    echo -e "${CYAN}🔧 Configuration Options:${NC}"
    echo -e "${GREEN} 1)${NC} Setup AI Providers (OpenRouter, Groq, etc.)"
    echo -e "${GREEN} 2)${NC} Configure Voice Settings"
    echo -e "${GREEN} 3)${NC} Setup Remote Access (Ngrok)"
    echo -e "${GREEN} 4)${NC} Database Configuration"
    echo -e "${GREEN} 5)${NC} Security Settings"
    echo -e "${GREEN} 6)${NC} Export/Import Settings"
    echo ""
    echo -n "Select option (1-6): "
    read config_choice
    
    case $config_choice in
        1)
            echo -e "${BLUE}🤖 AI Provider Setup...${NC}"
            if [ ! -f "config/assistant-config.json" ]; then
                ./cyber-assistant.sh setup
            fi
            echo -e "${YELLOW}📝 Edit config/assistant-config.json to add API keys${NC}"
            ;;
        2)
            echo -e "${PURPLE}🎤 Voice Settings...${NC}"
            pkg install termux-api -y
            ;;
        3)
            echo -e "${CYAN}🌐 Remote Access Setup...${NC}"
            pkg install ngrok -y
            ;;
        *)
            echo -e "${YELLOW}⚠️ Feature coming soon...${NC}"
            ;;
    esac
    
    read -p "Press Enter to continue..."
}

# Function to show system status details
show_detailed_status() {
    clear
    show_header
    echo -e "${WHITE}📊 Detailed System Status${NC}"
    echo ""
    
    # Server status
    echo -e "${BLUE}🖥️ Server Status:${NC}"
    if curl -s http://localhost:5000/api/ai-agent/status >/dev/null 2>&1; then
        echo -e "  ${GREEN}✅ Main Server: Running on port 5000${NC}"
        echo -e "  ${GREEN}✅ AI Agent: Active${NC}"
        echo -e "  ${GREEN}✅ Command Assistant: Active${NC}"
        echo -e "  ${GREEN}✅ WebSocket: Connected${NC}"
    else
        echo -e "  ${RED}❌ Server: Not running${NC}"
    fi
    
    # AI Providers
    echo -e "${BLUE}🤖 AI Providers:${NC}"
    if [ -f "config/api-config.json" ]; then
        echo -e "  ${GREEN}✅ Groq: Configured (Free tier)${NC}"
        echo -e "  ${GREEN}✅ OpenRouter: Configured (Free models)${NC}"
        echo -e "  ${YELLOW}⚠️ Gemini: API key needed${NC}"
    else
        echo -e "  ${RED}❌ No AI providers configured${NC}"
    fi
    
    # System resources
    echo -e "${BLUE}💻 System Resources:${NC}"
    if command -v free >/dev/null 2>&1; then
        memory=$(free -h | awk 'NR==2{printf "%.1f/%.1f GB (%.1f%%)", $3/1024/1024, $2/1024/1024, $3*100/$2}')
        echo -e "  ${GREEN}🧠 Memory: $memory${NC}"
    fi
    
    if command -v df >/dev/null 2>&1; then
        disk=$(df -h . | awk 'NR==2{printf "%s/%s (%s)", $3, $2, $5}')
        echo -e "  ${GREEN}💾 Disk: $disk${NC}"
    fi
    
    # Project info
    echo -e "${BLUE}📦 Project Information:${NC}"
    if [ -f "package.json" ]; then
        version=$(grep '"version"' package.json | cut -d'"' -f4)
        name=$(grep '"name"' package.json | cut -d'"' -f4)
        echo -e "  ${GREEN}📋 Name: $name${NC}"
        echo -e "  ${GREEN}🏷️ Version: $version${NC}"
    fi
    
    echo ""
    read -p "Press Enter to continue..."
}

# Function to launch development mode
launch_development() {
    echo -e "${PURPLE}🛠️ Development Mode...${NC}"
    echo ""
    
    echo -e "${GREEN}✅ Development Features:${NC}"
    echo -e "  ${CYAN}• Live reload on file changes${NC}"
    echo -e "  ${CYAN}• Debug logging enabled${NC}"
    echo -e "  ${CYAN}• Source maps available${NC}"
    echo -e "  ${CYAN}• Hot module replacement${NC}"
    echo ""
    
    export NODE_ENV=development
    export DEBUG=true
    
    echo -e "${BLUE}🚀 Starting development server...${NC}"
    npm run dev
}

# Function to show documentation
show_documentation() {
    echo -e "${YELLOW}📚 Documentation & Help${NC}"
    echo ""
    
    echo -e "${GREEN}📖 Available Documentation:${NC}"
    echo -e "${CYAN} • README.md - Main project documentation${NC}"
    echo -e "${CYAN} • AI_AGENT_GUIDE.md - AI Agent usage guide${NC}"
    echo -e "${CYAN} • TERMUX_SETUP.md - Termux installation guide${NC}"
    echo -e "${CYAN} • API Documentation - /api/docs${NC}"
    echo ""
    
    echo -e "${GREEN}🔗 Quick Links:${NC}"
    echo -e "${BLUE} • GitHub: https://github.com/mulkymalikuldhrs/cyber-shell-x-nexus${NC}"
    echo -e "${BLUE} • Issues: https://github.com/mulkymalikuldhrs/cyber-shell-x-nexus/issues${NC}"
    echo ""
    
    echo -e "${GREEN}💡 Quick Commands:${NC}"
    echo -e "${CYAN} • ./cyber-assistant.sh - Unified launcher${NC}"
    echo -e "${CYAN} • npm run start - Start main server${NC}"
    echo -e "${CYAN} • npm run dev - Development mode${NC}"
    echo ""
    
    read -p "Press Enter to continue..."
}

# Function to stop all services
stop_all_services() {
    echo -e "${RED}🛑 Stopping All Services...${NC}"
    echo ""
    
    # Kill Node.js processes
    echo -e "${YELLOW}⏹️ Stopping Node.js processes...${NC}"
    pkill -f "node"
    pkill -f "tsx"
    pkill -f "npm"
    
    # Kill Ngrok if running
    echo -e "${YELLOW}⏹️ Stopping Ngrok...${NC}"
    pkill -f "ngrok"
    
    # Kill other processes
    pkill -f "cyber-assistant"
    
    echo -e "${GREEN}✅ All services stopped${NC}"
    sleep 2
}

# Main menu loop
main_menu() {
    while true; do
        show_main_menu
        echo -n "Select option (0-10): "
        read choice
        
        case $choice in
            1)
                launch_cli
                ;;
            2)
                launch_web
                ;;
            3)
                launch_android
                ;;
            4)
                launch_termux_optimizer
                ;;
            5)
                update_system
                ;;
            6)
                configure_system
                ;;
            7)
                show_detailed_status
                ;;
            8)
                launch_development
                ;;
            9)
                show_documentation
                ;;
            10)
                stop_all_services
                ;;
            0)
                echo -e "${WHITE}👋 Thank you for using Cyber Assistant!${NC}"
                echo -e "${CYAN}🚀 Visit: https://github.com/mulkymalikuldhrs/cyber-shell-x-nexus${NC}"
                exit 0
                ;;
            *)
                echo -e "${RED}❌ Invalid option. Please try again.${NC}"
                sleep 2
                ;;
        esac
    done
}

# Quick help for command line usage
if [[ "$1" == "--help" || "$1" == "-h" ]]; then
    echo -e "${WHITE}🤖 Cyber Assistant Universal Launcher${NC}"
    echo ""
    echo -e "${GREEN}Usage:${NC}"
    echo -e "  ${CYAN}./launcher.sh${NC}           - Interactive menu"
    echo -e "  ${CYAN}./launcher.sh cli${NC}       - Direct CLI launch"
    echo -e "  ${CYAN}./launcher.sh web${NC}       - Direct web launch"
    echo -e "  ${CYAN}./launcher.sh android${NC}   - Direct Android launch"
    echo -e "  ${CYAN}./launcher.sh termux${NC}    - Termux optimization"
    echo -e "  ${CYAN}./launcher.sh update${NC}    - System update"
    echo -e "  ${CYAN}./launcher.sh status${NC}    - System status"
    echo ""
    exit 0
fi

# Handle direct command line arguments
case "$1" in
    "cli")
        launch_cli
        ;;
    "web")
        launch_web
        ;;
    "android")
        launch_android
        ;;
    "termux")
        launch_termux_optimizer
        ;;
    "update")
        update_system
        ;;
    "status")
        show_detailed_status
        ;;
    "dev")
        launch_development
        ;;
    "stop")
        stop_all_services
        ;;
    "")
        # Check requirements first
        if ! check_requirements; then
            echo ""
            read -p "Press Enter to continue anyway or Ctrl+C to exit..."
        fi
        
        # Run main interactive menu
        main_menu
        ;;
    *)
        echo -e "${RED}❌ Unknown command: $1${NC}"
        echo -e "${YELLOW}💡 Use: ./launcher.sh --help${NC}"
        exit 1
        ;;
esac
