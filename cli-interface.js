#!/usr/bin/env node

// CyberShellX CLI Interface
// Simple command-line cybersecurity tool simulator

const readline = require('readline');
const { exec } = require('child_process');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const tools = {
  nmap: {
    description: "Network mapping and port scanning",
    simulate: () => "Starting Nmap scan...\nDiscovered open ports: 22, 80, 443\nScan complete."
  },
  metasploit: {
    description: "Penetration testing framework", 
    simulate: () => "Metasploit Framework Console v6.3.0\nmsf6 > Exploitation modules loaded"
  },
  wireshark: {
    description: "Network protocol analyzer",
    simulate: () => "Wireshark started\nCapturing packets on interface eth0..."
  },
  sqlmap: {
    description: "SQL injection testing tool",
    simulate: () => "sqlmap v1.7.0\nTesting for SQL injection vulnerabilities..."
  },
  burpsuite: {
    description: "Web application security testing",
    simulate: () => "Burp Suite Professional\nProxy listening on 127.0.0.1:8080"
  },
  john: {
    description: "Password cracking tool",
    simulate: () => "John the Ripper password cracker\nLoaded 1000 password hashes..."
  },
  hydra: {
    description: "Login cracker",
    simulate: () => "THC Hydra v9.4\nStarting brute force attack..."
  },
  nikto: {
    description: "Web server scanner", 
    simulate: () => "Nikto web scanner\nScanning target for vulnerabilities..."
  }
};

function showBanner() {
  console.clear();
  console.log('\x1b[36m%s\x1b[0m', `
╔══════════════════════════════════════════════════════════════╗
║                    CyberShellX CLI Terminal                  ║
║                  Advanced Security Interface                ║
║                    Educational Use Only                     ║
╚══════════════════════════════════════════════════════════════╝
`);
  console.log('Available Commands:');
  Object.keys(tools).forEach(tool => {
    console.log(`• \x1b[32m${tool.padEnd(12)}\x1b[0m - ${tools[tool].description}`);
  });
  console.log('• \x1b[32mhelp\x1b[0m        - Show this help menu');
  console.log('• \x1b[32mclear\x1b[0m       - Clear screen');
  console.log('• \x1b[32mexit\x1b[0m        - Exit terminal\n');
}

function executeCommand(cmd) {
  const command = cmd.trim().toLowerCase();
  
  if (tools[command]) {
    console.log(`\x1b[33m[CyberShell]\x1b[0m ${tools[command].simulate()}\n`);
  } else {
    switch(command) {
      case 'help':
        showBanner();
        break;
      case 'clear':
        console.clear();
        showBanner();
        break;
      case 'exit':
        console.log('\x1b[36mExiting CyberShellX CLI...\x1b[0m');
        process.exit(0);
        break;
      case '':
        break;
      default:
        console.log(`\x1b[31mUnknown command: ${cmd}\x1b[0m`);
        console.log('Use \x1b[32mhelp\x1b[0m to see available commands\n');
    }
  }
}

function startCLI() {
  showBanner();
  
  const prompt = () => {
    rl.question('\x1b[36mcybershell@nexus\x1b[0m:\x1b[34m~\x1b[0m$ ', (input) => {
      executeCommand(input);
      prompt();
    });
  };
  
  prompt();
}

// Handle Ctrl+C gracefully
process.on('SIGINT', () => {
  console.log('\n\x1b[36mExiting CyberShellX CLI...\x1b[0m');
  process.exit(0);
});

startCLI();