"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useAssessmentStore } from "@/store/assessment-store"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { RAGIndicator } from "./rag-indicator"
import { ChevronRight, FileText, Shield, Cog, DollarSign, Building, Zap } from "lucide-react"

const getStandardIcon = (slug: string) => {
  switch (slug) {
    case "documentation-rulebooks":
      return <FileText className="h-5 w-5" />
    case "dlp-policy":
      return <Shield className="h-5 w-5" />
    case "environment-usage":
      return <Cog className="h-5 w-5" />
    case "security-access":
      return <Shield className="h-5 w-5" />
    case "licensing-cost-management":
      return <DollarSign className="h-5 w-5" />
    case "management-coe":
      return <Building className="h-5 w-5" />
    case "policy-governance-improvements":
      return <FileText className="h-5 w-5" />
    case "automation-alm":
      return <Zap className="h-5 w-5" />
    case "advanced-alm-devops":
      return <Zap className="h-5 w-5" />
    case "secrets-connections-security":
      return <Shield className="h-5 w-5" />
    case "business-continuity-ownership":
      return <Building className="h-5 w-5" />
    case "power-pages-governance":
      return <FileText className="h-5 w-5" />
    default:
      return <FileText className="h-5 w-5" />
  }
}

export function AssessmentStandardsList() {
  const {
    getActiveProject,
    getStandardProgress,
    getStandardMaturityScore,
    getStandardRAGStatus,
    calculateScoresAndRAG,
  } = useAssessmentStore()
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    calculateScoresAndRAG()
  }, [calculateScoresAndRAG])

  const activeProject = getActiveProject()

  if (!isClient || !activeProject) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-muted rounded w-3/4"></div>
              <div className="h-3 bg-muted rounded w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="h-2 bg-muted rounded w-full"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {activeProject.standards.map((standard) => {
        const progress = getStandardProgress(standard.slug)
        const maturityScore = getStandardMaturityScore(standard.slug)
        const ragStatus = getStandardRAGStatus(standard.slug)
        const questionCount = standard.questions.length
        const answeredCount = standard.questions.filter(
          (q) => q.answer !== undefined && q.answer !== null && q.answer !== "",
        ).length

        return (
          <Link key={standard.slug} href={`/assessment/${standard.slug}`}>
            <Card className="h-full transition-all duration-200 hover:shadow-md hover:scale-[1.02] cursor-pointer">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    {getStandardIcon(standard.slug)}
                    <div className="flex-1">
                      <CardTitle className="text-lg leading-tight">{standard.name}</CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {answeredCount}/{questionCount} questions
                        </Badge>
                        <RAGIndicator status={ragStatus} size="sm" />
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                </div>
                <CardDescription className="text-sm line-clamp-2">{standard.description}</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium">{Math.round(progress)}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>

                  {answeredCount > 0 && (
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">Maturity Score</span>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{maturityScore.toFixed(1)}/5</span>
                        <div
                          className={`w-2 h-2 rounded-full ${
                            ragStatus === "green"
                              ? "bg-green-500"
                              : ragStatus === "amber"
                                ? "bg-amber-500"
                                : ragStatus === "red"
                                  ? "bg-red-500"
                                  : "bg-gray-400"
                          }`}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </Link>
        )
      })}
    </div>
  )
}
