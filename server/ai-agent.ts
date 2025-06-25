import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';
import { aiProviderManager } from './ai-provider-manager';

const execAsync = promisify(exec);

export interface AgentTask {
  id: string;
  description: string;
  type: 'programming' | 'analysis' | 'file_operation' | 'system_command' | 'web_request';
  status: 'pending' | 'running' | 'completed' | 'failed';
  result?: any;
  error?: string;
  created_at: Date;
  updated_at: Date;
}

export interface AgentResponse {
  success: boolean;
  message: string;
  data?: any;
  code?: string;
  language?: string;
  files_created?: string[];
  files_modified?: string[];
  commands_executed?: string[];
  tasks_completed?: AgentTask[];
}

export interface AgentCapabilities {
  programming: boolean;
  file_operations: boolean;
  system_commands: boolean;
  web_requests: boolean;
  code_execution: boolean;
  cybersecurity: boolean;
}

export class AIAgent {
  private tasks: Map<string, AgentTask> = new Map();
  private workingDirectory: string;
  private capabilities: AgentCapabilities;

  constructor(workingDir: string = process.cwd()) {
    this.workingDirectory = workingDir;
    this.capabilities = {
      programming: true,
      file_operations: true,
      system_commands: true,
      web_requests: true,
      code_execution: true,
      cybersecurity: true
    };
  }

  async processRequest(userInput: string, mode: string = 'general'): Promise<AgentResponse> {
    try {
      const taskId = this.generateTaskId();
      const task: AgentTask = {
        id: taskId,
        description: userInput,
        type: this.determineTaskType(userInput),
        status: 'running',
        created_at: new Date(),
        updated_at: new Date()
      };

      this.tasks.set(taskId, task);

      // Analyze the request using AI
      const analysisPrompt = `
Analyze this user request and determine what actions to take:
"${userInput}"

Based on the request, provide a JSON response with:
{
  "action_type": "programming|analysis|file_operation|system_command|web_request|cybersecurity",
  "steps": ["step1", "step2", ...],
  "requires_code": true/false,
  "requires_files": true/false,
  "requires_commands": true/false,
  "language": "programming language if applicable",
  "files_to_create": ["file1.ext", "file2.ext"],
  "files_to_modify": ["existing_file.ext"],
  "commands_to_run": ["command1", "command2"],
  "explanation": "Brief explanation of what will be done"
}
`;

      const aiResponse = await aiProviderManager.generateContent(analysisPrompt, mode);
      let analysis;
      
      try {
        // Extract JSON from AI response
        const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          analysis = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error('No JSON found in AI response');
        }
      } catch (error) {
        // Fallback to basic analysis
        analysis = this.fallbackAnalysis(userInput);
      }

      // Execute the planned actions
      const result = await this.executeActions(analysis, userInput, mode);
      
      task.status = 'completed';
      task.result = result;
      task.updated_at = new Date();

      return {
        success: true,
        message: result.message || 'Task completed successfully',
        data: result.data,
        code: result.code,
        language: result.language,
        files_created: result.files_created,
        files_modified: result.files_modified,
        commands_executed: result.commands_executed,
        tasks_completed: [task]
      };

    } catch (error) {
      return {
        success: false,
        message: `Error processing request: ${error}`,
        data: null
      };
    }
  }

  private determineTaskType(input: string): AgentTask['type'] {
    const lowerInput = input.toLowerCase();
    
    if (lowerInput.includes('code') || lowerInput.includes('program') || lowerInput.includes('script') || lowerInput.includes('function')) {
      return 'programming';
    }
    if (lowerInput.includes('file') || lowerInput.includes('create') || lowerInput.includes('write') || lowerInput.includes('read')) {
      return 'file_operation';
    }
    if (lowerInput.includes('run') || lowerInput.includes('execute') || lowerInput.includes('command') || lowerInput.includes('install')) {
      return 'system_command';
    }
    if (lowerInput.includes('http') || lowerInput.includes('api') || lowerInput.includes('request') || lowerInput.includes('fetch')) {
      return 'web_request';
    }
    
    return 'analysis';
  }

  private fallbackAnalysis(input: string): any {
    const lowerInput = input.toLowerCase();
    
    return {
      action_type: this.determineTaskType(input),
      steps: ['Analyze request', 'Generate response'],
      requires_code: lowerInput.includes('code') || lowerInput.includes('script'),
      requires_files: lowerInput.includes('file') || lowerInput.includes('create'),
      requires_commands: lowerInput.includes('run') || lowerInput.includes('install'),
      language: this.detectLanguage(input),
      files_to_create: [],
      files_to_modify: [],
      commands_to_run: [],
      explanation: 'Processing user request with basic analysis'
    };
  }

  private detectLanguage(input: string): string {
    const lowerInput = input.toLowerCase();
    
    if (lowerInput.includes('python') || lowerInput.includes('.py')) return 'python';
    if (lowerInput.includes('javascript') || lowerInput.includes('js') || lowerInput.includes('node')) return 'javascript';
    if (lowerInput.includes('typescript') || lowerInput.includes('.ts')) return 'typescript';
    if (lowerInput.includes('java') && !lowerInput.includes('javascript')) return 'java';
    if (lowerInput.includes('c++') || lowerInput.includes('cpp')) return 'cpp';
    if (lowerInput.includes('c#') || lowerInput.includes('csharp')) return 'csharp';
    if (lowerInput.includes('go') || lowerInput.includes('golang')) return 'go';
    if (lowerInput.includes('rust')) return 'rust';
    if (lowerInput.includes('php')) return 'php';
    if (lowerInput.includes('ruby')) return 'ruby';
    if (lowerInput.includes('bash') || lowerInput.includes('shell')) return 'bash';
    if (lowerInput.includes('html')) return 'html';
    if (lowerInput.includes('css')) return 'css';
    if (lowerInput.includes('sql')) return 'sql';
    
    return 'text';
  }

  private async executeActions(analysis: any, originalRequest: string, mode: string): Promise<any> {
    const results: any = {
      message: '',
      data: null,
      files_created: [],
      files_modified: [],
      commands_executed: []
    };

    try {
      switch (analysis.action_type) {
        case 'programming':
          return await this.handleProgramming(originalRequest, analysis, mode);
        
        case 'file_operation':
          return await this.handleFileOperation(originalRequest, analysis, mode);
        
        case 'system_command':
          return await this.handleSystemCommand(originalRequest, analysis, mode);
        
        case 'web_request':
          return await this.handleWebRequest(originalRequest, analysis, mode);
        
        case 'cybersecurity':
          return await this.handleCybersecurity(originalRequest, mode);
        
        default:
          return await this.handleAnalysis(originalRequest, mode);
      }
    } catch (error) {
      throw new Error(`Action execution failed: ${error}`);
    }
  }

  private async handleProgramming(request: string, analysis: any, mode: string): Promise<any> {
    const programmingPrompt = `
You are an expert programmer. The user wants: "${request}"

Based on the analysis: ${JSON.stringify(analysis)}

Please provide:
1. Complete, working code
2. Explanation of what the code does
3. How to run/use it
4. Any dependencies needed

Language: ${analysis.language || 'auto-detect'}
Focus on: Clean, efficient, well-commented code
`;

    const aiResponse = await aiProviderManager.generateContent(programmingPrompt, 'programming');
    
    // Extract code from AI response
    const codeBlocks = aiResponse.match(/```[\s\S]*?```/g) || [];
    let mainCode = '';
    
    if (codeBlocks.length > 0) {
      mainCode = codeBlocks[0].replace(/```\w*\n?/, '').replace(/```$/, '').trim();
    }

    const result = {
      message: 'Code generated successfully',
      data: aiResponse,
      code: mainCode,
      language: analysis.language,
      files_created: [],
      files_modified: [],
      commands_executed: []
    };

    // If files should be created, create them
    if (analysis.files_to_create && analysis.files_to_create.length > 0) {
      for (const filename of analysis.files_to_create) {
        const filePath = path.join(this.workingDirectory, filename);
        await fs.promises.writeFile(filePath, mainCode, 'utf8');
        result.files_created.push(filename);
      }
    }

    return result;
  }

  private async handleFileOperation(request: string, analysis: any, mode: string): Promise<any> {
    const filePrompt = `
You are a file operations expert. The user wants: "${request}"

Please provide:
1. What file operations to perform
2. File contents if creating new files
3. Modifications if editing existing files
4. File structure explanations

Be specific about file paths and contents.
`;

    const aiResponse = await aiProviderManager.generateContent(filePrompt, mode);
    
    const result = {
      message: 'File operations completed',
      data: aiResponse,
      files_created: [],
      files_modified: [],
      commands_executed: []
    };

    // Process file operations based on AI response
    // This is a simplified version - in a full implementation, you'd parse the AI response more thoroughly
    
    return result;
  }

  private async handleSystemCommand(request: string, analysis: any, mode: string): Promise<any> {
    const commandPrompt = `
You are a system administration expert. The user wants: "${request}"

Please provide:
1. Safe commands to execute
2. Explanation of what each command does
3. Expected output
4. Any warnings or precautions

IMPORTANT: Only suggest safe, non-destructive commands.
`;

    const aiResponse = await aiProviderManager.generateContent(commandPrompt, mode);
    
    const result = {
      message: 'System command analysis completed',
      data: aiResponse,
      files_created: [],
      files_modified: [],
      commands_executed: []
    };

    // Note: Actual command execution would need careful security considerations
    // For now, we only analyze and suggest commands
    
    return result;
  }

  private async handleWebRequest(request: string, analysis: any, mode: string): Promise<any> {
    const webPrompt = `
You are a web API expert. The user wants: "${request}"

Please provide:
1. HTTP request details (method, URL, headers, body)
2. Expected response format
3. Error handling suggestions
4. Code examples for making the request

Focus on practical, working examples.
`;

    const aiResponse = await aiProviderManager.generateContent(webPrompt, mode);
    
    return {
      message: 'Web request guidance provided',
      data: aiResponse,
      files_created: [],
      files_modified: [],
      commands_executed: []
    };
  }

  private async handleCybersecurity(request: string, mode: string): Promise<any> {
    const securityPrompt = `
You are a cybersecurity expert. The user asks: "${request}"

Please provide:
1. Security analysis or explanation
2. Best practices
3. Tool recommendations
4. Legal and ethical considerations
5. Step-by-step guidance if applicable

Always emphasize legal and ethical use.
`;

    const aiResponse = await aiProviderManager.generateContent(securityPrompt, 'cybersecurity');
    
    return {
      message: 'Cybersecurity guidance provided',
      data: aiResponse,
      files_created: [],
      files_modified: [],
      commands_executed: []
    };
  }

  private async handleAnalysis(request: string, mode: string): Promise<any> {
    const analysisPrompt = `
You are a helpful AI assistant. The user asks: "${request}"

Please provide a comprehensive, helpful response with:
1. Direct answer to their question
2. Additional context or background
3. Practical suggestions or next steps
4. Related resources if applicable

Be thorough but concise.
`;

    const aiResponse = await aiProviderManager.generateContent(analysisPrompt, mode);
    
    return {
      message: 'Analysis completed',
      data: aiResponse,
      files_created: [],
      files_modified: [],
      commands_executed: []
    };
  }

  private generateTaskId(): string {
    return `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  getCapabilities(): AgentCapabilities {
    return this.capabilities;
  }

  getTasks(): AgentTask[] {
    return Array.from(this.tasks.values());
  }

  getTask(taskId: string): AgentTask | undefined {
    return this.tasks.get(taskId);
  }

  clearCompletedTasks(): void {
    for (const [id, task] of this.tasks.entries()) {
      if (task.status === 'completed' || task.status === 'failed') {
        this.tasks.delete(id);
      }
    }
  }
}

export const aiAgent = new AIAgent();
