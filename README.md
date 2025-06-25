# Cyber Assistant 🤖

Advanced AI Assistant system that functions like **Manus AI, Replit AI, Bolt AI, Mentat AI, Agentic, Pico AI, Suna AI** with complete AI coding capabilities. Runs directly in Termux Android without external emulators, featuring modern Web UI, real-time code generation, project scaffolding, and natural language processing.

## ⚡ Quick Start

### 🚀 Universal Launcher (Recommended)
```bash
./launcher.sh                    # Interactive menu with all options
./launcher.sh cli               # Direct CLI launch
./launcher.sh web               # Direct web interface launch  
./launcher.sh android           # Android voice assistant backend
./launcher.sh termux            # Termux optimization & setup
./launcher.sh update            # System update from GitHub
./launcher.sh status            # Detailed system status
```

### 🎯 Specific Launchers
```bash
./cyber-assistant.sh start      # Direct server start
./cyber-assistant.sh setup      # Initial configuration
```

## 🎯 Core Features

### 🤖 AI Agent System (Like Manus AI, Replit AI, Bolt AI)
- **Real-time Code Generation**: Natural language to complete, functional code
- **Project Scaffolding**: Complete project creation (React, Express, Python, AI, Blockchain)
- **Code Execution**: Instant run with live output and error handling
- **AI Debugging**: Intelligent error detection, diagnosis, and automatic fixing
- **Code Optimization**: Performance improvements and best practices suggestions
- **Code Explanation**: Step-by-step code analysis and concept explanation
- **Multi-language Support**: JavaScript, Python, TypeScript, HTML, CSS, Shell, Solidity
- **File Management**: Complete CRUD operations with Git integration
- **Package Management**: NPM, pip, composer automatic installation
- **Collaborative Coding**: Real-time multi-user development environment

### 🎤 Voice & Natural Language Interface
- **Voice Input**: Web Speech API integration for hands-free operation
- **Command Processing**: "Hey Assistant, list files" → `ls -la`
- **Multi-step Automation**: "Setup a React project with TypeScript and Tailwind"
- **Auto-fix Failed Commands**: Automatically detects and fixes common errors
- **Script Generation**: Create Python, Shell, HTML, JavaScript files from descriptions
- **DevOps Automation**: Git operations, project setup, deployment workflows

### 🌐 Multiple Web Interfaces
- **AI Agent Dashboard**: Professional coding environment (similar to GitHub Codespaces)
- **Command Assistant**: Natural language command interface with voice support
- **System Dashboard**: Complete system monitoring and control panel
- **API Manager**: Manage AI providers and configuration settings
- **Mobile Interface**: Touch-optimized interface for smartphones
- **Developer Tools**: Real-time debugging and development environment

### 🔧 Advanced Technical Features
- **Real-time WebSocket**: Instant bidirectional communication
- **Multi-Provider AI**: Groq, OpenRouter, Gemini integration with automatic failover
- **Safety Validation**: Dangerous command detection and confirmation prompts
- **Activity Logging**: Complete audit trail of all operations
- **Plugin Architecture**: Modular system for easy expansion
- **Direct Termux Integration**: Native execution without emulation overhead

## 📱 Installation & Setup

### 🚀 One-Click Installation (Termux)
```bash
# Download and run universal installer
curl -o install.sh https://raw.githubusercontent.com/mulkymalikuldhrs/cyber-shell-x-nexus/main/launcher.sh
chmod +x install.sh
./install.sh
```

### 🔧 Manual Installation
```bash
# Install Termux dependencies
pkg update && pkg install nodejs npm git curl termux-api -y

# Clone repository
git clone https://github.com/mulkymalikuldhrs/cyber-shell-x-nexus.git
cd cyber-shell-x-nexus

# Make launchers executable
chmod +x launcher.sh cyber-assistant.sh

# Initial setup
./launcher.sh termux          # Termux optimization
./cyber-assistant.sh setup    # AI configuration

# Launch system
./launcher.sh                 # Interactive menu
```

### 🖥️ Development Setup (Linux/macOS/Windows)
```bash
# Clone and setup
git clone https://github.com/mulkymalikuldhrs/cyber-shell-x-nexus.git
cd cyber-shell-x-nexus

# Install dependencies
npm install

# Build project
npm run build

# Start development server
./launcher.sh dev
```

## 🚀 Usage Examples

### 🎯 AI Agent (Coding Assistant)
```
"Create a React TypeScript component for user authentication"
→ Generates complete component with form validation and styling

"Build a Python web scraper for e-commerce data"
→ Creates full Python script with BeautifulSoup, requests, and data parsing

"Setup Express.js API with JWT authentication and PostgreSQL"
→ Scaffolds complete backend project with database integration

"Debug this JavaScript code and fix all performance issues"
→ Analyzes code, identifies bottlenecks, provides optimized solution

"Explain how this sorting algorithm works step by step"
→ Provides detailed algorithm analysis with complexity breakdown

"Create a blockchain smart contract for token management"
→ Generates Solidity contract with all necessary functions
```

### 🎤 Voice Commands (Natural Language Interface)
```
"Hey Assistant, list all files in the current directory"
→ Executes: ls -la

"Create a Python script for file management"
→ Generates and saves Python script with file operations

"Setup a React project with TypeScript and Tailwind CSS"
→ Runs: npx create-react-app my-app --template typescript + Tailwind setup

"Install Node.js development tools"
→ Runs: pkg install nodejs npm git curl

"Check system performance and resource usage"
→ Runs: uname -a && df -h && free -h && ps aux

"Deploy current project to GitHub with automatic CI/CD"
→ Creates GitHub repo, pushes code, sets up Actions workflow
```

### 💼 Project Creation Examples
```
"Create a full-stack e-commerce application"
→ Scaffolds React frontend + Express backend + PostgreSQL + payment integration

"Build an AI chatbot with natural language processing"
→ Creates Python project with TensorFlow/PyTorch + Flask API + web interface

"Setup a mobile app for iOS and Android"
→ Scaffolds React Native project with navigation and state management

"Create a blockchain DeFi application"
→ Generates Solidity contracts + Web3 frontend + testing suite

"Build a data analysis dashboard"
→ Creates Python/Jupyter project with pandas, matplotlib, and Streamlit
```

## 🌐 Web Interface Options

### 🎯 AI Agent Dashboard (Professional Coding Environment)
- **Access**: `./launcher.sh web` → Option 1 or http://localhost:5000/ai-agent
- **Real-time Code Editor**: Professional coding interface similar to GitHub Codespaces
- **Project Explorer**: File management with Git integration
- **AI Chat Integration**: Instant coding assistance with quick actions
- **Code Execution**: Live output with debugging capabilities
- **Multi-language Support**: JavaScript, Python, TypeScript, HTML, CSS, Shell
- **Collaborative Features**: Real-time multi-user development

### 💻 Command Assistant (Natural Language Interface)
- **Access**: `./launcher.sh web` → Option 2 or http://localhost:5000/assistant
- **Voice Input**: Web Speech API with "Hey Assistant" wake word
- **Natural Language Processing**: Convert speech to commands
- **Real-time Execution**: WebSocket live command output
- **Auto-fix**: Intelligent error recovery and command correction
- **Activity Logging**: Complete audit trail with script saving
- **Mobile Optimized**: Touch-first responsive design

### 📊 System Dashboard (Control Center)
- **Access**: `./launcher.sh web` → Option 3 or http://localhost:5000/
- **Interface Selection**: Choose between AI Agent, Command Assistant, or other tools
- **System Monitoring**: Real-time status of AI providers and services
- **API Management**: Configure AI providers and settings
- **Project Overview**: View all projects and recent activities
- **Performance Metrics**: Response times and system resource usage

### 🔧 Additional Interfaces
- **API Manager**: Manage AI providers and configuration settings
- **Mobile Interface**: Touch-optimized interface for smartphones
- **Developer Tools**: Real-time debugging and development environment
- **Documentation Portal**: Interactive guides and API references

## 🔑 AI Provider Setup

### Pre-configured APIs (Ready to Use)
```json
{
  "openrouter": {
    "api_key": "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",
    "models": ["meta-llama/llama-3.1-8b-instruct:free"]
  },
  "groq": {
    "api_key": "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",
    "models": ["llama-3.3-70b-versatile"]
  }
}
```

### Add Your Own APIs
```bash
# Edit configuration
nano config/assistant-config.json

# Add API keys for enhanced features
{
  "ai_providers": {
    "openrouter": {
      "api_key": "YOUR_OPENROUTER_KEY"
    },
    "groq": {
      "api_key": "YOUR_GROQ_KEY"
    }
  }
}
```

### Get Free API Keys
- **OpenRouter**: https://openrouter.ai/ (Free models available)
- **Groq**: https://console.groq.com/ (Free tier: 6000 tokens/min)
- **Poe**: https://poe.com/ (Claude, GPT access)

## 🔧 Configuration

### Assistant Settings
```bash
# Edit main configuration
nano config/assistant-config.json

# Key settings:
- AI provider priorities
- Security command lists
- Automation integrations
- Voice input settings
- Web UI preferences
```

### Remote Access Setup
```bash
# Install Ngrok for remote access
pkg install ngrok

# Start with remote access
./cyber-assistant.sh start --remote

# Your assistant will be accessible from anywhere!
```

### Automation Integration
```json
{
  "automation": {
    "github": {
      "enabled": true,
      "token": "YOUR_GITHUB_TOKEN"
    },
    "telegram": {
      "enabled": true,
      "token": "YOUR_BOT_TOKEN",
      "chat_id": "YOUR_CHAT_ID"
    }
  }
}
```

## 📊 System Status

### Health Check
```bash
./cyber-assistant.sh status

# Output:
✅ Server: Running on port 5000
✅ AI Config: Found
🔑 API Keys: 2 configured
✅ Voice Input: Available
✅ Remote Access: Ngrok available
```

### Web Dashboard
- **Access**: http://localhost:5000
- **Real-time Status**: Live system monitoring
- **Command History**: Complete activity log
- **Performance Metrics**: Response times and success rates

## 🛡️ Security Features

### Command Safety
- **Whitelist**: Pre-approved safe commands
- **Blacklist**: Dangerous operations blocked
- **Confirmation**: User approval for risky commands
- **Sandboxing**: Isolated execution environment

### Privacy Protection
- **Local Processing**: No data sent to external servers (optional)
- **Encrypted Storage**: Secure API key storage
- **Activity Logs**: Local audit trails only
- **Opt-out Options**: Disable cloud features entirely

## 🚀 Advanced Features

### Multi-Agent System
- **Code Generator**: Specialized in file creation
- **DevOps Agent**: Deployment and infrastructure
- **System Monitor**: Performance and health tracking
- **Security Agent**: Vulnerability scanning

### Plugin Architecture
```javascript
// Example plugin structure
{
  "plugins": {
    "custom_automation": {
      "enabled": true,
      "script": "plugins/custom.js",
      "triggers": ["deploy", "backup", "monitor"]
    }
  }
}
```

### Integration APIs
- **REST Endpoints**: Full API access
- **WebSocket Events**: Real-time updates
- **Webhook Support**: External service integration
- **CLI Scripting**: Automated task execution

## 📱 Mobile Features

### Termux Optimizations
- **Battery Efficient**: Optimized for mobile power consumption
- **Background Mode**: Runs as Android service
- **Notification Integration**: System alerts and updates
- **Storage Access**: Full device file system access

### Voice Assistant
- **Always-on Listening**: "Hey Assistant" wake word
- **Context Awareness**: Remembers conversation history
- **Multi-tasking**: Handle multiple requests simultaneously
- **Offline Fallback**: Works without internet connection

## 🌍 Remote Access & Sharing

### Ngrok Integration
```bash
# Start with public URL
./cyber-assistant.sh start --remote

# Share your assistant:
https://abc123.ngrok-free.app
```

### Team Collaboration
- **Shared Sessions**: Multiple users can connect
- **Role-based Access**: Different permission levels
- **Activity Sharing**: Collaborative command execution
- **Remote Support**: Help others with their tasks

## 📚 Documentation

### Command Reference
- **Natural Language**: Examples of supported phrases
- **Direct Commands**: Shell command execution
- **Voice Commands**: Speech recognition patterns
- **Automation Scripts**: Pre-built workflows

### Troubleshooting
- **Common Issues**: Setup and configuration problems
- **Error Messages**: Detailed error explanations
- **Performance Tips**: Optimization recommendations
- **Community Support**: GitHub issues and discussions

## 🤝 Contributing

```bash
# Fork and clone
git clone https://github.com/YOUR_USERNAME/cyber-shell-x-nexus.git

# Create feature branch
git checkout -b feature/amazing-feature

# Make changes and test
./cyber-assistant.sh status

# Submit pull request
```

## 📄 License

Open source under MIT License. Free for personal and commercial use.

## 🚀 Interactive Menu System

### 📋 Universal Launcher Options
```
🚀 Select Launch Mode:

 1) 🖥️  CLI Interface        - Enhanced AI-powered command line
 2) 🌐 Web Interface       - Full dashboard with multiple AI tools
 3) 📱 Android Server      - Mobile voice assistant backend
 4) 📲 Termux Optimizer    - Termux-specific optimizations
 5) 🔄 System Update       - Update from GitHub repository
 6) ⚙️  Configuration      - Setup AI providers and settings
 7) 📊 System Status       - Detailed system health check
 8) 🛠️  Development        - Development mode with live reload
 9) 📚 Documentation      - View guides and help
10) 🛑 Stop All Services   - Shutdown running processes

 0) ❌ Exit
```

### 🌐 Web Interface Sub-Menu
```
🌐 Web Interface Options:

 1) 🎯 AI Agent           - Advanced coding assistant (like Manus AI, Replit AI)
 2) 💻 Command Assistant  - Natural language command interface
 3) 📊 System Dashboard   - Complete system monitoring and control
 4) 🔧 API Manager       - Manage AI providers and settings
 5) 📱 Mobile Interface   - Touch-optimized mobile interface
 6) 🚀 All Interfaces    - Launch complete system

 0) ⬅️  Back to Main Menu
```

## 🎯 Quick Access Commands

### 🚀 Direct Launch Commands
```bash
# Direct launches (bypass menu)
./launcher.sh cli          # AI-powered CLI interface
./launcher.sh web          # Web interface selection menu
./launcher.sh android      # Android voice assistant
./launcher.sh termux       # Termux optimization
./launcher.sh update       # System update
./launcher.sh status       # Detailed status check
./launcher.sh dev          # Development mode
```

### 🔧 System Management
```bash
# System operations
./launcher.sh stop         # Stop all services
./launcher.sh --help       # Show help
./cyber-assistant.sh setup # Initial AI configuration
./cyber-assistant.sh start # Direct server start
```

## 📚 Feature Comparison

| Feature | AI Agent | Command Assistant | CLI Interface |
|---------|----------|-------------------|---------------|
| Code Generation | ✅ Advanced | ⚠️ Basic | ✅ Advanced |
| Project Scaffolding | ✅ Full | ❌ No | ✅ Full |
| Real-time Execution | ✅ Yes | ✅ Yes | ✅ Yes |
| Voice Input | ❌ No | ✅ Yes | ❌ No |
| Multi-language | ✅ JS/Python/TS/etc | ⚠️ Shell only | ✅ All |
| File Management | ✅ Full CRUD | ⚠️ Basic | ✅ Full |
| Git Integration | ✅ Yes | ⚠️ Commands only | ✅ Yes |
| Package Management | ✅ Auto | ❌ Manual | ✅ Auto |
| Debugging | ✅ AI-powered | ❌ Manual | ✅ AI-powered |
| Mobile Optimized | ✅ Yes | ✅ Yes | ❌ No |

## 🙏 Support & Community

**Developer**: Mulky Malikul Dhaher
- **GitHub**: [@mulkymalikuldhrs](https://github.com/mulkymalikuldhrs)
- **Repository**: https://github.com/mulkymalikuldhrs/cyber-shell-x-nexus
- **Issues**: GitHub Issues for bugs and feature requests
- **Discussions**: GitHub Discussions for community support
- **Donations**: Indonesian e-wallets (+6285322624048)

### 🤝 Contributing
```bash
# Fork and contribute
git clone https://github.com/YOUR_USERNAME/cyber-shell-x-nexus.git
cd cyber-shell-x-nexus
git checkout -b feature/amazing-feature

# Make changes and test
./launcher.sh dev

# Submit pull request
```

### 📄 License
Open source under MIT License. Free for personal and commercial use.

---

**"Transform your Android device into a powerful AI-assisted coding environment!"** 🚀🤖💻

**Like Manus AI, Replit AI, Bolt AI - but optimized for Termux Android!**

Built with ❤️ for the Termux and AI coding communities.
