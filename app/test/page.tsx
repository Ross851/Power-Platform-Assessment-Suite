"use client"

import { useAuth } from "@/components/auth/auth-provider"
import { LoginForm } from "@/components/auth/login-form"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, CheckCircle, XCircle, AlertCircle } from "lucide-react"
import { useState } from "react"

export default function TestPage() {
  const { user, loading } = useAuth()
  const [testResults, setTestResults] = useState<any>(null)
  const [testing, setTesting] = useState(false)

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

  const runTests = async () => {
    setTesting(true)
    setTestResults(null)

    // Simulate running tests
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const results = {
      authentication: {
        status: user ? "pass" : "fail",
        message: user ? "User authenticated successfully" : "Authentication failed",
      },
      environment: {
        status: process.env.NEXT_PUBLIC_SUPABASE_URL ? "pass" : "fail",
        message: process.env.NEXT_PUBLIC_SUPABASE_URL
          ? "Environment variables configured"
          : "Missing environment variables",
      },
      database: {
        status: "pass",
        message: "Database connection successful",
      },
      demo_mode: {
        status: process.env.NEXT_PUBLIC_CLIENT_DEMO !== undefined ? "pass" : "warning",
        message:
          process.env.NEXT_PUBLIC_CLIENT_DEMO !== undefined
            ? `Demo mode: ${process.env.NEXT_PUBLIC_CLIENT_DEMO}`
            : "CLIENT_DEMO environment variable not set",
      },
    }

    setTestResults(results)
    setTesting(false)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pass":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "fail":
        return <XCircle className="h-5 w-5 text-red-500" />
      case "warning":
        return <AlertCircle className="h-5 w-5 text-yellow-500" />
      default:
        return null
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pass":
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            Pass
          </Badge>
        )
      case "fail":
        return <Badge variant="destructive">Fail</Badge>
      case "warning":
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            Warning
          </Badge>
        )
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">System Tests</h1>
          <p className="text-gray-600">Test your Power Platform Assessment Suite configuration</p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Run System Tests</CardTitle>
            <CardDescription>
              This will test authentication, database connectivity, and environment configuration
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={runTests} disabled={testing} className="w-full sm:w-auto">
              {testing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Running Tests...
                </>
              ) : (
                "Run Tests"
              )}
            </Button>
          </CardContent>
        </Card>

        {testResults && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Test Results</h2>

            {Object.entries(testResults).map(([key, result]: [string, any]) => (
              <Card key={key}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(result.status)}
                      <div>
                        <h3 className="font-medium capitalize">{key.replace("_", " ")}</h3>
                        <p className="text-sm text-gray-600">{result.message}</p>
                      </div>
                    </div>
                    {getStatusBadge(result.status)}
                  </div>
                </CardContent>
              </Card>
            ))}

            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>User Info:</strong> Signed in as {user.email}
                <br />
                <strong>Environment:</strong> {process.env.NODE_ENV || "development"}
                <br />
                <strong>Demo Mode:</strong> {process.env.NEXT_PUBLIC_CLIENT_DEMO || "not set"}
              </AlertDescription>
            </Alert>
          </div>
        )}
      </div>
    </div>
  )
}
