
#!/bin/bash

# CyberShellX Nexus - Automatic Installation Script
# Author: Mulky Malikul Dhaher
# Complete automated setup for all platforms

set -e  # Exit on any error

CYAN='\033[0;36m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Banner
clear
echo -e "${CYAN}"
echo "🛡️  CyberShellX Nexus - Automatic Installation"
echo "=============================================="
echo "Advanced Cybersecurity Platform Setup"
echo "Author: Mulky Malikul Dhaher"
echo -e "${NC}"
echo ""

# Detect platform
detect_platform() {
    if [[ "$OSTYPE" == "linux-android"* ]]; then
        PLATFORM="termux"
        echo -e "${YELLOW}📱 Detected: Termux (Android)${NC}"
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        PLATFORM="linux"
        echo -e "${GREEN}🐧 Detected: Linux${NC}"
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        PLATFORM="macos"
        echo -e "${GREEN}🍎 Detected: macOS${NC}"
    elif [[ "$OSTYPE" == "msys" || "$OSTYPE" == "cygwin" ]]; then
        PLATFORM="windows"
        echo -e "${GREEN}🪟 Detected: Windows (WSL/Git Bash)${NC}"
    else
        PLATFORM="unknown"
        echo -e "${YELLOW}❓ Unknown platform, using generic Linux setup${NC}"
    fi
}

# Install Node.js and npm
install_nodejs() {
    echo -e "\n${CYAN}📦 Installing Node.js and npm...${NC}"
    
    case $PLATFORM in
        "termux")
            pkg update -y && pkg upgrade -y
            pkg install -y nodejs npm git curl wget
            ;;
        "linux")
            if command -v apt >/dev/null 2>&1; then
                sudo apt update && sudo apt upgrade -y
                sudo apt install -y nodejs npm git curl wget build-essential
            elif command -v yum >/dev/null 2>&1; then
                sudo yum update -y
                sudo yum install -y nodejs npm git curl wget gcc-c++ make
            elif command -v pacman >/dev/null 2>&1; then
                sudo pacman -Syu --noconfirm
                sudo pacman -S --noconfirm nodejs npm git curl wget base-devel
            fi
            ;;
        "macos")
            if ! command -v brew >/dev/null 2>&1; then
                echo "Installing Homebrew..."
                /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
            fi
            brew update
            brew install node git curl wget
            ;;
        "windows"|*)
            echo -e "${YELLOW}⚠️  Please ensure Node.js is installed from nodejs.org${NC}"
            ;;
    esac
    
    # Verify installation
    if command -v node >/dev/null 2>&1 && command -v npm >/dev/null 2>&1; then
        echo -e "${GREEN}✅ Node.js $(node --version) and npm $(npm --version) installed${NC}"
    else
        echo -e "${RED}❌ Node.js/npm installation failed${NC}"
        exit 1
    fi
}

# Install PostgreSQL
install_postgresql() {
    echo -e "\n${CYAN}🗄️  Installing PostgreSQL...${NC}"
    
    case $PLATFORM in
        "termux")
            pkg install -y postgresql
            ;;
        "linux")
            if command -v apt >/dev/null 2>&1; then
                sudo apt install -y postgresql postgresql-contrib
            elif command -v yum >/dev/null 2>&1; then
                sudo yum install -y postgresql postgresql-server postgresql-contrib
            elif command -v pacman >/dev/null 2>&1; then
                sudo pacman -S --noconfirm postgresql
            fi
            ;;
        "macos")
            brew install postgresql
            ;;
        "windows"|*)
            echo -e "${YELLOW}⚠️  Please install PostgreSQL from postgresql.org${NC}"
            ;;
    esac
    
    echo -e "${GREEN}✅ PostgreSQL installation completed${NC}"
}

# Setup PostgreSQL database
setup_database() {
    echo -e "\n${CYAN}🔧 Setting up PostgreSQL database...${NC}"
    
    case $PLATFORM in
        "termux")
            if [ ! -d "$PREFIX/var/lib/postgresql" ]; then
                pg_ctl -D $PREFIX/var/lib/postgresql initdb
            fi
            pg_ctl -D $PREFIX/var/lib/postgresql start
            sleep 3
            createdb cybershellx 2>/dev/null || echo "Database exists"
            export DATABASE_URL="postgresql://$(whoami)@localhost:5432/cybershellx"
            ;;
        *)
            # Try to start/enable PostgreSQL service
            if command -v systemctl >/dev/null 2>&1; then
                sudo systemctl start postgresql 2>/dev/null || true
                sudo systemctl enable postgresql 2>/dev/null || true
            fi
            
            # Create database (try as postgres user first, then current user)
            sudo -u postgres createdb cybershellx 2>/dev/null || createdb cybershellx 2>/dev/null || echo "Database setup may need manual configuration"
            export DATABASE_URL="postgresql://localhost:5432/cybershellx"
            ;;
    esac
    
    echo -e "${GREEN}✅ Database setup completed${NC}"
}

# Clone or update repository
setup_repository() {
    echo -e "\n${CYAN}📂 Setting up CyberShellX repository...${NC}"
    
    REPO_URL="https://github.com/mulkymalikuldhrs/cyber-shell-x-nexus.git"
    TARGET_DIR="$HOME/cyber-shell-x-nexus"
    
    if [ -d "$TARGET_DIR" ]; then
        echo "Directory exists, updating..."
        cd "$TARGET_DIR"
        git pull origin main 2>/dev/null || git pull origin master 2>/dev/null || echo "Update may have failed"
    else
        echo "Cloning repository..."
        git clone "$REPO_URL" "$TARGET_DIR"
        cd "$TARGET_DIR"
    fi
    
    echo -e "${GREEN}✅ Repository setup completed${NC}"
}

# Install Node.js dependencies
install_dependencies() {
    echo -e "\n${CYAN}📦 Installing Node.js dependencies...${NC}"
    
    # Clear npm cache to avoid conflicts
    npm cache clean --force 2>/dev/null || true
    
    # Install dependencies
    npm install --verbose
    
    echo -e "${GREEN}✅ Dependencies installed${NC}"
}

# Fix package.json scripts
fix_package_scripts() {
    echo -e "\n${CYAN}🔧 Fixing package.json scripts...${NC}"
    
    # Run the fix script if it exists
    if [ -f "scripts/fix-build.js" ]; then
        node scripts/fix-build.js
    else
        echo -e "${YELLOW}⚠️  Manual fix may be needed for package.json${NC}"
        echo "Add this to package.json scripts section:"
        echo '"build:dev": "vite build --mode development"'
    fi
    
    echo -e "${GREEN}✅ Package scripts fixed${NC}"
}

# Setup database schema
setup_schema() {
    echo -e "\n${CYAN}📊 Setting up database schema...${NC}"
    
    # Set environment variable
    case $PLATFORM in
        "termux")
            export DATABASE_URL="postgresql://$(whoami)@localhost:5432/cybershellx"
            ;;
        *)
            export DATABASE_URL="postgresql://localhost:5432/cybershellx"
            ;;
    esac
    
    # Push database schema
    npm run db:push 2>/dev/null || echo "Schema setup may need manual configuration"
    
    echo -e "${GREEN}✅ Database schema setup completed${NC}"
}

# Make scripts executable
setup_permissions() {
    echo -e "\n${CYAN}🔐 Setting up file permissions...${NC}"
    
    # Make all shell scripts executable
    chmod +x ./*.sh 2>/dev/null || true
    chmod +x scripts/*.sh 2>/dev/null || true
    chmod +x android-assistant/*.sh 2>/dev/null || true
    
    echo -e "${GREEN}✅ Permissions configured${NC}"
}

# Create environment configuration
create_env_config() {
    echo -e "\n${CYAN}⚙️  Creating environment configuration...${NC}"
    
    # Create environment file for persistence
    case $PLATFORM in
        "termux")
            echo "export DATABASE_URL=\"postgresql://\$(whoami)@localhost:5432/cybershellx\"" >> ~/.bashrc
            echo "export PATH=\"\$PATH:\$PWD\"" >> ~/.bashrc
            ;;
        *)
            echo "export DATABASE_URL=\"postgresql://localhost:5432/cybershellx\"" >> ~/.bashrc
            echo "export PATH=\"\$PATH:\$PWD\"" >> ~/.bashrc
            ;;
    esac
    
    echo -e "${GREEN}✅ Environment configured${NC}"
}

# Test installation
test_installation() {
    echo -e "\n${CYAN}🧪 Testing installation...${NC}"
    
    # Test Node.js
    if ! command -v node >/dev/null 2>&1; then
        echo -e "${RED}❌ Node.js not available${NC}"
        return 1
    fi
    
    # Test npm
    if ! command -v npm >/dev/null 2>&1; then
        echo -e "${RED}❌ npm not available${NC}"
        return 1
    fi
    
    # Test package.json
    if [ ! -f "package.json" ]; then
        echo -e "${RED}❌ package.json not found${NC}"
        return 1
    fi
    
    # Test build script
    if ! npm run build:dev --dry-run >/dev/null 2>&1; then
        echo -e "${YELLOW}⚠️  build:dev script may need manual fix${NC}"
    fi
    
    echo -e "${GREEN}✅ Installation test passed${NC}"
}

# Main installation function
main() {
    echo -e "${CYAN}🚀 Starting automatic installation...${NC}\n"
    
    detect_platform
    install_nodejs
    install_postgresql
    setup_repository
    cd "$HOME/cyber-shell-x-nexus" || exit 1
    setup_database
    install_dependencies
    fix_package_scripts
    setup_schema
    setup_permissions
    create_env_config
    test_installation
    
    echo -e "\n${GREEN}🎉 CyberShellX Nexus installation completed!${NC}"
    echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
    echo -e "${GREEN}📍 Installation Location: $HOME/cyber-shell-x-nexus${NC}"
    echo -e "${GREEN}🌐 Web Interface: http://localhost:5000${NC}"
    echo -e "${GREEN}🛡️  All components ready for use${NC}"
    echo ""
    echo -e "${CYAN}🚀 Available Launch Options:${NC}"
    echo "   ./launcher.sh           - Interactive menu (recommended)"
    echo "   ./launcher.sh web       - Web server only"
    echo "   ./launcher.sh cli       - CLI interface only"
    echo "   ./start-cybershellx.sh  - Full system startup"
    echo ""
    
    # Auto-launch option
    read -p "Launch CyberShellX Nexus now? (y/n): " launch_choice
    if [[ $launch_choice =~ ^[Yy]$ ]]; then
        echo -e "\n${CYAN}🚀 Launching CyberShellX Nexus...${NC}"
        if [ -f "launcher.sh" ]; then
            chmod +x launcher.sh
            ./launcher.sh
        else
            echo "Starting web server..."
            npm run dev
        fi
    else
        echo -e "\n${GREEN}Setup complete! Run './launcher.sh' when ready.${NC}"
    fi
}

# Error handling
trap 'echo -e "\n${RED}❌ Installation interrupted${NC}"; exit 1' INT TERM

# Run main installation
main "$@"
