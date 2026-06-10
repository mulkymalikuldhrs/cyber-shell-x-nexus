import React, { useState, useEffect, useCallback } from 'react';
import { 
  Shield, Scan, Play, Square, RefreshCw, AlertTriangle, 
  ChevronDown, ChevronUp, Bug, Lock, Zap, Activity, Loader2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Progress } from '../components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { ScrollArea } from '../components/ui/scroll-area';

const VULN_TYPES = ['LFI', 'RCE', 'XSS', 'AFO', 'SSRF', 'SQLI', 'IDOR'];
const SEVERITY_COLORS: Record<string, string> = {
  critical: 'bg-red-500/20 text-red-400 border-red-500/50',
  high: 'bg-orange-500/20 text-orange-400 border-orange-500/50',
  medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50',
  low: 'bg-green-500/20 text-green-400 border-green-500/50',
  info: 'bg-blue-500/20 text-blue-400 border-blue-500/50',
};

interface Finding {
  id: string;
  type: string;
  severity: string;
  confidence: number;
  title: string;
  description: string;
  evidence: string;
  remediation: string;
  cvssEstimate: number;
  falsePositive: boolean;
}

interface ScanData {
  id: string;
  target: string;
  type: string;
  status: string;
  progress: number;
  currentPhase?: string;
  findings: Finding[];
  result: any;
  startedAt: string;
  completedAt?: string;
  error?: string;
}

const ScanPage = () => {
  const [target, setTarget] = useState('');
  const [scanType, setScanType] = useState('vulnerability');
  const [selectedVulns, setSelectedVulns] = useState<string[]>(VULN_TYPES);
  const [agentMode, setAgentMode] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [currentScan, setCurrentScan] = useState<ScanData | null>(null);
  const [scanHistory, setScanHistory] = useState<ScanData[]>([]);
  const [error, setError] = useState('');

  const fetchScans = useCallback(async () => {
    try {
      const res = await fetch('/api/scans');
      if (res.ok) {
        const data = await res.json();
        setScanHistory(data);
      }
    } catch {}
  }, []);

  useEffect(() => { fetchScans(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const startScan = async () => {
    if (!target.trim()) { setError('Target is required'); return; }
    
    // Safety: don't allow scanning real domains without awareness
    setError('');
    setIsScanning(true);

    try {
      const res = await fetch('/api/scan/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          target: target.trim(),
          type: scanType,
          name: `Scan ${target.trim()}`,
          vulnTypes: selectedVulns,
          agentMode,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Scan failed to start');
        setIsScanning(false);
        return;
      }

      // Poll for updates
      const scanId = data.scanId;
      const poll = setInterval(async () => {
        try {
          const updateRes = await fetch(`/api/scan/${scanId}`);
          if (updateRes.ok) {
            const scanData = await updateRes.json();
            setCurrentScan(scanData);
            if (scanData.status === 'completed' || scanData.status === 'failed') {
              clearInterval(poll);
              setIsScanning(false);
              fetchScans();
            }
          }
        } catch { clearInterval(poll); }
      }, 2000);
    } catch (err) {
      setError('Failed to start scan');
      setIsScanning(false);
    }
  };

  const toggleVuln = (vuln: string) => {
    setSelectedVulns(prev => 
      prev.includes(vuln) ? prev.filter(v => v !== vuln) : [...prev, vuln]
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Shield className="w-8 h-8 text-red-400" />
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
              Vulnerability Scanner
            </h1>
            <p className="text-gray-400">7 vulnerability type analyzers with LLM-powered analysis</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Scan Configuration */}
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-cyan-400">Scan Configuration</CardTitle>
              <CardDescription className="text-gray-400">Configure your vulnerability scan</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Target</label>
                <Input
                  value={target}
                  onChange={e => setTarget(e.target.value)}
                  placeholder="example.com or IP address"
                  className="bg-gray-900 border-gray-600"
                  disabled={isScanning}
                />
              </div>

              <div>
                <label className="text-sm text-gray-400 mb-1 block">Scan Type</label>
                <Select value={scanType} onValueChange={setScanType} disabled={isScanning}>
                  <SelectTrigger className="bg-gray-900 border-gray-600">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="vulnerability">Vulnerability Scan</SelectItem>
                    <SelectItem value="full">Full Assessment</SelectItem>
                    <SelectItem value="recon">Reconnaissance</SelectItem>
                    <SelectItem value="compliance">Compliance Check</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm text-gray-400 mb-2 block">Vulnerability Types</label>
                <div className="flex flex-wrap gap-2">
                  {VULN_TYPES.map(vuln => (
                    <Badge
                      key={vuln}
                      variant={selectedVulns.includes(vuln) ? "default" : "outline"}
                      className={`cursor-pointer ${selectedVulns.includes(vuln) ? 'bg-cyan-600' : 'border-gray-600 text-gray-400'}`}
                      onClick={() => !isScanning && toggleVuln(vuln)}
                    >
                      {vuln}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="agentMode"
                  checked={agentMode}
                  onChange={e => setAgentMode(e.target.checked)}
                  disabled={isScanning}
                  className="rounded"
                />
                <label htmlFor="agentMode" className="text-sm text-gray-300">
                  Agent-Orchestrated Mode (5-phase pipeline)
                </label>
              </div>

              {error && <p className="text-red-400 text-sm">{error}</p>}

              <Button
                onClick={startScan}
                disabled={isScanning || !target.trim()}
                className="w-full bg-red-600 hover:bg-red-700"
              >
                {isScanning ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Scanning...</>
                ) : (
                  <><Scan className="w-4 h-4 mr-2" /> Start Scan</>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Current Scan Progress */}
          <Card className="bg-gray-800/50 border-gray-700 lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-cyan-400">Scan Progress</CardTitle>
            </CardHeader>
            <CardContent>
              {currentScan ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{currentScan.target}</p>
                      <p className="text-sm text-gray-400">Type: {currentScan.type}</p>
                    </div>
                    <Badge variant={currentScan.status === 'completed' ? 'default' : currentScan.status === 'failed' ? 'destructive' : 'secondary'}>
                      {currentScan.status}
                    </Badge>
                  </div>
                  
                  <Progress value={currentScan.progress} className="h-2" />
                  
                  {currentScan.currentPhase && (
                    <p className="text-sm text-gray-400">Phase: {currentScan.currentPhase}</p>
                  )}

                  {currentScan.findings?.length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-gray-300 mb-2">
                        Findings ({currentScan.findings.length})
                      </h4>
                      <ScrollArea className="max-h-64">
                        <div className="space-y-2">
                          {currentScan.findings.map((f: Finding) => (
                            <div key={f.id} className={`p-3 rounded-lg border ${SEVERITY_COLORS[f.severity] || SEVERITY_COLORS.info}`}>
                              <div className="flex items-center justify-between">
                                <span className="font-medium text-sm">{f.title}</span>
                                <div className="flex items-center gap-2">
                                  <Badge variant="outline" className="text-xs">{f.type}</Badge>
                                  <span className="text-xs">Confidence: {f.confidence}/10</span>
                                </div>
                              </div>
                              <p className="text-xs mt-1 opacity-80">{f.description}</p>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    </div>
                  )}

                  {currentScan.error && (
                    <p className="text-red-400 text-sm">{currentScan.error}</p>
                  )}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <Scan className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Configure and start a scan to see progress</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Scan History */}
        <Card className="bg-gray-800/50 border-gray-700 mt-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-cyan-400">Scan History</CardTitle>
              <Button variant="outline" size="sm" onClick={fetchScans}>
                <RefreshCw className="w-4 h-4 mr-1" /> Refresh
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {scanHistory.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No scans yet</p>
            ) : (
              <ScrollArea className="max-h-96">
                <div className="space-y-2">
                  {scanHistory.map(scan => (
                    <div key={scan.id} className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg border border-gray-700">
                      <div>
                        <p className="font-medium">{scan.target}</p>
                        <p className="text-xs text-gray-400">{scan.type} • {new Date(scan.startedAt).toLocaleString()}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {scan.findings?.length > 0 && (
                          <Badge variant="outline">{scan.findings.length} findings</Badge>
                        )}
                        <Badge variant={scan.status === 'completed' ? 'default' : scan.status === 'running' ? 'secondary' : 'destructive'}>
                          {scan.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </CardContent>
        </Card>

        {/* Legal Notice */}
        <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/50 rounded-lg">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5" />
            <p className="text-sm text-yellow-200">
              <strong>Legal Notice:</strong> Security scanning should only be performed on systems you own or have explicit written authorization to test. 
              Unauthorized scanning may violate federal and state laws. This tool is for educational and authorized testing purposes only.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScanPage;
