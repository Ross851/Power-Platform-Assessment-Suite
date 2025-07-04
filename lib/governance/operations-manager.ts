/**
 * Power Platform Operations Excellence Manager
 * Provides KPI tracking, performance monitoring, and governance metrics
 * Supports both tenant-level and environment-level operations
 */

export interface OperationalMetric {
  id: string
  name: string
  value: number
  target: number
  unit: string
  trend: 'up' | 'down' | 'stable'
  category: 'performance' | 'reliability' | 'security' | 'cost' | 'usage'
  environment: 'tenant' | 'dev' | 'test' | 'prod'
  region: string
  lastUpdated: Date
  source: 'power_platform' | 'azure' | 'mcp' | 'coe_toolkit'
}

export interface KPI {
  id: string
  name: string
  description: string
  currentValue: number
  targetValue: number
  unit: string
  status: 'green' | 'yellow' | 'red'
  trend: number // percentage change
  dataPoints: { date: Date; value: number }[]
  category: 'governance' | 'adoption' | 'quality' | 'compliance'
}

export interface GovernanceAlert {
  id: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  title: string
  description: string
  source: string
  environment: string
  createdAt: Date
  resolvedAt?: Date
  actionRequired: boolean
  assignee?: string
}

export class OperationsManager {
  private metrics: Map<string, OperationalMetric> = new Map()
  private kpis: Map<string, KPI> = new Map()
  private alerts: GovernanceAlert[] = []

  constructor() {
    this.initializeDefaultMetrics()
    this.initializeKPIs()
    this.generateSampleAlerts()
  }

  /**
   * Initialize default operational metrics
   * Governance: Standard metrics for Power Platform operations
   */
  private initializeDefaultMetrics(): void {
    const defaultMetrics: OperationalMetric[] = [
      {
        id: 'app-performance',
        name: 'Average App Load Time',
        value: 2.3,
        target: 2.0,
        unit: 'seconds',
        trend: 'up',
        category: 'performance',
        environment: 'prod',
        region: 'global',
        lastUpdated: new Date(),
        source: 'power_platform'
      },
      {
        id: 'app-availability',
        name: 'App Availability',
        value: 99.8,
        target: 99.9,
        unit: '%',
        trend: 'stable',
        category: 'reliability',
        environment: 'prod',
        region: 'global',
        lastUpdated: new Date(),
        source: 'power_platform'
      },
      {
        id: 'security-incidents',
        name: 'Security Incidents',
        value: 2,
        target: 0,
        unit: 'count',
        trend: 'down',
        category: 'security',
        environment: 'tenant',
        region: 'global',
        lastUpdated: new Date(),
        source: 'azure'
      },
      {
        id: 'monthly-cost',
        name: 'Monthly Cloud Spend',
        value: 15420,
        target: 12000,
        unit: 'USD',
        trend: 'up',
        category: 'cost',
        environment: 'tenant',
        region: 'global',
        lastUpdated: new Date(),
        source: 'azure'
      },
      {
        id: 'active-users',
        name: 'Monthly Active Users',
        value: 1250,
        target: 1500,
        unit: 'users',
        trend: 'up',
        category: 'usage',
        environment: 'prod',
        region: 'global',
        lastUpdated: new Date(),
        source: 'coe_toolkit'
      },
      {
        id: 'dataverse-storage',
        name: 'Dataverse Storage Usage',
        value: 750,
        target: 1000,
        unit: 'GB',
        trend: 'up',
        category: 'usage',
        environment: 'tenant',
        region: 'global',
        lastUpdated: new Date(),
        source: 'power_platform'
      }
    ]

    defaultMetrics.forEach(metric => {
      this.metrics.set(metric.id, metric)
    })
  }

  /**
   * Initialize governance KPIs
   * Governance: Key performance indicators for executive reporting
   */
  private initializeKPIs(): void {
    const generateDataPoints = (baseValue: number, months: number = 12) => {
      const points = []
      for (let i = months; i >= 0; i--) {
        const date = new Date()
        date.setMonth(date.getMonth() - i)
        const variance = (Math.random() - 0.5) * 0.2 // ±10% variance
        points.push({
          date,
          value: Math.round(baseValue * (1 + variance))
        })
      }
      return points
    }

    const defaultKPIs: KPI[] = [
      {
        id: 'governance-score',
        name: 'Governance Compliance Score',
        description: 'Overall compliance with governance policies',
        currentValue: 87,
        targetValue: 90,
        unit: '%',
        status: 'yellow',
        trend: 2.3,
        dataPoints: generateDataPoints(87),
        category: 'governance'
      },
      {
        id: 'user-adoption',
        name: 'Power Platform Adoption Rate',
        description: 'Percentage of eligible users actively using Power Platform',
        currentValue: 68,
        targetValue: 80,
        unit: '%',
        status: 'yellow',
        trend: 5.2,
        dataPoints: generateDataPoints(68),
        category: 'adoption'
      },
      {
        id: 'solution-quality',
        name: 'Solution Quality Score',
        description: 'Average quality score of Power Platform solutions',
        currentValue: 4.2,
        targetValue: 4.5,
        unit: '/5',
        status: 'yellow',
        trend: 1.8,
        dataPoints: generateDataPoints(4.2),
        category: 'quality'
      },
      {
        id: 'policy-compliance',
        name: 'Policy Compliance Rate',
        description: 'Percentage of solutions compliant with organizational policies',
        currentValue: 92,
        targetValue: 95,
        unit: '%',
        status: 'green',
        trend: 3.1,
        dataPoints: generateDataPoints(92),
        category: 'compliance'
      }
    ]

    defaultKPIs.forEach(kpi => {
      this.kpis.set(kpi.id, kpi)
    })
  }

  /**
   * Generate sample governance alerts
   * Governance: Real-time monitoring and alerting
   */
  private generateSampleAlerts(): void {
    this.alerts = [
      {
        id: 'alert-1',
        severity: 'high',
        title: 'License Over-Allocation Detected',
        description: 'Power Platform Per User licenses are 105% allocated. Immediate action required.',
        source: 'License Management',
        environment: 'tenant',
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        actionRequired: true,
        assignee: 'IT Admin'
      },
      {
        id: 'alert-2',
        severity: 'medium',
        title: 'App Performance Degradation',
        description: 'Sales Dashboard app load time increased by 40% in the last 24 hours.',
        source: 'Application Monitoring',
        environment: 'prod',
        createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
        actionRequired: true
      },
      {
        id: 'alert-3',
        severity: 'low',
        title: 'Storage Usage Warning',
        description: 'Dataverse storage is at 75% capacity. Consider cleanup or expansion.',
        source: 'Storage Monitoring',
        environment: 'tenant',
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
        actionRequired: false
      }
    ]
  }

  /**
   * Get operational metrics with filtering
   * Governance: Environment and category-specific monitoring
   */
  getMetrics(filter?: {
    category?: OperationalMetric['category']
    environment?: OperationalMetric['environment']
    region?: string
  }): OperationalMetric[] {
    let metrics = Array.from(this.metrics.values())

    if (filter) {
      if (filter.category) {
        metrics = metrics.filter(m => m.category === filter.category)
      }
      if (filter.environment) {
        metrics = metrics.filter(m => m.environment === filter.environment)
      }
      if (filter.region) {
        metrics = metrics.filter(m => m.region === filter.region)
      }
    }

    return metrics
  }

  /**
   * Get governance KPIs
   * Governance: Executive dashboard metrics
   */
  getKPIs(category?: KPI['category']): KPI[] {
    let kpis = Array.from(this.kpis.values())

    if (category) {
      kpis = kpis.filter(kpi => kpi.category === category)
    }

    return kpis
  }

  /**
   * Get active governance alerts
   * Governance: Real-time issue monitoring
   */
  getAlerts(filter?: {
    severity?: GovernanceAlert['severity']
    environment?: string
    unresolved?: boolean
  }): GovernanceAlert[] {
    let alerts = [...this.alerts]

    if (filter) {
      if (filter.severity) {
        alerts = alerts.filter(a => a.severity === filter.severity)
      }
      if (filter.environment) {
        alerts = alerts.filter(a => a.environment === filter.environment)
      }
      if (filter.unresolved) {
        alerts = alerts.filter(a => !a.resolvedAt)
      }
    }

    return alerts.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  }

  /**
   * Update metric value
   * Governance: Real-time metric updates
   */
  updateMetric(metricId: string, newValue: number): boolean {
    const metric = this.metrics.get(metricId)
    if (!metric) return false

    const oldValue = metric.value
    metric.value = newValue
    metric.lastUpdated = new Date()

    // Determine trend
    if (newValue > oldValue * 1.05) {
      metric.trend = 'up'
    } else if (newValue < oldValue * 0.95) {
      metric.trend = 'down'
    } else {
      metric.trend = 'stable'
    }

    this.metrics.set(metricId, metric)
    
    // Governance audit log
    console.log(`[Governance] Metric updated: ${metric.name} ${oldValue} → ${newValue}`)
    
    return true
  }

  /**
   * Add new alert
   * Governance: Proactive issue detection
   */
  addAlert(alert: Omit<GovernanceAlert, 'id' | 'createdAt'>): string {
    const id = `alert-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`
    const newAlert: GovernanceAlert = {
      ...alert,
      id,
      createdAt: new Date()
    }

    this.alerts.unshift(newAlert)
    
    // Governance audit log
    console.log(`[Governance] New alert created: ${alert.title} (${alert.severity})`)
    
    return id
  }

  /**
   * Resolve alert
   * Governance: Issue resolution tracking
   */
  resolveAlert(alertId: string, resolver: string): boolean {
    const alertIndex = this.alerts.findIndex(a => a.id === alertId)
    if (alertIndex === -1) return false

    this.alerts[alertIndex].resolvedAt = new Date()
    
    // Governance audit log
    console.log(`[Governance] Alert resolved: ${alertId} by ${resolver}`)
    
    return true
  }

  /**
   * Calculate operations dashboard summary
   * Governance: Executive overview metrics
   */
  getDashboardSummary(): {
    healthScore: number
    totalAlerts: number
    criticalAlerts: number
    trendsPositive: number
    metricsAtTarget: number
    kpiSummary: {
      governance: number
      adoption: number
      quality: number
      compliance: number
    }
  } {
    const metrics = Array.from(this.metrics.values())
    const kpis = Array.from(this.kpis.values())
    const activeAlerts = this.getAlerts({ unresolved: true })

    // Calculate health score based on metrics meeting targets
    const metricsAtTarget = metrics.filter(m => 
      m.category === 'performance' ? m.value <= m.target : m.value >= m.target
    ).length
    const healthScore = Math.round((metricsAtTarget / metrics.length) * 100)

    // Count positive trends
    const trendsPositive = metrics.filter(m => m.trend === 'up').length

    // Critical alerts
    const criticalAlerts = activeAlerts.filter(a => a.severity === 'critical' || a.severity === 'high').length

    // KPI summary by category
    const kpiSummary = {
      governance: kpis.filter(k => k.category === 'governance')[0]?.currentValue || 0,
      adoption: kpis.filter(k => k.category === 'adoption')[0]?.currentValue || 0,
      quality: kpis.filter(k => k.category === 'quality')[0]?.currentValue || 0,
      compliance: kpis.filter(k => k.category === 'compliance')[0]?.currentValue || 0
    }

    return {
      healthScore,
      totalAlerts: activeAlerts.length,
      criticalAlerts,
      trendsPositive,
      metricsAtTarget,
      kpiSummary
    }
  }

  /**
   * Get chart data for KPI trending
   * Governance: Visual analytics for executive reporting
   */
  getKPIChartData(kpiId: string): { labels: string[]; data: number[] } | null {
    const kpi = this.kpis.get(kpiId)
    if (!kpi) return null

    const labels = kpi.dataPoints.map(point => 
      point.date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' })
    )
    const data = kpi.dataPoints.map(point => point.value)

    return { labels, data }
  }

  /**
   * Simulate real-time metric updates
   * Governance: Live dashboard updates
   */
  simulateRealTimeUpdates(): void {
    setInterval(() => {
      const metrics = Array.from(this.metrics.values())
      const randomMetric = metrics[Math.floor(Math.random() * metrics.length)]
      
      // Simulate small changes in metrics
      const variance = (Math.random() - 0.5) * 0.1 // ±5% variance
      const newValue = randomMetric.value * (1 + variance)
      
      this.updateMetric(randomMetric.id, Math.round(newValue * 100) / 100)
    }, 30000) // Update every 30 seconds
  }
}

// Singleton instance for global access
export const operationsManager = new OperationsManager()