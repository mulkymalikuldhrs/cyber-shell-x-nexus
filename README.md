# CyberShellX Terminal Interface

A modern cybersecurity terminal interface with interactive demonstrations and AI-powered command simulation.

## Features
- Interactive terminal interface with command simulation
- Cybersecurity tool demonstrations
- Real-time WebSocket capability
- Dark theme with animations
- PostgreSQL database integration
- Cloud data storage with Supabase support
- Cross-device synchronization
- AI learning from user patterns
- Command history and analytics
- Voice assistant with Android app

## Quick Start on Replit
The application is ready to run on Replit:
1. The server starts automatically on port 5000
2. Access via the webview panel
3. Database is pre-configured

## Local Development
See [TERMUX_SETUP.md](./TERMUX_SETUP.md) for running on Android/Termux or local environments.

## Architecture
- Frontend: React 18 + TypeScript + Vite
- Backend: Express.js + TypeScript
- Database: PostgreSQL with Drizzle ORM
- Styling: Tailwind CSS + Radix UI

## Commands
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run db:push` - Push database schema
- `npm run start` - Start production server

## Data Storage
CyberShellX supports multiple storage backends:
- **Local**: PostgreSQL for core functionality
- **Cloud**: Supabase for cross-device sync and AI learning
- **Mobile**: SQLite with cloud sync for Android app

See [DATA_STORAGE.md](./DATA_STORAGE.md) for detailed storage architecture and Supabase integration examples.