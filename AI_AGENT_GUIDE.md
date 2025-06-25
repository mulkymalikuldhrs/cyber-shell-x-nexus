# 🤖 CyberShellX AI Agent - Complete Guide

Panduan lengkap untuk menggunakan sistem AI Agent yang telah diupgrade menjadi **Advanced Code Assistant** seperti Manus AI, Suna AI dengan kemampuan programming, command execution, tool integration, dan multi-provider API.

## 🚀 Fitur Baru

### 1. **Sistem Multi-Provider API**
- **Groq** (Gratis & Cepat): Llama 3.3, Llama 3.1, Mixtral
- **Hugging Face** (Gratis): Qwen 2.5 Coder, CodeLlama, Mixtral
- **OpenRouter** (Free Tier): Llama 3.1, Mistral
- **Together AI** (Free Credits): Llama 3.1, CodeLlama
- **DeepInfra** (Free Tier): Llama 3.1, Mixtral
- **Google Gemini**: Gemini 2.5 Flash
- **Local Models**: Ollama support

### 2. **AI Agent Programming Capabilities**
- Menulis aplikasi lengkap dalam berbagai bahasa
- Debug dan perbaikan kode otomatis
- Membuat struktur file dan folder
- Analisis keamanan kode
- Eksekusi command sistem yang aman

### 3. **Auto-Failover System**
- Otomatis beralih ke provider lain jika API down
- Rate limit management
- Health monitoring semua endpoints
- Load balancing cerdas

### 4. **Advanced Command Execution Engine** 🆕
- **Safe Execution**: Whitelist commands yang aman
- **Interactive Mode**: Konfirmasi untuk command berbahaya
- **Batch Processing**: Execute multiple commands
- **History Tracking**: Log semua eksekusi command
- **Working Directory**: Manage direktori kerja
- **Tool Integration**: Git, Docker, AWS, npm, pip, dll

### 5. **Smart Code Assistant Features** 🆕
- **Real-time Code Execution**: Jalankan dan test kode langsung
- **Project Setup Automation**: Buat project lengkap dengan struktur
- **Dependency Management**: Install dan manage packages otomatis
- **Multi-language Support**: 20+ bahasa programming
- **Framework Integration**: React, Vue, Express, Django, Laravel, dll
- **Build & Deploy**: Otomatis setup CI/CD dan deployment

### 6. **Natural Language Understanding** 🆕
- **Intent Recognition**: Pahami maksud user dari bahasa alami
- **Context Awareness**: Ingat konteks percakapan sebelumnya
- **Multi-step Planning**: Breakdown task kompleks jadi steps
- **Error Recovery**: Auto-fix jika ada error
- **Smart Suggestions**: Saran berdasarkan konteks project

## 📋 Setup dan Instalasi

### 1. **Konfigurasi API Keys**

Edit file `config/api-config.json` atau gunakan environment variables:

```bash
# API Keys Gratis
export GROQ_API_KEY="your_groq_key"
export HUGGINGFACE_API_KEY="your_hf_key" 
export OPENROUTER_API_KEY="your_openrouter_key"
export TOGETHER_API_KEY="your_together_key"
export DEEPINFRA_API_KEY="your_deepinfra_key"

# API Keys Berbayar (Opsional)
export GOOGLE_API_KEY="your_gemini_key"
```

### 2. **Mendapatkan API Keys Gratis**

#### Groq (Recommended - Paling Cepat)
1. Daftar di https://console.groq.com/
2. Buat API key gratis
3. Rate limit: 6000 tokens/minute

#### Hugging Face (Bagus untuk Coding)
1. Daftar di https://huggingface.co/
2. Buat token di Settings > Access Tokens
3. Pilih model coding seperti Qwen 2.5 Coder

#### OpenRouter (Banyak Model Gratis)
1. Daftar di https://openrouter.ai/
2. Dapatkan free credits
3. Akses ke banyak model gratis

#### Together AI (Free Credits)
1. Daftar di https://api.together.xyz/
2. Dapatkan $25 free credits
3. Model Llama dan CodeLlama tersedia

#### DeepInfra (Free Tier)
1. Daftar di https://deepinfra.com/
2. $5/month free usage
3. Model Llama dan Mixtral

### 3. **Menjalankan Server**

```bash
# Install dependencies
npm install

# Push database schema
npm run db:push

# Start development server
npm run dev

# Server akan berjalan di http://localhost:5000
```

## 💻 Penggunaan CLI Interface

### 1. **Menjalankan CLI**

```bash
# CLI interface dengan AI Agent
node cli-interface.js
```

### 2. **Command CLI Baru**

```bash
# Ganti mode AI
mode programming     # Mode programming assistant
mode cybersecurity   # Mode cybersecurity specialist  
mode general         # Mode general assistant

# Status sistem
status              # Tampilkan status semua API providers
capabilities        # Tampilkan kemampuan agent
tasks              # Tampilkan riwayat tugas
reload             # Reload konfigurasi API

# Contoh penggunaan programming
"Create a Python web scraper for news articles"
"Debug this JavaScript function: function test() { ... }"
"Write a complete REST API in Node.js with authentication"
"Analyze this code for security vulnerabilities"

# Contoh penggunaan cybersecurity
"Explain SQL injection attacks and prevention"
"How to secure a Linux server?"
"Analyze this network traffic for suspicious activity"
```

## 🌐 Web Interface

### 1. **Akses Web UI**
- Buka http://localhost:5000
- Klik tab "AI Agent"
- Pilih mode: General/Programming/Cybersecurity

### 2. **Fitur Web Interface**
- **Chat Interface**: Real-time chat dengan AI agent
- **Status Dashboard**: Monitor kesehatan semua API providers
- **Task History**: Lihat semua tugas yang dijalankan
- **API Management**: Tambah/edit API keys
- **Configuration**: Reload konfigurasi tanpa restart

## 🔧 API Endpoints

### 1. **AI Agent Endpoints**

```bash
# Proses request dengan AI agent
POST /api/agent/process
{
  "request": "Create a Python calculator",
  "mode": "programming"
}

# Status AI providers
GET /api/ai/status

# Capabilities agent
GET /api/agent/capabilities

# Riwayat tasks
GET /api/agent/tasks

# Reload konfigurasi
POST /api/ai/reload

# Tambah API key
POST /api/ai/keys
{
  "provider": "groq",
  "endpoint": "Primary Groq",
  "apiKey": "your_key"
}
```

### 2. **Direct AI Generation**

```bash
# Generate konten langsung
POST /api/ai/generate
{
  "prompt": "Explain quantum computing",
  "mode": "general"
}
```

## 🎯 Mode-Mode AI Agent

### 1. **Programming Mode**
```javascript
// Contoh penggunaan
"Create a complete web app with React and Node.js"
"Debug this Python code and fix the errors"
"Write unit tests for this JavaScript function"
"Optimize this SQL query for better performance"
"Create a mobile app UI in React Native"
```

**Capabilities:**
- Menulis kode lengkap dalam 20+ bahasa
- Debug dan optimisasi kode
- Code review dan security analysis
- Membuat dokumentasi kode
- Setup project structure

### 2. **Cybersecurity Mode**
```bash
# Contoh penggunaan
"Analyze this network for vulnerabilities"
"How to implement OAuth 2.0 securely?"
"Create a penetration testing checklist"
"Explain buffer overflow attacks"
"Security audit for a web application"
```

**Capabilities:**
- Vulnerability assessment
- Security analysis dan recommendations
- Penetration testing guidance
- Security best practices
- Compliance dan audit

### 3. **General Mode**
```bash
# Contoh penggunaan
"Explain machine learning concepts"
"Create a business plan for a startup"
"Help me with data analysis in Python"
"Write technical documentation"
"Project management best practices"
```

**Capabilities:**
- General knowledge dan explanation
- Analysis dan problem-solving
- Writing dan documentation
- Research assistance
- Business dan strategy advice

## 🔒 Keamanan dan Best Practices

### 1. **API Key Security**
- Jangan commit API keys ke git
- Gunakan environment variables
- Rotate keys secara berkala
- Monitor usage dan costs

### 2. **Rate Limiting**
- Sistem otomatis track rate limits
- Auto-switch jika limit tercapai
- Buffer 80% untuk safety

### 3. **Error Handling**
- Retry otomatis dengan exponential backoff
- Fallback ke provider lain
- Comprehensive error logging

## 📊 Monitoring dan Debugging

### 1. **Health Monitoring**
```bash
# Cek status semua providers
curl http://localhost:5000/api/ai/status

# Response example:
{
  "total_providers": 6,
  "total_endpoints": 15,
  "healthy_endpoints": 12,
  "free_apis_available": 8,
  "health_summary": [...]
}
```

### 2. **Task Monitoring**
```bash
# Lihat semua tasks
curl http://localhost:5000/api/agent/tasks

# Lihat task spesifik
curl http://localhost:5000/api/agent/tasks/{task_id}
```

### 3. **Logging**
- Server logs di console
- API usage tracking
- Error reporting
- Performance metrics

## 🚀 Advanced Usage

### 1. **Custom Providers**
Edit `config/api-config.json` untuk menambah provider baru:

```json
{
  "providers": {
    "custom_provider": {
      "name": "Custom Provider",
      "type": "openai",
      "enabled": true,
      "priority": 7,
      "base_url": "https://api.custom.com/v1",
      "endpoints": [
        {
          "name": "Custom Endpoint",
          "api_key": "${CUSTOM_API_KEY}",
          "model": "custom-model",
          "max_tokens": 4096,
          "rate_limit": 30
        }
      ]
    }
  }
}
```

### 2. **Local Models dengan Ollama**
```bash
# Install Ollama
curl -fsSL https://ollama.ai/install.sh | sh

# Download model
ollama pull llama3.1:8b
ollama pull codellama:7b

# Enable di config
# Set "local" provider enabled: true
```

### 3. **Batch Processing**
```javascript
// Proses multiple requests
const requests = [
  "Create a Python script for file backup",
  "Write unit tests for the backup script", 
  "Create documentation for the script"
];

for (const request of requests) {
  const response = await fetch('/api/agent/process', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ request, mode: 'programming' })
  });
}
```

## 🎨 Customization

### 1. **System Prompts**
Edit `config/api-config.json` bagian `agent_modes` untuk customize behavior:

```json
{
  "agent_modes": {
    "programming": {
      "description": "Expert programming assistant",
      "preferred_models": ["coding"],
      "system_prompt": "You are an expert programmer..."
    }
  }
}
```

### 2. **Model Preferences**
- Set `prefer_free_apis: true` untuk prioritas API gratis
- Set `prefer_coding_models: true` untuk prioritas model coding
- Adjust `priority` di setiap provider

## 🔧 Troubleshooting

### 1. **API Issues**
```bash
# Cek koneksi
curl http://localhost:5000/api/ai/status

# Reload konfigurasi
curl -X POST http://localhost:5000/api/ai/reload

# Tambah API key baru
curl -X POST http://localhost:5000/api/ai/keys \
  -H "Content-Type: application/json" \
  -d '{"provider":"groq","endpoint":"New Endpoint","apiKey":"your_key"}'
```

### 2. **Common Problems**

**Error: "No available API endpoints"**
- Pastikan ada API key yang valid
- Cek network connection
- Reload konfigurasi

**Error: "Rate limit exceeded"**
- System akan auto-switch ke provider lain
- Tunggu beberapa menit atau tambah API key

**Error: "Server not running"**
- Pastikan server berjalan di port 5000
- Cek console untuk error messages

### 3. **Performance Issues**
- Gunakan Groq untuk response tercepat
- Set timeout sesuai kebutuhan
- Monitor response times di status dashboard

## 📞 Support dan Resources

### 1. **Free API Resources**
- [Groq Console](https://console.groq.com/)
- [Hugging Face](https://huggingface.co/)
- [OpenRouter](https://openrouter.ai/)
- [Together AI](https://api.together.xyz/)
- [DeepInfra](https://deepinfra.com/)

### 2. **Documentation**
- API endpoints: `/api` untuk semua available endpoints
- Status monitoring: `/api/ai/status`
- Health checks: `/api/agent/capabilities`

### 3. **Community**
- GitHub Issues untuk bug reports
- Feature requests welcome
- Contributions appreciated

---

## 🎉 Selamat Menggunakan!

Sekarang Anda memiliki AI agent programming yang powerful dengan:
- ✅ Multiple free API providers
- ✅ Auto-failover system
- ✅ Programming capabilities
- ✅ Web dan CLI interface
- ✅ Real-time monitoring
- ✅ Security best practices

**Tip**: Mulai dengan mode `programming` dan coba prompt: *"Create a complete web application with user authentication"*
