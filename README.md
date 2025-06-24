# CyberShellX Nexus 🛡️

**Advanced Cybersecurity AI Assistant & Terminal Interface**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D20.0.0-brightgreen)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18.3.1-blue)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6.3-blue)](https://www.typescriptlang.org/)

## 🚀 Overview

CyberShellX Nexus is a comprehensive cybersecurity platform featuring an AI-powered assistant, interactive terminal interface, and cross-platform voice commands. Designed for security professionals, penetration testers, and cybersecurity enthusiasts.

### 🎯 Key Features

- **🧠 AI-Powered Assistant**: Advanced knowledge base with 50+ security tools
- **💻 Interactive Terminal**: Real-time command processing and demonstrations
- **📱 Android Voice Assistant**: Replace Google Assistant with cybersecurity commands
- **🔒 Multi-Platform Security**: Windows, Linux, Android (Termux) support
- **☁️ Cloud Integration**: Supabase sync and data analytics
- **🎓 Learning Platform**: Interactive scenarios from beginner to advanced

## 🛠️ Technology Stack

| Component | Technology |
|-----------|------------|
| **Frontend** | React 18, TypeScript, Vite, Tailwind CSS |
| **Backend** | Express.js, Node.js, WebSocket |
| **Database** | PostgreSQL, Drizzle ORM |
| **Mobile** | Kotlin, Jetpack Compose, Android SDK |
| **AI Engine** | Custom knowledge base with 6 security categories |
| **Cloud** | Supabase, Real-time sync |

## 🚀 Quick Start

### Option 1: Replit (Recommended)
```bash
# Clone the repository
git clone https://github.com/mulkymalikuldhrs/cyber-shell-x-nexus.git
cd cyber-shell-x-nexus

# The application runs automatically on Replit
# Access via webview panel on port 5000
```

### Option 2: Local Development
```bash
# Prerequisites: Node.js 20+, PostgreSQL
npm install
export DATABASE_URL="postgresql://user:pass@localhost:5432/cybershellx"
npm run db:push
npm run dev
```

### Option 3: Android/Termux
```bash
# See TERMUX_SETUP.md for complete instructions
pkg install nodejs postgresql python
cd android-assistant
./build-apk.sh
```

## 📱 Android Voice Assistant

Replace Google Assistant with CyberShellX AI:

1. **Build APK**: `cd android-assistant && ./build-apk.sh`
2. **Install**: Transfer APK to device or use `./install-apk.sh`
3. **Configure**: Set as default assistant in Android settings
4. **Use**: Say "Hey CyberShell" + your command

**Features:**
- Wake word detection ("Hey CyberShell")
- Always-listening background service
- Voice-to-text cybersecurity commands
- Text-to-speech responses
- WebSocket integration with main server

## 🔧 Available Commands

### Network Security
- `nmap scan` - Network reconnaissance and port scanning
- `wireshark capture` - Network traffic analysis
- `netstat check` - Active connections monitoring

### Web Security
- `sql injection` - Database vulnerability testing
- `burp suite` - Web application security testing
- `vulnerability assessment` - Comprehensive security audit

### Forensics & Analysis
- `volatility analyze` - Memory forensics investigation
- `hashcat crack` - Password recovery and analysis
- `autopsy investigate` - Digital evidence examination

### System Security
- `system info` - Comprehensive system analysis
- `log analysis` - Security event investigation
- `process monitor` - Runtime security monitoring

## 🎓 Learning Modules

### Interactive Scenarios
- **Beginner**: Network discovery, log analysis
- **Intermediate**: Web app testing, wireless security
- **Advanced**: APT simulation, memory forensics

### Knowledge Base
- OWASP Top 10 vulnerabilities
- NIST Cybersecurity Framework
- Ethical hacking methodologies
- Digital forensics procedures

## 🔒 Security & Ethics

**Legal Compliance:**
- Always obtain proper authorization
- Follow responsible disclosure practices
- Respect privacy and confidentiality
- Educational use only

**Built-in Safeguards:**
- Legal warnings for security tools
- Ethical guidelines integration
- Authorization reminders
- Educational focus

## 📊 Data Storage

### Local Storage
- PostgreSQL for core functionality
- SQLite for mobile applications
- Real-time data processing

### Cloud Integration
- Supabase for cross-device sync
- Command history analytics
- AI learning data collection
- User preferences backup

## 🤝 Contributing

We welcome contributions to CyberShellX Nexus:

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Mulky Malikul Dhaher**
- Cybersecurity Expert & AI Developer
- GitHub: [@mulkymalikuldhrs](https://github.com/mulkymalikuldhrs)

## 🙏 Support

If you find CyberShellX Nexus helpful, consider supporting the development:

<div align="center">

### 💝 Support Development

Your support helps maintain and improve CyberShellX Nexus

</div>

---

<div align="center">

**⚡ CyberShellX Nexus - Empowering Cybersecurity Professionals ⚡**

[Website](https://cybershellx-nexus.replit.app) • [Documentation](./docs) • [Android App](./android-assistant) • [Issues](https://github.com/mulkymalikuldhrs/cyber-shell-x-nexus/issues)

</div>