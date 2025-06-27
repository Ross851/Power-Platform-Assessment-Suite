"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, Shield, Clock, Users } from "lucide-react"
import { useAuth } from "./auth/auth-provider"

interface DemoModeProps {
  projectName: string
  isOwner: boolean
}

export function ClientDemoMode({ projectName, isOwner }: DemoModeProps) {
  const [isDemoMode, setIsDemoMode] = useState(false)
  const { user } = useAuth()

  if (!isOwner) return null

  return (
    <Card className="border-blue-200 bg-blue-50/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-blue-600" />
          Client Demo Mode
        </CardTitle>
        <CardDescription>Enable a safe demo environment for client presentations with anonymized data.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Demo Mode</span>
            <Badge variant={isDemoMode ? "default" : "secondary"}>{isDemoMode ? "Active" : "Inactive"}</Badge>
          </div>
          <Button variant={isDemoMode ? "destructive" : "default"} size="sm" onClick={() => setIsDemoMode(!isDemoMode)}>
            {isDemoMode ? (
              <>
                <EyeOff className="h-4 w-4 mr-2" />
                Disable Demo
              </>
            ) : (
              <>
                <Eye className="h-4 w-4 mr-2" />
                Enable Demo
              </>
            )}
          </Button>
        </div>

        {isDemoMode && (
          <Alert>
            <Shield className="h-4 w-4" />
            <AlertDescription>
              Demo mode is active. Sensitive data is hidden and the interface shows sample data for presentation
              purposes.
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-green-600" />
            <span>Client-safe viewing</span>
          </div>
          <div className="flex items-center gap-2">
            <Eye className="h-4 w-4 text-blue-600" />
            <span>Anonymized data</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-purple-600" />
            <span>Read-only mode</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
