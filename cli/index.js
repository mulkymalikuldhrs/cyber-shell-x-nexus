#!/usr/bin/env node

import readline from 'readline';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import ora from 'ora';
import { colors, commandExists, getPackageManager, executeCommand, log } from './utils.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load cybersecurity commands database
let commandsDB = {};
try {
  const commandsPath = path.join(process.cwd(), 'cybershell-commands', 'commands.json');
  const commandsData = fs.readFileSync(commandsPath, 'utf8');
  commandsDB = JSON.parse(commandsData);
} catch (error) {
  log('warn', 'Could not load commands database.');
}

// Enhanced command processing with AI integration
async function processCommandWithAI(command) {
  const spinner = ora('Sending command to AI backend...').start();
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 detik timeout

  try {
    const response = await fetch('http://localhost:5000/api/command', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ command }),
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (response.ok) {
      spinner.succeed('AI analysis complete.');
      const data = await response.json();
      console.log(data.response); // AI provides explanation and might execute
    } else {
       const errorData = await response.json();
       spinner.fail(`Error from AI backend: ${errorData.message || response.statusText}`);
       log('info', "Execution halted due to AI backend error.");
    }
  } catch (error) {
    clearTimeout(timeoutId);
    spinner.fail('Fatal Error: Could not connect to CyberShellX AI backend.');
    log('error', `Please ensure the server is running and accessible.`);
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
  console.log(`  ${colors.yellow}help${colors.reset}        - Show this help menu`);
  console.log(`  ${colors.yellow}status${colors.reset}      - Show system status and tool availability`);
  console.log(`  ${colors.yellow}clear${colors.reset}       - Clear the terminal`);
  console.log(`  ${colors.yellow}exit/quit${colors.reset}   - Exit CyberShellX`);
  console.log(`  ${colors.yellow}automate${colors.reset}    - Run automated pentest`);
  console.log(``);
  console.log(`${colors.bright}Information Gathering:${colors.reset}`);
  console.log(`  ${colors.green}nmap${colors.reset}        - Network discovery and security auditing`);
  console.log(`  ${colors.green}theharvester${colors.reset} - E-mail, subdomain, and names harvester`);
  console.log(`  ${colors.green}sublist3r${colors.reset}   - Subdomain enumeration tool`);
  console.log(``);
  console.log(`${colors.bright}Vulnerability Analysis:${colors.reset}`);
  console.log(`  ${colors.green}nikto${colors.reset}       - Web server scanner`);
  console.log(`  ${colors.green}nuclei${colors.reset}      - Template-based vulnerability scanner`);
  console.log(`  ${colors.green}sqlmap${colors.reset}      - Automatic SQL injection and database takeover tool`);
  console.log(``);
  console.log(`${colors.bright}Web Application Analysis:${colors.reset}`);
  console.log(`  ${colors.green}gobuster${colors.reset}    - Directory/file, DNS and VHost busting tool`);
  console.log(`  ${colors.green}dirb${colors.reset}        - Web content scanner`);
  console.log(`  ${colors.green}whatweb${colors.reset}      - Web scanner to identify technologies`);
  console.log(``);
  console.log(`${colors.bright}Password Attacks:${colors.reset}`);
  console.log(`  ${colors.green}hydra${colors.reset}       - Parallelized network logon cracker`);
  console.log(`  ${colors.green}john${colors.reset}        - John the Ripper password cracker`);
  console.log(``);
  console.log(`${colors.bright}Wireless Attacks:${colors.reset}`);
  console.log(`  ${colors.green}aircrack-ng${colors.reset} - 802.11 WEP and WPA-PSK keys cracking`);
  console.log(``);
  console.log(`${colors.bright}Exploitation Frameworks:${colors.reset}`);
  console.log(`  ${colors.green}msfconsole${colors.reset}   - The Metasploit Framework`);
  console.log(`  ${colors.green}searchsploit${colors.reset}- Exploit-DB command-line search`);
  console.log(``);
  console.log(`${colors.red}⚠️  This tool is for educational and authorized testing purposes only.${colors.reset}`);
  console.log(``);
}

async function showSystemStatus() {
  log('info', 'Running System Status Check...');
  const spinner = ora('Checking server connection...').start();
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);

  try {
    const response = await fetch('http://localhost:5000/api/ai/status', { signal: controller.signal });
    clearTimeout(timeoutId);
    if (response.ok) {
      const status = await response.json();
      spinner.succeed('Server Connection: Active');
      log('info', `AI APIs Available: ${status.available.length}`);
    } else {
      spinner.fail(`Server Connection: Error (Status: ${response.status})`);
    }
  } catch (error) {
    clearTimeout(timeoutId);
    spinner.fail(`Server Connection: Offline (${error.name})`);
  }

  log('info', 'Checking commands database...');
  log('info', 'Commands Database: Loaded');

  const toolCategories = {
    "Information Gathering": ["nmap", "theharvester", "sublist3r"],
    "Vulnerability Analysis": ["nikto", "nuclei", "sqlmap"],
    "Web Application Analysis": ["gobuster", "dirb", "whatweb"],
    "Password Attacks": ["hydra", "john"],
    "Wireless Attacks": ["aircrack-ng"],
    "Exploitation Frameworks": ["msfconsole", "searchsploit"],
  };

  for (const category in toolCategories) {
    console.log(`\n${colors.bright}${category}:${colors.reset}`);
    for (const tool of toolCategories[category]) {
      const exists = await commandExists(tool);
      console.log(`  ${exists ? colors.green + '✓' : colors.red + '✗'} ${tool}`);
    }
  }
}

async function startCLI() {
  if (!process.stdin.isTTY) {
    // Non-interactive mode
    const rl = readline.createInterface({ input: process.stdin });
    for await (const line of rl) {
      await handleCommand(line);
    }
    return;
  }

  // Interactive mode
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: `${colors.cyan}cyber@shell${colors.reset}:${colors.blue}~${colors.reset}$ `
  });

  showBanner();
  log('info', `CyberShellX AI is active. Type 'help' for commands.`);
  console.log('');
  rl.prompt();

  rl.on('line', async (input) => {
    await handleCommand(input);
    if (process.stdin.isTTY) {
      console.log('');
      rl.prompt();
    }
  });

  rl.on('close', () => {
    if (process.stdin.isTTY) {
      log('info', 'Session terminated.');
    }
    process.exit(0);
  });
}

async function handleCommand(command) {
  command = command.trim();
  if (!command) return;

  if (command === 'exit' || command === 'quit') {
    log('info', 'Goodbye! Stay secure! 🛡️');
    process.exit(0);
  }

  if (command === 'help') {
    showHelp();
  } else if (command === 'clear') {
    console.clear();
    showBanner();
  } else if (command === 'status') {
    await showSystemStatus();
  } else if (command === 'automate') {
    const rlAutomate = readline.createInterface({ input: process.stdin, output: process.stdout });
    const target = await new Promise(resolve => rlAutomate.question(`Enter target: `));
    const objectives = await new Promise(resolve => rlAutomate.question(`Enter objectives (comma-separated): `));
    rlAutomate.close();

    const workspaceDir = path.join(process.cwd(), 'workspaces', target.replace(/[^a-z0-9.-]/gi, '_'));
    if (!fs.existsSync(workspaceDir)) {
      fs.mkdirSync(workspaceDir, { recursive: true });
    }
    const historyFilePath = path.join(workspaceDir, 'history.json');

    log('info', `Starting automated pentest for target: ${target}`);
    log('debug', `Workspace: ${workspaceDir}`);

    let conversationHistory = [];
    if (fs.existsSync(historyFilePath)) {
      conversationHistory = JSON.parse(fs.readFileSync(historyFilePath, 'utf-8'));
      log('warn', 'Resuming previous session...');
    }

    let commandToExecute = null;
    let loopCount = 0;
    const maxLoops = 10;

    const spinner = ora('Requesting first command from AI...').start();
    const initialResponse = await fetch('http://localhost:5000/api/automate/next-step', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ target, objectives: objectives.split(','), history: conversationHistory })
    });
    const initialData = await initialResponse.json();
    if (initialData.success && initialData.next_command) {
        spinner.succeed('Initial command received.');
        commandToExecute = initialData.next_command;
        conversationHistory.push({ role: 'assistant', parts: `Okay, the first command is: ${commandToExecute}` });
    } else {
        spinner.fail('Failed to get initial command from AI.');
        return;
    }

    while (commandToExecute && commandToExecute.toLowerCase() !== 'finish' && loopCount < maxLoops) {
        loopCount++;
        log('info', `[Loop ${loopCount}/${maxLoops}] Executing: ${commandToExecute}`);

        try {
            const { stdout, stderr } = await executeCommand(commandToExecute, { pipe: true });
            const output = stdout + stderr;
            conversationHistory.push({ role: 'user', parts: `Command "${commandToExecute}" executed. Output:\n${output}` });

            const extractionSpinner = ora('Extracting info from output...').start();
            const infoRes = await fetch('http://localhost:5000/api/automate/extract-info', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ command: commandToExecute, output })
            });
            const infoData = await infoRes.json();
            extractionSpinner.succeed('Info extracted.');

            let notes = {};
            const notesFilePath = path.join(workspaceDir, 'notes.json');
            if (fs.existsSync(notesFilePath)) {
                notes = JSON.parse(fs.readFileSync(notesFilePath, 'utf-8'));
            }
            notes = { ...notes, ...infoData.info };
            fs.writeFileSync(notesFilePath, JSON.stringify(notes, null, 2));
            log('debug', `Extracted info: ${JSON.stringify(infoData.info)}`);

            const nextStepSpinner = ora('Sending output to AI for analysis...').start();
            const nextStepResponse = await fetch('http://localhost:5000/api/automate/next-step', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ target, objectives: objectives.split(','), history: conversationHistory, notes })
            });
            const nextStepData = await nextStepResponse.json();
            nextStepSpinner.succeed('AI analysis complete.');

            if (nextStepData.success && nextStepData.next_command) {
                commandToExecute = nextStepData.next_command;
                conversationHistory.push({ role: 'assistant', parts: `Okay, the next command is: ${commandToExecute}` });
            } else {
                log('warn', 'AI decided to finish or failed to provide next step.');
                commandToExecute = null;
            }
        } catch (error) {
            log('error', `Command failed: ${error.message}`);
            conversationHistory.push({ role: 'user', parts: `Command "${commandToExecute}" failed with error: ${error.message}` });
        }
        fs.writeFileSync(historyFilePath, JSON.stringify(conversationHistory, null, 2));
    }
    log('info', 'Automation finished.');
  } else {
    const mainCommand = command.split(' ')[0];
    const toolExists = await commandExists(mainCommand);

    if (toolExists) {
      if (command.endsWith('--help') || command.endsWith('-h')) {
        await executeCommand(command).catch(err => log('error', err.message));
      } else {
        await processCommandWithAI(command);
      }
    } else {
      log('error', `Command '${mainCommand}' not found.`);
      log('info', `Please install the tool or check your PATH.`);
    }
  }
}

async function manageTools() {
  log('info', 'Starting Tool Manager...');
  const packageManager = await getPackageManager();
  if (!packageManager) {
    log('error', 'Could not determine package manager. Please install tools manually.');
    return;
  }
  log('info', `Using package manager: ${packageManager}`);

  const toolCategories = {
    "Information Gathering": ["nmap", "theharvester", "sublist3r"],
    "Vulnerability Analysis": ["nikto", "nuclei", "sqlmap"],
    "Web Application Analysis": ["gobuster", "dirb", "whatweb"],
    "Password Attacks": ["hydra", "john"],
    "Wireless Attacks": ["aircrack-ng"],
    "Exploitation Frameworks": ["msfconsole", "searchsploit"],
  };

  const missingTools = [];
  for (const category in toolCategories) {
    for (const tool of toolCategories[category]) {
      if (!await commandExists(tool)) {
        missingTools.push(tool);
      }
    }
  }

  if (missingTools.length > 0) {
    log('warn', `Missing tools detected: ${missingTools.join(', ')}`);
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    for (const tool of missingTools) {
      await new Promise(resolve => {
        rl.question(`Do you want to try to install ${tool}? (y/n) `, async (answer) => {
          if (answer.toLowerCase() === 'y') {
            const installSpinner = ora(`Attempting to install ${tool}...`).start();
            try {
              let installCommand;
              switch (packageManager) {
                case 'apt-get':
                  installCommand = `sudo apt-get install -y ${tool}`;
                  break;
                case 'yum':
                case 'dnf':
                  installCommand = `sudo ${packageManager} install -y ${tool}`;
                  break;
                case 'brew':
                  installCommand = `brew install ${tool}`;
                  break;
                default:
                  installSpinner.fail('Unsupported package manager.');
                  resolve();
                  return;
              }
              await executeCommand(installCommand);
              installSpinner.succeed(`${tool} installed successfully.`);
            } catch (error) {
              installSpinner.fail(`Failed to install ${tool}. Please install it manually.`);
            }
          }
          resolve();
        });
      });
    }
    rl.close();
  } else {
    log('info', 'All tools are installed.');
  }
}

async function main() {
    if (process.argv.includes('--manage-tools')) {
        await manageTools();
    } else {
        await startCLI().catch(err => log('error', err.message));
    }
}

main();