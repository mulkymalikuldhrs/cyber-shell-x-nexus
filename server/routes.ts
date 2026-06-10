import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, type WebSocket } from "ws";
import { storage } from "./storage";
import { cyberShellAI, type CommandResponse } from "./cybershell-ai";
import { llmRegistry, generateWithLLM } from "./llm-providers";
import { orchestrator } from "./agents";
import { vulnerabilityScanner } from "./scanner";
import { reconEngine } from "./recon";
import { toolExecutor, TOOL_REGISTRY } from "./tools";
import { riskEngine, calculateCVSS } from "./risk";
import { safetyPipeline } from "./safety";
import { authService, generateToken, verifyToken, type JWTPayload } from "./auth";
import { notificationManager } from "./notifications";
import type { VulnType, ScanType } from "@shared/schema";
import { scanConfigSchema } from "@shared/schema";

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
const RATE_LIMIT_WINDOW = 60_000;
const RATE_LIMIT_MAX = 60;
const RATE_LIMIT_CLEANUP_INTERVAL = 5 * 60_000;

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

// ── Auth Middleware ────────────────────────────────────────────────────────────

function authMiddleware(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Authentication required' });
    return;
  }

  const token = authHeader.substring(7);
  const payload = verifyToken(token);
  if (!payload) {
    res.status(401).json({ error: 'Invalid or expired token' });
    return;
  }

  (req as any).user = payload;
  next();
}

// ── Scan storage (in-memory for demo) ─────────────────────────────────────────

const scanStore = new Map<string, any>();

// ── Routes ───────────────────────────────────────────────────────────────────

export async function registerRoutes(app: Express): Promise<Server> {
  app.use('/api', rateLimiter);

  // ═══════════════════════════════════════════════════════════════════════════
  // AUTH ROUTES
  // ═══════════════════════════════════════════════════════════════════════════

  app.post("/api/auth/register", async (req, res) => {
    try {
      const { username, password, email } = req.body;
      if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
      }
      if (password.length < 8) {
        return res.status(400).json({ error: 'Password must be at least 8 characters' });
      }

      const result = await authService.register(username, password, email || undefined);
      res.json({
        user: { id: result.user.id, username: result.user.username, role: result.user.role },
        token: result.token,
      });
    } catch (error) {
      const message = (error as Error).message || 'Registration failed';
      console.error('[Auth] Register error:', message);
      res.status(400).json({ error: message });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
      }

      const result = await authService.login(username, password);
      res.json({
        user: { id: result.user.id, username: result.user.username, role: result.user.role },
        token: result.token,
      });
    } catch (error) {
      const message = (error as Error).message || 'Login failed';
      console.error('[Auth] Login error:', message);
      res.status(401).json({ error: message });
    }
  });

  app.get("/api/auth/session", authMiddleware, async (req, res) => {
    try {
      const payload = (req as any).user as JWTPayload;
      const user = await storage.getUser(payload.userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json({ user: { id: user.id, username: user.username, role: user.role, email: user.email } });
    } catch (error) {
      res.status(500).json({ error: 'Session validation failed' });
    }
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // COMMAND & AI ROUTES (existing)
  // ═══════════════════════════════════════════════════════════════════════════

  app.post("/api/command", async (req, res) => {
    try {
      const validated = validateCommandBody(req.body);
      if ('error' in validated) {
        return res.status(400).json({ error: validated.error });
      }

      const { command, userId } = validated;

      let response: CommandResponse = cyberShellAI.processCommand(command);
      
      try {
        response = await cyberShellAI.enhanceResponseWithAI(command, response);
      } catch (error) {
        console.warn('AI enhancement failed, using base response:', error);
      }
      
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

  app.get("/api/learning-prompt", (_req, res) => {
    try {
      const prompt = cyberShellAI.getRandomLearningPrompt();
      res.json({ prompt });
    } catch (error) {
      console.error("Learning prompt error:", error);
      res.status(500).json({ error: "Failed to get learning prompt" });
    }
  });

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

  app.get("/api/ethics", (_req, res) => {
    try {
      const guidelines = cyberShellAI.getEthicalGuidelines();
      res.json({ guidelines });
    } catch (error) {
      console.error("Ethics error:", error);
      res.status(500).json({ error: "Failed to get ethical guidelines" });
    }
  });

  app.get("/api/ai/status", (_req, res) => {
    try {
      const status = cyberShellAI.getAIStatus();
      const providers = llmRegistry.getProviders();
      res.json({ ...status, providers, cacheSize: llmRegistry.getCacheSize() });
    } catch (error) {
      console.error("AI status error:", error);
      res.status(500).json({ error: "Failed to get AI status" });
    }
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // LLM PROVIDER ROUTES
  // ═══════════════════════════════════════════════════════════════════════════

  app.get("/api/llm/providers", (_req, res) => {
    try {
      const providers = llmRegistry.getProviders();
      res.json({ providers });
    } catch (error) {
      res.status(500).json({ error: "Failed to get LLM providers" });
    }
  });

  app.post("/api/llm/generate", async (req, res) => {
    try {
      const { prompt, systemPrompt, options } = req.body;
      if (!prompt) {
        return res.status(400).json({ error: 'Prompt is required' });
      }

      // Safety check
      const safetyResult = await safetyPipeline.check(prompt, { type: 'general' });
      if (!safetyResult.passed) {
        return res.status(403).json({ error: 'Input failed safety checks', details: safetyResult.results.filter(r => !r.passed) });
      }

      const response = await generateWithLLM(prompt, systemPrompt, options);
      const filtered = safetyPipeline.filterOutput(response);
      
      res.json({ response: filtered, legalNotice: safetyResult.legalNotice });
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // SCAN ROUTES
  // ═══════════════════════════════════════════════════════════════════════════

  app.post("/api/scan/start", async (req, res) => {
    try {
      const { target, type, name, vulnTypes, agentMode } = req.body;
      if (!target || !type) {
        return res.status(400).json({ error: 'Target and scan type are required' });
      }

      // Safety check on target
      const safetyResult = await safetyPipeline.check(target, { type: 'scan', target });
      if (!safetyResult.passed) {
        return res.status(403).json({ error: 'Target failed safety checks', details: safetyResult.results.filter(r => !r.passed) });
      }

      const scanId = `scan-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      
      const scanData = {
        id: scanId,
        target,
        type,
        name: name || `Scan ${target}`,
        status: 'running',
        progress: 0,
        vulnTypes: vulnTypes || ['LFI', 'RCE', 'XSS', 'SQLI', 'SSRF', 'IDOR', 'AFO'],
        agentMode: agentMode || false,
        startedAt: new Date().toISOString(),
        findings: [],
        result: null,
      };

      scanStore.set(scanId, scanData);

      // Start scan in background
      if (agentMode) {
        // Use multi-agent orchestration
        orchestrator.runFullScan(target, { vulnTypes, autoExploit: false }).then(result => {
          const scan = scanStore.get(scanId);
          if (scan) {
            scan.status = 'completed';
            scan.progress = 100;
            scan.result = result;
            scan.completedAt = new Date().toISOString();
          }

          notificationManager.notify({
            title: `Scan Complete: ${target}`,
            message: `Agent-orchestrated scan completed with ${(result as any).vulnerabilities?.findings?.length || 0} findings`,
            severity: 'medium',
            scanId,
            findingCount: (result as any).vulnerabilities?.findings?.length || 0,
          });
        }).catch(error => {
          const scan = scanStore.get(scanId);
          if (scan) {
            scan.status = 'failed';
            scan.error = error.message;
          }
        });
      } else {
        // Direct vulnerability scan
        vulnerabilityScanner.scan(
          target,
          undefined,
          vulnTypes as VulnType[],
          (phase, progress) => {
            const scan = scanStore.get(scanId);
            if (scan) {
              scan.progress = progress;
              scan.currentPhase = phase;
            }
          }
        ).then(result => {
          const scan = scanStore.get(scanId);
          if (scan) {
            scan.status = 'completed';
            scan.progress = 100;
            scan.result = result;
            scan.findings = result.findings;
            scan.completedAt = new Date().toISOString();
          }

          notificationManager.notify({
            title: `Vulnerability Scan Complete: ${target}`,
            message: `Found ${result.findings.length} potential vulnerabilities`,
            severity: result.findings.some(f => f.severity === 'critical') ? 'critical' : 'high',
            scanId,
            findingCount: result.findings.length,
          });
        }).catch(error => {
          const scan = scanStore.get(scanId);
          if (scan) {
            scan.status = 'failed';
            scan.error = error.message;
          }
        });
      }

      res.json({ scanId, status: 'running', legalNotice: safetyResult.legalNotice });
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  });

  app.get("/api/scan/:scanId", (req, res) => {
    const scan = scanStore.get(req.params.scanId);
    if (!scan) {
      return res.status(404).json({ error: 'Scan not found' });
    }
    res.json(scan);
  });

  app.get("/api/scans", (_req, res) => {
    const scans = Array.from(scanStore.values()).sort((a, b) => 
      new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime()
    );
    res.json(scans);
  });

  app.delete("/api/scan/:scanId", (req, res) => {
    const scan = scanStore.get(req.params.scanId);
    if (!scan) {
      return res.status(404).json({ error: 'Scan not found' });
    }
    if (scan.status === 'running') {
      return res.status(400).json({ error: 'Cannot delete a running scan' });
    }
    scanStore.delete(req.params.scanId);
    res.json({ success: true });
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // RECON ROUTES
  // ═══════════════════════════════════════════════════════════════════════════

  app.post("/api/recon/start", async (req, res) => {
    try {
      const { target, deepScan, stealth } = req.body;
      if (!target) {
        return res.status(400).json({ error: 'Target is required' });
      }

      // Safety check
      const safetyResult = await safetyPipeline.check(target, { type: 'recon', target });
      if (!safetyResult.passed) {
        return res.status(403).json({ error: 'Target failed safety checks', details: safetyResult.results.filter(r => !r.passed) });
      }

      const reconId = `recon-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      
      // Start recon in background
      reconEngine.recon(target, { deepScan, stealth }, (phase, progress) => {
        // Progress updates are sent via WebSocket
      }).then(result => {
        scanStore.set(reconId, {
          id: reconId,
          target,
          type: 'recon',
          status: 'completed',
          progress: 100,
          result,
          completedAt: new Date().toISOString(),
        });

        notificationManager.notify({
          title: `Reconnaissance Complete: ${target}`,
          message: `Found ${result.subdomains.length} subdomains, ${result.ports.length} open ports. Security score: ${result.securityScore}/100`,
          severity: result.securityScore < 50 ? 'high' : 'medium',
          scanId: reconId,
        });
      }).catch(error => {
        scanStore.set(reconId, {
          id: reconId,
          target,
          type: 'recon',
          status: 'failed',
          error: error.message,
        });
      });

      scanStore.set(reconId, {
        id: reconId,
        target,
        type: 'recon',
        status: 'running',
        progress: 0,
        startedAt: new Date().toISOString(),
      });

      res.json({ reconId, status: 'running', legalNotice: safetyResult.legalNotice });
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  });

  app.get("/api/recon/:reconId", (req, res) => {
    const recon = scanStore.get(req.params.reconId);
    if (!recon) {
      return res.status(404).json({ error: 'Recon not found' });
    }
    res.json(recon);
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // AGENT ROUTES
  // ═══════════════════════════════════════════════════════════════════════════

  app.get("/api/agents/status", (_req, res) => {
    try {
      const status = orchestrator.getStatus();
      res.json(status);
    } catch (error) {
      res.status(500).json({ error: "Failed to get agent status" });
    }
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // TOOL ROUTES
  // ═══════════════════════════════════════════════════════════════════════════

  app.get("/api/tools", async (_req, res) => {
    try {
      const tools = await toolExecutor.getAvailableTools();
      res.json(tools);
    } catch (error) {
      res.status(500).json({ error: "Failed to get tools" });
    }
  });

  app.get("/api/tools/registry", (_req, res) => {
    try {
      res.json(TOOL_REGISTRY);
    } catch (error) {
      res.status(500).json({ error: "Failed to get tool registry" });
    }
  });

  app.post("/api/tools/execute", async (req, res) => {
    try {
      const { toolName, target, options } = req.body;
      if (!toolName || !target) {
        return res.status(400).json({ error: 'Tool name and target are required' });
      }

      // Safety check
      const safetyResult = await safetyPipeline.check(target, { type: 'tool', target });
      if (!safetyResult.passed) {
        return res.status(403).json({ error: 'Target failed safety checks', details: safetyResult.results.filter(r => !r.passed) });
      }

      const result = await toolExecutor.execute(toolName, target, options);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // RISK ROUTES
  // ═══════════════════════════════════════════════════════════════════════════

  app.post("/api/risk/calculate", (req, res) => {
    try {
      const { vulnType, cvssVector, businessContext, epssScore } = req.body;
      if (!vulnType) {
        return res.status(400).json({ error: 'Vulnerability type is required' });
      }

      const risk = riskEngine.calculateRisk(
        vulnType as VulnType,
        cvssVector,
        businessContext,
        epssScore
      );
      res.json({ risk, severity: riskEngine.cvssToSeverity(risk.cvss) });
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  });

  app.post("/api/risk/false-positive", (req, res) => {
    try {
      const { type, confidence, evidence, verifiedByLlm, verifiedByRule } = req.body;
      if (!type || confidence === undefined) {
        return res.status(400).json({ error: 'Type and confidence are required' });
      }

      const result = riskEngine.assessFalsePositive({
        type,
        confidence,
        evidence: evidence || '',
        verifiedByLlm,
        verifiedByRule,
      });
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // SAFETY ROUTES
  // ═══════════════════════════════════════════════════════════════════════════

  app.post("/api/safety/check", async (req, res) => {
    try {
      const { input, type, target } = req.body;
      if (!input) {
        return res.status(400).json({ error: 'Input is required' });
      }

      const result = await safetyPipeline.check(input, { type: type || 'general', target });
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // NOTIFICATION ROUTES
  // ═══════════════════════════════════════════════════════════════════════════

  app.get("/api/notifications", (_req, res) => {
    try {
      const notifications = notificationManager.getNotifications();
      res.json(notifications);
    } catch (error) {
      res.status(500).json({ error: "Failed to get notifications" });
    }
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // DASHBOARD / STATS
  // ═══════════════════════════════════════════════════════════════════════════

  app.get("/api/dashboard/stats", (_req, res) => {
    try {
      const scans = Array.from(scanStore.values());
      const completedScans = scans.filter(s => s.status === 'completed');
      const allFindings = completedScans.flatMap(s => s.findings || []);
      const criticalFindings = allFindings.filter((f: any) => f.severity === 'critical');
      const highFindings = allFindings.filter((f: any) => f.severity === 'high');

      const agentStatus = orchestrator.getStatus();
      const llmProviders = llmRegistry.getProviders();

      res.json({
        totalScans: scans.length,
        runningScans: scans.filter(s => s.status === 'running').length,
        completedScans: completedScans.length,
        totalFindings: allFindings.length,
        criticalFindings: criticalFindings.length,
        highFindings: highFindings.length,
        agentStatus,
        llmProviders,
        recentScans: scans.slice(0, 5),
        recentFindings: allFindings.slice(0, 10),
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to get dashboard stats" });
    }
  });

  // ── WebSocket Server ─────────────────────────────────────────────────────

  const httpServer = createServer(app);

  const wss = new WebSocketServer({ 
    server: httpServer, 
    path: '/ws/cybershell'
  });

  // Agent event forwarding
  orchestrator.on('agentStatus', (state: any) => {
    const data = JSON.stringify({ type: 'agent_status', state, timestamp: new Date().toISOString() });
    for (const client of wss.clients) {
      if (client.readyState === 1) {
        client.send(data);
      }
    }
  });

  orchestrator.on('phaseChange', (data: any) => {
    const msg = JSON.stringify({ type: 'phase_change', ...data, timestamp: new Date().toISOString() });
    for (const client of wss.clients) {
      if (client.readyState === 1) {
        client.send(msg);
      }
    }
  });

  orchestrator.on('scanComplete', (data: any) => {
    const msg = JSON.stringify({ type: 'scan_complete', ...data, timestamp: new Date().toISOString() });
    for (const client of wss.clients) {
      if (client.readyState === 1) {
        client.send(msg);
      }
    }
  });

  wss.on('connection', (ws: WebSocket, req) => {
    const clientIp = req.socket.remoteAddress ?? 'unknown';
    console.log(`CyberShellX WebSocket connection established from ${clientIp}`);

    // Register for notifications
    notificationManager.registerWSClient(ws);

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
          ws.send(JSON.stringify({
            type: 'install_result',
            success: true,
            message: `Tool '${data.tool}' installation simulated. In a real environment, use your system package manager.`,
            timestamp: new Date().toISOString()
          }));
        } else if (data.type === 'get_tools') {
          const tools = await toolExecutor.getAvailableTools();
          ws.send(JSON.stringify({
            type: 'tools_list',
            tools: tools.filter(t => t.installed).map(t => t.name),
            allTools: tools,
            timestamp: new Date().toISOString()
          }));
        } else if (data.type === 'scan_progress') {
          // Client requesting scan progress
          const scanId = data.scanId;
          const scan = scanStore.get(scanId);
          if (scan) {
            ws.send(JSON.stringify({
              type: 'scan_progress',
              scanId,
              status: scan.status,
              progress: scan.progress,
              currentPhase: scan.currentPhase,
              timestamp: new Date().toISOString()
            }));
          }
        } else if (data.type === 'agent_status') {
          const status = orchestrator.getStatus();
          ws.send(JSON.stringify({
            type: 'agent_status_update',
            ...status,
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
      message: 'Connected to CyberShellX Nexus AI. Type commands or ask questions!',
      features: ['scan', 'recon', 'agents', 'tools', 'risk', 'notifications'],
      timestamp: new Date().toISOString()
    }));
  });

  return httpServer;
}
