"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Calendar, User, ExternalLink } from "lucide-react"
import Link from "next/link"
import type { Project } from "@/lib/types"
import { useAssessmentStore } from "@/store/assessment-store"

interface ProjectListProps {
  projects?: Project[]
  getOverallProgress?: (project: Project) => number
}

export function ProjectList({ projects: propProjects, getOverallProgress }: ProjectListProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const { projects: storeProjects } = useAssessmentStore()

  // Use props if provided, otherwise fall back to store
  const projects = propProjects || storeProjects || []

  // Simple string-based filtering - no regex to avoid parse errors
  const filteredProjects = projects.filter((project) => {
    if (!searchQuery.trim()) return true

    const query = searchQuery.toLowerCase().trim()
    const projectName = (project.name || "").toLowerCase()
    const clientName = (project.client_name || "").toLowerCase()

    return projectName.includes(query) || clientName.includes(query)
  })

  const calculateProgress = (project: Project) => {
    if (getOverallProgress) {
      return getOverallProgress(project)
    }

    // Default progress calculation
    if (!project.standards || project.standards.length === 0) return 0

    const totalQuestions = project.standards.reduce((sum, standard) => sum + standard.questions.length, 0)
    if (totalQuestions === 0) return 0

    const answeredQuestions = project.standards.reduce(
      (sum, standard) =>
        sum + standard.questions.filter((q) => q.answer !== undefined && q.answer !== null && q.answer !== "").length,
      0,
    )

    return Math.round((answeredQuestions / totalQuestions) * 100)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {filteredProjects.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="text-center space-y-2">
              <h3 className="text-lg font-semibold">No projects found</h3>
              <p className="text-muted-foreground">
                {searchQuery ? "Try adjusting your search terms" : "Create your first project to get started"}
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map((project) => {
            const progress = calculateProgress(project)

            return (
              <Card key={project.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1 flex-1">
                      <CardTitle className="text-lg line-clamp-2">{project.name}</CardTitle>
                      {project.client_name && (
                        <CardDescription className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {project.client_name}
                        </CardDescription>
                      )}
                    </div>
                    <Badge variant={progress === 100 ? "default" : progress > 50 ? "secondary" : "outline"}>
                      {progress}%
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(project.created_at).toLocaleDateString()}
                    </div>
                    <div>{project.standards?.length || 0} standards</div>
                  </div>

                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button asChild size="sm" className="flex-1">
                      <Link href={`/project/${encodeURIComponent(project.name)}`}>
                        <ExternalLink className="h-3 w-3 mr-1" />
                        Open Project
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
