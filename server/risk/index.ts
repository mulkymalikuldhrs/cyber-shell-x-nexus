// ── Risk Engine ────────────────────────────────────────────────────────────────
// CVSS v3.1 scoring, false positive reduction, risk scoring, business impact

import type { SeverityLevel, VulnType, RiskScore } from '@shared/schema';

// ── CVSS v3.1 Calculator ──────────────────────────────────────────────────────

export interface CVSSVector {
  attackVector: 'Network' | 'Adjacent' | 'Local' | 'Physical';
  attackComplexity: 'Low' | 'High';
  privilegesRequired: 'None' | 'Low' | 'High';
  userInteraction: 'None' | 'Required';
  scope: 'Unchanged' | 'Changed';
  confidentiality: 'None' | 'Low' | 'High';
  integrity: 'None' | 'Low' | 'High';
  availability: 'None' | 'Low' | 'High';
}

const CVSS_METRICS: Record<string, Record<string, number>> = {
  attackVector: { Network: 0.85, Adjacent: 0.62, Local: 0.55, Physical: 0.2 },
  attackComplexity: { Low: 0.77, High: 0.44 },
  privilegesRequired: { None: 0.85, Low: 0.62, High: 0.27 },
  userInteraction: { None: 0.85, Required: 0.62 },
  scope: { Unchanged: 0, Changed: 1 },
  confidentiality: { None: 0, Low: 0.22, High: 0.56 },
  integrity: { None: 0, Low: 0.22, High: 0.56 },
  availability: { None: 0, Low: 0.22, High: 0.56 },
};

function roundUp(num: number): number {
  const int = Math.floor(num * 10) / 10;
  return int < num ? Math.round(int * 10 + 1) / 10 : int;
}

export function calculateCVSS(vector: CVSSVector): number {
  const exploitability = 8.22 *
    CVSS_METRICS.attackVector[vector.attackVector] *
    CVSS_METRICS.attackComplexity[vector.attackComplexity] *
    CVSS_METRICS.privilegesRequired[vector.privilegesRequired] *
    CVSS_METRICS.userInteraction[vector.userInteraction];

  const impactSub = 1 -
    ((1 - CVSS_METRICS.confidentiality[vector.confidentiality]) *
     (1 - CVSS_METRICS.integrity[vector.integrity]) *
     (1 - CVSS_METRICS.availability[vector.availability]));

  let impact: number;
  if (vector.scope === 'Unchanged') {
    impact = 6.42 * impactSub;
  } else {
    impact = 7.52 * (impactSub - 0.029) - 3.25 * Math.pow(impactSub - 0.02, 15);
  }

  if (impact <= 0) return 0;

  let baseScore: number;
  if (vector.scope === 'Unchanged') {
    baseScore = roundUp(Math.min(impact + exploitability, 10));
  } else {
    baseScore = roundUp(Math.min(1.08 * (impact + exploitability), 10));
  }

  return baseScore;
}

// ── Vuln Type → Default CVSS Vector ────────────────────────────────────────────

const DEFAULT_CVSS_VECTORS: Record<VulnType, CVSSVector> = {
  RCE: { attackVector: 'Network', attackComplexity: 'Low', privilegesRequired: 'None', userInteraction: 'None', scope: 'Changed', confidentiality: 'High', integrity: 'High', availability: 'High' },
  LFI: { attackVector: 'Network', attackComplexity: 'Low', privilegesRequired: 'None', userInteraction: 'None', scope: 'Unchanged', confidentiality: 'High', integrity: 'None', availability: 'None' },
  SQLI: { attackVector: 'Network', attackComplexity: 'Low', privilegesRequired: 'None', userInteraction: 'None', scope: 'Unchanged', confidentiality: 'High', integrity: 'High', availability: 'High' },
  XSS: { attackVector: 'Network', attackComplexity: 'Low', privilegesRequired: 'None', userInteraction: 'Required', scope: 'Changed', confidentiality: 'Low', integrity: 'Low', availability: 'None' },
  SSRF: { attackVector: 'Network', attackComplexity: 'Low', privilegesRequired: 'None', userInteraction: 'None', scope: 'Unchanged', confidentiality: 'High', integrity: 'None', availability: 'None' },
  IDOR: { attackVector: 'Network', attackComplexity: 'Low', privilegesRequired: 'Low', userInteraction: 'None', scope: 'Unchanged', confidentiality: 'High', integrity: 'None', availability: 'None' },
  AFO: { attackVector: 'Network', attackComplexity: 'Low', privilegesRequired: 'None', userInteraction: 'None', scope: 'Unchanged', confidentiality: 'High', integrity: 'High', availability: 'None' },
};

// ── False Positive Reduction ───────────────────────────────────────────────────

interface FindingCandidate {
  type: VulnType;
  confidence: number;
  evidence: string;
  verifiedByLlm?: boolean;
  verifiedByRule?: boolean;
}

export class FalsePositiveEngine {
  /**
   * Bayesian-influenced false positive assessment
   */
  assessFinding(finding: FindingCandidate): { isLikelyFalsePositive: boolean; adjustedConfidence: number; reason: string } {
    let score = finding.confidence / 10; // Normalize to 0-1

    // Rule-based verification boost
    if (finding.verifiedByRule) {
      score = Math.min(1, score + 0.15);
    }

    // LLM verification boost
    if (finding.verifiedByLlm) {
      score = Math.min(1, score + 0.2);
    }

    // Evidence quality assessment
    if (finding.evidence && finding.evidence.length > 50) {
      score = Math.min(1, score + 0.1);
    } else if (!finding.evidence || finding.evidence.length < 10) {
      score = Math.max(0, score - 0.2);
    }

    // Vuln type base rates (some types have higher FP rates)
    const typeBaseRates: Record<VulnType, number> = {
      XSS: 0.25, // High FP rate
      IDOR: 0.15,
      SSRF: 0.2,
      LFI: 0.1,
      RCE: 0.05, // Low FP rate
      SQLI: 0.1,
      AFO: 0.2,
    };

    const baseRate = typeBaseRates[finding.type] || 0.15;
    // Bayesian update: P(FP|evidence) ∝ P(evidence|FP) * P(FP)
    const adjustedScore = score * (1 - baseRate);

    const adjustedConfidence = Math.round(adjustedScore * 10);
    const isLikelyFalsePositive = adjustedConfidence < 4;

    return {
      isLikelyFalsePositive,
      adjustedConfidence,
      reason: isLikelyFalsePositive
        ? `Low confidence (${adjustedConfidence}/10) with ${finding.type} base FP rate of ${(baseRate * 100).toFixed(0)}%`
        : `Sufficient confidence (${adjustedConfidence}/10) after FP reduction`,
    };
  }
}

// ── Business Impact Calculator ─────────────────────────────────────────────────

export interface BusinessContext {
  assetCriticality: 'low' | 'medium' | 'high' | 'critical';
  dataClassification: 'public' | 'internal' | 'confidential' | 'restricted';
  exposureLevel: 'internal' | 'external';
  regulatoryImpact: boolean;
}

export function calculateBusinessImpact(
  cvssScore: number,
  context: BusinessContext
): { score: number; level: string; factors: string[] } {
  let impact = cvssScore;
  const factors: string[] = [];

  // Asset criticality multiplier
  const criticalityMultiplier: Record<string, number> = {
    low: 0.8, medium: 1.0, high: 1.2, critical: 1.5,
  };
  const multiplier = criticalityMultiplier[context.assetCriticality];
  impact *= multiplier;
  if (context.assetCriticality === 'critical') factors.push('Critical asset affected');

  // Data classification boost
  const dataBoost: Record<string, number> = {
    public: 0, internal: 0.5, confidential: 1.5, restricted: 2.5,
  };
  impact += dataBoost[context.dataClassification];
  if (context.dataClassification === 'restricted' || context.dataClassification === 'confidential') {
    factors.push('Sensitive data at risk');
  }

  // External exposure boost
  if (context.exposureLevel === 'external') {
    impact += 1.0;
    factors.push('Externally exposed vulnerability');
  }

  // Regulatory impact
  if (context.regulatoryImpact) {
    impact += 1.5;
    factors.push('Regulatory compliance risk');
  }

  const cappedScore = Math.min(10, Math.max(0, impact));
  const level = cappedScore >= 9 ? 'critical' : cappedScore >= 7 ? 'high' : cappedScore >= 4 ? 'medium' : 'low';

  return { score: Math.round(cappedScore * 10) / 10, level, factors };
}

// ── Risk Scoring Engine ────────────────────────────────────────────────────────

export class RiskEngine {
  private falsePositiveEngine = new FalsePositiveEngine();

  /**
   * Calculate comprehensive risk score
   */
  calculateRisk(
    vulnType: VulnType,
    cvssVector?: CVSSVector,
    businessContext?: BusinessContext,
    epssScore = 0
  ): RiskScore {
    // CVSS Score
    const cvss = cvssVector
      ? calculateCVSS(cvssVector)
      : calculateCVSS(DEFAULT_CVSS_VECTORS[vulnType]);

    // Business Impact
    const defaultContext: BusinessContext = businessContext || {
      assetCriticality: 'medium',
      dataClassification: 'internal',
      exposureLevel: 'external',
      regulatoryImpact: false,
    };
    const businessImpact = calculateBusinessImpact(cvss, defaultContext);

    // Exploitability (based on EPSS and vuln type)
    const exploitabilityBase: Record<VulnType, number> = {
      RCE: 9, LFI: 7, SQLI: 8, XSS: 6, SSRF: 6, IDOR: 5, AFO: 7,
    };
    const exploitability = Math.min(10, (exploitabilityBase[vulnType] || 5) + epssScore * 5);

    // Confidence based on vuln type
    const confidenceBase: Record<VulnType, number> = {
      RCE: 9, LFI: 7, SQLI: 8, XSS: 6, SSRF: 6, IDOR: 5, AFO: 6,
    };
    const confidence = confidenceBase[vulnType] || 5;

    // Overall risk = weighted combination
    const overall = Math.round((
      cvss * 0.35 +
      businessImpact.score * 0.25 +
      exploitability * 0.25 +
      confidence * 0.15
    ) * 10) / 10;

    return {
      overall: Math.min(10, overall),
      cvss,
      epss: epssScore,
      businessImpact: businessImpact.score,
      exploitability,
      confidence,
    };
  }

  /**
   * Get severity level from CVSS score
   */
  cvssToSeverity(cvss: number): SeverityLevel {
    if (cvss >= 9.0) return 'critical';
    if (cvss >= 7.0) return 'high';
    if (cvss >= 4.0) return 'medium';
    if (cvss >= 0.1) return 'low';
    return 'info';
  }

  /**
   * Assess false positive likelihood
   */
  assessFalsePositive(finding: FindingCandidate) {
    return this.falsePositiveEngine.assessFinding(finding);
  }
}

export const riskEngine = new RiskEngine();
