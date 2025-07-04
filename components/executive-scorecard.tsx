'use client'

import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
  Area,
  AreaChart
} from 'recharts'

interface GovernanceMetric {
  category: string
  current: number
  target: number
  benchmark: number
}

interface MaturityScore {
  dimension: string
  score: number
  level: 'Initial' | 'Developing' | 'Defined' | 'Managed' | 'Optimized'
}

interface ExecutiveScorecardProps {
  governanceMetrics?: GovernanceMetric[]
  maturityScores?: MaturityScore[]
  complianceScore?: number
  innovationIndex?: number
  valueRealization?: number
  riskScore?: number
}

export function ExecutiveScorecard({
  governanceMetrics = defaultGovernanceMetrics,
  maturityScores = defaultMaturityScores,
  complianceScore = 92,
  innovationIndex = 75,
  valueRealization = 210,
  riskScore = 12
}: ExecutiveScorecardProps) {
  // Prepare data for radar chart
  const radarData = governanceMetrics.map(metric => ({
    category: metric.category,
    current: metric.current,
    target: metric.target,
    benchmark: metric.benchmark
  }))

  // Prepare data for maturity chart
  const maturityData = maturityScores.map(score => ({
    dimension: score.dimension,
    score: score.score,
    gap: 100 - score.score
  }))

  return (
    <div className="space-y-6">
      {/* Executive Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard
          title="Governance Maturity"
          value={calculateAverageMaturity(maturityScores)}
          subtitle="Platform governance maturity level"
          status={getMaturityStatus(calculateAverageMaturity(maturityScores))}
        />
        
        <SummaryCard
          title="Compliance Score"
          value={`${complianceScore}%`}
          subtitle="Regulatory compliance rating"
          status={complianceScore >= 90 ? 'success' : complianceScore >= 70 ? 'warning' : 'danger'}
        />
        
        <SummaryCard
          title="Innovation Index"
          value={innovationIndex}
          subtitle="Digital innovation capability"
          status={innovationIndex >= 70 ? 'success' : innovationIndex >= 50 ? 'warning' : 'danger'}
        />
        
        <SummaryCard
          title="Value Realization"
          value={`${valueRealization}%`}
          subtitle="Benefits vs. target"
          status={valueRealization >= 150 ? 'success' : valueRealization >= 100 ? 'warning' : 'danger'}
        />
      </div>

      {/* Governance Radar Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Governance Performance Radar</CardTitle>
          <CardDescription>
            Current performance vs. targets and industry benchmarks
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid strokeDasharray="3 3" />
                <PolarAngleAxis dataKey="category" className="text-xs" />
                <PolarRadiusAxis angle={90} domain={[0, 100]} />
                <Radar
                  name="Current"
                  dataKey="current"
                  stroke="#3b82f6"
                  fill="#3b82f6"
                  fillOpacity={0.3}
                  strokeWidth={2}
                />
                <Radar
                  name="Target"
                  dataKey="target"
                  stroke="#10b981"
                  fill="#10b981"
                  fillOpacity={0.2}
                  strokeWidth={2}
                  strokeDasharray="5 5"
                />
                <Radar
                  name="Benchmark"
                  dataKey="benchmark"
                  stroke="#f59e0b"
                  fill="#f59e0b"
                  fillOpacity={0.1}
                  strokeWidth={2}
                  strokeDasharray="3 3"
                />
                <Tooltip />
                <Legend />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Maturity Assessment */}
        <Card>
          <CardHeader>
            <CardTitle>Digital Maturity Assessment</CardTitle>
            <CardDescription>
              Power Platform capability maturity by dimension
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={maturityData} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" domain={[0, 100]} />
                  <YAxis dataKey="dimension" type="category" width={100} className="text-xs" />
                  <Tooltip />
                  <Bar dataKey="score" fill="#3b82f6" name="Current Score" />
                  <Bar dataKey="gap" fill="#e5e7eb" name="Gap to Target" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 space-y-2">
              {maturityScores.map((score, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <span>{score.dimension}</span>
                  <Badge variant={getMaturityBadgeVariant(score.level)}>
                    {score.level}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Strategic KPIs */}
        <Card>
          <CardHeader>
            <CardTitle>Strategic KPI Trends</CardTitle>
            <CardDescription>
              Quarterly performance indicators
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={kpiTrendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="quarter" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="adoption" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    name="User Adoption (%)"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="productivity" 
                    stroke="#10b981" 
                    strokeWidth={2}
                    name="Productivity Index"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="innovation" 
                    stroke="#f59e0b" 
                    strokeWidth={2}
                    name="Innovation Score"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-blue-600">+45%</p>
                <p className="text-xs text-muted-foreground">Adoption Growth</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-green-600">+32%</p>
                <p className="text-xs text-muted-foreground">Productivity Gain</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-amber-600">+28%</p>
                <p className="text-xs text-muted-foreground">Innovation Increase</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Investment vs Value Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Investment vs. Value Realization</CardTitle>
          <CardDescription>
            Cumulative investment and benefits over time
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={investmentValueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={(value) => `$${value / 1000}k`} />
                <Tooltip formatter={(value: number) => `$${(value / 1000).toFixed(0)}k`} />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="investment"
                  stackId="1"
                  stroke="#ef4444"
                  fill="#ef4444"
                  fillOpacity={0.3}
                  name="Cumulative Investment"
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stackId="2"
                  stroke="#10b981"
                  fill="#10b981"
                  fillOpacity={0.3}
                  name="Realized Value"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 p-4 rounded-lg bg-green-50 dark:bg-green-900/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">ROI Achievement</p>
                <p className="text-2xl font-bold text-green-600">{valueRealization}%</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">Payback Period</p>
                <p className="text-2xl font-bold">14 months</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">Net Benefit</p>
                <p className="text-2xl font-bold text-green-600">$2.4M</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Executive Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Strategic Recommendations</CardTitle>
          <CardDescription>
            Board-level actions to optimize Power Platform value
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {strategicRecommendations.map((rec, index) => (
              <div key={index} className="p-4 rounded-lg border bg-muted/50">
                <div className="flex items-start space-x-3">
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-white font-bold",
                    rec.priority === 'Critical' ? 'bg-red-600' :
                    rec.priority === 'High' ? 'bg-amber-600' : 'bg-blue-600'
                  )}>
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm">{rec.title}</h4>
                    <p className="text-xs text-muted-foreground mt-1">{rec.description}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant={rec.priority === 'Critical' ? 'destructive' : 'default'}>
                        {rec.priority}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        Impact: {rec.impact}
                      </span>
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

// Helper Components
function SummaryCard({
  title,
  value,
  subtitle,
  status
}: {
  title: string
  value: string | number
  subtitle: string
  status: 'success' | 'warning' | 'danger'
}) {
  const statusColors = {
    success: 'border-green-200 bg-green-50 dark:bg-green-900/20',
    warning: 'border-amber-200 bg-amber-50 dark:bg-amber-900/20',
    danger: 'border-red-200 bg-red-50 dark:bg-red-900/20'
  }

  return (
    <Card className={cn('border-2', statusColors[status])}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
      </CardContent>
    </Card>
  )
}

// Helper functions
function calculateAverageMaturity(scores: MaturityScore[]): string {
  const avg = scores.reduce((sum, score) => sum + score.score, 0) / scores.length
  if (avg >= 80) return 'Optimized'
  if (avg >= 60) return 'Managed'
  if (avg >= 40) return 'Defined'
  if (avg >= 20) return 'Developing'
  return 'Initial'
}

function getMaturityStatus(level: string): 'success' | 'warning' | 'danger' {
  if (level === 'Optimized' || level === 'Managed') return 'success'
  if (level === 'Defined') return 'warning'
  return 'danger'
}

function getMaturityBadgeVariant(level: string): "default" | "secondary" | "destructive" {
  if (level === 'Optimized' || level === 'Managed') return 'default'
  if (level === 'Defined' || level === 'Developing') return 'secondary'
  return 'destructive'
}

// Default data
const defaultGovernanceMetrics: GovernanceMetric[] = [
  { category: 'Strategic Alignment', current: 85, target: 90, benchmark: 75 },
  { category: 'Risk Management', current: 78, target: 85, benchmark: 70 },
  { category: 'Value Delivery', current: 92, target: 95, benchmark: 80 },
  { category: 'Resource Optimization', current: 70, target: 80, benchmark: 65 },
  { category: 'Performance Measurement', current: 82, target: 90, benchmark: 75 },
  { category: 'Stakeholder Engagement', current: 88, target: 90, benchmark: 85 }
]

const defaultMaturityScores: MaturityScore[] = [
  { dimension: 'Technology', score: 75, level: 'Managed' },
  { dimension: 'Process', score: 68, level: 'Defined' },
  { dimension: 'People', score: 62, level: 'Defined' },
  { dimension: 'Governance', score: 80, level: 'Managed' },
  { dimension: 'Culture', score: 55, level: 'Developing' }
]

const kpiTrendData = [
  { quarter: 'Q1 2023', adoption: 25, productivity: 100, innovation: 40 },
  { quarter: 'Q2 2023', adoption: 35, productivity: 112, innovation: 45 },
  { quarter: 'Q3 2023', adoption: 48, productivity: 125, innovation: 52 },
  { quarter: 'Q4 2023', adoption: 58, productivity: 132, innovation: 58 },
  { quarter: 'Q1 2024', adoption: 70, productivity: 145, innovation: 68 }
]

const investmentValueData = [
  { month: 'Jan', investment: 100000, value: 50000 },
  { month: 'Feb', investment: 180000, value: 120000 },
  { month: 'Mar', investment: 250000, value: 200000 },
  { month: 'Apr', investment: 320000, value: 300000 },
  { month: 'May', investment: 380000, value: 420000 },
  { month: 'Jun', investment: 440000, value: 580000 },
  { month: 'Jul', investment: 500000, value: 750000 },
  { month: 'Aug', investment: 550000, value: 920000 },
  { month: 'Sep', investment: 600000, value: 1100000 },
  { month: 'Oct', investment: 650000, value: 1300000 },
  { month: 'Nov', investment: 700000, value: 1520000 },
  { month: 'Dec', investment: 750000, value: 1750000 }
]

const strategicRecommendations = [
  {
    title: "Accelerate Citizen Developer Program",
    description: "Expand training and certification to achieve 30% employee participation target",
    priority: "Critical",
    impact: "$3M annual productivity gains"
  },
  {
    title: "Establish Innovation Lab",
    description: "Create dedicated Power Platform innovation center for strategic experiments",
    priority: "High",
    impact: "5x innovation velocity"
  },
  {
    title: "Implement Advanced Governance",
    description: "Deploy AI-powered governance tools to reduce risk while enabling scale",
    priority: "High",
    impact: "40% risk reduction"
  },
  {
    title: "Strategic Partnership Program",
    description: "Develop ecosystem partnerships for industry-specific solutions",
    priority: "Medium",
    impact: "New revenue streams"
  }
]