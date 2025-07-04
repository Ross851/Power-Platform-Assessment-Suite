'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Progress } from '@/components/ui/progress'
import {
  Building2,
  Server,
  Shield,
  AlertTriangle,
  CheckCircle,
  Settings,
  Lock,
  DollarSign,
  Database,
  Users,
  Target,
  TrendingUp,
  FileText,
  Layers,
  GitBranch,
  Clock,
  Activity
} from 'lucide-react'
import { governanceControlsManager, type GovernanceControl, type EnvironmentContext } from '@/lib/governance/governance-controls'

/**
 * Governance Dashboard Component
 * Provides comprehensive view of tenant vs environment level controls
 * Shows policy inheritance, conflicts, and compliance status
 */
export function GovernanceDashboard() {
  const [selectedEnvironment, setSelectedEnvironment] = useState<string>('all')
  const [environments, setEnvironments] = useState<EnvironmentContext[]>([])
  const [tenantControls, setTenantControls] = useState<GovernanceControl[]>([])
  const [effectiveControls, setEffectiveControls] = useState<GovernanceControl[]>([])
  const [complianceData, setComplianceData] = useState<any>(null)
  const [summary, setSummary] = useState<any>(null)

  useEffect(() => {
    loadGovernanceData()
  }, [selectedEnvironment])

  const loadGovernanceData = () => {
    const envs = governanceControlsManager.getEnvironments()
    const tenantCtrls = governanceControlsManager.getTenantControls()
    const compliance = governanceControlsManager.validateGovernanceCompliance()
    const summaryData = governanceControlsManager.getGovernanceSummary()

    setEnvironments(envs)
    setTenantControls(tenantCtrls)
    setComplianceData(compliance)
    setSummary(summaryData)

    if (selectedEnvironment !== 'all' && selectedEnvironment !== 'tenant') {
      const effectiveCtrls = governanceControlsManager.getEffectiveControls(selectedEnvironment)
      setEffectiveControls(effectiveCtrls)
    } else {
      setEffectiveControls([])
    }
  }

  const getControlIcon = (type: GovernanceControl['type']) => {
    switch (type) {
      case 'security': return <Shield className="w-4 h-4" />
      case 'policy': return <FileText className="w-4 h-4" />
      case 'compliance': return <CheckCircle className="w-4 h-4" />
      case 'cost': return <DollarSign className="w-4 h-4" />
      case 'data': return <Database className="w-4 h-4" />
      default: return <Settings className="w-4 h-4" />
    }
  }

  const getControlBadgeVariant = (control: GovernanceControl) => {
    if (control.priority === 'critical') return 'destructive'
    if (control.status === 'disabled') return 'secondary'
    if (control.level === 'tenant') return 'default'
    return 'outline'
  }

  const getEnvironmentBadgeVariant = (type: string) => {
    switch (type) {
      case 'prod': return 'destructive'
      case 'test': return 'secondary'
      case 'dev': return 'default'
      case 'sandbox': return 'outline'
      default: return 'outline'
    }
  }

  const getComplianceColor = (score: number) => {
    if (score >= 90) return 'text-green-600'
    if (score >= 75) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-600'
      case 'high': return 'text-orange-600'
      case 'medium': return 'text-yellow-600'
      case 'low': return 'text-blue-600'
      default: return 'text-gray-600'
    }
  }

  if (!summary || !complianceData) {
    return <div className="flex items-center justify-center p-8">Loading governance data...</div>
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Governance Controls</h2>
          <p className="text-muted-foreground">
            Manage tenant and environment-level governance policies with inheritance
          </p>
        </div>
        <div className="flex gap-2">
          <Select value={selectedEnvironment} onValueChange={setSelectedEnvironment}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select scope" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Scopes</SelectItem>
              <SelectItem value="tenant">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4" />
                  Tenant Level
                </div>
              </SelectItem>
              {environments.map(env => (
                <SelectItem key={env.id} value={env.id}>
                  <div className="flex items-center gap-2">
                    <Server className="w-4 h-4" />
                    {env.name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Building2 className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Tenant Controls</p>
                <p className="text-2xl font-bold">{summary.tenantControls}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Server className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Env Controls</p>
                <p className="text-2xl font-bold">{summary.environmentControls}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Layers className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Environments</p>
                <p className="text-2xl font-bold">{summary.totalEnvironments}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Target className="h-8 w-8 text-amber-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Compliance</p>
                <p className={`text-2xl font-bold ${getComplianceColor(summary.complianceScore)}`}>
                  {summary.complianceScore}%
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
                <p className="text-2xl font-bold">{summary.criticalViolations}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Activity className="h-8 w-8 text-indigo-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Active Controls</p>
                <p className="text-2xl font-bold">
                  {tenantControls.filter(c => c.status === 'enabled').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Compliance Alerts */}
      {summary.criticalViolations > 0 && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>{summary.criticalViolations} critical violation(s)</strong> detected in governance controls. 
            Review and remediate immediately to maintain compliance.
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="tenant">Tenant Controls</TabsTrigger>
          <TabsTrigger value="environments">Environment Controls</TabsTrigger>
          <TabsTrigger value="inheritance">Policy Inheritance</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* Control Distribution */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Controls by Type</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(summary.controlsByType).map(([type, count]) => (
                    <div key={type} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getControlIcon(type as GovernanceControl['type'])}
                        <span className="capitalize">{type}</span>
                      </div>
                      <Badge variant="outline">{count}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Controls by Priority</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(summary.controlsByPriority).map(([priority, count]) => (
                    <div key={priority} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${
                          priority === 'critical' ? 'bg-red-500' :
                          priority === 'high' ? 'bg-orange-500' :
                          priority === 'medium' ? 'bg-yellow-500' : 'bg-blue-500'
                        }`} />
                        <span className="capitalize">{priority}</span>
                      </div>
                      <Badge variant="outline">{count}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Environment Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Environment Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {environments.map(env => {
                  const envCompliance = complianceData.environments[env.id]
                  const complianceScore = envCompliance ? 
                    Math.max(0, 100 - (envCompliance.violations.length * 10)) : 100
                  
                  return (
                    <div key={env.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{env.name}</h4>
                        <Badge variant={getEnvironmentBadgeVariant(env.type)}>
                          {env.type}
                        </Badge>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Users:</span>
                          <span>{env.userCount}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Apps:</span>
                          <span>{env.appCount}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Compliance:</span>
                          <span className={getComplianceColor(complianceScore)}>
                            {complianceScore}%
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Criticality:</span>
                          <Badge variant="outline" className="text-xs">
                            {env.businessCriticality}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tenant" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                Tenant-Level Controls
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Organization-wide policies that apply across all environments
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {tenantControls.map(control => (
                  <div key={control.id} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg ${
                          control.priority === 'critical' ? 'bg-red-100 text-red-600' :
                          control.priority === 'high' ? 'bg-orange-100 text-orange-600' :
                          control.priority === 'medium' ? 'bg-yellow-100 text-yellow-600' :
                          'bg-blue-100 text-blue-600'
                        }`}>
                          {getControlIcon(control.type)}
                        </div>
                        <div>
                          <h4 className="font-medium">{control.name}</h4>
                          <p className="text-sm text-muted-foreground">{control.description}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Badge variant={getControlBadgeVariant(control)}>
                          {control.status}
                        </Badge>
                        <Badge variant="outline">{control.priority}</Badge>
                        <Badge variant="secondary">{control.enforcement}</Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <h5 className="font-medium mb-2">Scope & Application</h5>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-3 h-3 text-green-600" />
                            <span>Inheritance: {control.inheritanceAllowed ? 'Allowed' : 'Blocked'}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            {control.overrideAllowed ? (
                              <CheckCircle className="w-3 h-3 text-green-600" />
                            ) : (
                              <AlertTriangle className="w-3 h-3 text-red-600" />
                            )}
                            <span>Override: {control.overrideAllowed ? 'Allowed' : 'Blocked'}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            {control.requiredAtTenant ? (
                              <Lock className="w-3 h-3 text-red-600" />
                            ) : (
                              <CheckCircle className="w-3 h-3 text-green-600" />
                            )}
                            <span>Required: {control.requiredAtTenant ? 'Yes' : 'No'}</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h5 className="font-medium mb-2">Applies To</h5>
                        <div className="space-y-1">
                          <div>
                            <span className="text-muted-foreground">Environments:</span>
                            <div className="flex gap-1 mt-1">
                              {control.appliesTo.environmentTypes.map(type => (
                                <Badge key={type} variant="outline" className="text-xs">
                                  {type}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Regions:</span>
                            <div className="flex gap-1 mt-1">
                              {control.appliesTo.regions.slice(0, 3).map(region => (
                                <Badge key={region} variant="outline" className="text-xs">
                                  {region}
                                </Badge>
                              ))}
                              {control.appliesTo.regions.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                  +{control.appliesTo.regions.length - 3}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 pt-3 border-t">
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>Created by {control.metadata.createdBy}</span>
                        <span>Modified: {control.metadata.lastModified.toLocaleDateString()}</span>
                        <span>Version: {control.metadata.version}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="environments" className="space-y-4">
          {selectedEnvironment !== 'all' && selectedEnvironment !== 'tenant' ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Server className="w-5 h-5" />
                  Effective Controls for {environments.find(e => e.id === selectedEnvironment)?.name}
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Combined tenant and environment-specific controls after inheritance resolution
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {effectiveControls.map(control => (
                    <div key={control.id} className="p-4 border rounded-lg">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-start gap-3">
                          <div className={`p-2 rounded-lg ${
                            control.level === 'tenant' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'
                          }`}>
                            {control.level === 'tenant' ? <Building2 className="w-4 h-4" /> : <Server className="w-4 h-4" />}
                          </div>
                          <div>
                            <h4 className="font-medium">{control.name}</h4>
                            <p className="text-sm text-muted-foreground">{control.description}</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Badge variant={control.level === 'tenant' ? 'default' : 'secondary'}>
                            {control.level}
                          </Badge>
                          <Badge variant="outline">{control.status}</Badge>
                          <Badge variant="outline">{control.enforcement}</Badge>
                        </div>
                      </div>

                      {control.configuration && Object.keys(control.configuration).length > 0 && (
                        <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-800 rounded">
                          <h5 className="font-medium mb-2 text-sm">Configuration</h5>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs">
                            {Object.entries(control.configuration).slice(0, 6).map(([key, value]) => (
                              <div key={key} className="flex justify-between">
                                <span className="text-muted-foreground">{key}:</span>
                                <span className="font-medium">
                                  {typeof value === 'boolean' ? (value ? 'Yes' : 'No') : String(value)}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="text-center p-8">
              <Server className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Select an Environment</h3>
              <p className="text-muted-foreground">
                Choose an environment from the dropdown to view its effective controls
              </p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="inheritance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GitBranch className="w-5 h-5" />
                Policy Inheritance Matrix
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Shows how tenant controls flow down to environments and any overrides
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {tenantControls.filter(c => c.inheritanceAllowed).map(control => (
                  <div key={control.id} className="border rounded-lg">
                    <div className="p-4 border-b bg-gray-50 dark:bg-gray-800">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-blue-600" />
                          <span className="font-medium">{control.name}</span>
                          <Badge variant="outline">Tenant</Badge>
                        </div>
                        <div className="flex gap-2">
                          <Badge variant={control.overrideAllowed ? 'default' : 'destructive'}>
                            {control.overrideAllowed ? 'Override Allowed' : 'Override Blocked'}
                          </Badge>
                          <Badge variant="outline">{control.enforcement}</Badge>
                        </div>
                      </div>
                    </div>

                    <div className="p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                        {environments.map(env => {
                          const envControls = governanceControlsManager.getEnvironmentControls(env.id)
                          const hasOverride = envControls.some(ec => ec.id === control.id)
                          
                          return (
                            <div key={env.id} className={`p-3 border rounded ${
                              hasOverride ? 'border-green-300 bg-green-50' : 'border-gray-200'
                            }`}>
                              <div className="flex items-center gap-2 mb-2">
                                <Server className="w-3 h-3" />
                                <span className="text-sm font-medium">{env.name}</span>
                                <Badge variant={getEnvironmentBadgeVariant(env.type)} className="text-xs">
                                  {env.type}
                                </Badge>
                              </div>
                              
                              <div className="text-xs space-y-1">
                                {hasOverride ? (
                                  <div className="flex items-center gap-1 text-green-600">
                                    <CheckCircle className="w-3 h-3" />
                                    <span>Override Applied</span>
                                  </div>
                                ) : (
                                  <div className="flex items-center gap-1 text-blue-600">
                                    <GitBranch className="w-3 h-3" />
                                    <span>Inherited</span>
                                  </div>
                                )}
                                
                                <div className="text-muted-foreground">
                                  Enforcement: {hasOverride ? 'Custom' : control.enforcement}
                                </div>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                Governance Compliance Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Overall Compliance */}
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="text-lg font-semibold">Overall Compliance Score</h4>
                  <p className="text-sm text-muted-foreground">
                    {complianceData.overall.compliant ? 'All governance controls are compliant' : 
                     `${complianceData.overall.criticalViolations} critical violation(s) detected`}
                  </p>
                </div>
                <div className="text-right">
                  <p className={`text-3xl font-bold ${getComplianceColor(complianceData.overall.score)}`}>
                    {complianceData.overall.score}%
                  </p>
                  <Badge variant={complianceData.overall.compliant ? 'default' : 'destructive'}>
                    {complianceData.overall.compliant ? 'Compliant' : 'Non-Compliant'}
                  </Badge>
                </div>
              </div>

              {/* Tenant Compliance */}
              <div>
                <h5 className="font-medium mb-3">Tenant-Level Compliance</h5>
                {complianceData.tenant.compliant ? (
                  <div className="flex items-center gap-2 text-green-600 p-3 border border-green-200 bg-green-50 rounded">
                    <CheckCircle className="w-4 h-4" />
                    <span>All required tenant controls are properly configured</span>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {complianceData.tenant.missingRequired.map((control: string, index: number) => (
                      <Alert key={index}>
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>
                          <strong>Missing Required Control:</strong> {control}
                        </AlertDescription>
                      </Alert>
                    ))}
                  </div>
                )}
              </div>

              {/* Environment Compliance */}
              <div>
                <h5 className="font-medium mb-3">Environment-Level Compliance</h5>
                <div className="grid gap-4">
                  {Object.entries(complianceData.environments).map(([envId, envData]: [string, any]) => {
                    const environment = environments.find(e => e.id === envId)
                    if (!environment) return null

                    return (
                      <div key={envId} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <Server className="w-4 h-4" />
                            <span className="font-medium">{environment.name}</span>
                            <Badge variant={getEnvironmentBadgeVariant(environment.type)}>
                              {environment.type}
                            </Badge>
                          </div>
                          <Badge variant={envData.compliant ? 'default' : 'destructive'}>
                            {envData.compliant ? 'Compliant' : 'Issues Found'}
                          </Badge>
                        </div>

                        {envData.violations.length > 0 ? (
                          <div className="space-y-2">
                            {envData.violations.map((violation: any, index: number) => (
                              <div key={index} className="flex items-start gap-2 p-2 bg-red-50 border border-red-200 rounded text-sm">
                                <AlertTriangle className={`w-4 h-4 mt-0.5 ${getSeverityColor(violation.severity)}`} />
                                <div>
                                  <div className="flex items-center gap-2">
                                    <Badge variant="outline" className="text-xs">
                                      {violation.severity}
                                    </Badge>
                                    <span className="font-medium">{violation.controlId}</span>
                                  </div>
                                  <p className="text-muted-foreground">{violation.description}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 text-green-600 text-sm">
                            <CheckCircle className="w-4 h-4" />
                            <span>All governance controls are compliant</span>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}