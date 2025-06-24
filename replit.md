# CyberShellX Terminal Interface

## Project Overview
CyberShellX is a modern terminal interface application featuring interactive cybersecurity tools demonstration, AI-powered command execution simulation, and a sleek dark-themed UI. The project has been successfully migrated from Lovable to Replit with proper client/server separation and security practices.

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
- Command history and performance analytics

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
- **December 2024**: Migration completed from Lovable to Replit
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

## User Preferences
- User prefers to run applications locally on their own terminal
- Needs clear setup instructions for local development
- Has both Python and React versions of CyberShellX
- Working with Python WebSocket server having asyncio event loop issues
- Wants to run specifically on Termux (Android terminal)
- Wants Android voice assistant GUI to replace Google Assistant/Siri
- Prefers voice-activated AI assistant functionality with wake word detection
- User name: Mulky Malikul Dhaher (to be displayed in Android app)

## Deployment
- Development: `npm run dev` on port 5000
- Production build: `npm run build && npm run start`
- Database schema: `npm run db:push`