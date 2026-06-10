import React, { useState, useEffect, useCallback } from 'react';
import { Bot, Activity, Play, Pause, Square, RefreshCw, Loader2, Cpu, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Progress } from '../components/ui/progress';
import { ScrollArea } from '../components/ui/scroll-area';

interface AgentState {
  id: string;
  type: string;
  status: 'idle' | 'running' | 'paused' | 'completed' | 'error';
  progress: number;
  completedTasks: number;
  errors: string[];
  lastActivity: string;
}

const AGENT_ICONS: Record<string, React.ReactNode> = {
  recon: <Activity className="w-5 h-5" />,
  vuln: <Zap className="w-5 h-5" />,
  exploit: <Bot className="w-5 h-5" />,
  analysis: <Cpu className="w-5 h-5" />,
  report: <Bot className="w-5 h-5" />,
};

const AGENT_COLORS: Record<string, string> = {
  recon: 'text-cyan-400',
  vuln: 'text-red-400',
  exploit: 'text-orange-400',
  analysis: 'text-purple-400',
  report: 'text-green-400',
};

const STATUS_COLORS: Record<string, string> = {
  idle: 'bg-gray-500/20 text-gray-400',
  running: 'bg-cyan-500/20 text-cyan-400',
  paused: 'bg-yellow-500/20 text-yellow-400',
  completed: 'bg-green-500/20 text-green-400',
  error: 'bg-red-500/20 text-red-400',
};

const AgentsPage = () => {
  const [agents, setAgents] = useState<AgentState[]>([]);
  const [isOrchestrating, setIsOrchestrating] = useState(false);
  const [target, setTarget] = useState('');
  const [phase, setPhase] = useState('');

  const fetchStatus = useCallback(async () => {
    try {
      const res = await fetch('/api/agents/status');
      if (res.ok) {
        const data = await res.json();
        setAgents(data.agents || []);
        setIsOrchestrating(data.isRunning);
      }
    } catch {}
  }, []);

  useEffect(() => { const interval = setInterval(fetchStatus, 3000); return () => clearInterval(interval); }, [fetchStatus]);

  const startOrchestration = async () => {
    if (!target.trim()) return;
    setIsOrchestrating(true);

    try {
      const res = await fetch('/api/scan/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ target: target.trim(), type: 'full', agentMode: true }),
      });

      if (!res.ok) {
        setIsOrchestrating(false);
      }
    } catch {
      setIsOrchestrating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Bot className="w-8 h-8 text-purple-400" />
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Agent Monitoring
            </h1>
            <p className="text-gray-400">Multi-agent orchestration with 5 specialized agents</p>
          </div>
        </div>

        {/* Orchestration Controls */}
        <Card className="bg-gray-800/50 border-gray-700 mb-6">
          <CardContent className="p-6">
            <div className="flex gap-4 items-end">
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
                className="bg-purple-600 hover:bg-purple-700"
              >
                {isOrchestrating ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Running...</>
                ) : (
                  <><Play className="w-4 h-4 mr-2" /> Start Full Scan</>
                )}
              </Button>
              <Button variant="outline" size="icon" onClick={fetchStatus}>
                <RefreshCw className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Agent Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {agents.length > 0 ? agents.map(agent => (
            <Card key={agent.id} className="bg-gray-800/50 border-gray-700">
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <span className={AGENT_COLORS[agent.type]}>
                    {AGENT_ICONS[agent.type]}
                  </span>
                  <div className="flex-1">
                    <h3 className="font-bold capitalize">{agent.type} Agent</h3>
                    <Badge className={`text-xs ${STATUS_COLORS[agent.status]}`}>
                      {agent.status}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-2">
                  <div>
                    <div className="flex justify-between text-xs text-gray-400 mb-1">
                      <span>Progress</span>
                      <span>{agent.progress}%</span>
                    </div>
                    <Progress value={agent.progress} className="h-1.5" />
                  </div>
                  <div className="text-xs text-gray-400">
                    Completed: {agent.completedTasks}
                  </div>
                  {agent.errors.length > 0 && (
                    <div className="text-xs text-red-400">
                      Errors: {agent.errors.length}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )) : (
            // Default agent display
            ['recon', 'vuln', 'exploit', 'analysis', 'report'].map(type => (
              <Card key={type} className="bg-gray-800/50 border-gray-700">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <span className={AGENT_COLORS[type]}>{AGENT_ICONS[type]}</span>
                    <div className="flex-1">
                      <h3 className="font-bold capitalize">{type} Agent</h3>
                      <Badge className="text-xs bg-gray-500/20 text-gray-400">idle</Badge>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <div className="flex justify-between text-xs text-gray-400 mb-1">
                        <span>Progress</span><span>0%</span>
                      </div>
                      <Progress value={0} className="h-1.5" />
                    </div>
                    <div className="text-xs text-gray-400">Completed: 0</div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Pipeline Visualization */}
        <Card className="bg-gray-800/50 border-gray-700 mt-6">
          <CardHeader>
            <CardTitle className="text-cyan-400">Agent Pipeline</CardTitle>
            <CardDescription className="text-gray-400">
              5-phase PTES workflow: Recon → Vuln → Exploit → Analysis → Report
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between gap-2 overflow-x-auto">
              {['Recon', 'Vuln', 'Exploit', 'Analysis', 'Report'].map((phase, i) => {
                const agentType = phase.toLowerCase() as keyof typeof AGENT_COLORS;
                const isActive = agents.find(a => a.type === agentType)?.status === 'running';
                return (
                  <React.Fragment key={phase}>
                    <div className={`flex flex-col items-center gap-2 p-4 rounded-lg border min-w-[120px] ${
                      isActive ? 'border-cyan-500 bg-cyan-500/10' : 'border-gray-700 bg-gray-900/50'
                    }`}>
                      <span className={AGENT_COLORS[agentType]}>{AGENT_ICONS[agentType]}</span>
                      <span className="text-sm font-medium">{phase}</span>
                      <Badge variant="outline" className="text-xs">
                        {isActive ? 'Running' : 'Idle'}
                      </Badge>
                    </div>
                    {i < 4 && <div className="text-gray-600">→</div>}
                  </React.Fragment>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AgentsPage;
