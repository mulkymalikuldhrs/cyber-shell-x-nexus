import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer } from "ws";
import { storage } from "./storage";
import { cyberShellAI, type CommandResponse } from "./cybershell-ai";
import { aiProviderManager } from "./ai-provider-manager";
import { aiAgent, type AgentResponse } from "./ai-agent";
import { commandExecutor } from "./command-executor";
import { cyberAssistantAI } from "./ai-agent-core";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function registerRoutes(app: Express): Promise<Server> {
  // CyberShellX AI command processing endpoint
  app.post("/api/command", async (req, res) => {
    try {
      const { command, userId } = req.body;
      
      if (!command) {
        return res.status(400).json({ error: "Command is required" });
      }

      // Process command with AI
      let response: CommandResponse = cyberShellAI.processCommand(command);
      
      // Try to enhance with AI if available
      try {
        response = await cyberShellAI.enhanceResponseWithAI(command, response);
      } catch (error) {
        console.warn('AI enhancement failed, using base response:', error);
      }
      
      // Store command history if user is provided
      if (userId) {
        // TODO: Store in command history table
        console.log(`User ${userId} executed: ${command}`);
      }

      res.json({
        success: true,
        response: response.content,
        type: response.type,
        category: response.category,
        difficulty: response.difficulty,
        tools: response.tools,
        legal_notice: response.legal_notice,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error("Command processing error:", error);
      res.status(500).json({ 
        error: "Failed to process command",
        message: "Please try again or contact support"
      });
    }
  });

  // Get random learning prompt
  app.get("/api/learning-prompt", (req, res) => {
    try {
      const prompt = cyberShellAI.getRandomLearningPrompt();
      res.json({ prompt });
    } catch (error) {
      res.status(500).json({ error: "Failed to get learning prompt" });
    }
  });

  // Get interactive scenario
  app.get("/api/scenario/:difficulty", (req, res) => {
    try {
      const difficulty = req.params.difficulty as 'beginner' | 'intermediate' | 'advanced';
      const scenario = cyberShellAI.getInteractiveScenario(difficulty);
      
      if (!scenario) {
        return res.status(404).json({ error: "No scenario found for difficulty level" });
      }
      
      res.json(scenario);
    } catch (error) {
      res.status(500).json({ error: "Failed to get scenario" });
    }
  });

  // Get ethical guidelines
  app.get("/api/ethics", (req, res) => {
    try {
      const guidelines = cyberShellAI.getEthicalGuidelines();
      res.json({ guidelines });
    } catch (error) {
      res.status(500).json({ error: "Failed to get ethical guidelines" });
    }
  });

  // Enhanced AI Agent endpoints
  app.post("/api/agent/process", async (req, res) => {
    try {
      const { request, mode = 'general' } = req.body;
      
      if (!request) {
        return res.status(400).json({ error: "Request is required" });
      }

      const response: AgentResponse = await aiAgent.processRequest(request, mode);
      res.json(response);
    } catch (error) {
      console.error("Agent processing error:", error);
      res.status(500).json({ 
        error: "Failed to process agent request",
        message: error.message
      });
    }
  });

  // Get AI provider status
  app.get("/api/ai/status", (req, res) => {
    try {
      const status = aiProviderManager.getStatus();
      res.json(status);
    } catch (error) {
      res.status(500).json({ error: "Failed to get AI status" });
    }
  });

  // Get available agent modes
  app.get("/api/agent/modes", (req, res) => {
    try {
      const modes = aiProviderManager.getAvailableModes();
      res.json(modes);
    } catch (error) {
      res.status(500).json({ error: "Failed to get agent modes" });
    }
  });

  // Get agent capabilities
  app.get("/api/agent/capabilities", (req, res) => {
    try {
      const capabilities = aiAgent.getCapabilities();
      res.json(capabilities);
    } catch (error) {
      res.status(500).json({ error: "Failed to get agent capabilities" });
    }
  });

  // Get agent tasks
  app.get("/api/agent/tasks", (req, res) => {
    try {
      const tasks = aiAgent.getTasks();
      res.json(tasks);
    } catch (error) {
      res.status(500).json({ error: "Failed to get agent tasks" });
    }
  });

  // Get specific agent task
  app.get("/api/agent/tasks/:taskId", (req, res) => {
    try {
      const task = aiAgent.getTask(req.params.taskId);
      if (!task) {
        return res.status(404).json({ error: "Task not found" });
      }
      res.json(task);
    } catch (error) {
      res.status(500).json({ error: "Failed to get agent task" });
    }
  });

  // Clear completed tasks
  app.delete("/api/agent/tasks/completed", (req, res) => {
    try {
      aiAgent.clearCompletedTasks();
      res.json({ success: true, message: "Completed tasks cleared" });
    } catch (error) {
      res.status(500).json({ error: "Failed to clear completed tasks" });
    }
  });

  // Reload AI configuration
  app.post("/api/ai/reload", async (req, res) => {
    try {
      await aiProviderManager.reloadConfig();
      res.json({ success: true, message: "AI configuration reloaded" });
    } catch (error) {
      res.status(500).json({ error: "Failed to reload AI configuration" });
    }
  });

  // Add API key
  app.post("/api/ai/keys", async (req, res) => {
    try {
      const { provider, endpoint, apiKey } = req.body;
      
      if (!provider || !endpoint || !apiKey) {
        return res.status(400).json({ error: "Provider, endpoint, and apiKey are required" });
      }

      await aiProviderManager.addApiKey(provider, endpoint, apiKey);
      res.json({ success: true, message: "API key added successfully" });
    } catch (error) {
      res.status(500).json({ error: `Failed to add API key: ${error.message}` });
    }
  });

  // Direct AI generation endpoint
  app.post("/api/ai/generate", async (req, res) => {
    try {
      const { prompt, mode = 'general' } = req.body;
      
      if (!prompt) {
        return res.status(400).json({ error: "Prompt is required" });
      }

      const response = await aiProviderManager.generateContent(prompt, mode);
      res.json({ 
        success: true, 
        response,
        mode,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error("AI generation error:", error);
      res.status(500).json({ 
        error: "Failed to generate AI response",
        message: error.message
      });
    }
  });

  // Enhanced Command Execution endpoints
  app.post("/api/command/execute", async (req, res) => {
    try {
      const { command, options = {} } = req.body;
      
      if (!command) {
        return res.status(400).json({ error: "Command is required" });
      }

      const result = await commandExecutor.executeCommand(command, options);
      res.json({
        success: result.success,
        result,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({ 
        error: "Failed to execute command",
        message: error.message
      });
    }
  });

  // Execute multiple commands
  app.post("/api/command/execute-batch", async (req, res) => {
    try {
      const { commands, options = {} } = req.body;
      
      if (!commands || !Array.isArray(commands)) {
        return res.status(400).json({ error: "Commands array is required" });
      }

      const results = await commandExecutor.executeMultipleCommands(commands, options);
      res.json({
        success: true,
        results,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({ 
        error: "Failed to execute commands",
        message: error.message
      });
    }
  });

  // Tool availability check
  app.get("/api/tools/check", async (req, res) => {
    try {
      const tools = await commandExecutor.checkToolAvailability();
      res.json({
        success: true,
        tools,
        system_info: commandExecutor.getSystemInfo(),
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({ 
        error: "Failed to check tools",
        message: error.message
      });
    }
  });

  // Project setup endpoint
  app.post("/api/project/setup", async (req, res) => {
    try {
      const { projectType, projectName, options = {} } = req.body;
      
      if (!projectType || !projectName) {
        return res.status(400).json({ error: "Project type and name are required" });
      }

      const results = await commandExecutor.setupProject(projectType, projectName);
      res.json({
        success: true,
        results,
        project_name: projectName,
        project_type: projectType,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({ 
        error: "Failed to setup project",
        message: error.message
      });
    }
  });

  // Git operations endpoint
  app.post("/api/git/:operation", async (req, res) => {
    try {
      const { operation } = req.params;
      const params = req.body;

      const result = await commandExecutor.gitOperations(operation as any, params);
      res.json({
        success: result.success,
        result,
        operation,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({ 
        error: `Failed to execute git ${req.params.operation}`,
        message: error.message
      });
    }
  });

  // Dependency installation endpoint
  app.post("/api/dependencies/install", async (req, res) => {
    try {
      const { packageManager, packageName } = req.body;
      
      if (!packageManager || !packageName) {
        return res.status(400).json({ error: "Package manager and package name are required" });
      }

      const result = await commandExecutor.installDependency(packageManager, packageName);
      res.json({
        success: result.success,
        result,
        package: packageName,
        manager: packageManager,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({ 
        error: "Failed to install dependency",
        message: error.message
      });
    }
  });

  // Command history endpoint
  app.get("/api/command/history", (req, res) => {
    try {
      const history = commandExecutor.getExecutionHistory();
      res.json({
        success: true,
        history,
        total: history.length,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({ 
        error: "Failed to get command history",
        message: error.message
      });
    }
  });

  // Working directory management
  app.get("/api/directory/current", (req, res) => {
    try {
      const currentDir = commandExecutor.getWorkingDirectory();
      res.json({
        success: true,
        directory: currentDir,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({ 
        error: "Failed to get working directory",
        message: error.message
      });
    }
  });

  app.post("/api/directory/change", (req, res) => {
    try {
      const { directory } = req.body;
      
      if (!directory) {
        return res.status(400).json({ error: "Directory is required" });
      }

      commandExecutor.setWorkingDirectory(directory);
      res.json({
        success: true,
        directory: commandExecutor.getWorkingDirectory(),
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({ 
        error: "Failed to change directory",
        message: error.message
      });
    }
  });

  // Safe mode toggle
  app.post("/api/command/safe-mode", (req, res) => {
    try {
      const { enabled } = req.body;
      
      commandExecutor.setSafeMode(enabled);
      res.json({
        success: true,
        safe_mode: commandExecutor.isSafeMode(),
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({ 
        error: "Failed to set safe mode",
        message: error.message
      });
    }
  });

  const httpServer = createServer(app);

  // WebSocket server for real-time communication on separate path
  const wss = new WebSocketServer({ 
    server: httpServer, 
    path: '/ws/cybershell'
  });

  wss.on('connection', (ws) => {
    console.log('CyberShellX WebSocket connection established');

    ws.on('message', async (message) => {
      try {
        const data = JSON.parse(message.toString());
        
        if (data.type === 'command') {
          // Process command with AI
          const response = cyberShellAI.processCommand(data.command);
          
          // Send response back to client
          ws.send(JSON.stringify({
            type: 'response',
            command: data.command,
            response: response.content,
            category: response.category,
            difficulty: response.difficulty,
            tools: response.tools,
            legal_notice: response.legal_notice,
            timestamp: new Date().toISOString()
          }));
        } else if (data.type === 'learning') {
          // Send random learning prompt
          const prompt = cyberShellAI.getRandomLearningPrompt();
          ws.send(JSON.stringify({
            type: 'learning_prompt',
            prompt,
            timestamp: new Date().toISOString()
          }));
        }
      } catch (error) {
        console.error('WebSocket message processing error:', error);
        ws.send(JSON.stringify({
          type: 'error',
          message: 'Failed to process message',
          timestamp: new Date().toISOString()
        }));
      }
    });

    ws.on('close', () => {
      console.log('CyberShellX WebSocket connection closed');
    });

    // Send welcome message
    ws.send(JSON.stringify({
      type: 'welcome',
      message: 'Connected to CyberShellX AI. Type commands or ask questions!',
      timestamp: new Date().toISOString()
    }));
  });

  // AI Agent WebSocket handling for advanced coding assistant
  const aiAgentWss = new WebSocketServer({ server: httpServer, path: '/ai-agent-ws' });
  
  aiAgentWss.on('connection', (ws) => {
    console.log('🔗 AI Agent client connected');
    cyberAssistantAI.addConnection(ws);
    
    ws.send(JSON.stringify({
      type: 'welcome',
      message: 'Connected to Cyber Assistant AI Agent',
      capabilities: {
        codeGeneration: true,
        realTimeExecution: true,
        projectScaffolding: true,
        multiLanguageSupport: true,
        debugging: true,
        gitIntegration: true,
        packageManagement: true,
        deployment: true,
        collaboration: true,
        terminalIntegration: true
      }
    }));
    
    ws.on('message', async (data) => {
      try {
        const message = JSON.parse(data.toString());
        await handleAIAgentMessage(ws, message);
      } catch (error) {
        console.error('AI Agent WebSocket message error:', error);
        ws.send(JSON.stringify({
          type: 'error',
          message: 'Invalid message format'
        }));
      }
    });
    
    ws.on('close', () => {
      console.log('🔌 AI Agent client disconnected');
    });
  });

  // AI Agent message handlers
  async function handleAIAgentMessage(ws: any, message: any) {
    const { type, ...data } = message;
    
    try {
      switch (type) {
        case 'ai_request':
          await handleAIRequest(ws, data);
          break;
          
        case 'execute_code':
          await handleCodeExecution(ws, data);
          break;
          
        case 'create_project':
          await handleProjectCreation(ws, data);
          break;
          
        case 'save_file':
          await handleFileSave(ws, data);
          break;
          
        case 'load_project':
          await handleProjectLoad(ws, data);
          break;
          
        case 'generate_code':
          await handleCodeGeneration(ws, data);
          break;
          
        case 'debug_code':
          await handleCodeDebugging(ws, data);
          break;
          
        case 'optimize_code':
          await handleCodeOptimization(ws, data);
          break;
          
        case 'explain_code':
          await handleCodeExplanation(ws, data);
          break;
          
        default:
          ws.send(JSON.stringify({
            type: 'error',
            message: `Unknown message type: ${type}`
          }));
      }
    } catch (error) {
      console.error('AI Agent handler error:', error);
      ws.send(JSON.stringify({
        type: 'error',
        message: error.message
      }));
    }
  }

  async function handleAIRequest(ws: any, data: any) {
    const { message, context } = data;
    
    ws.send(JSON.stringify({
      type: 'ai_thinking',
      message: 'Processing your request...'
    }));
    
    try {
      const response = await aiProviderManager.generateResponse(
        `You are an expert AI coding assistant similar to Manus AI, Replit AI, Bolt AI, and Mentat AI.
        
User request: ${message}

Current context:
- Language: ${context?.language || 'javascript'}
- Current code: ${context?.currentCode || 'none'}
- File: ${context?.file || 'untitled'}

Provide helpful, actionable responses. If the user wants code generation, debugging, or explanation, be specific and comprehensive.`,
        'programming'
      );
      
      ws.send(JSON.stringify({
        type: 'ai_response',
        message: response,
        context: context
      }));
    } catch (error) {
      ws.send(JSON.stringify({
        type: 'ai_response',
        message: 'I apologize, but I encountered an issue processing your request. Please try again or rephrase your question.',
        error: error.message
      }));
    }
  }

  async function handleCodeExecution(ws: any, data: any) {
    const { code, language, filename } = data;
    
    const tempContext = {
      id: 'temp_execution',
      name: 'Temporary Execution',
      type: 'web' as const,
      language: [language],
      dependencies: [],
      files: new Map()
    };
    
    const result = await cyberAssistantAI.executeCode(code, language, tempContext);
    
    ws.send(JSON.stringify({
      type: 'code_executed',
      ...result
    }));
  }

  async function handleProjectCreation(ws: any, data: any) {
    const { name, projectType, framework } = data;
    
    const project = await cyberAssistantAI.createProject({
      name,
      type: projectType,
      framework
    });
    
    ws.send(JSON.stringify({
      type: 'project_created',
      projectId: project.id,
      name: project.name,
      type: project.type,
      framework: project.framework,
      files: Array.from(project.files.keys())
    }));
  }

  async function handleFileSave(ws: any, data: any) {
    const { projectId, filename, content } = data;
    
    const success = await cyberAssistantAI.createFile(projectId, filename, content);
    
    ws.send(JSON.stringify({
      type: 'file_saved',
      success,
      filename,
      projectId
    }));
  }

  async function handleProjectLoad(ws: any, data: any) {
    const { projectId } = data;
    
    const project = cyberAssistantAI.getProject(projectId);
    
    if (project) {
      ws.send(JSON.stringify({
        type: 'project_loaded',
        project: {
          id: project.id,
          name: project.name,
          type: project.type,
          framework: project.framework,
          files: Object.fromEntries(project.files)
        }
      }));
    } else {
      ws.send(JSON.stringify({
        type: 'error',
        message: 'Project not found'
      }));
    }
  }

  async function handleCodeGeneration(ws: any, data: any) {
    const { prompt, context } = data;
    
    const projectContext = context || {
      id: 'temp',
      name: 'Generated Code',
      type: 'web' as const,
      language: ['javascript'],
      dependencies: [],
      files: new Map()
    };
    
    const result = await cyberAssistantAI.generateCode(prompt, projectContext);
    
    ws.send(JSON.stringify({
      type: 'code_generated',
      ...result
    }));
  }

  async function handleCodeDebugging(ws: any, data: any) {
    const { code, error, language } = data;
    
    const result = await cyberAssistantAI.debugCode(code, error, language);
    
    ws.send(JSON.stringify({
      type: 'code_debugged',
      ...result
    }));
  }

  async function handleCodeOptimization(ws: any, data: any) {
    const { code, language } = data;
    
    const result = await cyberAssistantAI.optimizeCode(code, language);
    
    ws.send(JSON.stringify({
      type: 'code_optimized',
      ...result
    }));
  }

  async function handleCodeExplanation(ws: any, data: any) {
    const { code, language } = data;
    
    const result = await cyberAssistantAI.explainCode(code, language);
    
    ws.send(JSON.stringify({
      type: 'code_explained',
      ...result
    }));
  }

  // AI Agent API Routes
  app.get('/api/ai-agent/status', (req, res) => {
    res.json({
      status: 'active',
      providers: aiProviderManager.getProviderStatus(),
      projects: cyberAssistantAI.getAllProjects().length,
      capabilities: {
        codeGeneration: true,
        realTimeExecution: true,
        projectScaffolding: true,
        multiLanguageSupport: true,
        debugging: true,
        gitIntegration: true,
        packageManagement: true,
        deployment: true,
        collaboration: true,
        terminalIntegration: true
      }
    });
  });

  app.get('/api/ai-agent/projects', (req, res) => {
    const projects = cyberAssistantAI.getAllProjects().map(p => ({
      id: p.id,
      name: p.name,
      type: p.type,
      framework: p.framework,
      language: p.language,
      fileCount: p.files.size
    }));
    
    res.json({ projects });
  });

  app.post('/api/ai-agent/quick-generate', async (req, res) => {
    const { prompt, language = 'javascript' } = req.body;
    
    try {
      const tempContext = {
        id: 'quick',
        name: 'Quick Generation',
        type: 'web' as const,
        language: [language],
        dependencies: [],
        files: new Map()
      };
      
      const result = await cyberAssistantAI.generateCode(prompt, tempContext);
      res.json({ success: true, ...result });
    } catch (error) {
      res.json({ success: false, error: error.message });
    }
  });

  // Serve AI Agent interface
  app.get('/ai-agent', (req, res) => {
    res.sendFile(path.join(__dirname, '../web-ui/ai-agent.html'));
  });

  // Serve main Cyber Assistant interface
  app.get('/assistant', (req, res) => {
    res.sendFile(path.join(__dirname, '../web-ui/index.html'));
  });

  // Default route - show interface options
  app.get('/', (req, res) => {
    res.send(`
      <html>
        <head>
          <title>Cyber Assistant</title>
          <style>
            body { font-family: system-ui; max-width: 800px; margin: 50px auto; padding: 20px; background: #0d1117; color: #f0f6fc; }
            .card { background: #161b22; border: 1px solid #30363d; border-radius: 8px; padding: 20px; margin: 20px 0; }
            .btn { display: inline-block; background: #238636; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px; margin: 10px; }
            .btn:hover { background: #2ea043; }
            .btn-secondary { background: #21262d; border: 1px solid #30363d; }
            .btn-secondary:hover { background: #30363d; }
            h1 { color: #58a6ff; }
            h2 { color: #f0f6fc; }
          </style>
        </head>
        <body>
          <h1>🤖 Cyber Assistant</h1>
          <p>Advanced AI Assistant for Android Termux with multiple interfaces</p>
          
          <div class="card">
            <h2>🎯 AI Agent (Coding Assistant)</h2>
            <p>Advanced coding assistant similar to Manus AI, Replit AI, Bolt AI, Mentat AI</p>
            <ul>
              <li>Real-time code generation and execution</li>
              <li>Project scaffolding and management</li>
              <li>Multi-language support (JS, Python, TypeScript, HTML, CSS)</li>
              <li>AI-powered debugging and optimization</li>
              <li>Collaborative coding environment</li>
              <li>Instant code explanation and improvement</li>
            </ul>
            <a href="/ai-agent" class="btn">🚀 Launch AI Agent</a>
          </div>
          
          <div class="card">
            <h2>💻 Command Assistant</h2>
            <p>Natural language command interface for Termux</p>
            <ul>
              <li>Voice and text input</li>
              <li>Real-time command execution</li>
              <li>Auto-fix failed commands</li>
              <li>Activity logging and script saving</li>
              <li>Safety validation and confirmation</li>
            </ul>
            <a href="/assistant" class="btn btn-secondary">🎤 Launch Assistant</a>
          </div>
          
          <div class="card">
            <h2>📊 System Status</h2>
            <p>Monitor AI providers and system health</p>
            <a href="/api/ai-agent/status" class="btn btn-secondary">📈 View Status</a>
            <a href="/api/ai-agent/projects" class="btn btn-secondary">📁 View Projects</a>
            <a href="/api/ai/status" class="btn btn-secondary">🔧 AI Providers</a>
          </div>
          
          <div class="card">
            <h2>🌟 Features</h2>
            <ul>
              <li><strong>Multi-Provider AI:</strong> Groq, OpenRouter, Gemini integration</li>
              <li><strong>Real-time Execution:</strong> Run code instantly with live output</li>
              <li><strong>Project Management:</strong> Create React, Express, Python projects</li>
              <li><strong>Voice Commands:</strong> Natural language to code conversion</li>
              <li><strong>Auto-debugging:</strong> Intelligent error detection and fixing</li>
              <li><strong>Mobile Optimized:</strong> Perfect for Termux Android usage</li>
            </ul>
          </div>
        </body>
      </html>
    `);
  });

  return httpServer;
}
