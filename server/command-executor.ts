import { exec, spawn, ChildProcess } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';
import os from 'os';

const execAsync = promisify(exec);

export interface CommandResult {
  success: boolean;
  output: string;
  error?: string;
  exitCode: number;
  duration: number;
  command: string;
}

export interface ToolCapability {
  name: string;
  available: boolean;
  version?: string;
  path?: string;
}

export class CommandExecutor {
  private workingDirectory: string;
  private runningProcesses: Map<string, ChildProcess> = new Map();
  private executionHistory: CommandResult[] = [];
  private safeMode: boolean = true;
  private allowedCommands: Set<string> = new Set([
    // Development tools
    'node', 'npm', 'yarn', 'pnpm', 'bun',
    'python', 'python3', 'pip', 'pip3', 'poetry',
    'git', 'gh', 'docker', 'docker-compose',
    'java', 'javac', 'maven', 'gradle',
    'go', 'cargo', 'rustc',
    'php', 'composer',
    'ruby', 'gem', 'bundle',
    'dotnet', 'nuget',
    
    // System tools
    'ls', 'dir', 'pwd', 'cd', 'mkdir', 'rmdir', 'rm', 'cp', 'mv',
    'cat', 'less', 'head', 'tail', 'grep', 'find', 'which', 'where',
    'curl', 'wget', 'ping', 'netstat', 'ps', 'top', 'htop',
    'chmod', 'chown', 'whoami', 'id', 'uname',
    
    // Build tools
    'make', 'cmake', 'ninja', 'msbuild',
    'webpack', 'vite', 'rollup', 'parcel',
    'eslint', 'prettier', 'tsc', 'babel',
    
    // Database tools
    'mysql', 'psql', 'sqlite3', 'mongosh',
    'redis-cli', 'influx',
    
    // Cloud tools
    'aws', 'gcloud', 'az', 'kubectl', 'helm',
    'terraform', 'ansible'
  ]);

  private dangerousCommands: Set<string> = new Set([
    'rm -rf', 'format', 'fdisk', 'dd', 'mkfs',
    'shutdown', 'reboot', 'halt', 'poweroff',
    'chmod 777', 'chown -R', 'sudo rm',
    'del /f /s /q', 'rmdir /s', 'format c:',
    'diskpart', 'bcdedit', 'reg delete',
    'killall', 'pkill -9', 'kill -9'
  ]);

  constructor(workingDir: string = process.cwd(), safeMode: boolean = true) {
    this.workingDirectory = workingDir;
    this.safeMode = safeMode;
  }

  async executeCommand(command: string, options: {
    timeout?: number;
    interactive?: boolean;
    requireConfirmation?: boolean;
    environment?: Record<string, string>;
  } = {}): Promise<CommandResult> {
    const startTime = Date.now();
    const processId = `cmd_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    try {
      // Security check
      if (this.safeMode && this.isDangerousCommand(command)) {
        if (!options.requireConfirmation) {
          throw new Error(`Dangerous command detected: ${command}. Requires explicit confirmation.`);
        }
      }

      // Check if command is allowed
      const baseCommand = command.split(' ')[0];
      if (this.safeMode && !this.isAllowedCommand(baseCommand)) {
        throw new Error(`Command not allowed in safe mode: ${baseCommand}`);
      }

      const result = await this.runCommand(command, processId, options);
      
      const commandResult: CommandResult = {
        success: result.exitCode === 0,
        output: result.stdout,
        error: result.stderr,
        exitCode: result.exitCode,
        duration: Date.now() - startTime,
        command
      };

      this.executionHistory.push(commandResult);
      return commandResult;

    } catch (error) {
      const commandResult: CommandResult = {
        success: false,
        output: '',
        error: error.message,
        exitCode: -1,
        duration: Date.now() - startTime,
        command
      };

      this.executionHistory.push(commandResult);
      return commandResult;
    }
  }

  private async runCommand(command: string, processId: string, options: any): Promise<{
    stdout: string;
    stderr: string;
    exitCode: number;
  }> {
    return new Promise((resolve, reject) => {
      const timeout = options.timeout || 30000;
      const env = { ...process.env, ...options.environment };
      
      const childProcess = spawn(command, {
        shell: true,
        cwd: this.workingDirectory,
        env,
        stdio: options.interactive ? 'inherit' : 'pipe'
      });

      this.runningProcesses.set(processId, childProcess);

      let stdout = '';
      let stderr = '';

      if (!options.interactive) {
        childProcess.stdout?.on('data', (data) => {
          stdout += data.toString();
        });

        childProcess.stderr?.on('data', (data) => {
          stderr += data.toString();
        });
      }

      const timeoutHandle = setTimeout(() => {
        childProcess.kill('SIGTERM');
        reject(new Error(`Command timeout after ${timeout}ms`));
      }, timeout);

      childProcess.on('close', (code) => {
        clearTimeout(timeoutHandle);
        this.runningProcesses.delete(processId);
        
        resolve({
          stdout,
          stderr,
          exitCode: code || 0
        });
      });

      childProcess.on('error', (error) => {
        clearTimeout(timeoutHandle);
        this.runningProcesses.delete(processId);
        reject(error);
      });
    });
  }

  async executeMultipleCommands(commands: string[], options: {
    stopOnError?: boolean;
    parallel?: boolean;
  } = {}): Promise<CommandResult[]> {
    const results: CommandResult[] = [];

    if (options.parallel) {
      const promises = commands.map(cmd => this.executeCommand(cmd));
      const parallelResults = await Promise.allSettled(promises);
      
      return parallelResults.map((result, index) => {
        if (result.status === 'fulfilled') {
          return result.value;
        } else {
          return {
            success: false,
            output: '',
            error: result.reason?.message || 'Unknown error',
            exitCode: -1,
            duration: 0,
            command: commands[index]
          };
        }
      });
    } else {
      for (const command of commands) {
        const result = await this.executeCommand(command);
        results.push(result);
        
        if (!result.success && options.stopOnError) {
          break;
        }
      }
    }

    return results;
  }

  async checkToolAvailability(): Promise<Record<string, ToolCapability>> {
    const tools = [
      'node', 'npm', 'python', 'python3', 'git', 'docker',
      'java', 'go', 'cargo', 'php', 'ruby', 'dotnet',
      'mysql', 'psql', 'sqlite3', 'redis-cli',
      'aws', 'gcloud', 'kubectl', 'terraform'
    ];

    const capabilities: Record<string, ToolCapability> = {};

    for (const tool of tools) {
      try {
        const result = await this.executeCommand(`${tool} --version`, { timeout: 5000 });
        capabilities[tool] = {
          name: tool,
          available: result.success,
          version: result.success ? result.output.split('\n')[0] : undefined
        };
      } catch (error) {
        capabilities[tool] = {
          name: tool,
          available: false
        };
      }
    }

    return capabilities;
  }

  async installDependency(packageManager: 'npm' | 'pip' | 'composer' | 'gem' | 'go', packageName: string): Promise<CommandResult> {
    const installCommands = {
      npm: `npm install ${packageName}`,
      pip: `pip install ${packageName}`,
      composer: `composer require ${packageName}`,
      gem: `gem install ${packageName}`,
      go: `go get ${packageName}`
    };

    const command = installCommands[packageManager];
    return await this.executeCommand(command, { timeout: 120000 });
  }

  async setupProject(projectType: 'node' | 'python' | 'php' | 'go' | 'java', projectName: string): Promise<CommandResult[]> {
    const setupCommands: Record<string, string[]> = {
      node: [
        `mkdir ${projectName}`,
        `cd ${projectName}`,
        `npm init -y`,
        `npm install express`,
        `echo "const express = require('express');\nconst app = express();\nconst PORT = 3000;\n\napp.get('/', (req, res) => {\n  res.json({ message: 'Hello World!' });\n});\n\napp.listen(PORT, () => {\n  console.log(\`Server running on port \${PORT}\`);\n});" > index.js`
      ],
      python: [
        `mkdir ${projectName}`,
        `cd ${projectName}`,
        `python -m venv venv`,
        `echo "flask\nrequests" > requirements.txt`,
        `echo "from flask import Flask\n\napp = Flask(__name__)\n\n@app.route('/')\ndef hello():\n    return {'message': 'Hello World!'}\n\nif __name__ == '__main__':\n    app.run(debug=True)" > app.py`
      ],
      php: [
        `mkdir ${projectName}`,
        `cd ${projectName}`,
        `composer init --no-interaction`,
        `echo "<?php\necho json_encode(['message' => 'Hello World!']);" > index.php`
      ],
      go: [
        `mkdir ${projectName}`,
        `cd ${projectName}`,
        `go mod init ${projectName}`,
        `echo "package main\n\nimport (\n    \"encoding/json\"\n    \"net/http\"\n)\n\nfunc main() {\n    http.HandleFunc(\"/\", func(w http.ResponseWriter, r *http.Request) {\n        json.NewEncoder(w).Encode(map[string]string{\"message\": \"Hello World!\"})\n    })\n    http.ListenAndServe(\":8080\", nil)\n}" > main.go`
      ],
      java: [
        `mkdir ${projectName}`,
        `cd ${projectName}`,
        `mkdir -p src/main/java`,
        `echo "<?xml version=\\"1.0\\" encoding=\\"UTF-8\\"?>\n<project xmlns=\\"http://maven.apache.org/POM/4.0.0\\"\n         xmlns:xsi=\\"http://www.w3.org/2001/XMLSchema-instance\\"\n         xsi:schemaLocation=\\"http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd\\">\n    <modelVersion>4.0.0</modelVersion>\n    <groupId>com.example</groupId>\n    <artifactId>${projectName}</artifactId>\n    <version>1.0-SNAPSHOT</version>\n    <properties>\n        <maven.compiler.source>11</maven.compiler.source>\n        <maven.compiler.target>11</maven.compiler.target>\n    </properties>\n</project>" > pom.xml`
      ]
    };

    const commands = setupCommands[projectType] || [];
    return await this.executeMultipleCommands(commands, { stopOnError: true });
  }

  async gitOperations(operation: 'clone' | 'init' | 'add' | 'commit' | 'push' | 'pull' | 'status', params: any = {}): Promise<CommandResult> {
    const gitCommands = {
      clone: `git clone ${params.url} ${params.directory || ''}`,
      init: `git init ${params.directory || '.'}`,
      add: `git add ${params.files || '.'}`,
      commit: `git commit -m "${params.message || 'Auto commit'}"`,
      push: `git push ${params.remote || 'origin'} ${params.branch || 'main'}`,
      pull: `git pull ${params.remote || 'origin'} ${params.branch || 'main'}`,
      status: 'git status'
    };

    const command = gitCommands[operation];
    return await this.executeCommand(command);
  }

  private isDangerousCommand(command: string): boolean {
    const lowerCommand = command.toLowerCase();
    return Array.from(this.dangerousCommands).some(dangerous => 
      lowerCommand.includes(dangerous.toLowerCase())
    );
  }

  private isAllowedCommand(command: string): boolean {
    return this.allowedCommands.has(command) || 
           this.allowedCommands.has(command.split('.')[0]); // For .exe files on Windows
  }

  killProcess(processId: string): boolean {
    const process = this.runningProcesses.get(processId);
    if (process) {
      process.kill('SIGTERM');
      this.runningProcesses.delete(processId);
      return true;
    }
    return false;
  }

  killAllProcesses(): void {
    for (const [id, process] of this.runningProcesses.entries()) {
      process.kill('SIGTERM');
      this.runningProcesses.delete(id);
    }
  }

  getExecutionHistory(): CommandResult[] {
    return this.executionHistory;
  }

  clearHistory(): void {
    this.executionHistory = [];
  }

  setWorkingDirectory(dir: string): void {
    if (fs.existsSync(dir)) {
      this.workingDirectory = dir;
    } else {
      throw new Error(`Directory does not exist: ${dir}`);
    }
  }

  getWorkingDirectory(): string {
    return this.workingDirectory;
  }

  setSafeMode(enabled: boolean): void {
    this.safeMode = enabled;
  }

  isSafeMode(): boolean {
    return this.safeMode;
  }

  getSystemInfo(): any {
    return {
      platform: os.platform(),
      architecture: os.arch(),
      release: os.release(),
      hostname: os.hostname(),
      uptime: os.uptime(),
      memory: {
        total: os.totalmem(),
        free: os.freemem()
      },
      cpus: os.cpus().length,
      workingDirectory: this.workingDirectory,
      safeMode: this.safeMode
    };
  }
}

export const commandExecutor = new CommandExecutor();
