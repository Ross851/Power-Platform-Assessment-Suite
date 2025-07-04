"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAssessmentStore } from "@/store/assessment-store"
import { ClientOnly } from "@/components/client-only"
import { 
  ChevronRight, 
  User, 
  FolderPlus, 
  Target,
  Play,
  CheckCircle2,
  Circle,
  ArrowRight,
  Sparkles,
  ClipboardCheck,
  HelpCircle,
  Search
} from "lucide-react"
import Link from "next/link"

interface Step {
  id: string
  title: string
  description: string
  action: string
  completed: boolean
  icon: React.ReactNode
  onClick?: () => void
  href?: string
}

export default function StreamlinedDashboard() {
  const router = useRouter()
  const {
    projects,
    activeProjectName,
    createProject,
    setActiveProject,
    getActiveProject,
    getOverallProgress,
    getAssessmentMetadata
  } = useAssessmentStore()

  const [showProjectDialog, setShowProjectDialog] = useState(false)
  const [newProjectName, setNewProjectName] = useState("")
  const [selectedPath, setSelectedPath] = useState<"strategic" | "operational" | null>(null)

  const activeProject = getActiveProject()
  const assessmentMetadata = getAssessmentMetadata()
  const overallProgress = getOverallProgress()

  // Define the user journey steps
  const steps: Step[] = [
    {
      id: "create-project",
      title: "Create or Select Project",
      description: activeProject ? `Current: ${activeProjectName}` : "Set up your assessment project",
      action: activeProject ? "Change Project" : "Create Project",
      completed: !!activeProject,
      icon: <FolderPlus className="h-5 w-5" />,
      onClick: () => setShowProjectDialog(true)
    },
    {
      id: "add-assessor",
      title: "Add Assessor Information",
      description: assessmentMetadata ? `Assessor: ${assessmentMetadata.assessorName}` : "Identify who's conducting the assessment",
      action: assessmentMetadata ? "Update Info" : "Add Assessor",
      completed: !!assessmentMetadata,
      icon: <User className="h-5 w-5" />,
      onClick: () => {
        // This would open the assessor dialog
        window.location.hash = "#assessor"
      }
    },
    {
      id: "choose-path",
      title: "Choose Assessment Type",
      description: selectedPath ? `Selected: ${selectedPath === 'strategic' ? 'Strategic Planning' : 'Operational Review'}` : "Select your assessment focus",
      action: selectedPath ? "Change Type" : "Choose Path",
      completed: !!selectedPath,
      icon: <Target className="h-5 w-5" />,
      onClick: () => {
        // Scroll to assessment selector
        document.getElementById('assessment-selector')?.scrollIntoView({ behavior: 'smooth' })
      }
    },
    {
      id: "begin-assessment",
      title: "Begin Assessment",
      description: overallProgress > 0 ? `Progress: ${Math.round(overallProgress)}%` : "Start answering assessment questions",
      action: overallProgress > 0 ? "Continue Assessment" : "Start Assessment",
      completed: overallProgress === 100,
      icon: <Play className="h-5 w-5" />,
      href: selectedPath === 'strategic' ? '/microsoft-2025-demo' : '#standard-assessments'
    }
  ]

  const currentStepIndex = steps.findIndex(step => !step.completed)
  const currentStep = currentStepIndex >= 0 ? steps[currentStepIndex] : null

  return (
    <ClientOnly>
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Power Platform Assessment Suite</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Follow the guided steps below to complete your Power Platform assessment
          </p>
        </div>

        {/* Quick Actions Bar */}
        <div className="flex justify-center gap-4 mb-8">
          <Button variant="outline" size="sm" asChild>
            <Link href="/setup-guide">
              <HelpCircle className="mr-2 h-4 w-4" />
              Help Guide
            </Link>
          </Button>
          <Button variant="outline" size="sm" onClick={() => window.location.href = '#search'}>
            <Search className="mr-2 h-4 w-4" />
            Search (⌘K)
          </Button>
        </div>

        {/* Progress Overview */}
        {activeProject && (
          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold">Overall Progress</h3>
                  <p className="text-sm text-muted-foreground">
                    {overallProgress === 0 ? "Not started" : overallProgress === 100 ? "Completed" : "In progress"}
                  </p>
                </div>
                <span className="text-2xl font-bold">{Math.round(overallProgress)}%</span>
              </div>
              <Progress value={overallProgress} className="h-3" />
            </CardContent>
          </Card>
        )}

        {/* Guided Journey Steps */}
        <div className="space-y-4 mb-12">
          <h2 className="text-2xl font-semibold mb-6">Your Assessment Journey</h2>
          {steps.map((step, index) => {
            const isActive = currentStep?.id === step.id
            const isPast = currentStepIndex > -1 && index < currentStepIndex
            
            return (
              <Card 
                key={step.id} 
                className={`transition-all ${
                  isActive ? 'ring-2 ring-primary shadow-lg' : ''
                } ${step.completed ? 'opacity-75' : ''}`}
              >
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    {/* Step Number/Status */}
                    <div className="flex-shrink-0">
                      {step.completed ? (
                        <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                          <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400" />
                        </div>
                      ) : (
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          isActive ? 'bg-primary text-primary-foreground' : 'bg-muted'
                        }`}>
                          {isActive ? step.icon : <Circle className="h-6 w-6" />}
                        </div>
                      )}
                    </div>

                    {/* Step Content */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-lg">{step.title}</h3>
                        {isActive && <Badge>Current Step</Badge>}
                        {step.completed && <Badge variant="secondary">Completed</Badge>}
                      </div>
                      <p className="text-muted-foreground">{step.description}</p>
                    </div>

                    {/* Action Button */}
                    <div className="flex-shrink-0">
                      {step.href ? (
                        <Button 
                          variant={isActive ? "default" : "outline"}
                          disabled={!isPast && !isActive}
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
                          onClick={step.onClick}
                          disabled={!isPast && !isActive}
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

        {/* Assessment Type Selector - Only show when needed */}
        {activeProject && assessmentMetadata && !selectedPath && (
          <div id="assessment-selector" className="mb-12">
            <h2 className="text-2xl font-semibold mb-6">Choose Your Assessment Type</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <Card 
                className="cursor-pointer hover:shadow-lg transition-all"
                onClick={() => setSelectedPath('strategic')}
              >
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-purple-600" />
                    Strategic Planning Assessment
                  </CardTitle>
                  <CardDescription>For executives and digital transformation</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• 30-45 minute assessment</li>
                    <li>• Focus on 2025 readiness</li>
                    <li>• Executive dashboards</li>
                    <li>• ROI and business value metrics</li>
                  </ul>
                  <Button className="w-full mt-4" variant="outline">
                    Choose Strategic
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>

              <Card 
                className="cursor-pointer hover:shadow-lg transition-all"
                onClick={() => setSelectedPath('operational')}
              >
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ClipboardCheck className="h-5 w-5 text-blue-600" />
                    Operational Excellence Assessment
                  </CardTitle>
                  <CardDescription>For IT teams and current state evaluation</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• Comprehensive 60+ questions</li>
                    <li>• 8 governance categories</li>
                    <li>• Technical recommendations</li>
                    <li>• Compliance checking</li>
                  </ul>
                  <Button className="w-full mt-4" variant="outline">
                    Choose Operational
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Help Section - Always visible but minimal */}
        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground mb-4">
            Need help? Check our <Link href="/setup-guide" className="underline">setup guide</Link> or use the search function (⌘K)
          </p>
          <div className="flex justify-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/resources">View All Resources</Link>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/docs">Documentation</Link>
            </Button>
          </div>
        </div>

        {/* Simple Project Dialog */}
        {showProjectDialog && (
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle>Create New Project</CardTitle>
                <CardDescription>Enter a name for your assessment project</CardDescription>
              </CardHeader>
              <CardContent>
                <input
                  type="text"
                  placeholder="e.g., Q1 2024 Assessment"
                  className="w-full p-2 border rounded-md mb-4"
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && newProjectName.trim()) {
                      createProject(newProjectName.trim())
                      setShowProjectDialog(false)
                      setNewProjectName("")
                    }
                  }}
                />
                <div className="flex gap-2">
                  <Button 
                    className="flex-1"
                    onClick={() => {
                      if (newProjectName.trim()) {
                        createProject(newProjectName.trim())
                        setShowProjectDialog(false)
                        setNewProjectName("")
                      }
                    }}
                  >
                    Create Project
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setShowProjectDialog(false)
                      setNewProjectName("")
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </ClientOnly>
  )
}