"use client"

import Link from "next/link"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ASSESSMENT_STANDARDS } from "@/lib/constants"
import type { AssessmentStandard as AssessmentStandardType } from "@/lib/types"
import { OverallSummary } from "@/components/overall-summary"
import { GeneralDocumentation } from "@/components/general-documentation"
import { FileDown, ExternalLink, FolderPlus, Trash2, AlertCircle, Briefcase, Wrench } from "lucide-react"
import { RAGIndicator } from "@/components/rag-indicator"
import { useAssessmentStore } from "@/store/assessment-store"
import { useEffect, useState, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { format } from "date-fns"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { exportToExcel, exportToJson } from "@/lib/export"
import { exportToClientWord, exportToTechnicalWord } from "@/lib/word-export"

export default function DashboardPage() {
  const {
    projects,
    activeProjectName,
    createProject,
    setActiveProject,
    deleteProject,
    getActiveProject,
    getStandardProgress,
    calculateScoresAndRAG,
  } = useAssessmentStore()

  const [newProjectName, setNewProjectName] = useState("")
  const [isClient, setIsClient] = useState(false)
  const [confirmDeleteProject, setConfirmDeleteProject] = useState<string | null>(null)
  const [isExporting, setIsExporting] = useState(false)

  const activeProject = getActiveProject()
  const hasCalculatedOnMountRef = useRef<{ [key: string]: boolean }>({})

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (isClient && activeProject && !hasCalculatedOnMountRef.current[activeProject.name]) {
      activeProject.standards.forEach((s) => calculateScoresAndRAG(s.slug))
      hasCalculatedOnMountRef.current[activeProject.name] = true
    }
  }, [isClient, activeProject, calculateScoresAndRAG])

  const handleCreateProject = () => {
    if (newProjectName.trim()) {
      createProject(newProjectName.trim())
      setNewProjectName("")
    }
  }

  const handleSetActiveProject = (projectName: string) => {
    setActiveProject(projectName)
  }

  const handleDeleteProject = (projectName: string) => {
    deleteProject(projectName)
    setConfirmDeleteProject(null)
  }

  const handleExport = async (format: "json" | "excel" | "client-word" | "tech-word") => {
    if (!activeProject) return
    setIsExporting(true)
    try {
      switch (format) {
        case "excel":
          await exportToExcel(activeProject)
          break
        case "json":
          exportToJson(activeProject)
          break
        case "client-word":
          await exportToClientWord(activeProject)
          break
        case "tech-word":
          await exportToTechnicalWord(activeProject)
          break
      }
    } catch (error) {
      console.error("Export failed:", error)
      alert("An error occurred during the export.")
    } finally {
      setIsExporting(false)
    }
  }

  if (!isClient) {
    return (
      <div className="container mx-auto p-4 md:p-8 bg-background text-foreground min-h-screen">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-primary">Power Platform Assessment Suite</h1>
          <p className="text-muted-foreground">Loading assessment data...</p>
        </header>
      </div>
    )
  }

  const displayStandards = activeProject
    ? activeProject.standards.map((projStd) => {
        const constStd = ASSESSMENT_STANDARDS.find((cs) => cs.slug === projStd.slug)
        return {
          ...constStd,
          ...projStd,
          completion: getStandardProgress(projStd.slug),
        }
      })
    : []

  return (
    <div className="container mx-auto p-4 md:p-8 bg-background text-foreground min-h-screen">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-primary">Power Platform Assessment Suite</h1>
        <p className="text-muted-foreground">
          Evaluate your organisation's Power Platform maturity against Microsoft best practices.
        </p>
      </header>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Project Management</CardTitle>
          <CardDescription>Create a new assessment project or select an existing one.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-2 items-end">
            <div className="flex-grow">
              <Label htmlFor="new-project-name">New Project Name</Label>
              <Input
                id="new-project-name"
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                placeholder="e.g., Contoso Q3 Assessment"
              />
            </div>
            <Button onClick={handleCreateProject} disabled={!newProjectName.trim()}>
              <FolderPlus className="mr-2 h-4 w-4" /> Create Project
            </Button>
          </div>
          {projects.length > 0 && (
            <div className="flex flex-col sm:flex-row gap-2 items-end">
              <div className="flex-grow">
                <Label htmlFor="active-project-select">Active Project</Label>
                <Select value={activeProjectName || ""} onValueChange={handleSetActiveProject}>
                  <SelectTrigger id="active-project-select">
                    <SelectValue placeholder="Select a project" />
                  </SelectTrigger>
                  <SelectContent>
                    {projects.map((p) => (
                      <SelectItem key={p.name} value={p.name}>
                        {p.name} (Last modified: {format(new Date(p.lastModifiedAt), "dd MMM yyyy, HH:mm")})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {activeProjectName && (
                <Dialog
                  open={confirmDeleteProject === activeProjectName}
                  onOpenChange={(isOpen) => !isOpen && setConfirmDeleteProject(null)}
                >
                  <DialogTrigger asChild>
                    <Button
                      variant="destructive"
                      size="icon"
                      title={`Delete project ${activeProjectName}`}
                      onClick={() => setConfirmDeleteProject(activeProjectName)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Confirm Deletion</DialogTitle>
                      <DialogDescription>
                        Are you sure you want to delete the project "{activeProjectName}"? This action cannot be undone.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setConfirmDeleteProject(null)}>
                        Cancel
                      </Button>
                      <Button variant="destructive" onClick={() => handleDeleteProject(activeProjectName!)}>
                        Delete Project
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {!activeProjectName && projects.length > 0 && (
        <Alert className="mb-8">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>No Active Project</AlertTitle>
          <AlertDescription>
            Please select an existing project or create a new one to begin an assessment.
          </AlertDescription>
        </Alert>
      )}
      {!activeProjectName && projects.length === 0 && (
        <Alert className="mb-8">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Get Started</AlertTitle>
          <AlertDescription>Create your first assessment project to begin.</AlertDescription>
        </Alert>
      )}

      {activeProjectName && activeProject && (
        <>
          <OverallSummary />
          <section className="mb-8">
            <GeneralDocumentation projectName={activeProjectName} />
          </section>
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">
              Assessment Standards for: <span className="text-primary">{activeProjectName}</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayStandards.map(
                (standard: AssessmentStandardType & { completion: number; ragStatus: any; maturityScore: number }) => (
                  <Card key={standard.slug} className="flex flex-col">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">{standard.name}</CardTitle>
                        <RAGIndicator status={standard.ragStatus} size="md" />
                      </div>
                      <CardDescription>Weight: {standard.weight}%</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow flex flex-col justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground mb-2 h-16 overflow-hidden">
                          {standard.description}
                        </p>
                        <div className="mb-2">
                          <div className="flex justify-between text-xs text-muted-foreground mb-1">
                            <span>Progress: {standard.completion.toFixed(0)}%</span>
                            <span>Maturity: {standard.maturityScore.toFixed(1)}/5.0</span>
                          </div>
                          <Progress value={standard.completion} className="w-full h-2" />
                        </div>
                      </div>
                      <Link href={`/assessment/${standard.slug}`} passHref>
                        <Button className="w-full mt-4">
                          {standard.completion > 0 && standard.completion < 100
                            ? "Continue"
                            : standard.completion === 100
                              ? "Review"
                              : "Start"}{" "}
                          Assessment <ExternalLink className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                ),
              )}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">
              Reporting for: <span className="text-primary">{activeProjectName}</span>
            </h2>
            <Card>
              <CardHeader>
                <CardTitle>Export Assessment Data</CardTitle>
                <CardDescription>
                  Download your assessment results in various formats for analysis and reporting.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Button
                    variant="outline"
                    className="bg-card text-card-foreground"
                    onClick={() => handleExport("client-word")}
                    disabled={isExporting}
                  >
                    <Briefcase className="mr-2 h-4 w-4" />
                    {isExporting ? "Exporting..." : "Executive Summary (Word)"}
                  </Button>
                  <Button
                    variant="outline"
                    className="bg-card text-card-foreground"
                    onClick={() => handleExport("tech-word")}
                    disabled={isExporting}
                  >
                    <Wrench className="mr-2 h-4 w-4" />
                    {isExporting ? "Exporting..." : "Technical Guide (Word)"}
                  </Button>
                  <Button
                    variant="outline"
                    className="bg-card text-card-foreground"
                    onClick={() => handleExport("excel")}
                    disabled={isExporting}
                  >
                    <FileDown className="mr-2 h-4 w-4" />
                    {isExporting ? "Exporting..." : "Detailed Data (Excel)"}
                  </Button>
                  <Button
                    variant="outline"
                    className="bg-card text-card-foreground"
                    onClick={() => handleExport("json")}
                    disabled={isExporting}
                  >
                    <FileDown className="mr-2 h-4 w-4" />
                    {isExporting ? "Exporting..." : "Raw Data (JSON)"}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-4">
                  The Word documents provide formatted reports for different audiences, while Excel and JSON are ideal
                  for detailed analysis.
                </p>
              </CardContent>
            </Card>
          </section>
        </>
      )}
    </div>
  )
}
