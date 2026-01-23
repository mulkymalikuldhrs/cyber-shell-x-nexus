import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer } from "ws";
import { cyberShellAI, type CommandResponse } from "./cybershell-ai";
import fs from "fs";
import path from "path";

const historyFilePath = path.join(process.cwd(), "command_history.json");

function appendCommandToHistory(commandData: any) {
  let history: any[] = [];
  if (fs.existsSync(historyFilePath)) {
    const fileContent = fs.readFileSync(historyFilePath, "utf-8");
    history = JSON.parse(fileContent);
  }
  history.push(commandData);
  fs.writeFileSync(historyFilePath, JSON.stringify(history, null, 2));
}

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
      
      // Store command history
      appendCommandToHistory({ command, userId, response, timestamp: new Date() });

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

  // Automation Next Step endpoint
  app.post("/api/automate/next-step", async (req, res) => {
    const { target, objectives, history, notes } = req.body;
    if (!target || !objectives || !history) {
      return res.status(400).json({ error: "Target, objectives, and history are required" });
    }

    try {
      const nextCommand = await cyberShellAI.determineNextCommand(target, objectives, history, notes);
      res.json({ success: true, next_command: nextCommand });
    } catch (error) {
      console.error("Automation next step error:", error);
      res.status(500).json({ error: "Failed to determine next automation step" });
    }
  });

  // Information Extraction endpoint
  app.post("/api/automate/extract-info", async (req, res) => {
    const { command, output } = req.body;
    if (!command || !output) {
      return res.status(400).json({ error: "Command and output are required" });
    }

    try {
      const extractedInfo = await cyberShellAI.extractInfoFromOutput(command, output);
      res.json({ success: true, info: extractedInfo });
    } catch (error) {
      console.error("Information extraction error:", error);
      res.status(500).json({ error: "Failed to extract information" });
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
