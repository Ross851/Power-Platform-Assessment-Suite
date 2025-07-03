"use client"

import { useAssessmentStore } from "@/store/assessment-store"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { ResponsiveGrid } from "@/components/responsive-wrapper"
import { RAGIndicator } from "@/components/rag-indicator"
import { OverallSummary } from "@/components/overall-summary"
import { useRouter } from "next/navigation"
import { useDebounce, useIntersectionObserver, usePerformanceMetrics } from "@/lib/performance"
import { 
  FileDown,
  FileText,
  Table,
  Download,
  Plus,
  Settings,
  TrendingUp,
  Clock,
  Target,
  Activity,
  Search,
  Filter
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from "@/components/ui/select"
import { useState, useRef, lazy, Suspense } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { assessmentStandards } from "@/lib/constants"
import { Skeleton } from "@/components/ui/skeleton"

// Lazy load export components
const ExportDialog = lazy(() => import("@/components/export-dialog").then(mod => ({ default: mod.ExportDialog })))
const ProjectManagement = lazy(() => import("@/components/project-management").then(mod => ({ default: mod.ProjectManagement })))

// Loading skeleton component
function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-32 w-full" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Skeleton className="h-24" />
        <Skeleton className="h-24" />
        <Skeleton className="h-24" />
      </div>
      <Skeleton className="h-64 w-full" />
    </div>
  )
}

export function DashboardOptimized() {
  const router = useRouter()
  const activeProject = useAssessmentStore((state) => state.getActiveProject())
  const { metrics, trackInteraction } = usePerformanceMetrics("DashboardOptimized")
  
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState<"all" | "complete" | "incomplete" | "high-risk">("all")
  const [showExportDialog, setShowExportDialog] = useState(false)
  const [showProjectDialog, setShowProjectDialog] = useState(false)

  const debouncedSearch = useDebounce(searchQuery, 300)
  
  // Intersection observer for lazy loading sections
  const summaryRef = useRef<HTMLDivElement>(null)
  const standardsRef = useRef<HTMLDivElement>(null)
  const showSummary = useIntersectionObserver(summaryRef, { rootMargin: "100px" })
  const showStandards = useIntersectionObserver(standardsRef, { rootMargin: "100px" })

  if (!activeProject) {
    return (
      <div className="container mx-auto p-6">
        <Card className="max-w-2xl mx-auto">
          <CardHeader className="text-center">
            <CardTitle>Welcome to Power Platform Assessment Suite</CardTitle>
            <CardDescription>
              Create or select a project to begin your assessment
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Button 
              size="lg" 
              onClick={() => setShowProjectDialog(true)}
              className="gap-2"
            >
              <Plus className="h-5 w-5" />
              Create New Project
            </Button>
          </CardContent>
        </Card>
        
        <Suspense fallback={null}>
          {showProjectDialog && (
            <ProjectManagement onClose={() => setShowProjectDialog(false)} />
          )}
        </Suspense>
      </div>
    )
  }

  // Calculate overall metrics
  const overallProgress = activeProject.standards.reduce(
    (sum, standard) => sum + (standard.completionPercentage || 0),
    0
  ) / activeProject.standards.length

  const maturityScore = activeProject.overallMaturityScore || 0
  const overallRAG = activeProject.overallRAG || "grey"

  // Filter standards based on search and status
  const filteredStandards = activeProject.standards.filter((standard) => {
    const matchesSearch = standard.name.toLowerCase().includes(debouncedSearch.toLowerCase())
    
    let matchesFilter = true
    switch (filterStatus) {
      case "complete":
        matchesFilter = standard.completionPercentage === 100
        break
      case "incomplete":
        matchesFilter = (standard.completionPercentage || 0) < 100
        break
      case "high-risk":
        matchesFilter = standard.ragStatus === "red"
        break
    }
    
    return matchesSearch && matchesFilter
  })

  const handleStandardClick = (standardSlug: string) => {
    const track = trackInteraction("standard_navigation")
    router.push(`/assessment/${standardSlug}`)
    track()
  }

  const handleExport = () => {
    const track = trackInteraction("export_dialog_open")
    setShowExportDialog(true)
    track()
  }

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6 max-w-7xl">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold">{activeProject.name}</h1>
          <p className="text-muted-foreground">
            Last updated {activeProject.lastModifiedAt.toLocaleDateString()}
          </p>
        </div>
        
        <div className="flex gap-2 flex-wrap">
          <Button onClick={() => setShowProjectDialog(true)} variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Manage Projects
          </Button>
          <Button onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export Assessment
          </Button>
        </div>
      </motion.div>

      {/* Quick Stats */}
      <ResponsiveGrid cols={{ default: 1, sm: 2, md: 4 }} gap={4}>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Overall Progress</p>
                <p className="text-2xl font-bold">{overallProgress.toFixed(0)}%</p>
              </div>
              <Target className="h-8 w-8 text-muted-foreground" />
            </div>
            <Progress value={overallProgress} className="mt-2 h-1" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Maturity Score</p>
                <p className="text-2xl font-bold">{maturityScore.toFixed(1)}/5.0</p>
              </div>
              <TrendingUp className="h-8 w-8 text-muted-foreground" />
            </div>
            <Progress value={(maturityScore / 5) * 100} className="mt-2 h-1" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Risk Status</p>
                <div className="flex items-center gap-2 mt-1">
                  <RAGIndicator status={overallRAG} size="sm" />
                  <span className="font-semibold">{overallRAG.toUpperCase()}</span>
                </div>
              </div>
              <Activity className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Time Invested</p>
                <p className="text-2xl font-bold">
                  {Math.floor((Date.now() - activeProject.createdAt.getTime()) / (1000 * 60 * 60))}h
                </p>
              </div>
              <Clock className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </ResponsiveGrid>

      {/* Overall Summary - Lazy loaded */}
      <div ref={summaryRef}>
        {showSummary && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <OverallSummary />
          </motion.div>
        )}
      </div>

      {/* Standards Grid with Search/Filter */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <CardTitle>Assessment Standards</CardTitle>
            
            <div className="flex gap-2 w-full md:w-auto">
              <div className="relative flex-1 md:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search standards..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              
              <Select value={filterStatus} onValueChange={(value: any) => setFilterStatus(value)}>
                <SelectTrigger className="w-40">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Standards</SelectItem>
                  <SelectItem value="complete">Complete</SelectItem>
                  <SelectItem value="incomplete">Incomplete</SelectItem>
                  <SelectItem value="high-risk">High Risk</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        
        <CardContent ref={standardsRef}>
          {showStandards && (
            <AnimatePresence mode="popLayout">
              <ResponsiveGrid cols={{ default: 1, md: 2, lg: 3 }} gap={4}>
                {filteredStandards.map((standard, index) => {
                  const standardConfig = assessmentStandards.find(s => s.name === standard.name)
                  
                  return (
                    <motion.div
                      key={standard.name}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.2, delay: index * 0.05 }}
                    >
                      <Card 
                        className="cursor-pointer hover:shadow-md transition-all hover:border-primary/50"
                        onClick={() => handleStandardClick(standardConfig?.slug || "")}
                      >
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between gap-2">
                            <CardTitle className="text-base line-clamp-2">
                              {standard.name}
                            </CardTitle>
                            <RAGIndicator status={standard.ragStatus} size="sm" />
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="space-y-1">
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Progress</span>
                              <span className="font-medium">{standard.completionPercentage}%</span>
                            </div>
                            <Progress value={standard.completionPercentage} className="h-2" />
                          </div>
                          
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-muted-foreground">Weight</span>
                            <Badge variant="secondary">{standardConfig?.weight}</Badge>
                          </div>
                          
                          {standard.maturityScore > 0 && (
                            <div className="flex justify-between items-center text-sm">
                              <span className="text-muted-foreground">Maturity</span>
                              <span className="font-medium">{standard.maturityScore.toFixed(1)}/5.0</span>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </motion.div>
                  )
                })}
              </ResponsiveGrid>
            </AnimatePresence>
          )}
          
          {filteredStandards.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No standards match your search criteria</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Export Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Export</CardTitle>
          <CardDescription>
            Export your assessment data in various formats
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={handleExport}>
              <FileText className="h-4 w-4 mr-2" />
              Word Report
            </Button>
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Table className="h-4 w-4 mr-2" />
              Excel Export
            </Button>
            <Button variant="outline" size="sm" onClick={handleExport}>
              <FileDown className="h-4 w-4 mr-2" />
              Executive Summary
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Lazy-loaded dialogs */}
      <Suspense fallback={null}>
        {showExportDialog && (
          <ExportDialog 
            open={showExportDialog} 
            onClose={() => setShowExportDialog(false)} 
          />
        )}
        
        {showProjectDialog && (
          <ProjectManagement onClose={() => setShowProjectDialog(false)} />
        )}
      </Suspense>

      {/* Performance metrics in dev mode */}
      {process.env.NODE_ENV === "development" && (
        <div className="fixed bottom-4 right-4 text-xs bg-background border rounded p-2 opacity-50">
          Render: {metrics.renderTime.toFixed(0)}ms
        </div>
      )}
    </div>
  )
}