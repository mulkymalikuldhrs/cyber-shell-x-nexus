
#!/usr/bin/env python3
"""
CyberShellX Installation Script
Created by Mulky Maliku Dhaher
"""

import os
import sys
import subprocess
import platform
import shutil
from pathlib import Path

def install_requirements():
    """Install required Python packages"""
    requirements = [
        "colorama",
        "requests", 
        "pexpect"
    ]
    
    print("🔧 Installing Python requirements...")
    for package in requirements:
        try:
            subprocess.run([sys.executable, "-m", "pip", "install", package], check=True)
            print(f"✅ {package} installed")
        except subprocess.CalledProcessError:
            print(f"❌ Failed to install {package}")
            return False
    return True

def setup_cybershellx():
    """Setup CyberShellX environment"""
    home_dir = Path.home()
    cybershellx_dir = home_dir / ".cybershellx"
    
    # Create directories
    directories = [
        cybershellx_dir,
        cybershellx_dir / "tools",
        cybershellx_dir / "data", 
        cybershellx_dir / "logs",
        cybershellx_dir / "memory"
    ]
    
    for directory in directories:
        directory.mkdir(exist_ok=True)
        print(f"📁 Created: {directory}")
    
    return cybershellx_dir

def create_launcher():
    """Create launcher script"""
    system = platform.system().lower()
    
    if system == "windows":
        launcher_path = "cybershellx.bat"
        content = f"""@echo off
python {os.path.abspath('cybershellx.py')} %*
"""
    else:
        launcher_path = "cybershellx"
        content = f"""#!/bin/bash
python3 {os.path.abspath('cybershellx.py')} "$@"
"""
    
    with open(launcher_path, 'w') as f:
        f.write(content)
    
    if system != "windows":
        os.chmod(launcher_path, 0o755)
    
    print(f"🚀 Launcher created: {launcher_path}")

def main():
    print("""
╔══════════════════════════════════════════════════════════════════╗
║                  CyberShellX Installer                           ║
║           Autonomous Command Line AI Assistant                   ║
║                                                                  ║
║             Created by Mulky Maliku Dhaher                       ║
╚══════════════════════════════════════════════════════════════════╝
    """)
    
    print("🔍 Checking system requirements...")
    
    # Check Python version
    if sys.version_info < (3, 7):
        print("❌ Python 3.7 or higher is required")
        sys.exit(1)
    
    print(f"✅ Python {sys.version.split()[0]} detected")
    print(f"✅ Platform: {platform.system()} {platform.machine()}")
    
    # Install requirements
    if not install_requirements():
        print("❌ Failed to install requirements")
        sys.exit(1)
    
    # Setup environment
    cybershellx_dir = setup_cybershellx()
    print(f"✅ CyberShellX environment created at: {cybershellx_dir}")
    
    # Create launcher
    create_launcher()
    
    print("\n🎉 CyberShellX installation completed!")
    print("\n🚀 To start CyberShellX:")
    if platform.system().lower() == "windows":
        print("   cybershellx.bat")
    else:
        print("   ./cybershellx")
        print("   OR")
        print("   python3 cybershellx.py")
    
    print("\n💡 First time? Try these commands:")
    print("   help                    - Show all commands")
    print("   chat hello              - Chat with AI")
    print("   install nmap            - Install tools")
    print("   pentest example.com     - Security testing")

if __name__ == "__main__":
    main()
