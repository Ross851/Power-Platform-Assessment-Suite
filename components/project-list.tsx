"use client"

import { useState } from "react"
import Link from "next/link"
import { Search, FolderGit2 } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { useAssessmentStore } from "@/store/assessment-store"
import type { Project } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface ProjectListProps {
  projects?: Project[]
  getOverallProgress?: (projectName: string) => number
  className?: string
}

export function ProjectList({
  projects: incomingProjects,
  getOverallProgress: incomingGetOverallProgress,
  className,
}: ProjectListProps) {
  const store = useAssessmentStore()
  const projects = incomingProjects ?? store.projects ?? []
  const getOverallProgress = incomingGetOverallProgress ?? store.getOverallProgress ?? (() => 0)

  const [query, setQuery] = useState("")

  // COMPLETELY AVOID REGEX - use simple string matching only
  const filteredProjects = projects.filter((project) => {
    if (!query.trim()) return true

    const searchTerm = query.toLowerCase().trim()
    const projectName = (project.name || "").toLowerCase()
    const clientRef = (project.clientReferenceNumber || "").toLowerCase()

    return projectName.includes(searchTerm) || clientRef.includes(searchTerm)
  })

  if (projects.length === 0) {
    return (
      <div className={cn("text-center py-12 border-2 border-dashed rounded-lg", className)}>
        <h3 className="text-lg font-medium">No Projects Found</h3>
        <p className="text-sm text-muted-foreground mt-1">Create your first project to begin an assessment.</p>
      </div>
    )
  }

  return (
    <div className={cn("space-y-4", className)}>
      <div className="relative">
        <Search className="absolute left-3 top-[10px] h-4 w-4 text-muted-foreground" />
        <Input
          aria-label="Search projects"
          placeholder="Search projects…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredProjects.map((project) => {
          const progress = getOverallProgress(project.name)
          return (
            <Card key={project.name}>
              <CardHeader>
                <CardTitle>{project.name}</CardTitle>
                <CardDescription>Ref: {project.clientReferenceNumber}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-muted-foreground">Overall Progress</span>
                  <span className="text-sm font-medium text-primary">{progress.toFixed(0)}%</span>
                </div>
                <Progress value={progress} className="h-2" />
                <p className="text-xs text-muted-foreground mt-2">
                  Last modified: {formatDistanceToNow(new Date(project.lastModifiedAt), { addSuffix: true })}
                </p>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full">
                  <Link href={`/project/${encodeURIComponent(project.name)}`}>
                    Open Project <FolderGit2 className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          )
        })}
        {filteredProjects.length === 0 && (
          <p className="col-span-full text-center text-sm text-muted-foreground">No projects match "{query}"</p>
        )}
      </div>
    </div>
  )
}
