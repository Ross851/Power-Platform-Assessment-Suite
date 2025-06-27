"use client"

import { ProjectAccessManager } from "@/components/project-access-manager"
import { useAuth } from "@/components/auth/auth-provider"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useEffect, useState } from "react"

interface Project {
  id: string
  created_at: string
  name: string
  description: string
  owner_id: string
}

interface Props {
  params: {
    projectName: string
  }
}

const ProjectPage = ({ params: { projectName } }: Props) => {
  const [project, setProject] = useState<Project | null>(null)
  const supabase = createClientComponentClient()
  const { user } = useAuth()
  const isOwner = project?.owner_id === user?.id
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const getProject = async () => {
      const decodedName = decodeURIComponent(projectName)

      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("name", decodedName)
        .order("created_at", { ascending: false }) // newest first in case duplicates exist
        .limit(1) // safeguard: return at most one row
        .maybeSingle()

      if (error) {
        console.error("Error fetching project:", error.message)
        setError(error.message)
      } else if (!data) {
        console.warn(`No project found with name "${decodedName}".`)
        setError(`No project found with name "${decodedName}".`)
      }

      setProject(data ?? null)
    }

    getProject()
  }, [projectName, supabase])

  if (!project && !isOwner && !error) {
    return (
      <div className="container mx-auto py-10 text-center">
        <h2 className="text-xl font-semibold mb-4">Project not found</h2>
        <a href="/" className="text-primary underline">
          Back to dashboard
        </a>
      </div>
    )
  }

  if (!project) {
    return <div>Loading...</div>
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-4">{project.name}</h1>
      <p className="text-gray-600 mb-6">{project.description}</p>

      <div className="grid gap-6">
        <ProjectAccessManager projectName={projectName} isOwner={isOwner} />
      </div>
    </div>
  )
}

export default ProjectPage
