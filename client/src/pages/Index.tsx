
import React, { useState, useEffect } from 'react';
import { Terminal, Brain, Shield, Zap, Database, Cloud, Cpu, BarChart3, Globe, Code } from 'lucide-react';
import TerminalInterface from '../components/TerminalInterface';
import CyberShellXTerminal from '../components/CyberShellXTerminal';
import FeatureCard from '../components/FeatureCard';
import Hero from '../components/Hero';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';

const Index = () => {
  const [activeTab, setActiveTab] = useState('demo');

  const features = [
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Multi-Model AI Router",
      description: "Supports OpenRouter, DeepInfra, LM Studio, Ollama with automatic fallback system",
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
      title: "Command Execution & Automation",
      description: "Execute scripts, install dependencies, and handle interactive tasks seamlessly",
      color: "from-blue-500 to-purple-500"
    },
    {
      icon: <Cloud className="w-8 h-8" />,
      title: "Sync & Self-Upgrade",
      description: "Auto-updates, cloud synchronization to Supabase/Firebase, and config backup",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: <Brain className="w-8 h-8" />,
      title: "Recursive Prompt Evolution",
      description: "Self-improving AI that updates its behavior and learns new capabilities",
      color: "from-pink-500 to-red-500"
    },
    {
      icon: <Database className="w-8 h-8" />,
      title: "Memory & Logging",
      description: "Comprehensive chat logs, task history, and error tracking with multiple formats",
      color: "from-red-500 to-orange-500"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Device Operations",
      description: "System control with safety modes and user confirmation for critical actions",
      color: "from-teal-500 to-blue-500"
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "Self-Learning Analysis",
      description: "Pattern recognition, error analysis, and intelligent recommendations",
      color: "from-indigo-500 to-purple-500"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white overflow-hidden">
      {/* Animated background */}
      <div className="fixed inset-0 opacity-30">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 animate-pulse"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(0,255,255,0.1),transparent_50%)]"></div>
      </div>

      <div className="relative z-10">
        <Hero />
        
        {/* Terminal Interface Section */}
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-4">
                Interactive Terminal Interface
              </h2>
              <p className="text-xl text-gray-300 mb-8">
                Experience the power of CyberShellX in action
              </p>
              
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
                  <TabsTrigger value="demo" className="flex items-center space-x-2">
                    <Globe className="w-4 h-4" />
                    <span>Demo Mode</span>
                  </TabsTrigger>
                  <TabsTrigger value="live" className="flex items-center space-x-2">
                    <Code className="w-4 h-4" />
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
                      Connect to your local CyberShellX Python server for real interaction
                    </p>
                  </div>
                  <CyberShellXTerminal />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-20 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-4">
                Core Features
              </h2>
              <p className="text-xl text-gray-300">
                8 Powerful Capabilities That Make CyberShellX Unique
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => (
                <FeatureCard
                  key={index}
                  {...feature}
                  delay={index * 0.1}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Installation Guide */}
        <section className="py-20 px-4 border-t border-gray-800">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                Quick Start Guide
              </h2>
              <p className="text-xl text-gray-300">
                Get CyberShellX running in minutes
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-cyan-400 mb-4">🐍 Python Backend</h3>
                <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-400 mb-2">1. Install dependencies:</p>
                      <code className="bg-black/50 px-3 py-1 rounded text-green-400 text-sm block">
                        pip install -r requirements.txt
                      </code>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400 mb-2">2. Start the server:</p>
                      <code className="bg-black/50 px-3 py-1 rounded text-green-400 text-sm block">
                        python3 cybershellx_server.py
                      </code>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400 mb-2">3. Server runs on:</p>
                      <code className="bg-black/50 px-3 py-1 rounded text-cyan-400 text-sm block">
                        ws://localhost:8765
                      </code>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-purple-400 mb-4">🌐 Web Interface</h3>
                <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-400 mb-2">1. This web interface:</p>
                      <code className="bg-black/50 px-3 py-1 rounded text-purple-400 text-sm block">
                        http://localhost:5173
                      </code>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400 mb-2">2. Click "Live Terminal" tab</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400 mb-2">3. Connect to Python server</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400 mb-2">4. Start using CyberShellX!</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-12 p-6 bg-gradient-to-r from-gray-800/50 to-gray-900/50 rounded-xl border border-gray-700">
              <h3 className="text-xl font-bold text-yellow-400 mb-4">🚀 Quick Commands</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-400 mb-2">Basic Commands:</p>
                  <ul className="space-y-1 text-cyan-400 font-mono">
                    <li>• help</li>
                    <li>• list tools</li>
                    <li>• chat hello</li>
                    <li>• install nmap</li>
                  </ul>
                </div>
                <div>
                  <p className="text-gray-400 mb-2">Advanced Operations:</p>
                  <ul className="space-y-1 text-cyan-400 font-mono">
                    <li>• prepare pentesting</li>
                    <li>• pentest example.com</li>
                    <li>• execute ls -la</li>
                    <li>• prepare blockchain</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Tech Stack */}
        <section className="py-20 px-4 border-t border-gray-800">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Built for Maximum Compatibility
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 text-gray-300">
              {['Android (Termux)', 'Linux VPS', 'Raspberry Pi', 'CloudShell', 'WSL (Windows)'].map((platform, index) => (
                <div key={index} className="p-4 bg-gray-800/50 rounded-lg border border-gray-700 hover:border-cyan-500/50 transition-colors">
                  <div className="text-cyan-400 font-semibold">{platform}</div>
                </div>
              ))}
            </div>
            <div className="mt-12 p-6 bg-gradient-to-r from-gray-800/50 to-gray-900/50 rounded-xl border border-gray-700">
              <h3 className="text-xl font-bold text-cyan-400 mb-4">Technology Stack</h3>
              <p className="text-gray-300 mb-4">
                <strong>Backend:</strong> Python 3.11+, WebSocket, asyncio, requests, colorama
              </p>
              <p className="text-gray-300">
                <strong>Frontend:</strong> React, TypeScript, Tailwind CSS, WebSocket API, shadcn/ui
              </p>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 px-4 border-t border-gray-800">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-8">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-4">
                CyberShellX
              </h3>
              <p className="text-gray-400 max-w-2xl mx-auto">
                More than just an assistant. This is a living terminal that thinks, acts, and evolves for you.
              </p>
            </div>
            <div className="space-y-2">
              <div className="text-gray-500 text-sm">
                © 2024 CyberShellX - Autonomous Command Line AI Assistant
              </div>
              <div className="text-gray-400 text-sm">
                made with love by Mulky Maliku Dhaher
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Index;
