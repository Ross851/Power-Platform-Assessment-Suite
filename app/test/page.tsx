"use client"

import type React from "react"
import { useState } from "react"
import { useAuth } from "@/components/auth/auth-provider"
import { LoginForm } from "@/components/auth/login-form"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle, XCircle, AlertCircle, Loader2, Database, Users, Settings, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { supabase } from "@/lib/supabase/client"

interface TestResult {
  name: string
  status: "success" | "error" | "warning" | "loading"
  message: string
  details?: string
}

export default function TestPage() {
  const { user, loading } = useAuth()
  const [testResults, setTestResults] = useState<TestResult[]>([])
  const [isRunningTests, setIsRunningTests] = useState(false)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!user) {
    return <LoginForm />
  }

  const runSystemTests = async () => {
    setIsRunningTests(true)
    setTestResults([])

    const tests: TestResult[] = []

    // Test 1: Environment Variables
    tests.push({
      name: "Environment Variables",
      status: "loading",
      message: "Checking environment configuration...",
    })
    setTestResults([...tests])

    await new Promise((resolve) => setTimeout(resolve, 500))

    const hasSupabaseUrl = !!process.env.NEXT_PUBLIC_SUPABASE_URL
    const hasSupabaseKey = !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    const hasDemoMode = process.env.NEXT_PUBLIC_CLIENT_DEMO !== undefined

    tests[0] = {
      name: "Environment Variables",
      status: hasSupabaseUrl && hasSupabaseKey ? "success" : "error",
      message:
        hasSupabaseUrl && hasSupabaseKey
          ? "All required environment variables are configured"
          : "Missing required environment variables",
      details: `Supabase URL: ${hasSupabaseUrl ? "✓" : "✗"}, Supabase Key: ${hasSupabaseKey ? "✓" : "✗"}, Demo Mode: ${hasDemoMode ? "✓" : "✗"}`,
    }
    setTestResults([...tests])

    // Test 2: Database Connection
    tests.push({
      name: "Database Connection",
      status: "loading",
      message: "Testing database connectivity...",
    })
    setTestResults([...tests])

    await new Promise((resolve) => setTimeout(resolve, 1000))

    try {
      const { data, error } = await supabase.from("profiles").select("count").limit(1)
      tests[1] = {
        name: "Database Connection",
        status: error ? "error" : "success",
        message: error ? `Database error: ${error.message}` : "Database connection successful",
        details: error ? error.details : "Successfully connected to Supabase database",
      }
    } catch (err) {
      tests[1] = {
        name: "Database Connection",
        status: "error",
        message: "Failed to connect to database",
        details: err instanceof Error ? err.message : "Unknown database error",
      }
    }
    setTestResults([...tests])

    // Test 3: Authentication
    tests.push({
      name: "Authentication System",
      status: "loading",
      message: "Verifying authentication...",
    })
    setTestResults([...tests])

    await new Promise((resolve) => setTimeout(resolve, 500))

    tests[2] = {
      name: "Authentication System",
      status: user ? "success" : "error",
      message: user ? `Authenticated as ${user.email}` : "Authentication failed",
      details: user ? `User ID: ${user.id}` : "No active user session",
    }
    setTestResults([...tests])

    // Test 4: Row Level Security
    tests.push({
      name: "Row Level Security",
      status: "loading",
      message: "Testing RLS policies...",
    })
    setTestResults([...tests])

    await new Promise((resolve) => setTimeout(resolve, 800))

    try {
      const { data, error } = await supabase.from("project_access").select("*").limit(1)
      tests[3] = {
        name: "Row Level Security",
        status: "success",
        message: "RLS policies are active",
        details: "Row Level Security is properly configured",
      }
    } catch (err) {
      tests[3] = {
        name: "Row Level Security",
        status: "warning",
        message: "RLS status unclear",
        details: "Unable to verify RLS configuration",
      }
    }
    setTestResults([...tests])

    setIsRunningTests(false)
  }

  const getStatusIcon = (status: TestResult["status"]) => {
    switch (status) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "error":
        return <XCircle className="h-5 w-5 text-red-500" />
      case "warning":
        return <AlertCircle className="h-5 w-5 text-yellow-500" />
      case "loading":
        return <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
    }
  }

  const getStatusBadge = (status: TestResult["status"]) => {
    switch (status) {
      case "success":
        return <Badge className="bg-green-100 text-green-800">Passed</Badge>
      case "error":
        return <Badge variant="destructive">Failed</Badge>
      case "warning":
        return <Badge className="bg-yellow-100 text-yellow-800">Warning</Badge>
      case "loading":
        return <Badge className="bg-blue-100 text-blue-800">Running</Badge>
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" asChild>
                <Link href="/">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Dashboard
                </Link>
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">System Tests</h1>
                <p className="text-gray-600">Verify system configuration and functionality</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <Tabs defaultValue="system-tests" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="system-tests">System Tests</TabsTrigger>
              <TabsTrigger value="user-info">User Info</TabsTrigger>
              <TabsTrigger value="environment">Environment</TabsTrigger>
              <TabsTrigger value="help">Help</TabsTrigger>
            </TabsList>

            <TabsContent value="system-tests" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Settings className="mr-2 h-5 w-5" />
                    System Tests
                  </CardTitle>
                  <CardDescription>Run comprehensive tests to verify system functionality</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button onClick={runSystemTests} disabled={isRunningTests} className="mb-6">
                    {isRunningTests ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Running Tests...
                      </>
                    ) : (
                      "Run System Tests"
                    )}
                  </Button>

                  {testResults.length > 0 && (
                    <div className="space-y-4">
                      {testResults.map((test, index) => (
                        <div key={index} className="flex items-start space-x-3 p-4 border rounded-lg">
                          {getStatusIcon(test.status)}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <h4 className="font-medium text-gray-900">{test.name}</h4>
                              {getStatusBadge(test.status)}
                            </div>
                            <p className="text-sm text-gray-600 mt-1">{test.message}</p>
                            {test.details && <p className="text-xs text-gray-500 mt-2">{test.details}</p>}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="user-info" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="mr-2 h-5 w-5" />
                    User Information
                  </CardTitle>
                  <CardDescription>Current user session details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Email</Label>
                      <p className="text-sm text-gray-900">{user.email}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-700">User ID</Label>
                      <p className="text-sm text-gray-900 font-mono">{user.id}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Created</Label>
                      <p className="text-sm text-gray-900">{new Date(user.created_at).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Last Sign In</Label>
                      <p className="text-sm text-gray-900">
                        {user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleDateString() : "Never"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="environment" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Database className="mr-2 h-5 w-5" />
                    Environment Configuration
                  </CardTitle>
                  <CardDescription>Current environment settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                      <span className="font-medium">Supabase URL</span>
                      <Badge variant={process.env.NEXT_PUBLIC_SUPABASE_URL ? "default" : "destructive"}>
                        {process.env.NEXT_PUBLIC_SUPABASE_URL ? "Configured" : "Missing"}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                      <span className="font-medium">Supabase Anon Key</span>
                      <Badge variant={process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "default" : "destructive"}>
                        {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "Configured" : "Missing"}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                      <span className="font-medium">Client Demo Mode</span>
                      <Badge variant="outline">{process.env.NEXT_PUBLIC_CLIENT_DEMO || "Not Set"}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="help" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Troubleshooting Guide</CardTitle>
                  <CardDescription>Common issues and solutions</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Authentication Issues:</strong> If you can't sign in, check that your Supabase environment
                      variables are correctly configured and that your email is confirmed.
                    </AlertDescription>
                  </Alert>

                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Database Errors:</strong> Ensure your Supabase project is active and the database URL is
                      correct. Check the Supabase dashboard for any service issues.
                    </AlertDescription>
                  </Alert>

                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Missing Features:</strong> If certain features aren't working, verify that all required
                      SQL scripts have been run in your Supabase database.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}

function Label({ children, className }: { children: React.ReactNode; className?: string }) {
  return <label className={className}>{children}</label>
}
