
# CyberShellX Installation Guide

## 🚀 Quick Start

### Prerequisites
- Python 3.7+ installed
- Node.js and npm (for web interface development)
- Terminal/Command Prompt access

### Step 1: Install Python Dependencies
```bash
# Clone or download the CyberShellX files
# Navigate to the project directory

# Install Python requirements
pip install -r requirements.txt

# Or install manually:
pip install colorama requests pexpect websockets
```

### Step 2: Set up CyberShellX Environment
```bash
# Run the installer script
python3 install_cybershellx.py

# This will create:
# - ~/.cybershellx/ directory
# - Configuration files
# - Tool directories
```

### Step 3: Start the Web Server
```bash
# Start the CyberShellX web server
python3 cybershellx_server.py
```

You should see:
```
╔══════════════════════════════════════════════════════════════════╗
║                  CyberShellX Web Server                          ║
║           Web Interface for CyberShellX AI                       ║
║                                                                  ║
║             Created by Mulky Maliku Dhaher                       ║
╚══════════════════════════════════════════════════════════════════╝

Starting WebSocket server on localhost:8765
CyberShellX Web Server started!
WebSocket server: ws://localhost:8765
Web interface will be available at: http://localhost:5173
Connect your web browser to start using CyberShellX!
```

### Step 4: Access Web Interface

#### Option A: Using this Lovable Development Server
1. Open your browser to: `http://localhost:5173`
2. Click the "Live Terminal" tab
3. Click "Connect" to connect to your Python server
4. Start using CyberShellX!

#### Option B: Using Standalone Python Terminal
```bash
# Run the standalone terminal version
python3 cybershellx.py
```

## 🌐 Web Interface Features

### Live Terminal Tab
- Real-time connection to Python backend
- WebSocket communication
- Interactive command execution
- Status updates and logging
- Session management

### Commands Available via Web Interface

#### Basic Commands
- `help` - Show available commands
- `list tools` - Show installed tools
- `chat <message>` - Chat with AI
- `install <tool>` - Install cybersecurity tools

#### Advanced Operations
- `prepare <environment>` - Set up environments (pentesting, blockchain, etc.)
- `pentest <target> [type]` - Perform automated penetration testing
- `execute <command>` - Execute system commands
- `audit <contract>` - Smart contract security audit

### Quick Start Buttons
The web interface provides quick access buttons for:
- Help documentation
- Tool listing
- Environment preparation
- AI chat initiation

## 🔧 Configuration

### API Keys Setup
Edit the `cybershellx.py` file to add your API keys:

```python
# OpenAI API Key
OPENAI_API_KEY = "sk-proj-your-openai-key-here"

# OpenRouter API Key  
OPENROUTER_API_KEY = "sk-or-v1-your-openrouter-key-here"
```

### Environment Variables (Optional)
```bash
export CYBERSHELLX_OPENAI_KEY="your-openai-key"
export CYBERSHELLX_OPENROUTER_KEY="your-openrouter-key"
```

## 🛠️ Troubleshooting

### Common Issues

#### Connection Failed
- Make sure Python server is running: `python3 cybershellx_server.py`
- Check if port 8765 is available
- Verify firewall settings

#### Module Not Found
```bash
# Install missing dependencies
pip install -r requirements.txt
```

#### Permission Errors
```bash
# On Linux/macOS, you might need:
sudo pip install -r requirements.txt

# Or use virtual environment:
python3 -m venv cybershellx_env
source cybershellx_env/bin/activate  # Linux/macOS
# cybershellx_env\Scripts\activate   # Windows
pip install -r requirements.txt
```

#### WebSocket Connection Issues
- Ensure no other applications are using port 8765
- Try restarting both the Python server and web browser
- Check browser developer console for error messages

## 📱 Platform Support

### Tested Platforms
- ✅ Linux (Ubuntu, Debian, CentOS, Arch)
- ✅ macOS (Intel and Apple Silicon)
- ✅ Windows 10/11 (with WSL recommended)
- ✅ Android (via Termux)
- ✅ Raspberry Pi OS
- ✅ Cloud environments (AWS CloudShell, Google Cloud Shell)

### Platform-Specific Notes

#### Windows
- Install Python from python.org
- Use PowerShell or Command Prompt
- WSL (Windows Subsystem for Linux) recommended for best experience

#### Android (Termux)
```bash
# Install Termux from F-Droid or Google Play
pkg update && pkg upgrade
pkg install python
pip install -r requirements.txt
```

#### Raspberry Pi
```bash
sudo apt update
sudo apt install python3 python3-pip
pip3 install -r requirements.txt
```

## 🔐 Security Notes

- CyberShellX has powerful system access capabilities
- Only run on trusted networks
- Review commands before execution
- Keep API keys secure
- Regular security updates recommended

## 📞 Support

For issues or questions:
1. Check the troubleshooting section above
2. Review the command help: `python3 cybershellx.py` then type `help`
3. Check the logs in `~/.cybershellx/activity.log`

## 🎯 Next Steps

Once installed and running:
1. Try the demo commands in the web interface
2. Install your first security tool: `install nmap`
3. Prepare a pentesting environment: `prepare pentesting`
4. Chat with the AI: `chat Hello, what can you help me with?`
5. Explore the learning paths and advanced features

Enjoy using CyberShellX! 🚀
