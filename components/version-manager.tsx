"use client"

import { useState } from "react"
import { useAssessmentStore } from "@/store/assessment-store"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { History, GitCommit, RotateCcw } from "lucide-react"
import { format } from "date-fns"

export function VersionManager() {
  const { getActiveProject, createVersion, restoreVersion } = useAssessmentStore()
  const [versionName, setVersionName] = useState("")
  const activeProject = getActiveProject()

  const handleCreateVersion = () => {
    if (versionName.trim()) {
      createVersion(versionName.trim())
      setVersionName("")
    }
  }

  const handleRestoreVersion = (versionId: string) => {
    if (confirm("Are you sure you want to restore this version? Any unsaved changes will be lost.")) {
      restoreVersion(versionId)
    }
  }

  if (!activeProject) {
    return null
  }

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="flex items-center">
          <History className="mr-2 h-5 w-5" />
          Version Management
        </CardTitle>
        <CardDescription>
          Create snapshots of your assessment to track progress and restore previous states.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-end gap-2 mb-4">
          <div className="flex-grow">
            <Label htmlFor="version-name">New Version Name</Label>
            <Input
              id="version-name"
              value={versionName}
              onChange={(e) => setVersionName(e.target.value)}
              placeholder="e.g., Pre-remediation snapshot"
            />
          </div>
          <Button onClick={handleCreateVersion} disabled={!versionName.trim()}>
            <GitCommit className="mr-2 h-4 w-4" /> Create Version
          </Button>
        </div>
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Saved Versions:</h4>
          {activeProject.versions.length === 0 ? (
            <p className="text-xs text-muted-foreground">No versions saved yet.</p>
          ) : (
            <ul className="space-y-2">
              {activeProject.versions
                .slice()
                .reverse()
                .map((version) => (
                  <li key={version.id} className="flex items-center justify-between p-2 border rounded-md bg-muted/50">
                    <div>
                      <p className="font-medium text-sm">{version.name}</p>
                      <p className="text-xs text-muted-foreground">
                        Saved on: {format(new Date(version.createdAt), "dd MMM yyyy, HH:mm")}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRestoreVersion(version.id)}
                      className="bg-card"
                    >
                      <RotateCcw className="mr-2 h-4 w-4" /> Restore
                    </Button>
                  </li>
                ))}
            </ul>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
