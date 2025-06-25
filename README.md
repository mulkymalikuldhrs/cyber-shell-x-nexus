
# CyberShellX Nexus 🛡️

Advanced cybersecurity platform with AI-powered assistant, interactive terminal interface, and cross-platform capabilities.

## Quick Start

### Main Launcher
```bash
./launcher.sh              # Interactive menu (recommended)
./launcher.sh cli          # 01. CLI cybersecurity shell
./launcher.sh web          # 02. Web server
./launcher.sh android      # 03. Android voice assistant backend
./launcher.sh update       # 04. Update system from GitHub
./launcher.sh status       # 05. System health check
```

Choose from:
1. **CLI Terminal Interface** - Enhanced cybersecurity shell with AI integration
2. **Web Server** - Full desktop/laptop browser interface with AI enhancement
3. **Termux Server** - Mobile-optimized web interface for Android browsers
4. **Android Server** - Backend server for voice assistant mobile app
5. **Update System** - Pull latest changes and update all dependencies

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

### AI-Powered Responses
- **Multiple API Support** - Automatic fallback between 4 Gemini API endpoints
- **Enhanced Responses** - AI-powered cybersecurity guidance and explanations
- **Intelligent Fallback** - Seamless switching when APIs are unavailable
- **Real-time Status** - Monitor API health and current active endpoint

### CLI Interface (Option 1)
- Interactive cybersecurity terminal
- Tool simulations: nmap, metasploit, wireshark, sqlmap, burpsuite
- Educational command demonstrations
- Cross-platform compatibility

### Web Interface (Option 2)
- Modern React-based UI
- Real-time terminal simulation
- Cybersecurity tool demonstrations
- Database integration with PostgreSQL
- Responsive design with dark theme

### Android App (Option 3)
- Voice-activated assistant with "Hey CyberShell" wake word
- Background service for always-on functionality
- System control (WiFi, Bluetooth, flashlight, volume)
- Shell command execution capabilities
- AI-powered cybersecurity guidance

## Architecture

- **Frontend**: React 18 + TypeScript + Vite
- **Backend**: Express.js + TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Mobile**: Native Android with voice recognition
- **CLI**: Node.js-based terminal interface

## Access Points

- Web Interface: http://localhost:5000
- CLI: Direct terminal access
- Android: APK installation from build output

## Development

```bash
# Database operations
npm run db:push          # Apply schema changes
npm run build           # Production build
npm run start           # Production server

# Main launcher (recommended)
./launcher.sh           # Interactive menu
./launcher.sh cli       # CLI interface only
./launcher.sh web       # Web server only
./launcher.sh status    # Health check

# Alternative launchers  
./cyber.sh              # Command shortcuts
./start.sh              # Quick launcher
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
