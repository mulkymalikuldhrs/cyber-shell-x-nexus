import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, type WebSocket } from "ws";
import { storage } from "./storage";
import { cyberShellAI, type CommandResponse } from "./cybershell-ai";

// ── Input validation ─────────────────────────────────────────────────────────

const MAX_COMMAND_LENGTH = 2000;
const VALID_DIFFICULTIES = new Set(['beginner', 'intermediate', 'advanced']);

interface CommandBody {
  command?: unknown;
  userId?: unknown;
}

function validateCommandBody(body: unknown): { command: string; userId?: string } | { error: string } {
  if (!body || typeof body !== 'object') {
    return { error: 'Request body must be a JSON object' };
  }

  const { command, userId } = body as CommandBody;

  if (command === undefined || command === null) {
    return { error: 'Command is required' };
  }

  if (typeof command !== 'string') {
    return { error: 'Command must be a string' };
  }

  const trimmed = command.trim();
  if (trimmed.length === 0) {
    return { error: 'Command cannot be empty' };
  }

  if (trimmed.length > MAX_COMMAND_LENGTH) {
    return { error: `Command too long (max ${MAX_COMMAND_LENGTH} characters)` };
  }

  if (userId !== undefined && typeof userId !== 'string') {
    return { error: 'userId must be a string if provided' };
  }

  return { command: trimmed, userId: typeof userId === 'string' ? userId : undefined };
}

// ── Simple rate limiter with periodic cleanup ───────────────────────────────────

const requestCounts = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW = 60_000; // 1 minute
const RATE_LIMIT_MAX = 60; // requests per window
const RATE_LIMIT_CLEANUP_INTERVAL = 5 * 60_000; // Cleanup every 5 minutes

// Periodic cleanup to prevent memory leaks
setInterval(() => {
  const now = Date.now();
  for (const [ip, entry] of requestCounts) {
    if (now > entry.resetAt) {
      requestCounts.delete(ip);
    }
  }
}, RATE_LIMIT_CLEANUP_INTERVAL);

function rateLimiter(req: Request, res: Response, next: NextFunction): void {
  const ip = req.ip ?? req.socket.remoteAddress ?? 'unknown';
  const now = Date.now();
  const entry = requestCounts.get(ip);

  if (!entry || now > entry.resetAt) {
    requestCounts.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
    next();
    return;
  }

  entry.count++;
  if (entry.count > RATE_LIMIT_MAX) {
    res.status(429).json({ error: 'Too many requests. Please try again later.' });
    return;
  }

  next();
}

// ── Routes ───────────────────────────────────────────────────────────────────

export async function registerRoutes(app: Express): Promise<Server> {
  // Apply rate limiting to all API routes
  app.use('/api', rateLimiter);

  // CyberShellX AI command processing endpoint
  app.post("/api/command", async (req, res) => {
    try {
      const validated = validateCommandBody(req.body);
      if ('error' in validated) {
        return res.status(400).json({ error: validated.error });
      }

      const { command, userId } = validated;

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
        try {
          console.log(`User ${userId} executed: ${command.substring(0, 100)}`);
        } catch {
          // Logging failure should not affect the response
        }
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
  app.get("/api/learning-prompt", (_req, res) => {
    try {
      const prompt = cyberShellAI.getRandomLearningPrompt();
      res.json({ prompt });
    } catch (error) {
      console.error("Learning prompt error:", error);
      res.status(500).json({ error: "Failed to get learning prompt" });
    }
  });

  // Get interactive scenario
  app.get("/api/scenario/:difficulty", (req, res) => {
    try {
      const { difficulty } = req.params;
      if (!VALID_DIFFICULTIES.has(difficulty)) {
        return res.status(400).json({ 
          error: `Invalid difficulty. Must be one of: ${[...VALID_DIFFICULTIES].join(', ')}` 
        });
      }

      const scenario = cyberShellAI.getInteractiveScenario(difficulty as 'beginner' | 'intermediate' | 'advanced');
      
      if (!scenario) {
        return res.status(404).json({ error: "No scenario found for difficulty level" });
      }
      
      res.json(scenario);
    } catch (error) {
      console.error("Scenario error:", error);
      res.status(500).json({ error: "Failed to get scenario" });
    }
  });

  // Get ethical guidelines
  app.get("/api/ethics", (_req, res) => {
    try {
      const guidelines = cyberShellAI.getEthicalGuidelines();
      res.json({ guidelines });
    } catch (error) {
      console.error("Ethics error:", error);
      res.status(500).json({ error: "Failed to get ethical guidelines" });
    }
  });

  // Get AI status
  app.get("/api/ai/status", (_req, res) => {
    try {
      const status = cyberShellAI.getAIStatus();
      res.json(status);
    } catch (error) {
      console.error("AI status error:", error);
      res.status(500).json({ error: "Failed to get AI status" });
    }
  });

  const httpServer = createServer(app);

  // WebSocket server for real-time communication on separate path
  const wss = new WebSocketServer({ 
    server: httpServer, 
    path: '/ws/cybershell'
  });

  wss.on('connection', (ws: WebSocket, req) => {
    const clientIp = req.socket.remoteAddress ?? 'unknown';
    console.log(`CyberShellX WebSocket connection established from ${clientIp}`);

    // TODO: Add authentication token validation here when auth system is integrated
    // Expected: const token = req.headers['sec-websocket-protocol'];
    //           if (!validateToken(token)) { ws.close(4001, 'Unauthorized'); return; }

    ws.on('message', async (message) => {
      try {
        const data = JSON.parse(message.toString());
        
        if (data.type === 'command' || data.type === 'chat') {
          const command = String(data.command ?? '').trim();
          if (!command || command.length > MAX_COMMAND_LENGTH) {
            ws.send(JSON.stringify({
              type: 'error',
              message: 'Invalid command',
              timestamp: new Date().toISOString()
            }));
            return;
          }

          let response = cyberShellAI.processCommand(command);
          
          // Try AI enhancement (non-blocking)
          try {
            response = await cyberShellAI.enhanceResponseWithAI(command, response);
          } catch {
            // Fall back to base response if AI enhancement fails
          }
          
          ws.send(JSON.stringify({
            type: 'chat_response',
            message: response.content,
            command,
            category: response.category,
            difficulty: response.difficulty,
            tools: response.tools,
            legal_notice: response.legal_notice,
            timestamp: new Date().toISOString()
          }));
        } else if (data.type === 'learning') {
          const prompt = cyberShellAI.getRandomLearningPrompt();
          ws.send(JSON.stringify({
            type: 'learning_prompt',
            prompt,
            timestamp: new Date().toISOString()
          }));
        } else if (data.type === 'install') {
          // Tool installation is simulated for educational purposes
          ws.send(JSON.stringify({
            type: 'install_result',
            success: true,
            message: `Tool '${data.tool}' installation simulated. In a real environment, use your system package manager.`,
            timestamp: new Date().toISOString()
          }));
        } else if (data.type === 'get_tools') {
          ws.send(JSON.stringify({
            type: 'tools_list',
            tools: ['nmap', 'wireshark', 'metasploit', 'sqlmap', 'burpsuite', 'hashcat', 'aircrack-ng', 'nikto', 'john'],
            timestamp: new Date().toISOString()
          }));
        } else if (data.type === 'execute') {
          ws.send(JSON.stringify({
            type: 'error',
            message: 'Direct command execution is disabled for security. Use AI-powered command explanations instead.',
            timestamp: new Date().toISOString()
          }));
        } else {
          ws.send(JSON.stringify({
            type: 'error',
            message: `Unknown command type: ${data.type}`,
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

    ws.on('error', (error) => {
      console.error('WebSocket error:', error);
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
