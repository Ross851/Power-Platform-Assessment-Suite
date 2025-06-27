"use client"

import { useAuth } from "@/components/auth/auth-provider"
import { LoginForm } from "@/components/auth/login-form"
import { CreateProjectForm } from "@/components/create-project-form"
import { ProjectList } from "@/components/project-list"
import { UserMenu } from "@/components/user-menu"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileText, Users, Shield, BarChart3, Plus, Settings } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  const { user, loading } = useAuth()

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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-semibold text-gray-900">Power Platform Assessment Suite</h1>
              <Badge variant="outline">Dashboard</Badge>
            </div>
            <UserMenu />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome back, {user.email}</h2>
          <p className="text-gray-600">Manage your assessment projects and track compliance progress.</p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center space-x-2 text-lg">
                <Plus className="h-5 w-5 text-blue-600" />
                <span>New Assessment</span>
              </CardTitle>
              <CardDescription>Start a new compliance assessment</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link href="/assessment">
                  <FileText className="mr-2 h-4 w-4" />
                  Start Assessment
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center space-x-2 text-lg">
                <BarChart3 className="h-5 w-5 text-green-600" />
                <span>Reports</span>
              </CardTitle>
              <CardDescription>View assessment reports and analytics</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full bg-transparent" disabled>
                View Reports
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center space-x-2 text-lg">
                <Users className="h-5 w-5 text-purple-600" />
                <span>Team</span>
              </CardTitle>
              <CardDescription>Manage team access and permissions</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full bg-transparent" disabled>
                Manage Team
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center space-x-2 text-lg">
                <Settings className="h-5 w-5 text-gray-600" />
                <span>System Tests</span>
              </CardTitle>
              <CardDescription>Run system diagnostics and tests</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" asChild className="w-full bg-transparent">
                <Link href="/test">
                  <Shield className="mr-2 h-4 w-4" />
                  Run Tests
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Projects List */}
          <div className="lg:col-span-2">
            <ProjectList />
          </div>

          {/* Create Project Form */}
          <div>
            <CreateProjectForm />
          </div>
        </div>
      </main>
    </div>
  )
}
