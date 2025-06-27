"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProjectAccessManager } from "@/components/project-access-manager"
import { TestDashboard } from "@/components/test-dashboard"
import { useAuth } from "@/components/auth/auth-provider"
import { createClient } from "@/lib/supabase/client"
import { AlertCircle, FileText, Users, Settings, Play, CheckCircle, XCircle, Clock, ArrowLeft } from "lucide-react"

interface Project {
  id: string
  name: string
  description: string | null
  owner_id: string
  created_at: string
  updated_at: string
}

interface Assessment {
  id: string
  standard_slug: string
  data: any
  created_at: string
  updated_at: string
}

export default function ProjectPage() {
  const params = useParams()
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const [project, setProject] = useState<Project | null>(null)
  const [userRole, setUserRole] = useState<"owner" | "editor" | "viewer" | null>(null)
  const [assessments, setAssessments] = useState<Assessment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Decode the project name from URL
  const projectName = decodeURIComponent(params.projectName as string)

  useEffect(() => {
    if (!authLoading && user) {
      fetchProject()
    }
  }, [authLoading, user, projectName])

  const fetchProject = async () => {
    try {
      setLoading(true)
      setError(null)

      const supabase = createClient()
      const decodedName = decodeURIComponent(projectName)

      /* ── 1️⃣  Fetch the project by name ───────────────────────────── */
      const { data: projectData, error: projectErr } = await supabase
        .from("projects")
        .select("*")
        .eq("name", decodedName)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle()

      if (projectErr) {
        console.error("Project query error:", projectErr)
        setError(`Database error: ${projectErr.message}`)
        return
      }

      if (!projectData) {
        setError(`No project named “${decodedName}” found or you lack access.`)
        return
      }

      setProject(projectData as Project)

      /* ── 2️⃣  Determine the user’s role ───────────────────────────── */
      if (projectData.owner_id === user!.id) {
        setUserRole("owner")
      } else {
        const { data: accessRow, error: accessErr } = await supabase
          .from("project_access")
          .select("role")
          .eq("project_id", projectData.id)
          .eq("user_id", user!.id)
          .maybeSingle()

        if (accessErr) {
          console.error("Access query error:", accessErr)
          setError(`Database error: ${accessErr.message}`)
          return
        }

        if (!accessRow) {
          setError("You do not have access to this project.")
          return
        }

        setUserRole(accessRow.role as "owner" | "editor" | "viewer")
      }

      /* ── 3️⃣  Fetch assessments ───────────────────────────────────── */
      const { data: assessmentData, error: assessErr } = await supabase
        .from("assessments")
        .select("*")
        .eq("project_id", projectData.id)

      if (assessErr) {
        console.error("Assessment query error:", assessErr)
      } else {
        setAssessments(assessmentData || [])
      }
    } catch (err) {
      console.error("Unexpected fetch error:", err)
      setError("An unexpected error occurred while loading the project.")
    } finally {
      setLoading(false)
    }
  }

  const startAssessment = (standardSlug: string) => {
    router.push(`/assessment/${standardSlug}?project=${encodeURIComponent(projectName)}`)
  }

  const getAssessmentStatus = (standardSlug: string) => {
    const assessment = assessments.find((a) => a.standard_slug === standardSlug)
    if (!assessment) return "not_started"

    const responses = Object.keys(assessment.data || {}).length
    if (responses === 0) return "not_started"
    if (responses < 10) return "in_progress" // Assuming 10+ questions per assessment
    return "completed"
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "in_progress":
        return <Clock className="h-4 w-4 text-yellow-500" />
      default:
        return <XCircle className="h-4 w-4 text-gray-400" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            Completed
          </Badge>
        )
      case "in_progress":
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            In Progress
          </Badge>
        )
      default:
        return <Badge variant="outline">Not Started</Badge>
    }
  }

  // Available assessment standards
  const assessmentStandards = [
    {
      slug: "iso-27001",
      title: "ISO 27001 Information Security",
      description: "Comprehensive information security management assessment",
    },
    {
      slug: "nist-cybersecurity",
      title: "NIST Cybersecurity Framework",
      description: "Framework for improving critical infrastructure cybersecurity",
    },
    {
      slug: "power-platform-governance",
      title: "Power Platform Governance",
      description: "Microsoft Power Platform governance and security assessment",
    },
    {
      slug: "data-governance",
      title: "Data Governance Framework",
      description: "Comprehensive data governance and privacy assessment",
    },
  ]

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading project...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          <div className="mt-6 text-center">
            <Button onClick={() => router.push("/")} variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-2xl font-bold mb-4">Project Not Found</h1>
          <p className="text-muted-foreground mb-6">
            The project "{projectName}" could not be found or you do not have access to it.
          </p>
          <Button onClick={() => router.push("/")} variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <div className="flex items-center gap-4 mb-2">
          <Button onClick={() => router.push("/")} variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Dashboard
          </Button>
          <div className="h-4 w-px bg-border" />
          <Badge variant="outline">{userRole}</Badge>
        </div>
        <h1 className="text-3xl font-bold">{project.name}</h1>
        {project.description && <p className="text-muted-foreground mt-2">{project.description}</p>}
      </div>

      <Tabs defaultValue="assessments" className="space-y-6">
        <TabsList>
          <TabsTrigger value="assessments">
            <FileText className="mr-2 h-4 w-4" />
            Assessments
          </TabsTrigger>
          <TabsTrigger value="access">
            <Users className="mr-2 h-4 w-4" />
            Project Access
          </TabsTrigger>
          <TabsTrigger value="tests">
            <Settings className="mr-2 h-4 w-4" />
            System Tests
          </TabsTrigger>
        </TabsList>

        <TabsContent value="assessments" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Available Assessments</CardTitle>
              <CardDescription>Choose an assessment standard to begin or continue your evaluation</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {assessmentStandards.map((standard) => {
                  const status = getAssessmentStatus(standard.slug)
                  return (
                    <Card key={standard.slug} className="relative">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(status)}
                            <CardTitle className="text-lg">{standard.title}</CardTitle>
                          </div>
                          {getStatusBadge(status)}
                        </div>
                        <CardDescription>{standard.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <Button
                          onClick={() => startAssessment(standard.slug)}
                          className="w-full"
                          disabled={userRole === "viewer"}
                        >
                          <Play className="mr-2 h-4 w-4" />
                          {status === "not_started" ? "Start Assessment" : "Continue Assessment"}
                        </Button>
                        {userRole === "viewer" && (
                          <p className="text-xs text-muted-foreground mt-2 text-center">
                            Viewers can only view completed assessments
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="access">
          <ProjectAccessManager projectName={project.name} isOwner={userRole === "owner"} />
        </TabsContent>

        <TabsContent value="tests">
          <TestDashboard />
        </TabsContent>
      </Tabs>
    </div>
  )
}
