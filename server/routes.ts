import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer } from "ws";
import { storage } from "./storage";
import { cyberShellAI, type CommandResponse } from "./cybershell-ai";
import { aiProviderManager } from "./ai-provider-manager";
import { aiAgent, type AgentResponse } from "./ai-agent";

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

  return httpServer;
}
