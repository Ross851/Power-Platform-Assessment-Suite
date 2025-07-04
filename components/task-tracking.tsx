'use client'

import React, { useState } from 'react'
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Clock, 
  Users, 
  History, 
  AlertTriangle,
  Calendar,
  MessageSquare,
  User,
  ChevronDown,
  Plus,
  X
} from 'lucide-react'
import { 
  TaskTracking, 
  TeamMember, 
  formatHistoryEntry,
  createHistoryEntry,
  updateTaskStatus,
  addTeamMember,
  updateTimeEstimate,
  getTaskTimeline
} from '@/lib/task-tracking'

interface TaskTrackingDialogProps {
  taskId: string
  taskName: string
  tracking: TaskTracking
  onUpdate: (tracking: TaskTracking) => void
  currentUser?: string
}

export function TaskTrackingDialog({ 
  taskId, 
  taskName, 
  tracking, 
  onUpdate,
  currentUser = 'Current User'
}: TaskTrackingDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [blockerNotes, setBlockerNotes] = useState(tracking.blockerNotes || '')
  const [newEstimate, setNewEstimate] = useState(tracking.estimatedHours.toString())
  const [estimateReason, setEstimateReason] = useState('')
  const [newTeamMember, setNewTeamMember] = useState('')
  const [comment, setComment] = useState('')

  const handleStatusChange = (newStatus: string) => {
    const updated = updateTaskStatus(
      tracking,
      newStatus,
      currentUser,
      newStatus === 'Blocked' ? blockerNotes : undefined
    )
    onUpdate(updated)
  }

  const handleTimeUpdate = () => {
    const hours = parseInt(newEstimate)
    if (!isNaN(hours) && hours > 0) {
      const updated = updateTimeEstimate(
        tracking,
        hours,
        currentUser,
        estimateReason
      )
      onUpdate(updated)
      setEstimateReason('')
    }
  }

  const handleAddTeamMember = () => {
    if (newTeamMember.trim()) {
      const member: TeamMember = {
        id: Date.now().toString(),
        name: newTeamMember.trim()
      }
      const updated = addTeamMember(tracking, member, currentUser)
      onUpdate(updated)
      setNewTeamMember('')
    }
  }

  const handleAddComment = () => {
    if (comment.trim()) {
      const history = createHistoryEntry(
        taskId,
        currentUser,
        'comment',
        undefined,
        '',
        comment.trim()
      )
      const updated = {
        ...tracking,
        history: [...tracking.history, history],
        lastUpdated: new Date(),
        lastUpdatedBy: currentUser
      }
      onUpdate(updated)
      setComment('')
    }
  }

  const timeline = getTaskTimeline(tracking)

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-6 w-6">
          <History className="h-3 w-3" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Task Tracking: {taskName}
          </DialogTitle>
          <DialogDescription>
            View history, manage team, and track progress
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="status" className="mt-4">
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="status">Status</TabsTrigger>
            <TabsTrigger value="team">Team</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
            <TabsTrigger value="comments">Comments</TabsTrigger>
          </TabsList>

          <TabsContent value="status" className="space-y-4">
            <div className="space-y-4">
              {/* Current Status */}
              <div>
                <Label>Current Status</Label>
                <div className="flex items-center gap-2 mt-2">
                  <Badge 
                    variant={
                      tracking.currentStatus === 'Completed' ? 'default' :
                      tracking.currentStatus === 'In Progress' ? 'secondary' :
                      tracking.currentStatus === 'Blocked' ? 'destructive' : 'outline'
                    }
                  >
                    {tracking.currentStatus}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    Last updated by {tracking.lastUpdatedBy} • {tracking.lastUpdated.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Blocker Notes */}
              {tracking.currentStatus === 'Blocked' && (
                <div className="space-y-2">
                  <Label>Blocker Details</Label>
                  <Textarea
                    value={blockerNotes}
                    onChange={(e) => setBlockerNotes(e.target.value)}
                    placeholder="Describe what's blocking this task..."
                    className="min-h-[100px]"
                  />
                  <Button 
                    size="sm" 
                    onClick={() => handleStatusChange('Blocked')}
                    disabled={!blockerNotes.trim()}
                  >
                    Update Blocker Notes
                  </Button>
                </div>
              )}

              {/* Time Estimate */}
              <div className="space-y-2">
                <Label>Time Estimate</Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    value={newEstimate}
                    onChange={(e) => setNewEstimate(e.target.value)}
                    className="w-24"
                  />
                  <span className="text-sm">hours</span>
                  {tracking.actualHours && (
                    <span className="text-sm text-muted-foreground">
                      (Actual: {tracking.actualHours}h)
                    </span>
                  )}
                </div>
                {newEstimate !== tracking.estimatedHours.toString() && (
                  <div className="space-y-2">
                    <Input
                      placeholder="Reason for change..."
                      value={estimateReason}
                      onChange={(e) => setEstimateReason(e.target.value)}
                    />
                    <Button size="sm" onClick={handleTimeUpdate}>
                      Update Estimate
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="team" className="space-y-4">
            <div className="space-y-4">
              <div>
                <Label>Team Members</Label>
                <div className="space-y-2 mt-2">
                  {tracking.assignedTo.map((member, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>{member.slice(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{member}</span>
                      {index === 0 && <Badge variant="outline" className="text-xs">Lead</Badge>}
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Add Team Member</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter name..."
                    value={newTeamMember}
                    onChange={(e) => setNewTeamMember(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddTeamMember()}
                  />
                  <Button size="sm" onClick={handleAddTeamMember}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="timeline" className="space-y-4">
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-4">
                {timeline.events.map((event, index) => (
                  <div key={index} className="flex gap-3">
                    <div className="relative">
                      <div className="h-8 w-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                        {event.type === 'status_change' && <Clock className="h-4 w-4" />}
                        {event.type === 'assignment' && <User className="h-4 w-4" />}
                        {event.type === 'blocked' && <AlertTriangle className="h-4 w-4 text-red-600" />}
                        {event.type === 'comment' && <MessageSquare className="h-4 w-4" />}
                      </div>
                      {index < timeline.events.length - 1 && (
                        <div className="absolute top-8 left-4 w-0.5 h-12 bg-gray-200 dark:bg-gray-700" />
                      )}
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm">{event.description}</p>
                      <p className="text-xs text-muted-foreground">
                        {event.date.toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="comments" className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Add Comment</Label>
                <Textarea
                  placeholder="Add a comment..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="min-h-[100px]"
                />
                <Button size="sm" onClick={handleAddComment} disabled={!comment.trim()}>
                  Add Comment
                </Button>
              </div>

              <ScrollArea className="h-[300px]">
                <div className="space-y-3">
                  {tracking.history
                    .filter(h => h.action === 'comment')
                    .reverse()
                    .map((entry, index) => (
                      <div key={index} className="p-3 border rounded-lg space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-sm">{entry.user}</span>
                          <span className="text-xs text-muted-foreground">
                            {entry.timestamp.toLocaleString()}
                          </span>
                        </div>
                        <p className="text-sm">{entry.comment}</p>
                      </div>
                    ))}
                </div>
              </ScrollArea>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// Compact task status component with tracking icon
export function TaskStatusWithTracking({
  task,
  tracking,
  onStatusChange,
  onTrackingUpdate,
  currentUser
}: {
  task: any
  tracking: TaskTracking
  onStatusChange: (status: string) => void
  onTrackingUpdate: (tracking: TaskTracking) => void
  currentUser?: string
}) {
  return (
    <div className="flex items-center gap-2">
      <Badge 
        variant={
          tracking.currentStatus === 'Completed' ? 'default' :
          tracking.currentStatus === 'In Progress' ? 'secondary' :
          tracking.currentStatus === 'Blocked' ? 'destructive' : 'outline'
        }
        className="text-xs"
      >
        {tracking.currentStatus}
      </Badge>
      
      {/* Team indicator */}
      {tracking.assignedTo.length > 1 && (
        <div className="flex -space-x-2">
          {tracking.assignedTo.slice(0, 3).map((member, i) => (
            <Avatar key={i} className="h-5 w-5 border-2 border-background">
              <AvatarFallback className="text-xs">
                {member.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          ))}
          {tracking.assignedTo.length > 3 && (
            <div className="h-5 w-5 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xs">
              +{tracking.assignedTo.length - 3}
            </div>
          )}
        </div>
      )}

      {/* History/tracking dialog trigger */}
      <TaskTrackingDialog
        taskId={task.id}
        taskName={task.name}
        tracking={tracking}
        onUpdate={onTrackingUpdate}
        currentUser={currentUser}
      />
    </div>
  )
}