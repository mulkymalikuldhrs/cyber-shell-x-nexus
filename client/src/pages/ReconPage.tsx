import React, { useState, useEffect, useCallback } from 'react';
import { 
  Eye, Globe, Lock, Server, Shield, Search, RefreshCw, 
  AlertTriangle, Wifi, FileCode, ChevronRight, ChevronDown, ChevronUp,
  Activity, Loader2, CheckCircle, XCircle, Clock, Database, Code, Zap
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { ScrollArea } from '../components/ui/scroll-area';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../components/ui/collapsible';

interface ReconResult {
  target: string;
  subdomains: Array<{ subdomain: string; ip: string; status: string; source: string }>;
  ports: Array<{ port: number; service: string; version: string; state: string; protocol: string }>;
  tls: { issuer: string; subject: string; protocol: string; cipher: string; vendor: string } | null;
  headers: Array<{ header: string; value: string; present: boolean; secure: boolean; recommendation?: string }>;
  technologies: Array<{ name: string; version?: string; category: string; confidence: number }>;
  jsSecrets: Array<{ type: string; value: string; file: string; severity: string }>;
  securityScore: number;
}

const PIPELINE_STEPS = [
  { id: 'dns', label: 'DNS Resolution', icon: <Globe className="w-4 h-4" /> },
  { id: 'subdomains', label: 'Subdomain Enum', icon: <Search className="w-4 h-4" /> },
  { id: 'ports', label: 'Port Scanning', icon: <Server className="w-4 h-4" /> },
  { id: 'tls', label: 'TLS Analysis', icon: <Lock className="w-4 h-4" /> },
  { id: 'headers', label: 'Header Check', icon: <Shield className="w-4 h-4" /> },
  { id: 'tech', label: 'Tech Fingerprint', icon: <Code className="w-4 h-4" /> },
  { id: 'js', label: 'JS Secrets', icon: <FileCode className="w-4 h-4" /> },
  { id: 'score', label: 'Scoring', icon: <Zap className="w-4 h-4" /> },
];

const ReconPage = () => {
  const [target, setTarget] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState<ReconResult | null>(null);
  const [reconId, setReconId] = useState('');
  const [error, setError] = useState('');
  const [currentStep, setCurrentStep] = useState(0);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    subdomains: true, ports: true, tls: true, headers: true, technologies: true, jsSecrets: true
  });

  const toggleSection = (key: string) => {
    setOpenSections(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Simulate pipeline progress during recon
  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => {
      setCurrentStep(prev => Math.min(prev + 1, PIPELINE_STEPS.length - 1));
    }, 3000);
    return () => clearInterval(interval);
  }, [isRunning]);

  const startRecon = async () => {
    if (!target.trim()) { setError('Target is required'); return; }
    setError('');
    setIsRunning(true);
    setResult(null);
    setCurrentStep(0);

    try {
      const res = await fetch('/api/recon/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ target: target.trim() }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Recon failed to start');
        setIsRunning(false);
        return;
      }

      setReconId(data.reconId);

      const poll = setInterval(async () => {
        try {
          const updateRes = await fetch(`/api/recon/${data.reconId}`);
          if (updateRes.ok) {
            const reconData = await updateRes.json();
            if (reconData.status === 'completed') {
              setResult(reconData.result);
              setIsRunning(false);
              setCurrentStep(PIPELINE_STEPS.length - 1);
              clearInterval(poll);
            } else if (reconData.status === 'failed') {
              setError(reconData.error || 'Reconnaissance failed');
              setIsRunning(false);
              clearInterval(poll);
            }
          }
        } catch { clearInterval(poll); }
      }, 2000);
    } catch (err) {
      setError('Failed to start reconnaissance');
      setIsRunning(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 50) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getScoreGradient = (score: number) => {
    if (score >= 80) return 'from-green-500 to-green-600';
    if (score >= 50) return 'from-yellow-500 to-yellow-600';
    return 'from-red-500 to-red-600';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white pt-14">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <Eye className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent">
              Reconnaissance Engine
            </h1>
            <p className="text-gray-400 text-sm">Subdomain enumeration, TLS analysis, JS secret scanning & more</p>
          </div>
        </div>

        {/* Target Input */}
        <Card className="bg-gray-800/50 border-gray-700 mb-6">
          <CardContent className="p-6">
            <div className="flex gap-4 items-end">
              <div className="flex-1">
                <label className="text-sm text-gray-400 mb-1 block">Target Domain</label>
                <Input
                  value={target}
                  onChange={e => setTarget(e.target.value)}
                  placeholder="example.com"
                  className="bg-gray-900 border-gray-600"
                  disabled={isRunning}
                />
              </div>
              <Button
                onClick={startRecon}
                disabled={isRunning || !target.trim()}
                className="bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700"
              >
                {isRunning ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Running...</>
                ) : (
                  <><Search className="w-4 h-4 mr-2" /> Start Recon</>
                )}
              </Button>
            </div>
            {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
          </CardContent>
        </Card>

        {/* Pipeline Progress Indicator */}
        {(isRunning || result) && (
          <Card className="bg-gray-800/50 border-gray-700 mb-6">
            <CardHeader className="pb-3">
              <CardTitle className="text-cyan-400 flex items-center gap-2">
                <Activity className="w-5 h-5" /> Recon Pipeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-1 overflow-x-auto pb-2">
                {PIPELINE_STEPS.map((step, i) => {
                  const isCompleted = result ? true : i < currentStep;
                  const isCurrent = isRunning && i === currentStep;
                  return (
                    <React.Fragment key={step.id}>
                      <div className={`flex flex-col items-center gap-1.5 p-2 rounded-lg min-w-[80px] transition-all ${
                        isCompleted ? 'bg-green-500/10 border border-green-500/30' :
                        isCurrent ? 'bg-cyan-500/10 border border-cyan-500/30 animate-pulse' :
                        'bg-gray-900/50 border border-gray-700/50'
                      }`}>
                        <span className={isCompleted ? 'text-green-400' : isCurrent ? 'text-cyan-400' : 'text-gray-500'}>
                          {isCompleted ? <CheckCircle className="w-4 h-4" /> : step.icon}
                        </span>
                        <span className="text-[10px] text-center leading-tight">{step.label}</span>
                      </div>
                      {i < PIPELINE_STEPS.length - 1 && (
                        <ChevronRight className={`w-4 h-4 shrink-0 ${isCompleted ? 'text-green-500/50' : 'text-gray-700'}`} />
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Running State */}
        {isRunning && !result && (
          <Card className="bg-gray-800/50 border-cyan-500/20 mb-6">
            <CardContent className="p-8 text-center">
              <div className="relative w-20 h-20 mx-auto mb-4">
                <div className="absolute inset-0 border-2 border-cyan-500/30 rounded-full" />
                <div className="absolute inset-0 border-2 border-transparent border-t-cyan-400 rounded-full animate-spin" />
                <Eye className="absolute inset-0 m-auto w-8 h-8 text-cyan-400" />
              </div>
              <p className="text-gray-300 text-lg">Running reconnaissance on <span className="font-mono text-cyan-400">{target}</span></p>
              <p className="text-sm text-gray-500 mt-2">Pipeline step: {PIPELINE_STEPS[currentStep]?.label || 'Initializing...'}</p>
            </CardContent>
          </Card>
        )}

        {/* Results */}
        {result && (
          <div className="space-y-6">
            {/* Summary Overview */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <Card className="bg-gradient-to-br from-green-500/10 to-green-600/5 border border-green-500/20">
                <CardContent className="p-4 text-center">
                  <div className={`text-3xl font-bold ${getScoreColor(result.securityScore)}`}>
                    {result.securityScore}
                  </div>
                  <div className="text-xs text-gray-400 mt-1">Security Score</div>
                  <Progress value={result.securityScore} className="mt-2 h-1.5" />
                </CardContent>
              </Card>
              <Card className="bg-gray-800/50 border-gray-700">
                <CardContent className="p-4 text-center">
                  <div className="text-3xl font-bold text-cyan-400">{result.subdomains.length}</div>
                  <div className="text-xs text-gray-400 mt-1">Subdomains</div>
                </CardContent>
              </Card>
              <Card className="bg-gray-800/50 border-gray-700">
                <CardContent className="p-4 text-center">
                  <div className="text-3xl font-bold text-yellow-400">{result.ports.filter(p => p.state === 'open').length}</div>
                  <div className="text-xs text-gray-400 mt-1">Open Ports</div>
                </CardContent>
              </Card>
              <Card className="bg-gray-800/50 border-gray-700">
                <CardContent className="p-4 text-center">
                  <div className="text-3xl font-bold text-purple-400">{result.technologies.length}</div>
                  <div className="text-xs text-gray-400 mt-1">Technologies</div>
                </CardContent>
              </Card>
              <Card className="bg-gray-800/50 border-gray-700">
                <CardContent className="p-4 text-center">
                  <div className={`text-3xl font-bold ${result.jsSecrets.length > 0 ? 'text-red-400' : 'text-green-400'}`}>
                    {result.jsSecrets.length}
                  </div>
                  <div className="text-xs text-gray-400 mt-1">JS Secrets</div>
                </CardContent>
              </Card>
            </div>

            {/* Collapsible Results Sections */}
            <div className="space-y-3">
              {/* Subdomains */}
              <Collapsible open={openSections.subdomains} onOpenChange={() => toggleSection('subdomains')}>
                <Card className="bg-gray-800/50 border-gray-700">
                  <CollapsibleTrigger asChild>
                    <CardHeader className="cursor-pointer hover:bg-gray-800/80 transition-colors py-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-cyan-400 flex items-center gap-2 text-base">
                          <Globe className="w-5 h-5" /> Subdomains
                          <Badge variant="outline" className="text-xs">{result.subdomains.length}</Badge>
                        </CardTitle>
                        {openSections.subdomains ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
                      </div>
                    </CardHeader>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <CardContent className="pt-0">
                      <ScrollArea className="max-h-64">
                        <div className="space-y-1">
                          {result.subdomains.map((sub, i) => (
                            <div key={i} className="flex items-center justify-between p-2 bg-gray-900/50 rounded-lg text-sm hover:bg-gray-900/70 transition-colors">
                              <span className="font-mono text-gray-200">{sub.subdomain}</span>
                              <div className="flex items-center gap-2">
                                <span className="text-gray-400 text-xs font-mono">{sub.ip}</span>
                                <Badge variant={sub.status === 'active' ? 'default' : 'outline'} className="text-xs">
                                  {sub.status}
                                </Badge>
                              </div>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    </CardContent>
                  </CollapsibleContent>
                </Card>
              </Collapsible>

              {/* Open Ports */}
              <Collapsible open={openSections.ports} onOpenChange={() => toggleSection('ports')}>
                <Card className="bg-gray-800/50 border-gray-700">
                  <CollapsibleTrigger asChild>
                    <CardHeader className="cursor-pointer hover:bg-gray-800/80 transition-colors py-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-cyan-400 flex items-center gap-2 text-base">
                          <Server className="w-5 h-5" /> Open Ports
                          <Badge variant="outline" className="text-xs">{result.ports.filter(p => p.state === 'open').length} open</Badge>
                        </CardTitle>
                        {openSections.ports ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
                      </div>
                    </CardHeader>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <CardContent className="pt-0">
                      <ScrollArea className="max-h-64">
                        <div className="space-y-1">
                          {result.ports.map((port, i) => (
                            <div key={i} className="flex items-center justify-between p-2 bg-gray-900/50 rounded-lg text-sm hover:bg-gray-900/70 transition-colors">
                              <div className="flex items-center gap-2">
                                <span className="font-mono text-cyan-300">:{port.port}</span>
                                <span className="text-gray-300">{port.service}</span>
                                {port.version && <span className="text-gray-500 text-xs">{port.version}</span>}
                              </div>
                              <Badge variant={port.state === 'open' ? 'default' : 'outline'} className={`text-xs ${port.state === 'open' ? 'bg-yellow-500/20 text-yellow-400' : ''}`}>
                                {port.state}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    </CardContent>
                  </CollapsibleContent>
                </Card>
              </Collapsible>

              {/* TLS Certificate */}
              {result.tls && (
                <Collapsible open={openSections.tls} onOpenChange={() => toggleSection('tls')}>
                  <Card className="bg-gray-800/50 border-gray-700">
                    <CollapsibleTrigger asChild>
                      <CardHeader className="cursor-pointer hover:bg-gray-800/80 transition-colors py-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-cyan-400 flex items-center gap-2 text-base">
                            <Lock className="w-5 h-5" /> TLS Certificate
                          </CardTitle>
                          {openSections.tls ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
                        </div>
                      </CardHeader>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <CardContent className="pt-0">
                        <div className="grid grid-cols-2 gap-3">
                          {[
                            { label: 'Issuer', value: result.tls.issuer },
                            { label: 'Subject', value: result.tls.subject },
                            { label: 'Protocol', value: result.tls.protocol },
                            { label: 'Cipher', value: result.tls.cipher },
                          ].map(item => (
                            <div key={item.label} className="p-3 bg-gray-900/50 rounded-lg border border-gray-700/50">
                              <div className="text-xs text-gray-400 mb-1">{item.label}</div>
                              <div className="text-sm font-mono">{item.value}</div>
                            </div>
                          ))}
                          <div className="p-3 bg-gray-900/50 rounded-lg border border-gray-700/50">
                            <div className="text-xs text-gray-400 mb-1">Vendor</div>
                            <Badge variant="outline">{result.tls.vendor}</Badge>
                          </div>
                        </div>
                      </CardContent>
                    </CollapsibleContent>
                  </Card>
                </Collapsible>
              )}

              {/* Security Headers */}
              <Collapsible open={openSections.headers} onOpenChange={() => toggleSection('headers')}>
                <Card className="bg-gray-800/50 border-gray-700">
                  <CollapsibleTrigger asChild>
                    <CardHeader className="cursor-pointer hover:bg-gray-800/80 transition-colors py-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-cyan-400 flex items-center gap-2 text-base">
                          <Shield className="w-5 h-5" /> Security Headers
                          <Badge variant="outline" className="text-xs">
                            {result.headers.filter(h => h.secure).length}/{result.headers.length} secure
                          </Badge>
                        </CardTitle>
                        {openSections.headers ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
                      </div>
                    </CardHeader>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <CardContent className="pt-0">
                      <ScrollArea className="max-h-64">
                        <div className="space-y-1">
                          {result.headers.map((h, i) => (
                            <div key={i} className="flex items-center justify-between p-2.5 bg-gray-900/50 rounded-lg text-sm hover:bg-gray-900/70 transition-colors">
                              <div className="flex-1 min-w-0">
                                <span className="font-mono text-xs text-gray-200">{h.header}</span>
                                {h.recommendation && (
                                  <p className="text-xs text-yellow-400/70 mt-0.5">{h.recommendation}</p>
                                )}
                              </div>
                              <div className="flex items-center gap-2 shrink-0 ml-2">
                                {h.present ? (
                                  h.secure ? 
                                    <Badge className="text-xs bg-green-500/20 text-green-400 border-green-500/30"><CheckCircle className="w-3 h-3 mr-1" />Secure</Badge> :
                                    <Badge className="text-xs bg-red-500/20 text-red-400 border-red-500/30"><XCircle className="w-3 h-3 mr-1" />Insecure</Badge>
                                ) : (
                                  <Badge variant="destructive" className="text-xs">Missing</Badge>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    </CardContent>
                  </CollapsibleContent>
                </Card>
              </Collapsible>

              {/* Technologies */}
              <Collapsible open={openSections.technologies} onOpenChange={() => toggleSection('technologies')}>
                <Card className="bg-gray-800/50 border-gray-700">
                  <CollapsibleTrigger asChild>
                    <CardHeader className="cursor-pointer hover:bg-gray-800/80 transition-colors py-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-cyan-400 flex items-center gap-2 text-base">
                          <Code className="w-5 h-5" /> Technologies
                          <Badge variant="outline" className="text-xs">{result.technologies.length}</Badge>
                        </CardTitle>
                        {openSections.technologies ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
                      </div>
                    </CardHeader>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <CardContent className="pt-0">
                      <div className="flex flex-wrap gap-2">
                        {result.technologies.map((tech, i) => (
                          <div key={i} className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-900/50 rounded-lg border border-gray-700/50">
                            <Badge variant="outline" className="text-xs border-gray-600">
                              {tech.name} {tech.version && <span className="text-gray-400 ml-1">{tech.version}</span>}
                            </Badge>
                            <span className="text-gray-500 text-xs">({tech.confidence}%)</span>
                            <span className="text-[10px] text-gray-600">{tech.category}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </CollapsibleContent>
                </Card>
              </Collapsible>

              {/* JS Secrets */}
              <Collapsible open={openSections.jsSecrets} onOpenChange={() => toggleSection('jsSecrets')}>
                <Card className={`bg-gray-800/50 ${result.jsSecrets.length > 0 ? 'border-red-500/30' : 'border-gray-700'}`}>
                  <CollapsibleTrigger asChild>
                    <CardHeader className="cursor-pointer hover:bg-gray-800/80 transition-colors py-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-cyan-400 flex items-center gap-2 text-base">
                          <FileCode className="w-5 h-5" /> JS Secrets
                          <Badge variant={result.jsSecrets.length > 0 ? 'destructive' : 'outline'} className="text-xs">
                            {result.jsSecrets.length}
                          </Badge>
                        </CardTitle>
                        {openSections.jsSecrets ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
                      </div>
                    </CardHeader>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <CardContent className="pt-0">
                      {result.jsSecrets.length === 0 ? (
                        <div className="flex items-center gap-2 p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                          <CheckCircle className="w-5 h-5 text-green-400" />
                          <p className="text-sm text-green-300">No secrets found in JavaScript files</p>
                        </div>
                      ) : (
                        <ScrollArea className="max-h-64">
                          <div className="space-y-1">
                            {result.jsSecrets.map((secret, i) => (
                              <div key={i} className="flex items-center justify-between p-2.5 bg-gray-900/50 rounded-lg text-sm hover:bg-red-900/20 transition-colors">
                                <div>
                                  <span className="font-medium text-red-400">{secret.type}</span>
                                  <span className="text-gray-500 text-xs ml-2">in {secret.file}</span>
                                </div>
                                <Badge variant={secret.severity === 'critical' ? 'destructive' : 'outline'} className="text-xs">
                                  {secret.severity}
                                </Badge>
                              </div>
                            ))}
                          </div>
                        </ScrollArea>
                      )}
                    </CardContent>
                  </CollapsibleContent>
                </Card>
              </Collapsible>
            </div>
          </div>
        )}

        {/* Legal Notice */}
        <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/50 rounded-lg">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5" />
            <p className="text-sm text-yellow-200">
              <strong>Legal Notice:</strong> Reconnaissance activities must comply with applicable laws and terms of service. 
              Only gather information on systems you have authorization to assess.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReconPage;
