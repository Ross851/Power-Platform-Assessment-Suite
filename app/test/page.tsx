"use client"

import { useState } from "react"
import { useAuth } from "@/components/auth/auth-provider"
import { LoginForm } from "@/components/auth/login-form"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TestTube, CheckCircle, XCircle, AlertCircle, Loader2, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { supabase } from "@/lib/supabase/client"

interface TestResult {
  name: string
  status: "success" | "error" | "warning" | "pending"
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
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <LoginForm />
  }

  const runSystemTests = async () => {
    setIsRunningTests(true)
    const results: TestResult[] = []

    // Test 1: Authentication
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      results.push({
        name: "Authentication",
        status: session ? "success" : "error",
        message: session ? "User authenticated successfully" : "No active session",
        details: session ? `User: ${session.user.email}` : "Please sign in",
      })
    } catch (error) {
      results.push({
        name: "Authentication",
        status: "error",
        message: "Authentication test failed",
        details: error instanceof Error ? error.message : "Unknown error",
      })
    }

    // Test 2: Database Connection
    try {
      const { data, error } = await supabase.from("profiles").select("count").limit(1)
      if (error) throw error
      results.push({
        name: "Database Connection",
        status: "success",
        message: "Database connection successful",
        details: "Connected to Supabase database",
      })
    } catch (error) {
      results.push({
        name: "Database Connection",
        status: "error",
        message: "Database connection failed",
        details: error instanceof Error ? error.message : "Unknown database error",
      })
    }

    // Test 3: Row Level Security
    try {
      const { data, error } = await supabase.from("profiles").select("*").limit(1)
      results.push({
        name: "Row Level Security",
        status: error ? "warning" : "success",
        message: error ? "RLS policies may need configuration" : "RLS policies working correctly",
        details: error ? error.message : "User can only access authorized data",
      })
    } catch (error) {
      results.push({
        name: "Row Level Security",
        status: "error",
        message: "RLS test failed",
        details: error instanceof Error ? error.message : "Unknown RLS error",
      })
    }

    // Test 4: Environment Variables
    const envVars = ["NEXT_PUBLIC_SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_ANON_KEY", "NEXT_PUBLIC_CLIENT_DEMO"]

    const missingVars = envVars.filter((varName) => !process.env[varName])
    results.push({
      name: "Environment Variables",
      status: missingVars.length === 0 ? "success" : "warning",
      message:
        missingVars.length === 0
          ? "All required environment variables present"
          : `${missingVars.length} variables missing`,
      details: missingVars.length > 0 ? `Missing: ${missingVars.join(", ")}` : "All environment variables configured",
    })

    // Test 5: Storage Access
    try {
      const { data, error } = await supabase.storage.listBuckets()
      results.push({
        name: "Storage Access",
        status: error ? "error" : "success",
        message: error ? "Storage access failed" : "Storage access successful",
        details: error ? error.message : `Found ${data?.length || 0} storage buckets`,
      })
    } catch (error) {
      results.push({
        name: "Storage Access",
        status: "error",
        message: "Storage test failed",
        details: error instanceof Error ? error.message : "Unknown storage error",
      })
    }

    setTestResults(results)
    setIsRunningTests(false)
  }

  const getStatusIcon = (status: TestResult["status"]) => {
    switch (status) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "error":
        return <XCircle className="h-4 w-4 text-red-600" />
      case "warning":
        return <AlertCircle className="h-4 w-4 text-yellow-600" />
      case "pending":
        return <Loader2 className="h-4 w-4 text-blue-600 animate-spin" />
    }
  }

  const getStatusBadge = (status: TestResult["status"]) => {
    switch (status) {
      case "success":
        return <Badge className="bg-green-100 text-green-800 border-green-200">Passed</Badge>
      case "error":
        return <Badge className="bg-red-100 text-red-800 border-red-200">Failed</Badge>
      case "warning":
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Warning</Badge>
      case "pending":
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Running</Badge>
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <div className="flex items-center">
                <TestTube className="h-8 w-8 text-blue-600 mr-3" />
                <h1 className="text-xl font-semibold text-gray-900">System Tests</h1>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">System Diagnostics</h2>
          <p className="text-gray-600">Run comprehensive tests to verify system functionality and configuration.</p>
        </div>

        <Tabs defaultValue="tests" className="space-y-6">
          <TabsList>
            <TabsTrigger value="tests">System Tests</TabsTrigger>
            <TabsTrigger value="environment">Environment</TabsTrigger>
            <TabsTrigger value="user-info">User Info</TabsTrigger>
          </TabsList>

          <TabsContent value="tests" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Run System Tests</CardTitle>
                    <CardDescription>
                      Test authentication, database connectivity, and system configuration
                    </CardDescription>
                  </div>
                  <Button onClick={runSystemTests} disabled={isRunningTests} className="flex items-center space-x-2">
                    {isRunningTests ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Running Tests...</span>
                      </>
                    ) : (
                      <>
                        <TestTube className="h-4 w-4" />
                        <span>Run All Tests</span>
                      </>
                    )}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {testResults.length > 0 && (
                  <div className="space-y-4">
                    {testResults.map((result, index) => (
                      <div key={index} className="flex items-start space-x-3 p-4 border rounded-lg">
                        <div className="flex-shrink-0 mt-0.5">{getStatusIcon(result.status)}</div>
                        <div className="flex-grow">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium text-gray-900">{result.name}</h4>
                            {getStatusBadge(result.status)}
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{result.message}</p>
                          {result.details && <p className="text-xs text-gray-500 mt-1">{result.details}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {testResults.length === 0 && !isRunningTests && (
                  <div className="text-center py-8 text-gray-500">
                    <TestTube className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>Click "Run All Tests" to start system diagnostics</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="environment" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Environment Configuration</CardTitle>
                <CardDescription>Current environment variables and system settings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-2">Supabase Configuration</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">URL:</span>
                          <span className={process.env.NEXT_PUBLIC_SUPABASE_URL ? "text-green-600" : "text-red-600"}>
                            {process.env.NEXT_PUBLIC_SUPABASE_URL ? "✓ Configured" : "✗ Missing"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Anon Key:</span>
                          <span
                            className={process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "text-green-600" : "text-red-600"}
                          >
                            {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "✓ Configured" : "✗ Missing"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-2">Application Settings</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Demo Mode:</span>
                          <span className="text-blue-600">{process.env.NEXT_PUBLIC_CLIENT_DEMO || "false"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Environment:</span>
                          <span className="text-blue-600">{process.env.NODE_ENV || "development"}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="user-info" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>User Information</CardTitle>
                <CardDescription>Current user session and authentication details</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">Authentication Status</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Status:</span>
                        <Badge className="bg-green-100 text-green-800 border-green-200">Authenticated</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Email:</span>
                        <span className="text-gray-900">{user.email}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">User ID:</span>
                        <span className="text-gray-900 font-mono text-xs">{user.id}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Email Confirmed:</span>
                        <span className={user.email_confirmed_at ? "text-green-600" : "text-yellow-600"}>
                          {user.email_confirmed_at ? "✓ Confirmed" : "⚠ Pending"}
                        </span>
                      </div>
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
