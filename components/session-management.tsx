"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Clock, Users, Shield, LogOut } from "lucide-react"
import { useAuth } from "./auth/auth-provider"

interface ActiveSession {
  id: string
  user_email: string
  project_name: string
  last_activity: string
  ip_address?: string
  user_agent?: string
}

export function SessionManagement() {
  const [activeSessions, setActiveSessions] = useState<ActiveSession[]>([])
  const [autoLogoutTime, setAutoLogoutTime] = useState(30) // minutes
  const { user } = useAuth()

  useEffect(() => {
    // In a real implementation, you'd fetch active sessions from your backend
    // This is a mock for demonstration
    const mockSessions: ActiveSession[] = [
      {
        id: "1",
        user_email: user?.email || "",
        project_name: "Current Session",
        last_activity: new Date().toISOString(),
        ip_address: "192.168.1.100",
        user_agent: "Chrome/120.0.0.0",
      },
    ]
    setActiveSessions(mockSessions)
  }, [user])

  const handleForceLogout = (sessionId: string) => {
    // Implementation would call your backend to invalidate the session
    setActiveSessions((prev) => prev.filter((session) => session.id !== sessionId))
  }

  const getTimeSinceActivity = (lastActivity: string) => {
    const diff = Date.now() - new Date(lastActivity).getTime()
    const minutes = Math.floor(diff / 60000)
    return minutes < 1 ? "Just now" : `${minutes}m ago`
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Session Management
        </CardTitle>
        <CardDescription>Monitor and control active user sessions for security.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <Clock className="h-4 w-4" />
          <AlertDescription>
            Sessions automatically expire after {autoLogoutTime} minutes of inactivity for security.
          </AlertDescription>
        </Alert>

        <div className="space-y-3">
          <h4 className="text-sm font-medium flex items-center gap-2">
            <Users className="h-4 w-4" />
            Active Sessions ({activeSessions.length})
          </h4>

          {activeSessions.map((session) => (
            <div key={session.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-sm">{session.user_email}</p>
                  <Badge variant="outline" className="text-xs">
                    {session.project_name}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  Last activity: {getTimeSinceActivity(session.last_activity)}
                </p>
                {session.ip_address && <p className="text-xs text-muted-foreground">IP: {session.ip_address}</p>}
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={session.user_email === user?.email ? "default" : "secondary"}>
                  {session.user_email === user?.email ? "You" : "Client"}
                </Badge>
                {session.user_email !== user?.email && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleForceLogout(session.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <LogOut className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="pt-4 border-t">
          <h4 className="text-sm font-medium mb-2">Security Settings</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-green-600" />
              <span>Auto-logout enabled</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-blue-600" />
              <span>Session monitoring active</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
