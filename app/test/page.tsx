"use client"

import { useAuth } from "@/components/auth/auth-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, AlertCircle } from "lucide-react"
import { useState } from "react"
import { supabase } from "@/lib/supabase/client"

export default function TestPage() {
  const { user, loading } = useAuth()
  const [testResults, setTestResults] = useState<any>({})
  const [testing, setTesting] = useState(false)

  const runTests = async () => {
    setTesting(true)
    const results: any = {}

    // Test 1: Authentication
    results.auth = user ? "pass" : "fail"

    // Test 2: Supabase Connection
    try {
      const { data, error } = await supabase.from("profiles").select("count").limit(1)
      results.supabase = error ? "fail" : "pass"
    } catch (error) {
      results.supabase = "fail"
    }

    // Test 3: Environment Variables
    results.env = process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "pass" : "fail"

    setTestResults(results)
    setTesting(false)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pass":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "fail":
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return <AlertCircle className="h-4 w-4 text-yellow-500" />
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
      default:
        return <Badge variant="secondary">Unknown</Badge>
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">System Test Dashboard</h1>
          <p className="text-gray-600 mt-2">Test authentication and system functionality</p>
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>System Tests</CardTitle>
              <CardDescription>Run comprehensive tests to verify system functionality</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={runTests} disabled={testing} className="mb-4">
                {testing ? "Running Tests..." : "Run System Tests"}
              </Button>

              {Object.keys(testResults).length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(testResults.auth)}
                      <span>Authentication</span>
                    </div>
                    {getStatusBadge(testResults.auth)}
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(testResults.supabase)}
                      <span>Supabase Connection</span>
                    </div>
                    {getStatusBadge(testResults.supabase)}
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(testResults.env)}
                      <span>Environment Variables</span>
                    </div>
                    {getStatusBadge(testResults.env)}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>User Information</CardTitle>
              <CardDescription>Current authentication status and user details</CardDescription>
            </CardHeader>
            <CardContent>
              {user ? (
                <div className="space-y-2">
                  <p>
                    <strong>Email:</strong> {user.email}
                  </p>
                  <p>
                    <strong>User ID:</strong> {user.id}
                  </p>
                  <p>
                    <strong>Created:</strong> {new Date(user.created_at).toLocaleDateString()}
                  </p>
                  <Badge variant="default" className="bg-green-100 text-green-800">
                    Authenticated
                  </Badge>
                </div>
              ) : (
                <div>
                  <p>Not authenticated</p>
                  <Badge variant="destructive">Not Signed In</Badge>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
