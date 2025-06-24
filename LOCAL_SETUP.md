# Running CyberShellX Locally

## Prerequisites
- Node.js 20 or higher
- PostgreSQL database
- Git

## Setup Steps

1. **Clone and Install Dependencies**
   ```bash
   git clone <your-repo-url>
   cd cybershellx
   npm install
   ```

2. **Database Setup**
   Create a PostgreSQL database and set the environment variable:
   ```bash
   export DATABASE_URL="postgresql://username:password@localhost:5432/cybershellx"
   ```

3. **Push Database Schema**
   ```bash
   npm run db:push
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```

5. **Access Application**
   Open your browser to: http://localhost:5000

## Important Notes
- The application runs on port 5000, not 5173
- Make sure PostgreSQL is running before starting the app
- The DATABASE_URL environment variable is required

## Troubleshooting
- If port 5000 is busy, the app will fail to start
- Check PostgreSQL connection if database errors occur
- Use `npm run check` to verify TypeScript compilation