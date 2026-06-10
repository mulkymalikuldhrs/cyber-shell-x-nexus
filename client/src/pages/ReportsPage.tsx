import React, { useState, useEffect } from 'react';
import { FileText, Download, RefreshCw, AlertTriangle, Clock, Eye, Code, Hash, BarChart3, CheckCircle, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { ScrollArea } from '../components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';

interface ScanSummary {
  id: string;
  target: string;
  type: string;
  status: string;
  findings: any[];
  result: any;
  startedAt: string;
  completedAt?: string;
}

type ReportFormat = 'markdown' | 'html' | 'json';

const FORMAT_ICONS: Record<ReportFormat, React.ReactNode> = {
  markdown: <Hash className="w-4 h-4" />,
  html: <Code className="w-4 h-4" />,
  json: <FileText className="w-4 h-4" />,
};

const ReportsPage = () => {
  const [scans, setScans] = useState<ScanSummary[]>([]);
  const [selectedScan, setSelectedScan] = useState<ScanSummary | null>(null);
  const [reportFormat, setReportFormat] = useState<ReportFormat>('markdown');
  const [previewContent, setPreviewContent] = useState<string>('');
  const [showPreview, setShowPreview] = useState(false);
  const [generating, setGenerating] = useState(false);

  const fetchScans = async () => {
    try {
      const res = await fetch('/api/scans');
      if (res.ok) {
        const data = await res.json();
        setScans(data);
      }
    } catch {}
  };

  useEffect(() => {
    fetchScans();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const generateMarkdownReport = (scan: ScanSummary): string => {
    const findings = scan.findings || [];
    const vulnFindings = findings.filter((f: any) => !f.falsePositive);
    return `# Security Assessment Report

## Target: ${scan.target}
## Date: ${new Date().toLocaleDateString()}
## Type: ${scan.type}

---

## Executive Summary

This report presents the findings from a ${scan.type} assessment conducted on ${scan.target}. 
The assessment identified **${vulnFindings.length} confirmed vulnerabilities** out of ${findings.length} total findings.

${vulnFindings.filter((f: any) => f.severity === 'critical').length > 0 
  ? '⚠️ **CRITICAL VULNERABILITIES DETECTED** - Immediate remediation is required.' 
  : 'No critical vulnerabilities were identified.'}

---

## Findings Summary

| Severity | Count |
|----------|-------|
| Critical | ${vulnFindings.filter((f: any) => f.severity === 'critical').length} |
| High | ${vulnFindings.filter((f: any) => f.severity === 'high').length} |
| Medium | ${vulnFindings.filter((f: any) => f.severity === 'medium').length} |
| Low | ${vulnFindings.filter((f: any) => f.severity === 'low').length} |
| Info | ${vulnFindings.filter((f: any) => f.severity === 'info').length} |

---

## Detailed Findings

${vulnFindings.map((f: any, i: number) => `
### ${i + 1}. ${f.title || f.type + ' Vulnerability'}

- **Type:** ${f.type}
- **Severity:** ${f.severity}
- **Confidence:** ${f.confidence}/10
- **CVSS Estimate:** ${f.cvssEstimate || 'N/A'}

**Description:**
${f.description || 'No description available.'}

**Evidence:**
\`\`\`
${f.evidence || 'No evidence captured.'}
\`\`\`

**Remediation:**
${f.remediation || 'Follow security best practices for this vulnerability type.'}

---
`).join('\n')}

## Recommendations

1. Address all critical and high severity findings immediately
2. Implement a vulnerability management program
3. Conduct regular security assessments
4. Ensure proper input validation and output encoding
5. Maintain security headers and TLS configuration

---

⚠️ **Disclaimer:** This report is for educational and authorized testing purposes only. 
All findings should be validated in the specific context of the target environment.`;
  };

  const generateHTMLReport = (scan: ScanSummary): string => {
    const findings = scan.findings || [];
    const vulnFindings = findings.filter((f: any) => !f.falsePositive);
    const sevCounts: Record<string, number> = { critical: 0, high: 0, medium: 0, low: 0, info: 0 };
    vulnFindings.forEach((f: any) => { sevCounts[f.severity] = (sevCounts[f.severity] || 0) + 1; });

    return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Security Report - ${scan.target}</title>
<style>
body { font-family: -apple-system, sans-serif; background: #0a0a0a; color: #e5e5e5; max-width: 800px; margin: 0 auto; padding: 20px; }
h1 { color: #22d3ee; } h2 { color: #a78bfa; } h3 { color: #f97316; }
.severity-critical { color: #ef4444; } .severity-high { color: #f97316; } .severity-medium { color: #eab308; } .severity-low { color: #22c55e; }
table { border-collapse: collapse; width: 100%; } th, td { border: 1px solid #333; padding: 8px; text-align: left; }
th { background: #1a1a1a; } .finding { background: #111; border: 1px solid #333; padding: 15px; margin: 10px 0; border-radius: 8px; }
</style>
</head>
<body>
<h1>🔒 Security Assessment Report</h1>
<h2>Target: ${scan.target}</h2>
<p>Date: ${new Date().toLocaleDateString()} | Type: ${scan.type}</p>
<h2>Executive Summary</h2>
<p>${vulnFindings.length} confirmed vulnerabilities found out of ${findings.length} total findings.</p>
<table><tr><th>Severity</th><th>Count</th></tr>
${Object.entries(sevCounts).map(([sev, count]) => `<tr><td class="severity-${sev}">${sev}</td><td>${count}</td></tr>`).join('')}
</table>
<h2>Findings</h2>
${vulnFindings.map((f: any, i: number) => `<div class="finding"><h3>${i+1}. ${f.title || f.type}</h3><p>Type: ${f.type} | Severity: <span class="severity-${f.severity}">${f.severity}</span> | Confidence: ${f.confidence}/10</p><p>${f.description || ''}</p><p><strong>Remediation:</strong> ${f.remediation || 'N/A'}</p></div>`).join('')}
<p style="color:#666; margin-top:40px;">⚠️ For educational and authorized testing purposes only.</p>
</body></html>`;
  };

  const generateJSONReport = (scan: ScanSummary): string => {
    const findings = scan.findings || [];
    const vulnFindings = findings.filter((f: any) => !f.falsePositive);
    const report = {
      title: 'Security Assessment Report',
      target: scan.target,
      date: new Date().toISOString(),
      scanType: scan.type,
      summary: {
        totalFindings: findings.length,
        confirmedVulnerabilities: vulnFindings.length,
        severityBreakdown: {
          critical: vulnFindings.filter((f: any) => f.severity === 'critical').length,
          high: vulnFindings.filter((f: any) => f.severity === 'high').length,
          medium: vulnFindings.filter((f: any) => f.severity === 'medium').length,
          low: vulnFindings.filter((f: any) => f.severity === 'low').length,
          info: vulnFindings.filter((f: any) => f.severity === 'info').length,
        }
      },
      findings: vulnFindings.map((f: any) => ({
        title: f.title,
        type: f.type,
        severity: f.severity,
        confidence: f.confidence,
        cvssEstimate: f.cvssEstimate,
        description: f.description,
        evidence: f.evidence,
        remediation: f.remediation,
        falsePositive: f.falsePositive,
      })),
      disclaimer: 'For educational and authorized testing purposes only.'
    };
    return JSON.stringify(report, null, 2);
  };

  const generateReport = (scan: ScanSummary, format: ReportFormat) => {
    setGenerating(true);
    let content: string;
    let mimeType: string;
    let extension: string;

    switch (format) {
      case 'html':
        content = generateHTMLReport(scan);
        mimeType = 'text/html';
        extension = 'html';
        break;
      case 'json':
        content = generateJSONReport(scan);
        mimeType = 'application/json';
        extension = 'json';
        break;
      default:
        content = generateMarkdownReport(scan);
        mimeType = 'text/markdown';
        extension = 'md';
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `security-report-${scan.target}-${Date.now()}.${extension}`;
    a.click();
    URL.revokeObjectURL(url);
    setGenerating(false);
  };

  const previewReport = (scan: ScanSummary, format: ReportFormat) => {
    setSelectedScan(scan);
    setReportFormat(format);
    setShowPreview(true);

    switch (format) {
      case 'html':
        setPreviewContent(generateHTMLReport(scan));
        break;
      case 'json':
        setPreviewContent(generateJSONReport(scan));
        break;
      default:
        setPreviewContent(generateMarkdownReport(scan));
    }
  };

  const completedScans = scans.filter(s => s.status === 'completed');

  // Report statistics
  const totalFindings = completedScans.reduce((acc, s) => acc + (s.findings?.length || 0), 0);
  const totalCritical = completedScans.reduce((acc, s) => acc + (s.findings?.filter((f: any) => f.severity === 'critical').length || 0), 0);
  const totalHigh = completedScans.reduce((acc, s) => acc + (s.findings?.filter((f: any) => f.severity === 'high').length || 0), 0);
  const avgFindingsPerScan = completedScans.length > 0 ? (totalFindings / completedScans.length).toFixed(1) : '0';

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white pt-14">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/20">
            <FileText className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-green-400 to-teal-400 bg-clip-text text-transparent">
              Reports
            </h1>
            <p className="text-gray-400 text-sm">Generate and download security assessment reports</p>
          </div>
        </div>

        {/* Report Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {[
            { label: 'Completed Scans', value: completedScans.length, icon: <CheckCircle className="w-4 h-4" />, color: 'text-green-400', bg: 'from-green-500/10 to-green-600/5', border: 'border-green-500/20' },
            { label: 'Total Findings', value: totalFindings, icon: <AlertCircle className="w-4 h-4" />, color: 'text-orange-400', bg: 'from-orange-500/10 to-orange-600/5', border: 'border-orange-500/20' },
            { label: 'Critical+High', value: totalCritical + totalHigh, icon: <AlertTriangle className="w-4 h-4" />, color: 'text-red-400', bg: 'from-red-500/10 to-red-600/5', border: 'border-red-500/20' },
            { label: 'Avg/Scan', value: avgFindingsPerScan, icon: <BarChart3 className="w-4 h-4" />, color: 'text-cyan-400', bg: 'from-cyan-500/10 to-cyan-600/5', border: 'border-cyan-500/20' },
          ].map(stat => (
            <Card key={stat.label} className={`bg-gradient-to-br ${stat.bg} border ${stat.border}`}>
              <CardContent className="p-4 flex items-center gap-3">
                <span className={stat.color}>{stat.icon}</span>
                <div>
                  <div className={`text-xl font-bold ${stat.color}`}>{stat.value}</div>
                  <div className="text-[10px] text-gray-400">{stat.label}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Preview Panel */}
        {showPreview && selectedScan && (
          <Card className="bg-gray-800/50 border-cyan-500/30 mb-6">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-cyan-400 flex items-center gap-2">
                  <Eye className="w-5 h-5" /> Report Preview: {selectedScan.target}
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Select value={reportFormat} onValueChange={(v: ReportFormat) => previewReport(selectedScan, v)}>
                    <SelectTrigger className="bg-gray-900 border-gray-600 w-32 h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="markdown">
                        <span className="flex items-center gap-1">{FORMAT_ICONS.markdown} Markdown</span>
                      </SelectItem>
                      <SelectItem value="html">
                        <span className="flex items-center gap-1">{FORMAT_ICONS.html} HTML</span>
                      </SelectItem>
                      <SelectItem value="json">
                        <span className="flex items-center gap-1">{FORMAT_ICONS.json} JSON</span>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <Button size="sm" onClick={() => generateReport(selectedScan, reportFormat)} disabled={generating} className="bg-green-600 hover:bg-green-700">
                    <Download className="w-4 h-4 mr-1" /> Download
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => setShowPreview(false)} className="text-gray-400">
                    ✕
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="bg-black/50 rounded-lg border border-gray-700 p-4">
                <ScrollArea className="max-h-96">
                  <pre className="text-xs font-mono text-gray-300 whitespace-pre-wrap">{previewContent}</pre>
                </ScrollArea>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Scan List */}
        {completedScans.length === 0 ? (
          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-12 text-center text-gray-500">
              <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg">No completed scans available for reporting</p>
              <p className="text-sm mt-2">Run a scan first, then return here to generate reports</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {completedScans.map(scan => {
              const findings = scan.findings || [];
              const criticalCount = findings.filter((f: any) => f.severity === 'critical').length;
              const highCount = findings.filter((f: any) => f.severity === 'high').length;
              const medCount = findings.filter((f: any) => f.severity === 'medium').length;
              const lowCount = findings.filter((f: any) => f.severity === 'low').length;

              return (
                <Card key={scan.id} className="bg-gray-800/50 border-gray-700 hover:border-gray-600 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                      <div className="flex-1">
                        <h3 className="font-bold text-lg">{scan.target}</h3>
                        <div className="flex items-center gap-2 text-sm text-gray-400 mt-1 flex-wrap">
                          <Clock className="w-4 h-4" />
                          <span>{new Date(scan.startedAt).toLocaleString()}</span>
                          <Badge variant="outline" className="text-xs">{scan.type}</Badge>
                          {scan.completedAt && (
                            <span className="text-xs text-gray-500">
                              Duration: {Math.round((new Date(scan.completedAt).getTime() - new Date(scan.startedAt).getTime()) / 1000)}s
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-3 flex-wrap">
                        {/* Severity badges */}
                        <div className="flex gap-1">
                          {criticalCount > 0 && <Badge className="text-[10px] bg-red-500/20 text-red-400 border-red-500/30 border">{criticalCount} critical</Badge>}
                          {highCount > 0 && <Badge className="text-[10px] bg-orange-500/20 text-orange-400 border-orange-500/30 border">{highCount} high</Badge>}
                          {medCount > 0 && <Badge className="text-[10px] bg-yellow-500/20 text-yellow-400 border-yellow-500/30 border">{medCount} medium</Badge>}
                          {lowCount > 0 && <Badge className="text-[10px] bg-green-500/20 text-green-400 border-green-500/30 border">{lowCount} low</Badge>}
                          {findings.length === 0 && <Badge variant="outline" className="text-xs">No findings</Badge>}
                        </div>

                        {/* Format select + Actions */}
                        <div className="flex items-center gap-2">
                          <Select defaultValue="markdown" onValueChange={(v: ReportFormat) => generateReport(scan, v)}>
                            <SelectTrigger className="bg-gray-900 border-gray-600 w-28 h-8 text-xs">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="markdown">Markdown</SelectItem>
                              <SelectItem value="html">HTML</SelectItem>
                              <SelectItem value="json">JSON</SelectItem>
                            </SelectContent>
                          </Select>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => previewReport(scan, 'markdown')}
                            className="border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10"
                          >
                            <Eye className="w-4 h-4 mr-1" /> Preview
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => generateReport(scan, 'markdown')}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <Download className="w-4 h-4 mr-1" /> Download
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportsPage;
