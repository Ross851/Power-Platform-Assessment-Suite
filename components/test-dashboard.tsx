"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth } from "@/components/auth/auth-provider"
import { createClient } from "@/lib/supabase/client"
import { CheckCircle, XCircle, AlertCircle, Play, User, Database, Shield, Settings } from "lucide-react"

interface TestResult {
  name: string
  status: "success" | "error" | "warning" | "pending"
  message: string
}

export function TestDashboard() {
  const { user } = useAuth()
  const [testResults, setTestResults] = useState<TestResult[]>([])
  const [isRunning, setIsRunning] = useState(false)

  const runSystemTests = async () => {
    setIsRunning(true)
    const results: TestResult[] = []

    // Test 1: Authentication
    try {
      if (user) {
        results.push({
          name: "Authentication",
          status: "success",
          message: `User authenticated: ${user.email}`,
        })
      } else {
        results.push({
          name: "Authentication",
          status: "error",
          message: "No user authenticated",
        })
      }
    } catch (error) {
      results.push({
        name: "Authentication",
        status: "error",
        message: `Auth error: ${error}`,
      })
    }

    // Test 2: Database Connection
    try {
      const supabase = createClient()
      const { data, error } = await supabase.from("projects").select("count").limit(1)
      if (error) {
        results.push({
          name: "Database Connection",
          status: "error",
          message: `Database error: ${error.message}`,
        })
      } else {
        results.push({
          name: "Database Connection",
          status: "success",
          message: "Database connection successful",
        })
      }
    } catch (error) {
      results.push({
        name: "Database Connection",
        status: "error",
        message: `Connection failed: ${error}`,
      })
    }

    // Test 3: Environment Variables
    const requiredEnvVars = ["NEXT_PUBLIC_SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_ANON_KEY"]

    const missingVars = requiredEnvVars.filter((varName) => !process.env[varName])

    if (missingVars.length === 0) {
      results.push({
        name: "Environment Variables",
        status: "success",
        message: "All required environment variables are set",
      })
    } else {
      results.push({
        name: "Environment Variables",
        status: "error",
        message: `Missing variables: ${missingVars.join(", ")}`,
      })
    }

    // Test 4: Demo Mode Configuration
    const demoMode = process.env.NEXT_PUBLIC_CLIENT_DEMO
    results.push({
      name: "Demo Mode Configuration",
      status: demoMode !== undefined ? "success" : "warning",
      message: `Demo mode: ${demoMode || "not configured"}`,
    })

    setTestResults(results)
    setIsRunning(false)
  }

  const getStatusIcon = (status: TestResult["status"]) => {
    switch (status) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "error":
        return <XCircle className="h-4 w-4 text-red-500" />
      case "warning":
        return <AlertCircle className="h-4 w-4 text-yellow-500" />
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">System Test Dashboard</h1>
          <p className="text-muted-foreground">Test all authentication and access control features</p>
        </div>
        <Button onClick={runSystemTests} disabled={isRunning}>
          {isRunning ? (
            <>
              <Play className="mr-2 h-4 w-4 animate-spin" />
              Running Tests...
            </>
          ) : (
            <>
              <Play className="mr-2 h-4 w-4" />
              Run System Tests
            </>
          )}
        </Button>
      </div>

      <Tabs defaultValue="tests" className="space-y-4">
        <TabsList>
          <TabsTrigger value="tests">System Tests</TabsTrigger>
          <TabsTrigger value="user">User Info</TabsTrigger>
          <TabsTrigger value="demo">Demo Mode</TabsTrigger>
          <TabsTrigger value="access">Access Control</TabsTrigger>
        </TabsList>

        <TabsContent value="tests" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                System Tests
              </CardTitle>
              <CardDescription>Verify that all core systems are working correctly</CardDescription>
            </CardHeader>
            <CardContent>
              {testResults.length === 0 ? (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>Click "Run System Tests" to check your system configuration</AlertDescription>
                </Alert>
              ) : (
                <div className="space-y-3">
                  {testResults.map((result, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(result.status)}
                        <div>
                          <p className="font-medium">{result.name}</p>
                          <p className="text-sm text-muted-foreground">{result.message}</p>
                        </div>
                      </div>
                      <Badge
                        variant={
                          result.status === "success"
                            ? "default"
                            : result.status === "error"
                              ? "destructive"
                              : "secondary"
                        }
                      >
                        {result.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="user" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                User Information
              </CardTitle>
              <CardDescription>Current authentication status and user details</CardDescription>
            </CardHeader>
            <CardContent>
              {user ? (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium">Email</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">User ID</p>
                      <p className="text-sm text-muted-foreground font-mono">{user.id}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Full Name</p>
                      <p className="text-sm text-muted-foreground">{user.user_metadata?.full_name || "Not set"}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Created</p>
                      <p className="text-sm text-muted-foreground">{new Date(user.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>No user authenticated</AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="demo" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Demo Mode Configuration
              </CardTitle>
              <CardDescription>Client demo mode settings and environment configuration</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">Client Demo Mode</p>
                    <p className="text-sm text-muted-foreground">NEXT_PUBLIC_CLIENT_DEMO environment variable</p>
                  </div>
                  <Badge variant={process.env.NEXT_PUBLIC_CLIENT_DEMO === "true" ? "default" : "secondary"}>
                    {process.env.NEXT_PUBLIC_CLIENT_DEMO || "not set"}
                  </Badge>
                </div>
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Set NEXT_PUBLIC_CLIENT_DEMO=true for client presentations, false for normal operation
                  </AlertDescription>
                </Alert>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="access" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Access Control Testing
              </CardTitle>
              <CardDescription>Test user invitation and project access features</CardDescription>
            </CardHeader>
            <CardContent>
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Access control testing will be available once you create your first project. Go to the main dashboard
                  to create a project and test user invitations.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
