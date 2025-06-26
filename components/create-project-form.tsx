"use client"

import { useActionState } from "react"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { createProject } from "@/app/actions"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface FormState {
  error?: string
  success?: boolean
}

export function CreateProjectForm() {
  const router = useRouter()
  const initialState: FormState = { error: undefined, success: false }
  const [state, formAction, pending] = useActionState(createProject, initialState)

  // Refresh the page when a project is successfully created
  useEffect(() => {
    if (state?.success) router.refresh()
  }, [state, router])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Project</CardTitle>
        <CardDescription>
          Start a brand-new assessment by entering a project name (and optional client name).
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="name" className="block text-sm font-medium">
              Project name<span className="text-destructive">*</span>
            </label>
            <Input id="name" name="name" placeholder="e.g. FY25 Governance Review" required />
          </div>

          <div className="space-y-2">
            <label htmlFor="client_name" className="block text-sm font-medium">
              Client / Reference
            </label>
            <Input id="client_name" name="client_name" placeholder="Client Ltd." />
          </div>

          {state?.error && (
            <p className="text-sm text-destructive" role="alert">
              {state.error}
            </p>
          )}

          <Button type="submit" disabled={pending} className="w-full">
            {pending ? "Creating…" : "Create Project"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
