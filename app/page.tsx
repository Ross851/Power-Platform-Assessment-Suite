"use client"

import { useEffect, useState } from "react"
import { useAssessmentStore } from "@/store/assessment-store"
import { CreateProjectForm } from "@/components/create-project-form"
import { ProjectList } from "@/components/project-list"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function DashboardPage() {
  const { projects, getOverallProgress } = useAssessmentStore()
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return <div>Loading...</div>
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <header className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight">Assessment Suite Dashboard</h1>
        <p className="text-muted-foreground mt-2">Manage all your Power Platform assessment projects from one place.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>My Projects</CardTitle>
              <CardDescription>Select a project to view its detailed assessment dashboard.</CardDescription>
            </CardHeader>
            <CardContent>
              <ProjectList projects={projects} getOverallProgress={getOverallProgress} />
            </CardContent>
          </Card>
        </div>
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Create New Project</CardTitle>
              <CardDescription>Start a new assessment for a client or a new period.</CardDescription>
            </CardHeader>
            <CardContent>
              <CreateProjectForm />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
