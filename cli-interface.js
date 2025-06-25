#!/usr/bin/env node

import readline from 'readline';
import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ANSI color codes for cyberpunk styling
const colors = {
  cyan: '\x1b[36m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  magenta: '\x1b[35m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m'
};

// Load cybersecurity commands database
let commandsDB = {};
try {
  const commandsPath = path.join(process.cwd(), 'cybershell-commands', 'commands.json');
  const commandsData = fs.readFileSync(commandsPath, 'utf8');
  commandsDB = JSON.parse(commandsData);
} catch (error) {
  console.log(`${colors.yellow}Warning: Could not load commands database${colors.reset}`);
}

// Enhanced command processing with AI integration
async function processCommandWithAI(command) {
  try {
    const response = await fetch('http://localhost:5000/api/command', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ command })
    });
    
    if (response.ok) {
      const data = await response.json();
      return data.response || executeCommand(command);
    } else {
      return executeCommand(command);
    }
  } catch (error) {
    console.log(`${colors.dim}Note: AI enhancement unavailable, using local simulation${colors.reset}`);
    return executeCommand(command);
  }
}

function showBanner() {
  console.clear();
  console.log(`${colors.cyan}╔══════════════════════════════════════════════════════════════╗${colors.reset}`);
  console.log(`${colors.cyan}║                    ${colors.bright}CyberShellX Nexus CLI${colors.reset}${colors.cyan}                     ║${colors.reset}`);
  console.log(`${colors.cyan}║               ${colors.magenta}Advanced Cybersecurity Terminal${colors.reset}${colors.cyan}               ║${colors.reset}`);
  console.log(`${colors.cyan}╚══════════════════════════════════════════════════════════════╝${colors.reset}`);
  console.log(`${colors.dim}   Enhanced with AI integration • Type 'help' for commands${colors.reset}`);
  console.log(``);
}

function showHelp() {
  console.log(`${colors.cyan}═══ CyberShellX CLI Help ═══${colors.reset}`);
  console.log(``);
  console.log(`${colors.bright}System Commands:${colors.reset}`);
  console.log(`${colors.yellow}help${colors.reset}        - Show this help menu`);
  console.log(`${colors.yellow}status${colors.reset}      - Show system status and AI connection`);
  console.log(`${colors.yellow}clear${colors.reset}       - Clear the terminal`);
  console.log(`${colors.yellow}exit/quit${colors.reset}   - Exit CyberShellX`);
  console.log(``);
  console.log(`${colors.bright}Network Scanning:${colors.reset}`);
  console.log(`${colors.green}nmap -sV <target>${colors.reset}    - Version detection scan`);
  console.log(`${colors.green}nmap -sS <target>${colors.reset}    - SYN stealth scan`);
  console.log(`${colors.green}masscan <target>${colors.reset}     - High-speed port scanner`);
  console.log(``);
  console.log(`${colors.bright}Vulnerability Assessment:${colors.reset}`);
  console.log(`${colors.green}nikto -h <target>${colors.reset}    - Web vulnerability scanner`);
  console.log(`${colors.green}dirb <target>${colors.reset}        - Directory brute force`);
  console.log(`${colors.green}sqlmap -u <url>${colors.reset}      - SQL injection testing`);
  console.log(``);
  console.log(`${colors.bright}Network Analysis:${colors.reset}`);
  console.log(`${colors.green}wireshark${colors.reset}            - Network protocol analyzer`);
  console.log(`${colors.green}tcpdump -i eth0${colors.reset}      - Packet capture`);
  console.log(`${colors.green}netstat -an${colors.reset}          - Network connections`);
  console.log(``);
  console.log(`${colors.bright}Exploitation:${colors.reset}`);
  console.log(`${colors.green}msfconsole${colors.reset}           - Metasploit framework`);
  console.log(`${colors.green}searchsploit <term>${colors.reset}  - Exploit database search`);
  console.log(`${colors.green}hydra -l <user>${colors.reset}      - Password brute force`);
  console.log(``);
  console.log(`${colors.red}⚠️  Educational purposes only! Always obtain proper authorization.${colors.reset}`);
  console.log(``);
}

async function showSystemStatus() {
  console.log(`${colors.cyan}═══ CyberShellX System Status ═══${colors.reset}`);
  
  try {
    const response = await fetch('http://localhost:5000/api/ai/status');
    if (response.ok) {
      const status = await response.json();
      console.log(`${colors.green}✓ Server Connection: Active${colors.reset}`);
      console.log(`${colors.green}✓ AI APIs Available: ${status.available.length}${colors.reset}`);
      console.log(`${colors.green}✓ Current API: ${status.current}${colors.reset}`);
    }
  } catch (error) {
    console.log(`${colors.red}✗ Server Connection: Offline${colors.reset}`);
    console.log(`${colors.yellow}  Running in local simulation mode${colors.reset}`);
  }
  
  console.log(`${colors.green}✓ Commands Database: Loaded${colors.reset}`);
  console.log(`${colors.green}✓ Security Tools: Available${colors.reset}`);
}

function executeCommand(cmd) {
  const command = cmd.toLowerCase().trim();
  
  // Network scanning commands
  if (command.includes('nmap')) {
    if (command.includes('-sV')) {
      return `${colors.green}Starting Nmap 7.94 ( https://nmap.org )
Nmap scan report for target.com (192.168.1.100)
Host is up (0.023s latency).
PORT     STATE SERVICE    VERSION
22/tcp   open  ssh        OpenSSH 8.9p1 Ubuntu 3ubuntu0.1 (Ubuntu Linux; protocol 2.0)
80/tcp   open  http       Apache httpd 2.4.52 ((Ubuntu))
443/tcp  open  ssl/http   Apache httpd 2.4.52 ((Ubuntu))
3306/tcp open  mysql      MySQL 8.0.32-0ubuntu0.22.04.2${colors.reset}`;
    } else if (command.includes('-sS')) {
      return `${colors.green}Starting Nmap 7.94 ( https://nmap.org )
Nmap scan report for target.com (192.168.1.100)
Host is up (0.012s latency).
Not shown: 996 closed ports
PORT     STATE SERVICE
22/tcp   open  ssh
80/tcp   open  http
443/tcp  open  https
3306/tcp open  mysql${colors.reset}`;
    }
    return `${colors.green}Nmap scan initiated. Use -sV for version detection or -sS for stealth scan.${colors.reset}`;
  }
  
  // Vulnerability scanning
  if (command.includes('nikto')) {
    return `${colors.green}- Nikto v2.5.0
---------------------------------------------------------------------------
+ Target IP:          192.168.1.100
+ Target Hostname:    target.com
+ Target Port:        80
+ Start Time:         2024-12-26 22:00:00 (GMT+7)
---------------------------------------------------------------------------
+ Server: Apache/2.4.52 (Ubuntu)
+ /: The anti-clickjacking X-Frame-Options header is not present.
+ /: The X-Content-Type-Options header is not set.
+ /admin/: Admin login page/section found.
+ /config.php: PHP configuration file may contain database credentials.${colors.reset}`;
  }
  
  if (command.includes('sqlmap')) {
    return `${colors.green}        ___
       __H__
 ___ ___[)]_____ ___ ___  {1.7.12#stable}
|_ -| . [']     | .'| . |
|___|_  [.]_|_|_|__,|  _|
      |_|V...       |_|   https://sqlmap.org

[*] starting @ 22:00:00 /2024-12-26/
[22:00:01] [INFO] testing connection to the target URL
[22:00:02] [INFO] checking if the target is protected by some kind of WAF/IPS
[22:00:03] [INFO] testing if the parameter 'id' is dynamic
[22:00:04] [INFO] heuristic (basic) test shows that GET parameter 'id' might be injectable${colors.reset}`;
  }
  
  // Network analysis
  if (command.includes('wireshark')) {
    return `${colors.green}Wireshark GUI launched...
Capturing on interface: eth0
Frame 1: 74 bytes on wire (592 bits), 74 bytes captured (592 bits)
Ethernet II, Src: 00:1b:44:11:3a:b7, Dst: 00:50:56:c0:00:01
Internet Protocol Version 4, Src: 192.168.1.100, Dst: 8.8.8.8
Transmission Control Protocol, Src Port: 45632, Dst Port: 80${colors.reset}`;
  }
  
  if (command.includes('tcpdump')) {
    return `${colors.green}tcpdump: verbose output suppressed, use -v or -vv for full protocol decode
listening on eth0, link-type EN10MB (Ethernet), capture size 262144 bytes
22:00:01.123456 IP 192.168.1.100.45632 > 8.8.8.8.80: Flags [S], seq 123456789
22:00:01.145678 IP 8.8.8.8.80 > 192.168.1.100.45632: Flags [S.], seq 987654321
22:00:01.145890 IP 192.168.1.100.45632 > 8.8.8.8.80: Flags [.], ack 987654322${colors.reset}`;
  }
  
  // Exploitation tools
  if (command.includes('msfconsole')) {
    return `${colors.red}                                                  
 _                                                    _
/  \                                                  | |
|     ___   ____ ___ ____   __  ___  __  ____   _  ___| |_
| |  / _ \ /    _| _ | _  \/  \| __/|  \|    \ ||| |___|  |
| |_|  __/| (|  |  _|  __/ | | | | | | | (_) |_|_|  __|_
\___/\____|_   _|_|  \___  _|_|_|___|___|_/\___/    _\___)

Metasploit v6.3.55-dev                          
      
msf6 > search ms17-010
msf6 > use exploit/windows/smb/ms17_010_eternalblue
msf6 exploit(windows/smb/ms17_010_eternalblue) > show options${colors.reset}`;
  }
  
  if (command.includes('hydra')) {
    return `${colors.green}Hydra v9.4 (c) 2022 by van Hauser/THC & David Maciejak - Please do not use in military or secret service organizations, or for illegal purposes.

Hydra (https://github.com/vanhauser-thc/thc-hydra) starting at 2024-12-26 22:00:00
[DATA] max 16 tasks per 1 server, overall 16 tasks, 100 login tries (l:1/p:100)
[DATA] attacking ssh://192.168.1.100:22/
[22/tcp][ssh] host: 192.168.1.100   login: admin   password: admin123
1 of 1 target successfully completed, 1 valid password found${colors.reset}`;
  }
  
  // Default response
  return `${colors.yellow}Command simulation: ${cmd}
${colors.dim}This is a cybersecurity training environment.
For real penetration testing, use actual tools with proper authorization.
Type 'help' for available commands.${colors.reset}`;
}

async function startCLI() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: `${colors.cyan}cyber@shell${colors.reset}:${colors.blue}~${colors.reset}$ `
  });

  showBanner();
  
  // Check server connection
  try {
    const response = await fetch('http://localhost:5000/api/ai/status');
    if (response.ok) {
      const status = await response.json();
      console.log(`${colors.green}✓ AI Enhancement Active${colors.reset} (${status.available.length} APIs available)`);
    }
  } catch (error) {
    console.log(`${colors.yellow}⚠ Running in offline mode${colors.reset}`);
  }
  
  console.log('');
  rl.prompt();

  rl.on('line', async (input) => {
    const command = input.trim();
    
    if (command === 'exit' || command === 'quit') {
      console.log(`${colors.green}Goodbye! Stay secure! 🛡️${colors.reset}`);
      rl.close();
      return;
    }
    
    if (command === 'help') {
      showHelp();
    } else if (command === 'clear') {
      console.clear();
      showBanner();
    } else if (command === 'status') {
      await showSystemStatus();
    } else if (command) {
      const result = await processCommandWithAI(command);
      console.log(result);
    }
    
    console.log('');
    rl.prompt();
  });

  rl.on('close', () => {
    console.log(`${colors.dim}Session terminated.${colors.reset}`);
    process.exit(0);
  });
}

// Start the CLI
startCLI().catch(console.error);