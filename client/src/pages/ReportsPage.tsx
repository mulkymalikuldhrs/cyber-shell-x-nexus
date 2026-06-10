import React, { useState, useEffect } from 'react';
import { FileText, Download, RefreshCw, AlertTriangle, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { ScrollArea } from '../components/ui/scroll-area';

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

const ReportsPage = () => {
  const [scans, setScans] = useState<ScanSummary[]>([]);
  const [selectedScan, setSelectedScan] = useState<ScanSummary | null>(null);

  useEffect(() => {
    fetchScans();
  }, []);

  const fetchScans = async () => {
    try {
      const res = await fetch('/api/scans');
      if (res.ok) {
        const data = await res.json();
        setScans(data);
      }
    } catch {}
  };

  const generateReport = (scan: ScanSummary) => {
    const findings = scan.findings || [];
    const vulnFindings = findings.filter((f: any) => !f.falsePositive);
    const reconResult = scan.result;

    const report = `# Security Assessment Report

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

${f.poc ? `**Proof of Concept (Educational):**
\`\`\`
${f.poc}
\`\`\`` : ''}

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
All findings should be validated in the specific context of the target environment.
`;

    // Create and download the report
    const blob = new Blob([report], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `security-report-${scan.target}-${Date.now()}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const completedScans = scans.filter(s => s.status === 'completed');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <FileText className="w-8 h-8 text-green-400" />
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-teal-400 bg-clip-text text-transparent">
              Reports
            </h1>
            <p className="text-gray-400">Generate and download security assessment reports</p>
          </div>
        </div>

        {completedScans.length === 0 ? (
          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-12 text-center text-gray-500">
              <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No completed scans available for reporting</p>
              <p className="text-sm mt-2">Run a scan first, then return here to generate reports</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {completedScans.map(scan => (
              <Card key={scan.id} className="bg-gray-800/50 border-gray-700">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-lg">{scan.target}</h3>
                      <div className="flex items-center gap-2 text-sm text-gray-400 mt-1">
                        <Clock className="w-4 h-4" />
                        <span>{new Date(scan.startedAt).toLocaleString()}</span>
                        <Badge variant="outline">{scan.type}</Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="text-sm text-gray-400">Findings</div>
                        <div className="flex gap-1">
                          {['critical', 'high', 'medium', 'low'].map(sev => {
                            const count = (scan.findings || []).filter((f: any) => f.severity === sev).length;
                            return count > 0 ? (
                              <Badge key={sev} variant="outline" className="text-xs">{count} {sev}</Badge>
                            ) : null;
                          })}
                        </div>
                      </div>
                      <Button
                        onClick={() => generateReport(scan)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <Download className="w-4 h-4 mr-2" /> Download Report
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportsPage;
