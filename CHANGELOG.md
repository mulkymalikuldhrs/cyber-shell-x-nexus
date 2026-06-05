# Changelog

All notable changes to the CyberShellX Nexus project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.0] - 2026-03-05

### Security
- **CRITICAL**: Removed `.env` from git tracking — Supabase anon key and URL no longer exposed in repository history
- Added `.replit` to `.gitignore` to prevent IDE config leaks
- Added input validation on `/api/command` endpoint — validates command type, length (max 2000 chars), and emptiness
- Added rate limiting on all API routes (60 requests/minute per IP)
- Added request body size limits (1mb) to prevent payload abuse
- Fixed error handler in `server/index.ts` that was re-throwing errors after sending responses (could crash the process)
- Removed external e-wallet logo URLs from DonationSection (potential tracking vectors)
- All `window.open()` calls now use `noopener,noreferrer` to prevent reverse tabnabbing

### Changed — TypeScript & Type Safety
- Replaced all `any` types in `server/cybershell-ai.ts` with proper interfaces (`CommandsData`, `CommandCategory`, `AiPromptConfig`, `InteractiveScenario`, etc.)
- Typed all `any` parameters in `server/supabase-integration.ts` with proper interfaces (`CommandHistory`, `CommandContext`, `VoiceSettings`, `UserPreferences`, `AILearningData`, `AIPerformance`, `AIPatterns`)
- Typed `getAIStatus()` return value as `{ total: number; current: string; available: string[] }` instead of `any`
- Removed `'ai_enhanced_response' as any` cast — now properly included in `CommandResponse` type union
- Typed `apiRequest` helper in `queryClient.ts` with generic `<T>` return type
- Replaced `Record<string, any>` with `Record<string, unknown>` in request logging middleware
- Added proper `Error` typing in global error handler instead of `any`

### Changed — Error Handling
- Added React `ErrorBoundary` component wrapping the entire app with user-friendly fallback UI
- Added `LoadingSpinner` component for API call states
- Supabase integration now uses lazy initialization with clear error messages when unconfigured
- WebSocket `onerror` handler no longer crashes on missing error object
- `server/storage.ts` `createUser` now throws if no row is returned
- All API route handlers now have proper try/catch with `console.error` logging
- `CyberShellXTerminal` shows loading spinner during API calls and handles non-ok responses gracefully

### Changed — Accessibility
- Added `role="region"`, `role="log"`, `role="status"`, `role="alert"`, `role="article"` ARIA landmarks throughout all components
- Added `aria-label` attributes to all interactive buttons, links, and sections
- Added `aria-hidden="true"` to decorative icons
- Added `aria-live="polite"` to terminal output areas
- Fixed `NotFound` page with proper `role="alert"` and better styling
- Replaced deprecated `onKeyPress` with `onKeyDown` in `CyberShellXTerminal`
- Added `maxLength` attribute to command input

### Changed — Code Quality
- Used `useCallback` throughout `CyberShellXTerminal` and `TerminalInterface` to prevent unnecessary re-renders
- Fixed `TerminalInterface` useEffect dependency array (was missing `runCommand`)
- Used `useRef` for interval in `TerminalInterface` for proper cleanup
- Extracted `features` array from `Index` component to module scope to avoid re-creation on each render
- Added unique keys based on `feature.title` instead of array index in feature grid
- Copyright year updated from 2024 to 2025
- Consistent quote usage (replaced `&apos;` and smart quotes with proper HTML entities)
- Removed unused imports (`Play`, `Square` cleanup, `Brain` import in Index)
- Added `/api/ai/status` endpoint that was referenced by CLI but missing from routes

### Changed — SEO & Metadata
- Added `<title>`, `<meta description>`, `<meta keywords>`, `<meta author>`, `<meta theme-color>` to client HTML
- Added Open Graph meta tags (`og:title`, `og:description`, `og:type`)
- Added `<link rel="icon">` for favicon

### Changed — Performance
- Port is now configurable via `PORT` environment variable (default 5000)
- QueryClient configured with `retry: 2` and `staleTime: 5min`
- `gemini-api.ts` `analyzeSentiment` now properly types the parsed JSON response

## [1.1.0] - 2026-03-05

### Security
- **CRITICAL**: Removed hardcoded Gemini API keys from `server/gemini-api.ts` — backup API keys now read from environment variables (`GEMINI_BACKUP_KEY_1`, `GEMINI_BACKUP_KEY_2`)

### Changed
- Deleted stale remote branches: `feat/production-readiness-*`, `feat/project-overhaul-*`, `feature/full-cli-transformation`, `fix/production-readiness-*`, `jules-prod-readiness-*`, `jules-upgrade-cli-*`, `main-*`, `mentat-*`

## [1.0.0] - 2025-03-04

### Added

- **Core Platform**: Initial release of CyberShellX Nexus, an advanced cybersecurity platform with AI-powered assistant capabilities spanning CLI, web, and Android interfaces.
- **AI Engine**: Integrated Google Gemini 2.5 Flash/Pro with a resilient multi-API fallback system supporting 4 concurrent API endpoints with automatic failover and health monitoring.
- **CyberShellAI Processing Engine**: Context-aware command processor covering network scanning, vulnerability assessment, SQL injection analysis, Metasploit framework guidance, network traffic analysis, password security, digital forensics, wireless security, and system analysis.
- **CLI Interface**: Interactive Node.js terminal with cybersecurity tool simulations (nmap, metasploit, wireshark, sqlmap, burpsuite, hashcat, aircrack-ng), educational command demonstrations, and cross-platform compatibility.
- **Web Dashboard**: Full React 18 + TypeScript + Vite application featuring real-time terminal simulation with WebSocket support, AI chat interface, tool management, responsive dark theme, and comprehensive Radix UI component library with shadcn/ui styling.
- **Android Voice Assistant**: Native Kotlin application with "Hey CyberShell" wake word detection, background service for always-on functionality, system control (WiFi, Bluetooth, flashlight, volume), shell command execution, and AI-powered cybersecurity guidance.
- **WebSocket Server**: Real-time bidirectional communication channel at `/ws/cybershell` for live terminal interaction, command processing, and learning prompt delivery.
- **Database Layer**: PostgreSQL integration with Drizzle ORM, user schema with authentication support, and Supabase client integration for enhanced data management.
- **Interactive Training Scenarios**: Difficulty-tiered learning exercises covering network discovery (beginner), web application testing (intermediate), and APT simulation (advanced) with estimated completion times.
- **Command Knowledge Base**: Comprehensive JSON-based definitions for 6 command categories (networking, exploitation, forensics, system, wireless, cryptography) with syntax, examples, and difficulty ratings.
- **Ethical Guidelines Engine**: Automated legal notice and ethical guidelines delivery with every security-related response, emphasizing authorization requirements and responsible disclosure.
- **Learning Prompts**: Curated set of 10 educational prompts covering OWASP Top 10, penetration testing phases, SQL injection prevention, encryption fundamentals, and incident response.
- **API Documentation**: Complete REST API reference for command processing, learning prompts, scenarios, ethics, and AI status endpoints.
- **Launcher System**: Interactive shell launcher (`launcher.sh`) with menu-driven access to CLI, web, Android, update, and status modes, plus alternative launchers (`cyber.sh`, `start.sh`, `run.sh`).
- **Termux Support**: Dedicated installation script and setup guide for running the platform on Android via Termux.
- **System Utilities**: Health check script for system verification, repository validation script, and build troubleshooting utilities.
- **Project Documentation**: README with installation and usage guides, project structure document, Termux setup guide, SSH guide for remote access, and troubleshooting documentation.

### Security

- All cybersecurity command responses include legal notices emphasizing the requirement for proper authorization.
- Ethical guidelines are enforced throughout the platform, with dedicated API endpoints for guideline retrieval.
- The platform is designed exclusively for educational and authorized security testing purposes.

---

## [Unreleased]

### Planned

- Command history persistence and search functionality
- Multi-language AI response support
- Extended forensics module with timeline reconstruction
- Integration with HermesQuantOS for advanced quantum-resistant security analysis
- Enhanced Android assistant with offline mode capabilities
- Docker containerization for simplified deployment
- Comprehensive test suite with automated CI/CD pipeline
- Additional AI model support beyond Gemini (OpenAI, Claude, local models)
- User authentication with role-based access control
- Real-time collaboration features for team-based security assessments
- Plugin architecture for community-contributed tool modules

[1.0.0]: https://github.com/mulkymalikuldhrs/cyber-shell-x-nexus/releases/tag/v1.0.0
[1.1.0]: https://github.com/mulkymalikuldhrs/cyber-shell-x-nexus/releases/tag/v1.1.0
[2.0.0]: https://github.com/mulkymalikuldhrs/cyber-shell-x-nexus/releases/tag/v2.0.0
