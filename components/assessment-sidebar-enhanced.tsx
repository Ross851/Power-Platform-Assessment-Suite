"use client"

import Link from "next/link"
import { useParams, usePathname } from "next/navigation"
import { AssessmentStandard } from "@/lib/types"
import { assessmentStandards } from "@/lib/constants"
import { useAssessmentStore } from "@/store/assessment-store"
import { Progress } from "@/components/ui/progress"
import { RAGIndicator } from "@/components/rag-indicator"
import { cn } from "@/lib/utils"
import { 
  CheckCircle, 
  Circle, 
  AlertCircle,
  ChevronRight,
  Filter,
  SortAsc
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"

type SortOption = "default" | "progress" | "rag" | "weight"
type FilterOption = "all" | "complete" | "incomplete" | "high-risk"

export function AssessmentSidebarEnhanced() {
  const params = useParams()
  const pathname = usePathname()
  const activeProject = useAssessmentStore((state) => state.getActiveProject())
  const [sortBy, setSortBy] = useState<SortOption>("default")
  const [filterBy, setFilterBy] = useState<FilterOption>("all")

  if (!activeProject) return null

  const currentStandardSlug = params?.standardSlug as string

  // Get standards with their data
  const standardsWithData = assessmentStandards.map((standard) => {
    const projectStandard = activeProject.standards.find((s) => s.name === standard.name)
    return {
      ...standard,
      completionPercentage: projectStandard?.completionPercentage || 0,
      ragStatus: projectStandard?.ragStatus || "grey",
      maturityScore: projectStandard?.maturityScore || 0,
    }
  })

  // Apply filtering
  const filteredStandards = standardsWithData.filter((standard) => {
    switch (filterBy) {
      case "complete":
        return standard.completionPercentage === 100
      case "incomplete":
        return standard.completionPercentage < 100
      case "high-risk":
        return standard.ragStatus === "red"
      default:
        return true
    }
  })

  // Apply sorting
  const sortedStandards = [...filteredStandards].sort((a, b) => {
    switch (sortBy) {
      case "progress":
        return b.completionPercentage - a.completionPercentage
      case "rag":
        const ragOrder = { red: 0, amber: 1, green: 2, grey: 3, "not-applicable": 4 }
        return (ragOrder[a.ragStatus] || 3) - (ragOrder[b.ragStatus] || 3)
      case "weight":
        return b.weight - a.weight
      default:
        return 0
    }
  })

  const getStandardIcon = (standard: typeof sortedStandards[0]) => {
    if (standard.completionPercentage === 100) {
      return <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
    } else if (standard.completionPercentage > 0) {
      return <AlertCircle className="h-4 w-4 text-amber-500 flex-shrink-0" />
    }
    return <Circle className="h-4 w-4 text-muted-foreground flex-shrink-0" />
  }

  return (
    <nav className="space-y-4" aria-label="Assessment standards navigation">
      {/* Controls */}
      <div className="flex gap-2 mb-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="flex-1">
              <SortAsc className="h-4 w-4 mr-2" />
              Sort
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Sort by</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setSortBy("default")}>
              Default Order
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSortBy("progress")}>
              Progress
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSortBy("rag")}>
              Risk Level
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSortBy("weight")}>
              Weight
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="flex-1">
              <Filter className="h-4 w-4 mr-2" />
              Filter
              {filterBy !== "all" && (
                <Badge variant="secondary" className="ml-2 h-5 px-1">
                  {filteredStandards.length}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Filter by</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setFilterBy("all")}>
              All Standards
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilterBy("complete")}>
              Complete Only
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilterBy("incomplete")}>
              Incomplete Only
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilterBy("high-risk")}>
              High Risk Only
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Standards List */}
      <ul className="space-y-2" role="list">
        {sortedStandards.map((standard) => {
          const isActive = standard.slug === currentStandardSlug
          const projectStandard = activeProject.standards.find((s) => s.name === standard.name)

          return (
            <li key={standard.slug} role="listitem">
              <Link
                href={`/assessment/${standard.slug}`}
                className={cn(
                  "block p-3 rounded-lg border transition-all duration-200",
                  "hover:bg-muted hover:border-primary/20",
                  "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                  isActive && "bg-primary/10 border-primary",
                  standard.ragStatus === "red" && "border-red-200 dark:border-red-900"
                )}
                aria-current={isActive ? "page" : undefined}
                aria-label={`${standard.name} - ${standard.completionPercentage}% complete, ${standard.ragStatus} risk status`}
              >
                <div className="space-y-2">
                  {/* Header */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2 flex-1 min-w-0">
                      {getStandardIcon(standard)}
                      <h3 className="text-sm font-medium leading-tight line-clamp-2">
                        {standard.name}
                      </h3>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <RAGIndicator status={standard.ragStatus} size="sm" />
                      {isActive && (
                        <ChevronRight className="h-4 w-4 text-primary" aria-hidden="true" />
                      )}
                    </div>
                  </div>

                  {/* Progress */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{standard.completionPercentage}% complete</span>
                      <span className="font-medium">Weight: {standard.weight}</span>
                    </div>
                    <Progress 
                      value={standard.completionPercentage} 
                      className="h-1.5"
                      aria-label={`Progress: ${standard.completionPercentage}%`}
                    />
                  </div>

                  {/* Additional Info */}
                  {projectStandard && projectStandard.maturityScore > 0 && (
                    <div className="text-xs text-muted-foreground">
                      Maturity: {projectStandard.maturityScore.toFixed(1)}/5.0
                    </div>
                  )}
                </div>
              </Link>
            </li>
          )
        })}
      </ul>

      {/* Summary Stats */}
      {filteredStandards.length < standardsWithData.length && (
        <div className="text-sm text-muted-foreground text-center pt-4 border-t">
          Showing {filteredStandards.length} of {standardsWithData.length} standards
        </div>
      )}
    </nav>
  )
}