import React, { useState, useEffect, useCallback } from 'react';
import { 
  Eye, Globe, Lock, Server, Shield, Search, RefreshCw, 
  AlertTriangle, Wifi, FileCode, ChevronRight, Activity, Loader2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { ScrollArea } from '../components/ui/scroll-area';

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

const ReconPage = () => {
  const [target, setTarget] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState<ReconResult | null>(null);
  const [reconId, setReconId] = useState('');
  const [error, setError] = useState('');

  const startRecon = async () => {
    if (!target.trim()) { setError('Target is required'); return; }
    setError('');
    setIsRunning(true);
    setResult(null);

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

      // Poll for results
      const poll = setInterval(async () => {
        try {
          const updateRes = await fetch(`/api/recon/${data.reconId}`);
          if (updateRes.ok) {
            const reconData = await updateRes.json();
            if (reconData.status === 'completed') {
              setResult(reconData.result);
              setIsRunning(false);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Eye className="w-8 h-8 text-cyan-400" />
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent">
              Reconnaissance Engine
            </h1>
            <p className="text-gray-400">Subdomain enumeration, TLS analysis, JS secret scanning & more</p>
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
                className="bg-cyan-600 hover:bg-cyan-700"
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

        {/* Results */}
        {isRunning && (
          <Card className="bg-gray-800/50 border-gray-700 mb-6">
            <CardContent className="p-6 text-center">
              <Loader2 className="w-12 h-12 mx-auto mb-4 text-cyan-400 animate-spin" />
              <p className="text-gray-300">Running reconnaissance on {target}...</p>
              <p className="text-sm text-gray-500 mt-2">This may take a moment</p>
            </CardContent>
          </Card>
        )}

        {result && (
          <div className="space-y-6">
            {/* Security Score */}
            <Card className="bg-gray-800/50 border-gray-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold">Security Score</h3>
                    <p className="text-gray-400 text-sm">Based on headers, TLS, ports, and secrets</p>
                  </div>
                  <div className={`text-4xl font-bold ${result.securityScore >= 80 ? 'text-green-400' : result.securityScore >= 50 ? 'text-yellow-400' : 'text-red-400'}`}>
                    {result.securityScore}/100
                  </div>
                </div>
                <Progress value={result.securityScore} className="mt-4 h-3" />
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Subdomains */}
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-cyan-400 flex items-center gap-2">
                    <Globe className="w-5 h-5" /> Subdomains ({result.subdomains.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="max-h-64">
                    <div className="space-y-1">
                      {result.subdomains.map((sub, i) => (
                        <div key={i} className="flex items-center justify-between p-2 bg-gray-900/50 rounded text-sm">
                          <span className="font-mono">{sub.subdomain}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-gray-400 text-xs">{sub.ip}</span>
                            <Badge variant={sub.status === 'active' ? 'default' : 'outline'} className="text-xs">
                              {sub.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>

              {/* Open Ports */}
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-cyan-400 flex items-center gap-2">
                    <Server className="w-5 h-5" /> Open Ports ({result.ports.filter(p => p.state === 'open').length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="max-h-64">
                    <div className="space-y-1">
                      {result.ports.map((port, i) => (
                        <div key={i} className="flex items-center justify-between p-2 bg-gray-900/50 rounded text-sm">
                          <span className="font-mono">:{port.port}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-gray-300">{port.service}</span>
                            <Badge variant={port.state === 'open' ? 'default' : 'outline'} className="text-xs">
                              {port.state}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>

              {/* TLS Certificate */}
              {result.tls && (
                <Card className="bg-gray-800/50 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-cyan-400 flex items-center gap-2">
                      <Lock className="w-5 h-5" /> TLS Certificate
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between"><span className="text-gray-400">Issuer:</span><span>{result.tls.issuer}</span></div>
                      <div className="flex justify-between"><span className="text-gray-400">Protocol:</span><span>{result.tls.protocol}</span></div>
                      <div className="flex justify-between"><span className="text-gray-400">Cipher:</span><span className="font-mono text-xs">{result.tls.cipher}</span></div>
                      <div className="flex justify-between"><span className="text-gray-400">Vendor:</span><Badge variant="outline">{result.tls.vendor}</Badge></div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Security Headers */}
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-cyan-400 flex items-center gap-2">
                    <Shield className="w-5 h-5" /> Security Headers
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="max-h-64">
                    <div className="space-y-1">
                      {result.headers.map((h, i) => (
                        <div key={i} className="flex items-center justify-between p-2 bg-gray-900/50 rounded text-sm">
                          <span className="font-mono text-xs">{h.header}</span>
                          <Badge variant={h.secure ? 'default' : 'destructive'} className="text-xs">
                            {h.present ? (h.secure ? 'Secure' : 'Insecure') : 'Missing'}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>

              {/* Technologies */}
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-cyan-400 flex items-center gap-2">
                    <Activity className="w-5 h-5" /> Technologies ({result.technologies.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {result.technologies.map((tech, i) => (
                      <Badge key={i} variant="outline" className="border-gray-600">
                        {tech.name} {tech.version && <span className="text-gray-400 ml-1">{tech.version}</span>}
                        <span className="text-gray-500 ml-1">({tech.confidence}%)</span>
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* JS Secrets */}
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-cyan-400 flex items-center gap-2">
                    <FileCode className="w-5 h-5" /> JS Secrets ({result.jsSecrets.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {result.jsSecrets.length === 0 ? (
                    <p className="text-gray-500 text-sm">No secrets found in JavaScript files</p>
                  ) : (
                    <ScrollArea className="max-h-64">
                      <div className="space-y-1">
                        {result.jsSecrets.map((secret, i) => (
                          <div key={i} className="flex items-center justify-between p-2 bg-gray-900/50 rounded text-sm">
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
              </Card>
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
