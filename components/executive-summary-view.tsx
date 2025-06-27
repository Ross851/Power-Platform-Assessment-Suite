"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useAssessmentStore } from "@/store/assessment-store"
import { format } from "date-fns"
import { AlertTriangle, TrendingUp, Target, Clock } from "lucide-react"
import { RAGIndicator } from "./rag-indicator"

export function ExecutiveSummaryView() {
  const { getActiveProject, getOverallMaturityScore, getOverallRAGStatus, getRiskProfile } = useAssessmentStore()
  const activeProject = getActiveProject()

  if (!activeProject) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Executive Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <p>No active project selected.</p>
        </CardContent>
      </Card>
    )
  }

  const maturityScore = getOverallMaturityScore()
  const ragStatus = getOverallRAGStatus()
  const riskProfile = getRiskProfile()

  // Get high priority areas
  const highPriorityAreas = activeProject.standards
    .flatMap((std) =>
      std.questions
        .filter((q) => q.ragStatus === "red" || q.ragStatus === "amber")
        .map((q) => ({ ...q, standardName: std.name })),
    )
    .sort((a, b) => (a.ragStatus === "red" && b.ragStatus !== "red" ? -1 : 1))

  const getMaturityLevelText = (score: number) => {
    if (score < 1.5) return "1 - Initial"
    if (score < 2.5) return "2 - Managed"
    if (score < 3.5) return "3 - Defined"
    if (score < 4.5) return "4 - Quantitatively Managed"
    return "5 - Optimising"
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl">Power Platform Assessment: Executive Summary</CardTitle>
              <CardDescription className="text-lg mt-2">{activeProject.name}</CardDescription>
              <p className="text-sm text-muted-foreground mt-1">Date: {format(new Date(), "dd MMMM yyyy")}</p>
              {activeProject.clientReferenceNumber && (
                <p className="text-sm text-muted-foreground">Client Reference: {activeProject.clientReferenceNumber}</p>
              )}
            </div>
            <RAGIndicator status={ragStatus} size="lg" showText />
          </div>
        </CardHeader>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall Maturity</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{maturityScore.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground">{getMaturityLevelText(maturityScore)}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Risk Areas</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">{riskProfile.high}</div>
            <p className="text-xs text-muted-foreground">Require immediate attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Medium Risk Areas</CardTitle>
            <Target className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-500">{riskProfile.medium}</div>
            <p className="text-xs text-muted-foreground">Opportunities for improvement</p>
          </CardContent>
        </Card>
      </div>

      {/* Key Findings & Strategic Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Target className="mr-2 h-5 w-5" />
            Key Findings & Strategic Recommendations
          </CardTitle>
          <CardDescription>
            Priority areas for improvement to enhance security, governance, and value from your Power Platform
            investment.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {highPriorityAreas.slice(0, 5).map((area, index) => (
            <div key={index} className="border-l-4 border-l-primary pl-4 space-y-2">
              <div className="flex items-start justify-between">
                <h4 className="font-semibold">{area.standardName}</h4>
                <RAGIndicator status={area.ragStatus} size="sm" />
              </div>
              <p className="text-sm text-muted-foreground">{area.text}</p>
              <div className="space-y-1 text-sm">
                <p>
                  <strong>Impact:</strong> Mitigates {area.ragStatus === "red" ? "high" : "medium"} risk related to{" "}
                  {area.category}
                </p>
                <p>
                  <strong>Recommended Owner:</strong> {area.riskOwner || "To be assigned"}
                </p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* High-Priority Risk Register */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <AlertTriangle className="mr-2 h-5 w-5 text-red-500" />
            High-Priority Risk Register
          </CardTitle>
          <CardDescription>
            Critical risks identified during the assessment requiring immediate attention.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Area</TableHead>
                <TableHead>Risk / Issue</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Owner</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {highPriorityAreas.slice(0, 10).map((area, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{area.standardName}</TableCell>
                  <TableCell className="max-w-md">
                    <div className="truncate" title={area.text}>
                      {area.text.length > 60 ? `${area.text.substring(0, 60)}...` : area.text}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={area.ragStatus === "red" ? "destructive" : "secondary"}>
                      {area.ragStatus?.toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell>{area.riskOwner || "TBA"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Strategic Roadmap */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Clock className="mr-2 h-5 w-5" />
            Strategic Roadmap Overview
          </CardTitle>
          <CardDescription>Recommended phased approach focusing on foundational improvements first.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Phase</TableHead>
                <TableHead>Timeline</TableHead>
                <TableHead>Focus Areas</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Phase 1: Foundation</TableCell>
                <TableCell>0-3 Months</TableCell>
                <TableCell>Address all 'Red' status risks. Solidify DLP policies and environment strategy.</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Phase 2: Optimisation</TableCell>
                <TableCell>3-6 Months</TableCell>
                <TableCell>
                  Remediate 'Amber' status risks. Implement ALM automation and mature CoE processes.
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Phase 3: Innovation</TableCell>
                <TableCell>6-12 Months</TableCell>
                <TableCell>
                  Focus on technical debt reduction, modernisation of custom apps, and expanding Responsible AI
                  governance.
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Next Steps */}
      <Card>
        <CardHeader>
          <CardTitle>Next Steps</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            We recommend a follow-up workshop to review these findings in detail and finalise the implementation plan
            and resource allocation. The accompanying technical document provides detailed instructions for your
            development team.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
