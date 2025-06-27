"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useAuth } from "@/components/auth/auth-provider"
import { useAssessmentStore } from "@/store/assessment-store"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Users, FileText, Play, AlertTriangle, CheckCircle, Clock, Shield } from "lucide-react"
import Link from "next/link"

interface Project {
  id: string
  name: string
  client_name?: string
  created_at: string
  owner_id: string
}

export default function ProjectPage() {
  const params = useParams()
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const { projects } = useAssessmentStore()
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const projectName = decodeURIComponent(params.projectName as string)

  useEffect(() => {
    if (authLoading) return

    if (!user) {
      router.push("/")
      return
    }

    // Find the project in the store
    const foundProject = projects.find((p) => p.name === projectName)

    if (foundProject) {
      setProject({
        id: foundProject.id || Date.now().toString(),
        name: foundProject.name,
        client_name: foundProject.client_name || undefined,
        created_at: foundProject.created_at || new Date().toISOString(),
        owner_id: foundProject.owner_id || user.id,
      })
    } else {
      setError("Project not found")
    }

    setLoading(false)
  }, [projectName, projects, user, authLoading, router])

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading project...</p>
        </div>
      </div>
    )
  }

  if (error || !project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              <span>Project Not Found</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600">
              The project "{projectName}" could not be found or you don't have access to it.
            </p>
            <Button asChild className="w-full">
              <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const isOwner = project.owner_id === user?.id

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Dashboard
                </Link>
              </Button>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">{project.name}</h1>
                {project.client_name && <p className="text-sm text-gray-500">Client: {project.client_name}</p>}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant={isOwner ? "default" : "secondary"}>{isOwner ? "Owner" : "Viewer"}</Badge>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="assessments">Assessments</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="access">Access</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Project Info */}
            <Card>
              <CardHeader>
                <CardTitle>Project Information</CardTitle>
                <CardDescription>Basic details about this assessment project</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Project Name</label>
                    <p className="text-lg">{project.name}</p>
                  </div>
                  {project.client_name && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Client</label>
                      <p className="text-lg">{project.client_name}</p>
                    </div>
                  )}
                  <div>
                    <label className="text-sm font-medium text-gray-500">Created</label>
                    <p className="text-lg">{new Date(project.created_at).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Status</label>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Active</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Play className="h-5 w-5" />
                    <span>Start Assessment</span>
                  </CardTitle>
                  <CardDescription>Begin a new assessment for this project</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full" asChild>
                    <Link href="/assessment">Start New Assessment</Link>
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <FileText className="h-5 w-5" />
                    <span>Documents</span>
                  </CardTitle>
                  <CardDescription>Manage project documents and files</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full bg-transparent">
                    View Documents
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Users className="h-5 w-5" />
                    <span>Team Access</span>
                  </CardTitle>
                  <CardDescription>Manage who can access this project</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full bg-transparent" disabled={!isOwner}>
                    {isOwner ? "Manage Access" : "View Access"}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="assessments">
            <Card>
              <CardHeader>
                <CardTitle>Assessment History</CardTitle>
                <CardDescription>View and manage assessments for this project</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No assessments yet</h3>
                  <p className="text-gray-500 mb-4">Start your first assessment to see it here.</p>
                  <Button asChild>
                    <Link href="/assessment">
                      <Play className="mr-2 h-4 w-4" />
                      Start Assessment
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="documents">
            <Card>
              <CardHeader>
                <CardTitle>Project Documents</CardTitle>
                <CardDescription>Upload and manage documents related to this project</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No documents uploaded</h3>
                  <p className="text-gray-500 mb-4">Upload documents to support your assessments.</p>
                  <Button disabled>Upload Document</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="access">
            <Card>
              <CardHeader>
                <CardTitle>Project Access</CardTitle>
                <CardDescription>
                  {isOwner
                    ? "Manage who has access to this project and their permissions."
                    : "You can view who has access to this project, but only the owner can manage access."}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Alert>
                  <Shield className="h-4 w-4" />
                  <AlertDescription>
                    Access management features are being set up. The database tables for user access control need to be
                    created. Please run the migration script to enable full access management.
                  </AlertDescription>
                </Alert>

                <div className="mt-6">
                  <h4 className="font-medium mb-3">Current Access</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{user?.email}</p>
                        <p className="text-sm text-gray-500">Project Owner</p>
                      </div>
                      <Badge>Owner</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
