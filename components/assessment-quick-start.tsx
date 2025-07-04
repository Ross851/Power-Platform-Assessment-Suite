'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Sparkles, 
  ClipboardCheck, 
  Clock, 
  Users, 
  Target,
  FileText,
  ChevronRight,
  CheckCircle2,
  AlertCircle
} from 'lucide-react'
import Link from 'next/link'

interface QuickStartStep {
  title: string
  description: string
  icon: React.ReactNode
  time?: string
}

const microsoft2025Steps: QuickStartStep[] = [
  {
    title: "1. Gather Stakeholders",
    description: "Invite C-suite executives and key decision makers to participate",
    icon: <Users className="h-4 w-4" />,
    time: "5 min"
  },
  {
    title: "2. Review Strategic Goals",
    description: "Have your 3-year digital transformation roadmap ready",
    icon: <Target className="h-4 w-4" />,
    time: "10 min"
  },
  {
    title: "3. Complete Assessment",
    description: "Answer 30+ strategic questions across 6 pillars",
    icon: <ClipboardCheck className="h-4 w-4" />,
    time: "30 min"
  },
  {
    title: "4. Review Dashboard",
    description: "Analyze maturity scores and compliance gaps",
    icon: <FileText className="h-4 w-4" />,
    time: "15 min"
  },
  {
    title: "5. Generate Executive Report",
    description: "Export board-ready presentations with recommendations",
    icon: <Sparkles className="h-4 w-4" />,
    time: "5 min"
  }
]

const standardSteps: QuickStartStep[] = [
  {
    title: "1. Create Project",
    description: "Set up a new assessment project with your organization details",
    icon: <ClipboardCheck className="h-4 w-4" />,
    time: "2 min"
  },
  {
    title: "2. Select Focus Areas",
    description: "Choose which of the 8 assessment categories to prioritize",
    icon: <Target className="h-4 w-4" />,
    time: "5 min"
  },
  {
    title: "3. Gather Documentation",
    description: "Collect policies, architecture diagrams, and compliance docs",
    icon: <FileText className="h-4 w-4" />,
    time: "15 min"
  },
  {
    title: "4. Complete Assessments",
    description: "Work through questions with your technical team",
    icon: <Users className="h-4 w-4" />,
    time: "60-90 min"
  },
  {
    title: "5. Review & Act",
    description: "Implement recommendations and track improvements",
    icon: <CheckCircle2 className="h-4 w-4" />,
    time: "Ongoing"
  }
]

const prerequisites = {
  microsoft2025: [
    "Executive sponsorship and participation",
    "Current business strategy documentation",
    "Digital transformation roadmap (if available)",
    "30-45 minutes of uninterrupted time"
  ],
  standard: [
    "Access to Power Platform admin center",
    "Current architecture documentation",
    "DLP policies and governance rules",
    "IT team members familiar with your implementation"
  ]
}

export function AssessmentQuickStart() {
  const [expandedTab, setExpandedTab] = useState<string>("microsoft2025")

  const renderSteps = (steps: QuickStartStep[]) => (
    <div className="space-y-3">
      {steps.map((step, index) => (
        <div key={index} className="flex gap-3 p-3 rounded-lg border bg-card">
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            {step.icon}
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <h4 className="font-medium">{step.title}</h4>
              {step.time && (
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {step.time}
                </span>
              )}
            </div>
            <p className="text-sm text-muted-foreground">{step.description}</p>
          </div>
        </div>
      ))}
    </div>
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Start Guides</CardTitle>
        <CardDescription>
          Step-by-step instructions to begin your assessment journey
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={expandedTab} onValueChange={setExpandedTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="microsoft2025" className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              Microsoft 2025
            </TabsTrigger>
            <TabsTrigger value="standard" className="flex items-center gap-2">
              <ClipboardCheck className="h-4 w-4" />
              Standard Assessments
            </TabsTrigger>
          </TabsList>

          <TabsContent value="microsoft2025" className="space-y-6 mt-6">
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-amber-600" />
                Prerequisites
              </h3>
              <ul className="space-y-2">
                {prerequisites.microsoft2025.map((prereq, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                    <span>{prereq}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Getting Started</h3>
              {renderSteps(microsoft2025Steps)}
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800">
              <div>
                <p className="font-medium text-purple-900 dark:text-purple-100">Ready to begin?</p>
                <p className="text-sm text-purple-700 dark:text-purple-300">
                  Launch the Microsoft 2025 Framework assessment
                </p>
              </div>
              <Link href="/microsoft-2025-demo">
                <Button className="bg-purple-600 hover:bg-purple-700">
                  Start Now
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </TabsContent>

          <TabsContent value="standard" className="space-y-6 mt-6">
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-amber-600" />
                Prerequisites
              </h3>
              <ul className="space-y-2">
                {prerequisites.standard.map((prereq, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                    <span>{prereq}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Getting Started</h3>
              {renderSteps(standardSteps)}
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
              <div>
                <p className="font-medium text-blue-900 dark:text-blue-100">Ready to assess?</p>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Begin with your first standard assessment
                </p>
              </div>
              <Button asChild>
                <a href="#standard-assessments">
                  View Assessments
                  <ChevronRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-6 p-4 rounded-lg bg-muted">
          <p className="text-sm text-muted-foreground">
            <strong>Pro Tip:</strong> Save time by using our interactive decision helper above to determine which assessment type best suits your current needs.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}