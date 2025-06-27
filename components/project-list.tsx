import Link from "next/link"
import { useAssessmentStore } from "@/store/assessment-store"
import type { Project } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ArrowRight } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface ProjectListProps {
  /** Optional list – if omitted we read from the global store */
  projects?: Project[]
  /** Optional helper – if omitted we read from the global store */
  getOverallProgress?: (projectName: string) => number
}

export function ProjectList({
  projects: incomingProjects,
  getOverallProgress: incomingGetOverallProgress,
}: ProjectListProps) {
  /* Fallback to store when props are not passed */
  const store = useAssessmentStore()
  const projects = incomingProjects ?? store.projects ?? []
  const getOverallProgress = incomingGetOverallProgress ?? store.getOverallProgress

  if (!projects.length) {
    return (
      <div className="text-center py-12 border-2 border-dashed rounded-lg">
        <h3 className="text-lg font-medium">No Projects Found</h3>
        <p className="text-sm text-muted-foreground mt-1">Create your first project to begin an assessment.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {projects.map((project) => {
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
                  Open Project <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        )
      })}
    </div>
  )
}
