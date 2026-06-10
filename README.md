<a href="https://github.com/mulkymalikuldhrs/cyber-shell-x-nexus">
  <img width="100%" src="https://capsule-render.vercel.app/api?type=wave&color=0:0a0e17,50:0d1b2a,100:1b2838&height=220&section=header&text=CyberShellX%20Nexus&fontSize=48&fontColor=00ffff&animation=fadeIn&fontAlignY=32&desc=AI-Powered%20Autonomous%20Cybersecurity%20Platform&descSize=18&descColor=a855f7&descAlignY=52" />
</a>

<div align="center">

<img src="docs/csx-nexus-logo.png" width="120" height="120" alt="CyberShellX Nexus Logo" />

<br/>

[![Typing SVG](https://readme-typing-svg.demolab.com?font=Fira+Code&size=22&duration=3000&pause=1000&color=00FFFF&center=true&vCenter=true&width=700&lines=Multi-Agent+Orchestration+%7C+Multi-LLM+AI;Vulnerability+Scanner+%2B+Recon+Engine+%2B+Risk+Engine;CVSS+v3.1+%2B+5-Layer+Safety+Pipeline;19+Security+Tools+%2B+WebSocket+%2B+JWT+Auth;Cross-Platform%3A+CLI+%2B+Web+%2B+Android)](https://git.io/typing-svg)

<br/>

[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Express](https://img.shields.io/badge/Express-4-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![Gemini](https://img.shields.io/badge/Google-Gemini-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://ai.google.dev/)
[![Version](https://img.shields.io/badge/Version-3.0.0-00CED1?style=for-the-badge&logo=semver&logoColor=white)](https://github.com/mulkymalikuldhrs/cyber-shell-x-nexus)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge&logo=opensourceinitiative&logoColor=white)](LICENSE)

<br/>

[![GitHub Stars](https://img.shields.io/github/stars/mulkymalikuldhrs/cyber-shell-x-nexus?style=for-the-badge&logo=github&color=gold)](https://github.com/mulkymalikuldhrs/cyber-shell-x-nexus/stargazers)
[![GitHub Forks](https://img.shields.io/github/forks/mulkymalikuldhrs/cyber-shell-x-nexus?style=for-the-badge&logo=github&color=blue)](https://github.com/mulkymalikuldhrs/cyber-shell-x-nexus/fork)
[![GitHub Issues](https://img.shields.io/github/issues/mulkymalikuldhrs/cyber-shell-x-nexus?style=for-the-badge&logo=github&color=red)](https://github.com/mulkymalikuldhrs/cyber-shell-x-nexus/issues)
[![GitHub Pull Requests](https://img.shields.io/github/issues-pr/mulkymalikuldhrs/cyber-shell-x-nexus?style=for-the-badge&logo=github&color=green)](https://github.com/mulkymalikuldhrs/cyber-shell-x-nexus/pulls)

<br/>

**Language / Bahasa / 语言**

[![EN](https://img.shields.io/badge/EN-English-blue?style=flat-square)](README.md)
[![ID](https://img.shields.io/badge/ID-Bahasa%20Indonesia-red?style=flat-square)](README_id.md)
[![CN](https://img.shields.io/badge/CN-中文-green?style=flat-square)](README_zh.md)

</div>

---

## Overview

**CyberShellX Nexus v3.0** is a comprehensive, AI-powered cybersecurity platform that integrates multi-agent orchestration, multi-LLM intelligence, vulnerability scanning, reconnaissance engines, and risk assessment into a single unified system. Built with a modern TypeScript/React stack, the platform provides cybersecurity professionals, students, and enthusiasts with an intelligent companion for security assessment, penetration testing methodology, vulnerability research, and education.

The platform operates across three distinct interfaces: a command-line terminal for power users, a browser-based web dashboard with dedicated pages for scanning, reconnaissance, agent monitoring, tool management, risk assessment, and reporting, plus a native Android voice assistant for on-the-go security consulting. Each interface connects to the same AI-powered backend, ensuring consistent and enriched responses regardless of the access method. CyberShellX Nexus emphasizes ethical hacking and responsible disclosure, embedding legal notices and ethical guidelines throughout every interaction via a 5-layer safety pipeline.

### Key Features at a Glance

<table>
<tr>
<td width="50%">

🤖 **Multi-Agent Orchestration** — 5 specialized AI agents (Recon, Vuln, Exploit, Analysis, Report) with PTES 5-phase pipeline coordination

🧠 **Multi-LLM AI Router** — Gemini, OpenAI, Claude, Ollama with priority fallback chain, SHA256 caching, and automatic provider switching

🔍 **Vulnerability Scanner** — 50+ regex entry points, 7 vuln types (LFI, RCE, XSS, AFO, SSRF, SQLI, IDOR), LLM-powered analysis, confidence scoring

👁️ **Reconnaissance Engine** — 20+ passive subdomain sources, TLS fingerprinting, JS secret scanning, security headers, tech fingerprinting

</td>
<td width="50%">

📊 **Risk Engine** — CVSS v3.1 scoring, Bayesian false positive reduction, business impact calculator, weighted risk scoring

🛡️ **5-Layer Safety Pipeline** — Guardrails → Validation → Fact-check → Consistency → Correction with scope validation and legal notices

🔧 **19 Security Tools** — nmap, nuclei, sqlmap, ffuf, gobuster and more with 3 safety levels and simulated execution

🔐 **JWT Authentication** — scrypt password hashing, API key management, role-based access (admin, analyst, user)

📡 **Real-time WebSocket** — Live scan progress, agent status, notifications via Discord/Slack/Telegram webhooks

</td>
</tr>
</table>

---

## What's New in v3.0

This is a major upgrade that consolidates the best concepts and implementations from multiple open-source cybersecurity projects into a single, cohesive platform. Every integration is honestly documented with full attribution to original sources.

### Multi-LLM Provider System
- Abstract LLM interface supporting **Google Gemini, OpenAI, Anthropic Claude, and Ollama** (local)
- Priority-based fallback chain with automatic provider switching on failure
- Provider registry pattern with auto-registration from environment variables
- Response caching with SHA256 keys and 30-minute TTL
- *Concept inspired by*: [vulnhuntr](https://github.com/protectai/vulnhuntr) (multi-LLM abstraction), [Zen-AI-Pentest](https://github.com/mulkymalikuldhrs/Zen-Ai-Pentest) (multi-LLM routing), [PentestGPT](https://github.com/GreyDGL/PentestGPT) (provider registry)

### Multi-Agent Orchestration
- **BaseAgent** class with message queue, inbox, and lifecycle management
- 5 specialized agents: **ReconAgent, VulnAgent, ExploitAgent, AnalysisAgent, ReportAgent**
- **AgentOrchestrator** for multi-agent coordination with 5-phase PTES pipeline
- Inter-agent messaging (broadcast, direct, role-based)
- *Concept inspired by*: [Zen-AI-Pentest](https://github.com/mulkymalikuldhrs/Zen-Ai-Pentest) (agent system), [god-eye](https://github.com/mulkymalikuldhrs/god-eye) (8 specialized agents), [Shannon](https://github.com/KeygraphHQ/shannon) (multi-agent pipeline), [PentestGPT](https://github.com/GreyDGL/PentestGPT) (tripartite architecture)

### Vulnerability Scanner
- Entry point detection using **50+ regex patterns** for 20+ web frameworks
- Iterative context-enriched analysis loop (up to 7 iterations per vulnerability)
- **7 vulnerability type analyzers**: LFI, RCE, XSS, AFO, SSRF, SQLI, IDOR
- Confidence scoring (0-10) and false positive reduction
- PoC generation capability with LLM-powered analysis
- *Implementation derived from*: [vulnhuntr](https://github.com/protectai/vulnhuntr) by Protect AI (Dan McInerney & Marcello Salvati) — iterative context-enriched analysis, 50+ entry point regex patterns, 7 vulnerability classes, confidence scoring, PoC generation

### Reconnaissance Engine
- Subdomain enumeration (20+ passive source simulation)
- DNS resolution, TLS certificate analysis (25+ vendor fingerprints)
- Security headers checking (10+ headers)
- Technology fingerprinting (15+ technologies)
- JavaScript secret scanning (22 regex patterns for API keys/tokens)
- Security score calculation (0-100)
- *Implementation derived from*: [god-eye](https://github.com/mulkymalikuldhrs/god-eye) by Vyntral/Orizon — passive source enumeration, TLS fingerprinting, JS secret scanning, adaptive rate limiting, subdomain takeover detection, CVE matching

### Security Tool Integration Hub
- 19 tool definitions with safety levels (safe/moderate/dangerous)
- Tool executor with command validation and sanitization
- Categories: network, web, fuzzing, exploitation, recon, crypto
- Simulated execution (educational — never runs real attacks)
- *Concept inspired by*: [Zen-AI-Pentest](https://github.com/mulkymalikuldhrs/Zen-Ai-Pentest) (tool registry + executor), [WifiToolX](https://github.com/mulkymalikuldhrs/WifiToolX) (WebSocket command relay)

### Risk Engine
- CVSS v3.1 scoring implementation
- False positive reduction engine with Bayesian-influenced assessment
- Business impact calculator with asset criticality and data classification
- Weighted risk scoring: CVSS (35%) + Business Impact (25%) + Exploitability (25%) + Confidence (15%)
- *Implementation derived from*: [Zen-AI-Pentest](https://github.com/mulkymalikuldhrs/Zen-Ai-Pentest) (risk engine, CVSS/EPSS scoring, false positive engine, business impact calculator)

### 5-Layer Safety Pipeline
- Layer 1: **Guardrails** — Safety level enforcement
- Layer 2: **Validation** — Input/output validation
- Layer 3: **Fact-check** — CVE database cross-referencing
- Layer 4: **Consistency** — Factual consistency verification
- Layer 5: **Correction** — Auto-correction with retry
- Scope validation blocking private IPs and government domains
- Legal notice enforcement on all responses
- *Implementation derived from*: [Zen-AI-Pentest](https://github.com/mulkymalikuldhrs/Zen-Ai-Pentest) (5-layer safety pipeline, scope validation, output guardrails)

### Authentication System
- JWT-based authentication with scrypt password hashing
- Register/login/session validation routes
- API key management with prefix-based validation
- Role-based access: admin, analyst, user

### Notification System
- Discord webhook with rich embeds
- Slack webhook integration
- Telegram bot notifications
- Email notifications (configurable)
- In-app notifications via WebSocket broadcasting
- *Implementation derived from*: [BruteForceAI](https://github.com/MorDavid/BruteForceAI) by Mor David (Discord/Slack/Telegram webhook implementations)

### Enhanced Web Dashboard (9 Pages + Global Navigation)
- **Dashboard** — Live stats, system health, activity feed, LLM provider status, quick actions
- **Scan Page** — Vulnerability scanner with matrix animation, severity charts, expandable findings
- **Recon Page** — Pipeline progress, subdomains, ports, TLS, headers, tech fingerprint, JS secrets
- **Agents Page** — Communication diagram, agent logs, pipeline visualization, real-time status
- **Tools Page** — Search/filter, target input per tool, category icons, safety levels
- **Risk Page** — Animated SVG gauge, business impact sliders, vuln comparison, FP assessment
- **Reports Page** — Preview panel, 3 format options (MD/HTML/JSON), report statistics
- **Settings Page** — System info, database status, API key management, LLM config, notification setup
- **Auth Page** — Animated background, password strength indicator, remember me

---

## Sources & Attribution

This project integrates concepts, architectures, and implementations derived from the following open-source projects. Full credit goes to the original authors. Every integration has been adapted and rewritten in TypeScript to fit the CyberShellX Nexus architecture.

| Source Project | Original Author | What Was Integrated | License |
|---|---|---|---|
| [vulnhuntr](https://github.com/protectai/vulnhuntr) | Protect AI (Dan McInerney, Marcello Salvati) | Multi-LLM abstraction pattern, iterative context-enriched vulnerability analysis, 50+ web framework entry point detection regex patterns, 7 vulnerability class analyzers (LFI, RCE, XSS, AFO, SSRF, SQLI, IDOR), confidence scoring, PoC generation concept | AGPL-3.0 |
| [Zen-AI-Pentest](https://github.com/mulkymalikuldhrs/Zen-Ai-Pentest) | Mulky Malikul Dhaher | Multi-agent system (BaseAgent, AgentOrchestrator, specialized roles), ReAct agent loop concept, multi-layer memory system concept, tool registry + executor, 5-layer safety pipeline, risk engine with CVSS scoring, false positive reduction, business impact calculator, PTES post-scan workflow, notification system concept | MIT |
| [god-eye](https://github.com/mulkymalikuldhrs/god-eye) | Vyntral / Orizon (Mulky Malikul Dhaher) | Passive subdomain enumeration (20+ sources), TLS certificate fingerprinting (25+ vendors), JavaScript secret scanning regex patterns (API keys, tokens), CISA KEV database concept, NVD CVE API client concept, adaptive rate limiting, stealth mode concepts, security header checking, technology fingerprinting, subdomain takeover detection | MIT |
| [WifiToolX](https://github.com/mulkymalikuldhrs/WifiToolX) | Mulky Malikul Dhaher | WebSocket command relay architecture, AI password candidate generation concept, auto-attack daemon state machine pattern, network scan simulation, session logging system, glassmorphism UI theme | MIT |
| [BruteForceAI](https://github.com/MorDavid/BruteForceAI) | Mor David | LLM-powered form analysis concept, DOM-based success detection concept, webhook notification implementations (Discord, Slack, Teams, Telegram), smart HTML extraction pattern, multi-threaded delay synchronization concept | Non-Commercial (original) |
| [unshackle](https://github.com/Fadi002/unshackle) | Fadi002 | Partition discovery concept, bootable environment architecture concept (not directly integrated — password bypass tools are not included in this educational platform) | GPL-3.0 |
| [Shannon](https://github.com/KeygraphHQ/shannon) | Keygraph | White-box source-code to attack path pipeline concept, "No Exploit, No Report" validation gate concept, resumable workspace pattern, multi-agent orchestration pipeline concept, ephemeral Docker worker concept | AGPL-3.0 |
| [PentestGPT](https://github.com/GreyDGL/PentestGPT) | GreyDGL (Gelei Deng) | Pentesting Task Tree (PTT) state representation concept, tripartite module architecture (reasoning/generation/parsing), multi-LLM provider registry concept, iteration loop with context persistence concept, session persistence & resume concept | MIT |

**Important Notes on Attribution:**
- All implementations have been **rewritten in TypeScript** from the original Python/Go implementations to fit the CyberShellX Nexus architecture. No source code was copied verbatim.
- Concepts and architectural patterns (e.g., iterative context enrichment, PTES pipeline, multi-agent coordination) are ideas that have been adapted, not code that was directly copied.
- Regex patterns for vulnerability detection and secret scanning are functional patterns that cannot be expressed differently and are used under fair use for security education.
- The vulnerability scanner entry point detection patterns were originally developed by Protect AI for vulnhuntr and represent significant research effort.
- This project does NOT include any password bypass, brute force, or attack execution capabilities. All tool executions are simulated for educational purposes only.

---

## Installation

### Prerequisites
- **Node.js** 18+ and npm
- **PostgreSQL** database (for web interface — falls back to in-memory storage if not configured)
- **Git** for cloning and updates

### Quick Start

```bash
# Clone the repository
git clone https://github.com/mulkymalikuldhrs/cyber-shell-x-nexus.git
cd cyber-shell-x-nexus

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your API keys and database URL

# Set up database schema (optional - uses in-memory storage if no DATABASE_URL)
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
# LLM Provider API Keys (at least one required for AI features)
# Google Gemini
GOOGLE_API_KEY=your_primary_gemini_api_key
GOOGLE_API_KEY_2=your_secondary_gemini_api_key
GEMINI_API_KEY=alternative_gemini_api_key
GEMINI_BACKUP_KEY_1=your_backup_key_1
GEMINI_BACKUP_KEY_2=your_backup_key_2

# OpenAI (optional)
OPENAI_API_KEY=your_openai_api_key

# Anthropic Claude (optional)
ANTHROPIC_API_KEY=your_anthropic_api_key

# Ollama (optional, local)
OLLAMA_BASE_URL=http://localhost:11434

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/cybershellx

# Supabase (optional)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your_supabase_service_key
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Authentication
JWT_SECRET=your_jwt_secret_key

# Server
PORT=5000
NODE_ENV=development
```

> ⚠️ **Never commit your `.env` file to version control.** It is listed in `.gitignore` and should remain local.

---

## Usage

### CLI Terminal

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
- **Scanning**: `scan start <target>`, `scan status`, `scan results`
- **Reconnaissance**: `recon start <target>`, `recon status`
- **Agents**: `agents status`, `agents start`
- **Tools**: `tools list`, `tools execute <name> <target>`
- **Risk**: `risk calculate <target>`

### Web Interface

Start the web server and navigate to `http://localhost:5000`:

```bash
npm run dev
```

Pages:
- **Dashboard** — Overview with live stats, system health, activity feed, LLM provider status, quick actions
- **Scanner** — Vulnerability scanner with matrix animation, severity charts, expandable findings, scan history
- **Recon** — Reconnaissance with pipeline progress, subdomains, ports, TLS, headers, tech fingerprint, JS secrets
- **Agents** — Agent monitoring with communication diagram, logs, pipeline visualization, orchestration controls
- **Tools** — Security tool hub with search/filter, target input per tool, category icons, safety levels
- **Risk** — Risk assessment with animated gauge, business impact sliders, vuln comparison, FP assessment
- **Reports** — Report generation with preview panel, 3 format options (MD/HTML/JSON), statistics
- **Settings** — System info, database status, API key management, LLM configuration, notification setup, safety settings
- **Auth** — Login/Register with animated background, password strength indicator, remember me

### Android App

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
│   └── src/
│       ├── components/            # React components (UI + custom)
│       │   ├── Navbar.tsx        # Global navigation bar ★ NEW
│       │   ├── Hero.tsx          # Landing hero section
│       │   ├── TerminalInterface.tsx  # Demo terminal
│       │   ├── CyberShellXTerminal.tsx # Live WebSocket terminal
│       │   └── ui/               # 40+ shadcn/ui Radix components
│       ├── pages/                # Application pages
│       │   ├── Index.tsx         # Dashboard with stats, health, activity
│       │   ├── ScanPage.tsx      # Vulnerability scanner
│       │   ├── ReconPage.tsx     # Reconnaissance engine
│       │   ├── AgentsPage.tsx    # Agent monitoring
│       │   ├── ToolsPage.tsx     # Security tools
│       │   ├── RiskPage.tsx      # Risk assessment
│       │   ├── ReportsPage.tsx   # Report generation
│       │   ├── SettingsPage.tsx  # Platform settings
│       │   └── AuthPage.tsx      # Authentication
│       ├── hooks/                # Custom React hooks
│       └── lib/                  # Utilities and query client
├── server/                        # Express backend
│   ├── index.ts                  # Server entry point
│   ├── routes.ts                 # 30+ API endpoints + WebSocket
│   ├── cybershell-ai.ts          # AI command processing engine
│   ├── gemini-api.ts             # Multi-API Gemini fallback manager
│   ├── llm-providers.ts          # Multi-LLM provider system ★ NEW
│   ├── auth.ts                   # JWT authentication ★ NEW
│   ├── notifications.ts          # Webhook notifications ★ NEW
│   ├── agents/index.ts           # Multi-agent orchestration ★ NEW
│   ├── scanner/index.ts          # Vulnerability scanner ★ NEW
│   ├── recon/index.ts            # Reconnaissance engine ★ NEW
│   ├── tools/index.ts            # Security tool integration ★ NEW
│   ├── risk/index.ts             # Risk engine ★ NEW
│   ├── safety/index.ts           # 5-layer safety pipeline ★ NEW
│   ├── storage.ts                # Database + in-memory storage
│   ├── db.ts                     # Database connection with fallback
│   ├── supabase-integration.ts   # Supabase client integration
│   └── vite.ts                   # Vite dev/prod middleware
├── shared/                        # Shared types and schemas
│   └── schema.ts                 # Drizzle ORM + Zod + TypeScript types
├── android-assistant/             # Native Android voice assistant
├── cybershell-commands/           # AI knowledge base
├── scripts/                       # Utility scripts
├── docs/                          # Documentation & assets
│   ├── PRD.md                    # Product Requirements Document
│   ├── TUTORIAL.md               # Getting Started Guide
│   ├── csx-nexus-logo.png        # Platform logo
│   └── csx-nexus-banner.png      # Platform banner
├── cli-interface.js               # CLI terminal interface
├── launcher.sh                    # Main interactive launcher
└── package.json                   # Dependencies and scripts
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
| `/api/auth/register` | POST | Register new user account |
| `/api/auth/login` | POST | Login and receive JWT token |
| `/api/auth/session` | GET | Validate current session |
| `/api/scan/start` | POST | Start a vulnerability scan |
| `/api/scan/:id` | GET | Get scan status and results |
| `/api/scans` | GET | List all scans |
| `/api/scan/:id` | DELETE | Delete a scan |
| `/api/recon/start` | POST | Start reconnaissance |
| `/api/recon/:id` | GET | Get recon status and results |
| `/api/agents/status` | GET | Get agent system status |
| `/api/tools` | GET | List available security tools |
| `/api/tools/registry` | GET | Get tool registry with categories |
| `/api/tools/execute` | POST | Execute a tool (simulated) |
| `/api/risk/calculate` | POST | Calculate risk score |
| `/api/risk/false-positive` | POST | Assess false positive probability |
| `/api/safety/check` | POST | Run safety pipeline check |
| `/api/llm/providers` | GET | List LLM provider status |
| `/api/llm/generate` | POST | Generate LLM response |
| `/api/dashboard/stats` | GET | Get dashboard statistics |
| `/api/notifications` | GET | Get recent notifications |
| `/ws/cybershell` | WS | Real-time WebSocket for terminal + scan + agent updates |

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                      ACCESS INTERFACES                          │
│   CLI (Node.js)  │  Web Dashboard (React 18)  │  Android (Kotlin)  │
├─────────────────────────────────────────────────────────────────┤
│                   Express.js + TypeScript Server                 │
│              REST API (30+ endpoints) + WebSocket                │
│                         (Port 5000)                             │
├────────────┬─────────────┬──────────────┬──────────────────────┤
│  AI Engine │   Agents    │   Scanner    │    Recon Engine      │
│ Multi-LLM  │ 5 Specialized│ 7 Vuln Types│ 20+ Passive Sources  │
│ Fallback   │ PTES Pipeline│ Confidence  │ DNS/TLS/Headers/JS   │
│ Registry   │ Orchestrator │ PoC Gen     │ Tech Fingerprint     │
├────────────┼─────────────┼──────────────┼──────────────────────┤
│ Risk Engine│   Safety    │   Tools      │   Notifications      │
│ CVSS v3.1  │ 5-Layer     │ 19 Tools    │ Discord/Slack/TG     │
│ FP Reduce  │ Pipeline    │ 3 Safety Lvl│ Email + WebSocket    │
├────────────┴─────────────┴──────────────┴──────────────────────┤
│              Data Layer (PostgreSQL + Drizzle + Supabase)        │
│              Auth Layer (JWT + scrypt + API Keys)                │
│              Storage Layer (Database + In-Memory Fallback)       │
└─────────────────────────────────────────────────────────────────┘
```

---

## Security Notice

This platform is designed **exclusively** for educational and authorized security testing purposes. All command explanations and tool demonstrations include legal notices emphasizing the requirement for proper authorization. The 5-layer safety pipeline blocks requests targeting private IP ranges, government domains, and enforces ethical guidelines on all outputs. Users are solely responsible for ensuring compliance with all applicable local, national, and international laws and regulations. Unauthorized access to computer systems is illegal in most jurisdictions. Always obtain explicit written permission before testing any systems or networks.

---

## Contributing

Contributions are welcome! We encourage the community to help improve this project.

1. **Fork** the repository
2. Create a **feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. Open a **Pull Request**

Please make sure to update tests as appropriate and follow the existing code style.

---

## Disclaimer

**For Education Purpose Only**

This project is provided strictly for educational and research purposes. The authors and contributors assume **no responsibility or liability** for any damages, losses, or risks arising from the use of this software. **We do not bear any responsibility or risk** for how this software is used.

All security tool executions in this platform are **simulated**. No actual attacks are performed against any targets. The platform is designed to teach cybersecurity concepts, not to execute real attacks.

**Contact:** Mulky Malikul Dhaher | mulkymalikudhr@mail.com

---

### Disclaimer (Bahasa Indonesia)

**Hanya untuk Tujuan Pendidikan**

Proyek ini disediakan secara ketat untuk tujuan pendidikan dan penelitian. Penulis dan kontributor tidak menanggung **tanggung jawab atau risiko** atas kerusakan, kerugian, atau risiko yang timbul dari penggunaan perangkat lunak ini. **Kami tidak menanggung tanggung jawab atau risiko** atas bagaimana perangkat lunak ini digunakan.

Semua eksekusi alat keamanan di platform ini adalah **simulasi**. Tidak ada serangan aktual yang dilakukan terhadap target mana pun. Platform ini dirancang untuk mengajarkan konsep keamanan siber, bukan untuk mengeksekusi serangan nyata.

**Kontak:** Mulky Malikul Dhaher | mulkymalikudhr@mail.com

---

### 免责声明 (中文)

**仅供教育目的**

本项目严格仅供教育和研究目的。作者和贡献者对因使用本软件而产生的任何损害、损失或风险**不承担任何责任**。**我们不承担任何责任或风险**对于本软件的使用方式。

本平台中的所有安全工具执行均为**模拟**。不会对任何目标执行实际攻击。本平台旨在教授网络安全概念，而非执行真实攻击。

**联系方式:** Mulky Malikul Dhaher | mulkymalikudhr@mail.com

---

## License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

Note: Some concepts integrated into this project originate from projects under different licenses (AGPL-3.0, GPL-3.0, Non-Commercial). The implementations in this project have been independently rewritten in TypeScript. Please review the [Sources & Attribution](#sources--attribution) section for details.

Copyright © 2024-2026 Mulky Malikul Dhaher. All rights reserved.

---

## Author

**Mulky Malikul Dhaher**
- Email: [mulkymalikudhr@mail.com](mailto:mulkymalikudhr@mail.com)
- GitHub: [https://github.com/mulkymalikuldhrs](https://github.com/mulkymalikuldhrs)

<a href="https://github.com/mulkymalikuldhrs/cyber-shell-x-nexus">
  <img width="100%" src="https://capsule-render.vercel.app/api?type=wave&color=0:1b2838,50:0d1b2a,100:0a0e17&height=120&section=footer" />
</a>
