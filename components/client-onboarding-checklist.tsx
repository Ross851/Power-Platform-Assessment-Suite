"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, Circle, Users, Shield, FileText } from "lucide-react"

interface ChecklistItem {
  id: string
  title: string
  description: string
  completed: boolean
  required: boolean
  category: "setup" | "security" | "client" | "documentation"
}

export function ClientOnboardingChecklist() {
  const [checklist, setChecklist] = useState<ChecklistItem[]>([
    {
      id: "1",
      title: "Run authentication setup script",
      description: "Execute scripts/02-authentication-setup.sql in Supabase",
      completed: false,
      required: true,
      category: "setup",
    },
    {
      id: "2",
      title: "Configure email templates",
      description: "Set up invitation and notification email templates",
      completed: false,
      required: true,
      category: "setup",
    },
    {
      id: "3",
      title: "Test user registration flow",
      description: "Verify that new users can sign up and access the system",
      completed: false,
      required: true,
      category: "security",
    },
    {
      id: "4",
      title: "Create client project",
      description: "Set up the assessment project for your client",
      completed: false,
      required: true,
      category: "client",
    },
    {
      id: "5",
      title: "Invite client users",
      description: "Send invitations to client stakeholders with appropriate roles",
      completed: false,
      required: true,
      category: "client",
    },
    {
      id: "6",
      title: "Prepare demo environment",
      description: "Set up sample data and demo mode for client presentations",
      completed: false,
      required: false,
      category: "client",
    },
    {
      id: "7",
      title: "Configure export settings",
      description: "Set up client-safe export options and data anonymization",
      completed: false,
      required: false,
      category: "documentation",
    },
    {
      id: "8",
      title: "Test audit trail",
      description: "Verify that all user activities are being logged properly",
      completed: false,
      required: true,
      category: "security",
    },
    {
      id: "9",
      title: "Client training session",
      description: "Conduct walkthrough with client users on how to use the system",
      completed: false,
      required: false,
      category: "client",
    },
  ])

  const toggleItem = (id: string) => {
    setChecklist((prev) => prev.map((item) => (item.id === id ? { ...item, completed: !item.completed } : item)))
  }

  const completedItems = checklist.filter((item) => item.completed).length
  const totalItems = checklist.length
  const requiredItems = checklist.filter((item) => item.required)
  const completedRequired = requiredItems.filter((item) => item.completed).length
  const progress = (completedItems / totalItems) * 100

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "setup":
        return <Circle className="h-4 w-4 text-blue-500" />
      case "security":
        return <Shield className="h-4 w-4 text-red-500" />
      case "client":
        return <Users className="h-4 w-4 text-green-500" />
      case "documentation":
        return <FileText className="h-4 w-4 text-purple-500" />
      default:
        return <Circle className="h-4 w-4 text-gray-500" />
    }
  }

  const isReadyForClient = completedRequired === requiredItems.length

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle className="h-5 w-5" />
          Client Onboarding Checklist
        </CardTitle>
        <CardDescription>Complete these steps before inviting clients to the assessment.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Overall Progress</span>
            <span>
              {completedItems}/{totalItems} completed
            </span>
          </div>
          <Progress value={progress} className="h-2" />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>
              Required: {completedRequired}/{requiredItems.length}
            </span>
            <Badge variant={isReadyForClient ? "default" : "secondary"}>
              {isReadyForClient ? "Ready for Client" : "Setup Required"}
            </Badge>
          </div>
        </div>

        <div className="space-y-3">
          {checklist.map((item) => (
            <div key={item.id} className="flex items-start gap-3 p-3 border rounded-lg">
              <Checkbox
                id={item.id}
                checked={item.completed}
                onCheckedChange={() => toggleItem(item.id)}
                className="mt-1"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  {getCategoryIcon(item.category)}
                  <label htmlFor={item.id} className="font-medium text-sm cursor-pointer">
                    {item.title}
                  </label>
                  {item.required && (
                    <Badge variant="outline" className="text-xs">
                      Required
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>
            </div>
          ))}
        </div>

        {isReadyForClient && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-2 text-green-800">
              <CheckCircle className="h-5 w-5" />
              <span className="font-medium">Ready for Client Access!</span>
            </div>
            <p className="text-sm text-green-700 mt-1">
              All required setup steps are complete. You can now safely invite clients to collaborate.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
