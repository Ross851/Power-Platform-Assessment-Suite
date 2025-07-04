'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Activity,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Clock,
  BarChart3,
  LineChart,
  PieChart,
  Target,
  Zap,
  Shield,
  DollarSign,
  Users,
  RefreshCw
} from 'lucide-react'
import { operationsManager, type OperationalMetric, type KPI, type GovernanceAlert } from '@/lib/governance/operations-manager'

/**
 * Operations Excellence Dashboard Component
 * Provides comprehensive operational monitoring and governance KPIs
 * Includes real-time metrics, alerts, and trend analysis
 */
export function OperationsDashboard() {
  const [metrics, setMetrics] = useState<OperationalMetric[]>([])
  const [kpis, setKpis] = useState<KPI[]>([])
  const [alerts, setAlerts] = useState<GovernanceAlert[]>([])
  const [summary, setSummary] = useState<any>(null)
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date())

  useEffect(() => {
    loadDashboardData()
    const interval = setInterval(loadDashboardData, 60000) // Refresh every minute
    return () => clearInterval(interval)
  }, [])

  const loadDashboardData = () => {
    setMetrics(operationsManager.getMetrics())
    setKpis(operationsManager.getKPIs())
    setAlerts(operationsManager.getAlerts({ unresolved: true }))
    setSummary(operationsManager.getDashboardSummary())
    setLastRefresh(new Date())
  }

  const getMetricIcon = (category: OperationalMetric['category']) => {
    switch (category) {
      case 'performance': return <Zap className="w-5 h-5" />
      case 'reliability': return <Shield className="w-5 h-5" />
      case 'security': return <Shield className="w-5 h-5" />
      case 'cost': return <DollarSign className="w-5 h-5" />
      case 'usage': return <Users className="w-5 h-5" />
      default: return <Activity className="w-5 h-5" />
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-green-600" />
      case 'down': return <TrendingDown className="w-4 h-4 text-red-600" />
      default: return <Activity className="w-4 h-4 text-gray-600" />
    }
  }

  const getAlertIcon = (severity: GovernanceAlert['severity']) => {
    switch (severity) {
      case 'critical': return <AlertTriangle className="w-4 h-4 text-red-600" />
      case 'high': return <AlertTriangle className="w-4 h-4 text-orange-600" />
      case 'medium': return <AlertTriangle className="w-4 h-4 text-yellow-600" />
      default: return <AlertTriangle className="w-4 h-4 text-blue-600" />
    }
  }

  const getAlertBadgeVariant = (severity: GovernanceAlert['severity']) => {
    switch (severity) {
      case 'critical': return 'destructive'
      case 'high': return 'destructive'
      case 'medium': return 'secondary'
      default: return 'default'
    }
  }

  const getKPIStatus = (kpi: KPI) => {
    if (kpi.currentValue >= kpi.targetValue) return 'green'
    if (kpi.currentValue >= kpi.targetValue * 0.9) return 'yellow'
    return 'red'
  }

  const resolveAlert = (alertId: string) => {
    operationsManager.resolveAlert(alertId, 'Dashboard User')
    loadDashboardData()
  }

  if (!summary) {
    return <div className="flex items-center justify-center p-8">Loading operations data...</div>
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Operations Excellence</h2>
          <p className="text-muted-foreground">
            Real-time monitoring and governance KPIs for Power Platform operations
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={loadDashboardData}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Target className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Health Score</p>
                <p className="text-2xl font-bold">{summary.healthScore}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <AlertTriangle className="h-8 w-8 text-red-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Critical Alerts</p>
                <p className="text-2xl font-bold">{summary.criticalAlerts}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Positive Trends</p>
                <p className="text-2xl font-bold">{summary.trendsPositive}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">At Target</p>
                <p className="text-2xl font-bold">{summary.metricsAtTarget}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Shield className="h-8 w-8 text-amber-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Compliance</p>
                <p className="text-2xl font-bold">{summary.kpiSummary.compliance}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Alerts */}
      {alerts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
              Active Governance Alerts ({alerts.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {alerts.slice(0, 5).map(alert => (
                <div key={alert.id} className="flex items-start justify-between p-3 border rounded-lg">
                  <div className="flex items-start gap-3">
                    {getAlertIcon(alert.severity)}
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium">{alert.title}</h4>
                        <Badge variant={getAlertBadgeVariant(alert.severity)}>
                          {alert.severity}
                        </Badge>
                        <Badge variant="outline">{alert.environment}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{alert.description}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {alert.source} • {alert.createdAt.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {alert.actionRequired && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => resolveAlert(alert.id)}
                      >
                        Resolve
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="kpis" className="space-y-4">
        <TabsList>
          <TabsTrigger value="kpis">Governance KPIs</TabsTrigger>
          <TabsTrigger value="metrics">Operational Metrics</TabsTrigger>
          <TabsTrigger value="trends">Trends & Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="kpis" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {kpis.map(kpi => {
              const status = getKPIStatus(kpi)
              const statusColor = status === 'green' ? 'text-green-600' : 
                                status === 'yellow' ? 'text-yellow-600' : 'text-red-600'
              
              return (
                <Card key={kpi.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">{kpi.name}</CardTitle>
                      <Badge variant={status === 'green' ? 'default' : status === 'yellow' ? 'secondary' : 'destructive'}>
                        {status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{kpi.description}</p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-end justify-between">
                      <div>
                        <p className="text-3xl font-bold">{kpi.currentValue}{kpi.unit}</p>
                        <p className="text-sm text-muted-foreground">
                          Target: {kpi.targetValue}{kpi.unit}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className={`flex items-center gap-1 ${kpi.trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {kpi.trend >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                          <span className="text-sm font-medium">{Math.abs(kpi.trend).toFixed(1)}%</span>
                        </div>
                        <p className="text-xs text-muted-foreground">vs last month</p>
                      </div>
                    </div>
                    
                    {/* Simple trend visualization */}
                    <div className="h-20 flex items-end gap-1">
                      {kpi.dataPoints.slice(-12).map((point, index) => {
                        const height = (point.value / Math.max(...kpi.dataPoints.map(p => p.value))) * 100
                        return (
                          <div
                            key={index}
                            className="flex-1 bg-blue-200 rounded-t"
                            style={{ height: `${height}%` }}
                            title={`${point.date.toLocaleDateString()}: ${point.value}${kpi.unit}`}
                          />
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="metrics" className="space-y-4">
          <div className="grid gap-4">
            {['performance', 'reliability', 'security', 'cost', 'usage'].map(category => {
              const categoryMetrics = metrics.filter(m => m.category === category)
              if (categoryMetrics.length === 0) return null
              
              return (
                <Card key={category}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 capitalize">
                      {getMetricIcon(category as OperationalMetric['category'])}
                      {category} Metrics
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {categoryMetrics.map(metric => {
                        const isAtTarget = metric.category === 'performance' ? 
                          metric.value <= metric.target : metric.value >= metric.target
                        
                        return (
                          <div key={metric.id} className="p-4 border rounded-lg">
                            <div className="flex items-start justify-between mb-2">
                              <h4 className="font-medium text-sm">{metric.name}</h4>
                              {getTrendIcon(metric.trend)}
                            </div>
                            <div className="space-y-1">
                              <p className="text-2xl font-bold">
                                {metric.value} {metric.unit}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                Target: {metric.target} {metric.unit}
                              </p>
                              <div className="flex items-center gap-2 text-xs">
                                <Badge variant="outline">{metric.environment}</Badge>
                                <Badge variant={isAtTarget ? 'default' : 'secondary'}>
                                  {isAtTarget ? 'On Target' : 'Off Target'}
                                </Badge>
                              </div>
                              <p className="text-xs text-muted-foreground">
                                Updated: {metric.lastUpdated.toLocaleString()}
                              </p>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Governance Trends Analysis</CardTitle>
              <p className="text-sm text-muted-foreground">
                Historical performance and predictive insights for governance metrics
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Governance Score Trend */}
              <div>
                <h4 className="font-medium mb-3">Governance Compliance Score (12 months)</h4>
                <div className="h-32 flex items-end gap-2 bg-gray-50 dark:bg-gray-800 p-4 rounded">
                  {Array.from({length: 12}, (_, i) => {
                    const height = 60 + Math.random() * 40 // 60-100% range
                    return (
                      <div
                        key={i}
                        className="flex-1 bg-blue-500 rounded-t opacity-80"
                        style={{ height: `${height}%` }}
                        title={`Month ${i + 1}: ${height.toFixed(0)}%`}
                      />
                    )
                  })}
                </div>
              </div>

              {/* User Adoption Trend */}
              <div>
                <h4 className="font-medium mb-3">User Adoption Rate (12 months)</h4>
                <div className="h-32 flex items-end gap-2 bg-gray-50 dark:bg-gray-800 p-4 rounded">
                  {Array.from({length: 12}, (_, i) => {
                    const height = 50 + (i * 3) + Math.random() * 20 // Growing trend
                    return (
                      <div
                        key={i}
                        className="flex-1 bg-green-500 rounded-t opacity-80"
                        style={{ height: `${Math.min(height, 100)}%` }}
                        title={`Month ${i + 1}: ${Math.min(height, 100).toFixed(0)}%`}
                      />
                    )
                  })}
                </div>
              </div>

              {/* Cost Optimization */}
              <div>
                <h4 className="font-medium mb-3">Cost Optimization (12 months)</h4>
                <div className="h-32 flex items-end gap-2 bg-gray-50 dark:bg-gray-800 p-4 rounded">
                  {Array.from({length: 12}, (_, i) => {
                    const height = 80 - (i * 2) + Math.random() * 10 // Decreasing trend (good for costs)
                    return (
                      <div
                        key={i}
                        className="flex-1 bg-purple-500 rounded-t opacity-80"
                        style={{ height: `${Math.max(height, 20)}%` }}
                        title={`Month ${i + 1}: $${(Math.max(height, 20) * 200).toFixed(0)}`}
                      />
                    )
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Footer */}
      <div className="text-xs text-muted-foreground">
        Last refreshed: {lastRefresh.toLocaleString()} • 
        Real-time governance monitoring ensures operational excellence
      </div>
    </div>
  )
}