
# CyberShellX Nexus 🛡️

Advanced AI-powered cybersecurity platform with intelligent code assistant, multi-provider API support, command execution engine, and cross-platform capabilities.

## Quick Start

### Main Launcher
```bash
./launcher.sh              # Interactive menu (recommended)
./launcher.sh cli          # 01. AI Agent CLI (Enhanced)
./launcher.sh web          # 02. Web server with AI Agent
./launcher.sh android      # 03. Android voice assistant backend
./launcher.sh update       # 04. Update system from GitHub
./launcher.sh status       # 05. System health check
```

Choose from:
1. **AI Agent CLI Interface** - Advanced code assistant with command execution
2. **Web Server** - Full AI Agent dashboard with multi-provider support
3. **Android Server** - Backend server for voice assistant mobile app
4. **Update System** - Pull latest changes and update all dependencies
5. **System Health Check** - Monitor AI providers and system status

### Direct Access
```bash
# Web interface only
npm run dev

# CLI terminal only  
node cli-interface.js
```

## Installation

### Replit (Current Environment)
The application is ready to run. Use `./run.sh` to start.

### Termux (Android)
```bash
# Download installer
curl -o termux-install.sh https://raw.githubusercontent.com/mulkymalikuldhrs/cyber-shell-x-nexus/main/termux-install.sh
chmod +x termux-install.sh
./termux-install.sh

# Run interactive launcher
cd ~/cyber-shell-x-nexus
./run.sh
```

### Local Development
```bash
git clone https://github.com/mulkymalikuldhrs/cyber-shell-x-nexus.git
cd cyber-shell-x-nexus
npm install
npm run db:push
./run.sh
```

## Features

### 🤖 Advanced AI Agent System
- **Multi-Provider API Support** - 6+ AI providers with automatic failover
- **Natural Language Understanding** - Convert requests to executable actions
- **Smart Code Assistant** - Like Manus AI, Suna AI for programming tasks
- **Command Execution Engine** - Safe system command execution
- **Real-time Monitoring** - Health tracking for all API endpoints

### 🆓 Free AI Providers Included
- **Groq** - Ultra-fast inference (6000 tokens/min free)
- **Hugging Face** - Coding-specialized models (Qwen 2.5 Coder)
- **OpenRouter** - Multiple free models access
- **Together AI** - $25 free credits included
- **DeepInfra** - $5/month free tier
- **Local Ollama** - Complete privacy, offline capable

### 💻 Enhanced CLI Interface
- **Programming Mode** - Expert code assistant for 20+ languages
- **Cybersecurity Mode** - Security analysis and pentesting guidance
- **Command Execution** - Safe system command execution with whitelist
- **Multi-step Automation** - Complex task breakdown and execution
- **Project Setup** - Automated project scaffolding and configuration

### 🌐 Advanced Web Interface
- **AI Agent Dashboard** - Full control center for all providers
- **Real-time Chat** - Interactive AI assistant with mode switching
- **Status Monitoring** - Live health tracking of all API endpoints
- **Task History** - Complete log of all agent activities
- **API Management** - Add/edit API keys dynamically

### 🚀 Programming Assistant Features
- **Complete Project Setup** - React, Vue, Express, Django, Laravel, etc.
- **Dependency Management** - Auto-install npm, pip, composer packages
- **Git Integration** - Clone, commit, push operations
- **Code Generation** - Full applications with proper structure
- **Real-time Execution** - Run and test code directly
- **Security Analysis** - Code vulnerability assessment

### 📱 Android App Integration
- Voice-activated assistant with "Hey CyberShell" wake word
- Background service for always-on functionality
- System control (WiFi, Bluetooth, flashlight, volume)
- Shell command execution capabilities
- AI-powered cybersecurity and programming guidance

## Architecture

- **Frontend**: React 18 + TypeScript + Vite + shadcn/ui
- **Backend**: Express.js + TypeScript + AI Provider Manager
- **AI System**: Multi-provider with automatic failover (Groq, HF, OpenRouter, etc.)
- **Command Engine**: Safe execution system with whitelist protection
- **Database**: PostgreSQL with Drizzle ORM
- **Mobile**: Native Android with voice recognition
- **CLI**: Enhanced Node.js terminal with AI integration

## Access Points

- **Web Interface**: http://localhost:5000 (AI Agent Dashboard)
- **CLI Interface**: `node cli-interface.js` (Enhanced with AI modes)
- **API Endpoints**: 15+ REST endpoints for AI and command operations
- **Android App**: APK installation from build output

## API Configuration

The system includes pre-configured API keys for immediate use:

### 🆓 Pre-configured Free APIs
- **Groq API** - Ultra-fast Llama 3.3 models (Ready to use)
- **OpenRouter API** - Multiple free models (2 keys included)
- **Hugging Face** - Coding models (Add your key)
- **Together AI** - Free credits (Add your key)

### 🔧 Add Your Own APIs
```bash
# Via Environment Variables
export GROQ_API_KEY="your_groq_key"
export OPENROUTER_API_KEY="your_openrouter_key"
export HUGGINGFACE_API_KEY="your_hf_key"

# Via Web Interface
# 1. Start server: npm run dev
# 2. Go to http://localhost:5000
# 3. Click "AI Agent" > "Settings"
# 4. Add your API keys
```

### 🚀 Get Free API Keys
- **Groq**: https://console.groq.com/ (6000 tokens/min free)
- **OpenRouter**: https://openrouter.ai/ (Free models available)
- **Hugging Face**: https://huggingface.co/ (Free inference)
- **Together AI**: https://api.together.xyz/ ($25 free credits)

## Development

```bash
# Database operations
npm run db:push          # Apply schema changes
npm run build           # Production build
npm run start           # Production server

# Main launcher (recommended)
./launcher.sh           # Interactive menu
./launcher.sh cli       # AI Agent CLI interface
./launcher.sh web       # AI Agent web dashboard
./launcher.sh status    # Health check all APIs

# Alternative launchers  
./run.sh                # Interactive launcher
./start.sh              # Quick launcher
```

## Usage Examples

### 🤖 AI Agent CLI
```bash
# Start enhanced CLI
node cli-interface.js

# Switch to programming mode
mode programming

# Natural language commands
"Create a React TypeScript app with authentication"
"Set up a Python Flask API with PostgreSQL"
"Install all dependencies for this Node.js project"
"Run tests and fix any failures"
"Deploy this app using Docker"
```

### 🌐 Web Interface
```bash
# Start web server
npm run dev

# Access at: http://localhost:5000
# Features:
# - AI Agent dashboard
# - Real-time chat with AI
# - API provider status monitoring
# - Task history and management
# - Dynamic API key management
```

### 🚀 API Direct Usage
```bash
# Process programming request
curl -X POST http://localhost:5000/api/agent/process \
  -H "Content-Type: application/json" \
  -d '{"request":"Create a Python web scraper","mode":"programming"}'

# Execute system command
curl -X POST http://localhost:5000/api/command/execute \
  -H "Content-Type: application/json" \
  -d '{"command":"npm install express"}'

# Check API status
curl http://localhost:5000/api/ai/status
```

## Support

- **Repository**: https://github.com/mulkymalikuldhrs/cyber-shell-x-nexus
- **Issues**: GitHub Issues for bug reports and feature requests
- **Documentation**: Complete setup guides included

## Author

**Mulky Malikul Dhaher**
- GitHub: [@mulkymalikuldhrs](https://github.com/mulkymalikuldhrs)
- Support: Indonesian e-wallets (+6285322624048)

## Security Notice

This platform is designed for educational and authorized testing purposes only. Users are responsible for compliance with applicable laws and regulations.
