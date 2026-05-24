# CyberShellX Nexus - Project Structure

```
cyber-shell-x-nexus/
├── 🚀 LAUNCHERS
│   ├── launcher.sh              # Main launcher (recommended)
│   ├── cyber.sh                 # Command shortcuts
│   ├── start.sh                 # Quick start
│   └── run.sh                   # Interactive menu
├── 🖥️  CLI INTERFACE
│   └── cli-interface.js         # Enhanced cybersecurity shell
├── 📁 CORE APPLICATION
│   ├── client/                  # React frontend
│   │   ├── src/
│   │   │   ├── components/      # React components
│   │   │   ├── pages/          # Application pages
│   │   │   └── lib/            # Utilities
│   │   └── index.html
│   ├── server/                  # Express backend
│   │   ├── cybershell-ai.ts    # AI command processing
│   │   ├── gemini-api.ts       # Multi-API fallback
│   │   ├── routes.ts           # API endpoints
│   │   ├── db.ts               # Database connection
│   │   └── index.ts            # Server entry point
│   └── shared/                  # Shared schemas
│       └── schema.ts           # Database definitions
├── 📱 ANDROID APPLICATION
│   ├── android-assistant/       # Android voice assistant
│   ├── build-apk.sh            # APK build script
│   └── install-apk.sh          # APK installation
├── 🧠 AI & COMMANDS
│   ├── cybershell-commands/     # Command database
│   │   ├── commands.json       # Tool definitions
│   │   └── ai-knowledge-base.md # AI training data
│   └── server/gemini-api.ts    # 4-API fallback system
├── 📚 DOCUMENTATION
│   ├── docs/
│   │   ├── API.md              # API documentation
│   │   └── TROUBLESHOOTING.md  # Common issues
│   ├── README.md               # Main documentation
│   ├── TERMUX_SETUP.md         # Termux installation
│   └── PROJECT_STRUCTURE.md    # This file
├── 🔧 UTILITIES & SCRIPTS
│   ├── scripts/
│   │   ├── health-check.js     # System verification
│   │   └── verify-repo.js      # Repository validation
│   ├── update-system.sh        # System updater
│   └── termux-install.sh       # Termux installer
├── 🗄️  DATABASE & CONFIG
│   ├── drizzle.config.ts       # Database config
│   ├── package.json            # Dependencies
│   ├── vite.config.ts          # Frontend build
│   ├── tailwind.config.ts      # Styling
│   └── tsconfig.json           # TypeScript
└── 📋 PROJECT MANAGEMENT
    ├── replit.md               # Project context
    ├── TEST_RESULTS.md         # System verification
    └── .gitignore              # Git exclusions
```

## Entry Points by Priority

### 1. Main Launcher (Primary)
```bash
./launcher.sh           # Interactive menu with all options
```

### 2. Direct Commands
```bash
./launcher.sh cli       # CLI cybersecurity shell
./launcher.sh web       # Web server (port 5000)
./launcher.sh android   # Android voice assistant backend
./launcher.sh update    # System update from GitHub
./launcher.sh status    # Health check verification
```

### 3. Alternative Launchers
```bash
./cyber.sh              # Command shortcuts
./start.sh              # Quick start
./run.sh                # Legacy interactive menu
```

## Component Overview

### 🛡️ Cybersecurity Features
- **Network Scanning**: nmap, masscan simulations
- **Vulnerability Assessment**: nikto, sqlmap, dirb
- **Network Analysis**: wireshark, tcpdump, netstat  
- **Exploitation**: metasploit, hydra, searchsploit
- **AI Enhancement**: Real-time command explanations

### 🤖 AI System
- **Multi-API Fallback**: 4 Gemini API endpoints
- **Intelligent Switching**: Automatic failure recovery
- **Enhanced Responses**: Educational cybersecurity guidance
- **Status Monitoring**: Real-time API health tracking

### 📱 Cross-Platform
- **CLI Interface**: Enhanced terminal with AI integration
- **Web Interface**: Full browser dashboard (desktop/mobile)
- **Android App**: Voice assistant with wake word detection
- **Termux Support**: Mobile terminal optimization

### 🔄 Update System
- **Official Repository**: https://github.com/mulkymalikuldhrs/cyber-shell-x-nexus
- **Automatic Updates**: Git pull with dependency management
- **Repository Verification**: Ensures correct source
- **Fallback Mechanisms**: Multiple update strategies
---

> **Contact:** Mulky Malikul Dhaher — [mulkymalikuldhaher@email.com](mailto:mulkymalikuldhaher@email.com)
>
> **Disclaimer:** This project is for Education Purpose only. Risiko apapun tidak kita tanggung. (We are not responsible for any risks or damages.)
