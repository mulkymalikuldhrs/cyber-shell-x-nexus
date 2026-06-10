import React, { useState, useEffect, useRef } from 'react';
import { BarChart3, Shield, AlertTriangle, Activity, Gauge, TrendingUp, ChevronDown, ChevronUp, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Slider } from '../components/ui/slider';
import { Input } from '../components/ui/input';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../components/ui/collapsible';

const VULN_TYPES = ['LFI', 'RCE', 'XSS', 'AFO', 'SSRF', 'SQLI', 'IDOR'];
const SEVERITY_COLORS: Record<string, string> = {
  critical: 'text-red-400',
  high: 'text-orange-400',
  medium: 'text-yellow-400',
  low: 'text-green-400',
  info: 'text-blue-400',
};

interface RiskScore {
  overall: number;
  cvss: number;
  epss: number;
  businessImpact: number;
  exploitability: number;
  confidence: number;
}

// Animated gauge component
const AnimatedGauge = ({ value, size = 180 }: { value: number; size?: number }) => {
  const [animatedValue, setAnimatedValue] = useState(0);
  const prevValue = useRef(0);

  useEffect(() => {
    const start = prevValue.current;
    const end = value;
    const duration = 1200;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setAnimatedValue(start + (end - start) * eased);
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
    prevValue.current = value;
  }, [value]);

  const getScoreColor = (score: number) => {
    if (score >= 9) return '#ef4444';
    if (score >= 7) return '#f97316';
    if (score >= 4) return '#eab308';
    return '#22c55e';
  };

  const color = getScoreColor(animatedValue);
  const radius = (size - 20) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (animatedValue / 10) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth="8"
          fill="none"
          className="text-gray-800"
        />
        {/* Progress arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth="8"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          style={{ transition: 'stroke 0.5s ease' }}
        />
        {/* Glow effect */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth="8"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          style={{ transition: 'stroke 0.5s ease', filter: 'blur(4px)', opacity: 0.4 }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-4xl font-bold tabular-nums" style={{ color }}>{animatedValue.toFixed(1)}</span>
        <span className="text-xs text-gray-500 mt-1">out of 10</span>
      </div>
    </div>
  );
};

const RiskPage = () => {
  const [selectedVuln, setSelectedVuln] = useState('RCE');
  const [riskScore, setRiskScore] = useState<RiskScore | null>(null);
  const [loading, setLoading] = useState(false);
  const [showComparison, setShowComparison] = useState(true);
  const [customTarget, setCustomTarget] = useState('');
  const [businessImpactSlider, setBusinessImpactSlider] = useState([5]);
  const [exploitabilitySlider, setExploitabilitySlider] = useState([5]);

  const calculateRisk = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/risk/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          vulnType: selectedVuln,
          target: customTarget || undefined,
          businessImpact: businessImpactSlider[0],
          exploitability: exploitabilitySlider[0],
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setRiskScore(data.risk);
      }
    } catch {}
    setLoading(false);
  };

  const getScoreColor = (score: number) => {
    if (score >= 9) return 'text-red-400';
    if (score >= 7) return 'text-orange-400';
    if (score >= 4) return 'text-yellow-400';
    return 'text-green-400';
  };

  const getScoreBg = (score: number) => {
    if (score >= 9) return 'from-red-500 to-red-900';
    if (score >= 7) return 'from-orange-500 to-orange-900';
    if (score >= 4) return 'from-yellow-500 to-yellow-900';
    return 'from-green-500 to-green-900';
  };

  const vulnDefaultScores = [
    { type: 'RCE', cvss: 9.8, exploitability: 9.5, businessImpact: 9.0 },
    { type: 'SQLI', cvss: 9.1, exploitability: 8.5, businessImpact: 8.0 },
    { type: 'LFI', cvss: 7.5, exploitability: 7.0, businessImpact: 6.5 },
    { type: 'SSRF', cvss: 7.5, exploitability: 6.5, businessImpact: 7.0 },
    { type: 'AFO', cvss: 7.5, exploitability: 6.0, businessImpact: 7.5 },
    { type: 'XSS', cvss: 6.1, exploitability: 8.0, businessImpact: 4.5 },
    { type: 'IDOR', cvss: 5.3, exploitability: 5.5, businessImpact: 5.0 },
  ];

  // False positive assessment data
  const fpAssessment = [
    { type: 'XSS', fpRate: 35, reason: 'Often triggered by DOM-based false positives', mitigation: 'Verify with manual injection testing' },
    { type: 'SQLI', fpRate: 15, reason: 'Parameterized queries may still trigger error-based tests', mitigation: 'Confirm data exfiltration capability' },
    { type: 'LFI', fpRate: 20, reason: 'Path traversal may be blocked by WAF', mitigation: 'Test with encoding bypass techniques' },
    { type: 'SSRF', fpRate: 25, reason: 'Internal redirects may appear as SSRF', mitigation: 'Verify external request capability' },
    { type: 'RCE', fpRate: 10, reason: 'Command injection may be filtered', mitigation: 'Test with different command separators' },
    { type: 'AFO', fpRate: 30, reason: 'File upload restrictions may be in place', mitigation: 'Test with multiple file types' },
    { type: 'IDOR', fpRate: 40, reason: 'Access control varies by endpoint', mitigation: 'Test with different user roles' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white pt-14">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/20">
            <BarChart3 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
              Risk Assessment
            </h1>
            <p className="text-gray-400 text-sm">CVSS v3.1 scoring, false positive reduction, business impact analysis</p>
          </div>
        </div>

        {/* Risk Calculator */}
        <Card className="bg-gray-800/50 border-gray-700 mb-6">
          <CardHeader>
            <CardTitle className="text-cyan-400 flex items-center gap-2">
              <Gauge className="w-5 h-5" /> Risk Calculator
            </CardTitle>
            <CardDescription className="text-gray-400">Calculate comprehensive risk score for a vulnerability type</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Vulnerability Type</label>
                <Select value={selectedVuln} onValueChange={setSelectedVuln}>
                  <SelectTrigger className="bg-gray-900 border-gray-600">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {VULN_TYPES.map(v => (
                      <SelectItem key={v} value={v}>{v}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Target (optional)</label>
                <Input
                  value={customTarget}
                  onChange={e => setCustomTarget(e.target.value)}
                  placeholder="example.com"
                  className="bg-gray-900 border-gray-600"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Business Impact Weight: <span className="text-white font-medium">{businessImpactSlider[0]}</span></label>
                <Slider
                  value={businessImpactSlider}
                  onValueChange={setBusinessImpactSlider}
                  max={10}
                  step={0.5}
                  className="py-2"
                />
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Exploitability Weight: <span className="text-white font-medium">{exploitabilitySlider[0]}</span></label>
                <Slider
                  value={exploitabilitySlider}
                  onValueChange={setExploitabilitySlider}
                  max={10}
                  step={0.5}
                  className="py-2"
                />
              </div>
            </div>

            <Button onClick={calculateRisk} disabled={loading} className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700">
              {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Calculating...</> : 'Calculate Risk'}
            </Button>
          </CardContent>
        </Card>

        {/* Risk Gauge + Score Breakdown */}
        {riskScore && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Animated Risk Gauge */}
            <Card className="bg-gray-800/50 border-gray-700 lg:col-span-1">
              <CardContent className="p-6 flex flex-col items-center">
                <h3 className="text-lg font-bold mb-4">Overall Risk Score</h3>
                <AnimatedGauge value={riskScore.overall} />
                <Badge className={`mt-4 text-sm px-4 py-1 ${
                  riskScore.overall >= 9 ? 'bg-red-500/20 text-red-400 border-red-500/30' :
                  riskScore.overall >= 7 ? 'bg-orange-500/20 text-orange-400 border-orange-500/30' :
                  riskScore.overall >= 4 ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' :
                  'bg-green-500/20 text-green-400 border-green-500/30'
                } border`}>
                  {riskScore.overall >= 9 ? 'CRITICAL' : riskScore.overall >= 7 ? 'HIGH' : riskScore.overall >= 4 ? 'MEDIUM' : 'LOW'}
                </Badge>
              </CardContent>
            </Card>

            {/* Score Breakdown */}
            <Card className="bg-gray-800/50 border-gray-700 lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-cyan-400 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" /> Score Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { label: 'CVSS Score', value: riskScore.cvss, weight: '35%', icon: <Shield className="w-4 h-4" /> },
                    { label: 'Business Impact', value: riskScore.businessImpact, weight: '25%', icon: <AlertTriangle className="w-4 h-4" /> },
                    { label: 'Exploitability', value: riskScore.exploitability, weight: '25%', icon: <Activity className="w-4 h-4" /> },
                    { label: 'Confidence', value: riskScore.confidence, weight: '15%', icon: <CheckCircle className="w-4 h-4" /> },
                    { label: 'EPSS Score', value: riskScore.epss * 10, weight: 'factor', icon: <Gauge className="w-4 h-4" /> },
                  ].map(metric => (
                    <div key={metric.label}>
                      <div className="flex justify-between text-sm mb-1">
                        <div className="flex items-center gap-2 text-gray-300">
                          {metric.icon}
                          <span>{metric.label}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`font-bold tabular-nums ${getScoreColor(metric.value)}`}>{metric.value.toFixed(1)}</span>
                          <span className="text-gray-500 text-xs">({metric.weight})</span>
                        </div>
                      </div>
                      <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full bg-gradient-to-r ${getScoreBg(metric.value)} transition-all duration-700`}
                          style={{ width: `${Math.min(100, metric.value * 10)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Comparison Chart */}
        <Collapsible open={showComparison} onOpenChange={setShowComparison}>
          <Card className="bg-gray-800/50 border-gray-700 mb-6">
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-gray-800/80 transition-colors">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-cyan-400 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" /> Vuln Type Risk Comparison
                  </CardTitle>
                  {showComparison ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
                </div>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="pt-0">
                <div className="space-y-3">
                  {vulnDefaultScores.map(vuln => (
                    <div key={vuln.type} className="p-3 bg-gray-900/50 rounded-lg border border-gray-700/50">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-sm">{vuln.type}</span>
                        <span className={`text-sm font-bold ${getScoreColor(vuln.cvss)}`}>CVSS: {vuln.cvss}</span>
                      </div>
                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <div className="flex justify-between text-[10px] text-gray-400 mb-1">
                            <span>CVSS</span><span>{vuln.cvss}</span>
                          </div>
                          <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                            <div className="h-full rounded-full bg-gradient-to-r from-red-500 to-red-700" style={{ width: `${vuln.cvss * 10}%` }} />
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-[10px] text-gray-400 mb-1">
                            <span>Exploit</span><span>{vuln.exploitability}</span>
                          </div>
                          <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                            <div className="h-full rounded-full bg-gradient-to-r from-orange-500 to-orange-700" style={{ width: `${vuln.exploitability * 10}%` }} />
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-[10px] text-gray-400 mb-1">
                            <span>Impact</span><span>{vuln.businessImpact}</span>
                          </div>
                          <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                            <div className="h-full rounded-full bg-gradient-to-r from-yellow-500 to-yellow-700" style={{ width: `${vuln.businessImpact * 10}%` }} />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>

        {/* False Positive Assessment */}
        <Card className="bg-gray-800/50 border-gray-700 mb-6">
          <CardHeader>
            <CardTitle className="text-cyan-400 flex items-center gap-2">
              <XCircle className="w-5 h-5" /> False Positive Assessment
            </CardTitle>
            <CardDescription className="text-gray-400">Estimated false positive rates and mitigation strategies by vulnerability type</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {fpAssessment.map(fp => (
                <div key={fp.type} className="p-3 bg-gray-900/50 rounded-lg border border-gray-700/50 hover:border-gray-600 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-sm">{fp.type}</span>
                    <Badge variant={fp.fpRate >= 30 ? 'destructive' : fp.fpRate >= 20 ? 'outline' : 'default'} className="text-[10px]">
                      {fp.fpRate}% FP Rate
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-400 mb-2">{fp.reason}</p>
                  <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden mb-2">
                    <div
                      className={`h-full rounded-full ${fp.fpRate >= 30 ? 'bg-red-500' : fp.fpRate >= 20 ? 'bg-yellow-500' : 'bg-green-500'}`}
                      style={{ width: `${fp.fpRate}%` }}
                    />
                  </div>
                  <div className="flex items-start gap-1">
                    <CheckCircle className="w-3 h-3 text-green-400 shrink-0 mt-0.5" />
                    <p className="text-[10px] text-gray-500">{fp.mitigation}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* CVSS Reference */}
        <Card className="bg-gray-800/50 border-gray-700 mb-6">
          <CardHeader>
            <CardTitle className="text-cyan-400">CVSS v3.1 Severity Reference</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {[
                { range: '9.0-10.0', level: 'Critical', color: 'bg-red-500/20 text-red-400 border-red-500/50' },
                { range: '7.0-8.9', level: 'High', color: 'bg-orange-500/20 text-orange-400 border-orange-500/50' },
                { range: '4.0-6.9', level: 'Medium', color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50' },
                { range: '0.1-3.9', level: 'Low', color: 'bg-green-500/20 text-green-400 border-green-500/50' },
                { range: '0.0', level: 'Info', color: 'bg-blue-500/20 text-blue-400 border-blue-500/50' },
              ].map(ref => (
                <div key={ref.level} className={`p-4 rounded-lg border text-center ${ref.color}`}>
                  <div className="text-lg font-bold">{ref.level}</div>
                  <div className="text-sm opacity-80">{ref.range}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Default CVSS Estimates */}
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-cyan-400">Default CVSS Estimates by Vuln Type</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
              {vulnDefaultScores.map(v => (
                <div key={v.type} className="p-3 bg-gray-900/50 rounded-lg border border-gray-700/50 text-center hover:border-gray-600 transition-colors">
                  <div className="text-sm font-bold mb-1">{v.type}</div>
                  <div className={`text-xl font-bold ${getScoreColor(v.cvss)}`}>{v.cvss}</div>
                  <div className="text-[10px] text-gray-500">CVSS Base</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RiskPage;
