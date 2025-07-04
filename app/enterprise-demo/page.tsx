'use client'

import React, { useState } from 'react'
import { EnterpriseDashboardLayout } from '@/components/enterprise/dashboard-layout'
import { EnhancedQuestion } from '@/components/assessment/enhanced-question'
import { VisualScoreCard } from '@/components/scoring/visual-score-card'
import { ExecutiveDashboard } from '@/components/executive-dashboard'
import { ExecutiveScorecard } from '@/components/executive-scorecard'
import { BoardPresentationGenerator } from '@/components/board-presentation-generator'
import { Card, Button, Badge, Alert, Tabs } from 'flowbite-react'
import { 
  HiSparkles, 
  HiChartBar, 
  HiClipboardCheck,
  HiPresentationChartBar,
  HiShieldCheck,
  HiLightBulb,
  HiCheckCircle,
  HiTrendingUp
} from 'react-icons/hi'
import { microsoftAlignedQuestions, microsoftAlignedCategories } from '@/lib/microsoft-aligned-questions'
import type { ExecutiveValueDashboard } from '@/lib/business-value-calculator'
import type { ExecutiveRiskDashboard } from '@/lib/enterprise-risk-framework'
import type { ExecutiveChangeReadinessSummary } from '@/lib/change-readiness-framework'
import type { InvestmentStrategy } from '@/lib/investment-strategy-framework'

// Mock data for demonstration
const mockValueData: ExecutiveValueDashboard = {
  overallROI: 245,
  totalInvestment: 1200000,
  totalBenefitsRealized: 2940000,
  topPerformingMetrics: [
    {
      metric: {
        category: 'Operational',
        name: 'Process Cycle Time',
        description: 'End-to-end process completion time',
        unit: 'Hours',
        baseline: 72,
        target: 24
      },
      improvement: 67,
      impact: 'Operational excellence driver'
    },
    {
      metric: {
        category: 'Financial',
        name: 'Cost per Transaction',
        description: 'Average cost to process a single transaction',
        unit: 'USD',
        baseline: 25,
        target: 5
      },
      improvement: 80,
      impact: 'Financial excellence driver'
    }
  ],
  underperformingMetrics: [
    {
      metric: {
        category: 'Employee',
        name: 'Maker Participation Rate',
        description: 'Percentage of employees creating solutions',
        unit: '%',
        baseline: 5,
        target: 25
      },
      gap: 40,
      actionRequired: 'Executive intervention needed'
    }
  ],
  quarterlyTrend: [
    { quarter: 'Q1 2024', roi: 50, investment: 300000, benefits: 450000 },
    { quarter: 'Q2 2024', roi: 120, investment: 600000, benefits: 1320000 },
    { quarter: 'Q3 2024', roi: 180, investment: 900000, benefits: 2520000 },
    { quarter: 'Q4 2024', roi: 245, investment: 1200000, benefits: 2940000 }
  ]
}

const mockRiskData: ExecutiveRiskDashboard = {
  overallRiskScore: 12,
  risksByCategory: {
    Strategic: { count: 2, averageScore: 10, trend: 'Stable' },
    Operational: { count: 3, averageScore: 12, trend: 'Decreasing' },
    Financial: { count: 2, averageScore: 8, trend: 'Stable' },
    Compliance: { count: 2, averageScore: 6, trend: 'Stable' },
    'Cyber Security': { count: 2, averageScore: 14, trend: 'Increasing' },
    'Data Privacy': { count: 2, averageScore: 10, trend: 'Stable' }
  },
  topRisks: [
    {
      id: 'SEC-001',
      category: 'Cyber Security',
      title: 'Citizen Developer Security Breaches',
      description: 'Security vulnerabilities introduced through citizen-developed applications',
      businessImpact: 'Data breaches, ransomware attacks, intellectual property theft',
      likelihood: 'Likely',
      impact: 'Major',
      inherentRiskScore: 16,
      currentControls: [],
      residualRiskScore: 14,
      riskRating: 'High',
      riskTrend: 'Increasing',
      riskOwner: 'Chief Information Security Officer',
      escalationRequired: true,
      boardReportable: true
    }
  ],
  emergingRisks: [],
  mitigationProgress: {
    totalActions: 20,
    completed: 15,
    overdue: 2,
    percentComplete: 75
  },
  complianceStatus: {
    compliant: true,
    exceptions: 1,
    nextAudit: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)
  }
}

const mockChangeData: ExecutiveChangeReadinessSummary = {
  overallReadiness: 'Developing',
  readinessScore: 68,
  keyStrengths: ['Leadership Commitment', 'Technology Infrastructure', 'Clear Vision'],
  criticalGaps: ['Change Management Capability', 'Digital Skills', 'Cultural Resistance'],
  recommendedApproach: 'Phased rollout with continuous capability building',
  estimatedTimeToReadiness: '3-6 months',
  investmentRequired: {
    lowEstimate: 200000,
    highEstimate: 500000
  },
  expectedROI: '200-400% based on industry benchmarks',
  executiveActions: [
    'Appoint executive sponsor and steering committee',
    'Allocate dedicated change management budget',
    'Communicate vision and commitment organization-wide',
    'Establish success metrics and review cadence',
    'Remove organizational barriers to adoption'
  ]
}

const mockInvestmentData: InvestmentStrategy = {
  strategyName: 'Balanced Transformation Strategy',
  timeHorizon: 'Medium-term (1-3 years)',
  totalBudget: 3000000,
  allocationModel: {
    categories: {
      licensing: { percentage: 25, amount: 750000, rationale: 'Core platform capabilities' },
      implementation: { percentage: 20, amount: 600000, rationale: 'Solution development' },
      training: { percentage: 15, amount: 450000, rationale: 'User enablement' },
      centerOfExcellence: { percentage: 15, amount: 450000, rationale: 'Governance and support' },
      innovation: { percentage: 15, amount: 450000, rationale: 'Experimentation' },
      operations: { percentage: 5, amount: 150000, rationale: 'Ongoing support' },
      contingency: { percentage: 5, amount: 150000, rationale: 'Risk mitigation' }
    },
    phasing: []
  },
  fundingApproach: {
    model: 'Hybrid',
    sources: [],
    costRecovery: { enabled: true, model: 'Allocation', timeline: 'Year 2 onwards' }
  },
  investmentPrinciples: [
    'Strategic innovation with controlled risk',
    'Business-led with IT partnership',
    'Continuous learning and adaptation',
    'Value-driven investment decisions'
  ],
  successMetrics: [],
  governanceModel: {
    committeeStructure: [],
    approvalLimits: [],
    reviewCycle: 'Quarterly',
    escalationPath: ['CoE Lead', 'CIO', 'CFO', 'CEO', 'Board']
  }
}

export default function EnterpriseDemoPage() {
  const [activeTab, setActiveTab] = useState('overview')
  const [selectedCategory, setSelectedCategory] = useState(microsoftAlignedCategories[0])
  const [questionResponses, setQuestionResponses] = useState<Record<string, any>>({})

  const handleQuestionChange = (questionId: string, value: any) => {
    setQuestionResponses(prev => ({
      ...prev,
      [questionId]: value
    }))
  }

  const mockScoreData = [
    {
      category: 'Managed Environments',
      score: 85,
      breakdown: [
        { label: 'Production Environments', value: 95, description: 'Fully managed with all security features' },
        { label: 'DLP Policies', value: 88, description: 'Comprehensive policies with weekly updates' },
        { label: 'CMK Encryption', value: 75, description: 'Enabled for sensitive environments' },
        { label: 'Capacity Management', value: 82, description: 'Regular monitoring and optimization' }
      ],
      trend: 'up' as const,
      previousScore: 78,
      target: 90,
      recommendations: [
        'Enable CMK encryption for all production environments',
        'Implement automated capacity forecasting',
        'Review and update DLP policies monthly'
      ]
    },
    {
      category: 'Center of Excellence',
      score: 72,
      breakdown: [
        { label: 'CoE Kit Deployment', value: 90, description: 'All components deployed and configured' },
        { label: 'Automated Discovery', value: 85, description: 'Daily scans with alerting' },
        { label: 'Compliance Workflows', value: 65, description: 'Partial automation implemented' },
        { label: 'Training Program', value: 55, description: 'Basic program in place' }
      ],
      trend: 'up' as const,
      previousScore: 65,
      target: 85,
      recommendations: [
        'Expand maker training and certification program',
        'Fully automate compliance assessment workflows',
        'Implement app quarantine for non-compliant solutions'
      ]
    },
    {
      category: 'Security Baseline',
      score: 78,
      breakdown: [
        { label: 'Conditional Access', value: 92, description: 'MFA and device compliance enforced' },
        { label: 'Tenant Isolation', value: 88, description: 'External sharing blocked' },
        { label: 'IP Restrictions', value: 70, description: 'Configured for production only' },
        { label: 'Auditing', value: 85, description: '90-day retention with Log Analytics' }
      ],
      trend: 'stable' as const,
      previousScore: 78,
      target: 90
    }
  ]

  return (
    <EnterpriseDashboardLayout currentPath="/enterprise-demo">
      <div className="space-y-6">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                Enterprise Power Platform Assessment Suite
              </h1>
              <p className="text-lg opacity-90">
                World-class governance powered by Microsoft best practices and AI intelligence
              </p>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold">245%</div>
              <div className="text-sm opacity-75">ROI Achieved</div>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="text-center">
            <HiCheckCircle className="w-12 h-12 text-green-600 mx-auto mb-2" />
            <h3 className="text-2xl font-bold">92%</h3>
            <p className="text-sm text-gray-600">Compliance Score</p>
          </Card>
          <Card className="text-center">
            <HiShieldCheck className="w-12 h-12 text-blue-600 mx-auto mb-2" />
            <h3 className="text-2xl font-bold">78%</h3>
            <p className="text-sm text-gray-600">Security Baseline</p>
          </Card>
          <Card className="text-center">
            <HiTrendingUp className="w-12 h-12 text-purple-600 mx-auto mb-2" />
            <h3 className="text-2xl font-bold">68%</h3>
            <p className="text-sm text-gray-600">Maturity Score</p>
          </Card>
          <Card className="text-center">
            <HiSparkles className="w-12 h-12 text-amber-600 mx-auto mb-2" />
            <h3 className="text-2xl font-bold">85%</h3>
            <p className="text-sm text-gray-600">AI Confidence</p>
          </Card>
        </div>

        {/* Feature Showcase */}
        <Alert color="info" icon={HiLightBulb}>
          <span className="font-medium">New Features!</span> This demo showcases our enterprise transformation with Flowbite design system, Microsoft-aligned assessments, and AI-powered insights.
        </Alert>

        {/* Main Content Tabs */}
        <Tabs>
          <Tabs.Item 
            title="Assessment Questions" 
            icon={HiClipboardCheck}
            active={activeTab === 'questions'}
          >
            <div className="space-y-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">Microsoft-Aligned Assessment</h2>
                <select 
                  className="rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700"
                  value={selectedCategory.id}
                  onChange={(e) => setSelectedCategory(microsoftAlignedCategories.find(c => c.id === e.target.value)!)}
                >
                  {microsoftAlignedCategories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              
              <div className="space-y-4">
                {selectedCategory.questions.slice(0, 3).map((question) => (
                  <EnhancedQuestion
                    key={question.id}
                    question={question}
                    value={questionResponses[question.id]}
                    onChange={(value) => handleQuestionChange(question.id, value)}
                    showGuidance={true}
                    showBestPractice={true}
                  />
                ))}
              </div>
            </div>
          </Tabs.Item>

          <Tabs.Item 
            title="Visual Scoring" 
            icon={HiChartBar}
            active={activeTab === 'scoring'}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockScoreData.map((data) => (
                <VisualScoreCard
                  key={data.category}
                  {...data}
                />
              ))}
            </div>
          </Tabs.Item>

          <Tabs.Item 
            title="Executive Dashboard" 
            icon={HiPresentationChartBar}
            active={activeTab === 'executive'}
          >
            <ExecutiveDashboard
              valueData={mockValueData}
              riskData={mockRiskData}
              changeData={mockChangeData}
              investmentData={mockInvestmentData}
            />
          </Tabs.Item>

          <Tabs.Item 
            title="Scorecard" 
            icon={HiChartBar}
            active={activeTab === 'scorecard'}
          >
            <ExecutiveScorecard />
          </Tabs.Item>

          <Tabs.Item 
            title="Board Presentation" 
            icon={HiPresentationChartBar}
            active={activeTab === 'presentation'}
          >
            <BoardPresentationGenerator
              assessmentData={{
                valueData: mockValueData,
                riskData: mockRiskData,
                changeData: mockChangeData,
                investmentData: mockInvestmentData,
                organizationName: 'Enterprise Corp',
                presentationDate: new Date()
              }}
            />
          </Tabs.Item>
        </Tabs>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <Card>
            <div className="flex items-center space-x-3 mb-3">
              <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                <HiSparkles className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold">AI-Powered Insights</h3>
            </div>
            <p className="text-sm text-gray-600">
              Intelligent recommendations powered by OpenAI and Microsoft best practices
            </p>
          </Card>
          
          <Card>
            <div className="flex items-center space-x-3 mb-3">
              <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
                <HiShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold">Enterprise Security</h3>
            </div>
            <p className="text-sm text-gray-600">
              MCSB-aligned security assessments with automated compliance checking
            </p>
          </Card>
          
          <Card>
            <div className="flex items-center space-x-3 mb-3">
              <div className="p-2 bg-green-100 text-green-600 rounded-lg">
                <HiPresentationChartBar className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold">Board-Ready Reports</h3>
            </div>
            <p className="text-sm text-gray-600">
              Executive dashboards and automated presentation generation
            </p>
          </Card>
        </div>
      </div>
    </EnterpriseDashboardLayout>
  )
}