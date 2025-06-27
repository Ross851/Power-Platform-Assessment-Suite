"use client"

import { useAuth } from "@/components/auth/auth-provider"
import { LoginForm } from "@/components/auth/login-form"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, TestTube, FolderOpen, Settings, LogOut } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  const { user, loading, signOut } = useAuth()

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

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Power Platform Assessment Suite</h1>
              <p className="text-gray-600">Welcome back, {user.email}</p>
            </div>
            <Button onClick={signOut} variant="outline">
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TestTube className="mr-2 h-5 w-5" />
                  Start Assessment
                </CardTitle>
                <CardDescription>Begin a new Power Platform assessment</CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/assessment">
                  <Button className="w-full">Start New Assessment</Button>
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FolderOpen className="mr-2 h-5 w-5" />
                  View Projects
                </CardTitle>
                <CardDescription>Manage your existing assessment projects</CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/projects">
                  <Button className="w-full bg-transparent" variant="outline">
                    View Projects
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="mr-2 h-5 w-5" />
                  Test System
                </CardTitle>
                <CardDescription>Run system tests and check configuration</CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/test">
                  <Button className="w-full bg-transparent" variant="outline">
                    Run Tests
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8">
            <Card>
              <CardHeader>
                <CardTitle>Getting Started</CardTitle>
                <CardDescription>Quick guide to using the Power Platform Assessment Suite</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-blue-600">1</span>
                  </div>
                  <div>
                    <h4 className="font-medium">Create a Project</h4>
                    <p className="text-sm text-gray-600">
                      Start by creating a new assessment project for your organization.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-blue-600">2</span>
                  </div>
                  <div>
                    <h4 className="font-medium">Complete Assessment</h4>
                    <p className="text-sm text-gray-600">
                      Answer questions across different assessment standards and frameworks.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-blue-600">3</span>
                  </div>
                  <div>
                    <h4 className="font-medium">Generate Reports</h4>
                    <p className="text-sm text-gray-600">Export comprehensive reports and share with stakeholders.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
