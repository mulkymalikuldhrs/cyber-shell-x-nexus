import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';
import { aiProviderManager } from './ai-provider-manager';
import { commandExecutor, CommandResult, ToolCapability } from './command-executor';
import { enhancedHandlers } from './enhanced-handlers';

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
  command_outputs?: CommandResult[];
  tools_used?: string[];
  project_structure?: string[];
  execution_plan?: string[];
}

export interface AgentCapabilities {
  programming: boolean;
  file_operations: boolean;
  system_commands: boolean;
  web_requests: boolean;
  code_execution: boolean;
  cybersecurity: boolean;
  tool_integration: boolean;
  project_management: boolean;
  multi_step_automation: boolean;
  natural_language_understanding: boolean;
  smart_command_conversion: boolean;
  dependency_management: boolean;
}

export class AIAgent {
  private tasks: Map<string, AgentTask> = new Map();
  private workingDirectory: string;
  private capabilities: AgentCapabilities;

  constructor(workingDir: string = process.cwd()) {
    this.workingDirectory = workingDir;
    commandExecutor.setWorkingDirectory(workingDir);
    this.capabilities = {
      programming: true,
      file_operations: true,
      system_commands: true,
      web_requests: true,
      code_execution: true,
      cybersecurity: true,
      tool_integration: true,
      project_management: true,
      multi_step_automation: true,
      natural_language_understanding: true,
      smart_command_conversion: true,
      dependency_management: true
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

      // Enhanced AI analysis with command understanding
      const analysisPrompt = `
You are an advanced AI code assistant like Manus AI, Suna AI, capable of understanding natural language and converting it to executable actions.

User Request: "${userInput}"
Mode: ${mode}
Working Directory: ${this.workingDirectory}

Analyze this request and provide a comprehensive JSON response with:
{
  "action_type": "programming|project_setup|tool_execution|multi_step_automation|analysis|file_operation|system_command|git_operation|dependency_management",
  "intent": "Brief description of user intent",
  "complexity": "simple|moderate|complex",
  "requires_confirmation": true/false,
  "execution_plan": ["Step 1: ...", "Step 2: ...", "Step 3: ..."],
  "commands": [
    {
      "command": "actual command to run",
      "description": "what this command does",
      "type": "shell|git|npm|pip|docker|etc",
      "safe": true/false,
      "order": 1
    }
  ],
  "files_to_create": [
    {
      "path": "file/path.ext",
      "content": "file content or template",
      "language": "programming language"
    }
  ],
  "files_to_modify": ["path1", "path2"],
  "dependencies": [
    {
      "package": "package-name",
      "manager": "npm|pip|composer|gem|go",
      "version": "optional version"
    }
  ],
  "tools_needed": ["git", "node", "python", "docker"],
  "expected_output": "description of expected result",
  "risks": ["potential risk 1", "potential risk 2"],
  "language": "primary programming language",
  "framework": "framework if applicable",
  "project_type": "web|api|cli|mobile|desktop|library",
  "explanation": "Detailed explanation of the complete solution"
}

Be specific and actionable. Think like a senior developer who can handle any programming task.
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
        // Enhanced fallback analysis
        analysis = await this.enhancedFallbackAnalysis(userInput, mode);
      }

      // Execute the planned actions with enhanced capabilities
      const result = await this.executeEnhancedActions(analysis, userInput, mode);
      
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
        command_outputs: result.command_outputs,
        tools_used: result.tools_used,
        project_structure: result.project_structure,
        execution_plan: result.execution_plan,
        tasks_completed: [task]
      };

    } catch (error) {
      return {
        success: false,
        message: `Error processing request: ${error.message}`,
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

  private async enhancedFallbackAnalysis(input: string, mode: string): Promise<any> {
    const lowerInput = input.toLowerCase();
    const detectedLanguage = this.detectLanguage(input);
    const projectType = this.detectProjectType(input);
    
    // Check available tools
    const toolsAvailable = await commandExecutor.checkToolAvailability();
    
    let analysis: any = {
      action_type: this.determineTaskType(input),
      intent: `User wants to: ${input}`,
      complexity: this.assessComplexity(input),
      requires_confirmation: this.requiresConfirmation(input),
      execution_plan: [],
      commands: [],
      files_to_create: [],
      files_to_modify: [],
      dependencies: [],
      tools_needed: [],
      expected_output: 'Generated solution based on user request',
      risks: [],
      language: detectedLanguage,
      framework: this.detectFramework(input),
      project_type: projectType,
      explanation: 'Enhanced fallback analysis'
    };

    // Enhanced analysis based on keywords
    if (lowerInput.includes('create') && (lowerInput.includes('app') || lowerInput.includes('project'))) {
      analysis.action_type = 'project_setup';
      analysis.execution_plan = [
        `Create new ${projectType} project`,
        'Set up project structure',
        'Install dependencies',
        'Create initial files'
      ];
      analysis.tools_needed = this.getToolsForProject(projectType);
    } else if (lowerInput.includes('install') || lowerInput.includes('add package')) {
      analysis.action_type = 'dependency_management';
      analysis.execution_plan = ['Identify package manager', 'Install dependencies'];
    } else if (lowerInput.includes('git') || lowerInput.includes('commit') || lowerInput.includes('push')) {
      analysis.action_type = 'git_operation';
      analysis.tools_needed = ['git'];
    } else if (lowerInput.includes('run') || lowerInput.includes('execute')) {
      analysis.action_type = 'tool_execution';
      analysis.execution_plan = ['Parse command', 'Execute safely', 'Return output'];
    }

    return analysis;
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

  private detectProjectType(input: string): string {
    const lowerInput = input.toLowerCase();
    
    if (lowerInput.includes('web app') || lowerInput.includes('website')) return 'web';
    if (lowerInput.includes('api') || lowerInput.includes('rest') || lowerInput.includes('graphql')) return 'api';
    if (lowerInput.includes('cli') || lowerInput.includes('command line')) return 'cli';
    if (lowerInput.includes('mobile') || lowerInput.includes('android') || lowerInput.includes('ios')) return 'mobile';
    if (lowerInput.includes('desktop') || lowerInput.includes('electron')) return 'desktop';
    if (lowerInput.includes('library') || lowerInput.includes('package')) return 'library';
    if (lowerInput.includes('bot') || lowerInput.includes('telegram') || lowerInput.includes('discord')) return 'bot';
    if (lowerInput.includes('scraper') || lowerInput.includes('crawler')) return 'scraper';
    if (lowerInput.includes('game')) return 'game';
    
    return 'general';
  }

  private detectFramework(input: string): string {
    const lowerInput = input.toLowerCase();
    
    if (lowerInput.includes('react')) return 'react';
    if (lowerInput.includes('vue')) return 'vue';
    if (lowerInput.includes('angular')) return 'angular';
    if (lowerInput.includes('svelte')) return 'svelte';
    if (lowerInput.includes('express')) return 'express';
    if (lowerInput.includes('fastapi')) return 'fastapi';
    if (lowerInput.includes('django')) return 'django';
    if (lowerInput.includes('flask')) return 'flask';
    if (lowerInput.includes('laravel')) return 'laravel';
    if (lowerInput.includes('rails')) return 'rails';
    if (lowerInput.includes('spring')) return 'spring';
    if (lowerInput.includes('gin')) return 'gin';
    if (lowerInput.includes('fiber')) return 'fiber';
    
    return '';
  }

  private assessComplexity(input: string): string {
    const lowerInput = input.toLowerCase();
    
    // Complex indicators
    if (lowerInput.includes('microservice') || lowerInput.includes('distributed') || 
        lowerInput.includes('scalable') || lowerInput.includes('production') ||
        lowerInput.includes('docker') || lowerInput.includes('kubernetes')) {
      return 'complex';
    }
    
    // Moderate indicators
    if (lowerInput.includes('database') || lowerInput.includes('auth') || 
        lowerInput.includes('api') || lowerInput.includes('framework') ||
        lowerInput.includes('full stack')) {
      return 'moderate';
    }
    
    return 'simple';
  }

  private requiresConfirmation(input: string): boolean {
    const lowerInput = input.toLowerCase();
    
    return lowerInput.includes('delete') || lowerInput.includes('remove') || 
           lowerInput.includes('drop') || lowerInput.includes('destroy') ||
           lowerInput.includes('format') || lowerInput.includes('reset') ||
           lowerInput.includes('production') || lowerInput.includes('deploy');
  }

  private getToolsForProject(projectType: string): string[] {
    const toolMap: Record<string, string[]> = {
      web: ['node', 'npm', 'git'],
      api: ['node', 'npm', 'git', 'docker'],
      mobile: ['node', 'npm', 'git', 'android-sdk'],
      cli: ['node', 'npm', 'git'],
      desktop: ['node', 'npm', 'git', 'electron'],
      library: ['node', 'npm', 'git'],
      bot: ['node', 'npm', 'git'],
      scraper: ['python', 'pip', 'git'],
      game: ['node', 'npm', 'git'],
      general: ['git']
    };
    
    return toolMap[projectType] || ['git'];
  }

  private async executeEnhancedActions(analysis: any, originalRequest: string, mode: string): Promise<any> {
    const results: any = {
      message: '',
      data: null,
      files_created: [],
      files_modified: [],
      commands_executed: [],
      command_outputs: [],
      tools_used: [],
      project_structure: [],
      execution_plan: analysis.execution_plan || []
    };

    try {
      // Pre-execution validation
      if (analysis.requires_confirmation && analysis.risks && analysis.risks.length > 0) {
        results.message = `⚠️ This operation requires confirmation. Risks: ${analysis.risks.join(', ')}`;
        return results;
      }

      // Check required tools
      if (analysis.tools_needed && analysis.tools_needed.length > 0) {
        const toolsStatus = await commandExecutor.checkToolAvailability();
        const missingTools = analysis.tools_needed.filter(tool => !toolsStatus[tool]?.available);
        
        if (missingTools.length > 0) {
          results.message = `❌ Missing required tools: ${missingTools.join(', ')}. Please install them first.`;
          return results;
        }
        
        results.tools_used = analysis.tools_needed;
      }

      // Execute based on action type
      switch (analysis.action_type) {
        case 'programming':
          return await enhancedHandlers.handleEnhancedProgramming(originalRequest, analysis, mode);
        
        case 'project_setup':
          return await enhancedHandlers.handleProjectSetup(analysis, mode);
        
        case 'tool_execution':
          return await enhancedHandlers.handleToolExecution(analysis, mode);
        
        case 'multi_step_automation':
          return await enhancedHandlers.handleMultiStepAutomation(analysis, mode);
        
        case 'git_operation':
          return await enhancedHandlers.handleGitOperation(analysis, mode);
        
        case 'dependency_management':
          return await enhancedHandlers.handleDependencyManagement(analysis, mode);
        
        case 'file_operation':
          return await this.handleFileOperation(originalRequest, analysis, mode);
        
        case 'system_command':
          return await this.handleSystemCommand(originalRequest, analysis, mode);
        
        case 'cybersecurity':
          return await this.handleCybersecurity(originalRequest, mode);
        
        default:
          return await this.handleAnalysis(originalRequest, mode);
      }
    } catch (error) {
      throw new Error(`Enhanced action execution failed: ${error.message}`);
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
