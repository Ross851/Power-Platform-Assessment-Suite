"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useActionState } from "react"
import { useAssessmentStore } from "@/store/assessment-store"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

interface FormState {
  error?: string
  success?: boolean
  projectName?: string
}

export function CreateProjectForm() {
  const router = useRouter()
  const createProjectInStore = useAssessmentStore((state) => state.createProject)

  const handleCreateProject = async (prevState: FormState, formData: FormData): Promise<FormState> => {
    const name = formData.get("name") as string
    const clientRef = formData.get("client_name") as string

    if (!name) {
      return { error: "Project name is required." }
    }

    // This now calls the zustand action directly
    const newProject = createProjectInStore(name, clientRef)

    if (newProject) {
      return { success: true, projectName: newProject.name }
    } else {
      return { error: `Project "${name}" already exists.` }
    }
  }

  const initialState: FormState = { error: undefined, success: false }
  const [state, formAction, pending] = useActionState(handleCreateProject, initialState)

  useEffect(() => {
    if (state.success && state.projectName) {
      router.push(`/project/${encodeURIComponent(state.projectName)}`)
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
            <Input id="name" name="name" placeholder="e.g. FY25 Governance Review" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="client_name">Client / Reference</Label>
            <Input id="client_name" name="client_name" placeholder="Client Ltd." />
          </div>

          {state.error && (
            <p className="text-sm text-destructive" role="alert">
              {state.error}
            </p>
          )}

          <Button type="submit" className="w-full" disabled={pending}>
            {pending ? "Creating…" : "Create and Open Project"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
