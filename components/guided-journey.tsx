'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  ChevronRight, 
  User, 
  FolderPlus, 
  Target,
  Play,
  FileText,
  CheckCircle2,
  Circle,
  ArrowRight,
  Sparkles,
  ClipboardCheck,
  HelpCircle
} from 'lucide-react'
import { useAssessmentStore } from '@/store/assessment-store'
import Link from 'next/link'

interface JourneyStep {
  id: string
  number: number
  title: string
  description: string
  action: string
  icon: React.ReactNode
  isCompleted: () => boolean
  isActive: () => boolean
  onClick?: () => void
  href?: string
}

interface GuidedJourneyProps {
  onProjectCreate: () => void
  onAssessorEdit: () => void
}

export function GuidedJourney({ onProjectCreate, onAssessorEdit }: GuidedJourneyProps) {
  const {
    activeProjectName,
    getActiveProject,
    getAssessmentMetadata,
    getOverallProgress
  } = useAssessmentStore()

  const [assessmentType, setAssessmentType] = useState<'strategic' | 'operational' | null>(null)
  const [showTypeSelector, setShowTypeSelector] = useState(false)

  const activeProject = getActiveProject()
  const metadata = getAssessmentMetadata()
  const progress = getOverallProgress()

  const steps: JourneyStep[] = [
    {
      id: 'project',
      number: 1,
      title: 'Create Your Project',
      description: activeProject ? `Active: ${activeProjectName}` : 'Set up your assessment workspace',
      action: activeProject ? 'Switch Project' : 'Create Project',
      icon: <FolderPlus className="h-5 w-5" />,
      isCompleted: () => !!activeProject,
      isActive: () => !activeProject,
      onClick: onProjectCreate
    },
    {
      id: 'assessor',
      number: 2,
      title: 'Identify Assessor',
      description: metadata ? `${metadata.assessorName} - ${metadata.assessorRole}` : 'Who is conducting this assessment?',
      action: metadata ? 'Update Info' : 'Add Assessor',
      icon: <User className="h-5 w-5" />,
      isCompleted: () => !!metadata,
      isActive: () => !!activeProject && !metadata,
      onClick: onAssessorEdit
    },
    {
      id: 'type',
      number: 3,
      title: 'Choose Assessment Path',
      description: assessmentType ? 
        `${assessmentType === 'strategic' ? 'Strategic Planning' : 'Operational Excellence'} Assessment` : 
        'Select your assessment focus',
      action: assessmentType ? 'Change Type' : 'Select Path',
      icon: <Target className="h-5 w-5" />,
      isCompleted: () => !!assessmentType,
      isActive: () => !!activeProject && !!metadata && !assessmentType,
      onClick: () => setShowTypeSelector(true)
    },
    {
      id: 'assess',
      number: 4,
      title: 'Complete Assessment',
      description: progress > 0 ? `${Math.round(progress)}% Complete` : 'Begin answering questions',
      action: progress > 0 ? 'Continue' : 'Start',
      icon: <Play className="h-5 w-5" />,
      isCompleted: () => progress === 100,
      isActive: () => !!assessmentType && progress < 100,
      href: assessmentType === 'strategic' ? '/microsoft-2025-demo' : '#standard-assessments'
    },
    {
      id: 'export',
      number: 5,
      title: 'Export Results',
      description: 'Generate reports for stakeholders',
      action: 'Export',
      icon: <FileText className="h-5 w-5" />,
      isCompleted: () => false,
      isActive: () => progress === 100,
      href: '#export'
    }
  ]

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Your Assessment Journey</h2>
        <p className="text-muted-foreground">Follow these steps to complete your Power Platform assessment</p>
        <div className="mt-4">
          <Link href="/assessment-guide" className="text-sm text-primary hover:underline inline-flex items-center gap-1">
            <HelpCircle className="h-3 w-3" />
            View detailed assessment guide
          </Link>
        </div>
      </div>

      {/* Progress Bar */}
      <Card className="mb-8">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium">Overall Progress</span>
            <span className="text-sm font-medium">{steps.filter(s => s.isCompleted()).length} of 5 steps</span>
          </div>
          <Progress 
            value={(steps.filter(s => s.isCompleted()).length / steps.length) * 100} 
            className="h-2"
          />
        </CardContent>
      </Card>

      {/* Journey Steps */}
      <div className="space-y-3">
        {steps.map((step) => {
          const isCompleted = step.isCompleted()
          const isActive = step.isActive()
          const isLocked = !isActive && !isCompleted && steps.findIndex(s => s.isActive()) < steps.findIndex(s => s.id === step.id)
          
          return (
            <Card 
              key={step.id}
              className={`transition-all ${
                isActive ? 'ring-2 ring-primary shadow-md' : ''
              } ${isLocked ? 'opacity-50' : ''}`}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  {/* Step Status */}
                  <div className="flex-shrink-0">
                    {isCompleted ? (
                      <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                        <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400" />
                      </div>
                    ) : (
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        isActive ? 'bg-primary text-primary-foreground' : 'bg-muted'
                      }`}>
                        <span className="font-semibold">{step.number}</span>
                      </div>
                    )}
                  </div>

                  {/* Step Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{step.title}</h3>
                      {isActive && <Badge variant="default" className="text-xs">Current</Badge>}
                    </div>
                    <p className="text-sm text-muted-foreground">{step.description}</p>
                  </div>

                  {/* Action */}
                  <div className="flex-shrink-0">
                    {step.href ? (
                      <Button
                        variant={isActive ? "default" : "outline"}
                        size="sm"
                        disabled={isLocked}
                        asChild
                      >
                        <Link href={step.href}>
                          {step.action}
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    ) : (
                      <Button
                        variant={isActive ? "default" : "outline"}
                        size="sm"
                        onClick={step.onClick}
                        disabled={isLocked}
                      >
                        {step.action}
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Assessment Type Selector Modal */}
      {showTypeSelector && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-4xl">
            <CardHeader>
              <CardTitle>Choose Your Assessment Type</CardTitle>
              <CardDescription>Select the assessment that best fits your needs</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <Card 
                  className="cursor-pointer hover:ring-2 hover:ring-purple-500 transition-all"
                  onClick={() => {
                    setAssessmentType('strategic')
                    setShowTypeSelector(false)
                  }}
                >
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-purple-600" />
                      Strategic Planning
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      For executives planning digital transformation
                    </p>
                    <ul className="space-y-1 text-sm">
                      <li>• 30-45 minutes</li>
                      <li>• Focus on 2025 readiness</li>
                      <li>• ROI and business metrics</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card 
                  className="cursor-pointer hover:ring-2 hover:ring-blue-500 transition-all"
                  onClick={() => {
                    setAssessmentType('operational')
                    setShowTypeSelector(false)
                  }}
                >
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ClipboardCheck className="h-5 w-5 text-blue-600" />
                      Operational Excellence
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      For IT teams evaluating current state
                    </p>
                    <ul className="space-y-1 text-sm">
                      <li>• 60+ questions</li>
                      <li>• 8 governance areas</li>
                      <li>• Technical recommendations</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
              <div className="mt-6 text-center">
                <Button variant="outline" onClick={() => setShowTypeSelector(false)}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}