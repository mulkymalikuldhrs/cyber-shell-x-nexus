import React, { useState, useEffect } from 'react';
import { Wrench, Play, CheckCircle, XCircle, AlertTriangle, RefreshCw, Loader2, Shield } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { ScrollArea } from '../components/ui/scroll-area';

interface Tool {
  name: string;
  category: string;
  description: string;
  safetyLevel: 'safe' | 'moderate' | 'dangerous';
  command: string;
  options?: Record<string, string>;
  enabled: boolean;
  installed: boolean;
}

const SAFETY_COLORS: Record<string, string> = {
  safe: 'bg-green-500/20 text-green-400',
  moderate: 'bg-yellow-500/20 text-yellow-400',
  dangerous: 'bg-red-500/20 text-red-400',
};

const CATEGORIES = ['all', 'network', 'web', 'fuzzing', 'exploitation', 'recon', 'crypto'];

const ToolsPage = () => {
  const [tools, setTools] = useState<Tool[]>([]);
  const [category, setCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [executing, setExecuting] = useState<string | null>(null);
  const [output, setOutput] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchTools();
  }, []);

  const fetchTools = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/tools');
      if (res.ok) {
        const data = await res.json();
        setTools(data);
      }
    } catch {}
    setLoading(false);
  };

  const executeTool = async (toolName: string, target: string) => {
    setExecuting(toolName);
    try {
      const res = await fetch('/api/tools/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ toolName, target }),
      });
      const data = await res.json();
      setOutput(prev => ({ ...prev, [toolName]: data.output || data.error }));
    } catch (err) {
      setOutput(prev => ({ ...prev, [toolName]: 'Execution failed' }));
    }
    setExecuting(null);
  };

  const filteredTools = category === 'all' ? tools : tools.filter(t => t.category === category);

  const toolCounts = {
    total: tools.length,
    installed: tools.filter(t => t.installed).length,
    enabled: tools.filter(t => t.enabled).length,
    dangerous: tools.filter(t => t.safetyLevel === 'dangerous').length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Wrench className="w-8 h-8 text-yellow-400" />
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
              Security Tools
            </h1>
            <p className="text-gray-400">20+ integrated security tools with safety controls</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Total Tools', value: toolCounts.total, color: 'text-cyan-400' },
            { label: 'Installed', value: toolCounts.installed, color: 'text-green-400' },
            { label: 'Enabled', value: toolCounts.enabled, color: 'text-yellow-400' },
            { label: 'Dangerous', value: toolCounts.dangerous, color: 'text-red-400' },
          ].map(stat => (
            <Card key={stat.label} className="bg-gray-800/50 border-gray-700">
              <CardContent className="p-4 text-center">
                <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
                <div className="text-xs text-gray-400">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {CATEGORIES.map(cat => (
            <Button
              key={cat}
              variant={category === cat ? 'default' : 'outline'}
              size="sm"
              onClick={() => setCategory(cat)}
              className={category === cat ? 'bg-yellow-600' : ''}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </Button>
          ))}
          <Button variant="outline" size="sm" onClick={fetchTools}>
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>

        {/* Tools Grid */}
        {loading ? (
          <div className="text-center py-12"><Loader2 className="w-8 h-8 text-yellow-400 animate-spin mx-auto" /></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTools.map(tool => (
              <Card key={tool.name} className="bg-gray-800/50 border-gray-700">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-bold text-lg">{tool.name}</h3>
                      <p className="text-sm text-gray-400">{tool.description}</p>
                    </div>
                    <Badge className={`text-xs ${SAFETY_COLORS[tool.safetyLevel]}`}>
                      {tool.safetyLevel}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant="outline" className="text-xs">{tool.category}</Badge>
                    {tool.installed ? (
                      <Badge className="text-xs bg-green-500/20 text-green-400"><CheckCircle className="w-3 h-3 mr-1" />Installed</Badge>
                    ) : (
                      <Badge className="text-xs bg-gray-500/20 text-gray-400"><XCircle className="w-3 h-3 mr-1" />Not Installed</Badge>
                    )}
                    {!tool.enabled && (
                      <Badge variant="destructive" className="text-xs">Disabled</Badge>
                    )}
                  </div>

                  <div className="font-mono text-xs bg-black/50 p-2 rounded mb-3 text-gray-300">
                    {tool.command} {tool.options ? Object.entries(tool.options).map(([k,v]) => `--${k} ${v}`).join(' ') : ''}
                  </div>

                  {output[tool.name] && (
                    <div className="font-mono text-xs bg-black/80 p-2 rounded mb-3 max-h-32 overflow-y-auto text-green-400">
                      {output[tool.name]}
                    </div>
                  )}

                  <Button
                    size="sm"
                    variant="outline"
                    disabled={!tool.installed || !tool.enabled || executing === tool.name}
                    onClick={() => executeTool(tool.name, 'example.com')}
                    className="w-full"
                  >
                    {executing === tool.name ? (
                      <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Simulating...</>
                    ) : (
                      <><Play className="w-4 h-4 mr-2" /> Simulate</>
                    )}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Legal Notice */}
        <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/50 rounded-lg">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5" />
            <p className="text-sm text-yellow-200">
              <strong>Legal Notice:</strong> Security tools should only be used in authorized contexts. 
              All tool executions on this platform are simulated for educational purposes. 
              Misuse of these tools may violate criminal and civil laws.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ToolsPage;
