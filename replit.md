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

## Database Schema
- Users table with username/password authentication structure
- Database connection configured via Drizzle ORM with PostgreSQL

## Security Implementation
- Client/server separation enforced
- Database operations handled server-side only
- Environment variables properly secured
- No client-side database access

## Recent Changes
- **December 2024**: Migrated from Lovable to Replit
- Removed Supabase integration, replaced with PostgreSQL
- Set up Drizzle ORM for type-safe database operations
- Configured proper client/server architecture
- Removed all client-side database access for security

## User Preferences
(To be updated based on user interactions)

## Deployment
- Development: `npm run dev` on port 5000
- Production build: `npm run build && npm run start`
- Database schema: `npm run db:push`