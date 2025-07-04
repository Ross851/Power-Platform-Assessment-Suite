'use client'

import React from 'react'
import dynamic from 'next/dynamic'
// Use UI components instead of Flowbite for now
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { 
  HiShieldCheck, 
  HiLightningBolt, 
  HiChartBar, 
  HiTrendingUp,
  HiExternalLink,
  HiSparkles,
  HiClock,
  HiBadgeCheck
} from 'react-icons/hi'
import { assessmentPillars } from '@/lib/microsoft-2025-assessment-framework'
import { Badge } from '@/components/ui/badge'

interface Microsoft2025IntegrationProps {
  className?: string
  showOnlyButton?: boolean
}

export function Microsoft2025Integration({ className, showOnlyButton = false }: Microsoft2025IntegrationProps) {
  if (showOnlyButton) {
    return (
      <div className="space-y-3">
        <Link href="/microsoft-2025-demo" className="block">
          <Button className="w-full" variant="default">
            <HiTrendingUp className="mr-2 h-4 w-4" />
            Start 2025 Assessment
          </Button>
        </Link>
        <Link href="/enterprise-demo" className="block">
          <Button className="w-full" variant="outline">
            <HiExternalLink className="mr-2 h-4 w-4" />
            View Enterprise Demo
          </Button>
        </Link>
      </div>
    )
  }
  const features = [
    {
      icon: HiShieldCheck,
      title: "Security Hub Scoring",
      description: "Low/Medium/High ratings aligned with Microsoft's Security Hub",
      color: "text-blue-600"
    },
    {
      icon: HiChartBar,
      title: "5-Level Maturity Model",
      description: "From Initial to Efficient based on Microsoft's official framework",
      color: "text-purple-600"
    },
    {
      icon: HiLightningBolt,
      title: "Real-time Scoring",
      description: "Instant feedback as you complete the assessment",
      color: "text-amber-600"
    },
    {
      icon: HiBadgeCheck,
      title: "Compliance Ready",
      description: "Automated compliance gap analysis and certification readiness",
      color: "text-green-600"
    }
  ]

  const stats = [
    { label: "Assessment Pillars", value: assessmentPillars.length },
    { label: "Total Questions", value: assessmentPillars.reduce((acc, p) => acc + p.questions.length, 0) },
    { label: "Critical Controls", value: assessmentPillars.flatMap(p => p.questions).filter(q => q.required).length },
    { label: "Maturity Levels", value: 5 }
  ]

  return (
    <Card className={className}>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <HiSparkles className="w-6 h-6 text-purple-600" />
              <h3 className="text-xl font-bold">Microsoft 2025 Assessment Framework</h3>
              <Badge variant="secondary" className="ml-2">NEW</Badge>
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              Latest Power Platform governance standards based on Microsoft's 2025 guidance
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <HiClock className="w-4 h-4" />
            <span>30-45 min</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {stats.map((stat, index) => (
            <div key={index} className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div key={index} className="flex items-start gap-3">
                <div className={`flex-shrink-0 ${feature.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 dark:text-white">{feature.title}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{feature.description}</p>
                </div>
              </div>
            )
          })}
        </div>

        {/* Assessment Pillars */}
        <div className="mb-6">
          <h4 className="font-medium text-gray-900 dark:text-white mb-3">Assessment Pillars:</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {assessmentPillars.map((pillar) => (
              <div key={pillar.id} className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 bg-blue-600 rounded-full" />
                <span className="text-gray-700 dark:text-gray-300">{pillar.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Key Benefits */}
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mb-6">
          <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Key Benefits:</h4>
          <ul className="space-y-1 text-sm text-blue-800 dark:text-blue-200">
            <li>• Aligns with Microsoft's latest Security Hub scoring methodology</li>
            <li>• Includes 2025 requirements: CoE monthly updates, data exfiltration prevention</li>
            <li>• Automated executive reports for board-level presentations</li>
            <li>• WCAG 2.2 Level AA compliance validation built-in</li>
          </ul>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Link href="/microsoft-2025-demo" className="flex-1">
            <Button color="blue" className="w-full">
              <HiTrendingUp className="mr-2 h-4 w-4" />
              Start 2025 Assessment
            </Button>
          </Link>
          <Link href="/enterprise-demo">
            <Button color="gray">
              <HiExternalLink className="mr-2 h-4 w-4" />
              View Demo
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  )
}