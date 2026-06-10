import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Bot, Activity, Play, Pause, Square, RefreshCw, Loader2, Cpu, Zap, Eye, Shield, FileText, ArrowRight, Terminal, Clock, MessageCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Progress } from '../components/ui/progress';
import { ScrollArea } from '../components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';

interface AgentState {
  id: string;
  type: string;
  status: 'idle' | 'running' | 'paused' | 'completed' | 'error';
  progress: number;
  completedTasks: number;
  errors: string[];
  lastActivity: string;
}

interface AgentLog {
  timestamp: string;
  agent: string;
  level: 'info' | 'warn' | 'error' | 'success';
  message: string;
}

const AGENT_TYPES = ['recon', 'vuln', 'exploit', 'analysis', 'report'] as const;

const AGENT_ICONS: Record<string, React.ReactNode> = {
  recon: <Eye className="w-5 h-5" />,
  vuln: <Zap className="w-5 h-5" />,
  exploit: <Bot className="w-5 h-5" />,
  analysis: <Cpu className="w-5 h-5" />,
  report: <FileText className="w-5 h-5" />,
};

const AGENT_COLORS: Record<string, string> = {
  recon: 'text-cyan-400',
  vuln: 'text-red-400',
  exploit: 'text-orange-400',
  analysis: 'text-purple-400',
  report: 'text-green-400',
};

const AGENT_BG: Record<string, string> = {
  recon: 'from-cyan-500/20 to-cyan-600/10 border-cyan-500/30',
  vuln: 'from-red-500/20 to-red-600/10 border-red-500/30',
  exploit: 'from-orange-500/20 to-orange-600/10 border-orange-500/30',
  analysis: 'from-purple-500/20 to-purple-600/10 border-purple-500/30',
  report: 'from-green-500/20 to-green-600/10 border-green-500/30',
};

const STATUS_COLORS: Record<string, string> = {
  idle: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
  running: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
  paused: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  completed: 'bg-green-500/20 text-green-400 border-green-500/30',
  error: 'bg-red-500/20 text-red-400 border-red-500/30',
};

const LOG_COLORS: Record<string, string> = {
  info: 'text-cyan-400',
  warn: 'text-yellow-400',
  error: 'text-red-400',
  success: 'text-green-400',
};

// Agent communication diagram
const CommunicationDiagram = ({ agents }: { agents: AgentState[] }) => {
  const getAgentStatus = (type: string) => agents.find(a => a.type === type)?.status || 'idle';

  return (
    <div className="relative py-8">
      {/* Connection lines (SVG) */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 800 200" preserveAspectRatio="xMidYMid meet">
        {/* Pipeline flow lines */}
        <line x1="160" y1="100" x2="280" y2="100" stroke="currentColor" strokeWidth="2" className={getAgentStatus('recon') === 'running' ? 'text-cyan-500/50' : 'text-gray-700'} />
        <line x1="340" y1="100" x2="460" y2="100" stroke="currentColor" strokeWidth="2" className={getAgentStatus('vuln') === 'running' ? 'text-red-500/50' : 'text-gray-700'} />
        <line x1="520" y1="100" x2="640" y2="100" stroke="currentColor" strokeWidth="2" className={getAgentStatus('exploit') === 'running' ? 'text-orange-500/50' : 'text-gray-700'} />
        
        {/* Cross-agent communication arcs */}
        <path d="M 130 60 Q 400 10 670 60" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" className="text-gray-700/50" />
        <path d="M 130 140 Q 400 190 670 140" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" className="text-gray-700/50" />

        {/* Animated data flow particles */}
        {agents.some(a => a.status === 'running') && (
          <>
            <circle r="3" className="fill-cyan-400">
              <animateMotion dur="2s" repeatCount="indefinite" path="M 160,100 L 280,100" />
            </circle>
            <circle r="3" className="fill-red-400">
              <animateMotion dur="2s" repeatCount="indefinite" path="M 340,100 L 460,100" />
            </circle>
          </>
        )}
      </svg>

      {/* Agent nodes */}
      <div className="flex items-center justify-between gap-2 relative z-10">
        {AGENT_TYPES.map((type, i) => {
          const status = getAgentStatus(type);
          const agent = agents.find(a => a.type === type);
          return (
            <React.Fragment key={type}>
              <div className={`flex flex-col items-center gap-2 p-3 rounded-xl bg-gradient-to-br ${AGENT_BG[type]} border transition-all duration-300 ${
                status === 'running' ? 'scale-105 shadow-lg' : ''
              }`}>
                <div className="relative">
                  <span className={AGENT_COLORS[type]}>{AGENT_ICONS[type]}</span>
                  {status === 'running' && (
                    <div className="absolute -top-1 -right-1 w-3 h-3">
                      <div className={`w-full h-full rounded-full animate-ping ${type === 'recon' ? 'bg-cyan-400' : type === 'vuln' ? 'bg-red-400' : type === 'exploit' ? 'bg-orange-400' : type === 'analysis' ? 'bg-purple-400' : 'bg-green-400'} opacity-75`} />
                    </div>
                  )}
                </div>
                <span className="text-xs font-bold capitalize">{type}</span>
                <Badge className={`text-[10px] ${STATUS_COLORS[status]} border`}>
                  {status}
                </Badge>
                {agent && (
                  <div className="text-[10px] text-gray-500">{agent.progress}%</div>
                )}
              </div>
              {i < AGENT_TYPES.length - 1 && (
                <ArrowRight className={`w-5 h-5 shrink-0 transition-colors ${
                  status === 'completed' ? 'text-green-400' : status === 'running' ? 'text-cyan-400 animate-pulse' : 'text-gray-700'
                }`} />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

const AgentsPage = () => {
  const [agents, setAgents] = useState<AgentState[]>([]);
  const [isOrchestrating, setIsOrchestrating] = useState(false);
  const [target, setTarget] = useState('');
  const [phase, setPhase] = useState('');
  const [logs, setLogs] = useState<AgentLog[]>([]);
  const [activeTab, setActiveTab] = useState('agents');
  const logEndRef = useRef<HTMLDivElement>(null);

  const addLog = useCallback((agent: string, level: AgentLog['level'], message: string) => {
    setLogs(prev => {
      const newLogs = [...prev, { timestamp: new Date().toISOString(), agent, level, message }];
      return newLogs.slice(-100);
    });
  }, []);

  const fetchStatus = useCallback(async () => {
    try {
      const res = await fetch('/api/agents/status');
      if (res.ok) {
        const data = await res.json();
        setAgents(data.agents || []);
        setIsOrchestrating(data.isRunning);
        
        if (data.agents) {
          data.agents.forEach((agent: AgentState) => {
            if (agent.status === 'running' && agent.lastActivity) {
              addLog(agent.type, 'info', `${agent.type} agent processing: ${agent.lastActivity}`);
            }
            if (agent.errors?.length > 0) {
              agent.errors.forEach((err: string) => addLog(agent.type, 'error', err));
            }
          });
        }
      }
    } catch {}
  }, [addLog]);

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 3000);
    return () => clearInterval(interval);
  }, [fetchStatus]);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const startOrchestration = async () => {
    if (!target.trim()) return;
    setIsOrchestrating(true);
    addLog('system', 'info', `Starting full agent orchestration for target: ${target}`);

    try {
      const res = await fetch('/api/scan/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ target: target.trim(), type: 'full', agentMode: true }),
      });

      if (!res.ok) {
        addLog('system', 'error', 'Failed to start orchestration');
        setIsOrchestrating(false);
      } else {
        addLog('system', 'success', 'Orchestration started successfully');
      }
    } catch {
      addLog('system', 'error', 'Connection error - failed to start');
      setIsOrchestrating(false);
    }
  };

  const clearLogs = () => setLogs([]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white pt-14">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/20">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Agent Monitoring
            </h1>
            <p className="text-gray-400 text-sm">Multi-agent orchestration with 5 specialized agents</p>
          </div>
        </div>

        {/* Orchestration Controls */}
        <Card className="bg-gray-800/50 border-gray-700 mb-6">
          <CardContent className="p-4">
            <div className="flex gap-3 items-end">
              <div className="flex-1">
                <label className="text-sm text-gray-400 mb-1 block">Target for Agent Orchestration</label>
                <Input
                  value={target}
                  onChange={e => setTarget(e.target.value)}
                  placeholder="example.com"
                  className="bg-gray-900 border-gray-600"
                  disabled={isOrchestrating}
                />
              </div>
              <Button
                onClick={startOrchestration}
                disabled={isOrchestrating || !target.trim()}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                {isOrchestrating ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Running...</>
                ) : (
                  <><Play className="w-4 h-4 mr-2" /> Start Full Scan</>
                )}
              </Button>
              <Button variant="outline" size="icon" onClick={fetchStatus} className="border-gray-600 text-gray-300">
                <RefreshCw className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Communication Diagram */}
        <Card className="bg-gray-800/50 border-gray-700 mb-6">
          <CardHeader className="pb-2">
            <CardTitle className="text-cyan-400 flex items-center gap-2 text-base">
              <MessageCircle className="w-5 h-5" /> Agent Communication
            </CardTitle>
            <CardDescription className="text-gray-400 text-xs">
              Real-time inter-agent data flow and pipeline orchestration
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CommunicationDiagram agents={agents} />
          </CardContent>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-gray-900/50 mb-4">
            <TabsTrigger value="agents">Agent Cards</TabsTrigger>
            <TabsTrigger value="pipeline">Pipeline View</TabsTrigger>
            <TabsTrigger value="logs">Agent Logs</TabsTrigger>
          </TabsList>

          {/* Agent Cards Tab */}
          <TabsContent value="agents" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
              {AGENT_TYPES.map(type => {
                const agent = agents.find(a => a.type === type);
                const status = agent?.status || 'idle';
                return (
                  <Card key={type} className={`bg-gradient-to-br ${AGENT_BG[type]} border transition-all duration-300 ${
                    status === 'running' ? 'scale-[1.02] shadow-lg' : ''
                  }`}>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="relative">
                          <span className={AGENT_COLORS[type]}>{AGENT_ICONS[type]}</span>
                          {status === 'running' && (
                            <div className="absolute -top-1 -right-1 w-2.5 h-2.5">
                              <div className={`w-full h-full rounded-full animate-ping ${
                                type === 'recon' ? 'bg-cyan-400' : type === 'vuln' ? 'bg-red-400' : 
                                type === 'exploit' ? 'bg-orange-400' : type === 'analysis' ? 'bg-purple-400' : 'bg-green-400'
                              } opacity-75`} />
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold capitalize text-sm">{type} Agent</h3>
                          <Badge className={`text-[10px] ${STATUS_COLORS[status]} border`}>
                            {status}
                          </Badge>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div>
                          <div className="flex justify-between text-xs text-gray-400 mb-1">
                            <span>Progress</span>
                            <span className="font-mono">{agent?.progress || 0}%</span>
                          </div>
                          <Progress value={agent?.progress || 0} className="h-1.5" />
                        </div>
                        <div className="flex justify-between text-xs text-gray-400">
                          <span>Completed</span>
                          <span className="font-mono">{agent?.completedTasks || 0}</span>
                        </div>
                        {agent?.errors && agent.errors.length > 0 && (
                          <div className="text-xs text-red-400 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 bg-red-400 rounded-full" />
                            {agent.errors.length} error{agent.errors.length > 1 ? 's' : ''}
                          </div>
                        )}
                        {agent?.lastActivity && (
                          <div className="text-[10px] text-gray-500 truncate">
                            Last: {agent.lastActivity}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* Pipeline View Tab */}
          <TabsContent value="pipeline" className="mt-0">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-cyan-400 flex items-center gap-2">
                  <Activity className="w-5 h-5" /> Agent Pipeline
                </CardTitle>
                <CardDescription className="text-gray-400">
                  5-phase PTES workflow: Recon &rarr; Vuln &rarr; Exploit &rarr; Analysis &rarr; Report
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {AGENT_TYPES.map((type, i) => {
                    const agent = agents.find(a => a.type === type);
                    const status = agent?.status || 'idle';
                    const isActive = status === 'running';
                    const isCompleted = status === 'completed';

                    return (
                      <div key={type} className="flex items-center gap-4">
                        {/* Step indicator */}
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border-2 transition-all ${
                          isCompleted ? 'bg-green-500/20 border-green-500' :
                          isActive ? `bg-gradient-to-br ${AGENT_BG[type]} border-cyan-500 animate-pulse` :
                          'bg-gray-900/50 border-gray-700'
                        }`}>
                          {isCompleted ? <Shield className="w-5 h-5 text-green-400" /> : 
                           <span className={isActive ? AGENT_COLORS[type] : 'text-gray-500'}>{AGENT_ICONS[type]}</span>}
                        </div>

                        {/* Step details */}
                        <div className={`flex-1 p-4 rounded-lg border transition-all ${
                          isActive ? `bg-gradient-to-r ${AGENT_BG[type]} border-current` :
                          isCompleted ? 'bg-green-500/5 border-green-500/20' :
                          'bg-gray-900/30 border-gray-700/50'
                        }`}>
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <h3 className="font-bold capitalize text-sm">{type} Phase</h3>
                              <Badge className={`text-[10px] ${STATUS_COLORS[status]} border`}>{status}</Badge>
                            </div>
                            {agent && <span className="text-xs text-gray-400 font-mono">{agent.progress}%</span>}
                          </div>
                          <Progress value={agent?.progress || 0} className="h-1.5 mb-2" />
                          {agent?.lastActivity && (
                            <p className="text-xs text-gray-500">{agent.lastActivity}</p>
                          )}
                        </div>

                        {/* Connector line */}
                        {i < AGENT_TYPES.length - 1 && (
                          <div className={`w-0.5 h-8 ml-5 ${
                            isCompleted ? 'bg-green-500/50' : 'bg-gray-700'
                          }`} />
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Agent Logs Tab */}
          <TabsContent value="logs" className="mt-0">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-cyan-400 flex items-center gap-2 text-base">
                    <Terminal className="w-5 h-5" /> Agent Logs
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">{logs.length} entries</Badge>
                    <Button variant="ghost" size="sm" onClick={clearLogs} className="text-gray-400 h-7 text-xs">
                      Clear
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="bg-black/50 rounded-lg border border-gray-700 p-3 font-mono text-xs">
                  <ScrollArea className="max-h-96">
                    {logs.length > 0 ? (
                      <div className="space-y-1">
                        {logs.map((log, i) => (
                          <div key={i} className="flex items-start gap-2 py-0.5">
                            <span className="text-gray-600 shrink-0">{new Date(log.timestamp).toLocaleTimeString()}</span>
                            <span className={`shrink-0 ${AGENT_COLORS[log.agent] || 'text-gray-400'}`}>[{log.agent}]</span>
                            <span className={LOG_COLORS[log.level]}>{log.message}</span>
                          </div>
                        ))}
                        <div ref={logEndRef} />
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-600">
                        <Terminal className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p>No agent logs yet</p>
                        <p className="text-[10px] mt-1">Start an orchestration to see live logs</p>
                      </div>
                    )}
                  </ScrollArea>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AgentsPage;
