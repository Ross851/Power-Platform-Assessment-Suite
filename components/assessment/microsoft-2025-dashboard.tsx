'use client'

import React, { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
// Dynamic imports for Flowbite components to avoid build issues
const Card = dynamic(() => import('flowbite-react').then(mod => mod.Card), { ssr: false })
const Badge = dynamic(() => import('flowbite-react').then(mod => mod.Badge), { ssr: false })
const Progress = dynamic(() => import('flowbite-react').then(mod => mod.Progress), { ssr: false })
const Alert = dynamic(() => import('flowbite-react').then(mod => mod.Alert), { ssr: false })
const Button = dynamic(() => import('flowbite-react').then(mod => mod.Button), { ssr: false })
const Tabs = dynamic(() => import('flowbite-react').then(mod => mod.Tabs), { ssr: false })
const Tooltip = dynamic(() => import('flowbite-react').then(mod => mod.Tooltip), { ssr: false })
import {
  HiShieldCheck,
  HiLockClosed,
  HiServer,
  HiLightningBolt,
  HiCog,
  HiSparkles,
  HiExclamation,
  HiCheckCircle,
  HiTrendingUp,
  HiDocumentReport,
  HiInformationCircle,
  HiBadgeCheck,
  HiChartBar,
  HiClipboardList,
  HiRefresh
} from 'react-icons/hi'
import { 
  assessmentPillars, 
  calculateSecurityScore, 
  calculateMaturityLevel,
  performComplianceCheck,
  getPillarScores,
  type SecurityScoreResult
} from '@/lib/microsoft-2025-assessment-framework'
import { ClientEnhancedQuestionWithGuidance } from './client-enhanced-question'
import { enhancedGovernanceQuestions } from '@/lib/microsoft-2025-assessment-enhanced'
import { cn } from '@/lib/utils'
import { HiLightBulb } from 'react-icons/hi'

const ApexChart = dynamic(() => import('react-apexcharts'), { ssr: false })

interface Microsoft2025DashboardProps {
  responses: Record<string, any>
  onResponseChange: (questionId: string, value: any) => void
}

export function Microsoft2025Dashboard({ responses, onResponseChange }: Microsoft2025DashboardProps) {
  const [activeTab, setActiveTab] = useState('overview')
  const [securityScore, setSecurityScore] = useState<SecurityScoreResult | null>(null)
  const [maturityLevel, setMaturityLevel] = useState<any>(null)
  const [complianceStatus, setComplianceStatus] = useState<any>(null)
  const [pillarScores, setPillarScores] = useState<Record<string, number>>({})
  const [lastUpdated, setLastUpdated] = useState(new Date())

  // Calculate scores whenever responses change
  useEffect(() => {
    setSecurityScore(calculateSecurityScore(responses))
    setMaturityLevel(calculateMaturityLevel(responses))
    setComplianceStatus(performComplianceCheck(responses))
    setPillarScores(getPillarScores(responses))
    setLastUpdated(new Date())
  }, [responses])

  const getSecurityBadgeColor = (score: 'Low' | 'Medium' | 'High') => {
    switch (score) {
      case 'High': return 'success'
      case 'Medium': return 'warning'
      case 'Low': return 'failure'
    }
  }

  const getPillarIcon = (pillarId: string) => {
    const iconMap: Record<string, React.ElementType> = {
      governance: HiShieldCheck,
      security: HiLockClosed,
      reliability: HiServer,
      performance: HiLightningBolt,
      operations: HiCog,
      experience: HiSparkles
    }
    return iconMap[pillarId] || HiInformationCircle
  }

  // Microsoft's expected baseline scores for mature organizations
  const microsoftExpectedScores: Record<string, number> = {
    governance: 80,
    security: 85,
    reliability: 75,
    performance: 70,
    operations: 75,
    experience: 80
  }

  // Calculate gaps
  const calculateGap = (pillarId: string) => {
    const current = pillarScores[pillarId] || 0
    const expected = microsoftExpectedScores[pillarId] || 80
    return expected - current
  }

  // Prepare radar chart data with gap analysis
  const radarChartOptions: ApexCharts.ApexOptions = {
    chart: {
      type: 'radar',
      toolbar: { show: false }
    },
    xaxis: {
      categories: assessmentPillars.map(p => `${p.name}\n(Gap: ${calculateGap(p.id).toFixed(0)}%)`)
    },
    yaxis: {
      show: true,
      max: 100,
      tickAmount: 5,
      labels: {
        formatter: (val) => `${val}%`
      }
    },
    plotOptions: {
      radar: {
        polygons: {
          strokeColors: '#e5e7eb',
          strokeWidth: 1,
          fill: {
            colors: ['#f3f4f6', '#ffffff']
          }
        }
      }
    },
    markers: {
      size: 4,
      colors: ['#3b82f6', '#10b981'],
      strokeColors: '#fff',
      strokeWidth: 2
    },
    fill: {
      opacity: 0.2,
      colors: ['#3b82f6', '#10b981']
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['#3b82f6', '#10b981'],
      dashArray: [0, 4]
    },
    legend: {
      show: true,
      position: 'bottom'
    },
    dataLabels: {
      enabled: true,
      background: {
        enabled: true,
        foreColor: '#000',
        padding: 4,
        borderRadius: 2,
        borderWidth: 1,
        borderColor: '#fff'
      },
      formatter: (val) => `${val}%`
    }
  }

  const radarChartSeries = [
    {
      name: 'Current Score',
      data: assessmentPillars.map(p => pillarScores[p.id] || 0)
    },
    {
      name: 'Microsoft Expected',
      data: assessmentPillars.map(p => microsoftExpectedScores[p.id] || 80)
    }
  ]

  return (
    <div className="space-y-6">
      {/* Header with Security Score */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">
              Microsoft 2025 Power Platform Assessment
            </h1>
            <p className="opacity-90">
              Based on latest Microsoft Well-Architected Framework and Security Standards
            </p>
          </div>
          <div className="text-center">
            <div className="text-sm opacity-75 mb-1">Security Score</div>
            <Badge 
              size="xl" 
              color={securityScore ? getSecurityBadgeColor(securityScore.score) : 'gray'}
              className="text-2xl px-6 py-2"
            >
              {securityScore?.score || 'Calculating...'}
            </Badge>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="text-center">
          <div className="space-y-2">
            <HiChartBar className="w-10 h-10 text-blue-600 mx-auto" />
            <h3 className="text-2xl font-bold">{maturityLevel?.level || '-'}/5</h3>
            <p className="text-sm text-gray-600">Maturity Level</p>
            <p className="text-xs font-medium text-blue-600">{maturityLevel?.name}</p>
          </div>
        </Card>

        <Card className="text-center">
          <div className="space-y-2">
            <HiBadgeCheck className="w-10 h-10 text-green-600 mx-auto" />
            <h3 className="text-2xl font-bold">{complianceStatus?.score || 0}%</h3>
            <p className="text-sm text-gray-600">Compliance Score</p>
            <p className="text-xs font-medium text-green-600">
              {complianceStatus?.compliant ? 'Compliant' : 'Non-Compliant'}
            </p>
          </div>
        </Card>

        <Card className="text-center">
          <div className="space-y-2">
            <HiTrendingUp className="w-10 h-10 text-purple-600 mx-auto" />
            <h3 className="text-2xl font-bold">{maturityLevel?.score || 0}%</h3>
            <p className="text-sm text-gray-600">Overall Score</p>
            <p className="text-xs font-medium text-purple-600">
              {maturityLevel?.nextLevelGap}% to next level
            </p>
          </div>
        </Card>

        <Card className="text-center">
          <div className="space-y-2">
            <HiRefresh className="w-10 h-10 text-amber-600 mx-auto" />
            <h3 className="text-2xl font-bold">
              {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </h3>
            <p className="text-sm text-gray-600">Last Updated</p>
            <p className="text-xs font-medium text-amber-600">Real-time scoring</p>
          </div>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs>
        <Tabs.Item title="Overview" icon={HiChartBar} active={activeTab === 'overview'}>
          <div className="space-y-6">
            {/* Radar Chart with Gap Analysis */}
            <Card>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Gap Analysis vs Microsoft Standards</h3>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                      <span>Current</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                      <span>Expected</span>
                    </div>
                  </div>
                </div>
                <div className="h-[400px]">
                  <ApexChart
                    options={radarChartOptions}
                    series={radarChartSeries}
                    type="radar"
                    height="100%"
                  />
                </div>
                
                {/* Gap Summary */}
                <div className="border-t pt-4">
                  <h4 className="text-sm font-semibold mb-3">Gap Summary</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {assessmentPillars.map(pillar => {
                      const gap = calculateGap(pillar.id)
                      const current = pillarScores[pillar.id] || 0
                      const expected = microsoftExpectedScores[pillar.id] || 80
                      return (
                        <div key={pillar.id} className="text-sm">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-medium">{pillar.name}</span>
                            <Badge 
                              size="xs" 
                              color={gap <= 0 ? 'success' : gap <= 20 ? 'warning' : 'failure'}
                            >
                              {gap <= 0 ? 'Met' : `-${gap.toFixed(0)}%`}
                            </Badge>
                          </div>
                          <div className="text-xs text-gray-600">
                            {current}% / {expected}%
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            </Card>

            {/* Security Recommendations */}
            {securityScore && securityScore.recommendations.length > 0 && (
              <Card>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <HiExclamation className="w-5 h-5 text-amber-600" />
                  Security Recommendations
                </h3>
                <div className="space-y-3">
                  {securityScore.recommendations.map((rec, index) => (
                    <Alert 
                      key={index} 
                      color={rec.impact === 'High' ? 'failure' : rec.impact === 'Medium' ? 'warning' : 'info'}
                      icon={HiShieldCheck}
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{rec.title}</span>
                          <div className="flex gap-2">
                            <Badge size="xs" color={rec.impact === 'High' ? 'failure' : 'warning'}>
                              {rec.impact} Impact
                            </Badge>
                            <Badge size="xs" color="gray">
                              {rec.effort} Effort
                            </Badge>
                          </div>
                        </div>
                        <p className="text-sm">{rec.description}</p>
                        <ul className="text-sm space-y-1">
                          {rec.actionItems.map((action, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <span className="text-gray-400">•</span>
                              <span>{action}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </Alert>
                  ))}
                </div>
              </Card>
            )}

            {/* Maturity Recommendations */}
            {maturityLevel && maturityLevel.recommendations.length > 0 && (
              <Card>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <HiLightBulb className="w-5 h-5 text-blue-600" />
                  Maturity Level Recommendations
                </h3>
                <div className="space-y-2">
                  {maturityLevel.recommendations.map((rec: string, index: number) => (
                    <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                      <span className="text-blue-600 font-bold">{index + 1}.</span>
                      <span className="text-sm">{rec}</span>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>
        </Tabs.Item>

        {/* Assessment Questions by Pillar */}
        {assessmentPillars.map(pillar => {
          const Icon = getPillarIcon(pillar.id)
          return (
            <Tabs.Item 
              key={pillar.id}
              title={pillar.name} 
              icon={Icon}
              active={activeTab === pillar.id}
            >
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-bold">{pillar.name}</h2>
                    <p className="text-gray-600">{pillar.description}</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">
                      {pillarScores[pillar.id] || 0}%
                    </div>
                    <p className="text-sm text-gray-600">Pillar Score</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {pillar.id === 'governance' ? (
                    // Use enhanced questions with guidance for governance
                    enhancedGovernanceQuestions.map((question) => (
                      <ClientEnhancedQuestionWithGuidance
                        key={question.id}
                        question={question}
                        value={responses[question.id] || null}
                        onChange={(value) => onResponseChange(question.id, value)}
                        showBestPractice={true}
                      />
                    ))
                  ) : (
                    // Use regular enhanced questions for other pillars
                    pillar.questions.map((question) => (
                      <ClientEnhancedQuestionWithGuidance
                        key={question.id}
                        question={question}
                        value={responses[question.id] || null}
                        onChange={(value) => onResponseChange(question.id, value)}
                        showBestPractice={true}
                      />
                    ))
                  )}
                </div>
              </div>
            </Tabs.Item>
          )
        })}

        {/* Compliance Tab */}
        <Tabs.Item title="Compliance" icon={HiClipboardList} active={activeTab === 'compliance'}>
          <div className="space-y-6">
            <Card>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">Compliance Status</h3>
                <Badge 
                  size="lg" 
                  color={complianceStatus?.compliant ? 'success' : 'failure'}
                >
                  {complianceStatus?.compliant ? 'Compliant' : 'Non-Compliant'}
                </Badge>
              </div>

              {complianceStatus?.certificationReady && (
                <Alert color="success" icon={HiCheckCircle} className="mb-6">
                  <span className="font-medium">Certification Ready!</span> Your organization meets the requirements for Microsoft Power Platform certification.
                </Alert>
              )}

              {complianceStatus?.gaps && complianceStatus.gaps.length > 0 && (
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-700">Compliance Gaps</h4>
                  {complianceStatus.gaps.map((gap: any, index: number) => (
                    <div key={index} className="border rounded-lg p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{gap.requirement}</span>
                        <Badge color={gap.impact === 'High' ? 'failure' : 'warning'}>
                          {gap.impact} Impact
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex-1">
                          <div className="flex justify-between text-sm mb-1">
                            <span>Current: {gap.current}/5</span>
                            <span>Target: {gap.target}/5</span>
                          </div>
                          <Progress 
                            progress={(gap.current / gap.target) * 100} 
                            color="red"
                            size="sm"
                          />
                        </div>
                      </div>
                      <p className="text-sm text-gray-600">{gap.remediation}</p>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        </Tabs.Item>

        {/* Report Tab */}
        <Tabs.Item title="Report" icon={HiDocumentReport} active={activeTab === 'report'}>
          <Card>
            <h3 className="text-lg font-semibold mb-4">Executive Summary</h3>
            <div className="prose max-w-none">
              <p>
                Based on the Microsoft 2025 Power Platform Assessment Framework, your organization has achieved a 
                <strong> {maturityLevel?.name} (Level {maturityLevel?.level})</strong> maturity level with an overall score 
                of <strong>{maturityLevel?.score}%</strong>.
              </p>
              
              <h4>Key Findings:</h4>
              <ul>
                <li>Security Score: <strong>{securityScore?.score}</strong> ({securityScore?.numericScore}/100)</li>
                <li>Compliance: <strong>{complianceStatus?.compliant ? 'Compliant' : 'Non-Compliant'}</strong> ({complianceStatus?.score}%)</li>
                <li>Certification Ready: <strong>{complianceStatus?.certificationReady ? 'Yes' : 'No'}</strong></li>
              </ul>

              <h4>Pillar Scores:</h4>
              <div className="grid grid-cols-2 gap-4 my-4">
                {assessmentPillars.map(pillar => (
                  <div key={pillar.id} className="flex items-center justify-between p-3 border rounded">
                    <span className="font-medium">{pillar.name}</span>
                    <span className="text-lg font-bold text-blue-600">{pillarScores[pillar.id] || 0}%</span>
                  </div>
                ))}
              </div>

              <h4>Next Steps:</h4>
              <ol>
                {maturityLevel?.recommendations.slice(0, 3).map((rec: string, index: number) => (
                  <li key={index}>{rec}</li>
                ))}
              </ol>

              <div className="mt-6 flex gap-4">
                <Button>
                  <HiDocumentReport className="w-4 h-4 mr-2" />
                  Export Full Report
                </Button>
                <Button color="gray">
                  <HiClipboardList className="w-4 h-4 mr-2" />
                  Generate Action Plan
                </Button>
              </div>
            </div>
          </Card>
        </Tabs.Item>
      </Tabs>
    </div>
  )
}