// Business Value Metrics and ROI Analysis Tools for Power Platform

export interface ValueMetric {
  category: "Financial" | "Operational" | "Strategic" | "Customer" | "Employee"
  name: string
  description: string
  unit: string
  baseline: number
  target: number
  actual?: number
  formula?: string
  dataSource?: string
}

export interface ROICalculation {
  projectName: string
  investmentPeriod: number // months
  costs: CostBreakdown
  benefits: BenefitBreakdown
  metrics: {
    roi: number
    npv: number
    irr: number
    paybackPeriod: number
    breakEvenPoint: Date
  }
  sensitivity: SensitivityAnalysis
}

export interface CostBreakdown {
  oneTime: {
    licensing: number
    implementation: number
    training: number
    consulting: number
    infrastructure: number
  }
  recurring: {
    licensing: number
    support: number
    maintenance: number
    operations: number
  }
  total: number
  totalAnnualized: number
}

export interface BenefitBreakdown {
  tangible: {
    costSavings: number
    productivityGains: number
    revenueIncrease: number
    qualityImprovement: number
  }
  intangible: {
    customerSatisfaction: number
    employeeEngagement: number
    agility: number
    innovation: number
  }
  total: number
  totalAnnualized: number
}

export interface SensitivityAnalysis {
  scenarios: {
    pessimistic: { roi: number; npv: number }
    realistic: { roi: number; npv: number }
    optimistic: { roi: number; npv: number }
  }
  keyDrivers: Array<{
    variable: string
    impact: "High" | "Medium" | "Low"
    range: string
  }>
}

// Standard Value Metrics Library
export const standardValueMetrics: ValueMetric[] = [
  // Financial Metrics
  {
    category: "Financial",
    name: "Cost per Transaction",
    description: "Average cost to process a single transaction",
    unit: "USD",
    baseline: 25,
    target: 5,
    formula: "Total Process Cost / Number of Transactions"
  },
  {
    category: "Financial",
    name: "Revenue per Employee",
    description: "Revenue generated per FTE",
    unit: "USD",
    baseline: 250000,
    target: 300000,
    formula: "Total Revenue / FTE Count"
  },
  {
    category: "Financial",
    name: "Working Capital Optimization",
    description: "Days of working capital improvement",
    unit: "Days",
    baseline: 45,
    target: 30,
    formula: "(Receivables + Inventory - Payables) / Daily Revenue"
  },

  // Operational Metrics
  {
    category: "Operational",
    name: "Process Cycle Time",
    description: "End-to-end process completion time",
    unit: "Hours",
    baseline: 72,
    target: 24,
    formula: "Process End Time - Process Start Time"
  },
  {
    category: "Operational",
    name: "First Time Right Rate",
    description: "Percentage of processes completed without rework",
    unit: "%",
    baseline: 75,
    target: 95,
    formula: "(Processes without Rework / Total Processes) * 100"
  },
  {
    category: "Operational",
    name: "Automation Rate",
    description: "Percentage of process steps automated",
    unit: "%",
    baseline: 20,
    target: 70,
    formula: "(Automated Steps / Total Steps) * 100"
  },

  // Strategic Metrics
  {
    category: "Strategic",
    name: "Time to Market",
    description: "Time from concept to product launch",
    unit: "Days",
    baseline: 180,
    target: 90,
    formula: "Launch Date - Concept Approval Date"
  },
  {
    category: "Strategic",
    name: "Innovation Index",
    description: "New solutions deployed per quarter",
    unit: "Count",
    baseline: 2,
    target: 10,
    formula: "Count of New Solutions Deployed"
  },
  {
    category: "Strategic",
    name: "Digital Maturity Score",
    description: "Organization's digital capability maturity",
    unit: "Score",
    baseline: 2.5,
    target: 4.0,
    formula: "Weighted Average of Digital Capability Assessments"
  },

  // Customer Metrics
  {
    category: "Customer",
    name: "Customer Satisfaction Score",
    description: "CSAT rating for automated processes",
    unit: "Score",
    baseline: 3.5,
    target: 4.5,
    formula: "Average Customer Rating (1-5 scale)"
  },
  {
    category: "Customer",
    name: "Response Time SLA",
    description: "Average customer response time",
    unit: "Minutes",
    baseline: 480,
    target: 60,
    formula: "Average(Response Time - Request Time)"
  },
  {
    category: "Customer",
    name: "Digital Channel Adoption",
    description: "Percentage of customers using digital channels",
    unit: "%",
    baseline: 40,
    target: 80,
    formula: "(Digital Channel Users / Total Users) * 100"
  },

  // Employee Metrics
  {
    category: "Employee",
    name: "Employee Productivity Index",
    description: "Output per employee hour",
    unit: "Index",
    baseline: 100,
    target: 150,
    formula: "(Output Value / Employee Hours) * 100"
  },
  {
    category: "Employee",
    name: "Maker Participation Rate",
    description: "Percentage of employees creating solutions",
    unit: "%",
    baseline: 5,
    target: 25,
    formula: "(Active Makers / Total Employees) * 100"
  },
  {
    category: "Employee",
    name: "Digital Skills Index",
    description: "Average digital competency score",
    unit: "Score",
    baseline: 2.8,
    target: 4.2,
    formula: "Average(Employee Digital Skill Assessments)"
  }
]

// ROI Calculation Functions
export function calculateROI(costs: CostBreakdown, benefits: BenefitBreakdown): number {
  const netBenefit = benefits.totalAnnualized - costs.totalAnnualized
  const roi = (netBenefit / costs.totalAnnualized) * 100
  return Math.round(roi)
}

export function calculateNPV(
  cashFlows: number[],
  discountRate: number = 0.1
): number {
  let npv = 0
  cashFlows.forEach((cashFlow, year) => {
    npv += cashFlow / Math.pow(1 + discountRate, year)
  })
  return Math.round(npv)
}

export function calculateIRR(cashFlows: number[]): number {
  // Simplified IRR calculation using Newton's method
  let rate = 0.1
  let tolerance = 0.00001
  let maxIterations = 100
  
  for (let i = 0; i < maxIterations; i++) {
    let npv = 0
    let dnpv = 0
    
    for (let j = 0; j < cashFlows.length; j++) {
      npv += cashFlows[j] / Math.pow(1 + rate, j)
      dnpv -= j * cashFlows[j] / Math.pow(1 + rate, j + 1)
    }
    
    let newRate = rate - npv / dnpv
    if (Math.abs(newRate - rate) < tolerance) {
      return Math.round(newRate * 10000) / 100 // Return as percentage
    }
    rate = newRate
  }
  
  return Math.round(rate * 10000) / 100
}

export function calculatePaybackPeriod(
  initialInvestment: number,
  annualCashFlow: number
): number {
  return Math.round((initialInvestment / annualCashFlow) * 12) // Return in months
}

export function performSensitivityAnalysis(
  baseCosts: CostBreakdown,
  baseBenefits: BenefitBreakdown
): SensitivityAnalysis {
  // Define sensitivity ranges
  const scenarios = {
    pessimistic: { costMultiplier: 1.3, benefitMultiplier: 0.7 },
    realistic: { costMultiplier: 1.0, benefitMultiplier: 1.0 },
    optimistic: { costMultiplier: 0.8, benefitMultiplier: 1.3 }
  }

  const results = {
    pessimistic: {
      roi: calculateROI(
        { ...baseCosts, totalAnnualized: baseCosts.totalAnnualized * scenarios.pessimistic.costMultiplier },
        { ...baseBenefits, totalAnnualized: baseBenefits.totalAnnualized * scenarios.pessimistic.benefitMultiplier }
      ),
      npv: 0 // Would calculate with adjusted cash flows
    },
    realistic: {
      roi: calculateROI(baseCosts, baseBenefits),
      npv: 0 // Would calculate with base cash flows
    },
    optimistic: {
      roi: calculateROI(
        { ...baseCosts, totalAnnualized: baseCosts.totalAnnualized * scenarios.optimistic.costMultiplier },
        { ...baseBenefits, totalAnnualized: baseBenefits.totalAnnualized * scenarios.optimistic.benefitMultiplier }
      ),
      npv: 0 // Would calculate with adjusted cash flows
    }
  }

  const keyDrivers = [
    {
      variable: "License Costs",
      impact: "High" as const,
      range: "-20% to +30%"
    },
    {
      variable: "Productivity Gains",
      impact: "High" as const,
      range: "-30% to +30%"
    },
    {
      variable: "Implementation Timeline",
      impact: "Medium" as const,
      range: "-2 to +4 months"
    },
    {
      variable: "User Adoption Rate",
      impact: "High" as const,
      range: "60% to 90%"
    }
  ]

  return {
    scenarios: results,
    keyDrivers
  }
}

// Value Realization Tracking
export interface ValueRealization {
  metric: ValueMetric
  trackingPeriod: {
    start: Date
    end: Date
  }
  measurements: Array<{
    date: Date
    value: number
    notes?: string
  }>
  trendAnalysis: {
    direction: "Improving" | "Stable" | "Declining"
    percentageChange: number
    onTrackForTarget: boolean
  }
}

export function trackValueRealization(
  metric: ValueMetric,
  measurements: Array<{ date: Date; value: number }>
): ValueRealization["trendAnalysis"] {
  if (measurements.length < 2) {
    return {
      direction: "Stable",
      percentageChange: 0,
      onTrackForTarget: false
    }
  }

  const firstValue = measurements[0].value
  const lastValue = measurements[measurements.length - 1].value
  const percentageChange = ((lastValue - firstValue) / firstValue) * 100

  let direction: ValueRealization["trendAnalysis"]["direction"]
  if (percentageChange > 5) {
    direction = metric.target > metric.baseline ? "Improving" : "Declining"
  } else if (percentageChange < -5) {
    direction = metric.target < metric.baseline ? "Improving" : "Declining"
  } else {
    direction = "Stable"
  }

  const progress = ((lastValue - metric.baseline) / (metric.target - metric.baseline)) * 100
  const onTrackForTarget = progress >= 70 // 70% progress considered on track

  return {
    direction,
    percentageChange: Math.round(percentageChange),
    onTrackForTarget
  }
}

// Executive Value Dashboard Data
export interface ExecutiveValueDashboard {
  overallROI: number
  totalInvestment: number
  totalBenefitsRealized: number
  topPerformingMetrics: Array<{
    metric: ValueMetric
    improvement: number
    impact: string
  }>
  underperformingMetrics: Array<{
    metric: ValueMetric
    gap: number
    actionRequired: string
  }>
  quarterlyTrend: Array<{
    quarter: string
    roi: number
    investment: number
    benefits: number
  }>
}

export function generateExecutiveValueDashboard(
  roiCalculations: ROICalculation[],
  valueRealizations: ValueRealization[]
): ExecutiveValueDashboard {
  // Aggregate ROI calculations
  const totalInvestment = roiCalculations.reduce((sum, calc) => sum + calc.costs.total, 0)
  const totalBenefits = roiCalculations.reduce((sum, calc) => sum + calc.benefits.total, 0)
  const overallROI = ((totalBenefits - totalInvestment) / totalInvestment) * 100

  // Identify top and underperforming metrics
  const topPerformingMetrics = valueRealizations
    .filter(vr => vr.trendAnalysis.percentageChange > 20)
    .sort((a, b) => b.trendAnalysis.percentageChange - a.trendAnalysis.percentageChange)
    .slice(0, 5)
    .map(vr => ({
      metric: vr.metric,
      improvement: vr.trendAnalysis.percentageChange,
      impact: `${vr.metric.category} excellence driver`
    }))

  const underperformingMetrics = valueRealizations
    .filter(vr => !vr.trendAnalysis.onTrackForTarget)
    .slice(0, 5)
    .map(vr => ({
      metric: vr.metric,
      gap: Math.round(((vr.metric.target - (vr.measurements[vr.measurements.length - 1]?.value || vr.metric.baseline)) / vr.metric.target) * 100),
      actionRequired: "Executive intervention needed"
    }))

  // Generate quarterly trend (mock data for example)
  const quarterlyTrend = [
    { quarter: "Q1 2024", roi: 50, investment: 500000, benefits: 750000 },
    { quarter: "Q2 2024", roi: 120, investment: 750000, benefits: 1650000 },
    { quarter: "Q3 2024", roi: 180, investment: 900000, benefits: 2520000 },
    { quarter: "Q4 2024", roi: 250, investment: 1000000, benefits: 3500000 }
  ]

  return {
    overallROI: Math.round(overallROI),
    totalInvestment,
    totalBenefitsRealized: totalBenefits,
    topPerformingMetrics,
    underperformingMetrics,
    quarterlyTrend
  }
}