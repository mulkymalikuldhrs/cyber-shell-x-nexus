// ── Agent System ───────────────────────────────────────────────────────────────
// Multi-agent architecture inspired by Zen-AI-Pentest and PentestGPT concepts
// Supports: ReconAgent, VulnAgent, ExploitAgent, AnalysisAgent, ReportAgent

import { EventEmitter } from 'events';
import { v4 as uuid } from 'uuid';
import type { AgentType } from '@shared/schema';

// ── Types ──────────────────────────────────────────────────────────────────────

export type AgentStatus = 'idle' | 'running' | 'paused' | 'completed' | 'error';

export interface AgentMessage {
  id: string;
  from: string;
  to: string | '*'; // '*' = broadcast
  type: 'task' | 'result' | 'status' | 'error' | 'query';
  content: string;
  metadata?: Record<string, unknown>;
  timestamp: Date;
}

export interface AgentTask {
  id: string;
  type: string;
  target: string;
  params: Record<string, unknown>;
  priority: number;
  createdAt: Date;
}

export interface AgentState {
  id: string;
  type: AgentType;
  status: AgentStatus;
  progress: number;
  currentTask: AgentTask | null;
  completedTasks: number;
  errors: string[];
  lastActivity: Date;
}

// ── Base Agent ─────────────────────────────────────────────────────────────────

export abstract class BaseAgent extends EventEmitter {
  public readonly id: string;
  public readonly type: AgentType;
  public status: AgentStatus = 'idle';
  public progress = 0;
  
  protected inbox: AgentMessage[] = [];
  protected currentTask: AgentTask | null = null;
  protected completedTasks = 0;
  protected errors: string[] = [];
  protected messageQueue: AgentMessage[] = [];
  protected lastActivity = new Date();

  constructor(type: AgentType) {
    super();
    this.id = `${type}-${uuid().substring(0, 8)}`;
    this.type = type;
  }

  abstract execute(task: AgentTask): Promise<Record<string, unknown>>;

  async start(task: AgentTask): Promise<void> {
    this.currentTask = task;
    this.status = 'running';
    this.progress = 0;
    this.lastActivity = new Date();
    this.emit('statusChange', this.getState());

    try {
      const result = await this.execute(task);
      this.completedTasks++;
      this.status = 'completed';
      this.progress = 100;
      this.emit('taskComplete', { task, result });
    } catch (error) {
      this.status = 'error';
      const errMsg = (error as Error).message;
      this.errors.push(errMsg);
      this.emit('taskError', { task, error: errMsg });
    }

    this.lastActivity = new Date();
    this.emit('statusChange', this.getState());
    this.currentTask = null;
  }

  pause(): void {
    if (this.status === 'running') {
      this.status = 'paused';
      this.emit('statusChange', this.getState());
    }
  }

  resume(): void {
    if (this.status === 'paused') {
      this.status = 'running';
      this.emit('statusChange', this.getState());
    }
  }

  stop(): void {
    this.status = 'idle';
    this.progress = 0;
    this.currentTask = null;
    this.emit('statusChange', this.getState());
  }

  sendMessage(to: string | '*', type: AgentMessage['type'], content: string, metadata?: Record<string, unknown>): void {
    const msg: AgentMessage = {
      id: uuid(),
      from: this.id,
      to,
      type,
      content,
      metadata,
      timestamp: new Date(),
    };
    this.messageQueue.push(msg);
    this.emit('message', msg);
  }

  receiveMessage(msg: AgentMessage): void {
    this.inbox.push(msg);
    this.emit('inbox', msg);
  }

  getState(): AgentState {
    return {
      id: this.id,
      type: this.type,
      status: this.status,
      progress: this.progress,
      currentTask: this.currentTask,
      completedTasks: this.completedTasks,
      errors: this.errors,
      lastActivity: this.lastActivity,
    };
  }
}

// ── Recon Agent ────────────────────────────────────────────────────────────────

export class ReconAgent extends BaseAgent {
  constructor() {
    super('recon');
  }

  async execute(task: AgentTask): Promise<Record<string, unknown>> {
    this.progress = 10;
    this.sendMessage('orchestrator', 'status', `Starting reconnaissance on ${task.target}`);

    // Simulate reconnaissance phases
    const phases = [
      { name: 'DNS Resolution', progress: 20 },
      { name: 'Subdomain Enumeration', progress: 35 },
      { name: 'Port Scanning', progress: 55 },
      { name: 'Service Detection', progress: 70 },
      { name: 'Technology Fingerprinting', progress: 85 },
      { name: 'Security Headers Check', progress: 95 },
    ];

    const results: Record<string, unknown> = {
      target: task.target,
      findings: [],
      timestamp: new Date().toISOString(),
    };

    for (const phase of phases) {
      this.progress = phase.progress;
      this.lastActivity = new Date();
      this.emit('statusChange', this.getState());
      
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 300));
      
      (results.findings as any[]).push({
        phase: phase.name,
        status: 'completed',
        data: this.simulateReconData(phase.name, task.target),
      });
    }

    this.sendMessage('orchestrator', 'result', `Reconnaissance complete for ${task.target}`, results);
    return results;
  }

  private simulateReconData(phase: string, target: string): Record<string, unknown> {
    switch (phase) {
      case 'DNS Resolution':
        return {
          ip: `${Math.floor(Math.random() * 223) + 1}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
          records: ['A', 'AAAA', 'MX', 'NS', 'TXT'],
          resolved: true,
        };
      case 'Subdomain Enumeration':
        return {
          found: Math.floor(Math.random() * 20) + 3,
          subdomains: ['www', 'api', 'mail', 'dev', 'staging'].map(s => `${s}.${target}`),
        };
      case 'Port Scanning':
        return {
          openPorts: [22, 80, 443, 8080].filter(() => Math.random() > 0.3),
          totalScanned: 1000,
        };
      case 'Service Detection':
        return {
          services: [
            { port: 22, service: 'SSH', version: 'OpenSSH 8.9' },
            { port: 80, service: 'HTTP', version: 'nginx/1.24' },
            { port: 443, service: 'HTTPS', version: 'nginx/1.24' },
          ].filter(() => Math.random() > 0.3),
        };
      case 'Technology Fingerprinting':
        return {
          technologies: ['nginx', 'React', 'Node.js', 'Cloudflare'].filter(() => Math.random() > 0.3),
          framework: 'Express.js',
        };
      case 'Security Headers Check':
        return {
          headers: {
            'X-Content-Type-Options': 'present',
            'X-Frame-Options': 'missing',
            'Content-Security-Policy': 'missing',
            'Strict-Transport-Security': 'present',
            'X-XSS-Protection': 'present',
          },
          score: Math.floor(Math.random() * 40) + 40,
        };
      default:
        return {};
    }
  }
}

// ── Vulnerability Agent ────────────────────────────────────────────────────────

export class VulnAgent extends BaseAgent {
  constructor() {
    super('vuln');
  }

  async execute(task: AgentTask): Promise<Record<string, unknown>> {
    this.progress = 10;
    this.sendMessage('orchestrator', 'status', `Starting vulnerability analysis on ${task.target}`);

    const vulnTypes = (task.params.vulnTypes as string[]) || ['LFI', 'RCE', 'XSS', 'SQLI', 'SSRF', 'IDOR', 'AFO'];
    const findings: any[] = [];
    const totalPhases = vulnTypes.length;

    for (let i = 0; i < totalPhases; i++) {
      const vulnType = vulnTypes[i];
      this.progress = Math.round(((i + 1) / totalPhases) * 90);
      this.lastActivity = new Date();
      this.emit('statusChange', this.getState());
      
      await new Promise(resolve => setTimeout(resolve, 400));

      // Simulate vulnerability detection
      const detected = Math.random() > 0.5;
      if (detected) {
        findings.push({
          type: vulnType,
          severity: this.mapSeverity(vulnType),
          confidence: Math.floor(Math.random() * 4) + 6, // 6-10
          description: `Potential ${vulnType} vulnerability detected in ${task.target}`,
          evidence: `Simulated evidence for ${vulnType} on ${task.target}`,
          cvssVector: this.generateCVSS(vulnType),
        });
      }
    }

    const result = {
      target: task.target,
      totalChecked: vulnTypes.length,
      findings,
      timestamp: new Date().toISOString(),
    };

    this.sendMessage('orchestrator', 'result', `Vulnerability analysis complete: ${findings.length} findings`, result);
    return result;
  }

  private mapSeverity(vulnType: string): string {
    const map: Record<string, string> = {
      RCE: 'critical', LFI: 'high', SQLI: 'high', XSS: 'medium',
      SSRF: 'high', IDOR: 'medium', AFO: 'medium',
    };
    return map[vulnType] || 'medium';
  }

  private generateCVSS(vulnType: string): string {
    const bases: Record<string, string> = {
      RCE: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:C/C:H/I:H/A:H',
      LFI: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:N/A:N',
      SQLI: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H',
      XSS: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:R/S:C/C:L/I:L/A:N',
      SSRF: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:N/A:N',
      IDOR: 'CVSS:3.1/AV:N/AC:L/PR:L/UI:N/S:U/C:H/I:N/A:N',
      AFO: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:N/A:N',
    };
    return bases[vulnType] || 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:N/I:N/A:N';
  }
}

// ── Exploit Agent ──────────────────────────────────────────────────────────────

export class ExploitAgent extends BaseAgent {
  constructor() {
    super('exploit');
  }

  async execute(task: AgentTask): Promise<Record<string, unknown>> {
    this.progress = 10;
    this.sendMessage('orchestrator', 'status', `Starting exploit validation for ${task.target}`);

    // Safety check: Only validate, never actually exploit
    const findings = (task.params.findings as any[]) || [];
    const validatedFindings: any[] = [];

    for (let i = 0; i < findings.length; i++) {
      const finding = findings[i];
      this.progress = Math.round(((i + 1) / findings.length) * 90);
      this.lastActivity = new Date();
      this.emit('statusChange', this.getState());

      await new Promise(resolve => setTimeout(resolve, 300));

      // Simulate PoC generation (educational only)
      validatedFindings.push({
        ...finding,
        validated: Math.random() > 0.3,
        pocGenerated: Math.random() > 0.5,
        poc: `# Educational PoC for ${finding.type}\n# This is a SIMULATED proof-of-concept for training purposes only\n# DO NOT use against systems without authorization\nprint("Simulated ${finding.type} test for ${task.target}")`,
        falsePositive: Math.random() > 0.8,
      });
    }

    const result = {
      target: task.target,
      totalValidated: validatedFindings.length,
      confirmedVulns: validatedFindings.filter(f => f.validated && !f.falsePositive).length,
      falsePositives: validatedFindings.filter(f => f.falsePositive).length,
      findings: validatedFindings,
      timestamp: new Date().toISOString(),
      legalNotice: 'All exploit validation is performed in sandboxed environments for educational purposes only.',
    };

    this.sendMessage('orchestrator', 'result', `Exploit validation complete: ${result.confirmedVulns} confirmed`, result);
    return result;
  }
}

// ── Analysis Agent ─────────────────────────────────────────────────────────────

export class AnalysisAgent extends BaseAgent {
  constructor() {
    super('analysis');
  }

  async execute(task: AgentTask): Promise<Record<string, unknown>> {
    this.progress = 10;
    this.sendMessage('orchestrator', 'status', `Starting risk analysis for ${task.target}`);

    const phases = [
      'CVSS Scoring',
      'False Positive Analysis',
      'Business Impact Assessment',
      'Risk Prioritization',
      'Remediation Planning',
    ];

    const analysisResults: any[] = [];

    for (let i = 0; i < phases.length; i++) {
      this.progress = Math.round(((i + 1) / phases.length) * 90);
      this.lastActivity = new Date();
      this.emit('statusChange', this.getState());

      await new Promise(resolve => setTimeout(resolve, 200));

      analysisResults.push({
        phase: phases[i],
        completed: true,
        data: this.simulateAnalysis(phases[i], task.target),
      });
    }

    const result = {
      target: task.target,
      overallRisk: Math.floor(Math.random() * 40) + 40,
      analysisResults,
      timestamp: new Date().toISOString(),
    };

    this.sendMessage('orchestrator', 'result', `Analysis complete for ${task.target}`, result);
    return result;
  }

  private simulateAnalysis(phase: string, _target: string): Record<string, unknown> {
    switch (phase) {
      case 'CVSS Scoring':
        return { avgScore: (Math.random() * 5 + 4).toFixed(1), range: '4.0-9.8' };
      case 'False Positive Analysis':
        return { falsePositiveRate: '15%', method: 'Bayesian + LLM voting' };
      case 'Business Impact Assessment':
        return { impactLevel: 'high', affectedAssets: 3, dataExposure: 'possible' };
      case 'Risk Prioritization':
        return { critical: 1, high: 2, medium: 3, low: 1 };
      case 'Remediation Planning':
        return { estimatedEffort: '2-4 weeks', priorityActions: ['Patch RCE vulnerability', 'Fix SQL injection'] };
      default:
        return {};
    }
  }
}

// ── Report Agent ───────────────────────────────────────────────────────────────

export class ReportAgent extends BaseAgent {
  constructor() {
    super('report');
  }

  async execute(task: AgentTask): Promise<Record<string, unknown>> {
    this.progress = 10;
    this.sendMessage('orchestrator', 'status', `Generating report for ${task.target}`);

    const sections = [
      'Executive Summary',
      'Scope & Methodology',
      'Findings Overview',
      'Detailed Findings',
      'Risk Assessment',
      'Remediation Recommendations',
      'Appendices',
    ];

    const report: any = {
      title: `Security Assessment Report - ${task.target}`,
      target: task.target,
      date: new Date().toISOString(),
      sections: {},
    };

    for (let i = 0; i < sections.length; i++) {
      this.progress = Math.round(((i + 1) / sections.length) * 95);
      this.lastActivity = new Date();
      this.emit('statusChange', this.getState());

      await new Promise(resolve => setTimeout(resolve, 150));

      report.sections[sections[i].toLowerCase().replace(/\s+/g, '_')] = {
        title: sections[i],
        content: `Generated content for ${sections[i]} section.`,
        status: 'complete',
      };
    }

    const result = {
      target: task.target,
      report,
      format: task.params.format || 'html',
      timestamp: new Date().toISOString(),
    };

    this.sendMessage('orchestrator', 'result', `Report generated for ${task.target}`, result);
    return result;
  }
}

// ── Agent Orchestrator ─────────────────────────────────────────────────────────

export class AgentOrchestrator extends EventEmitter {
  private agents: Map<string, BaseAgent> = new Map();
  private taskQueue: AgentTask[] = [];
  private isRunning = false;
  private results: Map<string, Record<string, unknown>> = new Map();

  constructor() {
    super();
    this.initializeAgents();
  }

  private initializeAgents(): void {
    const agentTypes: Array<{ type: AgentType; agent: BaseAgent }> = [
      { type: 'recon', agent: new ReconAgent() },
      { type: 'vuln', agent: new VulnAgent() },
      { type: 'exploit', agent: new ExploitAgent() },
      { type: 'analysis', agent: new AnalysisAgent() },
      { type: 'report', agent: new ReportAgent() },
    ];

    for (const { agent } of agentTypes) {
      this.agents.set(agent.id, agent);
      
      // Forward agent events
      agent.on('statusChange', (state: AgentState) => {
        this.emit('agentStatus', state);
      });
      agent.on('message', (msg: AgentMessage) => {
        this.routeMessage(msg);
      });
      agent.on('taskComplete', (data: { task: AgentTask; result: Record<string, unknown> }) => {
        this.results.set(data.task.id, data.result);
        this.emit('taskComplete', data);
      });
      agent.on('taskError', (data: { task: AgentTask; error: string }) => {
        this.emit('taskError', data);
      });
    }
  }

  async runFullScan(target: string, options: Record<string, unknown> = {}): Promise<Record<string, unknown>> {
    this.isRunning = true;
    this.results.clear();
    const scanId = uuid();

    try {
      // Phase 1: Reconnaissance
      this.emit('phaseChange', { scanId, phase: 'recon' });
      const reconAgent = this.getAgentByType('recon');
      const reconResult = await reconAgent.execute({
        id: uuid(),
        type: 'recon',
        target,
        params: options,
        priority: 1,
        createdAt: new Date(),
      });

      // Phase 2: Vulnerability Analysis
      this.emit('phaseChange', { scanId, phase: 'vuln' });
      const vulnAgent = this.getAgentByType('vuln');
      const vulnResult = await vulnAgent.execute({
        id: uuid(),
        type: 'vuln',
        target,
        params: { ...options, vulnTypes: options.vulnTypes || ['LFI', 'RCE', 'XSS', 'SQLI', 'SSRF', 'IDOR', 'AFO'] },
        priority: 2,
        createdAt: new Date(),
      });

      // Phase 3: Exploit Validation (if enabled)
      let exploitResult = {};
      if (options.autoExploit) {
        this.emit('phaseChange', { scanId, phase: 'exploit' });
        const exploitAgent = this.getAgentByType('exploit');
        exploitResult = await exploitAgent.execute({
          id: uuid(),
          type: 'exploit',
          target,
          params: { findings: (vulnResult as any).findings || [] },
          priority: 3,
          createdAt: new Date(),
        });
      }

      // Phase 4: Risk Analysis
      this.emit('phaseChange', { scanId, phase: 'analysis' });
      const analysisAgent = this.getAgentByType('analysis');
      const analysisResult = await analysisAgent.execute({
        id: uuid(),
        type: 'analysis',
        target,
        params: { reconResult, vulnResult, exploitResult },
        priority: 4,
        createdAt: new Date(),
      });

      // Phase 5: Report Generation
      this.emit('phaseChange', { scanId, phase: 'report' });
      const reportAgent = this.getAgentByType('report');
      const reportResult = await reportAgent.execute({
        id: uuid(),
        type: 'report',
        target,
        params: { reconResult, vulnResult, exploitResult, analysisResult, format: 'html' },
        priority: 5,
        createdAt: new Date(),
      });

      this.isRunning = false;
      this.emit('scanComplete', { scanId, target });

      return {
        scanId,
        target,
        recon: reconResult,
        vulnerabilities: vulnResult,
        exploits: exploitResult,
        analysis: analysisResult,
        report: reportResult,
        completedAt: new Date().toISOString(),
      };
    } catch (error) {
      this.isRunning = false;
      this.emit('scanError', { scanId, error: (error as Error).message });
      throw error;
    }
  }

  private getAgentByType(type: AgentType): BaseAgent {
    for (const agent of this.agents.values()) {
      if (agent.type === type) return agent;
    }
    throw new Error(`No agent of type ${type} found`);
  }

  private routeMessage(msg: AgentMessage): void {
    if (msg.to === '*') {
      // Broadcast
      for (const agent of this.agents.values()) {
        if (agent.id !== msg.from) {
          agent.receiveMessage(msg);
        }
      }
    } else {
      const target = this.agents.get(msg.to);
      if (target) {
        target.receiveMessage(msg);
      }
    }
    this.emit('agentMessage', msg);
  }

  getAgentStates(): AgentState[] {
    return Array.from(this.agents.values()).map(a => a.getState());
  }

  getStatus(): { isRunning: boolean; agents: AgentState[]; pendingTasks: number } {
    return {
      isRunning: this.isRunning,
      agents: this.getAgentStates(),
      pendingTasks: this.taskQueue.length,
    };
  }
}

// Singleton orchestrator
export const orchestrator = new AgentOrchestrator();
