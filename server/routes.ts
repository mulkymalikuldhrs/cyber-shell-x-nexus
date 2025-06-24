import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer } from "ws";
import { storage } from "./storage";
import { cyberShellAI, type CommandResponse } from "./cybershell-ai";

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
