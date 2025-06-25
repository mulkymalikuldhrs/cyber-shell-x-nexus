// Cyber Assistant - AI-Powered Command Assistant Server
// Runs directly in Termux with real-time Web UI

import express from 'express';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = createServer(app);
const wss = new WebSocketServer({ server });

const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, '../web-ui')));

// Load configuration
let config = {};
try {
  const configPath = path.join(__dirname, '../config/assistant-config.json');
  config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
} catch (error) {
  console.log('⚠️ Config not found, using defaults');
  config = {
    assistant: { name: "Cyber Assistant" },
    ai_providers: { local: { enabled: true } },
    security: {
      safe_commands: ["ls", "cat", "grep", "find", "pwd", "echo", "date", "whoami"],
      dangerous_commands: ["rm -rf", "dd", "mkfs", "fdisk"],
      require_confirmation: ["rm", "mv", "cp", "chmod", "chown"]
    }
  };
}

// Store active connections
const clients = new Set();

// WebSocket connection handler
wss.on('connection', (ws) => {
  clients.add(ws);
  console.log('🔗 Client connected');
  
  // Send welcome message
  ws.send(JSON.stringify({
    type: 'welcome',
    message: `${config.assistant.name} ready! Send natural language commands.`,
    timestamp: new Date().toISOString()
  }));
  
  ws.on('message', async (data) => {
    try {
      const message = JSON.parse(data.toString());
      await handleMessage(ws, message);
    } catch (error) {
      console.error('Message error:', error);
    }
  });
  
  ws.on('close', () => {
    clients.delete(ws);
    console.log('🔌 Client disconnected');
  });
});

// Broadcast to all clients
function broadcast(data) {
  const message = JSON.stringify(data);
  clients.forEach(client => {
    if (client.readyState === client.OPEN) {
      client.send(message);
    }
  });
}

// Handle incoming messages
async function handleMessage(ws, message) {
  const { type, data } = message;
  
  switch (type) {
    case 'natural_language':
      await processNaturalLanguage(ws, data);
      break;
    case 'direct_command':
      await executeCommand(ws, data.command, data.safe);
      break;
    case 'voice_input':
      await processVoiceInput(ws, data);
      break;
    case 'save_script':
      await saveScript(ws, data);
      break;
    case 'get_logs':
      await getLogs(ws);
      break;
    case 'automation_task':
      await runAutomation(ws, data);
      break;
    default:
      ws.send(JSON.stringify({
        type: 'error',
        message: 'Unknown message type'
      }));
  }
}

// Process natural language input
async function processNaturalLanguage(ws, input) {
  logActivity('natural_language', input);
  
  ws.send(JSON.stringify({
    type: 'processing',
    message: 'Understanding your request...'
  }));
  
  try {
    // Use AI to convert natural language to command
    const command = await aiToCommand(input);
    
    ws.send(JSON.stringify({
      type: 'command_generated',
      command: command,
      original: input
    }));
    
    // Check if command is safe
    const safetyCheck = checkCommandSafety(command);
    
    if (safetyCheck.safe) {
      await executeCommand(ws, command, true);
    } else {
      ws.send(JSON.stringify({
        type: 'safety_warning',
        command: command,
        reason: safetyCheck.reason,
        requiresConfirmation: true
      }));
    }
    
  } catch (error) {
    ws.send(JSON.stringify({
      type: 'ai_error',
      message: 'Could not process request: ' + error.message
    }));
  }
}

// AI-powered natural language to command conversion
async function aiToCommand(input) {
  // Simple rule-based conversion for now (can be enhanced with OpenRouter API)
  const patterns = [
    {
      pattern: /list.*files?|show.*files?|ls/i,
      command: 'ls -la'
    },
    {
      pattern: /current.*directory|where.*am.*i|pwd/i,
      command: 'pwd'
    },
    {
      pattern: /create.*file.*(.+)|touch.*(.+)/i,
      command: (match) => `touch ${match[1] || match[2]}`
    },
    {
      pattern: /show.*content.*(.+)|cat.*(.+)|read.*(.+)/i,
      command: (match) => `cat ${match[1] || match[2] || match[3]}`
    },
    {
      pattern: /delete.*file.*(.+)|remove.*(.+)/i,
      command: (match) => `rm ${match[1] || match[2]}`
    },
    {
      pattern: /create.*directory.*(.+)|mkdir.*(.+)/i,
      command: (match) => `mkdir -p ${match[1] || match[2]}`
    },
    {
      pattern: /find.*(.+)|search.*(.+)/i,
      command: (match) => `find . -name "*${match[1] || match[2]}*"`
    },
    {
      pattern: /install.*(.+)|pkg.*install.*(.+)/i,
      command: (match) => `pkg install ${match[1] || match[2]}`
    },
    {
      pattern: /python.*script.*(.+)|create.*python.*(.+)/i,
      command: (match) => generatePythonScript(match[1] || match[2])
    },
    {
      pattern: /shell.*script.*(.+)|create.*bash.*(.+)/i,
      command: (match) => generateShellScript(match[1] || match[2])
    },
    {
      pattern: /git.*clone.*(.+)/i,
      command: (match) => `git clone ${match[1]}`
    },
    {
      pattern: /setup.*react.*project|create.*react.*app/i,
      command: 'npx create-react-app my-app'
    },
    {
      pattern: /check.*system.*info|system.*status/i,
      command: 'uname -a && df -h && free -h'
    }
  ];
  
  for (const { pattern, command } of patterns) {
    const match = input.match(pattern);
    if (match) {
      return typeof command === 'function' ? command(match) : command;
    }
  }
  
  // If no pattern matches, try to use external AI API
  if (config.ai_providers.openrouter?.enabled && config.ai_providers.openrouter?.api_key) {
    return await callOpenRouterAPI(input);
  }
  
  throw new Error('Could not understand the request. Try being more specific.');
}

// Call OpenRouter API for advanced AI processing
async function callOpenRouterAPI(input) {
  // Implementation for OpenRouter API call
  // This would make an actual API call to convert natural language to commands
  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${config.ai_providers.openrouter.api_key}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: "meta-llama/llama-3.1-8b-instruct:free",
      messages: [{
        role: "system",
        content: "You are a Termux command assistant. Convert natural language to safe shell commands. Only respond with the command, no explanation."
      }, {
        role: "user",
        content: input
      }]
    })
  });
  
  const data = await response.json();
  return data.choices[0].message.content.trim();
}

// Check command safety
function checkCommandSafety(command) {
  const dangerous = config.security.dangerous_commands;
  const requireConfirmation = config.security.require_confirmation;
  
  for (const dangerous_cmd of dangerous) {
    if (command.includes(dangerous_cmd)) {
      return { safe: false, reason: 'Dangerous command detected' };
    }
  }
  
  for (const confirm_cmd of requireConfirmation) {
    if (command.startsWith(confirm_cmd)) {
      return { safe: false, reason: 'Requires confirmation' };
    }
  }
  
  return { safe: true };
}

// Execute shell command
async function executeCommand(ws, command, confirmed = false) {
  logActivity('command_execution', command);
  
  ws.send(JSON.stringify({
    type: 'command_start',
    command: command
  }));
  
  exec(command, { cwd: process.cwd() }, (error, stdout, stderr) => {
    const result = {
      type: 'command_result',
      command: command,
      success: !error,
      stdout: stdout,
      stderr: stderr,
      error: error ? error.message : null,
      timestamp: new Date().toISOString()
    };
    
    ws.send(JSON.stringify(result));
    
    // Log the result
    logActivity('command_result', result);
    
    // If command failed, try to auto-fix
    if (error && !confirmed) {
      attemptAutoFix(ws, command, error);
    }
  });
}

// Attempt to auto-fix failed commands
async function attemptAutoFix(ws, command, error) {
  ws.send(JSON.stringify({
    type: 'auto_fix_attempt',
    message: 'Attempting to fix the command...'
  }));
  
  // Simple auto-fix patterns
  const fixes = [
    {
      error: /command not found/i,
      fix: (cmd) => {
        if (!cmd.startsWith('pkg install')) {
          return `pkg install ${cmd.split(' ')[0]}`;
        }
        return null;
      }
    },
    {
      error: /permission denied/i,
      fix: (cmd) => `chmod +x ${cmd.split(' ').slice(-1)[0]}`
    },
    {
      error: /no such file or directory/i,
      fix: (cmd) => {
        const filename = cmd.split(' ').slice(-1)[0];
        return `touch ${filename}`;
      }
    }
  ];
  
  for (const { error: pattern, fix } of fixes) {
    if (pattern.test(error.message)) {
      const fixedCommand = fix(command);
      if (fixedCommand) {
        ws.send(JSON.stringify({
          type: 'auto_fix_suggestion',
          original: command,
          fixed: fixedCommand
        }));
        
        // Auto-execute the fix
        await executeCommand(ws, fixedCommand, true);
        return;
      }
    }
  }
  
  ws.send(JSON.stringify({
    type: 'auto_fix_failed',
    message: 'Could not automatically fix the command'
  }));
}

// Generate Python script
function generatePythonScript(description) {
  const scriptName = `script_${Date.now()}.py`;
  const basicScript = `#!/usr/bin/env python3
# Generated script: ${description}

def main():
    print("Hello from ${description}")
    # Add your code here

if __name__ == "__main__":
    main()
`;
  
  fs.writeFileSync(scriptName, basicScript);
  return `echo "Python script created: ${scriptName}" && cat ${scriptName}`;
}

// Generate Shell script
function generateShellScript(description) {
  const scriptName = `script_${Date.now()}.sh`;
  const basicScript = `#!/bin/bash
# Generated script: ${description}

echo "Running ${description}"
# Add your commands here
`;
  
  fs.writeFileSync(scriptName, basicScript);
  fs.chmodSync(scriptName, '755');
  return `echo "Shell script created: ${scriptName}" && cat ${scriptName}`;
}

// Process voice input
async function processVoiceInput(ws, audioData) {
  // For now, just acknowledge voice input
  // In a full implementation, this would use speech-to-text
  ws.send(JSON.stringify({
    type: 'voice_processed',
    message: 'Voice input received. Speech-to-text processing would happen here.',
    suggestion: 'Implement with termux-speech-to-text or Web Speech API'
  }));
}

// Save script functionality
async function saveScript(ws, scriptData) {
  const { name, content, type } = scriptData;
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = `data/scripts/${name}_${timestamp}.${type}`;
  
  try {
    fs.writeFileSync(filename, content);
    ws.send(JSON.stringify({
      type: 'script_saved',
      filename: filename,
      message: `Script saved as ${filename}`
    }));
    
    logActivity('script_saved', { filename, type });
  } catch (error) {
    ws.send(JSON.stringify({
      type: 'save_error',
      message: 'Failed to save script: ' + error.message
    }));
  }
}

// Get activity logs
async function getLogs(ws) {
  try {
    const logPath = path.join(__dirname, '../logs/activity.log');
    if (fs.existsSync(logPath)) {
      const logs = fs.readFileSync(logPath, 'utf8');
      ws.send(JSON.stringify({
        type: 'logs',
        data: logs.split('\n').slice(-50) // Last 50 lines
      }));
    } else {
      ws.send(JSON.stringify({
        type: 'logs',
        data: []
      }));
    }
  } catch (error) {
    ws.send(JSON.stringify({
      type: 'error',
      message: 'Failed to get logs: ' + error.message
    }));
  }
}

// Run automation tasks
async function runAutomation(ws, taskData) {
  const { type, config: taskConfig } = taskData;
  
  ws.send(JSON.stringify({
    type: 'automation_start',
    task: type
  }));
  
  // Automation implementations would go here
  // For now, just acknowledge
  ws.send(JSON.stringify({
    type: 'automation_complete',
    task: type,
    message: `Automation task ${type} would be implemented here`
  }));
}

// Log activity
function logActivity(type, data) {
  const timestamp = new Date().toISOString();
  const logEntry = `[${timestamp}] ${type}: ${JSON.stringify(data)}\n`;
  
  try {
    fs.mkdirSync('logs', { recursive: true });
    fs.appendFileSync('logs/activity.log', logEntry);
  } catch (error) {
    console.error('Logging error:', error);
  }
}

// API Routes
app.get('/api/status', (req, res) => {
  res.json({
    status: 'running',
    assistant: config.assistant.name,
    version: config.assistant.version || '1.0.0',
    capabilities: config.assistant.capabilities || {},
    clients: clients.size,
    timestamp: new Date().toISOString()
  });
});

app.post('/api/command', async (req, res) => {
  const { command, natural_language } = req.body;
  
  try {
    if (natural_language) {
      const cmd = await aiToCommand(command);
      res.json({ success: true, command: cmd });
    } else {
      const safety = checkCommandSafety(command);
      res.json({ success: true, safe: safety.safe, reason: safety.reason });
    }
  } catch (error) {
    res.json({ success: false, error: error.message });
  }
});

// Serve main UI
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../web-ui/index.html'));
});

// Start server
server.listen(PORT, () => {
  console.log(`🤖 ${config.assistant.name} running on port ${PORT}`);
  console.log(`🌐 Web Interface: http://localhost:${PORT}`);
  console.log(`📱 Mobile Optimized UI with Voice Support`);
  console.log(`⚡ WebSocket Real-time Communication Active`);
  console.log(`🎤 Voice Input: Available`);
  console.log(`🔧 Auto-fix: Enabled`);
  console.log(`📝 Activity Logging: Active`);
  
  // Log startup
  logActivity('server_start', {
    port: PORT,
    assistant: config.assistant.name,
    capabilities: config.assistant.capabilities
  });
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down Cyber Assistant...');
  logActivity('server_stop', { reason: 'SIGINT' });
  process.exit(0);
});
