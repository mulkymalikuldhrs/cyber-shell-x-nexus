# Security Policy

## Reporting a Vulnerability

If you discover a security vulnerability within this project, please send an email to **mulkymalikuldhaher@email.com**. All security vulnerabilities will be promptly addressed.

Please do not publicly disclose the vulnerability until it has been addressed by the maintainers.

## Security Measures

- All dependencies are regularly audited for known vulnerabilities
- Sensitive data is never logged or stored in plain text
- API keys and credentials must never be committed to version control
- All inputs are validated and sanitized before processing
- Passwords are hashed using scrypt with salt before storage
- Timing-safe comparison is used for password verification to prevent timing attacks
- HTTP security headers are set on all responses (X-Content-Type-Options, X-Frame-Options, etc.)
- Rate limiting is applied to all API endpoints (60 requests/minute per IP)
- Command input length is strictly limited (max 2000 characters)
- WebSocket command execution is restricted to educational simulations only
- Android shell command execution uses a strict allowlist to prevent command injection

## Android Security

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

## Environment Variables

- Copy `.env.example` to `.env` and fill in your actual values
- Never share or commit your `.env` file
- Rotate API keys periodically
- Use the minimum required permissions for database users

---

> ⚠️ **For Education Purpose Only**
>
> This project is provided strictly for educational and research purposes. The authors and contributors assume **no responsibility or liability** for any damages, losses, or risks arising from the use of this software. **We do not bear any responsibility or risk** for how this software is used.
>
> **Contact:** Mulky Malikul Dhaher | mulkymalikuldhaher@email.com
