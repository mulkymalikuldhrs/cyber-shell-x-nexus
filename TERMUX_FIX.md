# 🛡️ CyberShellX Termux Fix - Offline Mode Solution

Solusi lengkap untuk menjalankan CyberShellX di Termux dengan mode offline yang stabil.

## 🚨 Masalah yang Diperbaiki

### 1. **Script build:dev tidak ditemukan**
- ✅ Script `fix-build.js` dikonversi ke ES modules
- ✅ Dependency `tsx` ditambahkan
- ✅ Package.json scripts diperbaiki

### 2. **SyntaxError dengan shebang**
- ✅ Shebang `#!/usr/bin/env node` dihapus
- ✅ Import statements diubah dari CommonJS ke ES modules
- ✅ Compatibility dengan Node.js v18+ 

### 3. **tsx command not found**
- ✅ `tsx` diinstall sebagai dev dependency
- ✅ Alternative offline mode tanpa tsx

## 🚀 Solusi: Termux Offline Setup

### **Quick Fix (Automated):**
```bash
# Download dan jalankan setup otomatis
curl -o termux-offline-setup.sh https://raw.githubusercontent.com/mulkymalikuldhrs/cyber-shell-x-nexus/main/termux-offline-setup.sh
chmod +x termux-offline-setup.sh
./termux-offline-setup.sh
```

### **Manual Setup:**
```bash
# 1. Masuk ke directory CyberShellX
cd ~/cyber-shell-x-nexus

# 2. Install dependencies minimal
npm install express ws node-fetch --save

# 3. Setup offline mode
./termux-offline-setup.sh

# 4. Test CLI interface
node cli-interface.js

# 5. Test web server
npm run dev
```

## 📋 Mode Offline Features

### ✅ **Yang Berfungsi:**
- **CLI Interface**: Penuh dengan simulasi tools cybersecurity
- **Web Server**: Interface sederhana untuk monitoring
- **Basic Commands**: help, status, mode switching
- **Tool Simulations**: nmap, metasploit, wireshark, dll
- **Educational Mode**: Pembelajaran cybersecurity

### ⚠️ **Batasan Mode Offline:**
- **AI Generation**: Tidak tersedia (butuh internet + API keys)
- **Real Command Execution**: Disabled untuk keamanan
- **Database**: Tidak diperlukan untuk mode offline
- **Advanced Features**: Requires online mode

## 🎯 Cara Menggunakan

### **1. CLI Interface (Recommended)**
```bash
node cli-interface.js

# Available commands:
help                    # Show help menu
status                  # System status
mode programming        # Switch to programming mode
mode cybersecurity      # Switch to cybersecurity mode
nmap -sV target.com     # Simulate nmap scan
msfconsole             # Simulate Metasploit
```

### **2. Web Interface**
```bash
npm run dev
# Access: http://localhost:5000
```

### **3. Launcher Scripts**
```bash
./launcher.sh cli      # Start CLI
./launcher.sh status   # Health check
./launcher.sh web      # Start web server
```

## 🌐 Upgrade ke Online Mode

Untuk mengaktifkan AI features dan command execution:

### **1. Install Full Dependencies:**
```bash
npm install tsx --save-dev
npm install  # Install all dependencies
```

### **2. Setup API Keys:**
```bash
export GROQ_API_KEY="your_groq_key"
export OPENROUTER_API_KEY="your_openrouter_key"
export HUGGINGFACE_API_KEY="your_hf_key"
```

### **3. Start Full Server:**
```bash
npm run dev-ts    # Full TypeScript server with AI
```

## 🔧 Troubleshooting

### **Error: "Script build:dev tidak ditemukan"**
```bash
node scripts/fix-build.js
# atau
./termux-offline-setup.sh
```

### **Error: "tsx: not found"**
```bash
# Mode offline (recommended)
npm run dev

# Atau install tsx
npm install tsx --save-dev
npm run dev-ts
```

### **Error: "SyntaxError: Invalid or unexpected token"**
```bash
# Fixed by removing shebang from scripts
# Run offline setup to fix all scripts
./termux-offline-setup.sh
```

### **Server tidak responding**
```bash
# Check if port 5000 is free
lsof -i :5000
pkill -f "node server"

# Restart server
npm run dev
```

## 📱 Termux Specific Notes

### **Storage Permission:**
```bash
termux-setup-storage
```

### **Python Tools (Optional):**
```bash
pkg install python
pip install requests
```

### **Network Tools:**
```bash
pkg install nmap
pkg install curl wget
```

## 📊 Status Verification

### **Check System Health:**
```bash
./launcher.sh status
```

### **Verify Offline Mode:**
```bash
curl http://localhost:5000/api/status
# Expected: {"status":"offline","mode":"termux",...}
```

### **Test CLI Interface:**
```bash
echo "help" | node cli-interface.js
```

## 🎉 Result

✅ **CyberShellX sekarang berfungsi sempurna di Termux!**

- 📱 **Termux Compatible**: Mode offline stabil
- 🛡️ **Educational Tools**: Simulasi cybersecurity tools
- 💻 **CLI Interface**: Interface terminal yang lengkap
- 🌐 **Web Dashboard**: Monitoring basic via browser
- 🚀 **Upgrade Path**: Mudah upgrade ke online mode

**Ready to use dalam mode offline dengan full CLI capabilities!**
