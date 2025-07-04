// Enterprise Risk Management Framework for Power Platform

export type RiskCategory = 
  | "Strategic" 
  | "Operational" 
  | "Financial" 
  | "Compliance" 
  | "Reputational" 
  | "Technology" 
  | "Cyber Security"
  | "Data Privacy"

export type RiskLikelihood = "Rare" | "Unlikely" | "Possible" | "Likely" | "Almost Certain"
export type RiskImpact = "Negligible" | "Minor" | "Moderate" | "Major" | "Catastrophic"
export type RiskRating = "Low" | "Medium" | "High" | "Critical"
export type RiskTrend = "Increasing" | "Stable" | "Decreasing" | "New"

export interface EnterpriseRisk {
  id: string
  category: RiskCategory
  title: string
  description: string
  businessImpact: string
  likelihood: RiskLikelihood
  impact: RiskImpact
  inherentRiskScore: number // 1-25
  currentControls: RiskControl[]
  residualRiskScore: number // 1-25
  riskRating: RiskRating
  riskTrend: RiskTrend
  riskOwner: string
  escalationRequired: boolean
  boardReportable: boolean
}

export interface RiskControl {
  id: string
  type: "Preventive" | "Detective" | "Corrective"
  description: string
  effectiveness: "Ineffective" | "Partially Effective" | "Effective" | "Highly Effective"
  automationLevel: "Manual" | "Semi-Automated" | "Fully Automated"
  lastTested?: Date
  testResults?: string
}

export interface RiskMitigation {
  riskId: string
  strategy: "Accept" | "Avoid" | "Mitigate" | "Transfer"
  actions: MitigationAction[]
  targetResidualScore: number
  investmentRequired: number
  timeline: string
  successCriteria: string[]
}

export interface MitigationAction {
  description: string
  owner: string
  dueDate: Date
  status: "Not Started" | "In Progress" | "Completed" | "Overdue"
  percentComplete: number
}

export interface RiskAppetite {
  category: RiskCategory
  appetiteLevel: "Zero" | "Low" | "Moderate" | "High"
  toleranceThreshold: number // Risk score threshold
  rationale: string
  approvedBy: string
  reviewDate: Date
}

// Enterprise Risk Register for Power Platform
export const powerPlatformRiskRegister: EnterpriseRisk[] = [
  // Strategic Risks
  {
    id: "STR-001",
    category: "Strategic",
    title: "Platform Lock-in Risk",
    description: "Over-dependence on Microsoft Power Platform creating vendor lock-in and limiting strategic flexibility",
    businessImpact: "Reduced negotiating power, limited ability to adopt alternative solutions, potential cost escalation",
    likelihood: "Likely",
    impact: "Major",
    inherentRiskScore: 16,
    currentControls: [
      {
        id: "CTR-001",
        type: "Preventive",
        description: "Multi-cloud strategy with portability requirements",
        effectiveness: "Partially Effective",
        automationLevel: "Manual"
      },
      {
        id: "CTR-002",
        type: "Detective",
        description: "Quarterly vendor dependency assessments",
        effectiveness: "Effective",
        automationLevel: "Semi-Automated"
      }
    ],
    residualRiskScore: 12,
    riskRating: "Medium",
    riskTrend: "Increasing",
    riskOwner: "Chief Technology Officer",
    escalationRequired: false,
    boardReportable: true
  },
  {
    id: "STR-002",
    category: "Strategic",
    title: "Digital Transformation Failure",
    description: "Power Platform initiatives fail to deliver expected business transformation outcomes",
    businessImpact: "Wasted investment, competitive disadvantage, loss of stakeholder confidence",
    likelihood: "Possible",
    impact: "Major",
    inherentRiskScore: 12,
    currentControls: [
      {
        id: "CTR-003",
        type: "Preventive",
        description: "Executive steering committee oversight",
        effectiveness: "Effective",
        automationLevel: "Manual"
      },
      {
        id: "CTR-004",
        type: "Detective",
        description: "Monthly KPI tracking and benefits realization reviews",
        effectiveness: "Highly Effective",
        automationLevel: "Semi-Automated"
      }
    ],
    residualRiskScore: 6,
    riskRating: "Low",
    riskTrend: "Decreasing",
    riskOwner: "Chief Digital Officer",
    escalationRequired: false,
    boardReportable: true
  },

  // Operational Risks
  {
    id: "OPR-001",
    category: "Operational",
    title: "Shadow IT Proliferation",
    description: "Ungoverned citizen development leading to security vulnerabilities and compliance violations",
    businessImpact: "Data breaches, regulatory fines, operational inefficiencies, technical debt",
    likelihood: "Likely",
    impact: "Major",
    inherentRiskScore: 16,
    currentControls: [
      {
        id: "CTR-005",
        type: "Preventive",
        description: "Environment and DLP policy enforcement",
        effectiveness: "Partially Effective",
        automationLevel: "Fully Automated"
      },
      {
        id: "CTR-006",
        type: "Detective",
        description: "CoE Starter Kit monitoring and discovery",
        effectiveness: "Effective",
        automationLevel: "Fully Automated"
      }
    ],
    residualRiskScore: 9,
    riskRating: "Medium",
    riskTrend: "Stable",
    riskOwner: "Chief Information Officer",
    escalationRequired: false,
    boardReportable: false
  },
  {
    id: "OPR-002",
    category: "Operational",
    title: "Business Continuity Disruption",
    description: "Critical business processes dependent on Power Platform experiencing outages",
    businessImpact: "Revenue loss, customer dissatisfaction, operational paralysis",
    likelihood: "Unlikely",
    impact: "Catastrophic",
    inherentRiskScore: 10,
    currentControls: [
      {
        id: "CTR-007",
        type: "Preventive",
        description: "High availability architecture and redundancy",
        effectiveness: "Effective",
        automationLevel: "Fully Automated"
      },
      {
        id: "CTR-008",
        type: "Corrective",
        description: "Documented failover procedures and DR testing",
        effectiveness: "Effective",
        automationLevel: "Semi-Automated"
      }
    ],
    residualRiskScore: 5,
    riskRating: "Low",
    riskTrend: "Stable",
    riskOwner: "Chief Operating Officer",
    escalationRequired: false,
    boardReportable: false
  },

  // Financial Risks
  {
    id: "FIN-001",
    category: "Financial",
    title: "Uncontrolled License Proliferation",
    description: "Rapid growth in Power Platform licensing costs exceeding budget forecasts",
    businessImpact: "Budget overruns, reduced ROI, financial control weakness",
    likelihood: "Likely",
    impact: "Moderate",
    inherentRiskScore: 12,
    currentControls: [
      {
        id: "CTR-009",
        type: "Preventive",
        description: "License approval workflows and budget controls",
        effectiveness: "Partially Effective",
        automationLevel: "Semi-Automated"
      },
      {
        id: "CTR-010",
        type: "Detective",
        description: "Monthly license utilization reporting",
        effectiveness: "Effective",
        automationLevel: "Fully Automated"
      }
    ],
    residualRiskScore: 8,
    riskRating: "Medium",
    riskTrend: "Increasing",
    riskOwner: "Chief Financial Officer",
    escalationRequired: true,
    boardReportable: false
  },

  // Compliance Risks
  {
    id: "COM-001",
    category: "Compliance",
    title: "Data Residency Violations",
    description: "Power Platform data storage violating regional data residency requirements",
    businessImpact: "Regulatory fines, legal action, loss of operating licenses",
    likelihood: "Possible",
    impact: "Major",
    inherentRiskScore: 12,
    currentControls: [
      {
        id: "CTR-011",
        type: "Preventive",
        description: "Geo-specific environment configuration",
        effectiveness: "Highly Effective",
        automationLevel: "Fully Automated"
      },
      {
        id: "CTR-012",
        type: "Detective",
        description: "Quarterly compliance audits",
        effectiveness: "Effective",
        automationLevel: "Manual"
      }
    ],
    residualRiskScore: 4,
    riskRating: "Low",
    riskTrend: "Stable",
    riskOwner: "Chief Compliance Officer",
    escalationRequired: false,
    boardReportable: true
  },

  // Cyber Security Risks
  {
    id: "SEC-001",
    category: "Cyber Security",
    title: "Citizen Developer Security Breaches",
    description: "Security vulnerabilities introduced through citizen-developed applications",
    businessImpact: "Data breaches, ransomware attacks, intellectual property theft",
    likelihood: "Likely",
    impact: "Major",
    inherentRiskScore: 16,
    currentControls: [
      {
        id: "CTR-013",
        type: "Preventive",
        description: "Secure coding training and guidelines",
        effectiveness: "Partially Effective",
        automationLevel: "Manual"
      },
      {
        id: "CTR-014",
        type: "Detective",
        description: "Automated security scanning of solutions",
        effectiveness: "Effective",
        automationLevel: "Fully Automated"
      }
    ],
    residualRiskScore: 10,
    riskRating: "Medium",
    riskTrend: "Decreasing",
    riskOwner: "Chief Information Security Officer",
    escalationRequired: true,
    boardReportable: true
  },

  // Data Privacy Risks
  {
    id: "PRV-001",
    category: "Data Privacy",
    title: "Personal Data Mishandling",
    description: "Inappropriate collection, processing, or sharing of personal data through Power Platform",
    businessImpact: "GDPR fines (up to 4% global revenue), reputational damage, customer trust loss",
    likelihood: "Possible",
    impact: "Catastrophic",
    inherentRiskScore: 15,
    currentControls: [
      {
        id: "CTR-015",
        type: "Preventive",
        description: "Privacy by design requirements and DLP policies",
        effectiveness: "Effective",
        automationLevel: "Semi-Automated"
      },
      {
        id: "CTR-016",
        type: "Detective",
        description: "Privacy impact assessments for all new solutions",
        effectiveness: "Highly Effective",
        automationLevel: "Manual"
      }
    ],
    residualRiskScore: 6,
    riskRating: "Medium",
    riskTrend: "Stable",
    riskOwner: "Data Protection Officer",
    escalationRequired: false,
    boardReportable: true
  }
]

// Risk Scoring Matrix
export const riskScoringMatrix = {
  likelihood: {
    "Rare": 1,
    "Unlikely": 2,
    "Possible": 3,
    "Likely": 4,
    "Almost Certain": 5
  },
  impact: {
    "Negligible": 1,
    "Minor": 2,
    "Moderate": 3,
    "Major": 4,
    "Catastrophic": 5
  }
}

// Risk Rating Calculation
export function calculateRiskScore(likelihood: RiskLikelihood, impact: RiskImpact): number {
  return riskScoringMatrix.likelihood[likelihood] * riskScoringMatrix.impact[impact]
}

export function getRiskRating(score: number): RiskRating {
  if (score >= 20) return "Critical"
  if (score >= 12) return "High"
  if (score >= 6) return "Medium"
  return "Low"
}

// Risk Appetite Framework
export const defaultRiskAppetiteFramework: RiskAppetite[] = [
  {
    category: "Strategic",
    appetiteLevel: "Moderate",
    toleranceThreshold: 12,
    rationale: "Accept moderate strategic risks for innovation and competitive advantage",
    approvedBy: "Board of Directors",
    reviewDate: new Date("2024-01-01")
  },
  {
    category: "Operational",
    appetiteLevel: "Low",
    toleranceThreshold: 8,
    rationale: "Minimize operational disruptions to maintain business continuity",
    approvedBy: "Executive Committee",
    reviewDate: new Date("2024-01-01")
  },
  {
    category: "Financial",
    appetiteLevel: "Low",
    toleranceThreshold: 8,
    rationale: "Maintain strong financial controls and predictable costs",
    approvedBy: "CFO",
    reviewDate: new Date("2024-01-01")
  },
  {
    category: "Compliance",
    appetiteLevel: "Zero",
    toleranceThreshold: 4,
    rationale: "Zero tolerance for compliance violations",
    approvedBy: "Chief Compliance Officer",
    reviewDate: new Date("2024-01-01")
  },
  {
    category: "Cyber Security",
    appetiteLevel: "Low",
    toleranceThreshold: 8,
    rationale: "Minimize security risks while enabling business agility",
    approvedBy: "CISO",
    reviewDate: new Date("2024-01-01")
  },
  {
    category: "Data Privacy",
    appetiteLevel: "Zero",
    toleranceThreshold: 4,
    rationale: "Zero tolerance for privacy violations",
    approvedBy: "Data Protection Officer",
    reviewDate: new Date("2024-01-01")
  }
]

// Risk Mitigation Strategies
export function generateRiskMitigationPlan(risk: EnterpriseRisk): RiskMitigation {
  let strategy: RiskMitigation["strategy"] = "Mitigate"
  let actions: MitigationAction[] = []
  let investmentRequired = 0

  // Determine strategy based on risk rating and category
  if (risk.riskRating === "Low" && risk.residualRiskScore <= 4) {
    strategy = "Accept"
  } else if (risk.category === "Compliance" || risk.category === "Data Privacy") {
    strategy = "Mitigate" // Never accept compliance/privacy risks
  } else if (risk.residualRiskScore >= 20) {
    strategy = "Avoid" // Critical risks may need avoidance
  }

  // Generate mitigation actions based on gaps
  if (strategy === "Mitigate") {
    // Analyze control effectiveness
    const ineffectiveControls = risk.currentControls.filter(
      c => c.effectiveness === "Ineffective" || c.effectiveness === "Partially Effective"
    )

    if (ineffectiveControls.length > 0) {
      actions.push({
        description: `Enhance effectiveness of ${ineffectiveControls.length} existing controls`,
        owner: risk.riskOwner,
        dueDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days
        status: "Not Started",
        percentComplete: 0
      })
      investmentRequired += 50000 * ineffectiveControls.length
    }

    // Add automation where manual controls exist
    const manualControls = risk.currentControls.filter(c => c.automationLevel === "Manual")
    if (manualControls.length > 0) {
      actions.push({
        description: `Automate ${manualControls.length} manual control processes`,
        owner: "Technology Team",
        dueDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000), // 180 days
        status: "Not Started",
        percentComplete: 0
      })
      investmentRequired += 75000 * manualControls.length
    }

    // Add specific actions based on risk category
    if (risk.category === "Cyber Security") {
      actions.push({
        description: "Implement advanced threat detection and response capabilities",
        owner: "CISO",
        dueDate: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000),
        status: "Not Started",
        percentComplete: 0
      })
      investmentRequired += 200000
    }
  }

  return {
    riskId: risk.id,
    strategy,
    actions,
    targetResidualScore: Math.max(risk.residualRiskScore - 4, 2),
    investmentRequired,
    timeline: actions.length > 0 ? "6-12 months" : "Immediate",
    successCriteria: [
      `Residual risk score reduced to ${Math.max(risk.residualRiskScore - 4, 2)} or below`,
      "All mitigation actions completed on schedule",
      "No risk incidents during implementation period"
    ]
  }
}

// Executive Risk Dashboard
export interface ExecutiveRiskDashboard {
  overallRiskScore: number
  risksByCategory: Record<RiskCategory, {
    count: number
    averageScore: number
    trend: RiskTrend
  }>
  topRisks: EnterpriseRisk[]
  emergingRisks: EnterpriseRisk[]
  mitigationProgress: {
    totalActions: number
    completed: number
    overdue: number
    percentComplete: number
  }
  complianceStatus: {
    compliant: boolean
    exceptions: number
    nextAudit: Date
  }
}

export function generateExecutiveRiskDashboard(
  risks: EnterpriseRisk[],
  mitigations: RiskMitigation[]
): ExecutiveRiskDashboard {
  // Calculate overall risk score
  const overallRiskScore = Math.round(
    risks.reduce((sum, risk) => sum + risk.residualRiskScore, 0) / risks.length
  )

  // Group risks by category
  const risksByCategory = {} as ExecutiveRiskDashboard["risksByCategory"]
  const categories: RiskCategory[] = ["Strategic", "Operational", "Financial", "Compliance", "Cyber Security", "Data Privacy"]
  
  categories.forEach(category => {
    const categoryRisks = risks.filter(r => r.category === category)
    risksByCategory[category] = {
      count: categoryRisks.length,
      averageScore: categoryRisks.length > 0 
        ? Math.round(categoryRisks.reduce((sum, r) => sum + r.residualRiskScore, 0) / categoryRisks.length)
        : 0,
      trend: categoryRisks[0]?.riskTrend || "Stable"
    }
  })

  // Identify top risks
  const topRisks = risks
    .filter(r => r.riskRating === "High" || r.riskRating === "Critical")
    .sort((a, b) => b.residualRiskScore - a.residualRiskScore)
    .slice(0, 5)

  // Identify emerging risks
  const emergingRisks = risks
    .filter(r => r.riskTrend === "Increasing" || r.riskTrend === "New")
    .slice(0, 5)

  // Calculate mitigation progress
  const allActions = mitigations.flatMap(m => m.actions)
  const mitigationProgress = {
    totalActions: allActions.length,
    completed: allActions.filter(a => a.status === "Completed").length,
    overdue: allActions.filter(a => a.status === "Overdue").length,
    percentComplete: allActions.length > 0 
      ? Math.round((allActions.filter(a => a.status === "Completed").length / allActions.length) * 100)
      : 0
  }

  // Compliance status
  const complianceRisks = risks.filter(r => r.category === "Compliance")
  const complianceStatus = {
    compliant: complianceRisks.every(r => r.residualRiskScore <= 4),
    exceptions: complianceRisks.filter(r => r.residualRiskScore > 4).length,
    nextAudit: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000) // 90 days
  }

  return {
    overallRiskScore,
    risksByCategory,
    topRisks,
    emergingRisks,
    mitigationProgress,
    complianceStatus
  }
}