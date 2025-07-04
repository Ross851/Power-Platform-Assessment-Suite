"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { useAssessmentStore } from "@/store/assessment-store"
import { ClientOnly } from "@/components/client-only"
import { AssessorInfoDialog } from "@/components/assessor-info-dialog"
import { ErrorBoundary } from "@/components/error-boundary"
import { 
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Circle,
  Search,
  FolderOpen,
  Plus,
  FileText,
  Calendar,
  ChevronDown
} from "lucide-react"
import Link from "next/link"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function SimplifiedHomepage() {
  const {
    projects,
    activeProjectName,
    createProject,
    setActiveProject,
    getActiveProject,
    getOverallProgress,
    getAssessmentMetadata
  } = useAssessmentStore()

  const [showProjectInput, setShowProjectInput] = useState(false)
  const [projectName, setProjectName] = useState("")
  const [showAssessorDialog, setShowAssessorDialog] = useState(false)

  const activeProject = getActiveProject()
  const metadata = getAssessmentMetadata()
  const progress = getOverallProgress()

  // Determine current state
  const hasProject = !!activeProject
  const hasAssessor = !!metadata
  const hasStarted = progress > 0
  const isComplete = progress === 100

  // Single action button logic
  const getMainAction = () => {
    if (!hasProject) {
      return {
        label: "Start New Assessment",
        onClick: () => setShowProjectInput(true),
        icon: <Sparkles className="mr-2 h-4 w-4" />
      }
    }
    if (!hasAssessor) {
      return {
        label: "Add Your Details",
        onClick: () => setShowAssessorDialog(true),
        icon: <ArrowRight className="mr-2 h-4 w-4" />
      }
    }
    if (!hasStarted) {
      return {
        label: "Choose Assessment Type",
        href: "#assessment-choice",
        icon: <ArrowRight className="mr-2 h-4 w-4" />
      }
    }
    if (isComplete) {
      return {
        label: "View Results",
        href: "#export",
        icon: <CheckCircle2 className="mr-2 h-4 w-4" />
      }
    }
    return {
      label: "Continue Assessment",
      href: "/microsoft-2025-demo",
      icon: <ArrowRight className="mr-2 h-4 w-4" />
    }
  }

  const mainAction = getMainAction()

  return (
    <ErrorBoundary>
      <ClientOnly>
        <AssessorInfoDialog open={showAssessorDialog} onOpenChange={setShowAssessorDialog} />
        
        <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="max-w-2xl w-full space-y-8">
          {/* Main Header */}
          <div className="text-center space-y-4">
            <h1 className="text-5xl font-bold">
              Power Platform Assessment
            </h1>
            <p className="text-xl text-muted-foreground">
              Evaluate your Microsoft Power Platform maturity in minutes
            </p>
            
            {/* Project Switcher */}
            {projects.length > 1 && (
              <div className="flex justify-center mt-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="min-w-[200px]">
                      <FolderOpen className="mr-2 h-4 w-4" />
                      {activeProjectName || 'Select Project'}
                      <ChevronDown className="ml-auto h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-[300px]">
                    <DropdownMenuLabel>Your Projects</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {projects.map((project) => {
                      const projectProgress = Math.round(
                        project.assessmentStandards.reduce((sum, std) => sum + std.completion, 0) / 
                        project.assessmentStandards.length
                      )
                      return (
                        <DropdownMenuItem
                          key={project.name}
                          onClick={() => setActiveProject(project.name)}
                          className={activeProjectName === project.name ? 'bg-accent' : ''}
                        >
                          <div className="flex items-center justify-between w-full">
                            <div className="flex items-center gap-2">
                              <FolderOpen className="h-4 w-4" />
                              <span>{project.name}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Badge variant="outline" className="text-xs">
                                {projectProgress}%
                              </Badge>
                              <span className="text-xs">
                                {new Date(project.lastModifiedAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </DropdownMenuItem>
                      )
                    })}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setShowProjectInput(true)}>
                      <Plus className="mr-2 h-4 w-4" />
                      New Project
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
          </div>

          {/* Progress Indicator - Only show if started */}
          {hasProject && (
            <div className="flex justify-center">
              <div className="flex items-center gap-2">
                <Circle className={`h-3 w-3 ${hasProject ? 'fill-primary text-primary' : 'text-muted-foreground'}`} />
                <div className="w-8 h-0.5 bg-muted" />
                <Circle className={`h-3 w-3 ${hasAssessor ? 'fill-primary text-primary' : 'text-muted-foreground'}`} />
                <div className="w-8 h-0.5 bg-muted" />
                <Circle className={`h-3 w-3 ${hasStarted ? 'fill-primary text-primary' : 'text-muted-foreground'}`} />
                <div className="w-8 h-0.5 bg-muted" />
                <Circle className={`h-3 w-3 ${isComplete ? 'fill-primary text-primary' : 'text-muted-foreground'}`} />
              </div>
            </div>
          )}

          {/* Main Action Card */}
          <Card className="shadow-lg">
            <CardContent className="p-8 text-center space-y-6">
              {/* Status Message */}
              <div>
                {!hasProject && (
                  <p className="text-lg">Ready to assess your Power Platform implementation?</p>
                )}
                {hasProject && !hasAssessor && (
                  <p className="text-lg">Welcome! Let's add your details to get started.</p>
                )}
                {hasAssessor && !hasStarted && (
                  <p className="text-lg">Perfect! Choose your assessment type to begin.</p>
                )}
                {hasStarted && !isComplete && (
                  <div>
                    <p className="text-lg mb-2">Great progress!</p>
                    <div className="text-3xl font-bold text-primary">{Math.round(progress)}% Complete</div>
                  </div>
                )}
                {isComplete && (
                  <div>
                    <p className="text-lg mb-2">Assessment Complete! 🎉</p>
                    <p className="text-muted-foreground">Download your executive report</p>
                  </div>
                )}
              </div>

              {/* Main Action Button */}
              {!showProjectInput ? (
                mainAction.href ? (
                  <Button size="lg" className="text-lg px-8" asChild>
                    <Link href={mainAction.href}>
                      {mainAction.icon}
                      {mainAction.label}
                    </Link>
                  </Button>
                ) : (
                  <Button size="lg" className="text-lg px-8" onClick={mainAction.onClick}>
                    {mainAction.icon}
                    {mainAction.label}
                  </Button>
                )
              ) : (
                <div className="space-y-4 max-w-sm mx-auto">
                  <Input
                    type="text"
                    placeholder="Project name (e.g., Q1 2024)"
                    className="w-full text-center bg-background text-foreground"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && projectName.trim()) {
                        createProject(projectName.trim())
                        setShowProjectInput(false)
                        setProjectName("")
                      }
                    }}
                    autoFocus
                  />
                  <div className="flex gap-2">
                    <Button 
                      className="flex-1"
                      onClick={() => {
                        if (projectName.trim()) {
                          createProject(projectName.trim())
                          setShowProjectInput(false)
                          setProjectName("")
                        }
                      }}
                    >
                      Create Project
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => {
                        setShowProjectInput(false)
                        setProjectName("")
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}

              {/* Context Info */}
              {activeProject && (
                <div className="pt-4 border-t">
                  <p className="text-sm text-muted-foreground">
                    Project: <span className="font-medium">{activeProjectName}</span>
                    {metadata && <span> • Assessor: {metadata.assessorName}</span>}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Assessment Type Choice - Only show when needed */}
          {hasAssessor && !hasStarted && (
            <div id="assessment-choice" className="grid md:grid-cols-2 gap-4">
              <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => window.location.href = '/microsoft-2025-demo'}>
                <CardContent className="p-6 text-center">
                  <Sparkles className="h-8 w-8 mx-auto mb-3 text-purple-600" />
                  <h3 className="font-semibold mb-1">Strategic Assessment</h3>
                  <p className="text-sm text-muted-foreground">For executives • 30 mins</p>
                </CardContent>
              </Card>
              <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => window.location.href = '/assessment/documentation-rulebooks'}>
                <CardContent className="p-6 text-center">
                  <CheckCircle2 className="h-8 w-8 mx-auto mb-3 text-blue-600" />
                  <h3 className="font-semibold mb-1">Operational Assessment</h3>
                  <p className="text-sm text-muted-foreground">For IT teams • 60+ mins</p>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Minimal Footer Links */}
          <div className="flex justify-center gap-6 text-sm">
            <Link 
              href="/resources"
              className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
            >
              <Search className="h-3 w-3" />
              Search
            </Link>
            <Link href="/evidence" className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
              <FileText className="h-3 w-3" />
              Evidence
            </Link>
            <Link href="/resources" className="text-muted-foreground hover:text-foreground transition-colors">
              Resources
            </Link>
            <Link href="/assessment-guide" className="text-muted-foreground hover:text-foreground transition-colors">
              Help
            </Link>
          </div>
        </div>
      </div>
      </ClientOnly>
    </ErrorBoundary>
  )
}