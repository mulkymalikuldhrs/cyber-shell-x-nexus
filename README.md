# Cyber Assistant 🤖

Advanced AI Assistant system that runs directly in Termux Android without external emulators, connected to a modern Web UI. Accepts natural language prompts (text or voice), translates them into safe shell commands, executes them directly, and sends results in real-time to browsers via WebSocket.

## ⚡ Quick Start

### 🚀 Main Launcher
```bash
./cyber-assistant.sh              # Start AI-enabled web server (default)
./cyber-assistant.sh start        # Same as above
./cyber-assistant.sh cli          # AI-powered CLI interface
./cyber-assistant.sh status       # System health check
./cyber-assistant.sh setup        # Initial configuration
./cyber-assistant.sh help         # Show help
```

### 🌐 Remote Access
```bash
./cyber-assistant.sh start --remote    # Start with Ngrok tunnel for remote access
```

## 🎯 Core Features

### 🧠 AI-Powered Natural Language Processing
- **Convert speech to commands**: "Hey Assistant, list files" → `ls -la`
- **Multi-step automation**: "Setup a React project with TypeScript"
- **Auto-fix failed commands**: Automatically detects and fixes common errors
- **Code generation**: Create Python, Shell, HTML, JavaScript files from descriptions
- **DevOps automation**: Git operations, project setup, deployment

### 🎤 Voice & Real-time Interface
- **Voice Input**: Web Speech API integration for hands-free operation
- **Real-time WebSocket**: Instant bidirectional communication
- **Fullscreen Responsive UI**: Mobile-optimized dark mode interface
- **Activity Logging**: Complete audit trail of all operations
- **Script Saving**: Save command sequences as reusable scripts

### 🔧 Advanced Command Execution
- **Safety Validation**: Dangerous command detection and confirmation
- **Auto-retry**: Smart retry mechanisms for failed operations
- **Multi-agent Support**: Modular plugin system for expansion
- **Direct Termux Integration**: Native execution without emulation overhead

### 🌍 Platform Integration
- **OpenRouter API**: Free LLM access for advanced processing
- **Groq Integration**: Ultra-fast inference
- **Local Fallback**: Works offline with pattern-based recognition
- **Supabase**: Database operations and real-time sync
- **GitHub**: Repository management and deployment
- **Telegram Bot**: Notifications and remote control
- **Google Calendar/Gmail**: Productivity automation

## 📱 Termux Installation

### Automatic Installation
```bash
# Download and run installer
curl -o cyber-assistant-install.sh https://raw.githubusercontent.com/mulkymalikuldhrs/cyber-shell-x-nexus/main/cyber-assistant.sh
chmod +x cyber-assistant-install.sh
./cyber-assistant-install.sh setup
```

### Manual Installation
```bash
# Install dependencies
pkg install nodejs termux-api git curl -y

# Clone repository
git clone https://github.com/mulkymalikuldhrs/cyber-shell-x-nexus.git
cd cyber-shell-x-nexus

# Setup Cyber Assistant
./cyber-assistant.sh setup
./cyber-assistant.sh start
```

## 🚀 Usage Examples

### 🎤 Voice Commands
```
"Hey Assistant, list files"
→ Executes: ls -la

"Create a Python script that downloads files"
→ Generates and creates Python script with requests library

"Setup a React project with TypeScript"
→ Runs: npx create-react-app my-app --template typescript

"Check system status"
→ Runs: uname -a && df -h && free -h

"Install git and setup SSH"
→ Runs: pkg install git openssh && ssh-keygen
```

### 💻 Natural Language Programming
```
"Write a web scraper for news articles"
→ Creates Python script with BeautifulSoup and requests

"Build a REST API with authentication"
→ Generates Express.js server with JWT authentication

"Create a Docker setup for this project"
→ Generates Dockerfile and docker-compose.yml

"Deploy this to GitHub Pages"
→ Sets up GitHub Actions workflow for deployment
```

### 🔧 DevOps Automation
```
"Clone my latest project from GitHub"
→ Executes: git clone [your-repo-url]

"Update all packages and dependencies"
→ Runs: npm update && pkg upgrade

"Backup important files to cloud"
→ Creates backup script and uploads to configured storage

"Setup development environment"
→ Installs tools, creates directories, configures settings
```

## 🌐 Web Interface Features

### Real-time Command Interface
- **Natural Language Input**: Type or speak commands in plain English
- **Command History**: Visual timeline of executed commands
- **Live Output**: Real-time command execution results
- **Auto-completion**: Smart suggestions based on context

### Voice Integration
- **Web Speech API**: Browser-based voice recognition
- **Visual Feedback**: Recording indicators and voice status
- **Multi-language Support**: English, Indonesian, and more
- **Noise Cancellation**: Clear voice command recognition

### Mobile Optimization
- **Touch-first Design**: Optimized for smartphone interaction
- **Fullscreen Mode**: Immersive command interface
- **Gesture Support**: Swipe navigation and touch controls
- **Responsive Layout**: Works on all screen sizes

### Safety & Security
- **Command Validation**: Prevents dangerous operations
- **Confirmation Dialogs**: User approval for risky commands
- **Activity Logging**: Complete audit trail
- **Safe Mode**: Restricted command execution for beginners

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

## 🙏 Support

**Developer**: Mulky Malikul Dhaher
- **GitHub**: [@mulkymalikuldhrs](https://github.com/mulkymalikuldhrs)
- **Repository**: https://github.com/mulkymalikuldhrs/cyber-shell-x-nexus
- **Issues**: GitHub Issues for bugs and features
- **Donations**: Indonesian e-wallets (+6285322624048)

---

**"Transform your Android device into a powerful AI-assisted command center!"** 🚀🤖

Built with ❤️ for the Termux and AI communities.
