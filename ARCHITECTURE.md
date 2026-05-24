# Architecture

CyberShellX Nexus follows a modular monorepo architecture with clear separation between the frontend client, backend server, shared schemas, mobile application, AI processing engine, and command knowledge base. This document provides a comprehensive overview of the system design, component interactions, data flow, and deployment topology.

---

## System Overview

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         CyberShellX Nexus                               │
├──────────────┬──────────────┬──────────────┬───────────────────────────┤
│   CLI        │   Web        │  Android     │   Access                  │
│  Terminal    │  Dashboard   │  Voice App   │   Interfaces              │
│  (Node.js)   │  (React 18)  │  (Kotlin)    │                           │
├──────────────┴──────────────┴──────────────┤                           │
│              Express.js + TypeScript        │                           │
│              REST API + WebSocket           │                           │
│              (Port 5000)                    │                           │
├────────────────────────────────────────────┤                           │
│          AI Processing Engine              │                           │
│  ┌──────────────┬───────────────────────┐  │                           │
│  │ CyberShellAI │  Gemini API Manager   │  │                           │
│  │ (Commands)   │  (4-API Fallback)     │  │                           │
│  └──────────────┴───────────────────────┘  │                           │
├────────────────────────────────────────────┤                           │
│          Data Layer                        │                           │
│  ┌──────────────┬───────────────────────┐  │                           │
│  │  PostgreSQL   │   Supabase            │  │                           │
│  │  + Drizzle    │   Integration         │  │                           │
│  └──────────────┴───────────────────────┘  │                           │
└────────────────────────────────────────────┘                           │
```

---

## Component Architecture

### 1. Frontend Client (`client/`)

The web dashboard is a single-page application built with React 18, TypeScript, and Vite. It communicates with the backend through REST API calls and WebSocket connections for real-time terminal interaction.

**Key Technologies:**
- React 18 with functional components and hooks
- TypeScript 5.6 with strict mode
- Vite 5 with React SWC plugin for fast HMR
- TanStack React Query for server state management
- Wouter for lightweight client-side routing
- Tailwind CSS 3 with custom dark theme configuration
- shadcn/ui component library built on Radix UI primitives

**Component Hierarchy:**

```
App.tsx
├── QueryClientProvider (TanStack React Query)
├── TooltipProvider (Radix)
├── BrowserRouter
│   └── Routes
│       ├── "/" → Index.tsx
│       │   ├── Hero.tsx
│       │   ├── CyberShellXTerminal.tsx
│       │   ├── FeatureCard.tsx
│       │   ├── GitHubSection.tsx
│       │   ├── MobileAppSection.tsx
│       │   ├── DonationSection.tsx
│       │   └── ui/* (40+ shadcn/ui components)
│       └── "*" → NotFound.tsx
├── Toaster (Radix Toast)
└── Sonner (Toast Notifications)
```

**State Management:**
- Server state: TanStack React Query with automatic caching and refetching
- Local UI state: React `useState` and `useEffect` hooks
- Form state: React Hook Form with Zod validation resolvers
- WebSocket state: Custom connection management in CyberShellXTerminal

### 2. Backend Server (`server/`)

The Express.js server provides both the REST API and the WebSocket server for real-time communication. It serves the compiled frontend assets in production and proxies to the Vite dev server during development.

**Entry Point:** `server/index.ts`

**Middleware Stack:**
```
Express JSON Parser → URL Encoded Parser → Request Logger → Routes → Vite/Static → Error Handler
```

**Key Modules:**

| Module | Responsibility |
|--------|---------------|
| `index.ts` | Server initialization, middleware setup, port binding |
| `routes.ts` | API endpoint registration, WebSocket server setup, request routing |
| `cybershell-ai.ts` | Command parsing, pattern matching, response generation, AI enhancement delegation |
| `gemini-api.ts` | Multi-API Gemini client management, fallback logic, health status |
| `storage.ts` | Database abstraction layer implementing IStorage interface |
| `db.ts` | PostgreSQL connection via Drizzle ORM and Neon serverless driver |
| `supabase-integration.ts` | Supabase client for additional data services |
| `vite.ts` | Development Vite middleware and production static file serving |

### 3. AI Processing Engine

The AI system operates in two layers: a deterministic command processor (CyberShellAI) and a probabilistic AI enhancer (Gemini API Manager).

**CyberShellAI (`server/cybershell-ai.ts`):**

```
User Input → processCommand()
                ├── Pattern Matching (keyword-based routing)
                │   ├── Network Scanning → explainNetworkScanning()
                │   ├── Vulnerability Assessment → explainVulnerabilityAssessment()
                │   ├── SQL Injection → explainSQLInjection()
                │   ├── Metasploit → explainMetasploit()
                │   ├── Network Analysis → explainNetworkAnalysis()
                │   ├── Password Cracking → explainPasswordCracking()
                │   ├── Forensics → explainForensics()
                │   ├── Wireless Security → explainWirelessSecurity()
                │   ├── System Analysis → explainSystemAnalysis()
                │   ├── Security Guidance → provideSecurityGuidance()
                │   └── Default → provideGeneralGuidance()
                └── Returns: CommandResponse
                    { type, content, category, difficulty, tools, legal_notice }
```

**Gemini API Manager (`server/gemini-api.ts`):**

The fallback system implements a round-robin strategy with configurable retry limits:

```
Request → tryWithCurrentAPI()
              ├── Success → Return Result
              └── Failure → switchToNextAPI()
                              └── Retry up to maxRetries (3)
                                  ├── All APIs exhausted → Throw Error
                                  └── Cycled back to start → Throw Error
```

**API Priority Order:**
1. `GOOGLE_API_KEY` / `GEMINI_API_KEY` (Primary)
2. `GOOGLE_API_KEY_2` (Secondary)
3. Backup API 1 (Hardcoded fallback)
4. Backup API 2 (Hardcoded fallback)

**Models Used:**
- `gemini-2.5-flash` -- General content generation and command enhancement
- `gemini-2.5-pro` -- Structured analysis tasks (sentiment, classification)

### 4. Data Layer

**Database Schema (`shared/schema.ts`):**

```
users
├── id: serial (PK)
├── username: text (unique, not null)
└── password: text (not null)
```

**Storage Interface (`server/storage.ts`):**

The `IStorage` interface abstracts database operations, enabling potential replacement with in-memory or alternative storage implementations:

```typescript
interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
}
```

**Database Stack:**
- PostgreSQL as the primary relational database
- Drizzle ORM for type-safe query building and schema management
- `@neondatabase/serverless` for serverless PostgreSQL connections
- `connect-pg-simple` for Express session storage
- Supabase as an additional data service layer

### 5. Command Knowledge Base (`cybershell-commands/`)

The knowledge base drives the AI command processor with structured definitions and learning resources.

**Structure (`commands.json`):**

```
commands.json
├── categories
│   ├── networking (nmap, netstat, wireshark)
│   ├── exploitation (metasploit, burp suite, sqlmap)
│   ├── forensics (volatility, autopsy, hashcat)
│   ├── system (system info, process monitor, log analysis)
│   ├── wireless (aircrack suite, wifi scan)
│   └── crypto (openssl, john ripper)
├── ai_prompts
│   ├── system_prompt
│   ├── personality (tone, expertise, ethics, communication)
│   ├── response_templates (command_explanation, security_analysis, tool_recommendation)
│   ├── learning_prompts (10 educational prompts)
│   └── ethical_guidelines (10 professional standards)
└── interactive_scenarios
    ├── beginner (Network Discovery, Log Analysis)
    ├── intermediate (Web Application Testing, Wireless Security)
    └── advanced (APT Simulation, Memory Forensics)
```

### 6. Android Application (`android-assistant/`)

The native Android application provides voice-activated cybersecurity assistance with background service capabilities.

**Architecture:**

```
MainActivity.kt (UI Entry Point)
├── AboutActivity.kt (App Information)
├── CyberShellXService.kt (Background Voice Service)
│   ├── Wake Word Detection ("Hey CyberShell")
│   ├── Voice Recognition (Speech-to-Text)
│   ├── AI Communication (HTTP to Backend)
│   └── System Control (WiFi, Bluetooth, Flashlight, Volume)
└── SystemController.kt (Device Control Abstraction)
```

**Build System:**
- Gradle with Kotlin DSL
- Minimum SDK: Configured in `build.gradle.kts`
- ProGuard for release builds

### 7. CLI Interface (`cli-interface.js`)

A standalone Node.js terminal interface that operates independently of the web server, providing direct access to the cybersecurity command processor.

---

## Data Flow

### Command Processing Flow

```
1. User submits command (CLI / Web / Android)
       │
2. Request arrives at Express server
       │
3. Route handler forwards to CyberShellAI.processCommand()
       │
4. Pattern matching determines command category
       │
5. Category handler generates structured CommandResponse
       │
6. Optional: enhanceResponseWithAI() augments with Gemini
       │  ┌─────────────────────────────┐
       │  │  GeminiAPIManager           │
       │  │  ├── Try current API        │
       │  │  ├── On failure: switch     │
       │  │  ├── Retry up to 3 times    │
       │  │  └── Return enhanced text   │
       │  └─────────────────────────────┘
       │
7. Response returned to client with metadata
   { success, response, type, category, difficulty, tools, legal_notice, timestamp }
```

### WebSocket Communication Flow

```
1. Client connects to ws://host:5000/ws/cybershell
       │
2. Server sends welcome message
       │
3. Client sends JSON message { type: "command", command: "..." }
       │
4. Server processes via CyberShellAI
       │
5. Server sends JSON response { type: "response", response: "...", ... }
       │
6. Connection maintained for subsequent messages
       │
7. Client disconnects → server logs closure
```

---

## API Design

### REST Endpoints

| Method | Path | Input | Output | Description |
|--------|------|-------|--------|-------------|
| POST | `/api/command` | `{ command: string, userId?: string }` | `{ success, response, type, category, difficulty, tools, legal_notice, timestamp }` | Process cybersecurity commands |
| GET | `/api/learning-prompt` | - | `{ prompt: string }` | Random educational prompt |
| GET | `/api/scenario/:difficulty` | `difficulty: beginner|intermediate|advanced` | Scenario object | Interactive training scenario |
| GET | `/api/ethics` | - | `{ guidelines: string[] }` | Ethical hacking guidelines |
| GET | `/api/ai/status` | - | `{ total, current, available }` | AI API health status |

### WebSocket Protocol

All WebSocket messages use JSON format:

**Client → Server:**
```json
{ "type": "command", "command": "scan network with nmap" }
{ "type": "learning" }
```

**Server → Client:**
```json
{ "type": "welcome", "message": "Connected to CyberShellX AI..." }
{ "type": "response", "command": "...", "response": "...", "category": "...", "tools": [], "legal_notice": true }
{ "type": "learning_prompt", "prompt": "..." }
{ "type": "error", "message": "..." }
```

---

## Deployment Architecture

### Development

```
Developer Machine
├── Vite Dev Server (HMR on :5000 via proxy)
├── Express Server (API + WebSocket on :5000)
├── PostgreSQL (local or Docker)
└── Android Studio (for mobile app development)
```

### Production

```
Server / Cloud Instance
├── Node.js Process (Express on :5000)
│   ├── Serves compiled static assets
│   ├── REST API endpoints
│   └── WebSocket server
├── PostgreSQL (managed or self-hosted)
└── Nginx (optional reverse proxy with SSL)
```

### Termux (Android)

```
Termux Environment
├── Node.js (via termux pkg)
├── Express Server (bound to 0.0.0.0:5000)
├── Browser access (localhost:5000)
└── CLI interface (direct terminal)
```

---

## Security Architecture

### Application Security

- **Input Validation**: All API inputs validated with Zod schemas before processing
- **Error Handling**: Errors sanitized before client response; internal details logged server-side only
- **Session Management**: Express session with PostgreSQL-backed store via `connect-pg-simple`
- **Authentication**: Passport.js with local strategy (infrastructure in place, extensible)

### AI Safety

- **Legal Notices**: Automated insertion of legal disclaimers for security-related responses
- **Ethical Guidelines**: Programmatically enforced via the ethics endpoint and command processing
- **Content Filtering**: Base responses are pre-reviewed educational content; AI enhancement adds depth without overriding safety notices
- **Authorization Emphasis**: Every tool explanation includes authorization requirements

### Data Protection

- **Database Credentials**: Managed via environment variables, never hardcoded (except backup API keys as fallback)
- **Session Security**: HTTP-only cookies with secure flags in production
- **CORS**: Configured per deployment environment

---

## Related Projects

- **[HermesQuantOS](https://github.com/mulkymalikuldhrs/HermesQuantOS)**: Companion project sharing AI integration patterns and architectural strategies for quantum-resistant security tooling

---

## Future Architecture Considerations

- **Microservices Migration**: Decompose monolithic server into separate AI processing, command handling, and user management services
- **Event-Driven Architecture**: Replace synchronous REST calls with message queues for AI processing pipelines
- **Container Orchestration**: Docker and Kubernetes configurations for scalable deployment
- **Plugin System**: Dynamic loading of community-contributed command categories and tool modules
- **Federated AI**: Support for multiple AI providers beyond Gemini (OpenAI, Claude, local models)
- **Real-Time Collaboration**: WebSocket rooms for team-based security assessment sessions
- **GraphQL API**: Complement REST endpoints with flexible query interface for complex data fetching
