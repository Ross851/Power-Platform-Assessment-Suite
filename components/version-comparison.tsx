"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  TrendingUp, 
  TrendingDown, 
  Minus,
  GitCompare,
  Download,
  ChevronUp,
  ChevronDown,
  AlertCircle
} from "lucide-react"
import { VersionControl, type AssessmentVersion, type VersionComparison } from "@/lib/version-control"
import { format } from "date-fns"

interface VersionComparisonProps {
  projectName: string
  onVersionCreate?: () => void
}

export function VersionComparison({ projectName, onVersionCreate }: VersionComparisonProps) {
  const [versions, setVersions] = useState<AssessmentVersion[]>([])
  const [selectedVersion1, setSelectedVersion1] = useState<string>("")
  const [selectedVersion2, setSelectedVersion2] = useState<string>("")
  const [comparison, setComparison] = useState<VersionComparison | null>(null)

  useEffect(() => {
    loadVersions()
  }, [projectName])

  const loadVersions = () => {
    const projectVersions = VersionControl.getAllVersions(projectName)
    setVersions(projectVersions)

    if (projectVersions.length >= 2) {
      setSelectedVersion1(projectVersions[1].id)
      setSelectedVersion2(projectVersions[0].id)
      compareVersions(projectVersions[1].id, projectVersions[0].id)
    }
  }

  const compareVersions = (v1: string, v2: string) => {
    const result = VersionControl.compareVersions(v1, v2)
    setComparison(result)
  }

  const handleVersionSelect = (version: string, slot: 1 | 2) => {
    if (slot === 1) {
      setSelectedVersion1(version)
      if (selectedVersion2) {
        compareVersions(version, selectedVersion2)
      }
    } else {
      setSelectedVersion2(version)
      if (selectedVersion1) {
        compareVersions(selectedVersion1, version)
      }
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "improving":
        return <TrendingUp className="h-4 w-4 text-green-600" />
      case "declining":
        return <TrendingDown className="h-4 w-4 text-red-600" />
      default:
        return <Minus className="h-4 w-4 text-gray-600" />
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <GitCompare className="h-5 w-5" />
              Version Comparison
            </CardTitle>
            <CardDescription>
              Compare assessment versions to track progress
            </CardDescription>
          </div>
          <Button size="sm" onClick={onVersionCreate}>
            Create Version
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {versions.length < 2 ? (
          <div className="text-center py-8 text-muted-foreground">
            <AlertCircle className="h-8 w-8 mx-auto mb-2" />
            <p>At least 2 versions are needed for comparison.</p>
          </div>
        ) : (
          <>
            <div className="grid gap-4 md:grid-cols-2 mb-4">
              <Select value={selectedVersion1} onValueChange={(v) => handleVersionSelect(v, 1)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select older version" />
                </SelectTrigger>
                <SelectContent>
                  {versions.slice(1).map((version) => (
                    <SelectItem key={version.id} value={version.id}>
                      v{version.version} - {format(new Date(version.timestamp), "MMM dd, yyyy")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedVersion2} onValueChange={(v) => handleVersionSelect(v, 2)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select newer version" />
                </SelectTrigger>
                <SelectContent>
                  {versions.map((version) => (
                    <SelectItem key={version.id} value={version.id}>
                      v{version.version} - {format(new Date(version.timestamp), "MMM dd, yyyy")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {comparison && (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    {getTrendIcon(comparison.overallTrend)}
                    <span className="font-semibold capitalize">{comparison.overallTrend}</span>
                  </div>
                  <Badge variant="outline">
                    Maturity: {comparison.maturityDelta > 0 ? "+" : ""}{comparison.maturityDelta.toFixed(2)}
                  </Badge>
                </div>

                <div className="grid gap-2">
                  {comparison.improvements.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2 border rounded bg-green-50 dark:bg-green-950">
                      <span className="text-sm">{item.area}</span>
                      <div className="flex items-center gap-2 text-green-600">
                        <ChevronUp className="h-3 w-3" />
                        <span className="text-sm">+{item.change.toFixed(1)}</span>
                      </div>
                    </div>
                  ))}

                  {comparison.regressions.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2 border rounded bg-red-50 dark:bg-red-950">
                      <span className="text-sm">{item.area}</span>
                      <div className="flex items-center gap-2 text-red-600">
                        <ChevronDown className="h-3 w-3" />
                        <span className="text-sm">{item.change.toFixed(1)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
} 