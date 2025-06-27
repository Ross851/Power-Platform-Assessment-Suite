"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Trash2, UserPlus, Users } from "lucide-react"
import { inviteUserToProject, removeUserFromProject, getProjectUsers } from "@/app/actions"

interface ProjectUser {
  id: string
  email: string
  full_name: string | null
  role: "owner" | "editor" | "viewer"
  created_at: string
}

interface ProjectAccessManagerProps {
  projectName: string
  isOwner: boolean
}

export function ProjectAccessManager({ projectName, isOwner }: ProjectAccessManagerProps) {
  const [users, setUsers] = useState<ProjectUser[]>([])
  const [inviteEmail, setInviteEmail] = useState("")
  const [inviteRole, setInviteRole] = useState<"editor" | "viewer">("viewer")
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  useEffect(() => {
    loadProjectUsers()
  }, [projectName])

  const loadProjectUsers = async () => {
    try {
      const result = await getProjectUsers(projectName)
      if (result.users) {
        setUsers(result.users)
      }
    } catch (error) {
      console.error("Failed to load project users:", error)
    }
  }

  const handleInviteUser = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inviteEmail.trim()) return

    setIsLoading(true)
    setMessage(null)

    try {
      const result = await inviteUserToProject(projectName, inviteEmail, inviteRole)

      if (result.success) {
        setMessage({ type: "success", text: "User invited successfully!" })
        setInviteEmail("")
        await loadProjectUsers()
      } else {
        setMessage({ type: "error", text: result.error || "Failed to invite user" })
      }
    } catch (error) {
      setMessage({ type: "error", text: "An unexpected error occurred" })
    } finally {
      setIsLoading(false)
    }
  }

  const handleRemoveUser = async (userEmail: string) => {
    if (!confirm(`Remove ${userEmail} from this project?`)) return

    try {
      const result = await removeUserFromProject(projectName, userEmail)

      if (result.success) {
        setMessage({ type: "success", text: "User removed successfully!" })
        await loadProjectUsers()
      } else {
        setMessage({ type: "error", text: result.error || "Failed to remove user" })
      }
    } catch (error) {
      setMessage({ type: "error", text: "An unexpected error occurred" })
    }
  }

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "owner":
        return "default"
      case "editor":
        return "secondary"
      case "viewer":
        return "outline"
      default:
        return "outline"
    }
  }

  if (!isOwner) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Project Access
          </CardTitle>
          <CardDescription>
            You can view who has access to this project, but only the owner can manage access.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {users.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-2 border rounded">
                <div>
                  <p className="font-medium">{user.full_name || user.email}</p>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
                <Badge variant={getRoleBadgeVariant(user.role)}>{user.role}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Project Access Management
        </CardTitle>
        <CardDescription>Invite team members and clients to collaborate on this assessment.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Invite User Form */}
        <form onSubmit={handleInviteUser} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <Label htmlFor="inviteEmail">Email Address</Label>
              <Input
                id="inviteEmail"
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="client@company.com"
                required
              />
            </div>
            <div>
              <Label htmlFor="inviteRole">Role</Label>
              <Select value={inviteRole} onValueChange={(value: "editor" | "viewer") => setInviteRole(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="viewer">Viewer - Can view assessments</SelectItem>
                  <SelectItem value="editor">Editor - Can edit assessments</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button type="submit" disabled={isLoading} className="w-full md:w-auto">
            <UserPlus className="h-4 w-4 mr-2" />
            {isLoading ? "Inviting..." : "Invite User"}
          </Button>
        </form>

        {message && (
          <Alert variant={message.type === "error" ? "destructive" : "default"}>
            <AlertDescription>{message.text}</AlertDescription>
          </Alert>
        )}

        {/* Current Users */}
        <div>
          <h3 className="text-lg font-medium mb-3">Current Access ({users.length})</h3>
          <div className="space-y-2">
            {users.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex-1">
                  <p className="font-medium">{user.full_name || user.email}</p>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                  <p className="text-xs text-muted-foreground">
                    Added {new Date(user.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={getRoleBadgeVariant(user.role)}>{user.role}</Badge>
                  {user.role !== "owner" && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveUser(user.email)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
