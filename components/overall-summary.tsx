"use client"

import { useState } from "react"
import { useAssessmentStore } from "@/store/assessment-store"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RiskProfileChart } from "@/components/risk-profile-chart"
import { Button } from "@/components/ui/button"
import { Download, Loader2 } from "lucide-react"
import { exportToClientWord, exportToTechnicalWord } from "@/lib/word-export"
import { useToast } from "@/hooks/use-toast"

export function OverallSummary() {
  const { getActiveProject, getOverallMaturityScore, getOverallRagStatus, getRiskProfile } = useAssessmentStore()
  const [isClientExporting, setIsClientExporting] = useState(false)
  const [isTechExporting, setIsTechExporting] = useState(false)
  const { toast } = useToast()

  const activeProject = getActiveProject()
  const maturityScore = getOverallMaturityScore()
  const ragStatus = getOverallRagStatus()
  const riskProfile = getRiskProfile()

  const handleClientExport = async () => {
    if (!activeProject) return
    setIsClientExporting(true)
    try {
      await exportToClientWord(activeProject)
      toast({
        title: "Export Successful",
        description: "The Executive Summary has been downloaded.",
      })
    } catch (error) {
      console.error("Failed to export client document:", error)
      toast({
        title: "Export Failed",
        description: "There was an error generating the document.",
        variant: "destructive",
      })
    } finally {
      setIsClientExporting(false)
    }
  }

  const handleTechExport = async () => {
    if (!activeProject) return
    setIsTechExporting(true)
    try {
      await exportToTechnicalWord(activeProject)
      toast({
        title: "Export Successful",
        description: "The Technical Guide has been downloaded.",
      })
    } catch (error) {
      console.error("Failed to export technical document:", error)
      toast({
        title: "Export Failed",
        description: "There was an error generating the document.",
        variant: "destructive",
      })
    } finally {
      setIsTechExporting(false)
    }
  }

  const getStatusColor = () => {
    switch (ragStatus) {
      case "red":
        return "text-red-500"
      case "amber":
        return "text-amber-500"
      case "green":
        return "text-green-500"
      default:
        return "text-gray-500"
    }
  }

  return (
    <Card className="sticky top-8">
      <CardHeader>
        <CardTitle>Overall Summary</CardTitle>
        <CardDescription>A high-level overview of the assessment results.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center">
          <p className="text-sm text-muted-foreground">Overall Maturity Score</p>
          <p className="text-5xl font-bold">{maturityScore.toFixed(2)}</p>
          <p className={`text-lg font-semibold ${getStatusColor()}`}>{ragStatus.toUpperCase()}</p>
        </div>
        <div>
          <h4 className="text-md font-semibold mb-2 text-center">Risk Profile</h4>
          <div className="h-48">
            <RiskProfileChart data={riskProfile} />
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col space-y-2">
        <Button onClick={handleClientExport} disabled={isClientExporting || isTechExporting} className="w-full">
          {isClientExporting ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Download className="mr-2 h-4 w-4" />
          )}
          Export Executive Summary
        </Button>
        <Button
          onClick={handleTechExport}
          disabled={isClientExporting || isTechExporting}
          variant="outline"
          className="w-full bg-transparent"
        >
          {isTechExporting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
          Export Technical Guide
        </Button>
      </CardFooter>
    </Card>
  )
}
