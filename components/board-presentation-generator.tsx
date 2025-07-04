'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Download,
  FileText,
  Presentation,
  TrendingUp,
  Shield,
  Users,
  DollarSign,
  Target,
  AlertCircle,
  CheckCircle,
  ChevronRight,
  Briefcase,
  BarChart3
} from 'lucide-react'

// Import types from our frameworks
import type { ExecutiveValueDashboard } from '@/lib/business-value-calculator'
import type { ExecutiveRiskDashboard, EnterpriseRisk } from '@/lib/enterprise-risk-framework'
import type { ExecutiveChangeReadinessSummary } from '@/lib/change-readiness-framework'
import type { InvestmentStrategy } from '@/lib/investment-strategy-framework'

interface BoardPresentationGeneratorProps {
  assessmentData: {
    valueData?: ExecutiveValueDashboard
    riskData?: ExecutiveRiskDashboard
    changeData?: ExecutiveChangeReadinessSummary
    investmentData?: InvestmentStrategy
    organizationName?: string
    presentationDate?: Date
  }
}

interface PresentationSlide {
  id: string
  title: string
  type: 'title' | 'executive-summary' | 'strategic-overview' | 'financial' | 'risk' | 'roadmap' | 'recommendation'
  content: any
}

export function BoardPresentationGenerator({ assessmentData }: BoardPresentationGeneratorProps) {
  const [selectedSlides, setSelectedSlides] = useState<string[]>([
    'title',
    'executive-summary',
    'strategic-value',
    'financial-analysis',
    'risk-assessment',
    'change-readiness',
    'investment-strategy',
    'recommendations',
    'next-steps'
  ])

  const slides = generatePresentationSlides(assessmentData)

  const handleExport = (format: 'pdf' | 'pptx') => {
    // In a real implementation, this would generate actual files
    console.log(`Exporting board presentation as ${format}`)
    alert(`Board presentation would be exported as ${format.toUpperCase()}`)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Board Presentation Generator</h2>
          <p className="text-muted-foreground">
            Create executive-ready presentations for board meetings
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => handleExport('pptx')} variant="outline">
            <Presentation className="h-4 w-4 mr-2" />
            Export PowerPoint
          </Button>
          <Button onClick={() => handleExport('pdf')}>
            <FileText className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
        </div>
      </div>

      <Tabs defaultValue="preview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="preview">Presentation Preview</TabsTrigger>
          <TabsTrigger value="customize">Customize Slides</TabsTrigger>
          <TabsTrigger value="talking-points">Executive Talking Points</TabsTrigger>
        </TabsList>

        <TabsContent value="preview" className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {slides
              .filter(slide => selectedSlides.includes(slide.id))
              .map((slide, index) => (
                <PresentationSlide key={slide.id} slide={slide} slideNumber={index + 1} />
              ))}
          </div>
        </TabsContent>

        <TabsContent value="customize" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Select Slides for Presentation</CardTitle>
              <CardDescription>
                Choose which slides to include in your board presentation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {slides.map(slide => (
                  <div key={slide.id} className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id={slide.id}
                      checked={selectedSlides.includes(slide.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedSlides([...selectedSlides, slide.id])
                        } else {
                          setSelectedSlides(selectedSlides.filter(id => id !== slide.id))
                        }
                      }}
                      className="h-4 w-4"
                    />
                    <label htmlFor={slide.id} className="flex-1 cursor-pointer">
                      <span className="font-medium">{slide.title}</span>
                    </label>
                    <Badge variant="outline">{slide.type}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="talking-points" className="space-y-4">
          <ExecutiveTalkingPoints assessmentData={assessmentData} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Individual Slide Component
function PresentationSlide({ slide, slideNumber }: { slide: PresentationSlide; slideNumber: number }) {
  return (
    <Card className="overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">{slide.title}</h3>
          <span className="text-sm opacity-75">Slide {slideNumber}</span>
        </div>
      </div>
      <CardContent className="p-6">
        {renderSlideContent(slide)}
      </CardContent>
    </Card>
  )
}

// Render slide content based on type
function renderSlideContent(slide: PresentationSlide) {
  switch (slide.type) {
    case 'title':
      return <TitleSlide content={slide.content} />
    case 'executive-summary':
      return <ExecutiveSummarySlide content={slide.content} />
    case 'strategic-overview':
      return <StrategicOverviewSlide content={slide.content} />
    case 'financial':
      return <FinancialSlide content={slide.content} />
    case 'risk':
      return <RiskSlide content={slide.content} />
    case 'roadmap':
      return <RoadmapSlide content={slide.content} />
    case 'recommendation':
      return <RecommendationSlide content={slide.content} />
    default:
      return <div>Unknown slide type</div>
  }
}

// Slide Templates
function TitleSlide({ content }: { content: any }) {
  return (
    <div className="text-center py-12">
      <h1 className="text-4xl font-bold mb-4">
        Power Platform Strategic Assessment
      </h1>
      <h2 className="text-2xl text-muted-foreground mb-8">
        {content.organizationName || 'Your Organization'}
      </h2>
      <div className="text-lg text-muted-foreground">
        Board Presentation • {content.date || new Date().toLocaleDateString()}
      </div>
    </div>
  )
}

function ExecutiveSummarySlide({ content }: { content: any }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-4">
          <h4 className="font-semibold text-lg">Strategic Position</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 rounded-lg bg-green-50 dark:bg-green-900/20">
              <span className="font-medium">ROI Achievement</span>
              <span className="font-bold text-green-600">{content.roi}%</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20">
              <span className="font-medium">Digital Maturity</span>
              <span className="font-bold text-blue-600">{content.maturityLevel}</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20">
              <span className="font-medium">Risk Score</span>
              <span className="font-bold text-amber-600">{content.riskScore}/25</span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="font-semibold text-lg">Key Achievements</h4>
          <ul className="space-y-2">
            {content.achievements?.map((achievement: string, index: number) => (
              <li key={index} className="flex items-start space-x-2">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                <span className="text-sm">{achievement}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <Separator />

      <div>
        <h4 className="font-semibold text-lg mb-3">Executive Recommendation</h4>
        <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
          <p className="text-sm leading-relaxed">{content.recommendation}</p>
        </div>
      </div>
    </div>
  )
}

function StrategicOverviewSlide({ content }: { content: any }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        {content.strategicPillars?.map((pillar: any, index: number) => (
          <div key={index} className="text-center p-4 rounded-lg bg-muted">
            <div className="text-3xl font-bold text-blue-600 mb-2">{pillar.value}</div>
            <div className="font-medium">{pillar.label}</div>
            <div className="text-xs text-muted-foreground mt-1">{pillar.description}</div>
          </div>
        ))}
      </div>

      <Separator />

      <div>
        <h4 className="font-semibold mb-3">Strategic Alignment Score</h4>
        <div className="space-y-3">
          {content.alignmentScores?.map((score: any, index: number) => (
            <div key={index} className="flex items-center justify-between">
              <span className="text-sm">{score.objective}</span>
              <div className="flex items-center gap-2">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${score.alignment}%` }}
                  />
                </div>
                <span className="text-sm font-medium w-12 text-right">{score.alignment}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function FinancialSlide({ content }: { content: any }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-4">
          <h4 className="font-semibold">Investment Summary</h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm">Total Investment</span>
              <span className="font-semibold">{formatCurrency(content.totalInvestment)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Realized Benefits</span>
              <span className="font-semibold text-green-600">{formatCurrency(content.realizedBenefits)}</span>
            </div>
            <Separator />
            <div className="flex justify-between">
              <span className="text-sm font-medium">Net Benefit</span>
              <span className="font-bold text-green-600">{formatCurrency(content.netBenefit)}</span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="font-semibold">Key Metrics</h4>
          <div className="grid grid-cols-2 gap-3">
            <div className="text-center p-3 rounded-lg bg-muted">
              <div className="text-2xl font-bold text-green-600">{content.roi}%</div>
              <div className="text-xs text-muted-foreground">ROI</div>
            </div>
            <div className="text-center p-3 rounded-lg bg-muted">
              <div className="text-2xl font-bold">{content.paybackPeriod}mo</div>
              <div className="text-xs text-muted-foreground">Payback</div>
            </div>
            <div className="text-center p-3 rounded-lg bg-muted">
              <div className="text-2xl font-bold">{formatCurrency(content.npv, true)}</div>
              <div className="text-xs text-muted-foreground">NPV</div>
            </div>
            <div className="text-center p-3 rounded-lg bg-muted">
              <div className="text-2xl font-bold">{content.irr}%</div>
              <div className="text-xs text-muted-foreground">IRR</div>
            </div>
          </div>
        </div>
      </div>

      <Separator />

      <div>
        <h4 className="font-semibold mb-3">Value Drivers</h4>
        <div className="space-y-2">
          {content.valueDrivers?.map((driver: any, index: number) => (
            <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted">
              <span className="text-sm">{driver.name}</span>
              <span className="font-semibold">{formatCurrency(driver.value)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function RiskSlide({ content }: { content: any }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        <div>
          <h4 className="font-semibold mb-3">Risk Profile</h4>
          <div className="space-y-2">
            {content.riskCategories?.map((category: any, index: number) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm">{category.name}</span>
                <Badge variant={category.level === 'Low' ? 'default' : category.level === 'Medium' ? 'secondary' : 'destructive'}>
                  {category.level}
                </Badge>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-semibold mb-3">Mitigation Status</h4>
          <div className="text-center p-6 rounded-lg bg-muted">
            <div className="text-3xl font-bold mb-2">{content.mitigationProgress}%</div>
            <div className="text-sm text-muted-foreground">Actions Completed</div>
            <div className="mt-4 text-xs">
              <span className="text-green-600">{content.mitigationStats.completed} Completed</span>
              <span className="mx-2">•</span>
              <span className="text-amber-600">{content.mitigationStats.inProgress} In Progress</span>
              <span className="mx-2">•</span>
              <span className="text-red-600">{content.mitigationStats.notStarted} Not Started</span>
            </div>
          </div>
        </div>
      </div>

      <Separator />

      <div>
        <h4 className="font-semibold mb-3">Top Enterprise Risks</h4>
        <div className="space-y-2">
          {content.topRisks?.map((risk: any, index: number) => (
            <div key={index} className="p-3 rounded-lg border bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium text-sm">{risk.title}</p>
                  <p className="text-xs text-muted-foreground mt-1">Owner: {risk.owner}</p>
                </div>
                <Badge variant="destructive" className="text-xs">
                  Score: {risk.score}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function RoadmapSlide({ content }: { content: any }) {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {content.phases?.map((phase: any, index: number) => (
          <div key={index} className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                {index + 1}
              </div>
            </div>
            <div className="flex-1 pb-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold">{phase.name}</h4>
                <span className="text-sm text-muted-foreground">{phase.timeline}</span>
              </div>
              <p className="text-sm text-muted-foreground mb-3">{phase.description}</p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-medium mb-1">Key Deliverables</p>
                  <ul className="text-xs space-y-1">
                    {phase.deliverables?.map((deliverable: string, i: number) => (
                      <li key={i} className="flex items-start space-x-1">
                        <ChevronRight className="h-3 w-3 mt-0.5" />
                        <span>{deliverable}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-xs font-medium mb-1">Success Metrics</p>
                  <ul className="text-xs space-y-1">
                    {phase.metrics?.map((metric: string, i: number) => (
                      <li key={i} className="flex items-start space-x-1">
                        <Target className="h-3 w-3 mt-0.5" />
                        <span>{metric}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function RecommendationSlide({ content }: { content: any }) {
  return (
    <div className="space-y-6">
      <div className="p-6 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
        <h4 className="font-semibold text-lg mb-3">Board Resolution</h4>
        <p className="text-sm leading-relaxed">{content.resolution}</p>
      </div>

      <div>
        <h4 className="font-semibold mb-3">Strategic Actions</h4>
        <div className="space-y-3">
          {content.actions?.map((action: any, index: number) => (
            <div key={index} className="flex items-start space-x-3">
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold">
                {index + 1}
              </div>
              <div className="flex-1">
                <p className="font-medium">{action.title}</p>
                <p className="text-sm text-muted-foreground mt-1">{action.description}</p>
                <div className="flex items-center gap-4 mt-2 text-xs">
                  <span>Owner: {action.owner}</span>
                  <span>Timeline: {action.timeline}</span>
                  <Badge variant="outline">{action.priority}</Badge>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      <div className="grid grid-cols-3 gap-4 text-center">
        <div>
          <p className="text-2xl font-bold text-green-600">{content.expectedROI}%</p>
          <p className="text-xs text-muted-foreground">Expected ROI</p>
        </div>
        <div>
          <p className="text-2xl font-bold">{content.timeToValue}</p>
          <p className="text-xs text-muted-foreground">Time to Value</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-blue-600">{content.confidenceLevel}%</p>
          <p className="text-xs text-muted-foreground">Success Confidence</p>
        </div>
      </div>
    </div>
  )
}

// Executive Talking Points Component
function ExecutiveTalkingPoints({ assessmentData }: { assessmentData: any }) {
  const talkingPoints = generateTalkingPoints(assessmentData)

  return (
    <div className="space-y-6">
      {talkingPoints.map((section, index) => (
        <Card key={index}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {section.icon}
              {section.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {section.points.map((point, pointIndex) => (
                <div key={pointIndex} className="border-l-4 border-blue-600 pl-4">
                  <h4 className="font-semibold mb-2">{point.heading}</h4>
                  <p className="text-sm text-muted-foreground mb-2">{point.point}</p>
                  {point.supportingData && (
                    <div className="text-xs bg-muted p-2 rounded">
                      <strong>Data:</strong> {point.supportingData}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

// Helper Functions
function generatePresentationSlides(data: any): PresentationSlide[] {
  const slides: PresentationSlide[] = [
    {
      id: 'title',
      title: 'Title Slide',
      type: 'title',
      content: {
        organizationName: data.organizationName,
        date: data.presentationDate
      }
    },
    {
      id: 'executive-summary',
      title: 'Executive Summary',
      type: 'executive-summary',
      content: {
        roi: data.valueData?.overallROI || 'N/A',
        maturityLevel: data.changeData?.overallReadiness || 'Developing',
        riskScore: data.riskData?.overallRiskScore || 'N/A',
        achievements: [
          'Successfully deployed Power Platform governance framework',
          'Achieved positive ROI within 14 months',
          'Reduced operational costs by 32%',
          'Enabled 150+ citizen developers'
        ],
        recommendation: 'Approve Phase 2 expansion of Power Platform initiative with increased investment to accelerate digital transformation and maintain competitive advantage.'
      }
    },
    {
      id: 'strategic-value',
      title: 'Strategic Value Creation',
      type: 'strategic-overview',
      content: {
        strategicPillars: [
          { value: '85%', label: 'Digital Maturity', description: 'Platform adoption rate' },
          { value: '3.2x', label: 'Innovation Velocity', description: 'Faster solution delivery' },
          { value: '$2.4M', label: 'Value Created', description: 'Annual benefit realization' }
        ],
        alignmentScores: [
          { objective: 'Digital Transformation', alignment: 92 },
          { objective: 'Operational Excellence', alignment: 85 },
          { objective: 'Customer Experience', alignment: 78 },
          { objective: 'Employee Empowerment', alignment: 88 }
        ]
      }
    },
    {
      id: 'financial-analysis',
      title: 'Financial Analysis',
      type: 'financial',
      content: {
        totalInvestment: data.valueData?.totalInvestment || 1000000,
        realizedBenefits: data.valueData?.totalBenefitsRealized || 2400000,
        netBenefit: (data.valueData?.totalBenefitsRealized || 2400000) - (data.valueData?.totalInvestment || 1000000),
        roi: data.valueData?.overallROI || 210,
        paybackPeriod: 14,
        npv: 1850000,
        irr: 45,
        valueDrivers: [
          { name: 'Process Automation Savings', value: 850000 },
          { name: 'Productivity Improvements', value: 620000 },
          { name: 'Error Reduction Benefits', value: 430000 },
          { name: 'Revenue Enhancement', value: 500000 }
        ]
      }
    },
    {
      id: 'risk-assessment',
      title: 'Risk Assessment',
      type: 'risk',
      content: {
        riskCategories: [
          { name: 'Strategic Risk', level: 'Low' },
          { name: 'Operational Risk', level: 'Medium' },
          { name: 'Financial Risk', level: 'Low' },
          { name: 'Compliance Risk', level: 'Low' },
          { name: 'Cyber Security Risk', level: 'Medium' }
        ],
        mitigationProgress: data.riskData?.mitigationProgress?.percentComplete || 75,
        mitigationStats: {
          completed: data.riskData?.mitigationProgress?.completed || 12,
          inProgress: 5,
          notStarted: 3
        },
        topRisks: data.riskData?.topRisks?.slice(0, 3).map(risk => ({
          title: risk.title,
          owner: risk.riskOwner,
          score: risk.residualRiskScore
        })) || []
      }
    },
    {
      id: 'change-readiness',
      title: 'Organizational Readiness',
      type: 'strategic-overview',
      content: {
        strategicPillars: [
          { value: `${data.changeData?.readinessScore || 72}%`, label: 'Change Readiness', description: 'Organization preparedness' },
          { value: '82%', label: 'Leadership Support', description: 'Executive engagement' },
          { value: '68%', label: 'Cultural Alignment', description: 'Innovation mindset' }
        ],
        alignmentScores: [
          { objective: 'Leadership Commitment', alignment: 82 },
          { objective: 'Skills & Capabilities', alignment: 65 },
          { objective: 'Technology Readiness', alignment: 78 },
          { objective: 'Governance Structure', alignment: 85 }
        ]
      }
    },
    {
      id: 'investment-strategy',
      title: 'Investment Strategy',
      type: 'roadmap',
      content: {
        phases: [
          {
            name: 'Foundation (Complete)',
            timeline: 'Months 1-6',
            description: 'Platform setup, governance, and initial pilots',
            deliverables: ['Platform operational', 'CoE established', '20+ pilots complete'],
            metrics: ['100% security compliance', '95% pilot success rate']
          },
          {
            name: 'Scale (Current)',
            timeline: 'Months 7-18',
            description: 'Enterprise rollout and value optimization',
            deliverables: ['200+ citizen developers', '50+ production apps', 'Integrated systems'],
            metrics: ['30% adoption rate', '$2M+ annual value']
          },
          {
            name: 'Transform (Proposed)',
            timeline: 'Months 19-36',
            description: 'Innovation and competitive differentiation',
            deliverables: ['AI/ML integration', 'Industry solutions', 'Partner ecosystem'],
            metrics: ['Industry leadership', '400% ROI', 'Self-sustaining']
          }
        ]
      }
    },
    {
      id: 'recommendations',
      title: 'Board Recommendations',
      type: 'recommendation',
      content: {
        resolution: 'The board approves the continued investment in Power Platform as a strategic enabler of digital transformation, authorizing Phase 2 funding of $3M over 18 months to achieve enterprise-scale adoption and industry leadership position.',
        actions: [
          {
            title: 'Approve Phase 2 Investment',
            description: 'Authorize $3M for platform expansion and innovation initiatives',
            owner: 'CFO',
            timeline: 'Immediate',
            priority: 'Critical'
          },
          {
            title: 'Establish Innovation Lab',
            description: 'Create dedicated center for Power Platform experimentation and industry solutions',
            owner: 'CTO',
            timeline: 'Q2 2024',
            priority: 'High'
          },
          {
            title: 'Scale Citizen Developer Program',
            description: 'Expand training to achieve 30% employee participation',
            owner: 'CHRO',
            timeline: 'Q2-Q4 2024',
            priority: 'High'
          },
          {
            title: 'Enhance Governance Framework',
            description: 'Implement AI-powered governance tools for scale',
            owner: 'CIO',
            timeline: 'Q3 2024',
            priority: 'Medium'
          }
        ],
        expectedROI: 400,
        timeToValue: '6 months',
        confidenceLevel: 85
      }
    },
    {
      id: 'next-steps',
      title: 'Next Steps',
      type: 'strategic-overview',
      content: {
        strategicPillars: [
          { value: '30 days', label: 'Decision Timeline', description: 'Board approval required' },
          { value: 'Q2 2024', label: 'Phase 2 Launch', description: 'Implementation start' },
          { value: 'Quarterly', label: 'Progress Reviews', description: 'Board updates' }
        ],
        alignmentScores: [
          { objective: 'Board approval of investment', alignment: 100 },
          { objective: 'Executive sponsor assignments', alignment: 100 },
          { objective: 'Phase 2 team mobilization', alignment: 100 },
          { objective: 'Quarterly board reporting cadence', alignment: 100 }
        ]
      }
    }
  ]

  return slides
}

function generateTalkingPoints(data: any) {
  return [
    {
      title: 'Opening Statement',
      icon: <Briefcase className="h-5 w-5" />,
      points: [
        {
          heading: 'Strategic Context',
          point: 'Power Platform has emerged as our primary digital transformation enabler, delivering exceptional value while positioning us for future competitive advantage.',
          supportingData: `${data.valueData?.overallROI || 210}% ROI achieved, exceeding targets by 60%`
        },
        {
          heading: 'Business Impact',
          point: 'We have fundamentally transformed how our organization approaches process automation and innovation, empowering employees while maintaining governance.',
          supportingData: '150+ citizen developers enabled, 50+ production solutions deployed'
        }
      ]
    },
    {
      title: 'Financial Performance',
      icon: <DollarSign className="h-5 w-5" />,
      points: [
        {
          heading: 'Value Creation',
          point: 'Our Power Platform investment has delivered substantial financial returns, with benefits significantly exceeding costs.',
          supportingData: `$${((data.valueData?.totalBenefitsRealized || 2400000) / 1000000).toFixed(1)}M in realized benefits against $${((data.valueData?.totalInvestment || 1000000) / 1000000).toFixed(1)}M investment`
        },
        {
          heading: 'Future Opportunity',
          point: 'Phase 2 investment will accelerate value creation, with conservative projections showing 400% ROI potential.',
          supportingData: 'Payback period of 14 months, NPV of $1.85M'
        }
      ]
    },
    {
      title: 'Risk Management',
      icon: <Shield className="h-5 w-5" />,
      points: [
        {
          heading: 'Risk Mitigation',
          point: 'We have proactively identified and mitigated enterprise risks, with robust governance ensuring controlled growth.',
          supportingData: `${data.riskData?.mitigationProgress?.percentComplete || 75}% of risk mitigation actions completed`
        },
        {
          heading: 'Compliance Status',
          point: 'Full regulatory compliance maintained with zero violations, positioning us as industry leaders in governed citizen development.',
          supportingData: 'Passed all security audits, zero data breaches'
        }
      ]
    },
    {
      title: 'Strategic Recommendation',
      icon: <Target className="h-5 w-5" />,
      points: [
        {
          heading: 'Investment Decision',
          point: 'I recommend board approval of $3M Phase 2 investment to achieve enterprise scale and industry leadership.',
          supportingData: 'Expected 400% ROI with 85% confidence level'
        },
        {
          heading: 'Competitive Positioning',
          point: 'This investment will establish us as industry leaders in citizen development, creating sustainable competitive advantage.',
          supportingData: 'First-mover advantage in our sector for AI-powered automation'
        }
      ]
    }
  ]
}

function formatCurrency(value: number, compact = false): string {
  if (compact && value >= 1000000) {
    return `$${(value / 1000000).toFixed(1)}M`
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value)
}