"use client"

import { useAuth } from "@/components/auth/auth-provider"
import { LoginForm } from "@/components/auth/login-form"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LogOut, TestTube, FolderOpen, Settings } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  const { user, loading, signOut } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
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
                <Button className="w-full" asChild>
                  <Link href="/assessment">Start New Assessment</Link>
                </Button>
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
                <Button variant="outline" className="w-full bg-transparent" asChild>
                  <Link href="/projects">View Projects</Link>
                </Button>
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
                <Button variant="outline" className="w-full bg-transparent" asChild>
                  <Link href="/test">Run Tests</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
