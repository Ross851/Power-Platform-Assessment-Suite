"use client"

import { useAuth } from "@/components/auth/auth-provider"
import { useAssessmentStore } from "@/store/assessment-store"
import { AssessmentStandardsList } from "@/components/assessment-standards-list"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, AlertTriangle, CheckCircle, Play } from "lucide-react"
import Link from "next/link"

export default function AssessmentPage() {
  const { user, loading } = useAuth()
  const { getActiveProject, projects, setActiveProject } = useAssessmentStore()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>Please sign in to access assessments</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/">
              <Button className="w-full">Go to Sign In</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  const activeProject = getActiveProject()

  if (!activeProject) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-4">
                <Link href="/">
                  <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                    <ArrowLeft className="h-4 w-4" />
                    <span>Back to Dashboard</span>
                  </Button>
                </Link>
                <div className="h-6 w-px bg-gray-300" />
                <h1 className="text-xl font-semibold text-gray-900">Assessment</h1>
              </div>
              <div className="text-sm text-gray-600">Signed in as {user.email}</div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <Card className="max-w-md mx-auto">
              <CardHeader>
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-orange-100">
                  <AlertTriangle className="h-6 w-6 text-orange-600" />
                </div>
                <CardTitle>No Active Project</CardTitle>
                <CardDescription>
                  Please select or create a project from the dashboard to start an assessment.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Alert className="mb-4">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    You need to create or select a project before you can begin an assessment. Projects help organize
                    your assessments and allow you to track progress over time.
                  </AlertDescription>
                </Alert>

                {projects.length > 0 && (
                  <div className="mb-4">
                    <h4 className="font-medium mb-2">Available Projects:</h4>
                    <div className="space-y-2">
                      {projects.map((project) => (
                        <Button
                          key={project.name}
                          variant="outline"
                          className="w-full justify-start bg-transparent"
                          onClick={() => setActiveProject(project.name)}
                        >
                          <Play className="h-4 w-4 mr-2" />
                          {project.name}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                <Link href="/">
                  <Button className="w-full">Go to Dashboard</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                  <ArrowLeft className="h-4 w-4" />
                  <span>Back to Dashboard</span>
                </Button>
              </Link>
              <div className="h-6 w-px bg-gray-300" />
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Assessment Standards</h1>
                <p className="text-sm text-gray-500">Project: {activeProject.name}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm text-gray-600">Project Active</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              Select an assessment standard below to begin your evaluation. Each standard contains specific questions
              designed to assess your Power Platform implementation.
            </AlertDescription>
          </Alert>
        </div>

        <AssessmentStandardsList />
      </main>
    </div>
  )
}
