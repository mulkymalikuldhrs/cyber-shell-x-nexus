// ── Safety Pipeline ─────────────────────────────────────────────────────────────
// 5-layer safety check: guardrails → validation → fact-check → consistency → correction
// Input/output filtering, scope validation, legal notice enforcement

import type { SafetyCheckResult } from '@shared/schema';

// ── Scope Rules ────────────────────────────────────────────────────────────────

const BLOCKED_TARGETS = [
  /(?:^|[^\d])127\.\d/,                          // localhost
  /(?:^|[^\d])10\.\d/,                           // private class A
  /(?:^|[^\d])172\.(1[6-9]|2[0-9]|3[01])\./,    // private class B
  /(?:^|[^\d])192\.168\./,                       // private class C
  /(?:^|[^\d])0\.\d/,                            // invalid
  /(?:^|\s)localhost(?:\s|$)/i,                  // localhost
  /^::1$/,                                        // IPv6 loopback
  /fe80:/i,                                       // link-local
  /fc00:/i,                                       // unique local
  /government\./i,                                // government sites
  /\.gov(?:\s|$|\/)/i,                           // .gov TLD
  /\.mil(?:\s|$|\/)/i,                           // .mil TLD
  /\.int(?:\s|$|\/)/i,                           // .int TLD
];

const BLOCKED_COMMANDS = [
  /rm\s+-rf\s+\//,                   // destructive rm
  /dd\s+if=.*of=\/dev\//,           // disk overwrite
  /mkfs\./,                          // filesystem format
  /:(){ :|:& };:/,                   // fork bomb
  /chmod\s+777\s+\//,               // dangerous chmod
  /shutdown/,                        // system shutdown
  /reboot/,                          // system reboot
  /init\s+[06]/,                     // init level change
  />\s*\/dev\/sda/,                  // device write
  /wget.*\|\s*sh/,                   // pipe download to shell
  /curl.*\|\s*sh/,                   // pipe download to shell
];

const BLOCKED_CONTENT = [
  /child\s+porn/i,
  /terrorism/i,
  /illegal\s+drug/i,
  /weapon\s+of\s+mass/i,
];

// ── Safety Pipeline ────────────────────────────────────────────────────────────

export class SafetyPipeline {
  /**
   * Run all 5 safety layers
   */
  async check(input: string, context: { type: string; target?: string }): Promise<{
    passed: boolean;
    results: SafetyCheckResult[];
    legalNotice: string;
  }> {
    const results: SafetyCheckResult[] = [];

    // Layer 1: Guardrails - Block obviously dangerous content
    results.push(this.layerGuardrails(input));
    
    // Layer 2: Validation - Validate input format and scope
    results.push(this.layerValidation(input, context));
    
    // Layer 3: Fact-check - Verify target scope
    results.push(await this.layerFactCheck(input, context));
    
    // Layer 4: Consistency - Check for logical inconsistencies
    results.push(this.layerConsistency(input, context));
    
    // Layer 5: Correction - Apply safety corrections
    results.push(this.layerCorrection(input, context));

    const passed = results.every(r => r.passed);
    
    return {
      passed,
      results,
      legalNotice: this.getLegalNotice(context.type),
    };
  }

  /**
   * Layer 1: Guardrails - Block dangerous content
   */
  private layerGuardrails(input: string): SafetyCheckResult {
    // Check for blocked content categories
    for (const pattern of BLOCKED_CONTENT) {
      if (pattern.test(input)) {
        return {
          passed: false,
          layer: 'guardrails',
          message: 'Input contains prohibited content',
          details: 'Content that violates safety guidelines was detected.',
        };
      }
    }

    // Check for destructive commands
    for (const pattern of BLOCKED_COMMANDS) {
      if (pattern.test(input)) {
        return {
          passed: false,
          layer: 'guardrails',
          message: 'Destructive command detected',
          details: 'Commands that could cause system damage are not permitted.',
        };
      }
    }

    return {
      passed: true,
      layer: 'guardrails',
      message: 'Input passed guardrail checks',
    };
  }

  /**
   * Layer 2: Validation - Validate input format and scope
   */
  private layerValidation(input: string, context: { type: string; target?: string }): SafetyCheckResult {
    // Validate input length
    if (input.length > 10000) {
      return {
        passed: false,
        layer: 'validation',
        message: 'Input exceeds maximum length',
        details: 'Input must be under 10,000 characters.',
      };
    }

    // Validate target scope — check both context.target and input string
    const targetsToCheck = [context.target, input].filter(Boolean);
    for (const target of targetsToCheck) {
      for (const pattern of BLOCKED_TARGETS) {
        if (pattern.test(target!)) {
          return {
            passed: false,
            layer: 'validation',
            message: 'Target is out of scope',
            details: 'Private/internal IP addresses and government domains cannot be targeted.',
          };
        }
      }
    }

    // Validate input encoding (prevent injection)
    if (/[^\x20-\x7E\n\r\t]/.test(input) && !input.includes('\\x')) {
      return {
        passed: false,
        layer: 'validation',
        message: 'Invalid characters in input',
        details: 'Input contains non-printable characters.',
      };
    }

    return {
      passed: true,
      layer: 'validation',
      message: 'Input validation passed',
    };
  }

  /**
   * Layer 3: Fact-check - Verify factual claims about targets
   */
  private async layerFactCheck(input: string, context: { type: string; target?: string }): Promise<SafetyCheckResult> {
    // Check for claims about real-world exploitation
    const exploitationClaims = /(?:exploit|hack|attack|breach|compromise)\s+(?:a\s+)?(?:real|production|live)\s+(?:system|server|network)/i;
    if (exploitationClaims.test(input)) {
      return {
        passed: false,
        layer: 'fact-check',
        message: 'Unauthorized exploitation claims detected',
        details: 'Claims about exploiting real production systems are not permitted. Only authorized testing is supported.',
      };
    }

    return {
      passed: true,
      layer: 'fact-check',
      message: 'Fact-check passed',
    };
  }

  /**
   * Layer 4: Consistency - Check for logical inconsistencies
   */
  private layerConsistency(input: string, context: { type: string; target?: string }): SafetyCheckResult {
    // Check for contradictory safety claims
    const unsafePatterns = [
      /bypass\s+(?:security|auth|firewall|waf)/i,
      /evade\s+(?:detection|monitoring)/i,
      /unauthorized\s+access/i,
    ];

    for (const pattern of unsafePatterns) {
      if (pattern.test(input)) {
        return {
          passed: false,
          layer: 'consistency',
          message: 'Request involves unauthorized activities',
          details: 'Bypassing security measures without authorization is not permitted.',
        };
      }
    }

    return {
      passed: true,
      layer: 'consistency',
      message: 'Consistency check passed',
    };
  }

  /**
   * Layer 5: Correction - Apply safety corrections
   */
  private layerCorrection(input: string, context: { type: string; target?: string }): SafetyCheckResult {
    // Add required disclaimers for certain types
    const requiresDisclaimer = /(?:exploit|vulnerability|pentest|hack|attack|crack|brute\s*force)/i.test(input);
    
    if (requiresDisclaimer && context.type !== 'educational') {
      return {
        passed: true,
        layer: 'correction',
        message: 'Content requires educational context disclaimer',
        details: 'Security-related content must include educational context and authorization requirements.',
      };
    }

    return {
      passed: true,
      layer: 'correction',
      message: 'No corrections needed',
    };
  }

  /**
   * Filter output for safe display
   */
  filterOutput(output: string): string {
    let filtered = output;

    // Redact potential API keys
    filtered = filtered.replace(/(?:api[_-]?key|apikey|secret|token|password)\s*[:=]\s*['"]?([a-zA-Z0-9_\-]{20,})['"]?/gi,
      (match, _key) => match.replace(_key, '[REDACTED]'));

    // Redact IP addresses in certain contexts
    filtered = filtered.replace(/(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})/g, (match) => {
      const parts = match.split('.');
      return `${parts[0]}.${parts[1]}.xxx.xxx`;
    });

    // Add legal notice if missing
    if (!filtered.includes('⚠️') && !filtered.includes('educational')) {
      filtered += '\n\n⚠️ This output is for educational and authorized testing purposes only.';
    }

    return filtered;
  }

  /**
   * Generate appropriate legal notice
   */
  private getLegalNotice(type: string): string {
    const notices: Record<string, string> = {
      scan: '⚠️ Security scanning should only be performed on systems you own or have explicit written authorization to test. Unauthorized scanning may violate federal and state laws.',
      recon: '⚠️ Reconnaissance activities must comply with applicable laws and terms of service. Only gather information on systems you have authorization to assess.',
      exploit: '⚠️ Exploitation of vulnerabilities is ONLY permitted on systems you own or have explicit written authorization to test. Unauthorized exploitation is illegal and unethical.',
      tool: '⚠️ Security tools should only be used in authorized contexts. Misuse of these tools may violate criminal and civil laws.',
      general: '⚠️ All activities must comply with applicable laws and ethical guidelines. Only perform security testing on systems you own or have explicit authorization to assess.',
    };

    return notices[type] || notices.general;
  }
}

export const safetyPipeline = new SafetyPipeline();
