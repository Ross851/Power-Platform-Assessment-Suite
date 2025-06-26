"use client"

import { useAssessmentStore } from "@/store/assessment-store"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import { RAGIndicator } from "./rag-indicator"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

export function AssessmentStandardsList() {
  const standards = useAssessmentStore((state) => state.getActiveProject()?.standards)

  if (!standards) {
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Assessment Standards</CardTitle>
        <CardDescription>
          Select a standard below to begin or continue your assessment. Progress is saved automatically.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[35%]">Standard</TableHead>
              <TableHead>Questions</TableHead>
              <TableHead>Progress</TableHead>
              <TableHead>Maturity Score</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {standards.map((standard) => (
              <TableRow key={standard.slug}>
                <TableCell>
                  <p className="font-medium">{standard.name}</p>
                  <p className="text-xs text-muted-foreground hidden sm:block">{standard.description}</p>
                </TableCell>
                <TableCell>
                  <span className="text-sm font-medium">{standard.questions.length}</span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Progress value={standard.completion || 0} className="h-2 w-[60px]" />
                    <span className="text-xs text-muted-foreground">{(standard.completion || 0).toFixed(0)}%</span>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-sm font-medium">{(standard.maturityScore || 0).toFixed(1)} / 5.0</span>
                </TableCell>
                <TableCell className="text-center">
                  <RAGIndicator status={standard.ragStatus} size="md" />
                </TableCell>
                <TableCell className="text-right">
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/assessment/${standard.slug}`}>
                      {(standard.completion || 0) > 0 ? "Continue" : "Start"}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
