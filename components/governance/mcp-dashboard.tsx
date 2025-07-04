'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import {
  Cloud,
  Shield,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  Server,
  DollarSign,
  TrendingUp,
  Database,
  Settings,
  ExternalLink,
  Zap,
  Activity,
  Lock
} from 'lucide-react'
import { mcpIntegration, type PowerPlatformAdminData, type AzureGovernanceData } from '@/lib/governance/mcp-integration'

/**
 * Microsoft Cloud Platform (MCP) Integration Dashboard
 * Displays real-time governance data from Power Platform Admin and Azure
 * Provides unified compliance monitoring and policy management
 */
export function MCPDashboard() {
  const [governanceData, setGovernanceData] = useState<any>(null)
  const [connectionStatus, setConnectionStatus] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date())

  useEffect(() => {
    loadGovernanceData()
    loadConnectionStatus()
  }, [])

  const loadGovernanceData = async () => {
    try {
      setIsLoading(true)
      const data = await mcpIntegration.getGovernanceStatus()
      setGovernanceData(data)
      setLastRefresh(new Date())
    } catch (error) {
      console.error('Failed to load governance data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const loadConnectionStatus = () => {
    const status = mcpIntegration.getConnectionStatus()
    setConnectionStatus(status)
  }

  const handleSyncNow = async () => {
    try {
      setIsLoading(true)
      await mcpIntegration.syncNow()
      await loadGovernanceData()
      loadConnectionStatus()
    } catch (error) {
      console.error('Sync failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const testConnections = async () => {
    try {
      const results = await mcpIntegration.testConnections()
      console.log('Connection test results:', results)
      loadConnectionStatus()
    } catch (error) {
      console.error('Connection test failed:', error)
    }
  }

  const getComplianceColor = (score: number) => {
    if (score >= 90) return 'text-green-600'
    if (score >= 75) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getComplianceBadge = (score: number) => {
    if (score >= 90) return 'default'
    if (score >= 75) return 'secondary'
    return 'destructive'
  }

  const getCostStatusColor = (status: string) => {
    switch (status) {
      case 'under_budget': return 'text-green-600'
      case 'at_budget': return 'text-yellow-600'
      case 'over_budget': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  const getCostStatusBadge = (status: string) => {
    switch (status) {
      case 'under_budget': return 'default'
      case 'at_budget': return 'secondary'
      case 'over_budget': return 'destructive'
      default: return 'outline'
    }
  }

  if (isLoading && !governanceData) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="flex items-center gap-2">
          <RefreshCw className="w-5 h-5 animate-spin" />
          <span>Loading governance data from Microsoft Cloud Platform...</span>
        </div>
      </div>
    )
  }

  if (!governanceData) {
    return (
      <div className="flex items-center justify-center p-8">
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Unable to load governance data. Please check your MCP connections.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  const { powerPlatform, azure, summary } = governanceData

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Microsoft Cloud Platform Integration</h2>
          <p className="text-muted-foreground">
            Real-time governance data from Power Platform Admin and Azure
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={testConnections}>
            <Activity className="w-4 h-4 mr-2" />
            Test Connections
          </Button>
          <Button variant="outline" size="sm" onClick={handleSyncNow} disabled={isLoading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Sync Now
          </Button>
        </div>
      </div>

      {/* Connection Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cloud className="w-5 h-5" />
            Service Connections
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {connectionStatus.map((connection, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h4 className="font-medium">{connection.service}</h4>
                  <p className="text-sm text-muted-foreground">{connection.region}</p>
                  <p className="text-xs text-muted-foreground">
                    Last sync: {connection.lastSync.toLocaleTimeString()}
                  </p>
                </div>
                <Badge variant={connection.status === 'connected' ? 'default' : 'destructive'}>
                  {connection.status === 'connected' ? (
                    <CheckCircle className="w-3 h-3 mr-1" />
                  ) : (
                    <AlertTriangle className="w-3 h-3 mr-1" />
                  )}
                  {connection.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Summary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Shield className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Overall Compliance</p>
                <p className={`text-2xl font-bold ${getComplianceColor(summary.overallCompliance)}`}>
                  {summary.overallCompliance}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <AlertTriangle className="h-8 w-8 text-red-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Critical Issues</p>
                <p className="text-2xl font-bold">{summary.criticalIssues}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Lock className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Policy Violations</p>
                <p className="text-2xl font-bold">{summary.totalPolicyViolations}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Zap className="h-8 w-8 text-amber-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Security Score</p>
                <p className="text-2xl font-bold">{summary.securityScore}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Cost Status</p>
                <p className={`text-sm font-bold capitalize ${getCostStatusColor(summary.costStatus)}`}>
                  {summary.costStatus.replace('_', ' ')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="powerplatform" className="space-y-4">
        <TabsList>
          <TabsTrigger value="powerplatform">Power Platform</TabsTrigger>
          <TabsTrigger value="azure">Azure Governance</TabsTrigger>
          <TabsTrigger value="policies">Policy Management</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
        </TabsList>

        <TabsContent value="powerplatform" className="space-y-4">
          {powerPlatform && (
            <>
              {/* Environments */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Server className="w-5 h-5" />
                    Power Platform Environments
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    {powerPlatform.environments.map(env => {
                      const utilizationPercent = (env.usedCapacityMB / env.capacityMB) * 100
                      return (
                        <div key={env.id} className="p-4 border rounded-lg">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h4 className="font-medium">{env.name}</h4>
                              <p className="text-sm text-muted-foreground">
                                {env.region} • Created by {env.createdBy}
                              </p>
                            </div>
                            <div className="flex gap-2">
                              <Badge variant="outline">{env.type}</Badge>
                              <Badge variant={env.state === 'Ready' ? 'default' : 'secondary'}>
                                {env.state}
                              </Badge>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Storage Utilization</span>
                              <span>{utilizationPercent.toFixed(1)}%</span>
                            </div>
                            <Progress value={utilizationPercent} className="h-2" />
                            <div className="flex justify-between text-xs text-muted-foreground">
                              <span>{(env.usedCapacityMB / 1024).toFixed(1)} GB used</span>
                              <span>{(env.capacityMB / 1024).toFixed(1)} GB total</span>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Compliance Status */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Power Platform Compliance
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-lg font-semibold">Compliance Score</h4>
                      <p className="text-sm text-muted-foreground">
                        Last assessment: {powerPlatform.compliance.lastAssessment.toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className={`text-3xl font-bold ${getComplianceColor(powerPlatform.compliance.score)}`}>
                        {powerPlatform.compliance.score}%
                      </p>
                      <Badge variant={getComplianceBadge(powerPlatform.compliance.score)}>
                        {powerPlatform.compliance.status}
                      </Badge>
                    </div>
                  </div>

                  {powerPlatform.compliance.issues.length > 0 && (
                    <div className="space-y-3">
                      <h5 className="font-medium">Compliance Issues</h5>
                      {powerPlatform.compliance.issues.map((issue, index) => (
                        <Alert key={index}>
                          <AlertTriangle className="h-4 w-4" />
                          <AlertDescription>
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <Badge variant={issue.severity === 'High' ? 'destructive' : 'secondary'}>
                                  {issue.severity}
                                </Badge>
                                <span className="font-medium">{issue.description}</span>
                              </div>
                              <p className="text-sm">{issue.recommendation}</p>
                            </div>
                          </AlertDescription>
                        </Alert>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        <TabsContent value="azure" className="space-y-4">
          {azure && (
            <>
              {/* Azure Security */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Azure Security Center
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-lg font-semibold">Secure Score</h4>
                      <p className="text-sm text-muted-foreground">
                        {azure.security.secureScore} out of {azure.security.maxScore} points
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-bold text-blue-600">
                        {Math.round((azure.security.secureScore / azure.security.maxScore) * 100)}%
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h5 className="font-medium">Security Recommendations</h5>
                    {azure.security.recommendations.filter(r => r.state === 'Active').map((rec, index) => (
                      <div key={index} className="p-3 border rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <h6 className="font-medium">{rec.displayName}</h6>
                            <p className="text-sm text-muted-foreground">{rec.category}</p>
                          </div>
                          <Badge variant={rec.severity === 'High' ? 'destructive' : 
                                        rec.severity === 'Medium' ? 'secondary' : 'default'}>
                            {rec.severity}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Azure Costs */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5" />
                    Cost Management
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 border rounded-lg">
                      <p className="text-sm text-muted-foreground">Current Spend</p>
                      <p className="text-2xl font-bold">${azure.costs.currentSpend.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">{azure.costs.billingPeriod}</p>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <p className="text-sm text-muted-foreground">Forecasted</p>
                      <p className="text-2xl font-bold text-orange-600">
                        ${azure.costs.forecastedSpend.toLocaleString()}
                      </p>
                      <p className="text-xs text-muted-foreground">End of month</p>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <p className="text-sm text-muted-foreground">Budget Limit</p>
                      <p className="text-2xl font-bold text-green-600">
                        ${azure.costs.budgetLimit.toLocaleString()}
                      </p>
                      <p className="text-xs text-muted-foreground">Monthly budget</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Budget Utilization</span>
                      <span>{((azure.costs.currentSpend / azure.costs.budgetLimit) * 100).toFixed(1)}%</span>
                    </div>
                    <Progress 
                      value={(azure.costs.currentSpend / azure.costs.budgetLimit) * 100} 
                      className="h-2" 
                    />
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        <TabsContent value="policies" className="space-y-4">
          {/* Power Platform Policies */}
          {powerPlatform && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Power Platform Policies
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {powerPlatform.policies.map(policy => (
                    <div key={policy.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{policy.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {policy.scope} • Last modified: {policy.lastModified.toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {policy.violations > 0 && (
                          <Badge variant="destructive">
                            {policy.violations} violations
                          </Badge>
                        )}
                        <Badge variant={policy.status === 'Enabled' ? 'default' : 'secondary'}>
                          {policy.status}
                        </Badge>
                        <Badge variant="outline">{policy.type}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Azure Policies */}
          {azure && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="w-5 h-5" />
                  Azure Policies
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {azure.policies.map(policy => (
                    <div key={policy.id} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{policy.name}</h4>
                        <div className="flex items-center gap-2">
                          <Badge variant={policy.compliance >= 95 ? 'default' : 
                                        policy.compliance >= 80 ? 'secondary' : 'destructive'}>
                            {policy.compliance}% compliant
                          </Badge>
                          {policy.violations.length > 0 && (
                            <Badge variant="destructive">
                              {policy.violations.length} violations
                            </Badge>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{policy.scope}</p>
                      
                      {policy.violations.length > 0 && (
                        <div className="space-y-1">
                          {policy.violations.slice(0, 3).map((violation, index) => (
                            <div key={index} className="text-xs p-2 bg-red-50 dark:bg-red-900/20 rounded">
                              <span className="font-medium">Non-compliant resource:</span> {violation.resourceId}
                            </div>
                          ))}
                          {policy.violations.length > 3 && (
                            <p className="text-xs text-muted-foreground">
                              +{policy.violations.length - 3} more violations
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="compliance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Unified Compliance Dashboard</CardTitle>
              <p className="text-sm text-muted-foreground">
                Cross-platform compliance monitoring and governance insights
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Power Platform Compliance */}
                <div className="space-y-3">
                  <h4 className="font-semibold">Power Platform</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Compliance Score</span>
                      <span className={getComplianceColor(powerPlatform?.compliance.score || 0)}>
                        {powerPlatform?.compliance.score || 0}%
                      </span>
                    </div>
                    <Progress value={powerPlatform?.compliance.score || 0} className="h-2" />
                  </div>
                  <div className="text-sm">
                    <p>Policy Violations: <span className="font-medium">{powerPlatform?.policies.reduce((sum, p) => sum + p.violations, 0) || 0}</span></p>
                    <p>Critical Issues: <span className="font-medium">{powerPlatform?.compliance.issues.filter(i => i.severity === 'High').length || 0}</span></p>
                  </div>
                </div>

                {/* Azure Compliance */}
                <div className="space-y-3">
                  <h4 className="font-semibold">Azure</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Security Score</span>
                      <span className="text-blue-600">{summary.securityScore}%</span>
                    </div>
                    <Progress value={summary.securityScore} className="h-2" />
                  </div>
                  <div className="text-sm">
                    <p>Policy Violations: <span className="font-medium">{azure?.policies.reduce((sum, p) => sum + p.violations.length, 0) || 0}</span></p>
                    <p>Active Recommendations: <span className="font-medium">{azure?.security.recommendations.filter(r => r.state === 'Active').length || 0}</span></p>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-semibold mb-3">Governance Summary</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-blue-600">{summary.overallCompliance}%</p>
                    <p className="text-sm text-muted-foreground">Overall Compliance</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-red-600">{summary.criticalIssues}</p>
                    <p className="text-sm text-muted-foreground">Critical Issues</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-orange-600">{summary.totalPolicyViolations}</p>
                    <p className="text-sm text-muted-foreground">Policy Violations</p>
                  </div>
                  <div>
                    <p className={`text-2xl font-bold ${getCostStatusColor(summary.costStatus)}`}>
                      {summary.costStatus === 'under_budget' ? '✓' : 
                       summary.costStatus === 'at_budget' ? '⚠' : '✗'}
                    </p>
                    <p className="text-sm text-muted-foreground">Cost Status</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Footer */}
      <div className="text-xs text-muted-foreground">
        Last synchronized: {lastRefresh.toLocaleString()} • 
        MCP integration provides real-time governance insights from Microsoft services
      </div>
    </div>
  )
}