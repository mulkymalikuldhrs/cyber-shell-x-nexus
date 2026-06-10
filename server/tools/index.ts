// ── Security Tool Integration ──────────────────────────────────────────────────
// Tool registry with safety levels, executor with safety controls, 15+ tools

import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

// ── Types ──────────────────────────────────────────────────────────────────────

export type ToolSafetyLevel = 'safe' | 'moderate' | 'dangerous';

export interface ToolDefinition {
  name: string;
  category: string;
  description: string;
  safetyLevel: ToolSafetyLevel;
  command: string;
  args: string;
  enabled: boolean;
  requiresAuth: boolean;
  estimatedTime: number; // seconds
}

export interface ToolExecutionResult {
  tool: string;
  success: boolean;
  output: string;
  duration: number;
  safetyLevel: ToolSafetyLevel;
  legalNotice: string;
}

// ── Tool Registry ──────────────────────────────────────────────────────────────

export const TOOL_REGISTRY: ToolDefinition[] = [
  // Network Scanning
  { name: 'nmap', category: 'network', description: 'Network exploration and security auditing', safetyLevel: 'moderate', command: 'nmap', args: '-sV -sC {target}', enabled: true, requiresAuth: true, estimatedTime: 120 },
  { name: 'masscan', category: 'network', description: 'Mass IP port scanner', safetyLevel: 'moderate', command: 'masscan', args: '{target} -p 1-65535 --rate=1000', enabled: true, requiresAuth: true, estimatedTime: 60 },
  { name: 'zmap', category: 'network', description: 'Fast single-packet network scanner', safetyLevel: 'moderate', command: 'zmap', args: '-p 80 {target}', enabled: false, requiresAuth: true, estimatedTime: 30 },
  
  // Web Scanning
  { name: 'nikto', category: 'web', description: 'Web server scanner', safetyLevel: 'moderate', command: 'nikto', args: '-h {target}', enabled: true, requiresAuth: true, estimatedTime: 180 },
  { name: 'nuclei', category: 'web', description: 'Vulnerability scanner based on templates', safetyLevel: 'moderate', command: 'nuclei', args: '-u {target}', enabled: true, requiresAuth: true, estimatedTime: 120 },
  { name: 'dirsearch', category: 'web', description: 'Web path scanner', safetyLevel: 'safe', command: 'dirsearch', args: '-u {target}', enabled: true, requiresAuth: false, estimatedTime: 60 },
  
  // Fuzzing & Brute Force
  { name: 'ffuf', category: 'fuzzing', description: 'Fast web fuzzer', safetyLevel: 'moderate', command: 'ffuf', args: '-u {target}/FUZZ -w {wordlist}', enabled: true, requiresAuth: false, estimatedTime: 90 },
  { name: 'gobuster', category: 'fuzzing', description: 'Directory/file/DNS brute forcing', safetyLevel: 'moderate', command: 'gobuster', args: 'dir -u {target} -w {wordlist}', enabled: true, requiresAuth: false, estimatedTime: 90 },
  { name: 'wfuzz', category: 'fuzzing', description: 'Web application fuzzer', safetyLevel: 'moderate', command: 'wfuzz', args: '-c -z file,{wordlist} {target}/FUZZ', enabled: false, requiresAuth: false, estimatedTime: 90 },
  
  // SQL Injection
  { name: 'sqlmap', category: 'exploitation', description: 'Automatic SQL injection tool', safetyLevel: 'dangerous', command: 'sqlmap', args: '-u "{target}" --batch --level=1', enabled: true, requiresAuth: true, estimatedTime: 300 },
  
  // Password Cracking
  { name: 'hydra', category: 'exploitation', description: 'Online password cracking tool', safetyLevel: 'dangerous', command: 'hydra', args: '-l {user} -P {wordlist} {target}', enabled: false, requiresAuth: true, estimatedTime: 600 },
  { name: 'hashcat', category: 'crypto', description: 'Advanced password recovery', safetyLevel: 'dangerous', command: 'hashcat', args: '-m {hash_type} {hash_file} {wordlist}', enabled: false, requiresAuth: true, estimatedTime: 600 },
  { name: 'john', category: 'crypto', description: 'Password cracker', safetyLevel: 'dangerous', command: 'john', args: '--wordlist={wordlist} {hash_file}', enabled: false, requiresAuth: true, estimatedTime: 300 },
  
  // DNS & Recon
  { name: 'subfinder', category: 'recon', description: 'Subdomain discovery tool', safetyLevel: 'safe', command: 'subfinder', args: '-d {target}', enabled: true, requiresAuth: false, estimatedTime: 30 },
  { name: 'dnsrecon', category: 'recon', description: 'DNS enumeration', safetyLevel: 'safe', command: 'dnsrecon', args: '-d {target}', enabled: true, requiresAuth: false, estimatedTime: 30 },
  { name: 'theHarvester', category: 'recon', description: 'Email and subdomain harvesting', safetyLevel: 'safe', command: 'theHarvester', args: '-d {target} -b all', enabled: true, requiresAuth: false, estimatedTime: 45 },
  
  // SSL/TLS
  { name: 'sslscan', category: 'crypto', description: 'SSL/TLS scanner', safetyLevel: 'safe', command: 'sslscan', args: '{target}', enabled: true, requiresAuth: false, estimatedTime: 15 },
  { name: 'sslyze', category: 'crypto', description: 'SSL/TLS server configuration analyzer', safetyLevel: 'safe', command: 'sslyze', args: '{target}', enabled: true, requiresAuth: false, estimatedTime: 20 },
  
  // Exploitation Framework
  { name: 'metasploit', category: 'exploitation', description: 'Penetration testing framework', safetyLevel: 'dangerous', command: 'msfconsole', args: '-q -x "use {module}; set RHOSTS {target}; run"', enabled: false, requiresAuth: true, estimatedTime: 300 },
];

// ── Tool Executor ──────────────────────────────────────────────────────────────

export class ToolExecutor {
  /**
   * Check if a tool is available on the system
   */
  async checkAvailability(toolName: string): Promise<boolean> {
    try {
      const { stdout } = await execAsync(`which ${toolName} 2>/dev/null || where ${toolName} 2>/dev/null`);
      return !!stdout.trim();
    } catch {
      return false;
    }
  }

  /**
   * Get available tools
   */
  async getAvailableTools(): Promise<Array<ToolDefinition & { installed: boolean }>> {
    const results: Array<ToolDefinition & { installed: boolean }> = [];
    for (const tool of TOOL_REGISTRY) {
      const installed = await this.checkAvailability(tool.command);
      results.push({ ...tool, installed });
    }
    return results;
  }

  /**
   * Validate command for safety
   */
  validateCommand(toolName: string, target: string): { valid: boolean; reason?: string } {
    const tool = TOOL_REGISTRY.find(t => t.name === toolName);
    if (!tool) {
      return { valid: false, reason: `Unknown tool: ${toolName}` };
    }
    if (!tool.enabled) {
      return { valid: false, reason: `Tool ${toolName} is currently disabled` };
    }

    // Sanitize target - prevent command injection
    const sanitized = target.replace(/[;&|`$(){}[\]<>]/g, '');
    if (sanitized !== target) {
      return { valid: false, reason: 'Target contains invalid characters' };
    }

    // Block internal/private IPs for dangerous tools
    if (tool.safetyLevel === 'dangerous') {
      const privateIpPattern = /^(10\.|172\.(1[6-9]|2[0-9]|3[01])\.|192\.168\.|127\.|0\.)/;
      if (privateIpPattern.test(target)) {
        return { valid: false, reason: 'Dangerous tools cannot target private/internal IPs' };
      }
    }

    return { valid: true };
  }

  /**
   * Execute a tool (SIMULATED for safety - never runs actual commands)
   */
  async execute(
    toolName: string,
    target: string,
    options: Record<string, string> = {}
  ): Promise<ToolExecutionResult> {
    const validation = this.validateCommand(toolName, target);
    if (!validation.valid) {
      return {
        tool: toolName,
        success: false,
        output: validation.reason || 'Validation failed',
        duration: 0,
        safetyLevel: 'safe',
        legalNotice: '⚠️ Tool execution is simulated for educational purposes only.',
      };
    }

    const tool = TOOL_REGISTRY.find(t => t.name === toolName)!;
    const startTime = Date.now();

    // SIMULATED execution - never actually run security tools
    const simulatedOutput = this.generateSimulatedOutput(tool, target, options);
    const duration = Date.now() - startTime;

    return {
      tool: toolName,
      success: true,
      output: simulatedOutput,
      duration,
      safetyLevel: tool.safetyLevel,
      legalNotice: '⚠️ This is a SIMULATED execution for educational purposes. No actual commands were run against any target.',
    };
  }

  /**
   * Generate simulated tool output
   */
  private generateSimulatedOutput(tool: ToolDefinition, target: string, _options: Record<string, string>): string {
    const outputs: Record<string, string> = {
      nmap: `Starting Nmap scan of ${target}...

Nmap scan report for ${target}
Host is up (0.045s latency).

PORT     STATE SERVICE    VERSION
22/tcp   open  ssh        OpenSSH 8.9p1
80/tcp   open  http       nginx 1.24.0
443/tcp  open  ssl/https  nginx 1.24.0
8080/tcp open  http-proxy Squid 5.7

Service detection performed.

⚠️ SIMULATED OUTPUT - Educational purposes only`,

      nuclei: `[ nuclei ] Running templates against ${target}

[CVE-2023-44487] [http2] [high] ${target}
[missing-security-headers] [http] [info] ${target}
[cors-misconfiguration] [http] [medium] ${target}

Scan completed: 3 findings

⚠️ SIMULATED OUTPUT - Educational purposes only`,

      nikto: `- Nikto v2.5.0
---------------------------------------------------------------------------
+ Target IP:          ${target}
+ Target Hostname:    ${target}
+ Target Port:        80
+ Start Time:         ${new Date().toISOString()}
---------------------------------------------------------------------------
+ Server: nginx/1.24.0
+ /: The X-Content-Type-Options header is not set.
+ /: The X-XSS-Protection header is not defined.
+ /admin/: Directory indexing found.
+ 7915 requests: 3 error(s) and 5 item(s) reported

⚠️ SIMULATED OUTPUT - Educational purposes only`,

      sqlmap: `[*] starting sqlmap...
[INFO] testing connection to the target URL
[INFO] testing if the target URL is stable
[INFO] testing for SQL injection on parameter 'id'
[WARNING] GET parameter 'id' appears to be injectable
[INFO] confirming SQL injection...
[INFO] GET parameter 'id' is vulnerable

⚠️ SIMULATED OUTPUT - Educational purposes only`,

      subfinder: `[*] Enumerating subdomains for ${target}

www.${target}
api.${target}
mail.${target}
dev.${target}
staging.${target}

Found 5 subdomains

⚠️ SIMULATED OUTPUT - Educational purposes only`,
    };

    return outputs[tool.name] || `[${tool.name}] Simulated scan of ${target} completed.\nNo vulnerabilities found in simulation.\n\n⚠️ SIMULATED OUTPUT - Educational purposes only`;
  }
}

export const toolExecutor = new ToolExecutor();
