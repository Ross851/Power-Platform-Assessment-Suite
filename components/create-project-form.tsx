"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAssessmentStore } from "@/store/assessment-store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2 } from "lucide-react"

export function CreateProjectForm() {
  const [projectName, setProjectName] = useState("")
  const [clientName, setClientName] = useState("")
  const [description, setDescription] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const { createProject } = useAssessmentStore()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    if (!projectName.trim()) {
      setError("Project name is required")
      setLoading(false)
      return
    }

    try {
      const project = {
        name: projectName.trim(),
        clientReferenceNumber: clientName.trim() || `REF-${Date.now()}`,
        description: description.trim(),
        createdAt: new Date().toISOString(),
        lastModifiedAt: new Date().toISOString(),
        standards: [],
      }

      createProject(project)

      // Reset form
      setProjectName("")
      setClientName("")
      setDescription("")

      // Navigate to the new project
      router.push(`/project/${encodeURIComponent(project.name)}`)
    } catch (err) {
      setError("Failed to create project. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="project-name">Project Name *</Label>
        <Input
          id="project-name"
          type="text"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          placeholder="Enter project name"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="client-name">Client Reference</Label>
        <Input
          id="client-name"
          type="text"
          value={clientName}
          onChange={(e) => setClientName(e.target.value)}
          placeholder="Enter client reference"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter project description (optional)"
          rows={3}
        />
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Button type="submit" className="w-full" disabled={loading}>
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Create Project
      </Button>
    </form>
  )
}
