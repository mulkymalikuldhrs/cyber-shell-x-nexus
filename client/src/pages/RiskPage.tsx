import React, { useState } from 'react';
import { BarChart3, Shield, AlertTriangle, Activity, Gauge, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';

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

const RiskPage = () => {
  const [selectedVuln, setSelectedVuln] = useState('RCE');
  const [riskScore, setRiskScore] = useState<RiskScore | null>(null);
  const [loading, setLoading] = useState(false);

  const calculateRisk = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/risk/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vulnType: selectedVuln }),
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <BarChart3 className="w-8 h-8 text-orange-400" />
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
              Risk Assessment
            </h1>
            <p className="text-gray-400">CVSS v3.1 scoring, false positive reduction, business impact analysis</p>
          </div>
        </div>

        {/* Risk Calculator */}
        <Card className="bg-gray-800/50 border-gray-700 mb-6">
          <CardHeader>
            <CardTitle className="text-cyan-400">Risk Calculator</CardTitle>
            <CardDescription className="text-gray-400">Calculate comprehensive risk score for a vulnerability type</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 items-end">
              <div className="flex-1">
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
              <Button onClick={calculateRisk} disabled={loading} className="bg-orange-600 hover:bg-orange-700">
                {loading ? 'Calculating...' : 'Calculate Risk'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Risk Gauge */}
        {riskScore && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Overall Risk Gauge */}
            <Card className="bg-gray-800/50 border-gray-700 lg:col-span-1">
              <CardContent className="p-6 flex flex-col items-center">
                <h3 className="text-lg font-bold mb-4">Overall Risk Score</h3>
                <div className={`w-40 h-40 rounded-full bg-gradient-to-br ${getScoreBg(riskScore.overall)} flex items-center justify-center border-4 border-gray-700`}>
                  <div className="w-32 h-32 rounded-full bg-gray-900 flex items-center justify-center">
                    <span className={`text-4xl font-bold ${getScoreColor(riskScore.overall)}`}>
                      {riskScore.overall.toFixed(1)}
                    </span>
                  </div>
                </div>
                <Badge className={`mt-4 text-lg ${riskScore.overall >= 9 ? 'bg-red-500/20 text-red-400' : riskScore.overall >= 7 ? 'bg-orange-500/20 text-orange-400' : riskScore.overall >= 4 ? 'bg-yellow-500/20 text-yellow-400' : 'bg-green-500/20 text-green-400'}`}>
                  {riskScore.overall >= 9 ? 'CRITICAL' : riskScore.overall >= 7 ? 'HIGH' : riskScore.overall >= 4 ? 'MEDIUM' : 'LOW'}
                </Badge>
              </CardContent>
            </Card>

            {/* Score Breakdown */}
            <Card className="bg-gray-800/50 border-gray-700 lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-cyan-400">Score Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { label: 'CVSS Score', value: riskScore.cvss, weight: '35%' },
                    { label: 'Business Impact', value: riskScore.businessImpact, weight: '25%' },
                    { label: 'Exploitability', value: riskScore.exploitability, weight: '25%' },
                    { label: 'Confidence', value: riskScore.confidence, weight: '15%' },
                    { label: 'EPSS Score', value: riskScore.epss * 10, weight: 'factor' },
                  ].map(metric => (
                    <div key={metric.label}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-300">{metric.label}</span>
                        <div className="flex items-center gap-2">
                          <span className={`font-bold ${getScoreColor(metric.value)}`}>{metric.value.toFixed(1)}</span>
                          <span className="text-gray-500 text-xs">({metric.weight})</span>
                        </div>
                      </div>
                      <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full bg-gradient-to-r ${getScoreBg(metric.value)}`}
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

        {/* CVSS Reference */}
        <Card className="bg-gray-800/50 border-gray-700 mt-6">
          <CardHeader>
            <CardTitle className="text-cyan-400">CVSS v3.1 Severity Reference</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
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

        {/* Vuln Type Default Scores */}
        <Card className="bg-gray-800/50 border-gray-700 mt-6">
          <CardHeader>
            <CardTitle className="text-cyan-400">Default CVSS Estimates by Vuln Type</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
              {[
                { type: 'RCE', cvss: 9.8 },
                { type: 'SQLI', cvss: 9.1 },
                { type: 'LFI', cvss: 7.5 },
                { type: 'SSRF', cvss: 7.5 },
                { type: 'AFO', cvss: 7.5 },
                { type: 'XSS', cvss: 6.1 },
                { type: 'IDOR', cvss: 5.3 },
              ].map(v => (
                <div key={v.type} className="p-3 bg-gray-900/50 rounded-lg border border-gray-700 text-center">
                  <div className="text-sm font-bold">{v.type}</div>
                  <div className={`text-xl font-bold ${getScoreColor(v.cvss)}`}>{v.cvss}</div>
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
