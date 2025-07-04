'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import {
  Users,
  Zap,
  BarChart3,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Target,
  Award,
  Lightbulb,
  Activity,
  Code2,
  Workflow,
  UserCheck,
  Shield,
  DollarSign,
  Calendar,
  Gauge,
  BookOpen,
  Building
} from 'lucide-react'
import { coeIntegrationManager, type CoEApp, type CoEFlow, type CoEMaker } from '@/lib/governance/coe-integration'

/**
 * Center of Excellence (CoE) Dashboard Component
 * Displays comprehensive Power Platform governance analytics
 * Includes maker activity, app usage, and environment health monitoring
 */
export function CoEDashboard() {
  const [summary, setSummary] = useState<any>(null)
  const [apps, setApps] = useState<CoEApp[]>([])
  const [flows, setFlows] = useState<CoEFlow[]>([])
  const [makers, setMakers] = useState<CoEMaker[]>([])
  const [makerAnalytics, setMakerAnalytics] = useState<any>(null)
  const [appAnalytics, setAppAnalytics] = useState<any>(null)
  const [environmentHealth, setEnvironmentHealth] = useState<any[]>([])
  const [governanceMetrics, setGovernanceMetrics] = useState<any>(null)

  useEffect(() => {
    loadCoEData()
  }, [])

  const loadCoEData = () => {
    const summaryData = coeIntegrationManager.getCoEDashboardSummary()
    const appsData = coeIntegrationManager.getApps()
    const flowsData = coeIntegrationManager.getFlows()
    const makersData = coeIntegrationManager.getMakers()
    const makerAnalyticsData = coeIntegrationManager.getMakerAnalytics()
    const appAnalyticsData = coeIntegrationManager.getAppAnalytics()
    const environmentHealthData = coeIntegrationManager.getEnvironmentHealth()
    const governanceMetricsData = coeIntegrationManager.getGovernanceMetrics()

    setSummary(summaryData)
    setApps(appsData)
    setFlows(flowsData)
    setMakers(makersData)
    setMakerAnalytics(makerAnalyticsData)
    setAppAnalytics(appAnalyticsData)
    setEnvironmentHealth(environmentHealthData)
    setGovernanceMetrics(governanceMetricsData)
  }

  const getComplianceColor = (status: string) => {
    switch (status) {
      case 'Compliant': return 'text-green-600'
      case 'Warning': return 'text-yellow-600'
      case 'Violation': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  const getComplianceBadge = (status: string) => {
    switch (status) {
      case 'Compliant': return 'default'
      case 'Warning': return 'secondary'
      case 'Violation': return 'destructive'
      default: return 'outline'
    }
  }

  const getRiskColor = (score: number) => {
    if (score <= 30) return 'text-green-600'
    if (score <= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getSkillColor = (level: string) => {
    switch (level) {
      case 'Expert': return 'text-purple-600'
      case 'Advanced': return 'text-blue-600'
      case 'Intermediate': return 'text-green-600'
      case 'Beginner': return 'text-orange-600'
      default: return 'text-gray-600'
    }
  }

  const getHealthColor = (score: number) => {
    if (score >= 90) return 'text-green-600'
    if (score >= 75) return 'text-yellow-600'
    return 'text-red-600'
  }

  if (!summary) {
    return <div className="flex items-center justify-center p-8">Loading CoE analytics...</div>
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Center of Excellence Analytics</h2>
          <p className="text-muted-foreground">
            Comprehensive Power Platform governance and adoption insights
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={loadCoEData}>
            <Activity className="w-4 h-4 mr-2" />
            Refresh Data
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Active Makers</p>
                <p className="text-2xl font-bold">{summary.adoption.activeMakers}</p>
                <p className="text-xs text-muted-foreground">
                  {summary.adoption.adoptionRate}% adoption rate
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Code2 className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Total Assets</p>
                <p className="text-2xl font-bold">{summary.assets.totalApps + summary.assets.totalFlows}</p>
                <p className="text-xs text-muted-foreground">
                  {summary.assets.totalApps} apps, {summary.assets.totalFlows} flows
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Gauge className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Health Score</p>
                <p className={`text-2xl font-bold ${getHealthColor(summary.health.avgEnvironmentHealth)}`}>
                  {summary.health.avgEnvironmentHealth}%
                </p>
                <p className="text-xs text-muted-foreground">
                  {summary.health.criticalIssues} critical issues
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-amber-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Business Value</p>
                <p className="text-2xl font-bold">${(summary.productivity.businessValue / 1000).toFixed(0)}k</p>
                <p className="text-xs text-muted-foreground">
                  ${(summary.productivity.costSavings / 1000).toFixed(0)}k cost savings
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts */}
      {summary.health.criticalIssues > 0 && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>{summary.health.criticalIssues} critical issue(s)</strong> detected across environments. 
            Review environment health for immediate action items.
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="makers">Citizen Developers</TabsTrigger>
          <TabsTrigger value="apps">Applications</TabsTrigger>
          <TabsTrigger value="flows">Flows</TabsTrigger>
          <TabsTrigger value="health">Environment Health</TabsTrigger>
          <TabsTrigger value="governance">Governance Metrics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* Adoption Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Adoption Trends
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Total Makers</span>
                  <span className="font-bold">{summary.adoption.totalMakers}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Active This Month</span>
                  <span className="font-bold">{summary.adoption.activeMakers}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>New This Month</span>
                  <span className="font-bold text-green-600">+{summary.adoption.newMakersThisMonth}</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Adoption Rate</span>
                    <span>{summary.adoption.adoptionRate}%</span>
                  </div>
                  <Progress value={summary.adoption.adoptionRate} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Asset Distribution
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Code2 className="w-4 h-4 text-blue-600" />
                      <span>Applications</span>
                    </div>
                    <span className="font-bold">{summary.assets.totalApps}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Workflow className="w-4 h-4 text-green-600" />
                      <span>Flows</span>
                    </div>
                    <span className="font-bold">{summary.assets.totalFlows}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Activity className="w-4 h-4 text-purple-600" />
                      <span>Active Assets</span>
                    </div>
                    <span className="font-bold">{summary.assets.activeAssets}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-red-600" />
                      <span>Risk Assets</span>
                    </div>
                    <span className="font-bold text-red-600">{summary.assets.riskAssets}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Department Adoption */}
          {makerAnalytics && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="w-5 h-5" />
                  Department Adoption
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.entries(makerAnalytics.departmentActivity).slice(0, 8).map(([dept, activity]) => (
                    <div key={dept} className="text-center p-3 border rounded">
                      <h4 className="font-medium text-sm">{dept}</h4>
                      <p className="text-2xl font-bold text-blue-600">{activity}</p>
                      <p className="text-xs text-muted-foreground">Total Assets</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6 text-center">
                <Clock className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Avg Deploy Time</p>
                <p className="text-2xl font-bold">{summary.productivity.avgTimeToDeployment} days</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <Target className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Maker Productivity</p>
                <p className="text-2xl font-bold">{summary.productivity.makerProductivity}</p>
                <p className="text-xs text-muted-foreground">apps per maker</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <Shield className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Compliance Score</p>
                <p className={`text-2xl font-bold ${getComplianceColor(summary.health.complianceScore >= 90 ? 'Compliant' : 'Warning')}`}>
                  {summary.health.complianceScore}%
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <Lightbulb className="w-8 w-8 text-purple-600 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Recommendations</p>
                <p className="text-2xl font-bold">{summary.health.totalRecommendations}</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="makers" className="space-y-4">
          {makerAnalytics && (
            <>
              {/* Maker Overview */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Skill Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {Object.entries(makerAnalytics.skillDistribution).map(([skill, count]) => (
                        <div key={skill} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full ${
                              skill === 'Expert' ? 'bg-purple-500' :
                              skill === 'Advanced' ? 'bg-blue-500' :
                              skill === 'Intermediate' ? 'bg-green-500' : 'bg-orange-500'
                            }`} />
                            <span className="text-sm">{skill}</span>
                          </div>
                          <Badge variant="outline">{count}</Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Support & Risk</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Needing Support</span>
                      <Badge variant="secondary">{makerAnalytics.needingSupportCount}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">High Risk Makers</span>
                      <Badge variant="destructive">{makerAnalytics.riskMakers.length}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Policy Violations</span>
                      <Badge variant="destructive">{makerAnalytics.violationsCount}</Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Top Certifications</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {Object.entries(makerAnalytics.certificationStats).slice(0, 3).map(([cert, count]) => (
                        <div key={cert} className="text-sm">
                          <div className="flex justify-between mb-1">
                            <span className="truncate">{cert.replace('PL-', 'PL-')}</span>
                            <span className="font-medium">{count}</span>
                          </div>
                          <Progress value={(count / makers.length) * 100} className="h-1" />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Top Makers */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="w-5 h-5" />
                    Top Citizen Developers
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {makerAnalytics.topMakers.slice(0, 5).map((item: any, index: number) => (
                      <div key={item.maker.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                            index === 0 ? 'bg-yellow-500' :
                            index === 1 ? 'bg-gray-400' :
                            index === 2 ? 'bg-amber-600' : 'bg-blue-500'
                          }`}>
                            {index + 1}
                          </div>
                          <div>
                            <h4 className="font-medium">{item.maker.displayName}</h4>
                            <p className="text-sm text-muted-foreground">
                              {item.maker.department} • {item.maker.jobTitle}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex gap-2">
                            <Badge variant="outline">{item.maker.totalApps} apps</Badge>
                            <Badge variant="outline">{item.maker.totalFlows} flows</Badge>
                          </div>
                          <div className="mt-1">
                            <Badge variant={
                              item.maker.skillLevel === 'Expert' ? 'default' :
                              item.maker.skillLevel === 'Advanced' ? 'secondary' : 'outline'
                            }>
                              {item.maker.skillLevel}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Makers Needing Support */}
              {makerAnalytics.needingSupportCount > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <UserCheck className="w-5 h-5" />
                      Makers Needing Support
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {makers.filter(m => m.needsSupport).map(maker => (
                        <div key={maker.id} className="flex items-center justify-between p-3 border rounded-lg bg-yellow-50">
                          <div>
                            <h4 className="font-medium">{maker.displayName}</h4>
                            <p className="text-sm text-muted-foreground">
                              {maker.department} • Risk Score: {maker.riskScore}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Badge variant="outline">{maker.skillLevel}</Badge>
                            {maker.violations.length > 0 && (
                              <Badge variant="destructive">{maker.violations.length} violations</Badge>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </TabsContent>

        <TabsContent value="apps" className="space-y-4">
          {appAnalytics && (
            <>
              {/* App Overview */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-6 text-center">
                    <Code2 className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Total Apps</p>
                    <p className="text-2xl font-bold">{apps.length}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6 text-center">
                    <Activity className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Active Apps</p>
                    <p className="text-2xl font-bold">{apps.filter(a => a.status === 'Published').length}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6 text-center">
                    <AlertTriangle className="w-8 h-8 text-red-600 mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Risk Apps</p>
                    <p className="text-2xl font-bold">{appAnalytics.riskApps.length}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6 text-center">
                    <Clock className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Orphaned</p>
                    <p className="text-2xl font-bold">{appAnalytics.orphanedApps.length}</p>
                  </CardContent>
                </Card>
              </div>

              {/* Most Used Apps */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Most Used Applications
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {appAnalytics.mostUsedApps.slice(0, 5).map((app: CoEApp, index: number) => (
                      <div key={app.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                            app.type === 'Canvas' ? 'bg-blue-100 text-blue-600' :
                            app.type === 'Model-driven' ? 'bg-green-100 text-green-600' :
                            'bg-purple-100 text-purple-600'
                          }`}>
                            <Code2 className="w-4 h-4" />
                          </div>
                          <div>
                            <h4 className="font-medium">{app.displayName}</h4>
                            <p className="text-sm text-muted-foreground">
                              {app.owner.displayName} • {app.environment}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex gap-2">
                            <Badge variant="outline">{app.uniqueUsers} users</Badge>
                            <Badge variant="outline">{app.totalSessions} sessions</Badge>
                          </div>
                          <div className="mt-1">
                            <Badge variant={getComplianceBadge(app.complianceStatus)}>
                              {app.complianceStatus}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* App Distribution Charts */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Compliance Status</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {Object.entries(appAnalytics.complianceBreakdown).map(([status, count]) => (
                        <div key={status} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full ${
                              status === 'Compliant' ? 'bg-green-500' :
                              status === 'Warning' ? 'bg-yellow-500' : 'bg-red-500'
                            }`} />
                            <span className="text-sm">{status}</span>
                          </div>
                          <Badge variant="outline">{count}</Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Complexity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {Object.entries(appAnalytics.complexityDistribution).map(([complexity, count]) => (
                        <div key={complexity} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full ${
                              complexity === 'High' ? 'bg-red-500' :
                              complexity === 'Medium' ? 'bg-yellow-500' : 'bg-green-500'
                            }`} />
                            <span className="text-sm">{complexity}</span>
                          </div>
                          <Badge variant="outline">{count}</Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Lifecycle Stage</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {Object.entries(appAnalytics.lifecycleDistribution).map(([stage, count]) => (
                        <div key={stage} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full ${
                              stage === 'Production' ? 'bg-blue-500' :
                              stage === 'Testing' ? 'bg-green-500' :
                              stage === 'Development' ? 'bg-yellow-500' : 'bg-gray-500'
                            }`} />
                            <span className="text-sm">{stage}</span>
                          </div>
                          <Badge variant="outline">{count}</Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </TabsContent>

        <TabsContent value="flows" className="space-y-4">
          {/* Flow Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6 text-center">
                <Workflow className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Total Flows</p>
                <p className="text-2xl font-bold">{flows.length}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <Activity className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Active Flows</p>
                <p className="text-2xl font-bold">{flows.filter(f => f.status === 'Started').length}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <AlertTriangle className="w-8 h-8 text-red-600 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">High Error Rate</p>
                <p className="text-2xl font-bold">{flows.filter(f => f.errorRate > 10).length}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <Target className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Avg Success Rate</p>
                <p className="text-2xl font-bold">
                  {flows.length > 0 ? Math.round(flows.reduce((sum, f) => sum + ((f.successfulRuns / f.totalRuns) * 100), 0) / flows.length) : 0}%
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Flow Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Workflow className="w-5 h-5" />
                Power Automate Flows
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {flows.map(flow => (
                  <div key={flow.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        flow.status === 'Started' ? 'bg-green-100 text-green-600' :
                        flow.status === 'Suspended' ? 'bg-yellow-100 text-yellow-600' :
                        'bg-red-100 text-red-600'
                      }`}>
                        <Workflow className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="font-medium">{flow.displayName}</h4>
                        <p className="text-sm text-muted-foreground">
                          {flow.owner.displayName} • {flow.type} • {flow.runFrequency}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex gap-2">
                        <Badge variant="outline">{flow.totalRuns} runs</Badge>
                        <Badge variant={flow.errorRate > 10 ? 'destructive' : flow.errorRate > 5 ? 'secondary' : 'default'}>
                          {flow.errorRate.toFixed(1)}% errors
                        </Badge>
                      </div>
                      <div className="mt-1">
                        <Badge variant={flow.businessCriticality === 'Critical' ? 'destructive' : 
                                      flow.businessCriticality === 'High' ? 'secondary' : 'outline'}>
                          {flow.businessCriticality}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="health" className="space-y-4">
          {environmentHealth.map(health => (
            <Card key={health.environmentId}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Gauge className="w-5 h-5" />
                    {health.environmentName} Environment
                  </CardTitle>
                  <Badge variant={health.healthScore >= 90 ? 'default' : 
                                health.healthScore >= 75 ? 'secondary' : 'destructive'}>
                    {health.healthScore}% Health Score
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Metrics */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-3 border rounded">
                    <p className="text-sm text-muted-foreground">Active Apps</p>
                    <p className="text-lg font-bold">{health.metrics.activeApps}/{health.metrics.totalApps}</p>
                  </div>
                  <div className="text-center p-3 border rounded">
                    <p className="text-sm text-muted-foreground">Active Flows</p>
                    <p className="text-lg font-bold">{health.metrics.activeFlows}/{health.metrics.totalFlows}</p>
                  </div>
                  <div className="text-center p-3 border rounded">
                    <p className="text-sm text-muted-foreground">Storage Used</p>
                    <p className="text-lg font-bold">{((health.metrics.storageUsage / health.metrics.storageLimit) * 100).toFixed(0)}%</p>
                  </div>
                  <div className="text-center p-3 border rounded">
                    <p className="text-sm text-muted-foreground">API Usage</p>
                    <p className="text-lg font-bold">{((health.metrics.apiCalls / health.metrics.apiLimit) * 100).toFixed(0)}%</p>
                  </div>
                </div>

                {/* Issues */}
                {health.issues.length > 0 && (
                  <div>
                    <h5 className="font-medium mb-3">Issues Detected</h5>
                    <div className="space-y-2">
                      {health.issues.map((issue, index) => (
                        <Alert key={index}>
                          <AlertTriangle className="h-4 w-4" />
                          <AlertDescription>
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <Badge variant={issue.severity === 'Critical' || issue.severity === 'High' ? 'destructive' : 'secondary'}>
                                  {issue.severity}
                                </Badge>
                                <span className="font-medium">{issue.title}</span>
                              </div>
                              <p className="text-sm">{issue.description}</p>
                              <p className="text-sm font-medium">Recommendation: {issue.recommendation}</p>
                            </div>
                          </AlertDescription>
                        </Alert>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recommendations */}
                {health.recommendations.length > 0 && (
                  <div>
                    <h5 className="font-medium mb-3">Optimization Recommendations</h5>
                    <div className="space-y-3">
                      {health.recommendations.map((rec, index) => (
                        <div key={index} className="p-3 border rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <h6 className="font-medium">{rec.title}</h6>
                            <div className="flex gap-2">
                              <Badge variant={rec.priority === 'High' ? 'destructive' : 
                                            rec.priority === 'Medium' ? 'secondary' : 'outline'}>
                                {rec.priority}
                              </Badge>
                              <Badge variant="outline">{rec.category}</Badge>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{rec.description}</p>
                          <div className="grid grid-cols-2 gap-4 text-xs">
                            <div>
                              <span className="font-medium">Effort:</span> {rec.estimatedEffort}
                            </div>
                            <div>
                              <span className="font-medium">Benefit:</span> {rec.expectedBenefit}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="governance" className="space-y-4">
          {governanceMetrics && (
            <>
              {/* Governance Summary */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-6 text-center">
                    <Shield className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Compliance Score</p>
                    <p className={`text-2xl font-bold ${getComplianceColor(governanceMetrics.governance.complianceScore >= 90 ? 'Compliant' : 'Warning')}`}>
                      {governanceMetrics.governance.complianceScore}%
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6 text-center">
                    <CheckCircle className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Business Justified</p>
                    <p className="text-2xl font-bold">{governanceMetrics.governance.appsWithBusinessJustification}</p>
                    <p className="text-xs text-muted-foreground">out of {governanceMetrics.usage.totalApps} apps</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6 text-center">
                    <AlertTriangle className="w-8 h-8 text-red-600 mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Policy Violations</p>
                    <p className="text-2xl font-bold">{governanceMetrics.governance.policyViolations}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6 text-center">
                    <Clock className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Orphaned Resources</p>
                    <p className="text-2xl font-bold">{governanceMetrics.governance.orphanedResources}</p>
                  </CardContent>
                </Card>
              </div>

              {/* Productivity Metrics */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Productivity & Business Value
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="text-center">
                      <h4 className="text-lg font-semibold">Business Value Generated</h4>
                      <p className="text-3xl font-bold text-green-600">
                        ${(governanceMetrics.productivity.businessValueGenerated / 1000).toFixed(0)}k
                      </p>
                      <p className="text-sm text-muted-foreground">This period</p>
                    </div>
                    <div className="text-center">
                      <h4 className="text-lg font-semibold">Cost Savings</h4>
                      <p className="text-3xl font-bold text-blue-600">
                        ${(governanceMetrics.productivity.costSavings / 1000).toFixed(0)}k
                      </p>
                      <p className="text-sm text-muted-foreground">Estimated annual</p>
                    </div>
                    <div className="text-center">
                      <h4 className="text-lg font-semibold">Time to Deployment</h4>
                      <p className="text-3xl font-bold text-purple-600">
                        {governanceMetrics.productivity.timeToDeployment}
                      </p>
                      <p className="text-sm text-muted-foreground">Average days</p>
                    </div>
                    <div className="text-center">
                      <h4 className="text-lg font-semibold">Maker Productivity</h4>
                      <p className="text-3xl font-bold text-amber-600">
                        {governanceMetrics.productivity.makerProductivity}
                      </p>
                      <p className="text-sm text-muted-foreground">Apps per maker</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quality Metrics */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    Quality & Risk Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span>Average App Complexity</span>
                        <span className="font-bold">{governanceMetrics.quality.avgAppComplexity}/3</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Average Risk Score</span>
                        <span className={`font-bold ${getRiskColor(governanceMetrics.quality.avgRiskScore)}`}>
                          {governanceMetrics.quality.avgRiskScore.toFixed(1)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Apps Needing Review</span>
                        <span className="font-bold">{governanceMetrics.quality.appsNeedingReview}</span>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span>Flows with Errors</span>
                        <span className="font-bold">{governanceMetrics.quality.flowsWithErrors}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Average Flow Error Rate</span>
                        <span className={`font-bold ${governanceMetrics.quality.avgFlowErrorRate > 5 ? 'text-red-600' : 'text-green-600'}`}>
                          {governanceMetrics.quality.avgFlowErrorRate.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}