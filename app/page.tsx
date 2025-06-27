"use client"

import { ProtectedRoute } from "@/components/auth/protected-route"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function HomePage() {
  return (
    <ProtectedRoute>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Welcome to Power Platform Assessment Suite</h1>
          <p className="text-muted-foreground mt-2">
            Comprehensive assessment tool for Microsoft Power Platform implementations
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Start Assessment</CardTitle>
              <CardDescription>Begin a new Power Platform assessment</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link href="/assessment">Start New Assessment</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>View Projects</CardTitle>
              <CardDescription>Manage your existing assessment projects</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline" className="w-full bg-transparent">
                <Link href="/projects">View Projects</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Test System</CardTitle>
              <CardDescription>Test authentication and system features</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="secondary" className="w-full">
                <Link href="/test">Run Tests</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  )
}
