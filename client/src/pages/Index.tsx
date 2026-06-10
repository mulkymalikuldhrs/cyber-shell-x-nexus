import React, { useState, useEffect, useCallback } from 'react';
import { 
  Shield, Scan, Eye, Bot, Wrench, BarChart3, FileText, 
  Settings, LogIn, Terminal, Brain, Zap, Database, Cloud,
  Cpu, Globe, Code, Activity, Bell, ChevronRight
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
import { useNavigate } from 'react-router-dom';

const features = [
  {
    icon: <Zap className="w-8 h-8" />,
    title: "Multi-LLM AI Router",
    description: "Gemini, OpenAI, Anthropic, Ollama with automatic fallback chain and response caching",
    color: "from-yellow-500 to-orange-500"
  },
  {
    icon: <Terminal className="w-8 h-8" />,
    title: "Adaptive CLI Interface",
    description: "Dark/Light mode, colored logs, emojis, and interactive hints for optimal UX",
    color: "from-green-500 to-teal-500"
  },
  {
    icon: <Cpu className="w-8 h-8" />,
    title: "Multi-Agent System",
    description: "5 specialized agents (Recon, Vuln, Exploit, Analysis, Report) with orchestration",
    color: "from-blue-500 to-purple-500"
  },
  {
    icon: <Cloud className="w-8 h-8" />,
    title: "Vulnerability Scanner",
    description: "7 vulnerability type analyzers with LLM-powered analysis and confidence scoring",
    color: "from-purple-500 to-pink-500"
  },
  {
    icon: <Brain className="w-8 h-8" />,
    title: "Reconnaissance Engine",
    description: "Subdomain enum, TLS analysis, JS secret scanning, security headers, tech fingerprinting",
    color: "from-pink-500 to-red-500"
  },
  {
    icon: <Database className="w-8 h-8" />,
    title: "Risk & CVSS Engine",
    description: "CVSS v3.1 scoring, false positive reduction, business impact assessment",
    color: "from-red-500 to-orange-500"
  },
  {
    icon: <Shield className="w-8 h-8" />,
    title: "5-Layer Safety Pipeline",
    description: "Guardrails, validation, fact-check, consistency, and correction layers",
    color: "from-teal-500 to-blue-500"
  },
  {
    icon: <BarChart3 className="w-8 h-8" />,
    title: "20+ Tool Integrations",
    description: "nmap, nuclei, sqlmap, ffuf, gobuster and more with safety controls",
    color: "from-indigo-500 to-purple-500"
  }
];

const quickLinks = [
  { icon: <Scan className="w-5 h-5" />, label: 'Scan', path: '/scan', color: 'text-red-400' },
  { icon: <Eye className="w-5 h-5" />, label: 'Recon', path: '/recon', color: 'text-cyan-400' },
  { icon: <Bot className="w-5 h-5" />, label: 'Agents', path: '/agents', color: 'text-purple-400' },
  { icon: <Wrench className="w-5 h-5" />, label: 'Tools', path: '/tools', color: 'text-yellow-400' },
  { icon: <BarChart3 className="w-5 h-5" />, label: 'Risk', path: '/risk', color: 'text-orange-400' },
  { icon: <FileText className="w-5 h-5" />, label: 'Reports', path: '/reports', color: 'text-green-400' },
];

const Index = () => {
  const [activeTab, setActiveTab] = useState('demo');
  const [stats, setStats] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('/api/dashboard/stats')
      .then(r => r.json())
      .then(setStats)
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white overflow-hidden">
      {/* Animated background */}
      <div className="fixed inset-0 opacity-30" aria-hidden="true">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 animate-pulse"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(0,255,255,0.1),transparent_50%)]"></div>
      </div>

      <div className="relative z-10">
        <Hero />

        {/* Quick Navigation Cards */}
        <section className="py-10 px-4" aria-label="Quick navigation">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
              {quickLinks.map(link => (
                <button
                  key={link.path}
                  onClick={() => navigate(link.path)}
                  className="flex flex-col items-center gap-2 p-4 bg-gray-800/50 rounded-lg border border-gray-700 hover:border-cyan-500/50 transition-all hover:scale-105"
                >
                  <span className={link.color}>{link.icon}</span>
                  <span className="text-sm font-medium">{link.label}</span>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Dashboard Stats */}
        {stats && (
          <section className="py-10 px-4" aria-label="Dashboard statistics">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'Total Scans', value: stats.totalScans, icon: <Scan className="w-5 h-5" />, color: 'text-cyan-400' },
                  { label: 'Findings', value: stats.totalFindings, icon: <Shield className="w-5 h-5" />, color: 'text-red-400' },
                  { label: 'Critical', value: stats.criticalFindings, icon: <Activity className="w-5 h-5" />, color: 'text-orange-400' },
                  { label: 'LLM Providers', value: stats.llmProviders?.length || 0, icon: <Brain className="w-5 h-5" />, color: 'text-purple-400' },
                ].map(stat => (
                  <Card key={stat.label} className="bg-gray-800/50 border-gray-700">
                    <CardContent className="p-4 flex items-center gap-3">
                      <span className={stat.color}>{stat.icon}</span>
                      <div>
                        <div className="text-2xl font-bold">{stat.value}</div>
                        <div className="text-xs text-gray-400">{stat.label}</div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        )}
        
        {/* Terminal Interface Section */}
        <section id="terminal-section" className="py-20 px-4" aria-label="Interactive terminal">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-4">
                Interactive Terminal Interface
              </h2>
              <p className="text-xl text-gray-300 mb-8">
                Experience the power of CyberShellX Nexus in action
              </p>
              
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
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
                  <div className="text-center mb-6">
                    <p className="text-gray-400">
                      Interactive demo showing CyberShellX capabilities
                    </p>
                  </div>
                  <TerminalInterface />
                </TabsContent>
                
                <TabsContent value="live">
                  <div className="text-center mb-6">
                    <p className="text-gray-400">
                      Connect to your CyberShellX server for real interaction
                    </p>
                  </div>
                  <CyberShellXTerminal />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-20 px-4" aria-label="Core features">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-4">
                Upgraded Platform Features
              </h2>
              <p className="text-xl text-gray-300">
                Integrating the best from 6 source repositories into one unified platform
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => (
                <FeatureCard
                  key={feature.title}
                  {...feature}
                  delay={index * 0.1}
                />
              ))}
            </div>
          </div>
        </section>

        {/* GitHub & Open Source */}
        <GitHubSection />

        {/* Mobile App */}
        <MobileAppSection />

        {/* Installation Guide */}
        <section className="py-20 px-4 border-t border-gray-800" aria-label="Installation guide">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                Quick Start Guide
              </h2>
              <p className="text-xl text-gray-300">
                Get CyberShellX Nexus running in minutes
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-cyan-400 mb-4">🖥️ Server Setup</h3>
                <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-400 mb-2">1. Install dependencies:</p>
                      <code className="bg-black/50 px-3 py-1 rounded text-green-400 text-sm block">
                        npm install
                      </code>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400 mb-2">2. Configure environment:</p>
                      <code className="bg-black/50 px-3 py-1 rounded text-cyan-400 text-sm block">
                        cp .env.example .env
                      </code>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400 mb-2">3. Start development:</p>
                      <code className="bg-black/50 px-3 py-1 rounded text-green-400 text-sm block">
                        npm run dev
                      </code>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-purple-400 mb-4">🔑 API Keys</h3>
                <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-400 mb-2">Google Gemini:</p>
                      <code className="bg-black/50 px-3 py-1 rounded text-yellow-400 text-sm block">
                        GOOGLE_API_KEY=your_key
                      </code>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400 mb-2">OpenAI:</p>
                      <code className="bg-black/50 px-3 py-1 rounded text-yellow-400 text-sm block">
                        OPENAI_API_KEY=your_key
                      </code>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400 mb-2">Ollama (local):</p>
                      <code className="bg-black/50 px-3 py-1 rounded text-yellow-400 text-sm block">
                        OLLAMA_BASE_URL=http://localhost:11434
                      </code>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-12 p-6 bg-gradient-to-r from-gray-800/50 to-gray-900/50 rounded-xl border border-gray-700">
              <h3 className="text-xl font-bold text-yellow-400 mb-4">🚀 Quick Commands</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-400 mb-2">Terminal Commands:</p>
                  <ul className="space-y-1 text-cyan-400 font-mono">
                    <li>• help</li>
                    <li>• scan network</li>
                    <li>• check vulnerabilities</li>
                    <li>• sql injection</li>
                  </ul>
                </div>
                <div>
                  <p className="text-gray-400 mb-2">API Endpoints:</p>
                  <ul className="space-y-1 text-cyan-400 font-mono">
                    <li>• POST /api/scan/start</li>
                    <li>• POST /api/recon/start</li>
                    <li>• GET /api/agents/status</li>
                    <li>• GET /api/tools</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Donations */}
        <DonationSection />

        {/* Footer */}
        <footer className="py-12 px-4 border-t border-gray-800">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-8">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-4">
                CyberShellX Nexus
              </h3>
              <p className="text-gray-400 max-w-2xl mx-auto">
                The unified cybersecurity training and testing platform. Integrating the best concepts from 6 source repositories.
              </p>
            </div>
            <div className="space-y-2">
              <div className="text-gray-500 text-sm">
                © 2025 CyberShellX Nexus - Autonomous Cybersecurity Platform
              </div>
              <div className="text-gray-400 text-sm">
                For educational and authorized testing purposes only
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Index;
