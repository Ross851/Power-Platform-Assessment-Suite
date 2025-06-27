"use client"

import { GoogleDriveSetup } from "@/components/google-drive-setup"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Cloud } from "lucide-react"
import Link from "next/link"

export default function GoogleDriveTestPage() {
  return (
    <div className="container mx-auto p-4 md:p-8 bg-background text-foreground min-h-screen">
      <header className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Link href="/">
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
        <h1 className="text-3xl font-bold text-primary flex items-center gap-2">
          <Cloud className="h-8 w-8" />
          Google Drive Integration Test
        </h1>
        <p className="text-muted-foreground">
          This is a safe testing environment for Google Drive integration.
        </p>
      </header>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Google Drive Setup</CardTitle>
            <CardDescription>
              Test the Google Drive integration here. This won't affect your main app.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <GoogleDriveSetup />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>How This Works</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h3 className="font-semibold">✅ Safe Features:</h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li>Your existing data stays untouched</li>
                <li>Google Drive is completely optional</li>
                <li>If it fails, your app keeps working</li>
                <li>You can disable it anytime</li>
                <li>Separate from your main dashboard</li>
              </ul>
            </div>
            
            <div className="space-y-2">
              <h3 className="font-semibold">🔧 To Enable:</h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li>Create Google Cloud project</li>
                <li>Enable Google Drive API</li>
                <li>Add OAuth credentials</li>
                <li>Add environment variables</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold">📁 What It Does:</h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li>Backs up your assessment data to Google Drive</li>
                <li>Syncs automatically when you save</li>
                <li>Lets you access data from any device</li>
                <li>Provides version history</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 