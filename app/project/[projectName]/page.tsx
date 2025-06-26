"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useAssessmentStore } from "@/store/assessment-store"
import { AssessmentStandardsList } from "@/components/assessment-standards-list"
import { OverallSummary } from "@/components/overall-summary"
import { VersionManager } from "@/components/version-manager"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

export default function ProjectDashboardPage() {
  const router = useRouter()
  const params = useParams()
  const projectName = decodeURIComponent(params.projectName as string)
  const { setActiveProject, getActiveProject } = useAssessmentStore()
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    setActiveProject(projectName)
  }, [projectName, setActiveProject])

  const activeProject = getActiveProject()

  if (!isClient) {
    return <div className="container mx-auto p-8">Loading...</div>
  }

  if (!activeProject) {
    return (
      <div className="container mx-auto p-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error: Project Not Found</AlertTitle>
          <AlertDescription>
            The project "{projectName}" could not be found. It might have been deleted or you may have followed a broken
            link.
            <Button variant="link" onClick={() => router.push("/")} className="p-0 h-auto ml-1">
              Return to Main Dashboard
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <Button variant="outline" onClick={() => router.push("/")} className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to All Projects
      </Button>

      <header className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight">{activeProject.name}</h1>
        <p className="text-muted-foreground mt-2">Client Reference: {activeProject.clientReferenceNumber}</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <AssessmentStandardsList />
          <VersionManager />
        </div>
        <div className="lg:col-span-1">
          <OverallSummary />
        </div>
      </div>
    </div>
  )
}
