import express from 'express';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import { cyberAssistantAI } from './ai-agent-core';
import { aiProviderManager } from './ai-provider-manager';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function setupAIAgent(app: express.Application, server: any) {
  // Initialize AI provider manager
  await aiProviderManager.initialize();

  // WebSocket server for real-time AI agent communication
  const wss = new WebSocketServer({ server });

  // WebSocket connection handler for AI agent
  wss.on('connection', (ws) => {
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
        console.error('WebSocket message error:', error);
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

  // Handle AI Agent WebSocket messages
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
    
    // Send typing indicator
    ws.send(JSON.stringify({
      type: 'ai_thinking',
      message: 'Processing your request...'
    }));
    
    try {
      // Use AI provider manager to generate response
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
    
    // Create a temporary project context for execution
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
    
    const projectSpec = {
      name,
      type: projectType,
      framework
    };
    
    const project = await cyberAssistantAI.createProject(projectSpec);
    
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
    
    // Create temporary project context if none provided
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

  // API Routes for AI Agent
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

  console.log('🤖 AI Agent system initialized');
  console.log('🎯 AI Agent: http://localhost:5000/ai-agent');
  console.log('💻 Command Assistant: http://localhost:5000/assistant');
}
