# 🔄 CyberShellX Termux Update Guide

Panduan lengkap untuk menangani masalah setelah update dari GitHub di Termux.

## 🚨 Masalah Umum Setelah Update

### **Error 1: Script build:dev tidak ditemukan**
```
Script build:dev tidak ditemukan. Memperbaiki...
SyntaxError: Invalid or unexpected token at #!/usr/bin/env node
```

### **Error 2: Native binding compilation fails**
```
gyp ERR! configure error
gyp ERR! stack Error: `gyp` failed with exit code: 1
Error: Failed to load native binding (@swc/core, bufferutil)
```

### **Error 3: Vite build failure**
```
failed to load config from vite.config.ts
Error: Failed to load native binding
```

## ✅ Solusi Cepat (One-Command Fix)

```bash
# Setelah git pull, jalankan fix otomatis:
./termux-update-fix.sh
```

**Atau jika file tidak ada:**
```bash
curl -o termux-update-fix.sh https://raw.githubusercontent.com/mulkymalikuldhrs/cyber-shell-x-nexus/main/termux-update-fix.sh
chmod +x termux-update-fix.sh
./termux-update-fix.sh
```

## 🔧 Manual Fix Steps

### **1. Fix Package.json untuk Offline Mode**
```bash
# Backup current package.json
cp package.json package.json.backup

# Create minimal package.json
cat > package.json << 'EOF'
{
  "name": "cybershellx-nexus",
  "version": "1.0.0", 
  "type": "module",
  "scripts": {
    "dev": "node server/index.js",
    "offline": "node cli-interface.js",
    "cli": "node cli-interface.js",
    "build": "echo 'Build not needed for offline mode'",
    "build:dev": "echo 'Build not needed for offline mode'"
  },
  "dependencies": {
    "express": "^4.21.2",
    "ws": "^8.18.0",
    "node-fetch": "^3.3.2"
  }
}
EOF
```

### **2. Fix Scripts Compatibility**
```bash
# Remove problematic scripts
rm -f scripts/fix-build.js.backup

# Fix the fix-build.js script (remove shebang, fix imports)
# This is automatically done by termux-update-fix.sh
```

### **3. Install Minimal Dependencies**
```bash
# Remove node_modules and reinstall minimal deps
rm -rf node_modules package-lock.json
npm install express ws node-fetch --save --no-optional
```

### **4. Create Offline Server**
```bash
# Ensure offline server exists
mkdir -p server
# The server/index.js will be created by termux-update-fix.sh
```

## 🚀 Workflow Setelah Update

### **Recommended Update Process:**
```bash
# 1. Update from GitHub
git pull origin main

# 2. Fix Termux compatibility issues  
./termux-update-fix.sh

# 3. Test CLI interface
node cli-interface.js

# 4. Test web server (optional)
npm run dev
```

### **Alternative: Clean Install**
```bash
# If issues persist, clean reinstall:
cd ~
rm -rf cyber-shell-x-nexus
git clone https://github.com/mulkymalikuldhrs/cyber-shell-x-nexus.git
cd cyber-shell-x-nexus
./termux-offline-setup.sh
```

## 🎯 Verification Commands

### **Check if everything works:**
```bash
# 1. Test CLI
echo "help" | node cli-interface.js

# 2. Test package.json scripts
npm run cli --version 2>/dev/null && echo "✅ CLI script OK" || echo "❌ CLI script failed"

# 3. Test web server
npm run dev &
sleep 2
curl http://localhost:5000/api/status
pkill -f "node server"

# 4. Check dependencies
npm list --depth=0
```

## 💡 Prevention Tips

### **1. Always Use Update Fix After Git Pull**
```bash
# Add to your update routine:
git pull && ./termux-update-fix.sh
```

### **2. Use Offline Mode by Default**
```bash
# Termux works best with offline mode
node cli-interface.js    # Instead of npm run dev-ts
npm run dev             # Instead of full TypeScript server
```

### **3. Avoid Complex Dependencies**
```bash
# Don't install these in Termux:
# npm install tsx @swc/core vite
# Use the minimal package.json instead
```

## 📋 Troubleshooting Specific Errors

### **Error: "Cannot find module '@swc/core-android-arm64'"**
```bash
# Solution: Switch to offline mode (no @swc/core needed)
./termux-update-fix.sh
```

### **Error: "gyp ERR! configure error"**
```bash
# Solution: Remove native binding dependencies
npm uninstall bufferutil utf-8-validate @swc/core
npm install express ws node-fetch --save
```

### **Error: "Script build:dev tidak ditemukan"**
```bash
# Solution: Fix package.json scripts
node scripts/fix-build.js
# Or run the update fix
./termux-update-fix.sh
```

### **Error: "SyntaxError: Invalid or unexpected token"**
```bash
# Solution: Fix shebang in scripts
./termux-update-fix.sh
# This removes #!/usr/bin/env node and fixes imports
```

## 🌟 Best Practices

### **1. Termux-Optimized Workflow**
```bash
# Recommended daily usage:
cd ~/cyber-shell-x-nexus
node cli-interface.js      # Primary interface
npm run dev               # Optional web interface
```

### **2. Update Workflow**
```bash
# Safe update process:
git stash                 # Save local changes
git pull origin main      # Get updates  
./termux-update-fix.sh    # Fix compatibility
git stash pop             # Restore local changes (if any)
```

### **3. Backup Important Configs**
```bash
# Before major updates:
cp package.json package.json.my-backup
cp config/api-config.json config/api-config.json.backup
```

## 📞 Support

### **If Issues Persist:**
1. Check `TERMUX_FIX.md` for detailed solutions
2. Run health check: `./launcher.sh status`
3. Use clean install approach
4. Report issues with full error logs

### **Working Commands (Always Available):**
```bash
node cli-interface.js        ✅ CLI interface
npm run offline             ✅ Same as CLI  
npm run dev                 ✅ Web server (offline)
./launcher.sh cli           ✅ CLI via launcher
./launcher.sh status        ✅ Health check
```

---

## 🎉 Success Indicators

After running the fix, you should see:
- ✅ CLI starts without errors
- ✅ All cybersecurity tools available
- ✅ Mode switching works (programming/cybersecurity/general)
- ✅ Web server runs on port 5000
- ✅ No native binding compilation errors

**CyberShellX should work perfectly in Termux offline mode! 🛡️**
