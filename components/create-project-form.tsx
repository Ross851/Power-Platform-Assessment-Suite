"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useActionState } from "react"
import { useAssessmentStore } from "@/store/assessment-store"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, AlertCircle } from "lucide-react"

interface FormState {
  error?: string
  success?: boolean
  projectName?: string
}

export function CreateProjectForm() {
  const router = useRouter()
  const addProject = useAssessmentStore((state) => state.addProject)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleCreateProject = async (prevState: FormState, formData: FormData): Promise<FormState> => {
    const name = (formData.get("name") as string)?.trim()
    const clientRef = (formData.get("client_name") as string)?.trim()

    if (!name) {
      return { error: "Project name is required." }
    }

    try {
      setIsSubmitting(true)

      // Add the project to the store (this simulates creating it)
      addProject({
        name,
        client_name: clientRef || null,
        clientReferenceNumber: clientRef || "",
        id: Date.now().toString(), // Simple ID generation
        created_at: new Date().toISOString(),
        owner_id: "current-user", // This would be the actual user ID in production
      })

      // Small delay to show the success state
      await new Promise((resolve) => setTimeout(resolve, 500))

      return { success: true, projectName: name }
    } catch (error) {
      console.error("Error creating project:", error)
      return { error: "Failed to create project. Please try again." }
    } finally {
      setIsSubmitting(false)
    }
  }

  const initialState: FormState = { error: undefined, success: false }
  const [state, formAction, pending] = useActionState(handleCreateProject, initialState)

  useEffect(() => {
    if (state.success && state.projectName) {
      // Use a timeout to ensure the success message is visible
      const timer = setTimeout(() => {
        router.push(`/project/${encodeURIComponent(state.projectName)}`)
      }, 1000)

      return () => clearTimeout(timer)
    }
  }, [state, router])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Project</CardTitle>
        <CardDescription>Start a new assessment for a client or a new period.</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">
              Project name<span className="text-destructive">*</span>
            </Label>
            <Input
              id="name"
              name="name"
              placeholder="e.g. FY25 Governance Review"
              required
              disabled={pending || isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="client_name">Client / Reference</Label>
            <Input id="client_name" name="client_name" placeholder="Client Ltd." disabled={pending || isSubmitting} />
          </div>

          {state.error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{state.error}</AlertDescription>
            </Alert>
          )}

          {state.success && (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>Project created successfully! Redirecting to project page...</AlertDescription>
            </Alert>
          )}

          <Button type="submit" className="w-full" disabled={pending || isSubmitting}>
            {pending || isSubmitting ? "Creating…" : "Create and Open Project"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
