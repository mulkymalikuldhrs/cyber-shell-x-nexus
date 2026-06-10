import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Shield, Scan, Eye, Bot, Wrench, BarChart3, FileText,
  Settings, Terminal, Brain, Zap, Database, Cloud,
  Cpu, Globe, Code, Activity, ChevronRight, Clock,
  CheckCircle, AlertTriangle, Server, Wifi, ArrowUpRight,
  TrendingUp, Users, Lock, RefreshCw
} from 'lucide-react';
import TerminalInterface from '../components/TerminalInterface';
import CyberShellXTerminal from '../components/CyberShellXTerminal';
import FeatureCard from '../components/FeatureCard';
import Hero from '../components/Hero';
import GitHubSection from '../components/GitHubSection';
import DonationSection from '../components/DonationSection';
import MobileAppSection from '../components/MobileAppSection';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Progress } from '../components/ui/progress';
import { ScrollArea } from '../components/ui/scroll-area';
import { useNavigate } from 'react-router-dom';

// Animated counter hook
function useAnimatedCounter(target: number, duration: number = 1500) {
  const [count, setCount] = useState(0);
  const prevTarget = useRef(0);

  useEffect(() => {
    if (target === prevTarget.current) return;
    prevTarget.current = target;
    const startTime = Date.now();
    const startVal = count;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(startVal + (target - startVal) * eased));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [target, duration]);

  return count;
}

const features = [
  { icon: <Zap className="w-8 h-8" />, title: "Multi-LLM AI Router", description: "Gemini, OpenAI, Anthropic, Ollama with automatic fallback chain and response caching", color: "from-yellow-500 to-orange-500" },
  { icon: <Terminal className="w-8 h-8" />, title: "Adaptive CLI Interface", description: "Dark/Light mode, colored logs, emojis, and interactive hints for optimal UX", color: "from-green-500 to-teal-500" },
  { icon: <Cpu className="w-8 h-8" />, title: "Multi-Agent System", description: "5 specialized agents (Recon, Vuln, Exploit, Analysis, Report) with orchestration", color: "from-blue-500 to-purple-500" },
  { icon: <Cloud className="w-8 h-8" />, title: "Vulnerability Scanner", description: "7 vulnerability type analyzers with LLM-powered analysis and confidence scoring", color: "from-purple-500 to-pink-500" },
  { icon: <Brain className="w-8 h-8" />, title: "Reconnaissance Engine", description: "Subdomain enum, TLS analysis, JS secret scanning, security headers, tech fingerprinting", color: "from-pink-500 to-red-500" },
  { icon: <Database className="w-8 h-8" />, title: "Risk & CVSS Engine", description: "CVSS v3.1 scoring, false positive reduction, business impact assessment", color: "from-red-500 to-orange-500" },
  { icon: <Shield className="w-8 h-8" />, title: "5-Layer Safety Pipeline", description: "Guardrails, validation, fact-check, consistency, and correction layers", color: "from-teal-500 to-blue-500" },
  { icon: <BarChart3 className="w-8 h-8" />, title: "20+ Tool Integrations", description: "nmap, nuclei, sqlmap, ffuf, gobuster and more with safety controls", color: "from-indigo-500 to-purple-500" }
];

const quickLinks = [
  { icon: <Scan className="w-5 h-5" />, label: 'Scan', path: '/scan', color: 'text-red-400', bg: 'from-red-500/20 to-red-600/20', border: 'border-red-500/30' },
  { icon: <Eye className="w-5 h-5" />, label: 'Recon', path: '/recon', color: 'text-cyan-400', bg: 'from-cyan-500/20 to-cyan-600/20', border: 'border-cyan-500/30' },
  { icon: <Bot className="w-5 h-5" />, label: 'Agents', path: '/agents', color: 'text-purple-400', bg: 'from-purple-500/20 to-purple-600/20', border: 'border-purple-500/30' },
  { icon: <Wrench className="w-5 h-5" />, label: 'Tools', path: '/tools', color: 'text-yellow-400', bg: 'from-yellow-500/20 to-yellow-600/20', border: 'border-yellow-500/30' },
  { icon: <BarChart3 className="w-5 h-5" />, label: 'Risk', path: '/risk', color: 'text-orange-400', bg: 'from-orange-500/20 to-orange-600/20', border: 'border-orange-500/30' },
  { icon: <FileText className="w-5 h-5" />, label: 'Reports', path: '/reports', color: 'text-green-400', bg: 'from-green-500/20 to-green-600/20', border: 'border-green-500/30' },
];

const Index = () => {
  const [activeTab, setActiveTab] = useState('demo');
  const [stats, setStats] = useState<any>(null);
  const [llmProviders, setLlmProviders] = useState<any[]>([]);
  const [systemHealth, setSystemHealth] = useState<any>(null);
  const [activities, setActivities] = useState<any[]>([]);
  const navigate = useNavigate();

  const totalScans = useAnimatedCounter(stats?.totalScans || 0);
  const totalFindings = useAnimatedCounter(stats?.totalFindings || 0);
  const criticalFindings = useAnimatedCounter(stats?.criticalFindings || 0);
  const providerCount = useAnimatedCounter(stats?.llmProviders?.length || llmProviders.length || 0);

  useEffect(() => {
    fetch('/api/dashboard/stats')
      .then(r => r.json())
      .then(setStats)
      .catch(() => {});
  }, []);

  useEffect(() => {
    fetch('/api/llm/providers')
      .then(r => r.json())
      .then(data => setLlmProviders(data.providers || []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    fetch('/api/scans')
      .then(r => r.json())
      .then(scans => {
        const recent = scans.slice(0, 8).map((s: any) => ({
          id: s.id,
          type: 'scan',
          action: `Scan ${s.status}: ${s.target}`,
          time: s.startedAt,
          status: s.status,
          findings: s.findings?.length || 0
        }));
        setActivities(recent);
      })
      .catch(() => {});
  }, []);

  const fetchSystemHealth = useCallback(async () => {
    try {
      const [agentsRes, toolsRes] = await Promise.all([
        fetch('/api/agents/status'),
        fetch('/api/tools')
      ]);
      const agentsData = agentsRes.ok ? await agentsRes.json() : null;
      const toolsData = toolsRes.ok ? await toolsRes.json() : null;

      setSystemHealth({
        agents: agentsData?.agents?.length || 0,
        agentsRunning: agentsData?.agents?.filter((a: any) => a.status === 'running').length || 0,
        tools: toolsData?.length || 0,
        toolsInstalled: toolsData?.filter((t: any) => t.installed).length || 0,
        uptime: Math.floor(performance.now() / 1000),
        status: 'operational'
      });
    } catch {
      setSystemHealth({ status: 'degraded', agents: 0, tools: 0, uptime: 0 });
    }
  }, []);

  useEffect(() => {
    fetchSystemHealth();
    const interval = setInterval(fetchSystemHealth, 30000);
    return () => clearInterval(interval);
  }, [fetchSystemHealth]); // eslint-disable-line react-hooks/exhaustive-deps

  const formatUptime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    return `${h}h ${m}m`;
  };

  const statCards = [
    { label: 'Total Scans', value: totalScans, icon: <Scan className="w-5 h-5" />, color: 'text-cyan-400', bg: 'from-cyan-500/10 to-cyan-600/5', border: 'border-cyan-500/20' },
    { label: 'Findings', value: totalFindings, icon: <Shield className="w-5 h-5" />, color: 'text-red-400', bg: 'from-red-500/10 to-red-600/5', border: 'border-red-500/20' },
    { label: 'Critical', value: criticalFindings, icon: <AlertTriangle className="w-5 h-5" />, color: 'text-orange-400', bg: 'from-orange-500/10 to-orange-600/5', border: 'border-orange-500/20' },
    { label: 'LLM Providers', value: providerCount, icon: <Brain className="w-5 h-5" />, color: 'text-purple-400', bg: 'from-purple-500/10 to-purple-600/5', border: 'border-purple-500/20' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white overflow-hidden pt-14">
      {/* Animated background */}
      <div className="fixed inset-0 opacity-20 pointer-events-none" aria-hidden="true">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 animate-pulse" />
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(0,255,255,0.08),transparent_50%)]" />
      </div>

      <div className="relative z-10">
        {/* Dashboard Header */}
        <section className="py-6 px-4" aria-label="Dashboard header">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-4 mb-2">
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/20">
                <Shield className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                  CyberShellX Nexus
                </h1>
                <p className="text-gray-400 text-sm">Autonomous Cybersecurity Platform Dashboard</p>
              </div>
              <Badge variant="outline" className="ml-2 text-[10px] px-1.5 py-0 border-cyan-500/30 text-cyan-400">
                v3.0
              </Badge>
            </div>
          </div>
        </section>

        {/* Live Stats Cards */}
        <section className="pb-6 px-4" aria-label="Live statistics">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {statCards.map((stat, i) => (
                <Card key={stat.label} className={`bg-gradient-to-br ${stat.bg} border ${stat.border} hover:scale-[1.02] transition-transform duration-200`}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className={`${stat.color} opacity-70`}>{stat.icon}</span>
                      <TrendingUp className="w-3 h-3 text-green-400/50" />
                    </div>
                    <div className="text-3xl font-bold tabular-nums">{stat.value}</div>
                    <div className="text-xs text-gray-400 mt-1">{stat.label}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Quick Action Navigation */}
        <section className="pb-6 px-4" aria-label="Quick navigation">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-sm font-medium text-gray-400 mb-3 uppercase tracking-wider">Quick Actions</h2>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
              {quickLinks.map(link => (
                <button
                  key={link.path}
                  onClick={() => navigate(link.path)}
                  className={`group flex flex-col items-center gap-2 p-4 bg-gradient-to-br ${link.bg} rounded-xl border ${link.border} hover:scale-105 transition-all duration-200 hover:shadow-lg`}
                >
                  <span className={`${link.color} group-hover:scale-110 transition-transform`}>{link.icon}</span>
                  <span className="text-xs font-medium text-gray-300">{link.label}</span>
                  <ArrowUpRight className="w-3 h-3 text-gray-500 group-hover:text-gray-300 transition-colors" />
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* System Health + Activity Feed Row */}
        <section className="pb-6 px-4" aria-label="System status and activity">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* System Health Check */}
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-cyan-400 flex items-center gap-2">
                      <Activity className="w-5 h-5" /> System Health
                    </CardTitle>
                    <Button variant="ghost" size="sm" onClick={fetchSystemHealth} className="text-gray-400 h-8 w-8 p-0">
                      <RefreshCw className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {systemHealth ? (
                    <div className="space-y-4">
                      {/* Overall Status */}
                      <div className="flex items-center gap-3 p-3 bg-gray-900/50 rounded-lg border border-gray-700">
                        <div className={`w-3 h-3 rounded-full ${systemHealth.status === 'operational' ? 'bg-green-400 animate-pulse' : 'bg-yellow-400 animate-pulse'}`} />
                        <span className="text-sm font-medium">
                          {systemHealth.status === 'operational' ? 'All Systems Operational' : 'Partial Degradation'}
                        </span>
                      </div>

                      {/* Health Metrics */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="p-3 bg-gray-900/30 rounded-lg border border-gray-700/50">
                          <div className="flex items-center gap-2 mb-1">
                            <Bot className="w-4 h-4 text-purple-400" />
                            <span className="text-xs text-gray-400">Agents</span>
                          </div>
                          <div className="text-lg font-bold">{systemHealth.agents} <span className="text-xs text-green-400">{systemHealth.agentsRunning} running</span></div>
                        </div>
                        <div className="p-3 bg-gray-900/30 rounded-lg border border-gray-700/50">
                          <div className="flex items-center gap-2 mb-1">
                            <Wrench className="w-4 h-4 text-yellow-400" />
                            <span className="text-xs text-gray-400">Tools</span>
                          </div>
                          <div className="text-lg font-bold">{systemHealth.tools} <span className="text-xs text-green-400">{systemHealth.toolsInstalled} installed</span></div>
                        </div>
                        <div className="p-3 bg-gray-900/30 rounded-lg border border-gray-700/50">
                          <div className="flex items-center gap-2 mb-1">
                            <Server className="w-4 h-4 text-cyan-400" />
                            <span className="text-xs text-gray-400">Uptime</span>
                          </div>
                          <div className="text-lg font-bold">{formatUptime(systemHealth.uptime)}</div>
                        </div>
                        <div className="p-3 bg-gray-900/30 rounded-lg border border-gray-700/50">
                          <div className="flex items-center gap-2 mb-1">
                            <Wifi className="w-4 h-4 text-green-400" />
                            <span className="text-xs text-gray-400">API Status</span>
                          </div>
                          <div className="text-lg font-bold text-green-400">Connected</div>
                        </div>
                      </div>

                      {/* Safety Pipeline Status */}
                      <div className="p-3 bg-gray-900/30 rounded-lg border border-gray-700/50">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs text-gray-400">Safety Pipeline</span>
                          <Badge className="text-[10px] bg-green-500/20 text-green-400 border-green-500/30">5/5 Active</Badge>
                        </div>
                        <Progress value={100} className="h-1.5" />
                        <div className="flex justify-between mt-1">
                          {['Guard', 'Valid', 'Fact', 'Consist', 'Correct'].map((l, i) => (
                            <span key={i} className="text-[9px] text-green-400/70">{l}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center py-8">
                      <RefreshCw className="w-5 h-5 text-gray-500 animate-spin" />
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Recent Activity Feed */}
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-cyan-400 flex items-center gap-2">
                      <Clock className="w-5 h-5" /> Recent Activity
                    </CardTitle>
                    <Badge variant="outline" className="text-xs">{activities.length} events</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="max-h-72">
                    {activities.length > 0 ? (
                      <div className="space-y-2">
                        {activities.map((activity, i) => (
                          <div key={activity.id || i} className="flex items-center gap-3 p-2.5 bg-gray-900/50 rounded-lg border border-gray-700/50 hover:border-gray-600 transition-colors">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                              activity.status === 'completed' ? 'bg-green-500/20' :
                              activity.status === 'running' ? 'bg-cyan-500/20' :
                              activity.status === 'failed' ? 'bg-red-500/20' : 'bg-gray-500/20'
                            }`}>
                              {activity.status === 'completed' ? <CheckCircle className="w-4 h-4 text-green-400" /> :
                               activity.status === 'running' ? <Activity className="w-4 h-4 text-cyan-400 animate-pulse" /> :
                               <AlertTriangle className="w-4 h-4 text-red-400" />}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">{activity.action}</p>
                              <p className="text-xs text-gray-500">{new Date(activity.time).toLocaleString()}</p>
                            </div>
                            {activity.findings > 0 && (
                              <Badge variant="outline" className="text-xs shrink-0">{activity.findings} findings</Badge>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">No recent activity</p>
                        <p className="text-xs mt-1">Start a scan to see activity here</p>
                      </div>
                    )}
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* LLM Provider Status */}
        <section className="pb-6 px-4" aria-label="LLM providers">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-sm font-medium text-gray-400 mb-3 uppercase tracking-wider">LLM Provider Status</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              {llmProviders.length > 0 ? llmProviders.map((provider, i) => (
                <Card key={i} className={`bg-gray-800/50 border ${provider.available ? 'border-green-500/30' : 'border-gray-700'}`}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-sm">{provider.name}</span>
                      <div className={`w-2 h-2 rounded-full ${provider.available ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`} />
                    </div>
                    <p className="text-xs text-gray-400 mb-2">{provider.model}</p>
                    <Badge variant={provider.available ? 'default' : 'destructive'} className="text-[10px]">
                      {provider.available ? 'Available' : 'Unavailable'}
                    </Badge>
                    {provider.priority && (
                      <span className="text-[10px] text-gray-500 ml-2">Priority: {provider.priority}</span>
                    )}
                  </CardContent>
                </Card>
              )) : (
                ['Gemini', 'OpenAI', 'Anthropic', 'Ollama'].map((name, i) => (
                  <Card key={i} className="bg-gray-800/30 border-gray-700/50 animate-pulse">
                    <CardContent className="p-4">
                      <div className="h-4 bg-gray-700/50 rounded w-20 mb-2" />
                      <div className="h-3 bg-gray-700/30 rounded w-28 mb-3" />
                      <div className="h-5 bg-gray-700/30 rounded w-16" />
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        </section>

        {/* Quick Navigation Cards (old Hero section, kept below dashboard) */}
        <Hero />

        {/* Terminal Interface Section */}
        <section id="terminal-section" className="py-10 px-4" aria-label="Interactive terminal">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-3">
                Interactive Terminal Interface
              </h2>
              <p className="text-lg text-gray-300 mb-6">
                Experience the power of CyberShellX Nexus in action
              </p>

              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-6">
                  <TabsTrigger value="demo" className="flex items-center space-x-2">
                    <Globe className="w-4 h-4" aria-hidden="true" />
                    <span>Demo Mode</span>
                  </TabsTrigger>
                  <TabsTrigger value="live" className="flex items-center space-x-2">
                    <Code className="w-4 h-4" aria-hidden="true" />
                    <span>Live Terminal</span>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="demo">
                  <div className="text-center mb-4">
                    <p className="text-gray-400">Interactive demo showing CyberShellX capabilities</p>
                  </div>
                  <TerminalInterface />
                </TabsContent>

                <TabsContent value="live">
                  <div className="text-center mb-4">
                    <p className="text-gray-400">Connect to your CyberShellX server for real interaction</p>
                  </div>
                  <CyberShellXTerminal />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-10 px-4" aria-label="Core features">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-3">
                Upgraded Platform Features
              </h2>
              <p className="text-lg text-gray-300">
                Integrating the best from 6 source repositories into one unified platform
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => (
                <FeatureCard key={feature.title} {...feature} delay={index * 0.1} />
              ))}
            </div>
          </div>
        </section>

        {/* GitHub & Open Source */}
        <GitHubSection />

        {/* Mobile App */}
        <MobileAppSection />

        {/* Donations */}
        <DonationSection />

        {/* Footer */}
        <footer className="py-12 px-4 border-t border-gray-800">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-6">
              <h3 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-3">
                CyberShellX Nexus
              </h3>
              <p className="text-gray-400 max-w-2xl mx-auto text-sm">
                The unified cybersecurity training and testing platform. Integrating the best concepts from 6 source repositories.
              </p>
            </div>
            <div className="space-y-1">
              <div className="text-gray-500 text-xs">&copy; 2025 CyberShellX Nexus - Autonomous Cybersecurity Platform</div>
              <div className="text-gray-400 text-xs">For educational and authorized testing purposes only</div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Index;
