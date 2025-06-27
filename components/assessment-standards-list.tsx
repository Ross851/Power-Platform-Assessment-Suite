"use client"

import Link from "next/link"
import { useAssessmentStore } from "@/store/assessment-store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { RAGIndicator } from "./rag-indicator"

export function AssessmentStandardsList() {
  const activeProject = useAssessmentStore((state) => state.getActiveProject())

  if (!activeProject) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Assessment Standards</CardTitle>
        </CardHeader>
        <CardContent>
          <p>No active project selected.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Assessment Standards</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {activeProject.standards.map((standard) => (
            <li key={standard.slug}>
              <Link
                href={`/assessment/${standard.slug}`}
                className="block p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold text-lg">{standard.name}</h3>
                  <div className="flex items-center gap-x-3">
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">Maturity</p>
                      <p className="font-semibold text-sm">{(standard.maturityScore || 0).toFixed(2)}</p>
                    </div>
                    <RAGIndicator status={standard.ragStatus || "grey"} size="lg" />
                  </div>
                </div>
                <div className="flex items-center gap-x-4">
                  <Progress value={standard.completion || 0} className="w-full h-2" />
                  <span className="text-sm font-medium text-muted-foreground w-12 text-right">
                    {(standard.completion || 0).toFixed(0)}%
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
