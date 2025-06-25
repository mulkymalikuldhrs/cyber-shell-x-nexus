#!/bin/bash

# CyberShellX Nexus - Quick Start
# Simple launcher for CyberShellX components

clear
echo "🛡️  CyberShellX Nexus - Quick Start"
echo "=================================="
echo ""

# Check if main launcher exists
if [ -f "run.sh" ]; then
    chmod +x run.sh
    echo "Starting main launcher..."
    ./run.sh
else
    echo "Main launcher not found. Starting web interface..."
    echo "Access at: http://localhost:5000"
    npm run dev
fi