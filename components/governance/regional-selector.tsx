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
  Globe,
  Shield,
  DollarSign,
  Clock,
  MapPin,
  Scale,
  AlertTriangle,
  CheckCircle,
  FileText,
  Lock,
  Calendar,
  TrendingUp,
  Settings
} from 'lucide-react'
import { regionalConfigManager, type RegionalCompliance, type RegionalSettings, type RegionalCosts } from '@/lib/governance/regional-config'

/**
 * Regional Configuration Selector Component
 * Allows users to select and configure region-specific governance settings
 * Displays compliance requirements, costs, and localization settings
 */
export function RegionalSelector() {
  const [currentRegion, setCurrentRegion] = useState<string>('north-america')
  const [availableRegions, setAvailableRegions] = useState<any[]>([])
  const [compliance, setCompliance] = useState<RegionalCompliance | null>(null)
  const [settings, setSettings] = useState<RegionalSettings | null>(null)
  const [costs, setCosts] = useState<RegionalCosts | null>(null)
  const [complianceValidation, setComplianceValidation] = useState<any>(null)
  const [costEstimate, setCostEstimate] = useState<any>(null)

  useEffect(() => {
    loadRegionalData()
  }, [currentRegion])

  useEffect(() => {
    const regions = regionalConfigManager.getAvailableRegions()
    setAvailableRegions(regions)
    const current = regionalConfigManager.getCurrentRegion()
    setCurrentRegion(current)
  }, [])

  const loadRegionalData = () => {
    const complianceData = regionalConfigManager.getRegionalCompliance(currentRegion)
    const settingsData = regionalConfigManager.getRegionalSettings(currentRegion)
    const costsData = regionalConfigManager.getRegionalCosts(currentRegion)
    const validation = regionalConfigManager.validateRegionalCompliance()

    setCompliance(complianceData)
    setSettings(settingsData)
    setCosts(costsData)
    setComplianceValidation(validation)

    // Calculate sample cost estimate
    if (costsData) {
      const estimate = regionalConfigManager.calculateRegionalCosts({
        powerPlatformUsers: 100,
        powerPlatformApps: 10,
        azurePremiumP1: 150,
        azurePremiumP2: 50,
        dataverseStorage: 500,
        computeHours: 720, // 30 days * 24 hours
        storageGB: 1000,
        networkingGB: 100
      })
      setCostEstimate(estimate)
    }
  }

  const handleRegionChange = (newRegion: string) => {
    regionalConfigManager.setRegion(newRegion)
    setCurrentRegion(newRegion)
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

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'text-red-600'
      case 'medium': return 'text-yellow-600'
      case 'low': return 'text-blue-600'
      default: return 'text-gray-600'
    }
  }

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'high': return 'destructive'
      case 'medium': return 'secondary'
      case 'low': return 'default'
      default: return 'outline'
    }
  }

  if (!compliance || !settings || !costs) {
    return <div className="flex items-center justify-center p-8">Loading regional configuration...</div>
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Regional Configuration</h2>
          <p className="text-muted-foreground">
            Configure region-specific governance, compliance, and localization settings
          </p>
        </div>
        <div className="flex gap-2">
          <Select value={currentRegion} onValueChange={handleRegionChange}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select region" />
            </SelectTrigger>
            <SelectContent>
              {availableRegions.map(region => (
                <SelectItem key={region.id} value={region.id}>
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4" />
                    {region.name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Current Region Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            {compliance.region} Configuration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <Scale className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Regulations</p>
              <p className="text-2xl font-bold">{compliance.regulations.length}</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <DollarSign className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Currency</p>
              <p className="text-2xl font-bold">{compliance.currency.code}</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <Clock className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Timezone</p>
              <p className="text-sm font-bold">{compliance.timezone.name}</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <Globe className="w-8 h-8 text-amber-600 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Language</p>
              <p className="text-sm font-bold">{compliance.language.primary}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Compliance Status */}
      {complianceValidation && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Compliance Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-lg font-semibold">Overall Compliance Score</h4>
                <p className="text-sm text-muted-foreground">
                  {complianceValidation.compliant ? 'Fully compliant' : `${complianceValidation.violations.length} violation(s) found`}
                </p>
              </div>
              <div className="text-right">
                <p className={`text-3xl font-bold ${getComplianceColor(complianceValidation.score)}`}>
                  {complianceValidation.score}%
                </p>
                <Badge variant={getComplianceBadge(complianceValidation.score)}>
                  {complianceValidation.compliant ? 'Compliant' : 'Non-Compliant'}
                </Badge>
              </div>
            </div>

            {complianceValidation.violations.length > 0 && (
              <div className="space-y-3">
                <h5 className="font-medium">Compliance Violations</h5>
                {complianceValidation.violations.map((violation: any, index: number) => (
                  <Alert key={index}>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Badge variant={getSeverityBadge(violation.severity)}>
                            {violation.severity}
                          </Badge>
                          <span className="font-medium">{violation.regulation}</span>
                        </div>
                        <p className="text-sm">
                          <strong>Requirement:</strong> {violation.requirement}
                        </p>
                        <p className="text-sm">
                          <strong>Remediation:</strong> {violation.remediation}
                        </p>
                      </div>
                    </AlertDescription>
                  </Alert>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="regulations" className="space-y-4">
        <TabsList>
          <TabsTrigger value="regulations">Regulations</TabsTrigger>
          <TabsTrigger value="settings">Governance Settings</TabsTrigger>
          <TabsTrigger value="costs">Cost Structure</TabsTrigger>
          <TabsTrigger value="localization">Data Localization</TabsTrigger>
        </TabsList>

        <TabsContent value="regulations" className="space-y-4">
          <div className="grid gap-4">
            {compliance.regulations.map((regulation, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{regulation.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">{regulation.description}</p>
                    </div>
                    <div className="flex gap-2">
                      {regulation.dataResidency && (
                        <Badge variant="outline">Data Residency</Badge>
                      )}
                      {regulation.rightToErasure && (
                        <Badge variant="outline">Right to Erasure</Badge>
                      )}
                      {regulation.consentManagement && (
                        <Badge variant="outline">Consent Management</Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h5 className="font-medium mb-2">Key Requirements</h5>
                    <ul className="space-y-1">
                      {regulation.requirements.map((req, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex items-start gap-4 pt-3 border-t">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Penalties</p>
                      <p className="text-sm">{regulation.penalties}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Audit Retention</p>
                      <p className="text-sm">{regulation.auditRetention} months</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <div className="grid gap-4">
            {/* Governance Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Governance Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h5 className="font-medium mb-2">Default Policies</h5>
                  <div className="flex flex-wrap gap-2">
                    {settings.governance.defaultPolicies.map((policy, index) => (
                      <Badge key={index} variant="outline">{policy}</Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h5 className="font-medium mb-2">Mandatory Controls</h5>
                  <div className="flex flex-wrap gap-2">
                    {settings.governance.mandatoryControls.map((control, index) => (
                      <Badge key={index} variant="default">{control}</Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h5 className="font-medium mb-2">Data Classification Levels</h5>
                  <div className="flex flex-wrap gap-2">
                    {settings.governance.dataClassification.map((level, index) => (
                      <Badge key={index} variant="secondary">{level}</Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h5 className="font-medium mb-2">Retention Periods</h5>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {Object.entries(settings.governance.retentionPeriods).map(([type, months]) => (
                      <div key={type} className="text-center p-3 border rounded">
                        <p className="text-sm font-medium capitalize">{type.replace('-', ' ')}</p>
                        <p className="text-lg font-bold">{months}m</p>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Security Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="w-5 h-5" />
                  Security Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h5 className="font-medium mb-2">Security Requirements</h5>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        {settings.security.mfaRequired ? (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        ) : (
                          <AlertTriangle className="w-4 h-4 text-red-600" />
                        )}
                        <span className="text-sm">Multi-Factor Authentication</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {settings.security.privilegedAccessManagement ? (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        ) : (
                          <AlertTriangle className="w-4 h-4 text-red-600" />
                        )}
                        <span className="text-sm">Privileged Access Management</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{settings.security.zeroTrustLevel}</Badge>
                        <span className="text-sm">Zero Trust Level</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h5 className="font-medium mb-2">Conditional Access Policies</h5>
                    <div className="space-y-1">
                      {settings.security.conditionalAccess.map((policy, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span className="text-sm">{policy}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Power Platform Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Power Platform Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h5 className="font-medium mb-2">Allowed Connectors</h5>
                    <div className="flex flex-wrap gap-1">
                      {settings.powerPlatform.allowedConnectors.map((connector, index) => (
                        <Badge key={index} variant="default" className="text-xs">{connector}</Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h5 className="font-medium mb-2">Blocked Connectors</h5>
                    <div className="flex flex-wrap gap-1">
                      {settings.powerPlatform.blockedConnectors.map((connector, index) => (
                        <Badge key={index} variant="destructive" className="text-xs">{connector}</Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <h5 className="font-medium mb-2">DLP Policies</h5>
                  <div className="flex flex-wrap gap-2">
                    {settings.powerPlatform.dlpPolicies.map((policy, index) => (
                      <Badge key={index} variant="secondary">{policy}</Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-sm">
                    <strong>Default Environment Region:</strong> {settings.powerPlatform.defaultEnvironmentRegion}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="costs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                Regional Pricing Structure ({costs.currency})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Licensing Costs */}
              <div>
                <h5 className="font-medium mb-3">Licensing Costs (Monthly)</h5>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.entries(costs.licensing).map(([item, price]) => (
                    <div key={item} className="text-center p-3 border rounded">
                      <p className="text-sm text-muted-foreground capitalize">
                        {item.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                      </p>
                      <p className="text-lg font-bold">
                        {costs.currency === 'GBP' ? '£' : '$'}{price.toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Infrastructure Costs */}
              <div>
                <h5 className="font-medium mb-3">Infrastructure Costs</h5>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-3 border rounded">
                    <p className="text-sm text-muted-foreground">Compute (per hour)</p>
                    <p className="text-lg font-bold">
                      {costs.currency === 'GBP' ? '£' : '$'}{costs.infrastructure.computePerHour.toFixed(3)}
                    </p>
                  </div>
                  <div className="text-center p-3 border rounded">
                    <p className="text-sm text-muted-foreground">Storage (per GB)</p>
                    <p className="text-lg font-bold">
                      {costs.currency === 'GBP' ? '£' : '$'}{costs.infrastructure.storagePerGB.toFixed(3)}
                    </p>
                  </div>
                  <div className="text-center p-3 border rounded">
                    <p className="text-sm text-muted-foreground">Networking (per GB)</p>
                    <p className="text-lg font-bold">
                      {costs.currency === 'GBP' ? '£' : '$'}{costs.infrastructure.networkingPerGB.toFixed(3)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Tax Information */}
              <div>
                <h5 className="font-medium mb-3">Tax Structure</h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    {costs.taxes.vatRate && (
                      <div className="flex justify-between p-2 border rounded">
                        <span>VAT Rate</span>
                        <span className="font-medium">{costs.taxes.vatRate}%</span>
                      </div>
                    )}
                    {costs.taxes.gstRate && (
                      <div className="flex justify-between p-2 border rounded">
                        <span>GST Rate</span>
                        <span className="font-medium">{costs.taxes.gstRate}%</span>
                      </div>
                    )}
                    {costs.taxes.salesTaxRate && (
                      <div className="flex justify-between p-2 border rounded">
                        <span>Sales Tax Rate</span>
                        <span className="font-medium">{costs.taxes.salesTaxRate}%</span>
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    {costs.taxes.localTaxes.map((tax, index) => (
                      <div key={index} className="flex justify-between p-2 border rounded">
                        <span>{tax.name}</span>
                        <span className="font-medium">{tax.rate}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sample Cost Estimate */}
              {costEstimate && (
                <div>
                  <h5 className="font-medium mb-3">Sample Monthly Cost Estimate</h5>
                  <div className="space-y-3 p-4 bg-gray-50 dark:bg-gray-800 rounded">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Licensing</p>
                        <p className="font-bold">{costs.currency === 'GBP' ? '£' : '$'}{costEstimate.licensing.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Infrastructure</p>
                        <p className="font-bold">{costs.currency === 'GBP' ? '£' : '$'}{costEstimate.infrastructure.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Taxes</p>
                        <p className="font-bold">{costs.currency === 'GBP' ? '£' : '$'}{costEstimate.taxes.toFixed(2)}</p>
                      </div>
                    </div>
                    <div className="border-t pt-3">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-semibold">Total Monthly Cost</span>
                        <span className="text-2xl font-bold text-green-600">
                          {costs.currency === 'GBP' ? '£' : '$'}{costEstimate.total.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="localization" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5" />
                Data Localization Requirements
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h5 className="font-medium mb-3">Data Residency</h5>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      {compliance.dataLocalization.required ? (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-gray-600" />
                      )}
                      <span className="text-sm">
                        Data localization {compliance.dataLocalization.required ? 'required' : 'not required'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {compliance.dataLocalization.sovereignCloud ? (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-gray-600" />
                      )}
                      <span className="text-sm">
                        Sovereign cloud {compliance.dataLocalization.sovereignCloud ? 'required' : 'not required'}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h5 className="font-medium mb-3">Regional Settings</h5>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Currency:</span>
                      <span className="font-medium">{compliance.currency.code} ({compliance.currency.symbol})</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Timezone:</span>
                      <span className="font-medium">{compliance.timezone.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Primary Language:</span>
                      <span className="font-medium">{compliance.language.primary}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Locale:</span>
                      <span className="font-medium">{compliance.language.locale}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h5 className="font-medium mb-3">Allowed Azure Regions</h5>
                <div className="flex flex-wrap gap-2">
                  {compliance.dataLocalization.allowedRegions.map((region, index) => (
                    <Badge key={index} variant="default">{region}</Badge>
                  ))}
                </div>
              </div>

              <div>
                <h5 className="font-medium mb-3">Cross-Border Restrictions</h5>
                <div className="space-y-2">
                  {compliance.dataLocalization.crossBorderRestrictions.map((restriction, index) => (
                    <Alert key={index}>
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription className="text-sm">
                        {restriction}
                      </AlertDescription>
                    </Alert>
                  ))}
                </div>
              </div>

              <div>
                <h5 className="font-medium mb-3">Supported Languages</h5>
                <div className="flex flex-wrap gap-2">
                  {compliance.language.supported.map((lang, index) => (
                    <Badge key={index} variant="outline">{lang}</Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}