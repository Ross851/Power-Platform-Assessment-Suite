// Investment Strategy Framework for Power Platform

export interface InvestmentStrategy {
  strategyName: string
  timeHorizon: "Short-term (0-12 months)" | "Medium-term (1-3 years)" | "Long-term (3-5 years)"
  totalBudget: number
  allocationModel: BudgetAllocation
  fundingApproach: FundingApproach
  investmentPrinciples: string[]
  successMetrics: InvestmentMetric[]
  governanceModel: InvestmentGovernance
}

export interface BudgetAllocation {
  categories: {
    licensing: { percentage: number; amount: number; rationale: string }
    implementation: { percentage: number; amount: number; rationale: string }
    training: { percentage: number; amount: number; rationale: string }
    centerOfExcellence: { percentage: number; amount: number; rationale: string }
    innovation: { percentage: number; amount: number; rationale: string }
    operations: { percentage: number; amount: number; rationale: string }
    contingency: { percentage: number; amount: number; rationale: string }
  }
  phasing: InvestmentPhase[]
}

export interface InvestmentPhase {
  phase: string
  timeframe: string
  budget: number
  focus: string[]
  deliverables: string[]
  gates: InvestmentGate[]
}

export interface InvestmentGate {
  name: string
  criteria: string[]
  approvers: string[]
  goDecision: "Proceed" | "Conditional" | "Hold" | "Cancel"
}

export interface FundingApproach {
  model: "Centralized" | "Federated" | "Hybrid" | "Chargeback"
  sources: FundingSource[]
  costRecovery: {
    enabled: boolean
    model?: "Direct Chargeback" | "Allocation" | "Subscription"
    timeline?: string
  }
}

export interface FundingSource {
  name: string
  type: "IT Budget" | "Innovation Fund" | "Business Unit" | "Corporate" | "External"
  amount: number
  conditions: string[]
  approvalRequired: boolean
}

export interface InvestmentMetric {
  metric: string
  target: number | string
  measurementFrequency: "Monthly" | "Quarterly" | "Annually"
  owner: string
  threshold: {
    green: string
    amber: string
    red: string
  }
}

export interface InvestmentGovernance {
  committeeStructure: {
    name: string
    members: string[]
    meetingFrequency: string
    responsibilities: string[]
  }[]
  approvalLimits: ApprovalLimit[]
  reviewCycle: string
  escalationPath: string[]
}

export interface ApprovalLimit {
  role: string
  limit: number
  conditions: string[]
}

// Strategic Investment Models
export const strategicInvestmentModels = {
  conservative: {
    name: "Conservative Growth",
    description: "Risk-averse approach focused on proven use cases and controlled expansion",
    allocation: {
      licensing: 30,
      implementation: 25,
      training: 20,
      centerOfExcellence: 10,
      innovation: 5,
      operations: 5,
      contingency: 5
    },
    principles: [
      "Proven ROI before scaling",
      "Phased rollout with gates",
      "Focus on operational efficiency",
      "Minimal disruption to existing systems"
    ]
  },
  balanced: {
    name: "Balanced Transformation",
    description: "Balanced approach between innovation and risk management",
    allocation: {
      licensing: 25,
      implementation: 20,
      training: 15,
      centerOfExcellence: 15,
      innovation: 15,
      operations: 5,
      contingency: 5
    },
    principles: [
      "Strategic innovation with controlled risk",
      "Business-led with IT partnership",
      "Continuous learning and adaptation",
      "Value-driven investment decisions"
    ]
  },
  aggressive: {
    name: "Digital Leadership",
    description: "Innovation-focused approach for competitive advantage",
    allocation: {
      licensing: 20,
      implementation: 15,
      training: 15,
      centerOfExcellence: 20,
      innovation: 20,
      operations: 5,
      contingency: 5
    },
    principles: [
      "First-mover advantage pursuit",
      "Innovation as core strategy",
      "Fail fast, learn faster",
      "Platform as competitive differentiator"
    ]
  }
}

// Investment Portfolio Categories
export interface InvestmentPortfolio {
  categories: InvestmentCategory[]
  totalValue: number
  riskProfile: "Conservative" | "Moderate" | "Aggressive"
  expectedROI: number
  paybackPeriod: number
}

export interface InvestmentCategory {
  name: string
  description: string
  initiatives: Initiative[]
  totalBudget: number
  priority: "Strategic" | "High" | "Medium" | "Low"
  sponsor: string
}

export interface Initiative {
  name: string
  description: string
  businessCase: {
    problem: string
    solution: string
    benefits: string[]
    costs: {
      initial: number
      recurring: number
    }
    roi: number
    paybackMonths: number
  }
  status: "Proposed" | "Approved" | "In Progress" | "Completed" | "On Hold"
  timeline: {
    start: Date
    end: Date
    milestones: { date: Date; description: string }[]
  }
  risks: { risk: string; mitigation: string }[]
}

// TCO Calculator for Power Platform
export interface TCOCalculation {
  timeframe: number // years
  costs: {
    year1: CostBreakdown
    year2: CostBreakdown
    year3: CostBreakdown
    year4?: CostBreakdown
    year5?: CostBreakdown
  }
  benefits: {
    year1: BenefitBreakdown
    year2: BenefitBreakdown
    year3: BenefitBreakdown
    year4?: BenefitBreakdown
    year5?: BenefitBreakdown
  }
  summary: {
    totalCost: number
    totalBenefit: number
    netBenefit: number
    roi: number
    paybackPeriod: number
  }
}

export interface CostBreakdown {
  licensing: {
    powerApps: number
    powerAutomate: number
    powerBI: number
    powerPages: number
    dataverse: number
  }
  implementation: {
    internal: number
    consulting: number
    integration: number
  }
  training: {
    formal: number
    certification: number
    ongoing: number
  }
  operations: {
    support: number
    maintenance: number
    governance: number
  }
  total: number
}

export interface BenefitBreakdown {
  efficiency: {
    laborSavings: number
    processImprovement: number
    errorReduction: number
  }
  revenue: {
    newRevenue: number
    revenueProtection: number
    customerRetention: number
  }
  strategic: {
    agility: number
    innovation: number
    competitiveAdvantage: number
  }
  total: number
}

// Investment Strategy Generator
export function generateInvestmentStrategy(
  organizationSize: "Small" | "Medium" | "Large" | "Enterprise",
  digitalMaturity: "Low" | "Medium" | "High",
  riskAppetite: "Conservative" | "Moderate" | "Aggressive",
  annualITBudget: number
): InvestmentStrategy {
  // Determine budget based on organization size and IT budget
  const platformBudgetPercentage = {
    Small: 0.05,
    Medium: 0.08,
    Large: 0.10,
    Enterprise: 0.12
  }
  
  const totalBudget = annualITBudget * platformBudgetPercentage[organizationSize] * 3 // 3-year view

  // Select investment model based on risk appetite
  const model = strategicInvestmentModels[
    riskAppetite === "Conservative" ? "conservative" :
    riskAppetite === "Aggressive" ? "aggressive" : "balanced"
  ]

  // Create budget allocation
  const allocation: BudgetAllocation = {
    categories: {
      licensing: {
        percentage: model.allocation.licensing,
        amount: totalBudget * model.allocation.licensing / 100,
        rationale: "Core platform capabilities and user licenses"
      },
      implementation: {
        percentage: model.allocation.implementation,
        amount: totalBudget * model.allocation.implementation / 100,
        rationale: "Solution development and deployment"
      },
      training: {
        percentage: model.allocation.training,
        amount: totalBudget * model.allocation.training / 100,
        rationale: "User enablement and skill development"
      },
      centerOfExcellence: {
        percentage: model.allocation.centerOfExcellence,
        amount: totalBudget * model.allocation.centerOfExcellence / 100,
        rationale: "Governance, best practices, and support"
      },
      innovation: {
        percentage: model.allocation.innovation,
        amount: totalBudget * model.allocation.innovation / 100,
        rationale: "Experimentation and emerging capabilities"
      },
      operations: {
        percentage: model.allocation.operations,
        amount: totalBudget * model.allocation.operations / 100,
        rationale: "Ongoing support and maintenance"
      },
      contingency: {
        percentage: model.allocation.contingency,
        amount: totalBudget * model.allocation.contingency / 100,
        rationale: "Risk mitigation and unforeseen needs"
      }
    },
    phasing: generateInvestmentPhases(totalBudget, digitalMaturity)
  }

  // Define success metrics
  const successMetrics: InvestmentMetric[] = [
    {
      metric: "ROI",
      target: riskAppetite === "Conservative" ? 150 : riskAppetite === "Aggressive" ? 300 : 200,
      measurementFrequency: "Quarterly",
      owner: "CFO",
      threshold: {
        green: "> Target",
        amber: "80-100% of Target",
        red: "< 80% of Target"
      }
    },
    {
      metric: "User Adoption Rate",
      target: `${riskAppetite === "Conservative" ? 20 : riskAppetite === "Aggressive" ? 40 : 30}%`,
      measurementFrequency: "Monthly",
      owner: "CDO",
      threshold: {
        green: "> 90% of Target",
        amber: "70-90% of Target",
        red: "< 70% of Target"
      }
    },
    {
      metric: "Solution Delivery Velocity",
      target: "10 solutions per quarter",
      measurementFrequency: "Quarterly",
      owner: "CTO",
      threshold: {
        green: "> 10 solutions",
        amber: "7-10 solutions",
        red: "< 7 solutions"
      }
    }
  ]

  return {
    strategyName: `${model.name} Strategy`,
    timeHorizon: "Medium-term (1-3 years)",
    totalBudget,
    allocationModel: allocation,
    fundingApproach: {
      model: organizationSize === "Enterprise" ? "Hybrid" : "Centralized",
      sources: [
        {
          name: "IT Innovation Budget",
          type: "IT Budget",
          amount: totalBudget * 0.6,
          conditions: ["Approved business cases", "Alignment with digital strategy"],
          approvalRequired: true
        },
        {
          name: "Business Unit Contributions",
          type: "Business Unit",
          amount: totalBudget * 0.3,
          conditions: ["Direct business benefit", "Committed adoption"],
          approvalRequired: true
        },
        {
          name: "Corporate Innovation Fund",
          type: "Corporate",
          amount: totalBudget * 0.1,
          conditions: ["Strategic initiatives only", "CEO approval"],
          approvalRequired: true
        }
      ],
      costRecovery: {
        enabled: organizationSize === "Large" || organizationSize === "Enterprise",
        model: "Allocation",
        timeline: "Year 2 onwards"
      }
    },
    investmentPrinciples: model.principles,
    successMetrics,
    governanceModel: generateGovernanceModel(organizationSize)
  }
}

function generateInvestmentPhases(totalBudget: number, digitalMaturity: string): InvestmentPhase[] {
  const phases: InvestmentPhase[] = []

  // Phase 1: Foundation
  phases.push({
    phase: "Foundation",
    timeframe: "Months 1-6",
    budget: totalBudget * 0.25,
    focus: [
      "Platform setup and security",
      "CoE establishment",
      "Initial training",
      "Pilot projects"
    ],
    deliverables: [
      "Platform operational",
      "CoE team formed",
      "20+ trained users",
      "3-5 pilot solutions"
    ],
    gates: [{
      name: "Foundation Gate",
      criteria: [
        "Platform security validated",
        "CoE operational",
        "Pilot success > 80%"
      ],
      approvers: ["CIO", "CISO", "CFO"],
      goDecision: "Proceed"
    }]
  })

  // Phase 2: Expansion
  phases.push({
    phase: "Expansion",
    timeframe: "Months 7-18",
    budget: totalBudget * 0.45,
    focus: [
      "Scaled adoption",
      "Complex use cases",
      "Integration projects",
      "Value optimization"
    ],
    deliverables: [
      "100+ active users",
      "20+ production solutions",
      "Integrated with core systems",
      "Measurable ROI"
    ],
    gates: [{
      name: "Scale Gate",
      criteria: [
        "ROI targets met",
        "User satisfaction > 80%",
        "No critical incidents"
      ],
      approvers: ["Executive Committee"],
      goDecision: "Proceed"
    }]
  })

  // Phase 3: Optimization
  phases.push({
    phase: "Optimization",
    timeframe: "Months 19-36",
    budget: totalBudget * 0.30,
    focus: [
      "Advanced capabilities",
      "Innovation projects",
      "External integration",
      "Continuous improvement"
    ],
    deliverables: [
      "Advanced analytics",
      "AI/ML integration",
      "External partnerships",
      "Self-sustaining platform"
    ],
    gates: [{
      name: "Maturity Gate",
      criteria: [
        "Platform self-funding",
        "Innovation pipeline active",
        "Strategic value demonstrated"
      ],
      approvers: ["CEO", "Board Committee"],
      goDecision: "Proceed"
    }]
  })

  return phases
}

function generateGovernanceModel(organizationSize: string): InvestmentGovernance {
  const committees = []

  // Executive Steering Committee (all sizes)
  committees.push({
    name: "Power Platform Executive Steering Committee",
    members: ["CEO/President", "CFO", "CIO", "CDO", "Business Unit Leaders"],
    meetingFrequency: "Monthly",
    responsibilities: [
      "Strategic direction and alignment",
      "Major investment decisions",
      "Risk acceptance",
      "Success measurement"
    ]
  })

  // Investment Review Board (medium and above)
  if (organizationSize !== "Small") {
    committees.push({
      name: "Platform Investment Review Board",
      members: ["CFO", "CIO", "CoE Lead", "Finance Director", "PMO Lead"],
      meetingFrequency: "Bi-weekly",
      responsibilities: [
        "Business case review",
        "Budget allocation",
        "ROI tracking",
        "Resource prioritization"
      ]
    })
  }

  // Technical Architecture Board (large and enterprise)
  if (organizationSize === "Large" || organizationSize === "Enterprise") {
    committees.push({
      name: "Technical Architecture Board",
      members: ["CTO", "Chief Architect", "Security Architect", "Integration Lead"],
      meetingFrequency: "Weekly",
      responsibilities: [
        "Technical standards",
        "Architecture decisions",
        "Security approvals",
        "Integration governance"
      ]
    })
  }

  const approvalLimits: ApprovalLimit[] = [
    { role: "CoE Lead", limit: 10000, conditions: ["Within approved budget", "Standard use case"] },
    { role: "CIO", limit: 50000, conditions: ["Business case approved", "Architecture review"] },
    { role: "CFO", limit: 250000, conditions: ["ROI validated", "Risk assessed"] },
    { role: "CEO", limit: 1000000, conditions: ["Strategic initiative", "Board notification"] },
    { role: "Board", limit: -1, conditions: ["Above $1M", "Strategic transformation"] }
  ]

  return {
    committeeStructure: committees,
    approvalLimits,
    reviewCycle: "Quarterly",
    escalationPath: ["CoE Lead", "CIO", "CFO", "CEO", "Board"]
  }
}

// TCO Calculator Function
export function calculateTCO(
  userCount: number,
  solutionCount: number,
  yearsToCalculate: 3 | 5 = 3
): TCOCalculation {
  // Base costs
  const licensePerUser = 40 // Per user per month
  const implementationPerSolution = 50000
  const trainingPerUser = 500
  const supportPercentage = 0.20 // 20% of license costs

  // Calculate year-by-year costs and benefits
  const calculation: TCOCalculation = {
    timeframe: yearsToCalculate,
    costs: {} as any,
    benefits: {} as any,
    summary: {
      totalCost: 0,
      totalBenefit: 0,
      netBenefit: 0,
      roi: 0,
      paybackPeriod: 0
    }
  }

  let cumulativeCost = 0
  let cumulativeBenefit = 0
  let paybackAchieved = false

  for (let year = 1; year <= yearsToCalculate; year++) {
    // Scale factors for growth
    const userGrowthFactor = Math.pow(1.3, year - 1) // 30% annual growth
    const solutionGrowthFactor = Math.pow(1.5, year - 1) // 50% annual growth
    
    const yearUsers = Math.round(userCount * userGrowthFactor)
    const yearSolutions = Math.round(solutionCount * solutionGrowthFactor)

    // Calculate costs
    const yearCosts: CostBreakdown = {
      licensing: {
        powerApps: yearUsers * licensePerUser * 12 * 0.4,
        powerAutomate: yearUsers * licensePerUser * 12 * 0.3,
        powerBI: yearUsers * licensePerUser * 12 * 0.2,
        powerPages: yearUsers * licensePerUser * 12 * 0.05,
        dataverse: yearUsers * licensePerUser * 12 * 0.05
      },
      implementation: {
        internal: yearSolutions * implementationPerSolution * 0.4,
        consulting: yearSolutions * implementationPerSolution * 0.4,
        integration: yearSolutions * implementationPerSolution * 0.2
      },
      training: {
        formal: yearUsers * trainingPerUser * (year === 1 ? 1 : 0.3),
        certification: yearUsers * 100 * (year <= 2 ? 0.2 : 0.1),
        ongoing: yearUsers * 50
      },
      operations: {
        support: yearUsers * licensePerUser * 12 * supportPercentage,
        maintenance: yearSolutions * 5000,
        governance: 100000 + (yearUsers * 100)
      },
      total: 0
    }

    // Calculate total cost for year
    yearCosts.total = 
      Object.values(yearCosts.licensing).reduce((a, b) => a + b, 0) +
      Object.values(yearCosts.implementation).reduce((a, b) => a + b, 0) +
      Object.values(yearCosts.training).reduce((a, b) => a + b, 0) +
      Object.values(yearCosts.operations).reduce((a, b) => a + b, 0)

    // Calculate benefits (growing over time)
    const maturityFactor = Math.min(year / 2, 1) // Ramp up over 2 years
    const yearBenefits: BenefitBreakdown = {
      efficiency: {
        laborSavings: yearSolutions * 100000 * maturityFactor,
        processImprovement: yearSolutions * 50000 * maturityFactor,
        errorReduction: yearSolutions * 25000 * maturityFactor
      },
      revenue: {
        newRevenue: yearSolutions * 75000 * maturityFactor * (year > 1 ? 1 : 0.5),
        revenueProtection: yearSolutions * 50000 * maturityFactor,
        customerRetention: yearUsers * 1000 * maturityFactor
      },
      strategic: {
        agility: yearSolutions * 30000 * maturityFactor,
        innovation: yearSolutions * 40000 * maturityFactor * (year > 2 ? 1 : 0.5),
        competitiveAdvantage: yearSolutions * 60000 * maturityFactor * (year > 2 ? 1 : 0.3)
      },
      total: 0
    }

    // Calculate total benefit for year
    yearBenefits.total = 
      Object.values(yearBenefits.efficiency).reduce((a, b) => a + b, 0) +
      Object.values(yearBenefits.revenue).reduce((a, b) => a + b, 0) +
      Object.values(yearBenefits.strategic).reduce((a, b) => a + b, 0)

    // Store year data
    calculation.costs[`year${year}`] = yearCosts
    calculation.benefits[`year${year}`] = yearBenefits

    // Update cumulative totals
    cumulativeCost += yearCosts.total
    cumulativeBenefit += yearBenefits.total

    // Check for payback
    if (!paybackAchieved && cumulativeBenefit >= cumulativeCost) {
      calculation.summary.paybackPeriod = year
      paybackAchieved = true
    }
  }

  // Calculate summary
  calculation.summary.totalCost = cumulativeCost
  calculation.summary.totalBenefit = cumulativeBenefit
  calculation.summary.netBenefit = cumulativeBenefit - cumulativeCost
  calculation.summary.roi = Math.round((calculation.summary.netBenefit / cumulativeCost) * 100)
  
  if (!paybackAchieved) {
    calculation.summary.paybackPeriod = yearsToCalculate + 1 // Beyond calculation period
  }

  return calculation
}