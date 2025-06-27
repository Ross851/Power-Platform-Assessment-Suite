"use client"

import Link from "next/link"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ASSESSMENT_STANDARDS } from "@/lib/constants"
import type { AssessmentStandard as AssessmentStandardType } from "@/lib/types"
import { OverallSummary } from "@/components/overall-summary"
import { GeneralDocumentation } from "@/components/general-documentation"
import { AssessmentGuidance } from "@/components/assessment-guidance"
import { FileDown, ExternalLink, FolderPlus, Trash2, AlertCircle, Briefcase, Wrench, Upload, Download, FileText, GitCompare, Code, Cloud, Settings } from "lucide-react"
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
import { generateExecutiveReport } from "@/lib/executive-report"
import { AssessmentStorage } from "@/lib/storage"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { DeveloperSuccessGuide } from "@/components/developer-success-guide"
import { VersionComparison } from "@/components/version-comparison"
import { VersionControl } from "@/lib/version-control"
import { Textarea } from "@/components/ui/textarea"
import { CodeSnippetsViewer } from "@/components/code-snippets-viewer"
import { AssessorInfoDialog, AssessorInfoDisplay } from "@/components/assessor-info-dialog"
import { GoogleDriveSetup } from "@/components/google-drive-setup"
import { UserCheck } from "lucide-react"

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
  const [importFile, setImportFile] = useState<File | null>(null)
  const [isImporting, setIsImporting] = useState(false)
  const [versionNotes, setVersionNotes] = useState("")
  const [versionAuthor, setVersionAuthor] = useState("")
  const [showVersionDialog, setShowVersionDialog] = useState(false)
  const [showCodeSnippets, setShowCodeSnippets] = useState(false)
  const [showAssessorDialog, setShowAssessorDialog] = useState(false)

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

  const handleExport = async (format: "json" | "excel" | "client-word" | "tech-word" | "executive-word") => {
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
        case "executive-word":
          await generateExecutiveReport(activeProject)
          break
      }
    } catch (error) {
      console.error("Export failed:", error)
      alert("An error occurred during the export.")
    } finally {
      setIsExporting(false)
    }
  }

  const handleBackupExport = () => {
    AssessmentStorage.exportToFile(projects)
  }

  const handleImport = async () => {
    if (!importFile) return
    setIsImporting(true)
    try {
      const importedProjects = await AssessmentStorage.importFromFile(importFile)
      // This would need to be implemented in the store
      alert(`Successfully imported ${importedProjects.length} projects. Please refresh the page.`)
      window.location.reload()
    } catch (error) {
      alert(error instanceof Error ? error.message : "Import failed")
    } finally {
      setIsImporting(false)
      setImportFile(null)
    }
  }

  const handleCreateVersion = () => {
    if (!activeProject) return
    
    VersionControl.createVersion(
      activeProject,
      versionAuthor || "Unknown",
      versionNotes
    )
    
    setShowVersionDialog(false)
    setVersionNotes("")
    setVersionAuthor("")
    alert("Version created successfully!")
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
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-3xl font-bold text-primary">Power Platform Assessment Suite</h1>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleBackupExport}>
              <Download className="mr-2 h-4 w-4" /> Backup All
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Upload className="mr-2 h-4 w-4" /> Import
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Import Assessment Data</DialogTitle>
                  <DialogDescription>
                    Select a previously exported assessment backup file to import.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <Input
                    type="file"
                    accept=".json"
                    onChange={(e) => setImportFile(e.target.files?.[0] || null)}
                  />
                </div>
                <DialogFooter>
                  <Button onClick={handleImport} disabled={!importFile || isImporting}>
                    {isImporting ? "Importing..." : "Import"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <Link href="/google-drive-test">
              <Button variant="ghost" size="sm" title="Test Google Drive Integration">
                <Cloud className="mr-2 h-4 w-4" />
                Cloud Test
              </Button>
            </Link>
            <Link href="/setup-guide">
              <Button variant="ghost" size="sm" title="Setup Guide for Other Computers">
                <Settings className="mr-2 h-4 w-4" />
                Setup Guide
              </Button>
            </Link>
          </div>
        </div>
        <p className="text-muted-foreground">
          Evaluate your organisation&apos;s Power Platform maturity against Microsoft best practices.
        </p>
      </header>

      <AssessmentGuidance standardSlug="home" />

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
                <>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    title="Set assessor information"
                    onClick={() => setShowAssessorDialog(true)}
                  >
                    <UserCheck className="h-4 w-4" />
                  </Button>
                  <Dialog open={showVersionDialog} onOpenChange={setShowVersionDialog}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="icon" title="Create version snapshot">
                        <GitCompare className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Create Version Snapshot</DialogTitle>
                        <DialogDescription>
                          Save the current state of your assessment for future comparison.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div>
                          <Label htmlFor="version-author">Your Name</Label>
                          <Input
                            id="version-author"
                            value={versionAuthor}
                            onChange={(e) => setVersionAuthor(e.target.value)}
                            placeholder="e.g., John Smith"
                          />
                        </div>
                        <div>
                          <Label htmlFor="version-notes">Version Notes</Label>
                          <Textarea
                            id="version-notes"
                            value={versionNotes}
                            onChange={(e) => setVersionNotes(e.target.value)}
                            placeholder="What changes were made in this version?"
                            rows={3}
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button onClick={handleCreateVersion}>
                          Create Version
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
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
                          Are you sure you want to delete the project &quot;{activeProjectName}&quot;? This action cannot be undone.
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
                </>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {!activeProject ? (
        <Alert className="mb-8">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>No Active Project</AlertTitle>
          <AlertDescription>Please create or select a project to begin your assessment.</AlertDescription>
        </Alert>
      ) : (
        <>
          <AssessorInfoDialog open={showAssessorDialog} onOpenChange={setShowAssessorDialog} />
          
          <AssessorInfoDisplay />

          <OverallSummary />

          <DeveloperSuccessGuide />

          <Card className="mb-8">
            <CardHeader className="cursor-pointer" onClick={() => setShowCodeSnippets(!showCodeSnippets)}>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Code className="h-5 w-5" />
                    Code Snippets Timeline
                  </CardTitle>
                  <CardDescription>View all code snippets across your assessment in chronological order</CardDescription>
                </div>
                <Button variant="ghost" size="sm">
                  {showCodeSnippets ? "Hide" : "Show"}
                </Button>
              </div>
            </CardHeader>
            {showCodeSnippets && (
              <CardContent>
                <CodeSnippetsViewer />
              </CardContent>
            )}
          </Card>

          <Card className="mb-8">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Export Assessment</CardTitle>
                <CardDescription>Generate reports in various formats for different audiences.</CardDescription>
              </div>
              <Badge variant="outline">Auto-saved locally</Badge>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Button
                  onClick={() => handleExport("executive-word")}
                  disabled={isExporting}
                  variant="default"
                  className="justify-start"
                >
                  <Briefcase className="mr-2 h-4 w-4" />
                  Executive Report (Word)
                  <Badge className="ml-auto" variant="secondary">C-Suite</Badge>
                </Button>
                <Button
                  onClick={() => handleExport("client-word")}
                  disabled={isExporting}
                  variant="outline"
                  className="justify-start"
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Client Report (Word)
                </Button>
                <Button
                  onClick={() => handleExport("tech-word")}
                  disabled={isExporting}
                  variant="outline"
                  className="justify-start"
                >
                  <Wrench className="mr-2 h-4 w-4" />
                  Technical Report (Word)
                </Button>
                <Button
                  onClick={() => handleExport("excel")}
                  disabled={isExporting}
                  variant="outline"
                  className="justify-start"
                >
                  <FileDown className="mr-2 h-4 w-4" />
                  Detailed Data (Excel)
                </Button>
                <Button
                  onClick={() => handleExport("json")}
                  disabled={isExporting}
                  variant="outline"
                  className="justify-start"
                >
                  <FileDown className="mr-2 h-4 w-4" />
                  Raw Data (JSON)
                </Button>
              </div>
            </CardContent>
          </Card>

          <VersionComparison 
            projectName={activeProjectName!} 
            onVersionCreate={() => setShowVersionDialog(true)}
          />

          <GeneralDocumentation />

          <Card>
            <CardHeader>
              <CardTitle>Assessment Standards</CardTitle>
              <CardDescription>Click on any standard to begin or continue your assessment.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {displayStandards.map((standard: any) => (
                  <Link key={standard.slug} href={`/assessment/${standard.slug}`} className="block">
                    <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <CardTitle className="text-lg">{standard.name}</CardTitle>
                            <CardDescription className="mt-2">{standard.description}</CardDescription>
                          </div>
                          <RAGIndicator status={standard.ragStatus} size="lg" />
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Progress</span>
                            <span>{Math.round(standard.completion || 0)}%</span>
                          </div>
                          <Progress value={standard.completion || 0} className="h-2" />
                          <div className="flex justify-between text-sm text-muted-foreground">
                            <span>{standard.questions?.length || 0} questions</span>
                            <span>Weight: {standard.weight}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
