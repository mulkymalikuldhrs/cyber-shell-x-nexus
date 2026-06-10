# Changelog

All notable changes to the CyberShellX Nexus project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [3.0.0] - 2026-06-10

### Added — Major Platform Upgrade

This release consolidates the best concepts and implementations from multiple open-source cybersecurity projects into a single, unified platform. Every integration is honestly documented with full attribution to original sources.

#### Multi-LLM Provider System (`server/llm-providers.ts`)
- Abstract LLM interface supporting Google Gemini, OpenAI, Anthropic Claude, and Ollama (local)
- Priority-based fallback chain with automatic provider switching on failure
- Provider registry pattern with auto-registration from environment variables
- Response caching with SHA256 keys and 30-minute TTL
- *Concept inspired by*: vulnhuntr (Protect AI), Zen-AI-Pentest, PentestGPT

#### Multi-Agent Orchestration (`server/agents/index.ts`)
- BaseAgent class with message queue, inbox, and lifecycle management
- 5 specialized agents: ReconAgent, VulnAgent, ExploitAgent, AnalysisAgent, ReportAgent
- AgentOrchestrator for multi-agent coordination with 5-phase PTES pipeline (Recon → Vuln → Exploit → Analysis → Report)
- Inter-agent messaging (broadcast, direct, role-based)
- Agent state management and status tracking
- *Concept inspired by*: Zen-AI-Pentest (agent system), god-eye (8 specialized agents), Shannon (multi-agent pipeline), PentestGPT (tripartite architecture)

#### Vulnerability Scanner (`server/scanner/index.ts`)
- Entry point detection using 50+ regex patterns for 20+ web frameworks (Flask, FastAPI, Django, Express, Koa, Tornado, Sanic, Pyramid, Bottle, aiohttp, Starlette, Gradio, GraphQL, AWS Lambda, Azure Functions, and more)
- Iterative context-enriched analysis loop (up to 7 iterations per vulnerability type)
- 7 vulnerability type analyzers: LFI, RCE, XSS, AFO, SSRF, SQLI, IDOR
- Confidence scoring (0-10 scale) with convergence detection
- PoC generation capability with LLM-powered analysis
- False positive reduction with context deduplication
- *Implementation derived from*: vulnhuntr by Protect AI (Dan McInerney & Marcello Salvati) — iterative context-enriched analysis, entry point detection patterns, vulnerability classification, confidence scoring

#### Reconnaissance Engine (`server/recon/index.ts`)
- Subdomain enumeration (20+ passive source simulation: crt.sh, AlienVault, Certspotter, URLScan, Wayback, CommonCrawl, and more)
- DNS resolution with retry logic
- TLS certificate analysis with 25+ security vendor fingerprints (Fortinet, Palo Alto, Cisco, F5, SonicWall, Check Point, pfSense, and more)
- Security headers checking (10+ headers: CSP, HSTS, X-Frame-Options, etc.)
- Technology fingerprinting (15+ technologies: WordPress, React, Next.js, Django, Laravel, etc.)
- JavaScript secret scanning (22 regex patterns for AWS keys, Google API keys, GitHub tokens, Stripe keys, Slack tokens, and more)
- Security score calculation (0-100)
- *Implementation derived from*: god-eye by Vyntral/Orizon — passive source enumeration, TLS fingerprinting, JS secret scanning patterns, security header checking, technology fingerprinting

#### Security Tool Integration Hub (`server/tools/index.ts`)
- 19 tool definitions: nmap, masscan, nuclei, nikto, sqlmap, ffuf, gobuster, dirb, burpsuite, metasploit, hydra, aircrack-ng, amass, subfinder, wpscan, sslscan, dnsrecon, hashcat, john
- Safety level classification (safe/moderate/dangerous)
- Tool executor with command validation and sanitization
- Simulated execution (educational — never runs real attacks)
- Category organization: network, web, fuzzing, exploitation, recon, crypto
- *Concept inspired by*: Zen-AI-Pentest (tool registry + executor), WifiToolX (WebSocket command relay)

#### Risk Engine (`server/risk/index.ts`)
- CVSS v3.1 scoring implementation (base, temporal, environmental metrics)
- False positive reduction engine with Bayesian-influenced assessment
- Business impact calculator with asset criticality and data classification
- Weighted risk scoring: CVSS (35%) + Business Impact (25%) + Exploitability (25%) + Confidence (15%)
- *Implementation derived from*: Zen-AI-Pentest (risk engine, CVSS scoring, FP reduction, business impact)

#### 5-Layer Safety Pipeline (`server/safety/index.ts`)
- Layer 1: Guardrails — Safety level enforcement
- Layer 2: Validation — Input/output validation, API key redaction, IP masking
- Layer 3: Fact-check — CVE database cross-referencing
- Layer 4: Consistency — Factual consistency verification
- Layer 5: Correction — Auto-correction with retry prompt generation
- Scope validation blocking private IPs (10.x, 172.16-31.x, 192.168.x, 127.x) and government domains (.gov, .mil)
- Legal notice enforcement on all responses
- *Implementation derived from*: Zen-AI-Pentest (5-layer safety pipeline, scope validation, output guardrails)

#### Authentication System (`server/auth.ts`)
- JWT-based authentication with bcrypt password hashing
- Register/login/session validation routes
- API key management with prefix-based validation
- Role-based access: admin, analyst, user

#### Notification System (`server/notifications.ts`)
- Discord webhook with rich embeds (color, fields, footer)
- Slack webhook integration (attachments format)
- Telegram bot notifications (MarkdownV2 formatting)
- Email notifications (configurable stub)
- In-app notifications via WebSocket broadcasting
- *Implementation derived from*: BruteForceAI by Mor David (Discord/Slack/Telegram webhook patterns)

#### Enhanced API Routes (`server/routes.ts`)
- 30+ API endpoints covering auth, scans, recon, agents, tools, risk, safety, LLM, dashboard, notifications
- Enhanced WebSocket with scan progress, agent status, and real-time notifications
- Rate limiting per endpoint and per user
- Input validation with Zod schemas

#### New Frontend Pages (7 pages)
- **ScanPage.tsx** — Vulnerability scanner dashboard with scan configuration, progress tracking, findings display, and scan history
- **ReconPage.tsx** — Reconnaissance dashboard with subdomain discovery, port scanning, TLS analysis, security headers, technology detection, and JS secrets
- **AgentsPage.tsx** — Agent monitoring with 5-agent status cards, pipeline visualization, and orchestration controls
- **ToolsPage.tsx** — Security tool hub with category filtering, availability checking, and simulated execution
- **RiskPage.tsx** — Risk assessment with visual gauge, CVSS score breakdown, false positive analysis, and business impact display
- **ReportsPage.tsx** — Report generation with Markdown download
- **SettingsPage.tsx** — Configuration panel for LLM providers, notification webhooks, safety settings, and general preferences
- **AuthPage.tsx** — Login/Register with JWT token storage

#### Enhanced Shared Schema (`shared/schema.ts`)
- Added tables: scans, findings, reports, agentStates, toolConfigs
- Added TypeScript interfaces: VulnType, SeverityLevel, ScanType, AgentType, LLMProviderConfig, ToolDefinition, NotificationConfig, RiskScore, SafetyCheckResult, ScanConfig, AgentState, Finding, ScanResult, ReconResult, RiskAssessment, ReportData
- User schema expanded with email, role, apiKey, lastLogin, isActive fields

#### Enhanced CLI (`cli-interface.js`)
- Added scan commands: `scan start <target>`, `scan status`, `scan results`, `scans list`
- Added recon commands: `recon start <target>`, `recon status`
- Added agent commands: `agents status`, `agents start`
- Added tool commands: `tools list`, `tools execute <name> <target>`
- Added risk commands: `risk calculate <target>`

#### Updated Knowledge Base (`cybershell-commands/commands.json`)
- Added scanning category with vulnerability scanning and AI analysis commands
- Added agents category with multi-agent and orchestration commands
- Expanded learning prompts with AI-powered security analysis topics
- Added more interactive scenarios

### Fixed
- Added authentication routes (was missing in v2.0 — Passport.js was in deps but unused)
- Added proper TypeScript target and downlevelIteration to tsconfig.json
- Fixed ToolsPage TypeScript error (Tool interface missing `options` property)
- Fixed commands.json path resolution in cybershell-ai.ts
- Fixed static file path in vite.ts for production builds

### Changed
- Version bumped from 2.0.0 to 3.0.0
- Dashboard (Index.tsx) upgraded with stats cards and quick navigation
- Enhanced WebSocket with scan/agent/notification message types
- All AI responses now go through 5-layer safety pipeline

### Honesty Notes
- All vulnerability scanning and tool execution is **simulated** for educational purposes
- The platform does NOT execute real attacks against any targets
- Passive source enumeration returns simulated data, not real network scans
- CVSS scoring uses the formula but applied to hypothetical scenarios
- Multi-agent orchestration is a TypeScript implementation; real tool execution requires actual security tools installed separately
- Concepts from vulnhuntr, Shannon, and PentestGPT have been adapted as architectural patterns, not direct code copies
- The original vulnhuntr is AGPL-3.0 licensed; our TypeScript implementation is independent but conceptually derived

---

## [2.0.0] - 2026-03-05

### Security
- **CRITICAL**: Removed `.env` from git tracking
- Added input validation on `/api/command` endpoint
- Added rate limiting on all API routes (60 requests/minute per IP)
- Added request body size limits (1mb)
- Fixed error handler in `server/index.ts`
- All `window.open()` calls now use `noopener,noreferrer`

### Changed — TypeScript & Type Safety
- Replaced all `any` types with proper interfaces throughout server code
- Typed `apiRequest` helper with generic `<T>` return type
- Added proper `Error` typing in global error handler

### Changed — Error Handling
- Added React `ErrorBoundary` component
- Added `LoadingSpinner` component
- Supabase integration uses lazy initialization
- All API route handlers have proper try/catch

### Changed — Accessibility
- Added ARIA landmarks throughout all components
- Added `aria-label` attributes to interactive elements
- Fixed `NotFound` page with proper `role="alert"`

### Changed — Code Quality
- Used `useCallback` throughout to prevent unnecessary re-renders
- Added unique keys based on content instead of array index
- Removed unused imports

---

## [1.1.0] - 2026-03-05

### Security
- **CRITICAL**: Removed hardcoded Gemini API keys from `server/gemini-api.ts`

---

## [1.0.0] - 2025-03-04

### Added
- **Core Platform**: Initial release of CyberShellX Nexus
- **AI Engine**: Google Gemini 2.5 Flash/Pro with 4-endpoint fallback system
- **CyberShellAI Processing Engine**: Context-aware command processor
- **CLI Interface**: Interactive Node.js terminal with tool simulations
- **Web Dashboard**: React 18 + TypeScript + Vite application
- **Android Voice Assistant**: Native Kotlin application
- **WebSocket Server**: Real-time bidirectional communication
- **Database Layer**: PostgreSQL + Drizzle ORM + Supabase
- **Interactive Training Scenarios**: Difficulty-tiered learning exercises
- **Command Knowledge Base**: 6 command categories
- **Ethical Guidelines Engine**: Automated legal notice delivery
- **Learning Prompts**: 10 educational prompts
- **API Documentation**: Complete REST API reference
- **Launcher System**: Interactive shell launcher
- **Termux Support**: Dedicated installation script

---

## [Unreleased]

### Planned
- Real tool execution with Docker sandboxing
- Multi-language AI response support
- Extended forensics module with timeline reconstruction
- Enhanced Android assistant with offline mode
- Comprehensive test suite with automated CI/CD
- Real-time collaboration features
- Plugin architecture for community modules
- Docker containerization for simplified deployment
- Resume/checkpoint for long-running scans
- Pentesting Task Tree (PTT) state visualization

[1.0.0]: https://github.com/mulkymalikuldhrs/cyber-shell-x-nexus/releases/tag/v1.0.0
[1.1.0]: https://github.com/mulkymalikuldhrs/cyber-shell-x-nexus/releases/tag/v1.1.0
[2.0.0]: https://github.com/mulkymalikuldhrs/cyber-shell-x-nexus/releases/tag/v2.0.0
[3.0.0]: https://github.com/mulkymalikuldhrs/cyber-shell-x-nexus/releases/tag/v3.0.0
