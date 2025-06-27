import { createServerClient } from "@/lib/supabase/server"
import { cookies, headers } from "next/headers"
import { redirect } from "next/navigation"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { BadgeCheck, Database, Info } from "lucide-react"

/**
 * Fetches a single project by (URL-decoded) name.
 * Falls back gracefully if the `project_access` table has not been
 * created yet, so the page never 500s.
 */
export default async function ProjectPage({
  params,
}: {
  params: { projectName: string }
}) {
  // 1) Set up the server-side Supabase client
  const supabase = createServerClient(cookies(), headers())

  // 2) Get the current signed-in user
  const {
    data: { user },
    error: userErr,
  } = await supabase.auth.getUser()
  if (userErr || !user) redirect("/login")

  // 3) Decode the project name from the URL
  const projectName = decodeURIComponent(params.projectName)

  // 4) Fetch the project (no joins ⇒ always safe)
  const { data: project, error: projectErr } = await supabase
    .from("projects")
    .select("*")
    .eq("name", projectName)
    .limit(1)
    .maybeSingle()

  if (projectErr) {
    return (
      <main className="p-10 space-y-4">
        <Alert variant="destructive">
          <Database className="h-4 w-4" />
          <AlertTitle>Database error</AlertTitle>
          <AlertDescription>{projectErr.message}</AlertDescription>
        </Alert>
      </main>
    )
  }

  if (!project) {
    redirect("/") // No such project → back to dashboard
  }

  // 5) Try to discover the user’s role ------------------------------------
  let role: "owner" | "editor" | "viewer" | "unknown" = "unknown"
  let missingProjectAccessTable = false

  if (project.owner_id === user.id) {
    role = "owner"
  } else {
    try {
      const { data: accessRow } = await supabase
        .from("project_access")
        .select("role")
        .eq("project_id", project.id)
        .eq("user_id", user.id)
        .limit(1)
        .maybeSingle()

      if (accessRow?.role) role = accessRow.role as typeof role
    } catch (e: any) {
      // Table does not exist yet → suppress & record for UI banner
      if (typeof e.message === "string" && e.message.includes("project_access")) {
        missingProjectAccessTable = true
      } else {
        throw e // Unexpected error → still fail fast
      }
    }
  }

  // 6) Guard: user has no access
  if (role === "unknown") {
    redirect("/") // Or show a 403 page if you prefer
  }

  // 7) UI ------------------------------------------------------------------
  return (
    <main className="p-10 space-y-6">
      {missingProjectAccessTable && (
        <Alert>
          <Info className="h-4 w-4" />
          <AlertTitle>Project access table missing</AlertTitle>
          <AlertDescription>
            Your database doesn’t have <code>public.project_access</code>. Until you run the migration, everyone falls
            back to owner / viewer logic.
          </AlertDescription>
        </Alert>
      )}

      <section className="space-y-2">
        <h1 className="text-2xl font-semibold">{project.name}</h1>
        <p className="text-muted-foreground">
          You are signed in as: <span className="font-medium">{user.email}</span>{" "}
          {role && (
            <>
              — Role:{" "}
              <span className="inline-flex items-center gap-1">
                {role}
                {role === "owner" && <BadgeCheck className="h-4 w-4 text-green-600" />}
              </span>
            </>
          )}
        </p>
      </section>

      {/* --- Your existing Project components go here --- */}
      {/* <AssessmentList projectId={project.id} /> */}
      {/* <ProjectAccessManager projectId={project.id} role={role} /> */}
    </main>
  )
}
