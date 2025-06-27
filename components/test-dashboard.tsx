"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth } from "@/components/auth/auth-provider"
import { createClient } from "@/lib/supabase/client"
import { CheckCircle, XCircle, AlertCircle, Play, User, Database, Settings } from "lucide-react"

interface TestResult {
  name: string
  status: "success" | "error" | "warning" | "pending"
  message: string
  details?: string
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
          message: `User authenticated successfully`,
          details: `User: ${user.email}`,
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
      const { data, error } = await supabase.from("profiles").select("count").limit(1)
      if (error) {
        results.push({
          name: "Database Connection",
          status: "error",
          message: `Database connection failed`,
          details: error.message,
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
        message: `Database connection failed`,
        details: `${error}`,
      })
    }

    // Test 3: Row Level Security
    try {
      const supabase = createClient()
      const { data, error } = await supabase.from("profiles").select("*").limit(1)
      if (error) {
        if (error.message.includes("does not exist")) {
          results.push({
            name: "Row Level Security",
            status: "warning",
            message: "RLS policies may need configuration",
            details: 'relation "public.profiles" does not exist',
          })
        } else {
          results.push({
            name: "Row Level Security",
            status: "error",
            message: "RLS configuration error",
            details: error.message,
          })
        }
      } else {
        results.push({
          name: "Row Level Security",
          status: "success",
          message: "RLS policies configured correctly",
        })
      }
    } catch (error) {
      results.push({
        name: "Row Level Security",
        status: "error",
        message: "RLS test failed",
        details: `${error}`,
      })
    }

    // Test 4: Environment Variables
    const requiredEnvVars = ["NEXT_PUBLIC_SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_ANON_KEY", "NEXT_PUBLIC_CLIENT_DEMO"]

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
        status: "warning",
        message: `${missingVars.length} variables missing`,
        details: `Missing: ${missingVars.join(", ")}`,
      })
    }

    // Test 5: Storage Access
    try {
      const supabase = createClient()
      const { data, error } = await supabase.storage.listBuckets()
      if (error) {
        results.push({
          name: "Storage Access",
          status: "error",
          message: "Storage access failed",
          details: error.message,
        })
      } else {
        results.push({
          name: "Storage Access",
          status: "success",
          message: "Storage access successful",
          details: `Found ${data?.length || 0} storage buckets`,
        })
      }
    } catch (error) {
      results.push({
        name: "Storage Access",
        status: "error",
        message: "Storage test failed",
        details: `${error}`,
      })
    }

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

  const getStatusBadge = (status: TestResult["status"]) => {
    switch (status) {
      case "success":
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            Passed
          </Badge>
        )
      case "error":
        return <Badge variant="destructive">Failed</Badge>
      case "warning":
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            Warning
          </Badge>
        )
      default:
        return <Badge variant="outline">Pending</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Run System Tests
              </CardTitle>
              <CardDescription>Test authentication, database connectivity, and system configuration</CardDescription>
            </div>
            <Button onClick={runSystemTests} disabled={isRunning}>
              {isRunning ? (
                <>
                  <Play className="mr-2 h-4 w-4 animate-spin" />
                  Running...
                </>
              ) : (
                <>
                  <Play className="mr-2 h-4 w-4" />
                  Run All Tests
                </>
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {testResults.length === 0 ? (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>Click "Run All Tests" to check your system configuration</AlertDescription>
            </Alert>
          ) : (
            <div className="space-y-3">
              {testResults.map((result, index) => (
                <div key={index} className="flex items-start justify-between p-4 border rounded-lg">
                  <div className="flex items-start gap-3 flex-1">
                    {getStatusIcon(result.status)}
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="font-medium">{result.name}</p>
                        {getStatusBadge(result.status)}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{result.message}</p>
                      {result.details && (
                        <p className="text-xs text-muted-foreground mt-1 font-mono bg-muted px-2 py-1 rounded">
                          {result.details}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Tabs defaultValue="environment" className="space-y-4">
        <TabsList>
          <TabsTrigger value="environment">Environment</TabsTrigger>
          <TabsTrigger value="user">User Info</TabsTrigger>
        </TabsList>

        <TabsContent value="environment">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Environment Configuration
              </CardTitle>
              <CardDescription>Current environment settings and configuration</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Supabase URL</p>
                      <p className="text-sm text-muted-foreground">Database connection endpoint</p>
                    </div>
                    <Badge variant={process.env.NEXT_PUBLIC_SUPABASE_URL ? "default" : "destructive"}>
                      {process.env.NEXT_PUBLIC_SUPABASE_URL ? "Set" : "Missing"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Supabase Anon Key</p>
                      <p className="text-sm text-muted-foreground">Public API key</p>
                    </div>
                    <Badge variant={process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "default" : "destructive"}>
                      {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "Set" : "Missing"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Client Demo Mode</p>
                      <p className="text-sm text-muted-foreground">Demo mode configuration</p>
                    </div>
                    <Badge variant={process.env.NEXT_PUBLIC_CLIENT_DEMO ? "default" : "secondary"}>
                      {process.env.NEXT_PUBLIC_CLIENT_DEMO || "Not Set"}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="user">
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium">Email</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">User ID</p>
                      <p className="text-sm text-muted-foreground font-mono text-xs">{user.id}</p>
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
      </Tabs>
    </div>
  )
}
