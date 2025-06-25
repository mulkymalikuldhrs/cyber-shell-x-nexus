# CyberShellX Nexus 🛡️

## Project Overview
CyberShellX Nexus is an advanced cybersecurity platform featuring an AI-powered assistant, interactive terminal interface, and cross-platform voice commands. Built for security professionals, penetration testers, and cybersecurity enthusiasts with comprehensive tool integration and real-time analysis capabilities.

**Current Status**: Fully operational on Replit with enhanced launcher system providing 5 specialized interfaces: AI-enhanced CLI shell, desktop web interface, mobile Termux interface, Android voice assistant backend, and automatic update system.

## Architecture
- **Frontend**: React 18 with TypeScript, Vite for development
- **Backend**: Express.js server with TypeScript
- **Database**: PostgreSQL (Replit built-in) with Drizzle ORM
- **Styling**: Tailwind CSS with Radix UI components
- **Routing**: React Router DOM for client-side navigation

## Key Features
- Interactive terminal interface with command simulation
- Cybersecurity tool demonstrations
- Real-time WebSocket connection capability
- Responsive design with dark theme
- Feature cards showcasing capabilities
- Cloud data storage with Supabase integration
- Cross-device synchronization and backup
- AI learning from user command patterns
- Voice assistant Android app with wake word detection
- System control capabilities (WiFi, Bluetooth, flashlight, volume, brightness)
- Command history and performance analytics
- Shell command execution with root access

## Database Architecture
### Local Database (PostgreSQL)
- Users table with username/password authentication
- Database connection via Drizzle ORM
- Core application data and sessions

### Cloud Storage (Supabase)
- Command history with analytics
- User profiles and preferences
- AI learning data collection
- Cross-device synchronization
- Real-time data updates

## Security Implementation
- Client/server separation enforced
- Database operations handled server-side only
- Environment variables properly secured
- No client-side database access

## Recent Changes
- **December 2024**: Project structure reorganized with main launcher
- Created `launcher.sh` as primary entry point with numbered menu options (01-05)
- Reorganized launcher files with clear hierarchy: launcher.sh > cyber.sh > start.sh > run.sh
- Updated documentation to prioritize main launcher usage with numbered options
- Repository update system configured to pull from official GitHub source
- **December 2024**: Multi-API fallback system implemented
- Added intelligent Gemini API switching with 4 endpoint fallback
- Enhanced AI responses with automatic API failure recovery
- Created specialized launcher with 5 targeted options: AI-Enhanced CLI, Desktop Web, Termux Mobile, Android Backend, System Update
- Added Node.js-based CLI interface with cybersecurity tool simulations
- **December 2024**: Professional platform development completed
- Removed Supabase integration, replaced with PostgreSQL
- Set up Drizzle ORM for type-safe database operations
- Configured proper client/server architecture
- Removed all client-side database access for security
- Created comprehensive Termux setup guide for local development
- Provided WebSocket server fix for Python version asyncio issues
- Added README.md and cleaned up project structure
- Fixed port conflicts and ensured proper deployment readiness
- Created native Android voice assistant app with wake word detection
- Implemented always-listening background service
- Added voice command processing and text-to-speech responses
- Enhanced AI knowledge base with cybersecurity expertise
- Added comprehensive command database with 50+ security tools
- Implemented intelligent command processing and responses
- Created interactive learning scenarios and ethical guidelines
- Updated README to professional format with GitHub integration
- Added GitHub repository section to web UI
- Implemented donation system with Indonesian e-wallet providers
- Added creator branding and professional presentation
- **Enhanced Android App with System Control**: Added comprehensive device management capabilities including WiFi, Bluetooth, flashlight, volume, brightness, and shell command execution
- **Interactive Multi-Component Launcher**: Implemented automatic run system with menu options for CLI interface, web server, and Android GUI components

## User Preferences
- User prefers to run applications locally on their own terminal
- Needs clear setup instructions for local development
- Has both Python and React versions of CyberShellX
- Working with Python WebSocket server having asyncio event loop issues
- Wants to run specifically on Termux (Android terminal)
- Wants Android voice assistant GUI to replace Google Assistant/Siri
- Prefers voice-activated AI assistant functionality with wake word detection
- User name: Mulky Malikul Dhaher (to be displayed in Android app)
- GitHub repository: https://github.com/mulkymalikuldhrs/cyber-shell-x-nexus (primary source for updates)
- Donation support via Indonesian e-wallets with phone +6285322624048
- Needs SSH connection assistance for Termux installation fixes

## Getting Started

### 🚀 Quick Access
- **GitHub Repository**: https://github.com/mulkymalikuldhrs/cyber-shell-x-nexus
- **Live Demo**: Running on Replit at port 5000
- **Documentation**: Comprehensive guides available in project files

### 💻 Development Commands
- Main Launcher: `./launcher.sh` (recommended)
- Direct Commands: `./launcher.sh [cli|web|android|update|status]`
- Alternative: `./cyber.sh` or `./start.sh`
- Development: `npm run dev` on port 5000
- Database schema: `npm run db:push`

### 📱 Mobile Application
- Android APK: Build using `./build-apk.sh` in android-assistant folder
- Voice Commands: "Hey CyberShell" wake word activation
- Background Service: Always-listening cybersecurity assistant

### 🤝 Contributing & Support
- **Repository**: Clone and contribute at GitHub
- **Issues**: Report bugs and request features via GitHub Issues
- **Documentation**: Complete setup guides for Termux, Android, and local development

### 💝 Support Development
Support the ongoing development of CyberShellX Nexus:

**Indonesian E-Wallet Donations:**
- **Phone Number**: +62 853-****-4048 (click to reveal: +6285322624048)
- **Supported Platforms**: GoPay, OVO, DANA, ShopeePay, LinkAja, SeaBank
- **Usage**: All donations help maintain servers, develop features, and keep the project free

**Why Support:**
- Maintain free access for cybersecurity community
- Continuous AI knowledge base updates
- New tool integrations and features
- Server hosting and development costs
- Open source contribution sustainability

**Recognition:**
- GitHub sponsor badges
- Priority feature requests
- Direct developer access
- Community recognition