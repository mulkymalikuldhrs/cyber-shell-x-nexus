# CyberShellX Nexus - Project Structure

```
cyber-shell-x-nexus/
├── 📁 android-assistant/          # Android voice assistant app
│   ├── app/                       # Android app source
│   ├── build-apk.sh              # APK build script
│   └── install-apk.sh            # APK installation script
├── 📁 client/                     # React frontend
│   ├── src/
│   │   ├── components/           # React components
│   │   ├── pages/               # Application pages
│   │   └── lib/                 # Utilities and helpers
│   └── index.html
├── 📁 server/                     # Express backend
│   ├── cybershell-ai.ts         # AI command processing
│   ├── gemini-api.ts            # Multi-API fallback system
│   ├── routes.ts                # API endpoints
│   ├── db.ts                    # Database connection
│   └── index.ts                 # Server entry point
├── 📁 shared/                     # Shared types and schemas
│   └── schema.ts                # Database schema definitions
├── 📁 cybershell-commands/        # Command database
│   ├── commands.json            # Tool definitions
│   └── ai-knowledge-base.md     # AI training data
├── 📁 docs/                       # Documentation
│   ├── API.md                   # API documentation
│   └── TROUBLESHOOTING.md       # Common issues
├── 📁 scripts/                    # Utility scripts
│   └── health-check.js          # System health verification
├── 📁 tests/                      # Test files (future)
├── 🔧 Configuration Files
│   ├── package.json             # Dependencies and scripts
│   ├── vite.config.ts           # Frontend build config
│   ├── drizzle.config.ts        # Database config
│   ├── tailwind.config.ts       # Styling config
│   └── tsconfig.json            # TypeScript config
├── 🚀 Entry Points
│   ├── run.sh                   # Interactive launcher (MAIN)
│   ├── cli-interface.js         # CLI terminal interface
│   └── termux-install.sh        # Termux installation
└── 📚 Documentation
    ├── README.md                # Main documentation
    ├── TERMUX_SETUP.md         # Termux installation guide
    ├── COMPILE_ANDROID.md      # Android build guide
    └── replit.md               # Project context and preferences
```

## Key Components

### 🎯 Main Entry Point
- **run.sh** - Interactive launcher with 6 options

### 🤖 AI System
- **Multi-API Fallback** - 4 Gemini API endpoints with automatic switching
- **Enhanced Responses** - AI-powered cybersecurity guidance
- **Status Monitoring** - Real-time API health tracking

### 🔧 Interfaces
1. **CLI Terminal** (Option 1) - Interactive command-line interface
2. **Web Server** (Option 2) - Full browser interface on port 5000
3. **Android GUI** (Option 3) - Voice assistant with wake word detection
4. **Update System** (Option 4) - Automatic updates and dependency management

### 📊 Database
- **PostgreSQL** - Primary data storage
- **Drizzle ORM** - Type-safe database operations
- **Auto-migration** - Schema updates via npm run db:push

### 🛡️ Security
- **Environment Variables** - Secure API key management
- **Server-side Processing** - No client-side database access
- **Multi-layer Fallback** - Redundant API endpoints

## Development Workflow

1. **Start**: `./run.sh` (recommended)
2. **Develop**: `npm run dev` (web only)
3. **Test**: `node scripts/health-check.js`
4. **Build**: `npm run build`
5. **Deploy**: Automatic via Replit