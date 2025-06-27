"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Download, Shield, FileText, Database } from "lucide-react"

interface ExportControlsProps {
  projectName: string
  onExport: (options: ExportOptions) => Promise<void>
}

interface ExportOptions {
  includeEvidence: boolean
  includeSensitiveData: boolean
  anonymizeData: boolean
  clientSafeMode: boolean
}

export function DataExportControls({ projectName, onExport }: ExportControlsProps) {
  const [exportOptions, setExportOptions] = useState<ExportOptions>({
    includeEvidence: true,
    includeSensitiveData: false,
    anonymizeData: true,
    clientSafeMode: true,
  })
  const [isExporting, setIsExporting] = useState(false)

  const handleExport = async () => {
    setIsExporting(true)
    try {
      await onExport(exportOptions)
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Download className="h-5 w-5" />
          Export Controls
        </CardTitle>
        <CardDescription>Configure what data to include in client-facing exports.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="includeEvidence"
              checked={exportOptions.includeEvidence}
              onCheckedChange={(checked) =>
                setExportOptions((prev) => ({ ...prev, includeEvidence: checked as boolean }))
              }
            />
            <Label htmlFor="includeEvidence" className="text-sm">
              Include evidence files and screenshots
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="includeSensitive"
              checked={exportOptions.includeSensitiveData}
              onCheckedChange={(checked) =>
                setExportOptions((prev) => ({ ...prev, includeSensitiveData: checked as boolean }))
              }
            />
            <Label htmlFor="includeSensitive" className="text-sm">
              Include sensitive technical details
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="anonymizeData"
              checked={exportOptions.anonymizeData}
              onCheckedChange={(checked) =>
                setExportOptions((prev) => ({ ...prev, anonymizeData: checked as boolean }))
              }
            />
            <Label htmlFor="anonymizeData" className="text-sm">
              Anonymize server names and URLs
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="clientSafe"
              checked={exportOptions.clientSafeMode}
              onCheckedChange={(checked) =>
                setExportOptions((prev) => ({ ...prev, clientSafeMode: checked as boolean }))
              }
            />
            <Label htmlFor="clientSafe" className="text-sm">
              Client-safe mode (executive summary only)
            </Label>
          </div>
        </div>

        {exportOptions.clientSafeMode && (
          <Alert>
            <Shield className="h-4 w-4" />
            <AlertDescription>
              Client-safe mode will generate a high-level executive summary without technical implementation details.
            </AlertDescription>
          </Alert>
        )}

        <Button onClick={handleExport} disabled={isExporting} className="w-full">
          {isExporting ? (
            <>
              <Database className="h-4 w-4 mr-2 animate-spin" />
              Generating Export...
            </>
          ) : (
            <>
              <FileText className="h-4 w-4 mr-2" />
              Generate Client Export
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  )
}
