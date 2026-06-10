# Security Policy

## Reporting a Vulnerability

If you discover a security vulnerability within this project, please send an email to **mulkymalikudhr@mail.com**. All security vulnerabilities will be promptly addressed.

Please do not publicly disclose the vulnerability until it has been addressed by the maintainers.

## Security Measures

### Platform Security
- All dependencies are regularly audited for known vulnerabilities
- Sensitive data is never logged or stored in plain text
- API keys and credentials must never be committed to version control
- All inputs are validated and sanitized before processing via 5-layer safety pipeline
- Passwords are hashed using bcrypt with salt before storage
- JWT tokens are used for authentication with configurable expiration
- HTTP security headers are set on all responses (X-Content-Type-Options, X-Frame-Options, etc.)
- Rate limiting is applied to all API endpoints (60 requests/minute per IP)
- Command input length is strictly limited (max 2000 characters)
- WebSocket command execution is restricted to educational simulations only
- Android shell command execution uses a strict allowlist to prevent command injection

### 5-Layer Safety Pipeline (v3.0)
All security-related requests pass through 5 safety layers:
1. **Guardrails**: Safety level enforcement
2. **Validation**: Input/output validation, API key redaction, IP masking
3. **Fact-check**: CVE database cross-referencing
4. **Consistency**: Factual consistency verification
5. **Correction**: Auto-correction with retry prompt generation

### Scope Validation
The safety pipeline blocks requests targeting:
- Private IP ranges (10.x.x.x, 172.16-31.x.x, 192.168.x.x, 127.x.x.x)
- Government domains (.gov, .mil)
- Known critical infrastructure patterns

### Android Security
- The `executeShellCommand` method uses a strict allowlist of permitted commands
- Direct arbitrary command execution is not allowed
- The `executePing` method validates IP address format before execution
- Shell commands are executed in array form to prevent shell injection

## Best Practices

- Always use the latest stable version
- Keep your API keys and credentials secure
- Use the `.env.example` template to configure your environment
- Never commit `.env` files or API keys to version control
- Report any suspicious behavior immediately
- Follow responsible disclosure guidelines
- Configure at least one LLM provider for AI features
- Set a strong JWT_SECRET in production

## Environment Variables

- Copy `.env.example` to `.env` and fill in your actual values
- Never share or commit your `.env` file
- Rotate API keys periodically
- Use the minimum required permissions for database users
- Set JWT_SECRET to a strong random string (at least 32 characters)

## Responsible Use

This platform is designed **exclusively** for:
- Learning cybersecurity concepts and methodologies
- Understanding how security tools work
- Practicing authorized penetration testing techniques
- Educational demonstrations in classroom settings

**This platform does NOT:**
- Execute real attacks against any targets
- Perform actual network scanning of live systems
- Crack passwords or bypass authentication
- Generate working exploits for real vulnerabilities

All tool executions are **simulated** for educational purposes only.

---

## Disclaimer

**For Education Purpose Only**

This project is provided strictly for educational and research purposes. The authors and contributors assume **no responsibility or liability** for any damages, losses, or risks arising from the use of this software. **We do not bear any responsibility or risk** for how this software is used.

**Contact:** Mulky Malikul Dhaher | mulkymalikudhr@mail.com

---

### Disclaimer (Bahasa Indonesia)

**Hanya untuk Tujuan Pendidikan**

Proyek ini disediakan secara ketat untuk tujuan pendidikan dan penelitian. Penulis dan kontributor tidak menanggung **tanggung jawab atau risiko** atas kerusakan, kerugian, atau risiko yang timbul dari penggunaan perangkat lunak ini. **Kami tidak menanggung tanggung jawab atau risiko** atas bagaimana perangkat lunak ini digunakan.

---

### 免责声明 (中文)

**仅供教育目的**

本项目严格仅供教育和研究目的。作者和贡献者对因使用本软件而产生的任何损害、损失或风险**不承担任何责任**。**我们不承担任何责任或风险**对于本软件的使用方式。
