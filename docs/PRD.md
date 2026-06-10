# Product Requirements Document (PRD)
## CyberShellX Nexus v3.0

### 1. Product Vision

CyberShellX Nexus is a comprehensive, AI-powered cybersecurity training and assessment platform that consolidates the best concepts from multiple open-source security tools into a single, cohesive educational experience. The platform serves cybersecurity professionals, students, and enthusiasts by providing intelligent guidance, simulated tool execution, vulnerability assessment methodology, and risk analysis through multi-agent orchestration and multi-LLM intelligence.

### 2. Target Users

| User Type | Description | Primary Needs |
|-----------|-------------|---------------|
| **Cybersecurity Students** | Individuals learning ethical hacking and security concepts | Educational content, guided learning, tool demonstrations |
| **Security Professionals** | Working penetration testers and security analysts | Workflow automation, multi-agent assessment, risk scoring |
| **Bug Bounty Hunters** | Independent security researchers | Reconnaissance tools, vulnerability scanning, PoC generation |
| **Security Teams** | Enterprise security departments | Risk assessment, compliance, reporting, team coordination |
| **CTF Participants** | Capture The Flag competition players | Tool integration, methodology guidance, exploitation techniques |

### 3. Core Requirements

#### 3.1 Multi-LLM Provider System
- **REQ-LLM-001**: Support minimum 4 LLM providers (Gemini, OpenAI, Claude, Ollama)
- **REQ-LLM-002**: Automatic fallback when primary provider fails
- **REQ-LLM-003**: Provider health monitoring with status reporting
- **REQ-LLM-004**: Response caching to minimize redundant API calls
- **REQ-LLM-005**: Configurable priority ordering via environment variables

#### 3.2 Multi-Agent Orchestration
- **REQ-AGENT-001**: 5 specialized agents (Recon, Vuln, Exploit, Analysis, Report)
- **REQ-AGENT-002**: PTES-compliant 5-phase assessment pipeline
- **REQ-AGENT-003**: Inter-agent messaging (broadcast, direct, role-based)
- **REQ-AGENT-004**: Agent status monitoring and lifecycle management
- **REQ-AGENT-005**: Orchestrator for coordinated multi-agent workflows

#### 3.3 Vulnerability Scanner
- **REQ-SCAN-001**: Detect 7 vulnerability classes (LFI, RCE, XSS, AFO, SSRF, SQLI, IDOR)
- **REQ-SCAN-002**: 50+ regex patterns for web framework entry point detection
- **REQ-SCAN-003**: Iterative context-enriched analysis (up to 7 iterations)
- **REQ-SCAN-004**: Confidence scoring (0-10 scale)
- **REQ-SCAN-005**: PoC generation capability
- **REQ-SCAN-006**: False positive reduction with context deduplication

#### 3.4 Reconnaissance Engine
- **REQ-RECON-001**: 20+ passive subdomain enumeration sources
- **REQ-RECON-002**: DNS resolution with retry logic
- **REQ-RECON-003**: TLS certificate analysis with vendor fingerprinting
- **REQ-RECON-004**: Security headers assessment (10+ headers)
- **REQ-RECON-005**: Technology fingerprinting (15+ technologies)
- **REQ-RECON-006**: JavaScript secret scanning (22+ patterns)
- **REQ-RECON-007**: Overall security score calculation (0-100)

#### 3.5 Security Tool Integration
- **REQ-TOOL-001**: 19 tool definitions across 6 categories
- **REQ-TOOL-002**: Three-tier safety classification (safe/moderate/dangerous)
- **REQ-TOOL-003**: Simulated execution only (no real attacks)
- **REQ-TOOL-004**: Command validation and sanitization
- **REQ-TOOL-005**: Category-based filtering and search

#### 3.6 Risk Engine
- **REQ-RISK-001**: CVSS v3.1 scoring implementation
- **REQ-RISK-002**: False positive reduction with Bayesian-influenced assessment
- **REQ-RISK-003**: Business impact calculator with asset criticality
- **REQ-RISK-004**: Weighted multi-factor risk scoring
- **REQ-RISK-005**: Risk category classification (critical/high/medium/low/info)

#### 3.7 Safety Pipeline
- **REQ-SAFE-001**: 5-layer safety check (guardrails → validation → fact-check → consistency → correction)
- **REQ-SAFE-002**: Scope validation blocking private IPs and government domains
- **REQ-SAFE-003**: API key redaction in outputs
- **REQ-SAFE-004**: Legal notice enforcement on all security responses
- **REQ-SAFE-005**: Input sanitization for all user-provided targets

#### 3.8 Authentication & Authorization
- **REQ-AUTH-001**: JWT-based authentication with bcrypt password hashing
- **REQ-AUTH-002**: Role-based access control (admin, analyst, user)
- **REQ-AUTH-003**: API key management for programmatic access
- **REQ-AUTH-004**: Session validation and management

#### 3.9 Notifications
- **REQ-NOTIF-001**: Discord webhook integration
- **REQ-NOTIF-002**: Slack webhook integration
- **REQ-NOTIF-003**: Telegram bot notifications
- **REQ-NOTIF-004**: Email notification support
- **REQ-NOTIF-005**: In-app WebSocket notifications

### 4. Non-Functional Requirements

| Requirement | Target |
|-------------|--------|
| **Build Compilation** | Zero TypeScript errors |
| **API Response Time** | <2s for standard queries |
| **Concurrent Users** | Support 50+ simultaneous connections |
| **Rate Limiting** | 60 requests/minute per IP |
| **Security** | All outputs pass 5-layer safety pipeline |
| **Uptime** | 99.5% with multi-LLM fallback |
| **Browser Support** | Chrome 90+, Firefox 88+, Safari 14+, Edge 90+ |
| **Mobile** | Responsive design, Android native app |

### 5. Technology Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Frontend | React + TypeScript + Vite | 18.3.1 / 5.4.14 |
| UI Components | shadcn/ui + Radix UI + Tailwind CSS | Various |
| Backend | Express.js + TypeScript | 4.21.2 / 5.6.3 |
| Database | PostgreSQL + Drizzle ORM | Via neon serverless |
| AI | Google Gemini + OpenAI + Anthropic + Ollama | Multi-provider |
| Mobile | Kotlin + Jetpack Compose | Android API 24+ |
| CLI | Node.js ESM | 18+ |
| Real-time | WebSocket (ws) | 8.18.0 |

### 6. Sources & Attribution

This product integrates concepts from the following open-source projects. Full details available in README.md "Sources & Attribution" section.

| Source | Author | Key Concepts Used |
|--------|--------|-------------------|
| vulnhuntr | Protect AI | Iterative vulnerability analysis, entry point detection, 7 vuln classes |
| Zen-AI-Pentest | Mulky Malikul Dhaher | Agent system, safety pipeline, risk engine, tool registry |
| god-eye | Vyntral/Orizon | Passive recon, TLS fingerprinting, JS secret scanning |
| WifiToolX | Mulky Malikul Dhaher | WebSocket command relay, scan simulation |
| BruteForceAI | Mor David | Webhook notification implementations |
| unshackle | Fadi002 | Conceptual reference only (not directly integrated) |
| Shannon | Keygraph | Multi-agent pipeline, validation gate concept |
| PentestGPT | GreyDGL | PTT concept, tripartite architecture, provider registry |

### 7. Constraints & Honesty Statements

- All tool executions are **simulated** — the platform does not perform real attacks
- Vulnerability scanning operates on code/text input, not live targets
- Reconnaissance returns simulated data for educational demonstration
- Multi-agent orchestration is a TypeScript implementation pattern
- CVSS scoring uses the standard formula applied to hypothetical scenarios
- The platform is designed for education and authorized testing methodology learning only
