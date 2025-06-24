
# 🚀 CyberShellX - Autonomous Command Line AI Assistant

Created by **Mulky Maliku Dhaher**

CyberShellX adalah AI Assistant canggih yang berjalan di terminal dengan kemampuan multi-model AI, auto-installation tools, dan autonomous learning.

## ✨ Features

- 🧠 **Multi-Model AI Router**: OpenAI GPT-4, OpenRouter, Puter, DeepInfra, LLaMA
- ⚡ **Auto Tool Installation**: Deteksi dan install tools cybersecurity otomatis  
- 🔒 **Security Operations**: Pentest, OSINT, Smart Contract Audit
- 🎯 **Self-Learning**: Belajar dari interaksi dan kesalahan
- 🌐 **Universal Platform**: Linux, Windows, macOS, Termux
- 💬 **Natural Language**: Chat natural dengan AI
- 🔧 **Command Execution**: Execute dan monitoring system commands
- 📊 **Session Tracking**: Log aktivitas dan statistik

## 🔧 Installation

### Quick Install

```bash
# Download files
wget https://raw.githubusercontent.com/your-repo/cybershellx.py
wget https://raw.githubusercontent.com/your-repo/install_cybershellx.py

# Run installer
python3 install_cybershellx.py

# Start CyberShellX
python3 cybershellx.py
```

### Manual Install

```bash
# Install requirements
pip install colorama requests pexpect

# Run CyberShellX
python3 cybershellx.py
```

## 🚀 Usage

### Basic Commands

```bash
# Help
help

# Chat with AI
chat bagaimana cara install metasploit?

# Install tools
install nmap
install sqlmap

# Security testing
pentest target.com
osint example.com

# Execute commands
exec ls -la
exec nmap -sV target.com

# System info
stats
scan tools
```

### Advanced Usage

```bash
# Smart contract audit
audit contract.sol

# File analysis
analyze suspicious_file.exe

# Command explanation
explain "nmap -sS -O target.com"

# Natural language
"install semua tools untuk web pentesting"
"cari vulnerability di target.com"
"buatkan script untuk brute force"
```

## 🔑 API Configuration

File `cybershellx.py` sudah dikonfigurasi dengan API keys:

- **OpenAI**: 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
- **OpenRouter**: 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
- **Fallback**: Puter, DeepInfra, LLaMA (gratis)

## 📁 File Structure

```
~/.cybershellx/
├── config.json         # Konfigurasi sistem
├── logs/               # Session logs
├── data/               # Reports dan data
├── tools/              # Installed tools
└── memory/             # AI memory dan context
```

## 🎯 Examples

### Penetration Testing
```bash
cybershellx> pentest example.com
🔍 Starting web pentest on example.com
🤖 Querying AI providers...
✅ Response received from OPENAI

🔧 Pentest Plan:
1. Reconnaissance
   - nmap -sS -sV -O example.com
   - whatweb example.com
   
2. Vulnerability Scanning
   - nikto -h example.com
   - dirb http://example.com
   
3. Exploitation
   [detailed plan...]
```

### Tool Installation
```bash
cybershellx> install metasploit
🔧 Installing metasploit...
🤖 Querying AI providers...
✅ Response received from OPENROUTER
🔍 Executing: curl https://raw.githubusercontent.com/rapid7/metasploit-omnibus/master/config/templates/metasploit-framework-wrappers/msfupdate.erb | sudo bash
✅ metasploit installed and verified successfully
```

### AI Chat
```bash
cybershellx> chat bagaimana cara exploit SQL injection?
🤖 CyberShellX AI:

SQL Injection adalah vulnerability yang terjadi ketika input user tidak divalidasi...

[detailed explanation dengan examples dan countermeasures]

🔧 Found commands in response. Execute them?
1. sqlmap -u "http://target.com/page.php?id=1" --dbs
2. sqlmap -u "http://target.com/page.php?id=1" -D database --tables

Execute which command? (1-2, 'all', or 'none'):
```

## 🛡️ Safety Features

- **Safe Mode**: Konfirmasi untuk command berbahaya
- **Command Filtering**: Deteksi pattern berbahaya
- **Timeout Protection**: Limit execution time
- **Logging**: Track semua aktivitas
- **Sandboxing**: Isolasi tool execution

## 🔧 Troubleshooting

### Common Issues

1. **Permission Denied**
   ```bash
   chmod +x cybershellx.py
   ```

2. **Module Not Found**
   ```bash
   pip3 install colorama requests pexpect
   ```

3. **API Timeout**
   ```bash
   # AI akan auto-fallback ke provider lain
   ```

4. **Tool Installation Failed**
   ```bash
   # Coba manual atau chat dengan AI untuk solusi
   chat gagal install nmap, bagaimana solusinya?
   ```

## 📝 Advanced Configuration

Edit `~/.cybershellx/config.json`:

```json
{
    "version": "2.1.0",
    "auto_install": true,
    "safety_mode": true,
    "preferences": {
        "verbosity": "normal",
        "auto_update": true,
        "learning_mode": true
    }
}
```

## 🌟 Tips & Tricks

1. **Natural Language**: Gunakan bahasa natural
   ```bash
   "install semua tools untuk penetration testing"
   "bagaimana cara hack wifi WPA2?"
   ```

2. **Command Chaining**: AI bisa suggest command sequences
   ```bash
   chat "reconnaissance lengkap untuk target.com"
   ```

3. **Learning Mode**: AI belajar dari pattern usage Anda

4. **Session Persistence**: History tersimpan di logs

## 🤝 Contributing

1. Fork repository
2. Create feature branch
3. Test thoroughly  
4. Submit pull request

## 📞 Support

- **GitHub Issues**: Report bugs dan feature requests
- **Discord**: Community support  
- **Email**: support@cybershellx.ai

## 📄 License

MIT License - See LICENSE file

## 🙏 Credits

- **Creator**: Mulky Maliku Dhaher
- **AI Models**: OpenAI, Anthropic, Meta, etc.
- **Tools**: Cybersecurity community
- **Inspiration**: Kali Linux, Metasploit, OWASP

---

**⚠️ Disclaimer**: CyberShellX adalah tool untuk educational dan authorized testing only. User bertanggung jawab atas penggunaan tool ini.

**🚀 Happy Hacking!**
