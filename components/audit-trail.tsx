"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { FileText, User, Clock, Eye, Edit, Download } from "lucide-react"
import { format } from "date-fns"

interface AuditEvent {
  id: string
  user_email: string
  action: "view" | "edit" | "export" | "invite" | "login"
  resource: string
  timestamp: string
  ip_address?: string
  details?: string
}

interface AuditTrailProps {
  projectName: string
}

export function AuditTrail({ projectName }: AuditTrailProps) {
  const [auditEvents, setAuditEvents] = useState<AuditEvent[]>([])

  useEffect(() => {
    // Mock audit events - in production, fetch from your backend
    const mockEvents: AuditEvent[] = [
      {
        id: "1",
        user_email: "consultant@telana.com",
        action: "edit",
        resource: "DLP Policy Assessment",
        timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
        details: "Updated question dlp-q1 answer",
      },
      {
        id: "2",
        user_email: "client@company.com",
        action: "view",
        resource: "Project Dashboard",
        timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
        ip_address: "203.0.113.1",
      },
      {
        id: "3",
        user_email: "consultant@telana.com",
        action: "export",
        resource: "Executive Summary",
        timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
        details: "Generated client-safe export",
      },
      {
        id: "4",
        user_email: "consultant@telana.com",
        action: "invite",
        resource: "Project Access",
        timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
        details: "Invited client@company.com as viewer",
      },
    ]
    setAuditEvents(mockEvents)
  }, [projectName])

  const getActionIcon = (action: string) => {
    switch (action) {
      case "view":
        return <Eye className="h-4 w-4 text-blue-500" />
      case "edit":
        return <Edit className="h-4 w-4 text-green-500" />
      case "export":
        return <Download className="h-4 w-4 text-purple-500" />
      case "invite":
        return <User className="h-4 w-4 text-orange-500" />
      default:
        return <FileText className="h-4 w-4 text-gray-500" />
    }
  }

  const getActionBadge = (action: string) => {
    const variants = {
      view: "secondary",
      edit: "default",
      export: "outline",
      invite: "destructive",
      login: "secondary",
    } as const

    return (
      <Badge variant={variants[action as keyof typeof variants] || "secondary"} className="text-xs">
        {action.charAt(0).toUpperCase() + action.slice(1)}
      </Badge>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Audit Trail
        </CardTitle>
        <CardDescription>Track all user activities and data access for compliance and security.</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-96 w-full">
          <div className="space-y-3">
            {auditEvents.map((event) => (
              <div key={event.id} className="flex items-start gap-3 p-3 border rounded-lg">
                <div className="flex-shrink-0 mt-1">{getActionIcon(event.action)}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-medium text-sm truncate">{event.user_email}</p>
                    {getActionBadge(event.action)}
                  </div>
                  <p className="text-sm text-muted-foreground">{event.resource}</p>
                  {event.details && <p className="text-xs text-muted-foreground italic">{event.details}</p>}
                  <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>{format(new Date(event.timestamp), "MMM dd, HH:mm")}</span>
                    {event.ip_address && <span>• IP: {event.ip_address}</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
