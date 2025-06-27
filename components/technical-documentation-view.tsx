"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { useAssessmentStore } from "@/store/assessment-store"
import { format } from "date-fns"
import { Code, FileText, AlertCircle, CheckCircle, Target, ExternalLink } from "lucide-react"
import { RAGIndicator } from "./rag-indicator"
import { Button } from "./ui/button"

export function TechnicalDocumentationView() {
  const { getActiveProject } = useAssessmentStore()
  const activeProject = getActiveProject()

  if (!activeProject) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Technical Implementation Guide</CardTitle>
        </CardHeader>
        <CardContent>
          <p>No active project selected.</p>
        </CardContent>
      </Card>
    )
  }

  // Get all gaps (red and amber status items)
  const allGaps = activeProject.standards
    .flatMap((std) =>
      std.questions
        .filter((q) => q.ragStatus === "red" || q.ragStatus === "amber")
        .map((q) => ({ ...q, standardName: std.name })),
    )
    .sort((a, b) => {
      if (a.ragStatus === "red" && b.ragStatus !== "red") return -1
      if (a.ragStatus !== "red" && b.ragStatus === "red") return 1
      if (a.ragStatus === "amber" && b.ragStatus !== "amber") return -1
      if (a.ragStatus !== "amber" && b.ragStatus === "amber") return 1
      return 0
    })

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl flex items-center">
            <Code className="mr-2 h-6 w-6" />
            Power Platform Assessment: Technical Implementation Guide
          </CardTitle>
          <CardDescription className="text-lg mt-2">{activeProject.name}</CardDescription>
          <p className="text-sm text-muted-foreground mt-1">Generated on: {format(new Date(), "dd MMMM yyyy")}</p>
          {activeProject.clientReferenceNumber && (
            <p className="text-sm text-muted-foreground">Client Reference: {activeProject.clientReferenceNumber}</p>
          )}
        </CardHeader>
      </Card>

      {/* Introduction */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="mr-2 h-5 w-5" />
            Introduction
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            This document provides detailed, actionable instructions for the development and administration teams to
            remediate the findings from the Power Platform assessment. Each section corresponds to an identified gap
            that requires attention.
          </p>
        </CardContent>
      </Card>

      {/* Scoring Explanation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Target className="mr-2 h-5 w-5" />
            Scoring & Gap Analysis Explained
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Our scoring model rates each assessment point on a scale of 1 to 5. This score determines the RAG (Red,
            Amber, Green) status and helps prioritise actions.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-start space-x-2">
              <Badge variant="destructive" className="mt-1">
                RED
              </Badge>
              <div>
                <p className="font-medium text-sm">Score 1-2</p>
                <p className="text-xs text-muted-foreground">
                  Significant gap and high risk. Urgent attention required.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-2">
              <Badge variant="secondary" className="mt-1 bg-amber-100 text-amber-800">
                AMBER
              </Badge>
              <div>
                <p className="font-medium text-sm">Score 3</p>
                <p className="text-xs text-muted-foreground">
                  Basic compliance met, but clear opportunities for improvement.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-2">
              <Badge variant="secondary" className="mt-1 bg-green-100 text-green-800">
                GREEN
              </Badge>
              <div>
                <p className="font-medium text-sm">Score 4-5</p>
                <p className="text-xs text-muted-foreground">
                  Strong alignment with best practices and low-risk profile.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 space-y-2">
            <p className="font-medium text-sm">Gap Analysis Benchmarks:</p>
            <ul className="text-sm text-muted-foreground space-y-1 ml-4">
              <li>
                • <strong>Gap to Basic Compliance:</strong> Difference between current score and target score of 3
              </li>
              <li>
                • <strong>Gap to Gold Standard:</strong> Difference between current score and maximum score of 5
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Gap Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <AlertCircle className="mr-2 h-5 w-5" />
            Detailed Gap Analysis & Remediation Steps
          </CardTitle>
          <CardDescription>{allGaps.length} gaps identified requiring attention</CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {allGaps.map((gap, index) => {
              const currentScore = gap.score || 0
              const gapToBasic = Math.max(0, 3 - currentScore)
              const gapToGold = Math.max(0, 5 - currentScore)

              return (
                <AccordionItem key={index} value={`gap-${index}`}>
                  <AccordionTrigger className="text-left">
                    <div className="flex items-center space-x-3">
                      <RAGIndicator status={gap.ragStatus} size="sm" />
                      <div>
                        <p className="font-medium">
                          {gap.id} - {gap.text}
                        </p>
                        <p className="text-sm text-muted-foreground">{gap.standardName}</p>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="space-y-6">
                    {/* Gap Overview */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm">Gap Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Standard:</span>
                            <span>{gap.standardName}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Category:</span>
                            <span>{gap.category}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Status:</span>
                            <Badge variant={gap.ragStatus === "red" ? "destructive" : "secondary"}>
                              {gap.ragStatus?.toUpperCase()}
                            </Badge>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Current Answer:</span>
                            <span className="text-right max-w-32 truncate" title={JSON.stringify(gap.answer)}>
                              {JSON.stringify(gap.answer) || "N/A"}
                            </span>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm">Gap Analysis</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <Table>
                            <TableBody>
                              <TableRow>
                                <TableCell className="font-medium text-sm">Current Score</TableCell>
                                <TableCell className="text-sm">{currentScore}</TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell className="font-medium text-sm">Basic Compliance Target</TableCell>
                                <TableCell className="text-sm">3</TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell className="font-medium text-sm">Gold Standard Target</TableCell>
                                <TableCell className="text-sm">5</TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell className="font-medium text-sm">Gap to Basic Compliance</TableCell>
                                <TableCell className="text-sm font-bold text-red-600">{gapToBasic}</TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell className="font-medium text-sm">Gap to Gold Standard</TableCell>
                                <TableCell className="text-sm font-bold text-amber-600">{gapToGold}</TableCell>
                              </TableRow>
                            </TableBody>
                          </Table>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Evidence */}
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm flex items-center">
                          <FileText className="mr-2 h-4 w-4" />
                          Associated Evidence
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        {gap.evidence.length > 0 ? (
                          <div className="space-y-2">
                            {gap.evidence.map((evidence, evidenceIndex) => (
                              <div key={evidenceIndex} className="border-l-2 border-l-blue-200 pl-3 py-1">
                                <div className="flex items-center space-x-2">
                                  <Badge variant="outline" className="text-xs">
                                    {evidence.type.charAt(0).toUpperCase() + evidence.type.slice(1)}
                                  </Badge>
                                  <span className="text-sm">{evidence.content}</span>
                                </div>
                                <p className="text-xs text-muted-foreground">
                                  Added: {format(new Date(evidence.uploadedAt), "dd MMM yyyy, HH:mm")}
                                </p>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-muted-foreground">No specific evidence provided.</p>
                        )}
                        {gap.evidenceNotes && (
                          <div className="mt-3 p-3 bg-muted rounded-md">
                            <p className="text-sm">
                              <strong>Evidence Notes:</strong> {gap.evidenceNotes}
                            </p>
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    {/* Best Practice & Implementation */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm flex items-center">
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Best Practice
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground">
                            {gap.bestPractice?.description || "No specific best practice guidance available."}
                          </p>
                          {gap.bestPractice?.link && (
                            <Button variant="link" size="sm" className="p-0 h-auto mt-2" asChild>
                              <a href={gap.bestPractice.link} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="mr-1 h-3 w-3" />
                                Reference Documentation
                              </a>
                            </Button>
                          )}
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm flex items-center">
                            <Target className="mr-2 h-4 w-4" />
                            Implementation Steps
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          {gap.bestPractice?.suggestedActions && gap.bestPractice.suggestedActions.length > 0 ? (
                            <ul className="space-y-1">
                              {gap.bestPractice.suggestedActions.map((action, actionIndex) => (
                                <li key={actionIndex} className="text-sm flex items-start">
                                  <span className="mr-2 mt-1 h-1 w-1 bg-primary rounded-full flex-shrink-0"></span>
                                  {action}
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-sm text-muted-foreground">
                              No specific implementation steps provided. Review best practice guidance for direction.
                            </p>
                          )}
                        </CardContent>
                      </Card>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              )
            })}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  )
}
