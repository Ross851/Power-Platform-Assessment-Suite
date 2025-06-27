"use client"

import { useState, useMemo, type ChangeEvent } from "react"
import Link from "next/link"
import { Search, FolderGit2 } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

import { escapeRegExp } from "@/lib/escape-regexp"
import { useAssessmentStore } from "@/store/assessment-store"
import type { Project } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface ProjectListProps {
  /** Optional – external list. Defaults to the global store. */
  projects?: Project[]
  /** Optional – external progress helper. Defaults to the store helper. */
  getOverallProgress?: (projectName: string) => number
  className?: string
}

export function ProjectList({
  projects: injectedProjects,
  getOverallProgress: injectedProgressFn,
  className,
}: ProjectListProps) {
  /* ------------------------------------------------------------------ */
  /* Data source                                                         */
  /* ------------------------------------------------------------------ */
  const store = useAssessmentStore()
  const projects = injectedProjects ?? store.projects ?? []
  const getOverallProgress = injectedProgressFn ?? store.getOverallProgress

  /* ------------------------------------------------------------------ */
  /* Search state & filter                                               */
  /* ------------------------------------------------------------------ */
  const [query, setQuery] = useState("")

  const filteredProjects = useMemo(() => {
    if (!query.trim()) return projects

    const safe = escapeRegExp(query.trim())

    try {
      const rx = new RegExp(safe, "i")
      return projects.filter((p) => rx.test(p.name))
    } catch (err) {
      /* Unlikely after escaping, but keep the UI alive regardless. */
      console.warn("[ProjectList] RegExp construction failed. Falling back to includes().", err)
      const q = query.toLowerCase()
      return projects.filter((p) => p.name.toLowerCase().includes(q))
    }
  }, [projects, query])

  /* ------------------------------------------------------------------ */
  /* Empty state                                                         */
  /* ------------------------------------------------------------------ */
  if (projects.length === 0) {
    return (
      <div className={cn("text-center py-12 border-2 border-dashed rounded-lg", className)}>
        <h3 className="text-lg font-medium">No Projects Found</h3>
        <p className="text-sm text-muted-foreground mt-1">Create your first project to begin an assessment.</p>
      </div>
    )
  }

  /* ------------------------------------------------------------------ */
  /* Render                                                              */
  /* ------------------------------------------------------------------ */
  return (
    <div className={cn("space-y-4", className)}>
      {/* Search bar */}
      <div className="relative">
        <Search className="absolute left-3 top-[10px] h-4 w-4 text-muted-foreground" />
        <Input
          aria-label="Search projects"
          placeholder="Search projects…"
          value={query}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Project grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredProjects.map((project) => {
          const progress = getOverallProgress(project.name)
          return (
            <Card key={project.name}>
              <CardHeader>
                <CardTitle>{project.name}</CardTitle>
                <CardDescription>Ref:&nbsp;{project.clientReferenceNumber}</CardDescription>
              </CardHeader>

              <CardContent>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-muted-foreground">Overall Progress</span>
                  <span className="text-sm font-medium text-primary">{progress.toFixed(0)}%</span>
                </div>
                <Progress value={progress} className="h-2" />
                <p className="text-xs text-muted-foreground mt-2">
                  Last modified {formatDistanceToNow(new Date(project.lastModifiedAt), { addSuffix: true })}
                </p>
              </CardContent>

              <CardFooter>
                <Button asChild className="w-full">
                  <Link href={`/project/${encodeURIComponent(project.name)}`}>
                    Open Project
                    <FolderGit2 className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          )
        })}

        {filteredProjects.length === 0 && (
          <p className="col-span-full text-center text-sm text-muted-foreground">
            No projects match <span className="font-medium">&ldquo;{query}&rdquo;</span>
          </p>
        )}
      </div>
    </div>
  )
}
