'use client'

import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle,
  DollarSign,
  Users,
  Shield,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  Target
} from 'lucide-react'

// Import dashboard data types
import type { ExecutiveValueDashboard } from '@/lib/business-value-calculator'
import type { ExecutiveRiskDashboard } from '@/lib/enterprise-risk-framework'
import type { ExecutiveChangeReadinessSummary } from '@/lib/change-readiness-framework'
import type { InvestmentStrategy } from '@/lib/investment-strategy-framework'

interface ExecutiveDashboardProps {
  valueData?: ExecutiveValueDashboard
  riskData?: ExecutiveRiskDashboard
  changeData?: ExecutiveChangeReadinessSummary
  investmentData?: InvestmentStrategy
}

export function ExecutiveDashboard({
  valueData,
  riskData,
  changeData,
  investmentData
}: ExecutiveDashboardProps) {
  return (
    <div className="space-y-6">
      {/* Key Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Overall ROI"
          value={valueData?.overallROI ? `${valueData.overallROI}%` : 'N/A'}
          icon={DollarSign}
          trend={valueData?.overallROI && valueData.overallROI > 150 ? 'up' : 'down'}
          trendValue={valueData?.overallROI ? `${valueData.overallROI - 100}%` : undefined}
          status={valueData?.overallROI && valueData.overallROI > 200 ? 'success' : 'warning'}
        />
        
        <MetricCard
          title="Risk Score"
          value={riskData?.overallRiskScore || 'N/A'}
          icon={Shield}
          trend={riskData?.overallRiskScore && riskData.overallRiskScore <= 10 ? 'up' : 'down'}
          status={riskData?.overallRiskScore && riskData.overallRiskScore <= 10 ? 'success' : 'danger'}
        />
        
        <MetricCard
          title="Change Readiness"
          value={changeData?.readinessScore ? `${changeData.readinessScore}%` : 'N/A'}
          icon={Users}
          trend={changeData?.readinessScore && changeData.readinessScore >= 70 ? 'up' : 'down'}
          status={changeData?.readinessScore && changeData.readinessScore >= 70 ? 'success' : 'warning'}
        />
        
        <MetricCard
          title="Investment"
          value={investmentData?.totalBudget ? formatCurrency(investmentData.totalBudget) : 'N/A'}
          icon={BarChart3}
          subtitle={investmentData?.timeHorizon}
        />
      </div>

      {/* Main Dashboard Tabs */}
      <Tabs defaultValue="strategic" className="space-y-4">
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="strategic">Strategic Overview</TabsTrigger>
          <TabsTrigger value="value">Value Realization</TabsTrigger>
          <TabsTrigger value="risk">Risk Management</TabsTrigger>
          <TabsTrigger value="readiness">Change Readiness</TabsTrigger>
        </TabsList>

        <TabsContent value="strategic" className="space-y-4">
          <StrategicOverview 
            valueData={valueData}
            riskData={riskData}
            changeData={changeData}
            investmentData={investmentData}
          />
        </TabsContent>

        <TabsContent value="value" className="space-y-4">
          <ValueRealizationDashboard data={valueData} />
        </TabsContent>

        <TabsContent value="risk" className="space-y-4">
          <RiskManagementDashboard data={riskData} />
        </TabsContent>

        <TabsContent value="readiness" className="space-y-4">
          <ChangeReadinessDashboard data={changeData} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Strategic Overview Component
function StrategicOverview({
  valueData,
  riskData,
  changeData,
  investmentData
}: ExecutiveDashboardProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Executive Summary</CardTitle>
          <CardDescription>Power Platform Governance Status</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Strategic Alignment</span>
              <Badge variant="default">On Track</Badge>
            </div>
            <Progress value={85} className="h-2" />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Value Realization</span>
              <Badge variant={valueData?.overallROI && valueData.overallROI > 150 ? "default" : "secondary"}>
                {valueData?.overallROI ? `${valueData.overallROI}% ROI` : 'Tracking'}
              </Badge>
            </div>
            <Progress value={valueData?.overallROI ? Math.min(valueData.overallROI / 3, 100) : 0} className="h-2" />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Risk Management</span>
              <Badge variant={riskData?.overallRiskScore && riskData.overallRiskScore <= 10 ? "default" : "destructive"}>
                {riskData?.overallRiskScore ? `Score: ${riskData.overallRiskScore}` : 'Assessing'}
              </Badge>
            </div>
            <Progress value={riskData?.overallRiskScore ? 100 - (riskData.overallRiskScore * 4) : 0} className="h-2" />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Organizational Readiness</span>
              <Badge variant={changeData?.overallReadiness === "Ready" || changeData?.overallReadiness === "Advanced" ? "default" : "secondary"}>
                {changeData?.overallReadiness || 'Evaluating'}
              </Badge>
            </div>
            <Progress value={changeData?.readinessScore || 0} className="h-2" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Key Actions Required</CardTitle>
          <CardDescription>Executive decisions and interventions needed</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {riskData?.topRisks.slice(0, 3).map((risk, index) => (
              <div key={index} className="flex items-start space-x-2 p-3 rounded-lg bg-red-50 dark:bg-red-900/20">
                <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium">{risk.title}</p>
                  <p className="text-xs text-muted-foreground">Owner: {risk.riskOwner}</p>
                </div>
                <Badge variant="destructive" className="text-xs">
                  {risk.riskRating}
                </Badge>
              </div>
            ))}
            
            {changeData?.executiveActions?.slice(0, 2).map((action, index) => (
              <div key={index} className="flex items-start space-x-2 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                <Target className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium">{action}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Value Realization Dashboard
function ValueRealizationDashboard({ data }: { data?: ExecutiveValueDashboard }) {
  if (!data) return <EmptyState message="No value realization data available" />

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Top Performing Metrics</CardTitle>
            <CardDescription>Leading indicators of success</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.topPerformingMetrics.map((metric, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-green-50 dark:bg-green-900/20">
                  <div className="flex items-center space-x-3">
                    <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
                    <div>
                      <p className="text-sm font-medium">{metric.metric.name}</p>
                      <p className="text-xs text-muted-foreground">{metric.impact}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-green-600 dark:text-green-400">
                      +{metric.improvement}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Underperforming Metrics</CardTitle>
            <CardDescription>Areas requiring executive attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.underperformingMetrics.map((metric, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-red-50 dark:bg-red-900/20">
                  <div className="flex items-center space-x-3">
                    <TrendingDown className="h-5 w-5 text-red-600 dark:text-red-400" />
                    <div>
                      <p className="text-sm font-medium">{metric.metric.name}</p>
                      <p className="text-xs text-muted-foreground">{metric.actionRequired}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-red-600 dark:text-red-400">
                      -{metric.gap}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>ROI Trend Analysis</CardTitle>
          <CardDescription>Quarterly performance tracking</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.quarterlyTrend.map((quarter, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <span className="text-sm font-medium w-20">{quarter.quarter}</span>
                  <Progress value={(quarter.roi / 300) * 100} className="w-48 h-2" />
                </div>
                <div className="flex items-center space-x-4 text-sm">
                  <span>ROI: {quarter.roi}%</span>
                  <span className="text-muted-foreground">
                    Investment: {formatCurrency(quarter.investment)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Risk Management Dashboard
function RiskManagementDashboard({ data }: { data?: ExecutiveRiskDashboard }) {
  if (!data) return <EmptyState message="No risk management data available" />

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Compliance Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {data.complianceStatus.compliant ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                )}
                <span className="font-medium">
                  {data.complianceStatus.compliant ? 'Compliant' : 'Non-Compliant'}
                </span>
              </div>
              <Badge variant={data.complianceStatus.compliant ? "default" : "destructive"}>
                {data.complianceStatus.exceptions} exceptions
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Mitigation Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Progress value={data.mitigationProgress.percentComplete} className="h-2" />
              <div className="flex justify-between text-sm">
                <span>{data.mitigationProgress.completed} completed</span>
                <span className="text-red-600">{data.mitigationProgress.overdue} overdue</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Next Audit</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <span className="font-medium">
                {new Date(data.complianceStatus.nextAudit).toLocaleDateString()}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Risk by Category</CardTitle>
          <CardDescription>Enterprise risk distribution and trends</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Object.entries(data.risksByCategory).map(([category, info]) => (
              <div key={category} className="flex items-center justify-between">
                <div className="flex items-center space-x-3 flex-1">
                  <span className="text-sm font-medium w-32">{category}</span>
                  <Progress 
                    value={100 - (info.averageScore * 4)} 
                    className="flex-1 h-2" 
                  />
                </div>
                <div className="flex items-center space-x-2 ml-4">
                  <Badge variant={info.averageScore <= 10 ? "default" : "secondary"}>
                    Score: {info.averageScore}
                  </Badge>
                  <TrendIndicator trend={info.trend} />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Top Enterprise Risks</CardTitle>
          <CardDescription>Critical risks requiring executive attention</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {data.topRisks.map((risk, index) => (
              <div key={index} className="p-4 rounded-lg border bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <h4 className="text-sm font-semibold">{risk.title}</h4>
                    <p className="text-xs text-muted-foreground">{risk.description}</p>
                    <div className="flex items-center space-x-4 mt-2">
                      <span className="text-xs">Owner: {risk.riskOwner}</span>
                      <Badge variant="destructive" className="text-xs">
                        Score: {risk.residualRiskScore}
                      </Badge>
                      {risk.escalationRequired && (
                        <Badge variant="outline" className="text-xs">
                          Escalation Required
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Change Readiness Dashboard
function ChangeReadinessDashboard({ data }: { data?: ExecutiveChangeReadinessSummary }) {
  if (!data) return <EmptyState message="No change readiness data available" />

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Change Readiness Assessment</CardTitle>
          <CardDescription>
            Overall Status: <span className="font-semibold">{data.overallReadiness}</span>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center space-y-2">
            <div className="text-4xl font-bold">{data.readinessScore}%</div>
            <p className="text-sm text-muted-foreground">{data.recommendedApproach}</p>
            <p className="text-sm">Time to Readiness: <span className="font-medium">{data.estimatedTimeToReadiness}</span></p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-semibold mb-3">Key Strengths</h4>
              <div className="space-y-2">
                {data.keyStrengths.map((strength, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">{strength}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold mb-3">Critical Gaps</h4>
              <div className="space-y-2">
                {data.criticalGaps.map((gap, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                    <span className="text-sm">{gap}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20">
            <h4 className="text-sm font-semibold mb-2">Investment Required</h4>
            <p className="text-2xl font-bold">
              {formatCurrency(data.investmentRequired.lowEstimate)} - {formatCurrency(data.investmentRequired.highEstimate)}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Expected ROI: {data.expectedROI}
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-3">Executive Actions Required</h4>
            <div className="space-y-2">
              {data.executiveActions.map((action, index) => (
                <div key={index} className="flex items-start space-x-2 p-3 rounded-lg bg-muted">
                  <span className="text-sm font-medium text-muted-foreground mr-2">{index + 1}.</span>
                  <span className="text-sm">{action}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Helper Components
function MetricCard({
  title,
  value,
  icon: Icon,
  trend,
  trendValue,
  status,
  subtitle
}: {
  title: string
  value: string | number
  icon: React.ElementType
  trend?: 'up' | 'down'
  trendValue?: string
  status?: 'success' | 'warning' | 'danger'
  subtitle?: string
}) {
  const statusColors = {
    success: 'text-green-600 bg-green-50 dark:bg-green-900/20',
    warning: 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20',
    danger: 'text-red-600 bg-red-50 dark:bg-red-900/20'
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className={`h-4 w-4 ${status ? statusColors[status].split(' ')[0] : 'text-muted-foreground'}`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
        {trend && trendValue && (
          <div className="flex items-center text-xs mt-1">
            {trend === 'up' ? (
              <ArrowUpRight className="h-3 w-3 text-green-600 mr-1" />
            ) : (
              <ArrowDownRight className="h-3 w-3 text-red-600 mr-1" />
            )}
            <span className={trend === 'up' ? 'text-green-600' : 'text-red-600'}>
              {trendValue}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function TrendIndicator({ trend }: { trend: string }) {
  if (trend === 'Increasing') {
    return <ArrowUpRight className="h-4 w-4 text-red-600" />
  } else if (trend === 'Decreasing') {
    return <ArrowDownRight className="h-4 w-4 text-green-600" />
  }
  return <span className="text-xs text-muted-foreground">Stable</span>
}

function EmptyState({ message }: { message: string }) {
  return (
    <Card className="p-12">
      <div className="text-center text-muted-foreground">
        <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-20" />
        <p>{message}</p>
      </div>
    </Card>
  )
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value)
}