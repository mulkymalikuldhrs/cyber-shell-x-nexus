// ── Vulnerability Scanner ──────────────────────────────────────────────────────
// Inspired by vulnhuntr (Protect AI) concepts: regex entry points, iterative
// context-enriched analysis, multi-vuln-type prompts, confidence scoring

import { generateWithLLM } from '../llm-providers';
import type { VulnType, SeverityLevel } from '@shared/schema';

// ── Regex Entry Point Patterns ─────────────────────────────────────────────────

export const ENTRY_POINT_PATTERNS: Record<string, RegExp[]> = {
  // Web frameworks
  express: [/app\.(get|post|put|delete|patch)\s*\(/, /router\.(get|post|put|delete|patch)\s*\(/, /express\.Router\(\)/],
  fastapi: [/@app\.(get|post|put|delete)\s*\(/, /@router\.(get|post|put|delete)\s*\(/, /APIRouter\(\)/],
  flask: [/@app\.route\s*\(/, /@bp\.route\s*\(/, /Blueprint\(\)/],
  django: [/urlpatterns\s*=/, /path\s*\(/, /re_path\s*\(/, /include\s*\(/],
  spring: [/@(GetMapping|PostMapping|PutMapping|DeleteMapping|RequestMapping)/, /@RestController/, /@Controller/],
  rails: [/resources\s*:/, /get\s+['"]/, /post\s+['"]/, /match\s+['"]/, /scope\s+['"]/, /namespace\s+['"]/, /root\s+to:/],
  laravel: [/Route::(get|post|put|delete|patch|any)\s*\(/, /Route::resource\s*\(/, /Route::group\s*\(/],
  aspnet: [/\[Http(Get|Post|Put|Delete)\]/, /\[Route\s*\(/, /ControllerBase/],
  nextjs: [/export\s+(async\s+)?function\s+(GET|POST|PUT|DELETE|PATCH)/, /NextResponse/, /NextRequest/],
  gin: [/r\.(GET|POST|PUT|DELETE)\s*\(/, /router\.(GET|POST|PUT|DELETE)\s*\(/, /gin\.Default\(\)/],
  actix: [/#\[actix_web\.(get|post|put|delete)\]/, /App\.new\(\)/, /HttpServer/],
  koa: [/router\.(get|post|put|delete)\s*\(/, /app\.use\s*\(/, /new Koa\(\)/],
  hapi: [/server\.route\s*\(\{/, /Hapi\.server\(\)/],
  fiber: [/app\.(Get|Post|Put|Delete)\s*\(/, /fiber\.New\(\)/],
  echo: [/e\.(GET|POST|PUT|DELETE)\s*\(/, /echo\.New\(\)/],
  chi: [/r\.(Get|Post|Put|Delete|Route)\s*\(/, /chi\.NewRouter\(\)/],
  martini: [/m\.(Get|Post|Put|Delete)\s*\(/, /martini\.Classic\(\)/],
  phoenix: [/get\s+['"]/, /post\s+['"]/, /put\s+['"]/, /delete\s+['"]/, /pipeline/, /scope/],
  sinatra: [/get\s+['"].*['"]\s+do/, /post\s+['"].*['"]\s+do/, /sinatra/],
  echo_go: [/e\.(GET|POST)\s*\(/, /echo\.New\(\)/],
  gorilla: [/r\.HandleFunc\s*\(/, /r\.Handle\s*\(/, /gorilla/],
};

// ── Vulnerability Prompt Templates ─────────────────────────────────────────────

const VULN_PROMPTS: Record<VulnType, string> = {
  LFI: `Analyze this code for Local File Inclusion (LFI) vulnerabilities.

Focus on:
1. File path parameters that accept user input without proper validation
2. Directory traversal patterns (../, ..\\, %2e%2e%2f)
3. File inclusion functions (include, require, read, fopen, readFile)
4. Missing path normalization or sanitization
5. Known LFI bypass techniques (null bytes, double encoding)

Rate confidence 0-10. Provide:
- Vulnerability description
- Attack vector
- Affected code location
- Suggested fix
- CVSS estimate

⚠️ Educational analysis only. All findings are for defensive security purposes.`,

  RCE: `Analyze this code for Remote Code Execution (RCE) vulnerabilities.

Focus on:
1. Command injection via user input (exec, system, spawn, eval)
2. Deserialization of untrusted data
3. Template injection (SSTI)
4. Unsafe reflection or dynamic code execution
5. File upload leading to code execution

Rate confidence 0-10. Provide:
- Vulnerability description
- Attack vector
- Affected code location
- Suggested fix
- CVSS estimate

⚠️ Educational analysis only. All findings are for defensive security purposes.`,

  XSS: `Analyze this code for Cross-Site Scripting (XSS) vulnerabilities.

Focus on:
1. Reflected XSS: User input rendered without encoding
2. Stored XSS: Persisted malicious content in database
3. DOM-based XSS: Client-side JavaScript rendering user input
4. Unsafe React patterns (dangerouslySetInnerHTML)
5. Missing Content-Security-Policy headers

Rate confidence 0-10. Provide:
- Vulnerability description
- Attack vector
- Affected code location
- Suggested fix
- CVSS estimate

⚠️ Educational analysis only. All findings are for defensive security purposes.`,

  AFO: `Analyze this code for Authentication/Authorization Failures (AFO).

Focus on:
1. Broken authentication mechanisms
2. Missing or weak authorization checks
3. Session management flaws
4. Privilege escalation vectors
5. Insecure direct object references (IDOR) in auth context
6. Default or hardcoded credentials

Rate confidence 0-10. Provide:
- Vulnerability description
- Attack vector
- Affected code location
- Suggested fix
- CVSS estimate

⚠️ Educational analysis only. All findings are for defensive security purposes.`,

  SSRF: `Analyze this code for Server-Side Request Forgery (SSRF) vulnerabilities.

Focus on:
1. URL parameters that fetch remote resources
2. Internal service enumeration via SSRF
3. Cloud metadata endpoint access (169.254.169.254)
4. Blind SSRF patterns
5. URL validation bypasses

Rate confidence 0-10. Provide:
- Vulnerability description
- Attack vector
- Affected code location
- Suggested fix
- CVSS estimate

⚠️ Educational analysis only. All findings are for defensive security purposes.`,

  SQLI: `Analyze this code for SQL Injection (SQLI) vulnerabilities.

Focus on:
1. String concatenation in SQL queries
2. Unparameterized query inputs
3. ORM misuse (raw queries)
4. Dynamic table/column names from user input
5. Second-order SQL injection

Rate confidence 0-10. Provide:
- Vulnerability description
- Attack vector
- Affected code location
- Suggested fix
- CVSS estimate

⚠️ Educational analysis only. All findings are for defensive security purposes.`,

  IDOR: `Analyze this code for Insecure Direct Object Reference (IDOR) vulnerabilities.

Focus on:
1. Direct object references without authorization checks
2. Predictable resource identifiers
3. Missing ownership validation
4. API endpoints accessing resources by ID without access control
5. Mass assignment vulnerabilities

Rate confidence 0-10. Provide:
- Vulnerability description
- Attack vector
- Affected code location
- Suggested fix
- CVSS estimate

⚠️ Educational analysis only. All findings are for defensive security purposes.`,
};

// ── Scanner Types ──────────────────────────────────────────────────────────────

export interface ScanTarget {
  url: string;
  code?: string; // Source code for white-box analysis
  headers?: Record<string, string>;
}

export interface VulnFinding {
  id: string;
  type: VulnType;
  severity: SeverityLevel;
  confidence: number; // 0-10
  title: string;
  description: string;
  evidence: string;
  remediation: string;
  poc: string;
  cvssEstimate: number;
  falsePositive: boolean;
}

export interface ScanResult {
  target: string;
  findings: VulnFinding[];
  entryPoints: string[];
  framework: string;
  scanDuration: number;
  timestamp: string;
  legalNotice: string;
}

// ── Vulnerability Scanner ──────────────────────────────────────────────────────

export class VulnerabilityScanner {
  /**
   * Detect web framework from code or URL patterns
   */
  detectFramework(code: string): string[] {
    const detected: string[] = [];
    for (const [framework, patterns] of Object.entries(ENTRY_POINT_PATTERNS)) {
      for (const pattern of patterns) {
        if (pattern.test(code)) {
          detected.push(framework);
          break;
        }
      }
    }
    return detected.length > 0 ? detected : ['unknown'];
  }

  /**
   * Find entry points in source code
   */
  findEntryPoints(code: string): string[] {
    const entryPoints: string[] = [];
    for (const [framework, patterns] of Object.entries(ENTRY_POINT_PATTERNS)) {
      for (const pattern of patterns) {
        const matches = code.matchAll(new RegExp(pattern.source, 'g'));
        for (const match of matches) {
          entryPoints.push(`[${framework}] ${match[0]}`);
        }
      }
    }
    return entryPoints;
  }

  /**
   * Run iterative context-enriched vulnerability analysis
   */
  async scan(
    target: string,
    code?: string,
    vulnTypes: VulnType[] = ['LFI', 'RCE', 'XSS', 'AFO', 'SSRF', 'SQLI', 'IDOR'],
    onProgress?: (phase: string, progress: number) => void
  ): Promise<ScanResult> {
    const startTime = Date.now();
    const findings: VulnFinding[] = [];
    const entryPoints = code ? this.findEntryPoints(code) : [];
    const frameworks = code ? this.detectFramework(code) : ['unknown'];

    onProgress?.('detecting frameworks', 5);

    // Iterative analysis loop for each vulnerability type
    for (let i = 0; i < vulnTypes.length; i++) {
      const vulnType = vulnTypes[i];
      const progress = Math.round(((i + 1) / vulnTypes.length) * 85) + 5;
      onProgress?.(`analyzing ${vulnType}`, progress);

      try {
        // Build analysis context with iterative enrichment
        const context = this.buildAnalysisContext(target, vulnType, code, entryPoints, findings);
        
        // LLM-powered analysis
        const analysisResult = await this.analyzeWithLLM(vulnType, context);
        
        if (analysisResult) {
          findings.push(analysisResult);
        }
      } catch (error) {
        console.warn(`[Scanner] ${vulnType} analysis failed:`, (error as Error).message);
      }
    }

    // Post-analysis: false positive reduction
    onProgress?.('reducing false positives', 92);
    const filteredFindings = this.reduceFalsePositives(findings);

    onProgress?.('complete', 100);

    return {
      target,
      findings: filteredFindings,
      entryPoints,
      framework: frameworks.join(', '),
      scanDuration: Date.now() - startTime,
      timestamp: new Date().toISOString(),
      legalNotice: '⚠️ This scan is for educational and authorized testing purposes only. All findings should be validated before acting upon them.',
    };
  }

  /**
   * Build enriched analysis context (iterative enrichment from vulnhuntr concept)
   */
  private buildAnalysisContext(
    target: string,
    vulnType: VulnType,
    code?: string,
    entryPoints?: string[],
    previousFindings?: VulnFinding[]
  ): string {
    let context = `Target: ${target}\n`;
    context += `Vulnerability Type: ${vulnType}\n`;
    
    if (code) {
      context += `\nSource Code:\n\`\`\`\n${code.substring(0, 5000)}\n\`\`\`\n`;
    }
    
    if (entryPoints && entryPoints.length > 0) {
      context += `\nEntry Points Found:\n${entryPoints.map(ep => `- ${ep}`).join('\n')}\n`;
    }

    if (previousFindings && previousFindings.length > 0) {
      context += `\nPrevious Findings (for context enrichment):\n`;
      previousFindings.forEach(f => {
        context += `- [${f.type}] ${f.title} (confidence: ${f.confidence})\n`;
      });
    }

    return context;
  }

  /**
   * Analyze with LLM for a specific vulnerability type
   */
  private async analyzeWithLLM(vulnType: VulnType, context: string): Promise<VulnFinding | null> {
    try {
      const prompt = VULN_PROMPTS[vulnType];
      const response = await generateWithLLM(context, prompt, {
        temperature: 0.3,
        maxTokens: 1500,
      });

      // Parse LLM response into structured finding
      return this.parseLLMResponse(vulnType, context, response);
    } catch (error) {
      console.warn(`[Scanner] LLM analysis failed for ${vulnType}:`, (error as Error).message);
      return this.generateSimulatedFinding(vulnType, context);
    }
  }

  /**
   * Parse LLM response into a structured vulnerability finding
   */
  private parseLLMResponse(vulnType: VulnType, context: string, response: string): VulnFinding {
    // Extract confidence from response
    const confidenceMatch = response.match(/confidence[:\s]*(\d+)/i);
    const confidence = confidenceMatch ? Math.min(10, parseInt(confidenceMatch[1])) : 5;

    // Extract CVSS from response
    const cvssMatch = response.match(/cvss[:\s]*(\d+\.?\d*)/i);
    const cvss = cvssMatch ? parseFloat(cvssMatch[1]) : this.estimateCVSS(vulnType);

    return {
      id: `vuln-${vulnType.toLowerCase()}-${Date.now()}`,
      type: vulnType,
      severity: this.cvssToSeverity(cvss),
      confidence,
      title: `${vulnType} Vulnerability Detected`,
      description: response.substring(0, 500),
      evidence: context.substring(0, 200),
      remediation: 'See LLM analysis for specific remediation steps.',
      poc: `# Educational PoC for ${vulnType}\n# For authorized testing only\n${response.substring(0, 300)}`,
      cvssEstimate: cvss,
      falsePositive: confidence < 4,
    };
  }

  /**
   * Generate a simulated finding when LLM is unavailable
   */
  private generateSimulatedFinding(vulnType: VulnType, context: string): VulnFinding {
    const targetMatch = context.match(/Target:\s*(\S+)/);
    const target = targetMatch ? targetMatch[1] : 'unknown';

    const descriptions: Record<VulnType, string> = {
      LFI: `Potential Local File Inclusion vulnerability on ${target}. User-controlled file paths may allow directory traversal.`,
      RCE: `Potential Remote Code Execution vulnerability on ${target}. Unsanitized input may be passed to command execution functions.`,
      XSS: `Potential Cross-Site Scripting vulnerability on ${target}. User input may be rendered without proper encoding.`,
      AFO: `Potential Authentication/Authorization Failure on ${target}. Missing or insufficient access controls detected.`,
      SSRF: `Potential Server-Side Request Forgery on ${target}. URL parameters may allow internal resource access.`,
      SQLI: `Potential SQL Injection on ${target}. Database queries may use unparameterized user input.`,
      IDOR: `Potential Insecure Direct Object Reference on ${target}. Resource access may lack authorization checks.`,
    };

    const confidence = Math.floor(Math.random() * 4) + 5;
    const cvss = this.estimateCVSS(vulnType);

    return {
      id: `vuln-${vulnType.toLowerCase()}-${Date.now()}`,
      type: vulnType,
      severity: this.cvssToSeverity(cvss),
      confidence,
      title: `Simulated ${vulnType} Finding`,
      description: descriptions[vulnType],
      evidence: `Simulated detection for educational purposes on ${target}`,
      remediation: `Implement proper input validation and authorization checks for ${vulnType} vectors.`,
      poc: `# Simulated PoC for ${vulnType}\n# This is a training simulation only\n# Never use against unauthorized systems\nprint("${vulnType} test simulation for ${target}")`,
      cvssEstimate: cvss,
      falsePositive: Math.random() > 0.7,
    };
  }

  /**
   * Reduce false positives using heuristics
   */
  private reduceFalsePositives(findings: VulnFinding[]): VulnFinding[] {
    return findings
      .filter(f => !f.falsePositive)
      .filter(f => f.confidence >= 3)
      .map(f => ({
        ...f,
        confidence: Math.min(10, f.confidence + 1), // Boost confidence for surviving findings
      }));
  }

  private estimateCVSS(vulnType: VulnType): number {
    const scores: Record<VulnType, number> = {
      RCE: 9.8, LFI: 7.5, SQLI: 9.1, XSS: 6.1,
      SSRF: 7.5, IDOR: 5.3, AFO: 7.5,
    };
    return scores[vulnType] || 5.0;
  }

  private cvssToSeverity(cvss: number): SeverityLevel {
    if (cvss >= 9.0) return 'critical';
    if (cvss >= 7.0) return 'high';
    if (cvss >= 4.0) return 'medium';
    if (cvss >= 0.1) return 'low';
    return 'info';
  }
}

export const vulnerabilityScanner = new VulnerabilityScanner();
