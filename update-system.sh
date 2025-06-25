#!/bin/bash

# CyberShellX Update System
# Ensures updates pull from official repository

OFFICIAL_REPO="https://github.com/mulkymalikuldhrs/cyber-shell-x-nexus.git"

echo "🔄 CyberShellX Update System"
echo "============================"
echo ""

# Check if git is available
if ! command -v git >/dev/null 2>&1; then
    echo "❌ Git not available. Please install git first."
    echo "Manual update: Download from $OFFICIAL_REPO"
    exit 1
fi

echo "🔍 Verifying repository configuration..."

# Check if we're in a git repository
if ! git rev-parse --git-dir >/dev/null 2>&1; then
    echo "❌ Not in a git repository. Cloning fresh copy..."
    cd ..
    git clone $OFFICIAL_REPO cyber-shell-x-nexus-updated
    echo "✅ Fresh copy downloaded to ../cyber-shell-x-nexus-updated"
    echo "Please replace current files with updated version"
    exit 0
fi

# Check current remote
CURRENT_REMOTE=$(git remote get-url origin 2>/dev/null || echo "none")
echo "Current remote: $CURRENT_REMOTE"

# Set correct remote if needed
if [[ "$CURRENT_REMOTE" != "$OFFICIAL_REPO" && "$CURRENT_REMOTE" != "${OFFICIAL_REPO%.git}" ]]; then
    echo "🔧 Updating remote repository URL..."
    git remote set-url origin $OFFICIAL_REPO 2>/dev/null || git remote add origin $OFFICIAL_REPO
    echo "✅ Remote updated to official repository"
fi

echo "📡 Pulling latest changes from official repository..."
git fetch origin
git pull origin main 2>/dev/null || git pull origin master 2>/dev/null || {
    echo "⚠️ Pull failed. Trying reset to match remote..."
    git reset --hard origin/main 2>/dev/null || git reset --hard origin/master 2>/dev/null || {
        echo "❌ Unable to update. Manual intervention required."
        exit 1
    }
}

echo "📦 Updating dependencies..."
npm install

echo "🗄️ Updating database schema..."
npm run db:push

echo "🧹 Building updated version..."
npm run build

echo ""
echo "✅ Update completed successfully!"
echo "🔄 Repository: $OFFICIAL_REPO"
echo "🚀 All components updated with latest features"