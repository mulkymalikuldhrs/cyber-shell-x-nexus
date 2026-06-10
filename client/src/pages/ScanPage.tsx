import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  Shield, Scan, Play, Square, RefreshCw, AlertTriangle, 
  ChevronDown, ChevronUp, Bug, Lock, Zap, Activity, Loader2,
  Trash2, X, Eye, Clock, Target, BarChart3, CheckCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Progress } from '../components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { ScrollArea } from '../components/ui/scroll-area';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../components/ui/alert-dialog';

const VULN_TYPES = ['LFI', 'RCE', 'XSS', 'AFO', 'SSRF', 'SQLI', 'IDOR'];
const SEVERITY_COLORS: Record<string, string> = {
  critical: 'bg-red-500/20 text-red-400 border-red-500/50',
  high: 'bg-orange-500/20 text-orange-400 border-orange-500/50',
  medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50',
  low: 'bg-green-500/20 text-green-400 border-green-500/50',
  info: 'bg-blue-500/20 text-blue-400 border-blue-500/50',
};
const SEVERITY_PIE_COLORS: Record<string, string> = {
  critical: '#ef4444',
  high: '#f97316',
  medium: '#eab308',
  low: '#22c55e',
  info: '#3b82f6',
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

// Matrix rain effect for scan animation
const MatrixRain = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 400;
    canvas.height = 200;

    const chars = '01アイウエオカキクケコサシスセソ';
    const fontSize = 10;
    const columns = canvas.width / fontSize;
    const drops: number[] = Array(Math.floor(columns)).fill(1);

    const draw = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#0f0';
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillStyle = `rgba(0, ${150 + Math.random() * 105}, ${Math.random() * 100}, ${0.5 + Math.random() * 0.5})`;
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };

    const interval = setInterval(draw, 50);
    return () => clearInterval(interval);
  }, []);

  return <canvas ref={canvasRef} className="w-full h-full rounded-lg opacity-60" />;
};

// Radar scan animation
const RadarScan = () => {
  return (
    <div className="relative w-48 h-48 mx-auto">
      {/* Radar circles */}
      {[0.25, 0.5, 0.75, 1].map((scale, i) => (
        <div
          key={i}
          className="absolute inset-0 border border-cyan-500/20 rounded-full"
          style={{ transform: `scale(${scale})`, transformOrigin: 'center' }}
        />
      ))}
      {/* Cross lines */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-full h-px bg-cyan-500/20" />
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="h-full w-px bg-cyan-500/20" />
      </div>
      {/* Sweep */}
      <div className="absolute inset-0 animate-spin" style={{ animationDuration: '3s' }}>
        <div className="w-1/2 h-px bg-gradient-to-r from-cyan-400 to-transparent absolute top-1/2 left-1/2" />
        <div className="absolute top-1/2 left-1/2 w-24 h-24 origin-left bg-gradient-to-r from-cyan-500/20 to-transparent" style={{ clipPath: 'polygon(0 0, 100% 50%, 0 100%)' }} />
      </div>
      {/* Center dot */}
      <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-cyan-400 rounded-full -translate-x-1/2 -translate-y-1/2 animate-pulse" />
    </div>
  );
};

// Severity pie chart component using simple divs
const SeverityPie = ({ findings }: { findings: Finding[] }) => {
  const severityCounts: Record<string, number> = {};
  findings.forEach(f => {
    severityCounts[f.severity] = (severityCounts[f.severity] || 0) + 1;
  });

  const total = findings.length;
  if (total === 0) return null;

  const segments = Object.entries(severityCounts).map(([severity, count]) => ({
    severity,
    count,
    percentage: (count / total) * 100,
    color: SEVERITY_PIE_COLORS[severity] || '#6b7280',
  }));

  const conicGradient = segments.map((seg, i) => {
    const start = segments.slice(0, i).reduce((sum, s) => sum + s.percentage, 0);
    return `${seg.color} ${start}% ${start + seg.percentage}%`;
  }).join(', ');

  return (
    <div className="flex items-center gap-4">
      <div
        className="w-24 h-24 rounded-full shrink-0"
        style={{ background: `conic-gradient(${conicGradient})` }}
      >
        <div className="w-full h-full rounded-full flex items-center justify-center bg-gray-900" style={{ margin: '12%' }}>
          <span className="text-lg font-bold">{total}</span>
        </div>
      </div>
      <div className="space-y-1">
        {segments.map(seg => (
          <div key={seg.severity} className="flex items-center gap-2 text-xs">
            <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: seg.color }} />
            <span className="capitalize text-gray-300">{seg.severity}</span>
            <span className="text-gray-500">{seg.count} ({seg.percentage.toFixed(0)}%)</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Expandable finding row
const FindingRow = ({ finding }: { finding: Finding }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={`rounded-lg border ${SEVERITY_COLORS[finding.severity] || SEVERITY_COLORS.info} overflow-hidden`}>
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-3 flex items-center justify-between text-left hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <Bug className="w-4 h-4 shrink-0" />
          <span className="font-medium text-sm truncate">{finding.title}</span>
          <Badge variant="outline" className="text-xs shrink-0">{finding.type}</Badge>
          {finding.falsePositive && (
            <Badge className="text-[10px] bg-gray-500/20 text-gray-400 shrink-0">FP</Badge>
          )}
        </div>
        <div className="flex items-center gap-2 shrink-0 ml-2">
          <span className="text-xs opacity-70">Conf: {finding.confidence}/10</span>
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>
      {expanded && (
        <div className="px-3 pb-3 pt-1 border-t border-white/10 space-y-2">
          <div>
            <span className="text-xs text-gray-400 font-medium">Description</span>
            <p className="text-sm mt-0.5">{finding.description}</p>
          </div>
          <div>
            <span className="text-xs text-gray-400 font-medium">Evidence</span>
            <pre className="text-xs mt-0.5 bg-black/30 p-2 rounded font-mono overflow-x-auto">{finding.evidence}</pre>
          </div>
          <div>
            <span className="text-xs text-gray-400 font-medium">Remediation</span>
            <p className="text-sm mt-0.5">{finding.remediation}</p>
          </div>
          <div className="flex items-center gap-3 text-xs text-gray-400">
            <span>CVSS: <span className="text-white font-medium">{finding.cvssEstimate}</span></span>
            <span>False Positive: <span className={finding.falsePositive ? 'text-yellow-400' : 'text-green-400'}>{finding.falsePositive ? 'Yes' : 'No'}</span></span>
          </div>
        </div>
      )}
    </div>
  );
};

const ScanPage = () => {
  const [target, setTarget] = useState('');
  const [scanType, setScanType] = useState('vulnerability');
  const [selectedVulns, setSelectedVulns] = useState<string[]>(VULN_TYPES);
  const [agentMode, setAgentMode] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [currentScan, setCurrentScan] = useState<ScanData | null>(null);
  const [scanHistory, setScanHistory] = useState<ScanData[]>([]);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('progress');
  const [expandedScan, setExpandedScan] = useState<string | null>(null);

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
    setError('');
    setIsScanning(true);
    setActiveTab('progress');

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

  const deleteScan = async (scanId: string) => {
    try {
      await fetch(`/api/scan/${scanId}`, { method: 'DELETE' });
      fetchScans();
    } catch {}
  };

  const toggleVuln = (vuln: string) => {
    setSelectedVulns(prev => 
      prev.includes(vuln) ? prev.filter(v => v !== vuln) : [...prev, vuln]
    );
  };

  const allFindings = scanHistory.reduce<Finding[]>((acc, scan) => [...acc, ...(scan.findings || [])], []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white pt-14">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-red-500/20">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
              Vulnerability Scanner
            </h1>
            <p className="text-gray-400 text-sm">7 vulnerability type analyzers with LLM-powered analysis</p>
          </div>
        </div>

        {/* Scan Animation */}
        {isScanning && (
          <Card className="bg-gray-800/50 border-cyan-500/30 mb-6 overflow-hidden">
            <CardContent className="p-0 relative">
              <div className="absolute inset-0 opacity-20">
                <MatrixRain />
              </div>
              <div className="relative z-10 flex items-center gap-6 p-6">
                <RadarScan />
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-cyan-400 mb-2">Scanning in Progress</h3>
                  <p className="text-gray-300 mb-3">Target: <span className="font-mono text-cyan-300">{currentScan?.target || target}</span></p>
                  {currentScan && (
                    <>
                      <div className="flex items-center gap-3 mb-2">
                        <Progress value={currentScan.progress} className="flex-1 h-2" />
                        <span className="text-sm text-cyan-400 font-mono">{currentScan.progress}%</span>
                      </div>
                      {currentScan.currentPhase && (
                        <p className="text-sm text-gray-400">Phase: <span className="text-cyan-300">{currentScan.currentPhase}</span></p>
                      )}
                    </>
                  )}
                  <div className="flex items-center gap-2 mt-3">
                    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
                    <span className="text-xs text-gray-400">Live scan running...</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Scan Configuration */}
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-cyan-400 flex items-center gap-2">
                <Target className="w-5 h-5" /> Scan Configuration
              </CardTitle>
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
                      className={`cursor-pointer transition-all ${selectedVulns.includes(vuln) ? 'bg-cyan-600 hover:bg-cyan-700' : 'border-gray-600 text-gray-400 hover:border-gray-500'}`}
                      onClick={() => !isScanning && toggleVuln(vuln)}
                    >
                      {vuln}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2 p-2 bg-gray-900/50 rounded-lg border border-gray-700/50">
                <input
                  type="checkbox"
                  id="agentMode"
                  checked={agentMode}
                  onChange={e => setAgentMode(e.target.checked)}
                  disabled={isScanning}
                  className="rounded accent-purple-500"
                />
                <label htmlFor="agentMode" className="text-sm text-gray-300 cursor-pointer">
                  Agent-Orchestrated Mode (5-phase pipeline)
                </label>
              </div>

              {error && (
                <div className="p-2 bg-red-500/10 border border-red-500/30 rounded text-red-400 text-sm">
                  {error}
                </div>
              )}

              <Button
                onClick={startScan}
                disabled={isScanning || !target.trim()}
                className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700"
              >
                {isScanning ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Scanning...</>
                ) : (
                  <><Scan className="w-4 h-4 mr-2" /> Start Scan</>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Scan Progress & Findings */}
          <Card className="bg-gray-800/50 border-gray-700 lg:col-span-2">
            <CardHeader className="pb-2">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-cyan-400">Scan Results</CardTitle>
                  <TabsList className="bg-gray-900/50">
                    <TabsTrigger value="progress" className="text-xs">Progress</TabsTrigger>
                    <TabsTrigger value="findings" className="text-xs">Findings</TabsTrigger>
                    <TabsTrigger value="summary" className="text-xs">Summary</TabsTrigger>
                  </TabsList>
                </div>
              </Tabs>
            </CardHeader>
            <CardContent>
              <TabsContent value="progress" className="mt-0">
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
                      <div className="p-2 bg-cyan-500/10 border border-cyan-500/20 rounded-lg text-sm">
                        <Activity className="w-4 h-4 inline mr-2 text-cyan-400" />
                        <span className="text-cyan-300">Current Phase: </span>
                        <span>{currentScan.currentPhase}</span>
                      </div>
                    )}

                    {currentScan.findings?.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium text-gray-300">
                          Live Findings ({currentScan.findings.length})
                        </h4>
                        <ScrollArea className="max-h-64">
                          <div className="space-y-2">
                            {currentScan.findings.map((f: Finding) => (
                              <FindingRow key={f.id} finding={f} />
                            ))}
                          </div>
                        </ScrollArea>
                      </div>
                    )}

                    {currentScan.error && (
                      <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
                        {currentScan.error}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <Scan className="w-16 h-16 mx-auto mb-4 opacity-30" />
                    <p className="text-lg">Configure and start a scan</p>
                    <p className="text-sm mt-1">Results will appear here in real-time</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="findings" className="mt-0">
                {currentScan && currentScan.findings && currentScan.findings.length > 0 ? (
                  <ScrollArea className="max-h-96">
                    <div className="space-y-2">
                      {currentScan.findings.map((f: Finding) => (
                        <FindingRow key={f.id} finding={f} />
                      ))}
                    </div>
                  </ScrollArea>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Bug className="w-10 h-10 mx-auto mb-2 opacity-30" />
                    <p className="text-sm">No findings yet</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="summary" className="mt-0">
                {currentScan && currentScan.findings && currentScan.findings.length > 0 ? (
                  <div className="space-y-4">
                    <SeverityPie findings={currentScan.findings} />
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
                      {['critical', 'high', 'medium', 'low'].map(sev => {
                        const count = currentScan.findings.filter(f => f.severity === sev).length;
                        return (
                          <div key={sev} className={`p-3 rounded-lg border ${SEVERITY_COLORS[sev]} text-center`}>
                            <div className="text-2xl font-bold">{count}</div>
                            <div className="text-xs capitalize">{sev}</div>
                          </div>
                        );
                      })}
                    </div>
                    <div className="p-3 bg-gray-900/50 rounded-lg border border-gray-700">
                      <div className="text-xs text-gray-400 mb-1">Average Confidence</div>
                      <div className="text-lg font-bold text-cyan-400">
                        {(currentScan.findings.reduce((acc, f) => acc + f.confidence, 0) / currentScan.findings.length).toFixed(1)}/10
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <BarChart3 className="w-10 h-10 mx-auto mb-2 opacity-30" />
                    <p className="text-sm">No summary data available</p>
                  </div>
                )}
              </TabsContent>
            </CardContent>
          </Card>
        </div>

        {/* Scan History */}
        <Card className="bg-gray-800/50 border-gray-700 mt-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-cyan-400 flex items-center gap-2">
                <Clock className="w-5 h-5" /> Scan History
              </CardTitle>
              <div className="flex items-center gap-2">
                {allFindings.length > 0 && <Badge variant="outline" className="text-xs">{allFindings.length} total findings</Badge>}
                <Button variant="outline" size="sm" onClick={fetchScans} className="border-gray-600 text-gray-300">
                  <RefreshCw className="w-4 h-4 mr-1" /> Refresh
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {scanHistory.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Scan className="w-10 h-10 mx-auto mb-2 opacity-30" />
                <p>No scans yet</p>
                <p className="text-xs mt-1">Start your first scan above</p>
              </div>
            ) : (
              <ScrollArea className="max-h-96">
                <div className="space-y-2">
                  {scanHistory.map(scan => (
                    <div key={scan.id} className="border border-gray-700 rounded-lg overflow-hidden">
                      <div
                        className="flex items-center justify-between p-3 bg-gray-900/50 hover:bg-gray-900/70 cursor-pointer transition-colors"
                        onClick={() => setExpandedScan(expandedScan === scan.id ? null : scan.id)}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            scan.status === 'completed' ? 'bg-green-500/20' :
                            scan.status === 'running' ? 'bg-cyan-500/20' : 'bg-red-500/20'
                          }`}>
                            {scan.status === 'completed' ? <CheckCircle className="w-4 h-4 text-green-400" /> :
                             scan.status === 'running' ? <Activity className="w-4 h-4 text-cyan-400 animate-pulse" /> :
                             <X className="w-4 h-4 text-red-400" />}
                          </div>
                          <div>
                            <p className="font-medium text-sm">{scan.target}</p>
                            <p className="text-xs text-gray-500">{scan.type} &bull; {new Date(scan.startedAt).toLocaleString()}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {scan.findings?.length > 0 && (
                            <Badge variant="outline" className="text-xs">{scan.findings.length} findings</Badge>
                          )}
                          <Badge variant={scan.status === 'completed' ? 'default' : scan.status === 'running' ? 'secondary' : 'destructive'} className="text-xs">
                            {scan.status}
                          </Badge>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-gray-500 hover:text-red-400 h-7 w-7 p-0"
                                onClick={e => e.stopPropagation()}
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="bg-gray-900 border-gray-700">
                              <AlertDialogHeader>
                                <AlertDialogTitle className="text-white">Delete Scan</AlertDialogTitle>
                                <AlertDialogDescription className="text-gray-400">
                                  Are you sure you want to delete the scan for {scan.target}? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel className="bg-gray-800 text-gray-300 border-gray-600">Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  className="bg-red-600 hover:bg-red-700"
                                  onClick={() => deleteScan(scan.id)}
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                          {expandedScan === scan.id ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
                        </div>
                      </div>
                      {expandedScan === scan.id && scan.findings?.length > 0 && (
                        <div className="p-3 border-t border-gray-700/50 bg-gray-900/30">
                          <div className="space-y-2">
                            {scan.findings.map((f: Finding) => (
                              <FindingRow key={f.id} finding={f} />
                            ))}
                          </div>
                        </div>
                      )}
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
