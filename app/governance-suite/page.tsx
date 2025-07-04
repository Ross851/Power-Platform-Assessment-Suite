'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ThemeProvider } from '@/lib/governance/theme-provider'
import { ThemeToggle } from '@/components/governance/theme-toggle'
import { LicensingDashboard } from '@/components/governance/licensing-dashboard'
import { OperationsDashboard } from '@/components/governance/operations-dashboard'
import { MCPDashboard } from '@/components/governance/mcp-dashboard'
import { RegionalSelector } from '@/components/governance/regional-selector'
import { GovernanceDashboard } from '@/components/governance/governance-dashboard'
import { CoEDashboard } from '@/components/governance/coe-dashboard'
import {
  Building2,
  Shield,
  Globe,
  Settings,
  BarChart3,
  Users,
  ArrowLeft,
  Sparkles
} from 'lucide-react'
import Link from 'next/link'

/**
 * Power Platform Governance Suite
 * Comprehensive governance dashboard combining all governance features
 * Provides unified view of licensing, operations, compliance, and regional settings
 */
export default function GovernanceSuitePage() {
  const [activeTab, setActiveTab] = useState('overview')

  return (
    <ThemeProvider defaultTheme="system" storageKey="governance-suite-theme">
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 shadow-sm border-b">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Link href="/">
                  <Button variant="ghost" size="sm">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Home
                  </Button>
                </Link>
                <div>
                  <h1 className="text-2xl font-bold flex items-center gap-2">
                    <Sparkles className="w-6 h-6 text-blue-600" />
                    Power Platform Governance Suite
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    Comprehensive governance, compliance, and operations management
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <ThemeToggle />
                <Link href="/microsoft-2025-demo">
                  <Button variant="outline" size="sm">
                    Assessment Demo
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid w-full grid-cols-7">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="licensing">Licensing</TabsTrigger>
              <TabsTrigger value="operations">Operations</TabsTrigger>
              <TabsTrigger value="mcp">MCP Integration</TabsTrigger>
              <TabsTrigger value="regional">Regional Config</TabsTrigger>
              <TabsTrigger value="governance">Governance Controls</TabsTrigger>
              <TabsTrigger value="coe">CoE Analytics</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Welcome Section */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold mb-2">
                      Welcome to Power Platform Governance Suite
                    </h2>
                    <p className="opacity-90 mb-4">
                      World-class enterprise governance platform built on Microsoft best practices and Flowbite design ecosystem
                    </p>
                    <div className="flex gap-2">
                      <Badge className="bg-white/20 text-white">Microsoft 2025 Framework</Badge>
                      <Badge className="bg-white/20 text-white">Enterprise Ready</Badge>
                      <Badge className="bg-white/20 text-white">Multi-Region</Badge>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm opacity-75 mb-1">Governance Score</div>
                    <div className="bg-white dark:bg-gray-800 rounded-lg px-6 py-3 shadow-lg">
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">
                        87%
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Feature Overview */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setActiveTab('licensing')}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Building2 className="w-5 h-5 text-blue-600" />
                      License Management
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Track and monitor Power Platform, Azure, and third-party license usage with compliance audit trails.
                    </p>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Total Licenses</span>
                        <Badge variant="outline">156</Badge>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Compliance Score</span>
                        <Badge variant="default">92%</Badge>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Monthly Cost</span>
                        <Badge variant="outline">$15,420</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setActiveTab('operations')}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="w-5 h-5 text-green-600" />
                      Operations Excellence
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Real-time monitoring with KPI visualizations, performance indicators, and governance metrics.
                    </p>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Health Score</span>
                        <Badge variant="default">87%</Badge>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Critical Alerts</span>
                        <Badge variant="destructive">2</Badge>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Positive Trends</span>
                        <Badge variant="outline">12</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setActiveTab('mcp')}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="w-5 h-5 text-purple-600" />
                      MCP Integration
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Microsoft Cloud Platform integration for real-time compliance status and security scores.
                    </p>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Compliance</span>
                        <Badge variant="default">87%</Badge>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Security Score</span>
                        <Badge variant="default">87%</Badge>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Policy Violations</span>
                        <Badge variant="secondary">5</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setActiveTab('regional')}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Globe className="w-5 h-5 text-amber-600" />
                      Regional Configuration
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Region-specific settings with GDPR, data localization, and compliance rules.
                    </p>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Active Region</span>
                        <Badge variant="outline">North America</Badge>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Data Residency</span>
                        <Badge variant="default">Compliant</Badge>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>GDPR Status</span>
                        <Badge variant="secondary">N/A</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setActiveTab('governance')}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Settings className="w-5 h-5 text-indigo-600" />
                      Governance Controls
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Tenant vs environment level controls with policy inheritance and compliance monitoring.
                    </p>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Tenant Controls</span>
                        <Badge variant="outline">8</Badge>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Environment Controls</span>
                        <Badge variant="outline">24</Badge>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Compliance Score</span>
                        <Badge variant="default">95%</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setActiveTab('coe')}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="w-5 h-5 text-teal-600" />
                      CoE Analytics
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Center of Excellence toolkit integration with app analytics and maker activity monitoring.
                    </p>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Active Makers</span>
                        <Badge variant="outline">89</Badge>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Total Apps</span>
                        <Badge variant="outline">78</Badge>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Business Value</span>
                        <Badge variant="default">$285k</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Button variant="outline" onClick={() => setActiveTab('operations')}>
                      <BarChart3 className="w-4 h-4 mr-2" />
                      View KPIs
                    </Button>
                    <Button variant="outline" onClick={() => setActiveTab('licensing')}>
                      <Building2 className="w-4 h-4 mr-2" />
                      License Audit
                    </Button>
                    <Button variant="outline" onClick={() => setActiveTab('mcp')}>
                      <Shield className="w-4 h-4 mr-2" />
                      Sync MCP Data
                    </Button>
                    <Button variant="outline" onClick={() => setActiveTab('coe')}>
                      <Users className="w-4 h-4 mr-2" />
                      Maker Analytics
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* System Information */}
              <Card>
                <CardHeader>
                  <CardTitle>System Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <h4 className="font-medium mb-2">Framework Version</h4>
                      <p className="text-muted-foreground">Microsoft 2025 Assessment Framework v2.1</p>
                      <p className="text-muted-foreground">Power Platform Governance Suite v1.0</p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Compliance Standards</h4>
                      <div className="flex flex-wrap gap-1">
                        <Badge variant="outline">SOX</Badge>
                        <Badge variant="outline">GDPR</Badge>
                        <Badge variant="outline">CCPA</Badge>
                        <Badge variant="outline">ISO27001</Badge>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Last Updated</h4>
                      <p className="text-muted-foreground">{new Date().toLocaleDateString()}</p>
                      <p className="text-muted-foreground">Auto-sync enabled</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="licensing">
              <LicensingDashboard />
            </TabsContent>

            <TabsContent value="operations">
              <OperationsDashboard />
            </TabsContent>

            <TabsContent value="mcp">
              <MCPDashboard />
            </TabsContent>

            <TabsContent value="regional">
              <RegionalSelector />
            </TabsContent>

            <TabsContent value="governance">
              <GovernanceDashboard />
            </TabsContent>

            <TabsContent value="coe">
              <CoEDashboard />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </ThemeProvider>
  )
}