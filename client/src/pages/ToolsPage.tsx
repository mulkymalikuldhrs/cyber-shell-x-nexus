import React, { useState, useEffect } from 'react';
import { Wrench, Play, CheckCircle, XCircle, AlertTriangle, RefreshCw, Loader2, Shield, Search, Globe, Server, Code, Bug, Lock, Terminal } from 'lucide-react';
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
  safe: 'bg-green-500/20 text-green-400 border-green-500/30',
  moderate: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  dangerous: 'bg-red-500/20 text-red-400 border-red-500/30',
};

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  all: <Wrench className="w-4 h-4" />,
  network: <Globe className="w-4 h-4" />,
  web: <Server className="w-4 h-4" />,
  fuzzing: <Code className="w-4 h-4" />,
  exploitation: <Bug className="w-4 h-4" />,
  recon: <Search className="w-4 h-4" />,
  crypto: <Lock className="w-4 h-4" />,
};

const CATEGORIES = ['all', 'network', 'web', 'fuzzing', 'exploitation', 'recon', 'crypto'];

const ToolsPage = () => {
  const [tools, setTools] = useState<Tool[]>([]);
  const [category, setCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [executing, setExecuting] = useState<string | null>(null);
  const [output, setOutput] = useState<Record<string, string>>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [toolTargets, setToolTargets] = useState<Record<string, string>>({});

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

  useEffect(() => {
    fetchTools();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const executeTool = async (toolName: string, target: string) => {
    setExecuting(toolName);
    try {
      const res = await fetch('/api/tools/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ toolName, target }),
      });
      const data = await res.json();
      setOutput(prev => ({ ...prev, [toolName]: data.output || data.error || 'No output' }));
    } catch (err) {
      setOutput(prev => ({ ...prev, [toolName]: 'Execution failed - connection error' }));
    }
    setExecuting(null);
  };

  const setToolTarget = (toolName: string, value: string) => {
    setToolTargets(prev => ({ ...prev, [toolName]: value }));
  };

  const filteredTools = tools.filter(t => {
    const matchesCategory = category === 'all' || t.category === category;
    const matchesSearch = !searchQuery || 
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toolCounts = {
    total: tools.length,
    installed: tools.filter(t => t.installed).length,
    enabled: tools.filter(t => t.enabled).length,
    dangerous: tools.filter(t => t.safetyLevel === 'dangerous').length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white pt-14">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-yellow-500/20">
            <Wrench className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
              Security Tools
            </h1>
            <p className="text-gray-400 text-sm">20+ integrated security tools with safety controls</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {[
            { label: 'Total Tools', value: toolCounts.total, color: 'text-cyan-400', bg: 'from-cyan-500/10 to-cyan-600/5', border: 'border-cyan-500/20' },
            { label: 'Installed', value: toolCounts.installed, color: 'text-green-400', bg: 'from-green-500/10 to-green-600/5', border: 'border-green-500/20' },
            { label: 'Enabled', value: toolCounts.enabled, color: 'text-yellow-400', bg: 'from-yellow-500/10 to-yellow-600/5', border: 'border-yellow-500/20' },
            { label: 'Dangerous', value: toolCounts.dangerous, color: 'text-red-400', bg: 'from-red-500/10 to-red-600/5', border: 'border-red-500/20' },
          ].map(stat => (
            <Card key={stat.label} className={`bg-gradient-to-br ${stat.bg} border ${stat.border}`}>
              <CardContent className="p-4 text-center">
                <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
                <div className="text-xs text-gray-400">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Search + Category Filter */}
        <div className="space-y-3 mb-6">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
            <Input
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search tools by name, description, or category..."
              className="bg-gray-900 border-gray-600 pl-10"
            />
          </div>

          {/* Category Filter Buttons */}
          <div className="flex gap-2 overflow-x-auto pb-1">
            {CATEGORIES.map(cat => (
              <Button
                key={cat}
                variant={category === cat ? 'default' : 'outline'}
                size="sm"
                onClick={() => setCategory(cat)}
                className={`flex items-center gap-1.5 shrink-0 ${category === cat ? 'bg-yellow-600 hover:bg-yellow-700' : 'border-gray-600 text-gray-300 hover:text-white'}`}
              >
                {CATEGORY_ICONS[cat]}
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </Button>
            ))}
            <Button variant="ghost" size="sm" onClick={fetchTools} className="text-gray-400 shrink-0">
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Tools Grid */}
        {loading ? (
          <div className="text-center py-12">
            <Loader2 className="w-8 h-8 text-yellow-400 animate-spin mx-auto" />
            <p className="text-gray-400 mt-2 text-sm">Loading tools...</p>
          </div>
        ) : filteredTools.length === 0 ? (
          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-12 text-center text-gray-500">
              <Search className="w-10 h-10 mx-auto mb-3 opacity-50" />
              <p>No tools found matching your criteria</p>
              <p className="text-xs mt-1">Try adjusting your search or category filter</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTools.map(tool => (
              <Card key={tool.name} className="bg-gray-800/50 border-gray-700 hover:border-gray-600 transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-gray-400">{CATEGORY_ICONS[tool.category] || <Wrench className="w-4 h-4" />}</span>
                        <h3 className="font-bold text-base truncate">{tool.name}</h3>
                      </div>
                      <p className="text-sm text-gray-400 line-clamp-2">{tool.description}</p>
                    </div>
                    <Badge className={`text-[10px] shrink-0 ml-2 ${SAFETY_COLORS[tool.safetyLevel]} border`}>
                      {tool.safetyLevel}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-2 mb-3 flex-wrap">
                    <Badge variant="outline" className="text-xs border-gray-600">
                      {CATEGORY_ICONS[tool.category] && <span className="mr-1">{CATEGORY_ICONS[tool.category]}</span>}
                      {tool.category}
                    </Badge>
                    {tool.installed ? (
                      <Badge className="text-[10px] bg-green-500/20 text-green-400 border border-green-500/30">
                        <CheckCircle className="w-3 h-3 mr-1" />Installed
                      </Badge>
                    ) : (
                      <Badge className="text-[10px] bg-gray-500/20 text-gray-400 border border-gray-500/30">
                        <XCircle className="w-3 h-3 mr-1" />Not Installed
                      </Badge>
                    )}
                    {!tool.enabled && (
                      <Badge variant="destructive" className="text-[10px]">Disabled</Badge>
                    )}
                  </div>

                  <div className="font-mono text-xs bg-black/50 p-2 rounded mb-3 text-gray-300 overflow-x-auto">
                    <span className="text-green-400">$</span> {tool.command} {tool.options ? Object.entries(tool.options).map(([k,v]) => `--${k} ${v}`).join(' ') : ''}
                  </div>

                  {/* Target Input per tool */}
                  <div className="flex gap-2 mb-3">
                    <Input
                      value={toolTargets[tool.name] || ''}
                      onChange={e => setToolTarget(tool.name, e.target.value)}
                      placeholder="Target (e.g., example.com)"
                      className="bg-gray-900/50 border-gray-700 text-xs h-8"
                      disabled={!tool.installed || !tool.enabled}
                    />
                  </div>

                  {/* Output */}
                  {output[tool.name] && (
                    <div className="font-mono text-xs bg-black/80 p-2 rounded mb-3 max-h-32 overflow-y-auto border border-gray-700/50">
                      <div className="flex items-center gap-1 mb-1 text-gray-500">
                        <Terminal className="w-3 h-3" /> Output:
                      </div>
                      <pre className="text-green-400 whitespace-pre-wrap">{output[tool.name]}</pre>
                    </div>
                  )}

                  <Button
                    size="sm"
                    variant="outline"
                    disabled={!tool.installed || !tool.enabled || executing === tool.name}
                    onClick={() => executeTool(tool.name, toolTargets[tool.name] || 'example.com')}
                    className="w-full border-gray-600 text-gray-300 hover:text-white hover:bg-gray-800"
                  >
                    {executing === tool.name ? (
                      <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Executing...</>
                    ) : (
                      <><Play className="w-4 h-4 mr-2" /> Execute</>
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
