'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  CreditCard,
  AlertTriangle,
  DollarSign,
  Users,
  Calendar,
  TrendingUp,
  Shield,
  RefreshCw,
  Download,
  Filter
} from 'lucide-react'
import { licensingManager, type License } from '@/lib/governance/licensing-manager'

/**
 * Licensing Dashboard Component
 * Provides comprehensive view of Power Platform licensing governance
 * Includes usage tracking, compliance monitoring, and cost analysis
 */
export function LicensingDashboard() {
  const [licenses, setLicenses] = useState<License[]>([])
  const [metrics, setMetrics] = useState<any>(null)
  const [activeFilter, setActiveFilter] = useState<'all' | 'power_platform' | 'azure' | 'third_party'>('all')
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date())

  useEffect(() => {
    loadLicensingData()
  }, [activeFilter])

  const loadLicensingData = () => {
    const filter = activeFilter === 'all' ? undefined : { type: activeFilter as License['type'] }
    setLicenses(licensingManager.getLicenses(filter))
    setMetrics(licensingManager.getDashboardMetrics())
    setLastRefresh(new Date())
  }

  const getComplianceColor = (status: License['complianceStatus']) => {
    switch (status) {
      case 'compliant': return 'default'
      case 'warning': return 'secondary'
      case 'violation': return 'destructive'
      default: return 'outline'
    }
  }

  const getUtilizationColor = (utilization: number) => {
    if (utilization >= 90) return 'text-red-600'
    if (utilization >= 75) return 'text-yellow-600'
    return 'text-green-600'
  }

  const performAudit = (licenseId: string) => {
    try {
      const audit = licensingManager.performComplianceAudit(licenseId, 'System Admin')
      console.log('Audit completed:', audit)
      loadLicensingData() // Refresh data
    } catch (error) {
      console.error('Audit failed:', error)
    }
  }

  if (!metrics) {
    return <div className="flex items-center justify-center p-8">Loading licensing data...</div>
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">License Management</h2>
          <p className="text-muted-foreground">
            Monitor and manage Power Platform licensing across your organization
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={loadLicensingData}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <CreditCard className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Total Licenses</p>
                <p className="text-2xl font-bold">{metrics.totalLicenses}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Monthly Cost</p>
                <p className="text-2xl font-bold">${metrics.totalCost.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Avg Utilization</p>
                <p className="text-2xl font-bold">{metrics.averageUtilization}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Shield className="h-8 w-8 text-amber-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Compliance Score</p>
                <p className="text-2xl font-bold">{metrics.complianceScore}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts */}
      {metrics.violations > 0 && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>{metrics.violations} compliance violation(s)</strong> detected. 
            Review licensing allocation and perform audits immediately.
          </AlertDescription>
        </Alert>
      )}

      {metrics.renewalsNext90Days > 0 && (
        <Alert>
          <Calendar className="h-4 w-4" />
          <AlertDescription>
            <strong>{metrics.renewalsNext90Days} license(s)</strong> require renewal within 90 days. 
            Plan renewal process to avoid service interruption.
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="licenses">License Details</TabsTrigger>
          <TabsTrigger value="costs">Cost Analysis</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* Cost Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Cost Breakdown by Type</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(metrics.costByType).map(([type, cost]) => (
                  <div key={type} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-blue-500" />
                      <span className="font-medium capitalize">{type.replace('_', ' ')}</span>
                    </div>
                    <span className="font-bold">${cost.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="licenses" className="space-y-4">
          {/* Filter */}
          <div className="flex gap-2">
            <Button
              variant={activeFilter === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveFilter('all')}
            >
              All Licenses
            </Button>
            <Button
              variant={activeFilter === 'power_platform' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveFilter('power_platform')}
            >
              Power Platform
            </Button>
            <Button
              variant={activeFilter === 'azure' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveFilter('azure')}
            >
              Azure
            </Button>
            <Button
              variant={activeFilter === 'third_party' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveFilter('third_party')}
            >
              Third Party
            </Button>
          </div>

          {/* License List */}
          <div className="grid gap-4">
            {licenses.map(license => {
              const utilization = licensingManager.getLicenseUtilization(license.id)
              return (
                <Card key={license.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <h3 className="font-semibold">{license.name}</h3>
                          <Badge variant={getComplianceColor(license.complianceStatus)}>
                            {license.complianceStatus}
                          </Badge>
                          <Badge variant="outline">{license.environment}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {license.provider} • {license.sku} • {license.region}
                        </p>
                        <div className="flex items-center gap-4 text-sm">
                          <span>Usage: {license.totalUsed}/{license.totalAllocated}</span>
                          <span className={getUtilizationColor(utilization)}>
                            {utilization}% utilized
                          </span>
                          <span>${license.costPerLicense} per license</span>
                          <span>Renewal: {license.renewalDate.toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => performAudit(license.id)}
                        >
                          Audit
                        </Button>
                      </div>
                    </div>
                    <div className="mt-4">
                      <div className="flex justify-between text-xs mb-1">
                        <span>License Utilization</span>
                        <span>{utilization}%</span>
                      </div>
                      <Progress value={utilization} className="h-2" />
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="costs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Cost Analysis</CardTitle>
              <p className="text-sm text-muted-foreground">
                Detailed breakdown of licensing costs and optimization opportunities
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {licenses.map(license => {
                  const monthlyCost = license.totalUsed * license.costPerLicense
                  const unutilizedCost = (license.totalAllocated - license.totalUsed) * license.costPerLicense
                  
                  return (
                    <div key={license.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <h4 className="font-medium">{license.name}</h4>
                        <Badge variant="outline">{license.type}</Badge>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Monthly Cost</p>
                          <p className="font-semibold">${monthlyCost.toFixed(2)}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Unused Cost</p>
                          <p className="font-semibold text-amber-600">${unutilizedCost.toFixed(2)}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Cost per License</p>
                          <p className="font-semibold">${license.costPerLicense}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Annual Cost</p>
                          <p className="font-semibold">${(monthlyCost * 12).toFixed(2)}</p>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Compliance Status</CardTitle>
              <p className="text-sm text-muted-foreground">
                License compliance monitoring and audit results
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {licenses.map(license => (
                  <div key={license.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{license.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        Last audit: {license.lastAuditDate.toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant={getComplianceColor(license.complianceStatus)}>
                        {license.complianceStatus}
                      </Badge>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => performAudit(license.id)}
                      >
                        Run Audit
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Footer */}
      <div className="text-xs text-muted-foreground">
        Last refreshed: {lastRefresh.toLocaleString()} • 
        Governance framework ensures compliance with organizational policies
      </div>
    </div>
  )
}