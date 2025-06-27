"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, Info } from "lucide-react"

export function ClientDemoMode() {
  const [isDemoMode, setIsDemoMode] = useState(false)
  const [envDemoMode, setEnvDemoMode] = useState<string | undefined>()

  useEffect(() => {
    const demoMode = process.env.NEXT_PUBLIC_CLIENT_DEMO
    setEnvDemoMode(demoMode)
    setIsDemoMode(demoMode === "true")
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {isDemoMode ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          Client Demo Mode
        </CardTitle>
        <CardDescription>Control data visibility for client presentations</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <div className="text-base">Demo Mode Status</div>
            <div className="text-sm text-muted-foreground">Environment: NEXT_PUBLIC_CLIENT_DEMO</div>
          </div>
          <Badge variant={isDemoMode ? "default" : "secondary"}>{envDemoMode || "not set"}</Badge>
        </div>

        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            {isDemoMode
              ? "Demo mode is ACTIVE. Data will be anonymized for client safety."
              : "Demo mode is INACTIVE. Full data access is available."}
          </AlertDescription>
        </Alert>

        <div className="space-y-2">
          <h4 className="text-sm font-medium">Demo Mode Features:</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Anonymizes server names and IP addresses</li>
            <li>• Hides sensitive technical details</li>
            <li>• Shows sample data instead of real data</li>
            <li>• Enables read-only mode for presentations</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
