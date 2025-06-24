#!/data/data/com.termux/files/usr/bin/bash

# CyberShellX Nexus - Termux Installation Script
# Author: Mulky Malikul Dhaher

echo "🛡️ Starting CyberShellX Nexus installation on Termux..."

# Update and upgrade Termux packages
echo "📦 Updating Termux packages..."
pkg update -y && pkg upgrade -y

# Install required packages
echo "🔧 Installing required packages..."
pkg install -y nodejs postgresql python git curl wget

# Grant storage permissions
echo "📱 Setting up storage permissions..."
termux-setup-storage

# Create project directory
echo "📁 Setting up project directory..."
cd $HOME
if [ -d "cyber-shell-x-nexus" ]; then
    echo "Directory exists, updating..."
    cd cyber-shell-x-nexus
    git pull
else
    echo "Cloning repository..."
    git clone https://github.com/mulkymalikuldhrs/cyber-shell-x-nexus.git
    cd cyber-shell-x-nexus
fi

# Install Node.js dependencies
echo "📦 Installing Node.js dependencies..."
npm install

# Initialize PostgreSQL (first time only)
echo "🗄️ Setting up PostgreSQL..."
if [ ! -d "$PREFIX/var/lib/postgresql" ]; then
    echo "Initializing PostgreSQL database..."
    pg_ctl -D $PREFIX/var/lib/postgresql initdb
fi

# Start PostgreSQL service
echo "🚀 Starting PostgreSQL service..."
pg_ctl -D $PREFIX/var/lib/postgresql start

# Wait for PostgreSQL to start
sleep 2

# Create database
echo "🗄️ Creating database..."
createdb cybershellx 2>/dev/null || echo "Database already exists"

# Set environment variable
echo "🔧 Setting up environment..."
export DATABASE_URL="postgresql://$(whoami)@localhost:5432/cybershellx"

# Add to shell profile for persistence
echo "export DATABASE_URL=\"postgresql://\$(whoami)@localhost:5432/cybershellx\"" >> ~/.bashrc

# Push database schema
echo "📊 Setting up database schema..."
npm run db:push

# Create startup script
echo "📝 Creating startup script..."
cat > start-cybershell.sh << 'EOF'
#!/data/data/com.termux/files/usr/bin/bash

# Start PostgreSQL if not running
pg_ctl -D $PREFIX/var/lib/postgresql status >/dev/null 2>&1 || {
    echo "Starting PostgreSQL..."
    pg_ctl -D $PREFIX/var/lib/postgresql start
    sleep 2
}

# Set environment variable
export DATABASE_URL="postgresql://$(whoami)@localhost:5432/cybershellx"

# Start CyberShellX Nexus
echo "🛡️ Starting CyberShellX Nexus..."
npm run dev
EOF

chmod +x start-cybershell.sh

echo ""
echo "✅ Installation completed successfully!"
echo ""
echo "🚀 To start CyberShellX Nexus:"
echo "   cd ~/cyber-shell-x-nexus"
echo "   ./run.sh             # Interactive launcher"
echo "   ./start-cybershell.sh # Direct web server"
echo ""
echo "📱 Access the application at: http://localhost:5000"
echo ""
echo "🛡️ Features available:"
echo "   • Interactive cybersecurity terminal"
echo "   • AI-powered security assistant"
echo "   • Command simulation and learning"
echo "   • Real-time security tool demonstrations"
echo ""
echo "📞 Support: +6285322624048 (Indonesian e-wallets)"
echo "🐙 GitHub: https://github.com/mulkymalikuldhrs/cyber-shell-x-nexus"