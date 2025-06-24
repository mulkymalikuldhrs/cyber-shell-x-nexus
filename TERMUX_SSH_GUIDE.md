# SSH Setup and Termux Installation Guide

## Setting Up SSH Access in Termux

Since I can't directly connect to your SSH from this environment, here's how to set up SSH access and fix your Termux installation:

### Step 1: Enable SSH in Termux
```bash
# Install OpenSSH
pkg install openssh

# Start SSH daemon
sshd

# Check SSH is running (should show port 8022)
netstat -an | grep 8022
```

### Step 2: Set Up SSH Key Authentication (Recommended)
```bash
# Generate SSH key pair
ssh-keygen -t rsa -b 4096

# Copy public key to authorized_keys
cat ~/.ssh/id_rsa.pub >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
```

### Step 3: Find Your Device IP
```bash
# Get your local IP address
ip route get 1.1.1.1 | grep -oP 'src \K\S+'
# Or use
ifconfig | grep inet
```

### Step 4: SSH Connection from Another Device
```bash
# Connect from another device on same network
ssh -p 8022 username@YOUR_DEVICE_IP

# If using key authentication
ssh -i ~/.ssh/id_rsa -p 8022 username@YOUR_DEVICE_IP
```

## Common Termux Installation Issues & Fixes

### Issue 1: Package Installation Failures
```bash
# Update package lists
pkg update && pkg upgrade

# Clear package cache
pkg clean

# Reinstall specific packages
pkg reinstall nodejs postgresql python
```

### Issue 2: Node.js/NPM Issues
```bash
# Remove corrupted Node.js installation
pkg uninstall nodejs npm

# Reinstall Node.js
pkg install nodejs

# Verify installation
node --version
npm --version

# If npm is missing, install separately
pkg install npm
```

### Issue 3: PostgreSQL Setup Problems
```bash
# Complete PostgreSQL removal and reinstall
pkg uninstall postgresql
rm -rf $PREFIX/var/lib/postgresql
pkg install postgresql

# Initialize PostgreSQL
pg_ctl -D $PREFIX/var/lib/postgresql initdb

# Start PostgreSQL
pg_ctl -D $PREFIX/var/lib/postgresql start

# Create user and database
createuser $(whoami)
createdb cybershellx
```

### Issue 4: Permission Problems
```bash
# Grant storage permissions
termux-setup-storage

# Fix file permissions
chmod -R 755 ~/cybershellx

# Fix npm permissions
npm config set prefix ~/.npm-global
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
source ~/.bashrc
```

## Alternative: Remote Assistance Without SSH

If SSH setup is problematic, you can share error outputs for diagnosis:

### Collect System Information
```bash
# System info
uname -a
pkg list-installed | grep -E "(nodejs|postgresql|python)"

# Error logs
cat ~/.npm/_logs/*.log | tail -50
journalctl -u postgresql | tail -20
```

### Share Installation Attempts
```bash
# Try installation with verbose output
pkg install -v nodejs 2>&1 | tee install_log.txt
npm install 2>&1 | tee npm_install_log.txt

# Share the log files content
cat install_log.txt
cat npm_install_log.txt
```

## Quick Fix Commands

### Reset Termux Environment
```bash
# Nuclear option - reset everything
pkg clean
pkg update
pkg upgrade
pkg install git nodejs postgresql python

# Clone and setup project
git clone https://github.com/mulkymalikuldhrs/cyber-shell-x-nexus.git
cd cyber-shell-x-nexus
npm install
```

### Set Environment Variables
```bash
# Add to ~/.bashrc
echo 'export DATABASE_URL="postgresql://$(whoami)@localhost:5432/cybershellx"' >> ~/.bashrc
echo 'export NODE_ENV=development' >> ~/.bashrc
source ~/.bashrc
```

## What Information to Share

Instead of SSH access, please share:

1. **Error messages** when running installation commands
2. **Package versions**: `node --version`, `npm --version`, `pkg list-installed`
3. **System info**: `uname -a`, available storage space
4. **Log files**: npm error logs, PostgreSQL logs
5. **Current directory structure**: `ls -la` of project folder

This way I can provide specific fixes for your exact issues without needing direct access.