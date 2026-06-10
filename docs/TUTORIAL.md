# CyberShellX Nexus — Tutorial

## Getting Started Guide

This tutorial will walk you through setting up and using CyberShellX Nexus v3.0, the AI-powered cybersecurity training and assessment platform.

---

## Table of Contents

1. [Installation](#1-installation)
2. [Environment Setup](#2-environment-setup)
3. [Using the CLI Terminal](#3-using-the-cli-terminal)
4. [Using the Web Dashboard](#4-using-the-web-dashboard)
5. [Running a Vulnerability Scan](#5-running-a-vulnerability-scan)
6. [Running Reconnaissance](#6-running-reconnaissance)
7. [Understanding the Agent System](#7-understanding-the-agent-system)
8. [Using the Security Tool Hub](#8-using-the-security-tool-hub)
9. [Risk Assessment](#9-risk-assessment)
10. [Generating Reports](#10-generating-reports)
11. [Configuring Notifications](#11-configuring-notifications)
12. [Setting Up Multiple LLM Providers](#12-setting-up-multiple-llm-providers)
13. [Android Voice Assistant](#13-android-voice-assistant)
14. [Termux Setup](#14-termux-setup)

---

## 1. Installation

### Prerequisites

Before installing CyberShellX Nexus, ensure you have:

- **Node.js** 18 or later ([download](https://nodejs.org/))
- **npm** (comes with Node.js)
- **PostgreSQL** database ([download](https://www.postgresql.org/download/))
- **Git** ([download](https://git-scm.com/downloads))

### Step-by-Step Installation

```bash
# Step 1: Clone the repository
git clone https://github.com/mulkymalikuldhrs/cyber-shell-x-nexus.git
cd cyber-shell-x-nexus

# Step 2: Install Node.js dependencies
npm install

# Step 3: Create environment configuration
cp .env.example .env

# Step 4: Edit .env with your settings (see Section 2)
nano .env  # or use your preferred editor

# Step 5: Set up database schema
npm run db:push

# Step 6: Launch the platform
./launcher.sh
```

### Verification

After installation, verify everything is working:

```bash
# Quick health check
node scripts/health-check.js

# Or use the launcher status option
./launcher.sh status
```

---

## 2. Environment Setup

The `.env` file contains all configuration. Here's what you need:

### Minimum Configuration (Required)

```env
# At least one Gemini API key is required for AI features
GOOGLE_API_KEY=your_gemini_api_key_here

# Database connection
DATABASE_URL=postgresql://user:password@localhost:5432/cybershellx

# JWT secret for authentication
JWT_SECRET=your_random_secret_key_here
```

### Full Configuration (Recommended)

```env
# === LLM Providers ===

# Google Gemini (primary)
GOOGLE_API_KEY=your_primary_gemini_api_key
GOOGLE_API_KEY_2=your_secondary_gemini_api_key
GEMINI_API_KEY=alternative_gemini_api_key
GEMINI_BACKUP_KEY_1=backup_key_1
GEMINI_BACKUP_KEY_2=backup_key_2

# OpenAI (optional)
OPENAI_API_KEY=sk-your-openai-api-key

# Anthropic Claude (optional)
ANTHROPIC_API_KEY=sk-ant-your-anthropic-key

# Ollama local (optional, requires Ollama installed)
OLLAMA_BASE_URL=http://localhost:11434

# === Database ===
DATABASE_URL=postgresql://user:password@localhost:5432/cybershellx

# === Authentication ===
JWT_SECRET=your_random_secret_at_least_32_chars

# === Supabase (optional) ===
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your_service_key
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key

# === Server ===
PORT=5000
NODE_ENV=development
```

### Getting API Keys

| Provider | How to Get | Free Tier |
|----------|-----------|-----------|
| Google Gemini | [Google AI Studio](https://aistudio.google.com/apikey) | Yes, generous free tier |
| OpenAI | [OpenAI Platform](https://platform.openai.com/api-keys) | Pay-per-use |
| Anthropic | [Anthropic Console](https://console.anthropic.com/) | Pay-per-use |
| Ollama | [Install locally](https://ollama.ai/) | Free, runs locally |

---

## 3. Using the CLI Terminal

The CLI provides an interactive cybersecurity shell with AI-powered explanations.

### Starting the CLI

```bash
node cli-interface.js
```

### Basic Commands

```
# Network security
cybershell> nmap
cybershell> scan network
cybershell> wireshark

# Vulnerability assessment
cybershell> check vulnerabilities
cybershell> nikto

# Exploitation methodology
cybershell> metasploit
cybershell> sql injection

# Forensics
cybershell> volatility
cybershell> memory analysis

# Wireless security
cybershell> aircrack
cybershell> wireless security

# Cryptography
cybershell> hashcat
cybershell> password crack

# System analysis
cybershell> system info
cybershell> process monitor
```

### New v3.0 Commands

```
# Vulnerability scanning
cybershell> scan start example.com
cybershell> scan status
cybershell> scan results
cybershell> scans list

# Reconnaissance
cybershell> recon start example.com
cybershell> recon status

# Agent system
cybershell> agents status
cybershell> agents start

# Security tools
cybershell> tools list
cybershell> tools execute nmap example.com

# Risk assessment
cybershell> risk calculate example.com
```

### AI Enhancement

Every command you type is processed through the AI engine, which provides:
- Detailed explanations of what the tool does
- Syntax and usage examples
- Safety warnings and legal notices
- Difficulty classification (beginner/intermediate/advanced)
- Related commands and learning resources

---

## 4. Using the Web Dashboard

### Starting the Web Server

```bash
npm run dev
```

Navigate to `http://localhost:5000` in your browser.

### Pages Overview

| Page | URL | Purpose |
|------|-----|---------|
| Dashboard | `/` | Overview with stats and quick navigation |
| Scanner | `/scan` | Vulnerability scanning |
| Recon | `/recon` | Reconnaissance |
| Agents | `/agents` | Agent monitoring |
| Tools | `/tools` | Security tool hub |
| Risk | `/risk` | Risk assessment |
| Reports | `/reports` | Report generation |
| Settings | `/settings` | Configuration |
| Login | `/auth` | Authentication |

### First Time Setup

1. Navigate to `/auth` to create an account
2. After logging in, go to `/settings` to configure your LLM providers
3. Check the Tools page to verify available tools
4. Start with a simple scan from the Dashboard

---

## 5. Running a Vulnerability Scan

### Via Web Interface

1. Navigate to the **Scan** page
2. Enter a target (e.g., `example.com`)
3. Select scan type:
   - **Vulnerability**: Scan for 7 vulnerability classes
   - **Recon**: Subdomain enumeration and DNS analysis
   - **Full**: Complete assessment
   - **Compliance**: Security compliance check
4. Click **Start Scan**
5. Watch the progress bar and live findings
6. Review results when complete

### Via CLI

```bash
# Start a vulnerability scan
scan start example.com

# Check scan status
scan status

# View results
scan results

# List all scans
scans list
```

### Understanding Scan Results

Each finding includes:
- **Vulnerability Type**: LFI, RCE, XSS, AFO, SSRF, SQLI, or IDOR
- **Severity**: Critical, High, Medium, Low, or Informational
- **Confidence Score**: 0-10 (higher = more likely valid)
- **Description**: What the vulnerability means
- **PoC**: Proof of concept (if generated)
- **Remediation**: How to fix the issue

### Important Note

**All vulnerability scans are simulated for educational purposes.** The scanner demonstrates methodology and provides educational content about vulnerability types. It does not perform actual attacks against targets.

---

## 6. Running Reconnaissance

### Via Web Interface

1. Navigate to the **Recon** page
2. Enter a target domain
3. Click **Start Reconnaissance**
4. Review results across tabs:
   - **Subdomains**: Discovered subdomains with DNS records
   - **Ports**: Open port information
   - **TLS**: Certificate analysis and vendor detection
   - **Headers**: Security header assessment
   - **Technology**: Detected technologies
   - **Secrets**: JavaScript secret scanning results

### Reconnaissance Output

| Section | What It Shows |
|---------|--------------|
| Subdomains | Simulated subdomain discovery from 20+ passive sources |
| Ports | Common port scan results (educational) |
| TLS | Certificate chain, issuer, expiry, security vendor detection |
| Headers | Security header presence and configuration (CSP, HSTS, etc.) |
| Technology | Detected frameworks (WordPress, React, Django, etc.) |
| Secrets | Potential API keys/tokens found in JavaScript files |

---

## 7. Understanding the Agent System

CyberShellX Nexus uses a multi-agent architecture inspired by the PTES (Penetration Testing Execution Standard) methodology.

### The 5 Agents

| Agent | Role | Phase |
|-------|------|-------|
| **ReconAgent** | Information gathering, subdomain discovery, port scanning | Phase 1: Reconnaissance |
| **VulnAgent** | Vulnerability identification, entry point analysis, classification | Phase 2: Vulnerability Assessment |
| **ExploitAgent** | Exploit validation, PoC generation, scope verification | Phase 3: Exploitation |
| **AnalysisAgent** | Risk scoring, false positive reduction, impact assessment | Phase 4: Analysis |
| **ReportAgent** | Report generation, findings compilation, recommendations | Phase 5: Reporting |

### Pipeline Flow

```
ReconAgent → VulnAgent → ExploitAgent → AnalysisAgent → ReportAgent
    (1)          (2)          (3)           (4)            (5)
```

Each agent:
- Receives input from the previous agent
- Processes its specific task
- Passes results to the next agent
- Reports status to the orchestrator

### Monitoring Agents

Navigate to the **Agents** page to:
- View each agent's current state (idle, running, completed, error)
- See the pipeline progress visualization
- Start/stop agent orchestration
- View agent messages and coordination logs

---

## 8. Using the Security Tool Hub

The Tools page provides access to 19 security tool definitions, organized by category.

### Tool Categories

| Category | Tools | Safety Level |
|----------|-------|-------------|
| **Network** | nmap, masscan | Safe (scanning only) |
| **Web** | nikto, wpscan, sslscan, dnsrecon | Safe-Moderate |
| **Fuzzing** | ffuf, gobuster, dirb | Moderate |
| **Exploitation** | sqlmap, metasploit, hydra | Dangerous |
| **Recon** | amass, subfinder, nuclei | Safe |
| **Crypto** | hashcat, john | Moderate |

### Tool Execution

1. Navigate to the **Tools** page
2. Filter by category or search by name
3. Click **Check** to verify if the tool is available on your system
4. Click **Execute** to run a simulated execution
5. View the output in the terminal area

**Note**: Tool executions are **simulated** for educational purposes. The platform demonstrates how these tools work without executing real commands against targets.

---

## 9. Risk Assessment

### Using the Risk Calculator

1. Navigate to the **Risk** page
2. Enter target information and vulnerability details
3. Click **Calculate Risk**
4. Review the multi-factor risk score:

### Risk Score Components

| Component | Weight | Description |
|-----------|--------|-------------|
| CVSS Score | 35% | Common Vulnerability Scoring System v3.1 |
| Business Impact | 25% | Asset criticality, data classification |
| Exploitability | 25% | Attack complexity, privileges required |
| Confidence | 15% | Finding confidence, false positive probability |

### Risk Categories

| Category | Score Range | Color |
|----------|-------------|-------|
| Critical | 9.0 - 10.0 | Red |
| High | 7.0 - 8.9 | Orange |
| Medium | 4.0 - 6.9 | Yellow |
| Low | 0.1 - 3.9 | Green |
| Informational | 0.0 | Blue |

---

## 10. Generating Reports

1. Navigate to the **Reports** page
2. Select a completed scan or assessment
3. Choose report format (Markdown)
4. Click **Generate Report**
5. Download the report file

Reports include:
- Executive summary
- Technical findings with severity ratings
- Vulnerability details and PoC
- Risk scores and business impact
- Remediation recommendations
- Methodology and scope

---

## 11. Configuring Notifications

Set up notifications to receive alerts about scan results and findings.

### Discord Webhook

1. Go to your Discord server settings → Integrations → Webhooks
2. Create a new webhook and copy the URL
3. In Settings → Notifications, paste the Discord webhook URL
4. Toggle Discord notifications on

### Slack Webhook

1. Create a Slack app with incoming webhooks
2. Copy the webhook URL
3. Configure in Settings → Notifications

### Telegram Bot

1. Message @BotFather on Telegram to create a bot
2. Get the bot token and your chat ID
3. Configure in Settings → Notifications

---

## 12. Setting Up Multiple LLM Providers

CyberShellX Nexus supports multiple LLM providers with automatic fallback.

### Configuration

In `.env` or via Settings page:

```env
# Provider 1: Google Gemini (recommended, free tier available)
GOOGLE_API_KEY=your_key

# Provider 2: OpenAI
OPENAI_API_KEY=sk-your_key

# Provider 3: Anthropic Claude
ANTHROPIC_API_KEY=sk-ant-your_key

# Provider 4: Ollama (local, free)
OLLAMA_BASE_URL=http://localhost:11434
```

### How Fallback Works

The system tries providers in priority order:
1. First available provider with a valid API key
2. If the primary fails, automatically switches to the next
3. Response cache prevents redundant API calls
4. Provider health is monitored and reported at `/api/llm/providers`

### Setting Up Ollama (Free Local LLM)

```bash
# Install Ollama
curl -fsSL https://ollama.ai/install.sh | sh

# Pull a model
ollama pull llama3.2

# Start the server
ollama serve

# Set in .env
OLLAMA_BASE_URL=http://localhost:11434
```

---

## 13. Android Voice Assistant

### Building the APK

```bash
cd android-assistant
chmod +x build-apk.sh
./build-apk.sh
```

### Installing

```bash
chmod +x install-apk.sh
./install-apk.sh
```

### Usage

1. Launch the app on your Android device
2. Say "Hey CyberShell" to activate voice recognition
3. Ask cybersecurity questions naturally
4. The app connects to your server via WebSocket

### Important: Server Configuration

The Android app needs to connect to your server. Edit `app/src/main/java/com/cybershellx/assistant/MainActivity.kt` and update the server URL:

```kotlin
private val SERVER_URL = "http://YOUR_SERVER_IP:5000"
```

---

## 14. Termux Setup

Run CyberShellX Nexus on Android via Termux:

```bash
# Install Termux from F-Droid (not Play Store)

# Run the installer
curl -o termux-install.sh https://raw.githubusercontent.com/mulkymalikuldhrs/cyber-shell-x-nexus/main/termux-install.sh
chmod +x termux-install.sh
./termux-install.sh

# Launch
cd ~/cyber-shell-x-nexus
./run.sh
```

---

## Safety & Ethics

### Always Remember

1. **Authorization Required**: Only test systems you own or have explicit written permission to test
2. **Educational Purpose**: This platform is for learning cybersecurity concepts
3. **Simulated Execution**: All tool runs are simulated — no real attacks are performed
4. **Legal Notices**: Every response includes legal notices and ethical guidelines
5. **Safety Pipeline**: All outputs pass through a 5-layer safety check
6. **Scope Validation**: The system blocks attempts to scan private IPs and government domains

### The 5-Layer Safety Pipeline

When you submit any request, it passes through:

1. **Guardrails**: Checks safety level requirements
2. **Validation**: Validates input/output format and sanitizes content
3. **Fact-check**: Cross-references findings with known vulnerability databases
4. **Consistency**: Verifies factual consistency of AI responses
5. **Correction**: Auto-corrects any issues found in previous layers

---

## Getting Help

- **Documentation**: Check the `docs/` directory for detailed guides
- **API Reference**: See `docs/API.md`
- **Troubleshooting**: See `docs/TROUBLESHOOTING.md`
- **Issues**: Open an issue on [GitHub](https://github.com/mulkymalikuldhrs/cyber-shell-x-nexus/issues)
- **Architecture**: See `ARCHITECTURE.md` for system design details

---

## Sources

This platform integrates concepts from multiple open-source cybersecurity projects. See the [Sources & Attribution](../README.md#sources--attribution) section in the README for complete details.
