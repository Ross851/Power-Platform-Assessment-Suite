// Executive Decision-Making Models and Frameworks for Power Platform Governance

export interface ExecutiveDecisionModel {
  name: string
  description: string
  applicability: string[]
  decisionCriteria: DecisionCriterion[]
  stakeholders: string[]
  escalationPath: string[]
}

export interface DecisionCriterion {
  factor: string
  weight: number
  description: string
  thresholds: {
    low: string
    medium: string
    high: string
  }
}

export interface InvestmentDecision {
  projectName: string
  businessCase: BusinessCase
  riskAssessment: RiskAssessment
  recommendation: "Approve" | "Conditional Approval" | "Defer" | "Reject"
  conditions?: string[]
  nextReviewDate?: Date
}

export interface BusinessCase {
  executiveSummary: string
  strategicAlignment: number // 1-5 scale
  financialMetrics: {
    totalInvestment: number
    expectedROI: number
    paybackPeriod: number // months
    npv: number
    irr: number
  }
  qualitativeBenefits: string[]
  risks: string[]
  dependencies: string[]
}

export interface RiskAssessment {
  overallRiskScore: number // 1-100
  riskCategories: {
    strategic: number
    operational: number
    financial: number
    compliance: number
    reputational: number
    technical: number
  }
  mitigationStrategies: string[]
  residualRisk: number
}

// Strategic Governance Decision Framework
export const strategicGovernanceFramework: ExecutiveDecisionModel = {
  name: "Strategic Power Platform Governance Framework",
  description: "Executive decision model for strategic Power Platform initiatives requiring C-Suite approval",
  applicability: [
    "Enterprise-wide platform adoption",
    "Major investment decisions (>$500K)",
    "Strategic partnership decisions",
    "Governance model changes",
    "Risk appetite adjustments"
  ],
  decisionCriteria: [
    {
      factor: "Strategic Alignment",
      weight: 30,
      description: "Alignment with corporate strategy and digital transformation goals",
      thresholds: {
        low: "Limited alignment with strategic objectives",
        medium: "Supports 1-2 strategic pillars",
        high: "Critical enabler for 3+ strategic objectives"
      }
    },
    {
      factor: "Business Value",
      weight: 25,
      description: "Quantifiable business benefits and ROI",
      thresholds: {
        low: "ROI < 100% or payback > 24 months",
        medium: "ROI 100-300% or payback 12-24 months",
        high: "ROI > 300% or payback < 12 months"
      }
    },
    {
      factor: "Risk Profile",
      weight: 20,
      description: "Enterprise risk exposure and mitigation effectiveness",
      thresholds: {
        low: "Minimal risk with proven mitigation",
        medium: "Moderate risk with identified controls",
        high: "Significant risk requiring executive oversight"
      }
    },
    {
      factor: "Organizational Readiness",
      weight: 15,
      description: "Capability to execute and realize benefits",
      thresholds: {
        low: "Significant capability gaps identified",
        medium: "Some capability building required",
        high: "Organization ready with proven track record"
      }
    },
    {
      factor: "Innovation Potential",
      weight: 10,
      description: "Opportunity for competitive advantage and market differentiation",
      thresholds: {
        low: "Incremental improvements only",
        medium: "Enables new capabilities or offerings",
        high: "Transformational business model innovation"
      }
    }
  ],
  stakeholders: [
    "CEO - Final approval authority",
    "CFO - Financial validation and budget approval",
    "CIO/CTO - Technical feasibility and architecture alignment",
    "CHRO - Organizational capability assessment",
    "Chief Risk Officer - Risk evaluation and acceptance",
    "Business Unit Leaders - Business case validation"
  ],
  escalationPath: [
    "Power Platform CoE Lead → CIO",
    "CIO → Executive Committee",
    "Executive Committee → CEO",
    "CEO → Board (if >$5M or strategic risk)"
  ]
}

// Operational Excellence Framework
export const operationalExcellenceFramework: ExecutiveDecisionModel = {
  name: "Operational Excellence Decision Framework",
  description: "Framework for operational Power Platform decisions requiring executive oversight",
  applicability: [
    "Major process automation initiatives",
    "Cross-functional integration projects",
    "Operational risk mitigation",
    "Performance improvement programs"
  ],
  decisionCriteria: [
    {
      factor: "Operational Impact",
      weight: 35,
      description: "Impact on operational efficiency and effectiveness",
      thresholds: {
        low: "Single process or department impact",
        medium: "Multiple department impact",
        high: "Enterprise-wide operational transformation"
      }
    },
    {
      factor: "Cost Reduction",
      weight: 25,
      description: "Direct cost savings and efficiency gains",
      thresholds: {
        low: "< $100K annual savings",
        medium: "$100K - $1M annual savings",
        high: "> $1M annual savings"
      }
    },
    {
      factor: "Quality Improvement",
      weight: 20,
      description: "Impact on quality metrics and customer satisfaction",
      thresholds: {
        low: "< 10% quality improvement",
        medium: "10-30% quality improvement",
        high: "> 30% quality improvement"
      }
    },
    {
      factor: "Implementation Risk",
      weight: 20,
      description: "Risk to ongoing operations during implementation",
      thresholds: {
        low: "No impact to critical operations",
        medium: "Managed disruption with contingencies",
        high: "Potential critical operation disruption"
      }
    }
  ],
  stakeholders: [
    "COO - Operational approval",
    "CFO - Cost-benefit validation",
    "CIO - Technical implementation",
    "Process Owners - Requirements and acceptance",
    "Quality/Compliance - Standards adherence"
  ],
  escalationPath: [
    "Process Owner → Department Head",
    "Department Head → COO",
    "COO → Executive Committee"
  ]
}

// Innovation Investment Framework
export const innovationInvestmentFramework: ExecutiveDecisionModel = {
  name: "Innovation Investment Decision Framework",
  description: "Framework for evaluating Power Platform innovation initiatives and experiments",
  applicability: [
    "Innovation lab funding",
    "Proof of concept approvals",
    "Emerging technology adoption",
    "Hackathon and citizen developer programs"
  ],
  decisionCriteria: [
    {
      factor: "Innovation Potential",
      weight: 40,
      description: "Potential for breakthrough innovation and market disruption",
      thresholds: {
        low: "Incremental innovation",
        medium: "Significant innovation in existing markets",
        high: "New market or business model creation"
      }
    },
    {
      factor: "Strategic Learning",
      weight: 25,
      description: "Value of learning and capability building",
      thresholds: {
        low: "Limited learning applicability",
        medium: "Departmental capability enhancement",
        high: "Enterprise-wide capability transformation"
      }
    },
    {
      factor: "Speed to Market",
      weight: 20,
      description: "Time to realize value or validate hypothesis",
      thresholds: {
        low: "> 6 months to initial value",
        medium: "3-6 months to initial value",
        high: "< 3 months to initial value"
      }
    },
    {
      factor: "Investment Risk",
      weight: 15,
      description: "Financial exposure and failure impact",
      thresholds: {
        low: "< $50K with limited impact",
        medium: "$50K-$250K with managed impact",
        high: "> $250K or significant opportunity cost"
      }
    }
  ],
  stakeholders: [
    "Chief Innovation Officer - Sponsor",
    "Business Unit Leaders - Business value",
    "CTO - Technical feasibility",
    "CFO - Investment approval"
  ],
  escalationPath: [
    "Innovation Team → Chief Innovation Officer",
    "Chief Innovation Officer → CEO",
    "CEO → Board Innovation Committee"
  ]
}

// Executive Decision Support Functions
export function evaluateBusinessCase(businessCase: BusinessCase): {
  score: number
  strengths: string[]
  weaknesses: string[]
  recommendation: string
} {
  let score = 0
  const strengths: string[] = []
  const weaknesses: string[] = []

  // Strategic Alignment Score (0-25)
  score += businessCase.strategicAlignment * 5
  if (businessCase.strategicAlignment >= 4) {
    strengths.push("Strong strategic alignment")
  } else if (businessCase.strategicAlignment <= 2) {
    weaknesses.push("Weak strategic alignment")
  }

  // Financial Metrics Score (0-40)
  if (businessCase.financialMetrics.roi > 300) {
    score += 20
    strengths.push(`Exceptional ROI of ${businessCase.financialMetrics.roi}%`)
  } else if (businessCase.financialMetrics.roi > 200) {
    score += 15
    strengths.push(`Strong ROI of ${businessCase.financialMetrics.roi}%`)
  } else if (businessCase.financialMetrics.roi > 100) {
    score += 10
  } else {
    score += 5
    weaknesses.push("ROI below target threshold")
  }

  if (businessCase.financialMetrics.paybackPeriod < 12) {
    score += 20
    strengths.push("Rapid payback period")
  } else if (businessCase.financialMetrics.paybackPeriod < 24) {
    score += 15
  } else {
    score += 5
    weaknesses.push("Extended payback period")
  }

  // Qualitative Benefits (0-20)
  const benefitScore = Math.min(businessCase.qualitativeBenefits.length * 4, 20)
  score += benefitScore
  if (benefitScore >= 16) {
    strengths.push("Comprehensive qualitative benefits")
  }

  // Risk Assessment (0-15)
  const riskScore = Math.max(15 - businessCase.risks.length * 3, 0)
  score += riskScore
  if (businessCase.risks.length > 3) {
    weaknesses.push("Multiple significant risks identified")
  }

  // Generate recommendation
  let recommendation: string
  if (score >= 80) {
    recommendation = "Strongly Recommended - Proceed with full executive support"
  } else if (score >= 60) {
    recommendation = "Recommended - Proceed with risk mitigation plan"
  } else if (score >= 40) {
    recommendation = "Conditional Approval - Address weaknesses before proceeding"
  } else {
    recommendation = "Not Recommended - Significant concerns require resolution"
  }

  return { score, strengths, weaknesses, recommendation }
}

export function calculateRiskAdjustedROI(
  businessCase: BusinessCase,
  riskAssessment: RiskAssessment
): number {
  const baseROI = businessCase.financialMetrics.roi
  const riskFactor = riskAssessment.residualRisk / 100
  const riskAdjustedROI = baseROI * (1 - riskFactor * 0.5) // 50% maximum ROI reduction for highest risk
  
  return Math.round(riskAdjustedROI)
}

export function generateExecutiveDecision(
  framework: ExecutiveDecisionModel,
  scores: Record<string, number>
): InvestmentDecision {
  // Calculate weighted score
  let totalScore = 0
  let totalWeight = 0
  
  framework.decisionCriteria.forEach(criterion => {
    const score = scores[criterion.factor] || 0
    totalScore += score * criterion.weight
    totalWeight += criterion.weight
  })
  
  const weightedScore = totalScore / totalWeight

  // Generate recommendation based on weighted score
  let recommendation: InvestmentDecision["recommendation"]
  const conditions: string[] = []

  if (weightedScore >= 80) {
    recommendation = "Approve"
  } else if (weightedScore >= 60) {
    recommendation = "Conditional Approval"
    conditions.push("Monthly progress reviews required")
    conditions.push("Risk mitigation plan must be approved")
  } else if (weightedScore >= 40) {
    recommendation = "Defer"
    conditions.push("Address identified weaknesses")
    conditions.push("Resubmit with updated business case")
  } else {
    recommendation = "Reject"
  }

  return {
    projectName: "Power Platform Initiative",
    businessCase: {} as BusinessCase, // Would be populated with actual data
    riskAssessment: {} as RiskAssessment, // Would be populated with actual data
    recommendation,
    conditions: conditions.length > 0 ? conditions : undefined,
    nextReviewDate: recommendation === "Conditional Approval" 
      ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
      : undefined
  }
}