"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAssessmentStore } from "@/store/assessment-store"
import { useAuth } from "@/components/auth/auth-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Plus } from "lucide-react"

export function CreateProjectForm() {
  const [projectName, setProjectName] = useState("")
  const [clientName, setClientName] = useState("")
  const [clientRef, setClientRef] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const { addProject } = useAssessmentStore()
  const { user } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!projectName.trim()) {
      setError("Project name is required")
      return
    }

    if (!user) {
      setError("You must be signed in to create a project")
      return
    }

    setLoading(true)
    setError("")

    try {
      const newProject = {
        id: Date.now().toString(),
        name: projectName.trim(),
        client_name: clientName.trim() || null,
        clientReferenceNumber: clientRef.trim() || `REF-${Date.now()}`,
        created_at: new Date().toISOString(),
        owner_id: user.id,
      }

      addProject(newProject)

      // Clear form
      setProjectName("")
      setClientName("")
      setClientRef("")

      // Navigate to the new project
      router.push(`/project/${encodeURIComponent(newProject.name)}`)
    } catch (err) {
      setError("Failed to create project. Please try again.")
    }

    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="projectName">Project Name *</Label>
        <Input
          id="projectName"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          placeholder="Enter project name"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="clientName">Client Name</Label>
        <Input
          id="clientName"
          value={clientName}
          onChange={(e) => setClientName(e.target.value)}
          placeholder="Enter client name (optional)"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="clientRef">Client Reference</Label>
        <Input
          id="clientRef"
          value={clientRef}
          onChange={(e) => setClientRef(e.target.value)}
          placeholder="Enter reference number (optional)"
        />
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Button type="submit" className="w-full" disabled={loading}>
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        <Plus className="mr-2 h-4 w-4" />
        Create Project
      </Button>
    </form>
  )
}
