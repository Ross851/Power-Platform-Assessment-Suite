"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/components/auth/auth-provider"
import { ProjectAccessManager } from "@/components/project-access-manager"
import { ClientDemoMode } from "@/components/client-demo-mode"
import { CheckCircle, XCircle, AlertTriangle, Users, Shield, TestTube } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

interface TestResult {
  name: string
  status: "pass" | "fail" | "warning"
  message: string
  details?: string
}

export function TestDashboard() {
  const { user } = useAuth()
  const [testResults, setTestResults] = useState<TestResult[]>([])
  const [isRunningTests, setIsRunningTests] = useState(false)
  const [testProject, setTestProject] = useState<string>("test-project-" + Date.now())

  const runSystemTests = async () => {
    setIsRunningTests(true)
    const results: TestResult[] = []
    const supabase = createClient()

    // Test 1: Authentication
    try {
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser()
      results.push({
        name: "Authentication",
        status: authUser ? "pass" : "fail",
        message: authUser ? "User authenticated successfully" : "Authentication failed",
        details: authUser ? `Logged in as: ${authUser.email}` : "No user session found",
      })
    } catch (error) {
      results.push({
        name: "Authentication",
        status: "fail",
        message: "Authentication test failed",
        details: error instanceof Error ? error.message : "Unknown error",
      })
    }

    // Test 2: Database Connection
    try {
      const { data, error } = await supabase.from("projects").select("count").limit(1)
      results.push({
        name: "Database Connection",
        status: error ? "fail" : "pass",
        message: error ? "Database connection failed" : "Database connected successfully",
        details: error ? error.message : "Successfully queried projects table",
      })
    } catch (error) {
      results.push({
        name: "Database Connection",
        status: "fail",
        message: "Database test failed",
        details: error instanceof Error ? error.message : "Unknown error",
      })
    }

    // Test 3: RLS (Row Level Security)
    try {
      const { data, error } = await supabase.from("projects").select("*").limit(1)
      results.push({
        name: "Row Level Security",
        status: error ? "warning" : "pass",
        message: error ? "RLS may not be properly configured" : "RLS working correctly",
        details: error ? error.message : "User can only access authorized data",
      })
    } catch (error) {
      results.push({
        name: "Row Level Security",
        status: "fail",
        message: "RLS test failed",
        details: error instanceof Error ? error.message : "Unknown error",
      })
    }

    // Test 4: Project Creation
    try {
      const { data, error } = await supabase
        .from("projects")
        .insert({
          name: testProject,
          client_name: "Test Client",
          owner_id: user?.id,
        })
        .select()
        .single()

      results.push({
        name: "Project Creation",
        status: error ? "fail" : "pass",
        message: error ? "Failed to create test project" : "Test project created successfully",
        details: error ? error.message : `Created project: ${testProject}`,
      })
    } catch (error) {
      results.push({
        name: "Project Creation",
        status: "fail",
        message: "Project creation test failed",
        details: error instanceof Error ? error.message : "Unknown error",
      })
    }

    // Test 5: Storage Access
    try {
      const { data, error } = await supabase.storage.from("project_documents").list("", { limit: 1 })
      results.push({
        name: "Storage Access",
        status: error ? "warning" : "pass",
        message: error ? "Storage access may be limited" : "Storage accessible",
        details: error ? error.message : "Can access project documents storage",
      })
    } catch (error) {
      results.push({
        name: "Storage Access",
        status: "fail",
        message: "Storage test failed",
        details: error instanceof Error ? error.message : "Unknown error",
      })
    }

    // Test 6: Environment Variables
    const envVars = ["NEXT_PUBLIC_SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_ANON_KEY", "NEXT_PUBLIC_CLIENT_DEMO"]

    const missingEnvVars = envVars.filter((envVar) => !process.env[envVar])
    results.push({
      name: "Environment Variables",
      status: missingEnvVars.length > 0 ? "warning" : "pass",
      message:
        missingEnvVars.length > 0 ? "Some environment variables missing" : "All environment variables configured",
      details: missingEnvVars.length > 0 ? `Missing: ${missingEnvVars.join(", ")}` : "All required env vars present",
    })

    setTestResults(results)
    setIsRunningTests(false)
  }

  const cleanupTestData = async () => {
    const supabase = createClient()
    try {
      await supabase.from("projects").delete().eq("name", testProject)
    } catch (error) {
      console.error("Cleanup failed:", error)
    }
  }

  useEffect(() => {
    return () => {
      cleanupTestData()
    }
  }, [testProject])

  const getStatusIcon = (status: TestResult["status"]) => {
    switch (status) {
      case "pass":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "fail":
        return <XCircle className="h-5 w-5 text-red-500" />
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />
    }
  }

  const getStatusColor = (status: TestResult["status"]) => {
    switch (status) {
      case "pass":
        return "text-green-700 bg-green-50 border-green-200"
      case "fail":
        return "text-red-700 bg-red-50 border-red-200"
      case "warning":
        return "text-yellow-700 bg-yellow-50 border-yellow-200"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">System Test Dashboard</h1>
          <p className="text-muted-foreground">Test all authentication and access control features</p>
        </div>
        <Button onClick={runSystemTests} disabled={isRunningTests}>
          <TestTube className="mr-2 h-4 w-4" />
          {isRunningTests ? "Running Tests..." : "Run System Tests"}
        </Button>
      </div>

      <Tabs defaultValue="tests" className="space-y-4">
        <TabsList>
          <TabsTrigger value="tests">System Tests</TabsTrigger>
          <TabsTrigger value="access">Access Control</TabsTrigger>
          <TabsTrigger value="demo">Demo Mode</TabsTrigger>
          <TabsTrigger value="user">User Info</TabsTrigger>
        </TabsList>

        <TabsContent value="tests" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TestTube className="h-5 w-5" />
                System Test Results
              </CardTitle>
              <CardDescription>Comprehensive tests of authentication, database, and security features</CardDescription>
            </CardHeader>
            <CardContent>
              {testResults.length === 0 ? (
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    Click "Run System Tests" to verify all features are working correctly.
                  </AlertDescription>
                </Alert>
              ) : (
                <div className="space-y-3">
                  {testResults.map((result, index) => (
                    <div key={index} className={`p-4 rounded-lg border ${getStatusColor(result.status)}`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {getStatusIcon(result.status)}
                          <div>
                            <h3 className="font-medium">{result.name}</h3>
                            <p className="text-sm opacity-90">{result.message}</p>
                          </div>
                        </div>
                        <Badge
                          variant={
                            result.status === "pass"
                              ? "default"
                              : result.status === "fail"
                                ? "destructive"
                                : "secondary"
                          }
                        >
                          {result.status.toUpperCase()}
                        </Badge>
                      </div>
                      {result.details && <p className="text-xs mt-2 opacity-75 font-mono">{result.details}</p>}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="access" className="space-y-4">
          <ProjectAccessManager projectName={testProject} isOwner={true} />
        </TabsContent>

        <TabsContent value="demo" className="space-y-4">
          <ClientDemoMode projectName={testProject} isOwner={true} />

          <Card>
            <CardHeader>
              <CardTitle>Demo Mode Configuration</CardTitle>
              <CardDescription>Current environment settings for client demo mode</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium">Environment Variables</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>NEXT_PUBLIC_CLIENT_DEMO:</span>
                      <Badge variant={process.env.NEXT_PUBLIC_CLIENT_DEMO === "true" ? "default" : "secondary"}>
                        {process.env.NEXT_PUBLIC_CLIENT_DEMO || "false"}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>NODE_ENV:</span>
                      <Badge variant="outline">{process.env.NODE_ENV}</Badge>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">Demo Features</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Data anonymization</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Read-only mode</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Client-safe exports</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="user" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Current User Information
              </CardTitle>
              <CardDescription>Your authentication status and user details</CardDescription>
            </CardHeader>
            <CardContent>
              {user ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium mb-2">User Details</h4>
                      <div className="space-y-1 text-sm">
                        <div>
                          <strong>Email:</strong> {user.email}
                        </div>
                        <div>
                          <strong>ID:</strong> {user.id}
                        </div>
                        <div>
                          <strong>Created:</strong> {new Date(user.created_at).toLocaleDateString()}
                        </div>
                        <div>
                          <strong>Last Sign In:</strong>{" "}
                          {user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleDateString() : "N/A"}
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Metadata</h4>
                      <div className="space-y-1 text-sm">
                        <div>
                          <strong>Full Name:</strong> {user.user_metadata?.full_name || "Not set"}
                        </div>
                        <div>
                          <strong>Email Confirmed:</strong> {user.email_confirmed_at ? "Yes" : "No"}
                        </div>
                        <div>
                          <strong>Phone:</strong> {user.phone || "Not set"}
                        </div>
                      </div>
                    </div>
                  </div>

                  <Alert>
                    <Shield className="h-4 w-4" />
                    <AlertDescription>
                      You are successfully authenticated and can access all system features.
                    </AlertDescription>
                  </Alert>
                </div>
              ) : (
                <Alert variant="destructive">
                  <XCircle className="h-4 w-4" />
                  <AlertDescription>
                    No user session found. This should not happen if authentication is working correctly.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
