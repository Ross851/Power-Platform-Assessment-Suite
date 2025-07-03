"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useAssessmentStore } from "@/store/assessment-store"
import { useEffect, useState } from "react"
import { RAGIndicator } from "./rag-indicator" // Import RAGIndicator
import { AlertTriangle } from "lucide-react"
import Link from "next/link"
import { Button } from "./ui/button"

export function OverallSummary() {
  const { getOverallProgress, getOverallMaturityScore, getRiskProfile, getOverallRAGStatus, getHighPriorityAreas } =
    useAssessmentStore()
  const [isClient, setIsClient] = useState(false)
  const activeProject = useAssessmentStore((state) => state.getActiveProject())

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient || !activeProject) {
    // Add !activeProject check
    return (
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Overall Progress & Maturity</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Loading summary or no active project selected...</p>
        </CardContent>
      </Card>
    )
  }

  const overallProgress = getOverallProgress()
  const maturityScore = getOverallMaturityScore()
  const riskProfile = getRiskProfile()
  const overallRAG = getOverallRAGStatus()
  const highPriorityAreas = getHighPriorityAreas()

  const getMaturityLevelText = (score: number) => {
    if (score < 1.5) return "1 - Initial"
    if (score < 2.5) return "2 - Managed"
    if (score < 3.5) return "3 - Defined"
    if (score < 4.5) return "4 - Quantitatively Managed"
    return "5 - Optimizing"
  }

  const ragColorClasses: Record<string, string> = {
    red: "text-red-600 dark:text-red-400",
    amber: "text-yellow-600 dark:text-yellow-400",
    green: "text-green-600 dark:text-green-400",
    grey: "text-gray-600 dark:text-gray-400",
    "not-applicable": "text-blue-600 dark:text-blue-400",
  }

  return (
    <>
      <Card className="mb-8">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Overall Progress & Maturity</CardTitle>
            <RAGIndicator status={overallRAG} size="lg" showLabel />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium">Overall Assessment Progress</span>
              <span className="text-sm font-medium">{overallProgress.toFixed(0)}%</span>
            </div>
            <Progress value={overallProgress} className="w-full h-3" />
          </div>
          <div>
            <span className="text-sm font-medium">Estimated Maturity Level: </span>
            <span className={`font-semibold ${ragColorClasses[overallRAG] || "text-primary"}`}>
              {getMaturityLevelText(maturityScore)} (Score: {maturityScore.toFixed(1)})
            </span>
          </div>
          <div>
            <span className="text-sm font-medium">Risk Profile: </span>
            <span className="text-red-500">High: {riskProfile.high}</span>,{" "}
            <span className="text-yellow-500">Medium: {riskProfile.medium}</span>,{" "}
            <span className="text-green-500">Low: {riskProfile.low}</span>
          </div>
        </CardContent>
      </Card>

      {highPriorityAreas.length > 0 && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="mr-2 h-5 w-5 text-yellow-500" />
              Key Areas for Improvement
            </CardTitle>
            <CardDescription>
              Focus on these areas to enhance your Power Platform maturity and mitigate risks.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {highPriorityAreas.slice(0, 5).map(
                (
                  area,
                  index, // Show top 5 for brevity
                ) => (
                  <li key={index} className="flex items-start space-x-3 p-3 border rounded-md bg-muted/50">
                    <RAGIndicator status={area.ragStatus} size="md" />
                    <div>
                      <p className="font-semibold text-sm">{area.standardName}</p>
                      {area.questionText && (
                        <p
                          className="text-xs text-muted-foreground truncate hover:whitespace-normal"
                          title={area.questionText}
                        >
                          {area.questionText.length > 100
                            ? area.questionText.substring(0, 97) + "..."
                            : area.questionText}
                        </p>
                      )}
                      <Link
                        href={`/assessment/${area.standardSlug}${area.questionId ? `#q-${area.questionId}` : ""}`}
                        passHref
                      >
                        <Button variant="link" size="sm" className="p-0 h-auto text-xs">
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </li>
                ),
              )}
              {highPriorityAreas.length > 5 && (
                <li className="text-center text-sm text-muted-foreground">
                  ...and {highPriorityAreas.length - 5} more areas.
                </li>
              )}
            </ul>
          </CardContent>
        </Card>
      )}
    </>
  )
}
