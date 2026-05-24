<a href="https://github.com/mulkymalikuldhrs/cyber-shell-x-nexus">
  <img align="center" src="https://capsule-render.vercel.app/api?type=wave&color=0:0d1117,50:161b22,100:1f6feb&height=180&section=header&text=CyberShellX%20Nexus&fontSize=42&fontColor=58a6ff&animation=fadeIn&fontAlignY=32&desc=Advanced%20Cybersecurity%20Platform%20with%20AI-Powered%20Assistant&descSize=18&descColor=8b949e&descAlignY=52" />
</a>

<div align="center">

[![Typing SVG](https://readme-typing-svg.demolab.com?font=Fira+Code&size=22&duration=3000&pause=1000&color=58A6FF&center=true&vCenter=true&width=600&lines=AI-Powered+Cybersecurity+Platform;Multi-API+Gemini+Integration;Cross-Platform+Terminal+%2B+Web+%2B+Android;Interactive+Security+Training+%26+Education)](https://git.io/typing-svg)

</div>

<div align="center">

[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Cybersecurity](https://img.shields.io/badge/Cybersecurity-AI%20Powered-00CED1?style=for-the-badge&logo=shield-check&logoColor=white)](https://github.com/mulkymalikuldhrs/cyber-shell-x-nexus)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Version](https://img.shields.io/badge/Version-1.0.0-1f6feb?style=for-the-badge)](https://github.com/mulkymalikuldhrs/cyber-shell-x-nexus/releases)

</div>

<div align="center">

**Language / Bahasa / 语言**

[![EN](https://img.shields.io/badge/EN-English-blue?style=flat-square)](README.md)
[![ID](https://img.shields.io/badge/ID-Bahasa%20Indonesia-red?style=flat-square)](README_id.md)
[![CN](https://img.shields.io/badge/CN-中文-green?style=flat-square)](README_zh.md)

</div>

---

## Overview

**CyberShellX Nexus** is an advanced, cross-platform cybersecurity platform that integrates artificial intelligence to deliver real-time security guidance, interactive tool demonstrations, and educational training scenarios. Built with a modern TypeScript/React stack and powered by Google Gemini AI with a resilient multi-API fallback system, the platform provides cybersecurity professionals, students, and enthusiasts with an intelligent companion for network analysis, vulnerability assessment, penetration testing methodology, digital forensics, and much more.

The platform operates across three distinct interfaces: a command-line terminal for power users, a browser-based web dashboard for interactive exploration, and a native Android voice assistant for on-the-go security consulting. Each interface connects to the same AI-powered backend, ensuring consistent and enriched responses regardless of the access method. CyberShellX Nexus emphasizes ethical hacking and responsible disclosure, embedding legal notices and ethical guidelines throughout every interaction.

This project is part of the broader cybersecurity ecosystem alongside [HermesQuantOS](https://github.com/mulkymalikuldhrs/HermesQuantOS), sharing architectural patterns and AI integration strategies for next-generation security tooling.

---

## Features

### AI-Powered Cybersecurity Assistant
- **Multi-API Gemini Integration** -- Automatic fallback between 4 Gemini API endpoints ensuring uninterrupted service even when individual APIs experience downtime or rate limiting
- **Intelligent Command Processing** -- Context-aware analysis of cybersecurity commands covering network scanning, vulnerability assessment, exploitation, forensics, wireless security, and cryptography
- **Enhanced AI Responses** -- Base responses are augmented with real-time Gemini AI analysis, adding technical depth, practical examples, and current best practices
- **Real-Time API Health Monitoring** -- Live status tracking of all API endpoints with automatic switching on failure detection
- **Ethical Guidelines Engine** -- Every response includes appropriate legal notices and responsible disclosure reminders

### Command-Line Interface
- Interactive cybersecurity terminal with AI integration
- Tool simulations: nmap, metasploit, wireshark, sqlmap, burpsuite, hashcat, aircrack-ng
- Educational command demonstrations with detailed explanations
- Cross-platform compatibility (Linux, macOS, Termux on Android)
- Difficulty-level classification (beginner, intermediate, advanced)

### Web Dashboard
- Modern React 18 + TypeScript + Vite application
- Real-time terminal simulation with WebSocket support
- Cybersecurity tool demonstrations and interactive scenarios
- PostgreSQL database integration with Drizzle ORM
- Responsive design with professional dark theme
- Radix UI component library with shadcn/ui styling

### Android Voice Assistant
- Voice-activated assistant with "Hey CyberShell" wake word detection
- Background service for always-on functionality
- System control capabilities (WiFi, Bluetooth, flashlight, volume)
- Shell command execution interface
- AI-powered cybersecurity guidance through natural conversation

### Interactive Training Scenarios
- Beginner: Network discovery, log analysis exercises
- Intermediate: Web application testing, wireless security assessment
- Advanced: APT simulation, memory forensics investigation
- Learning prompts covering OWASP Top 10, penetration testing phases, responsible disclosure

---

## Installation

### Prerequisites
- **Node.js** 18+ and npm
- **PostgreSQL** database (for web interface)
- **Git** for cloning and updates

### Quick Start

```bash
# Clone the repository
git clone https://github.com/mulkymalikuldhrs/cyber-shell-x-nexus.git
cd cyber-shell-x-nexus

# Install dependencies
npm install

# Set up database schema
npm run db:push

# Launch with interactive menu (recommended)
./launcher.sh
```

### Launch Modes

```bash
./launcher.sh              # Interactive menu (recommended)
./launcher.sh cli          # CLI cybersecurity shell
./launcher.sh web          # Web server on port 5000
./launcher.sh android      # Android voice assistant backend
./launcher.sh update       # Update system from GitHub
./launcher.sh status       # System health check
```

### Termux (Android)

```bash
# Download and run installer
curl -o termux-install.sh https://raw.githubusercontent.com/mulkymalikuldhrs/cyber-shell-x-nexus/main/termux-install.sh
chmod +x termux-install.sh
./termux-install.sh

# Launch
cd ~/cyber-shell-x-nexus
./run.sh
```

### Environment Variables

Create a `.env` file in the project root:

```env
# Gemini API Keys (at least one required for AI features)
GOOGLE_API_KEY=your_primary_gemini_api_key
GOOGLE_API_KEY_2=your_secondary_gemini_api_key
GEMINI_API_KEY=alternative_gemini_api_key

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/cybershellx

# Server
PORT=5000
NODE_ENV=development
```

---

## Usage

### CLI Terminal

The command-line interface provides an interactive cybersecurity shell with AI-powered explanations:

```bash
node cli-interface.js
```

Available command categories:
- **Network Security**: `scan network`, `nmap`, `wireshark`, `netstat`
- **Vulnerability Assessment**: `check vulnerabilities`, `nikto`, `openvas`
- **Exploitation**: `metasploit`, `sql injection`, `burp suite`
- **Forensics**: `volatility`, `autopsy`, `memory analysis`
- **Wireless**: `aircrack`, `wireless security`, `wifi scan`
- **Cryptography**: `password crack`, `hashcat`, `john ripper`
- **System**: `system info`, `process monitor`, `log analysis`

### Web Interface

Start the web server and navigate to `http://localhost:5000`:

```bash
npm run dev
```

The web interface features:
- Interactive terminal with AI chat
- Real-time WebSocket communication
- Tool installation and management
- Penetration testing environment preparation
- Session management and command history

### Android App

Build and install the Android voice assistant:

```bash
cd android-assistant
./build-apk.sh
./install-apk.sh
```

---

## Project Structure

```
cyber-shell-x-nexus/
├── client/                        # React frontend
│   ├── src/
│   │   ├── components/            # React components (UI + custom)
│   │   │   ├── ui/               # shadcn/ui Radix components
│   │   │   ├── CyberShellXTerminal.tsx
│   │   │   ├── Hero.tsx
│   │   │   ├── FeatureCard.tsx
│   │   │   └── ...
│   │   ├── pages/                # Application pages
│   │   ├── hooks/                # Custom React hooks
│   │   └── lib/                  # Utilities and query client
│   └── index.html
├── server/                        # Express backend
│   ├── index.ts                  # Server entry point
│   ├── routes.ts                 # API endpoints + WebSocket
│   ├── cybershell-ai.ts          # AI command processing engine
│   ├── gemini-api.ts             # Multi-API Gemini fallback manager
│   ├── storage.ts                # Database storage layer
│   ├── db.ts                     # Database connection
│   ├── supabase-integration.ts   # Supabase client integration
│   └── vite.ts                   # Vite dev/prod middleware
├── shared/                        # Shared types and schemas
│   └── schema.ts                 # Drizzle ORM database definitions
├── android-assistant/             # Native Android voice assistant
│   ├── app/src/main/java/        # Kotlin source code
│   ├── build-apk.sh              # APK build script
│   └── install-apk.sh            # APK installation script
├── cybershell-commands/           # AI knowledge base
│   ├── commands.json             # Tool definitions and scenarios
│   └── ai-knowledge-base.md      # AI training reference data
├── scripts/                       # Utility scripts
│   ├── health-check.js           # System verification
│   ├── verify-repo.js            # Repository validation
│   └── fix-build.js              # Build troubleshooting
├── docs/                          # Documentation
│   ├── API.md                    # API reference
│   └── TROUBLESHOOTING.md        # Common issues and solutions
├── launcher.sh                    # Main interactive launcher
├── cli-interface.js               # CLI terminal interface
├── drizzle.config.ts             # Database migration config
├── vite.config.ts                # Frontend build configuration
├── tailwind.config.ts            # Tailwind CSS configuration
├── tsconfig.json                 # TypeScript configuration
└── package.json                  # Dependencies and scripts
```

---

## API Reference

| Endpoint | Method | Description |
|---|---|---|
| `/api/command` | POST | Process cybersecurity commands with AI enhancement |
| `/api/learning-prompt` | GET | Retrieve random educational learning prompts |
| `/api/scenario/:difficulty` | GET | Get interactive scenario by difficulty level |
| `/api/ethics` | GET | Retrieve ethical hacking guidelines |
| `/api/ai/status` | GET | Check AI API health and fallback status |
| `/ws/cybershell` | WS | Real-time WebSocket for terminal communication |

See [API Documentation](docs/API.md) for detailed request/response formats.

---

## Architecture

The platform follows a modular monorepo architecture with clear separation between frontend, backend, shared schemas, mobile application, and AI processing layers.

- **Frontend**: React 18 + TypeScript + Vite + Tailwind CSS + shadcn/ui
- **Backend**: Express.js + TypeScript with WebSocket support
- **Database**: PostgreSQL with Drizzle ORM + Supabase integration
- **AI Engine**: Google Gemini 2.5 Flash/Pro with 4-endpoint fallback system
- **Mobile**: Native Android (Kotlin) with voice recognition and background services
- **CLI**: Node.js terminal interface with command parsing

See [ARCHITECTURE.md](ARCHITECTURE.md) for the complete system design document.

---

## Security Notice

This platform is designed **exclusively** for educational and authorized security testing purposes. All command explanations and tool demonstrations include legal notices emphasizing the requirement for proper authorization. Users are solely responsible for ensuring compliance with all applicable local, national, and international laws and regulations. Unauthorized access to computer systems is illegal in most jurisdictions. Always obtain explicit written permission before testing any systems or networks.

---

<div align="center">

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

</div>

<a href="https://github.com/mulkymalikuldhrs/cyber-shell-x-nexus">
  <img align="center" src="https://capsule-render.vercel.app/api?type=wave&color=0:1f6feb,50:161b22,100:0d1117&height=120&section=footer" />
</a>
---

## 🤝 Contributing

Contributions are welcome! We encourage the community to help improve this project.

1. **Fork** the repository
2. Create a **feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. Open a **Pull Request**

Please make sure to update tests as appropriate and follow the existing code style.

---

## 📬 Contact

**Mulky Malikul Dhaher** — [mulkymalikuldhaher@email.com](mailto:mulkymalikuldhaher@email.com)

GitHub: [https://github.com/mulkymalikuldhrs](https://github.com/mulkymalikuldhrs)

---

## ⚠️ Disclaimer

**For Education Purpose Only**

This project is provided strictly for educational and research purposes. The authors and contributors assume **no responsibility or liability** for any damages, losses, or risks arising from the use of this software. **We do not bear any responsibility or risk** for how this software is used.

**Contact:** Mulky Malikul Dhaher | mulkymalikuldhaher@email.com

---

### 🇮🇩 Disclaimer (Bahasa Indonesia)

**Hanya untuk Tujuan Pendidikan**

Proyek ini disediakan secara ketat untuk tujuan pendidikan dan penelitian. Penulis dan kontributor tidak menanggung **tanggung jawab atau risiko** atas kerusakan, kerugian, atau risiko yang timbul dari penggunaan perangkat lunak ini. **Kami tidak menanggung tanggung jawab atau risiko** atas bagaimana perangkat lunak ini digunakan.

**Kontak:** Mulky Malikul Dhaher | mulkymalikuldhaher@email.com

---

### 🇨🇳 免责声明 (中文)

**仅供教育目的**

本项目严格仅供教育和研究目的。作者和贡献者对因使用本软件而产生的任何损害、损失或风险**不承担任何责任**。**我们不承担任何责任或风险**对于本软件的使用方式。

**联系方式:** Mulky Malikul Dhaher | mulkymalikuldhaher@email.com

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

Copyright © Mulky Malikul Dhaher. All rights reserved.

