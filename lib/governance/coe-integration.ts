/**
 * Center of Excellence (CoE) Toolkit Integration
 * Connects to Power Platform CoE tools for governance analytics
 * Provides app usage analytics, maker activity monitoring, and lifecycle management
 */

export interface CoEApp {
  id: string
  name: string
  displayName: string
  environment: string
  environmentDisplayName: string
  owner: {
    id: string
    email: string
    displayName: string
    userType: 'Member' | 'Guest'
  }
  createdTime: Date
  modifiedTime: Date
  lastLaunchedTime?: Date
  status: 'Published' | 'Draft' | 'Deleted' | 'Suspended'
  type: 'Canvas' | 'Model-driven' | 'Portal'
  version: string
  sharedWith: number
  uniqueUsers: number
  totalSessions: number
  avgSessionDuration: number // minutes
  complexity: 'Low' | 'Medium' | 'High'
  riskScore: number // 0-100
  complianceStatus: 'Compliant' | 'Warning' | 'Violation'
  businessJustification?: string
  lastReviewed?: Date
  reviewedBy?: string
  connectors: string[]
  dataConnections: Array<{
    name: string
    type: string
    classification: 'Public' | 'Internal' | 'Confidential' | 'Restricted'
  }>
  lifecycle: {
    stage: 'Development' | 'Testing' | 'Production' | 'Deprecated'
    deploymentDate?: Date
    lastHealthCheck?: Date
    maintenanceSchedule?: string
  }
}

export interface CoEFlow {
  id: string
  name: string
  displayName: string
  environment: string
  environmentDisplayName: string
  owner: {
    id: string
    email: string
    displayName: string
  }
  createdTime: Date
  modifiedTime: Date
  status: 'Started' | 'Suspended' | 'Stopped'
  type: 'Automated' | 'Instant' | 'Scheduled'
  triggerType: string
  runFrequency: 'On-demand' | 'Daily' | 'Weekly' | 'Monthly'
  totalRuns: number
  successfulRuns: number
  failedRuns: number
  avgExecutionTime: number // minutes
  errorRate: number // percentage
  lastRunTime?: Date
  nextRunTime?: Date
  connectors: string[]
  businessCriticality: 'Low' | 'Medium' | 'High' | 'Critical'
  complianceStatus: 'Compliant' | 'Warning' | 'Violation'
  riskFactors: string[]
}

export interface CoEMaker {
  id: string
  email: string
  displayName: string
  userType: 'Member' | 'Guest'
  department?: string
  jobTitle?: string
  location?: string
  firstActiveDate: Date
  lastActiveDate: Date
  isActive: boolean
  totalApps: number
  totalFlows: number
  sharedApps: number
  businessApps: number // apps with business justification
  riskScore: number // 0-100
  skillLevel: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert'
  certifications: string[]
  training: Array<{
    course: string
    completedDate: Date
    score?: number
  }>
  mentorAssigned?: string
  needsSupport: boolean
  violations: Array<{
    type: 'Security' | 'Compliance' | 'Policy'
    description: string
    severity: 'Low' | 'Medium' | 'High'
    date: Date
    resolved: boolean
  }>
}

export interface CoEEnvironmentHealth {
  environmentId: string
  environmentName: string
  environmentType: 'Production' | 'Sandbox' | 'Trial' | 'Teams'
  region: string
  healthScore: number // 0-100
  lastAssessment: Date
  metrics: {
    totalApps: number
    activeApps: number
    orphanedApps: number
    totalFlows: number
    activeFlows: number
    failingFlows: number
    totalMakers: number
    activeMakers: number
    storageUsage: number // MB
    storageLimit: number // MB
    apiCalls: number
    apiLimit: number
  }
  issues: Array<{
    category: 'Performance' | 'Security' | 'Compliance' | 'Resource'
    severity: 'Low' | 'Medium' | 'High' | 'Critical'
    title: string
    description: string
    recommendation: string
    affectedResources: number
  }>
  recommendations: Array<{
    priority: 'Low' | 'Medium' | 'High'
    category: 'Optimization' | 'Security' | 'Governance'
    title: string
    description: string
    estimatedEffort: string
    expectedBenefit: string
  }>
}

export interface CoEGovernanceMetrics {
  period: {
    startDate: Date
    endDate: Date
  }
  adoption: {
    totalMakers: number
    newMakers: number
    activeMakers: number
    makerGrowthRate: number // percentage
    departmentAdoption: Record<string, number>
  }
  usage: {
    totalApps: number
    newApps: number
    activeApps: number
    appUsageGrowth: number // percentage
    totalFlows: number
    newFlows: number
    activeFlows: number
    flowUsageGrowth: number // percentage
    totalSessions: number
    uniqueUsers: number
    avgSessionDuration: number
  }
  governance: {
    appsWithBusinessJustification: number
    appsUnderReview: number
    policyViolations: number
    securityIncidents: number
    complianceScore: number // 0-100
    orphanedResources: number
  }
  quality: {
    avgAppComplexity: number
    avgRiskScore: number
    appsNeedingReview: number
    flowsWithErrors: number
    avgFlowErrorRate: number
  }
  productivity: {
    timeToDeployment: number // days
    makerProductivity: number // apps per maker
    businessValueGenerated: number // estimated $
    costSavings: number // estimated $
  }
}

export class CoEIntegrationManager {
  private apps: Map<string, CoEApp> = new Map()
  private flows: Map<string, CoEFlow> = new Map()
  private makers: Map<string, CoEMaker> = new Map()
  private environmentHealth: Map<string, CoEEnvironmentHealth> = new Map()
  private governanceMetrics: CoEGovernanceMetrics | null = null

  constructor() {
    this.initializeSampleData()
  }

  /**
   * Initialize sample CoE data
   * Governance: Populate with representative Power Platform assets
   */
  private initializeSampleData(): void {
    this.initializeApps()
    this.initializeFlows()
    this.initializeMakers()
    this.initializeEnvironmentHealth()
    this.initializeGovernanceMetrics()
  }

  private initializeApps(): void {
    const sampleApps: CoEApp[] = [
      {
        id: 'app-001',
        name: 'Employee Onboarding Portal',
        displayName: 'Employee Onboarding Portal',
        environment: 'env-prod-001',
        environmentDisplayName: 'Production',
        owner: {
          id: 'user-001',
          email: 'sarah.johnson@company.com',
          displayName: 'Sarah Johnson',
          userType: 'Member'
        },
        createdTime: new Date('2023-08-15'),
        modifiedTime: new Date('2024-01-10'),
        lastLaunchedTime: new Date('2024-01-15'),
        status: 'Published',
        type: 'Canvas',
        version: '2.3.1',
        sharedWith: 150,
        uniqueUsers: 89,
        totalSessions: 456,
        avgSessionDuration: 12.5,
        complexity: 'High',
        riskScore: 25,
        complianceStatus: 'Compliant',
        businessJustification: 'Streamlines HR onboarding process, saving 2 hours per new hire',
        lastReviewed: new Date('2024-01-01'),
        reviewedBy: 'IT Governance Team',
        connectors: ['SharePoint', 'Office 365 Users', 'Outlook', 'Teams'],
        dataConnections: [
          { name: 'Employee Database', type: 'SQL Server', classification: 'Confidential' },
          { name: 'HR SharePoint', type: 'SharePoint', classification: 'Internal' }
        ],
        lifecycle: {
          stage: 'Production',
          deploymentDate: new Date('2023-09-01'),
          lastHealthCheck: new Date('2024-01-10'),
          maintenanceSchedule: 'Monthly'
        }
      },
      {
        id: 'app-002',
        name: 'Expense Tracker',
        displayName: 'Expense Tracker',
        environment: 'env-prod-001',
        environmentDisplayName: 'Production',
        owner: {
          id: 'user-002',
          email: 'mike.chen@company.com',
          displayName: 'Mike Chen',
          userType: 'Member'
        },
        createdTime: new Date('2023-11-20'),
        modifiedTime: new Date('2024-01-12'),
        lastLaunchedTime: new Date('2024-01-14'),
        status: 'Published',
        type: 'Canvas',
        version: '1.8.2',
        sharedWith: 75,
        uniqueUsers: 67,
        totalSessions: 234,
        avgSessionDuration: 8.3,
        complexity: 'Medium',
        riskScore: 15,
        complianceStatus: 'Warning',
        businessJustification: 'Automates expense reporting and approval workflow',
        lastReviewed: new Date('2023-12-15'),
        reviewedBy: 'Finance Team',
        connectors: ['SharePoint', 'Office 365 Users', 'Approvals'],
        dataConnections: [
          { name: 'Finance SharePoint', type: 'SharePoint', classification: 'Internal' },
          { name: 'Expense Categories', type: 'Dataverse', classification: 'Internal' }
        ],
        lifecycle: {
          stage: 'Production',
          deploymentDate: new Date('2023-12-01'),
          lastHealthCheck: new Date('2024-01-08'),
          maintenanceSchedule: 'Quarterly'
        }
      }
    ]

    sampleApps.forEach(app => this.apps.set(app.id, app))
  }

  private initializeFlows(): void {
    const sampleFlows: CoEFlow[] = [
      {
        id: 'flow-001',
        name: 'New Employee Notification',
        displayName: 'New Employee Notification',
        environment: 'env-prod-001',
        environmentDisplayName: 'Production',
        owner: {
          id: 'user-001',
          email: 'sarah.johnson@company.com',
          displayName: 'Sarah Johnson'
        },
        createdTime: new Date('2023-08-15'),
        modifiedTime: new Date('2024-01-05'),
        status: 'Started',
        type: 'Automated',
        triggerType: 'When an item is created (SharePoint)',
        runFrequency: 'On-demand',
        totalRuns: 156,
        successfulRuns: 152,
        failedRuns: 4,
        avgExecutionTime: 2.3,
        errorRate: 2.6,
        lastRunTime: new Date('2024-01-14'),
        connectors: ['SharePoint', 'Office 365 Outlook', 'Teams'],
        businessCriticality: 'High',
        complianceStatus: 'Compliant',
        riskFactors: []
      },
      {
        id: 'flow-002',
        name: 'Expense Approval Workflow',
        displayName: 'Expense Approval Workflow',
        environment: 'env-prod-001',
        environmentDisplayName: 'Production',
        owner: {
          id: 'user-002',
          email: 'mike.chen@company.com',
          displayName: 'Mike Chen'
        },
        createdTime: new Date('2023-11-20'),
        modifiedTime: new Date('2024-01-10'),
        status: 'Started',
        type: 'Automated',
        triggerType: 'When an item is created or modified (SharePoint)',
        runFrequency: 'On-demand',
        totalRuns: 89,
        successfulRuns: 84,
        failedRuns: 5,
        avgExecutionTime: 5.8,
        errorRate: 5.6,
        lastRunTime: new Date('2024-01-13'),
        connectors: ['SharePoint', 'Approvals', 'Office 365 Outlook'],
        businessCriticality: 'Medium',
        complianceStatus: 'Warning',
        riskFactors: ['High error rate', 'Long execution time']
      }
    ]

    sampleFlows.forEach(flow => this.flows.set(flow.id, flow))
  }

  private initializeMakers(): void {
    const sampleMakers: CoEMaker[] = [
      {
        id: 'user-001',
        email: 'sarah.johnson@company.com',
        displayName: 'Sarah Johnson',
        userType: 'Member',
        department: 'Human Resources',
        jobTitle: 'HR Business Partner',
        location: 'New York, NY',
        firstActiveDate: new Date('2023-06-01'),
        lastActiveDate: new Date('2024-01-15'),
        isActive: true,
        totalApps: 3,
        totalFlows: 5,
        sharedApps: 2,
        businessApps: 3,
        riskScore: 15,
        skillLevel: 'Advanced',
        certifications: ['PL-900: Power Platform Fundamentals', 'PL-100: Power Platform App Maker'],
        training: [
          { course: 'Power Apps Canvas Apps', completedDate: new Date('2023-07-15'), score: 92 },
          { course: 'Power Automate Fundamentals', completedDate: new Date('2023-08-20'), score: 88 }
        ],
        mentorAssigned: 'IT Center of Excellence',
        needsSupport: false,
        violations: []
      },
      {
        id: 'user-002',
        email: 'mike.chen@company.com',
        displayName: 'Mike Chen',
        userType: 'Member',
        department: 'Finance',
        jobTitle: 'Financial Analyst',
        location: 'San Francisco, CA',
        firstActiveDate: new Date('2023-10-01'),
        lastActiveDate: new Date('2024-01-14'),
        isActive: true,
        totalApps: 2,
        totalFlows: 3,
        sharedApps: 1,
        businessApps: 1,
        riskScore: 35,
        skillLevel: 'Intermediate',
        certifications: ['PL-900: Power Platform Fundamentals'],
        training: [
          { course: 'Power Apps Canvas Apps', completedDate: new Date('2023-11-10'), score: 76 }
        ],
        needsSupport: true,
        violations: [
          {
            type: 'Compliance',
            description: 'App created without proper business justification',
            severity: 'Medium',
            date: new Date('2024-01-05'),
            resolved: false
          }
        ]
      }
    ]

    sampleMakers.forEach(maker => this.makers.set(maker.id, maker))
  }

  private initializeEnvironmentHealth(): void {
    const sampleHealth: CoEEnvironmentHealth[] = [
      {
        environmentId: 'env-prod-001',
        environmentName: 'Production',
        environmentType: 'Production',
        region: 'East US',
        healthScore: 87,
        lastAssessment: new Date('2024-01-15'),
        metrics: {
          totalApps: 25,
          activeApps: 22,
          orphanedApps: 1,
          totalFlows: 45,
          activeFlows: 40,
          failingFlows: 3,
          totalMakers: 156,
          activeMakers: 89,
          storageUsage: 7680,
          storageLimit: 10240,
          apiCalls: 145000,
          apiLimit: 200000
        },
        issues: [
          {
            category: 'Performance',
            severity: 'Medium',
            title: 'High Flow Error Rate',
            description: 'Several flows showing consistent failures above 5% threshold',
            recommendation: 'Review and optimize failing flows, implement error handling',
            affectedResources: 3
          },
          {
            category: 'Compliance',
            severity: 'Low',
            title: 'Apps Without Business Justification',
            description: 'Some apps lack proper business justification documentation',
            recommendation: 'Require business justification for all production apps',
            affectedResources: 2
          }
        ],
        recommendations: [
          {
            priority: 'High',
            category: 'Optimization',
            title: 'Implement Flow Monitoring',
            description: 'Set up automated monitoring for flow performance and errors',
            estimatedEffort: '2-3 weeks',
            expectedBenefit: 'Reduced downtime and improved reliability'
          },
          {
            priority: 'Medium',
            category: 'Governance',
            title: 'Establish App Review Process',
            description: 'Create formal review process for app lifecycle management',
            estimatedEffort: '1-2 weeks',
            expectedBenefit: 'Better compliance and reduced technical debt'
          }
        ]
      }
    ]

    sampleHealth.forEach(health => this.environmentHealth.set(health.environmentId, health))
  }

  private initializeGovernanceMetrics(): void {
    this.governanceMetrics = {
      period: {
        startDate: new Date('2023-12-01'),
        endDate: new Date('2024-01-15')
      },
      adoption: {
        totalMakers: 156,
        newMakers: 23,
        activeMakers: 89,
        makerGrowthRate: 18.5,
        departmentAdoption: {
          'Human Resources': 34,
          'Finance': 28,
          'Sales': 22,
          'Marketing': 18,
          'Operations': 16,
          'IT': 12,
          'Legal': 8,
          'Other': 18
        }
      },
      usage: {
        totalApps: 78,
        newApps: 12,
        activeApps: 67,
        appUsageGrowth: 15.4,
        totalFlows: 134,
        newFlows: 18,
        activeFlows: 118,
        flowUsageGrowth: 13.4,
        totalSessions: 2890,
        uniqueUsers: 245,
        avgSessionDuration: 11.2
      },
      governance: {
        appsWithBusinessJustification: 58,
        appsUnderReview: 8,
        policyViolations: 5,
        securityIncidents: 1,
        complianceScore: 87,
        orphanedResources: 12
      },
      quality: {
        avgAppComplexity: 2.3, // 1-3 scale
        avgRiskScore: 22.5,
        appsNeedingReview: 15,
        flowsWithErrors: 8,
        avgFlowErrorRate: 3.2
      },
      productivity: {
        timeToDeployment: 14.5,
        makerProductivity: 2.1,
        businessValueGenerated: 285000,
        costSavings: 125000
      }
    }
  }

  /**
   * Get all apps with filtering
   * Governance: Retrieve Power Platform applications with governance data
   */
  getApps(filter?: {
    environment?: string
    owner?: string
    status?: CoEApp['status']
    complianceStatus?: CoEApp['complianceStatus']
    riskLevel?: 'low' | 'medium' | 'high'
  }): CoEApp[] {
    let apps = Array.from(this.apps.values())

    if (filter) {
      if (filter.environment) {
        apps = apps.filter(app => app.environment === filter.environment)
      }
      if (filter.owner) {
        apps = apps.filter(app => app.owner.id === filter.owner)
      }
      if (filter.status) {
        apps = apps.filter(app => app.status === filter.status)
      }
      if (filter.complianceStatus) {
        apps = apps.filter(app => app.complianceStatus === filter.complianceStatus)
      }
      if (filter.riskLevel) {
        const riskThresholds = { low: 30, medium: 60, high: 100 }
        const maxRisk = riskThresholds[filter.riskLevel]
        const minRisk = filter.riskLevel === 'low' ? 0 : 
                       filter.riskLevel === 'medium' ? 30 : 60
        apps = apps.filter(app => app.riskScore >= minRisk && app.riskScore < maxRisk)
      }
    }

    return apps.sort((a, b) => b.modifiedTime.getTime() - a.modifiedTime.getTime())
  }

  /**
   * Get all flows with filtering
   * Governance: Retrieve Power Automate flows with performance data
   */
  getFlows(filter?: {
    environment?: string
    owner?: string
    status?: CoEFlow['status']
    businessCriticality?: CoEFlow['businessCriticality']
    hasErrors?: boolean
  }): CoEFlow[] {
    let flows = Array.from(this.flows.values())

    if (filter) {
      if (filter.environment) {
        flows = flows.filter(flow => flow.environment === filter.environment)
      }
      if (filter.owner) {
        flows = flows.filter(flow => flow.owner.id === filter.owner)
      }
      if (filter.status) {
        flows = flows.filter(flow => flow.status === filter.status)
      }
      if (filter.businessCriticality) {
        flows = flows.filter(flow => flow.businessCriticality === filter.businessCriticality)
      }
      if (filter.hasErrors !== undefined) {
        flows = flows.filter(flow => filter.hasErrors ? flow.errorRate > 5 : flow.errorRate <= 5)
      }
    }

    return flows.sort((a, b) => b.modifiedTime.getTime() - a.modifiedTime.getTime())
  }

  /**
   * Get all makers with filtering
   * Governance: Retrieve citizen developers with skill and risk assessment
   */
  getMakers(filter?: {
    department?: string
    skillLevel?: CoEMaker['skillLevel']
    needsSupport?: boolean
    hasViolations?: boolean
    isActive?: boolean
  }): CoEMaker[] {
    let makers = Array.from(this.makers.values())

    if (filter) {
      if (filter.department) {
        makers = makers.filter(maker => maker.department === filter.department)
      }
      if (filter.skillLevel) {
        makers = makers.filter(maker => maker.skillLevel === filter.skillLevel)
      }
      if (filter.needsSupport !== undefined) {
        makers = makers.filter(maker => maker.needsSupport === filter.needsSupport)
      }
      if (filter.hasViolations !== undefined) {
        makers = makers.filter(maker => 
          filter.hasViolations ? maker.violations.length > 0 : maker.violations.length === 0
        )
      }
      if (filter.isActive !== undefined) {
        makers = makers.filter(maker => maker.isActive === filter.isActive)
      }
    }

    return makers.sort((a, b) => b.lastActiveDate.getTime() - a.lastActiveDate.getTime())
  }

  /**
   * Get environment health
   * Governance: Retrieve environment health metrics and recommendations
   */
  getEnvironmentHealth(environmentId?: string): CoEEnvironmentHealth[] {
    if (environmentId) {
      const health = this.environmentHealth.get(environmentId)
      return health ? [health] : []
    }
    return Array.from(this.environmentHealth.values())
  }

  /**
   * Get governance metrics
   * Governance: Retrieve comprehensive governance and adoption metrics
   */
  getGovernanceMetrics(): CoEGovernanceMetrics | null {
    return this.governanceMetrics
  }

  /**
   * Get maker analytics
   * Governance: Analyze maker behavior and provide insights
   */
  getMakerAnalytics(): {
    topMakers: Array<{ maker: CoEMaker; productivity: number }>
    skillDistribution: Record<string, number>
    departmentActivity: Record<string, number>
    riskMakers: CoEMaker[]
    needingSupportCount: number
    violationsCount: number
    certificationStats: Record<string, number>
  } {
    const makers = this.getMakers()
    
    // Calculate top makers by productivity (apps + flows)
    const topMakers = makers
      .map(maker => ({
        maker,
        productivity: maker.totalApps + maker.totalFlows
      }))
      .sort((a, b) => b.productivity - a.productivity)
      .slice(0, 10)

    // Skill level distribution
    const skillDistribution = makers.reduce((acc, maker) => {
      acc[maker.skillLevel] = (acc[maker.skillLevel] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    // Department activity
    const departmentActivity = makers.reduce((acc, maker) => {
      const dept = maker.department || 'Unknown'
      acc[dept] = (acc[dept] || 0) + maker.totalApps + maker.totalFlows
      return acc
    }, {} as Record<string, number>)

    // High-risk makers (risk score > 50)
    const riskMakers = makers.filter(maker => maker.riskScore > 50)

    // Certification statistics
    const certificationStats = makers.reduce((acc, maker) => {
      maker.certifications.forEach(cert => {
        acc[cert] = (acc[cert] || 0) + 1
      })
      return acc
    }, {} as Record<string, number>)

    return {
      topMakers,
      skillDistribution,
      departmentActivity,
      riskMakers,
      needingSupportCount: makers.filter(m => m.needsSupport).length,
      violationsCount: makers.reduce((sum, m) => sum + m.violations.length, 0),
      certificationStats
    }
  }

  /**
   * Get app analytics
   * Governance: Analyze app usage patterns and health
   */
  getAppAnalytics(): {
    mostUsedApps: CoEApp[]
    riskApps: CoEApp[]
    orphanedApps: CoEApp[]
    complianceBreakdown: Record<string, number>
    complexityDistribution: Record<string, number>
    connectorUsage: Record<string, number>
    lifecycleDistribution: Record<string, number>
    avgSessionDuration: number
    totalSessions: number
  } {
    const apps = this.getApps()

    // Most used apps by unique users
    const mostUsedApps = apps
      .sort((a, b) => b.uniqueUsers - a.uniqueUsers)
      .slice(0, 10)

    // High-risk apps (risk score > 50)
    const riskApps = apps.filter(app => app.riskScore > 50)

    // Orphaned apps (not launched in 90 days)
    const ninetyDaysAgo = new Date()
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90)
    const orphanedApps = apps.filter(app => 
      !app.lastLaunchedTime || app.lastLaunchedTime < ninetyDaysAgo
    )

    // Compliance status breakdown
    const complianceBreakdown = apps.reduce((acc, app) => {
      acc[app.complianceStatus] = (acc[app.complianceStatus] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    // Complexity distribution
    const complexityDistribution = apps.reduce((acc, app) => {
      acc[app.complexity] = (acc[app.complexity] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    // Connector usage
    const connectorUsage = apps.reduce((acc, app) => {
      app.connectors.forEach(connector => {
        acc[connector] = (acc[connector] || 0) + 1
      })
      return acc
    }, {} as Record<string, number>)

    // Lifecycle stage distribution
    const lifecycleDistribution = apps.reduce((acc, app) => {
      acc[app.lifecycle.stage] = (acc[app.lifecycle.stage] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const totalSessions = apps.reduce((sum, app) => sum + app.totalSessions, 0)
    const totalDuration = apps.reduce((sum, app) => sum + (app.avgSessionDuration * app.totalSessions), 0)
    const avgSessionDuration = totalSessions > 0 ? totalDuration / totalSessions : 0

    return {
      mostUsedApps,
      riskApps,
      orphanedApps,
      complianceBreakdown,
      complexityDistribution,
      connectorUsage,
      lifecycleDistribution,
      avgSessionDuration,
      totalSessions
    }
  }

  /**
   * Generate CoE dashboard summary
   * Governance: Executive overview of Power Platform governance
   */
  getCoEDashboardSummary(): {
    adoption: {
      totalMakers: number
      activeMakers: number
      newMakersThisMonth: number
      adoptionRate: number
    }
    assets: {
      totalApps: number
      totalFlows: number
      activeAssets: number
      riskAssets: number
    }
    health: {
      avgEnvironmentHealth: number
      criticalIssues: number
      totalRecommendations: number
      complianceScore: number
    }
    productivity: {
      businessValue: number
      costSavings: number
      avgTimeToDeployment: number
      makerProductivity: number
    }
  } {
    const makers = this.getMakers()
    const apps = this.getApps()
    const flows = this.getFlows()
    const metrics = this.getGovernanceMetrics()

    const activeMakers = makers.filter(m => m.isActive).length
    const riskAssets = apps.filter(a => a.riskScore > 50).length + flows.filter(f => f.errorRate > 10).length

    const environmentHealthScores = Array.from(this.environmentHealth.values()).map(h => h.healthScore)
    const avgEnvironmentHealth = environmentHealthScores.length > 0 ? 
      Math.round(environmentHealthScores.reduce((sum, score) => sum + score, 0) / environmentHealthScores.length) : 0

    const criticalIssues = Array.from(this.environmentHealth.values())
      .reduce((sum, health) => sum + health.issues.filter(i => i.severity === 'Critical' || i.severity === 'High').length, 0)

    const totalRecommendations = Array.from(this.environmentHealth.values())
      .reduce((sum, health) => sum + health.recommendations.length, 0)

    return {
      adoption: {
        totalMakers: makers.length,
        activeMakers,
        newMakersThisMonth: metrics?.adoption.newMakers || 0,
        adoptionRate: Math.round((activeMakers / makers.length) * 100)
      },
      assets: {
        totalApps: apps.length,
        totalFlows: flows.length,
        activeAssets: apps.filter(a => a.status === 'Published').length + flows.filter(f => f.status === 'Started').length,
        riskAssets
      },
      health: {
        avgEnvironmentHealth,
        criticalIssues,
        totalRecommendations,
        complianceScore: metrics?.governance.complianceScore || 0
      },
      productivity: {
        businessValue: metrics?.productivity.businessValueGenerated || 0,
        costSavings: metrics?.productivity.costSavings || 0,
        avgTimeToDeployment: metrics?.productivity.timeToDeployment || 0,
        makerProductivity: metrics?.productivity.makerProductivity || 0
      }
    }
  }
}

// Singleton instance for global access
export const coeIntegrationManager = new CoEIntegrationManager()