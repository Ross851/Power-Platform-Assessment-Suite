"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useAssessmentStore } from "@/store/assessment-store"
import { User, Mail, Briefcase, Calendar, FileText } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface AssessorInfoDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AssessorInfoDialog({ open, onOpenChange }: AssessorInfoDialogProps) {
  const { setAssessmentMetadata, getAssessmentMetadata } = useAssessmentStore()
  const existingMetadata = getAssessmentMetadata()
  
  const [formData, setFormData] = useState({
    assessorName: existingMetadata?.assessorName || "",
    assessorRole: existingMetadata?.assessorRole || "",
    assessorEmail: existingMetadata?.assessorEmail || "",
    reviewNotes: existingMetadata?.reviewNotes || ""
  })

  useEffect(() => {
    const metadata = getAssessmentMetadata()
    if (metadata) {
      setFormData({
        assessorName: metadata.assessorName || "",
        assessorRole: metadata.assessorRole || "",
        assessorEmail: metadata.assessorEmail || "",
        reviewNotes: metadata.reviewNotes || ""
      })
    }
  }, [open, getAssessmentMetadata])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.assessorName.trim()) {
      alert("Please enter the assessor's name")
      return
    }

    setAssessmentMetadata({
      ...formData,
      assessmentDate: new Date()
    })
    
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Assessment Conductor Information</DialogTitle>
            <DialogDescription>
              Please provide information about who is conducting this assessment. This will be included in reports for future reference.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="assessorName" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Assessor Name *
              </Label>
              <Input
                id="assessorName"
                value={formData.assessorName}
                onChange={(e) => setFormData({ ...formData, assessorName: e.target.value })}
                placeholder="e.g., John Smith"
                required
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="assessorRole" className="flex items-center gap-2">
                <Briefcase className="h-4 w-4" />
                Role/Title
              </Label>
              <Input
                id="assessorRole"
                value={formData.assessorRole}
                onChange={(e) => setFormData({ ...formData, assessorRole: e.target.value })}
                placeholder="e.g., Power Platform Architect"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="assessorEmail" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email Address
              </Label>
              <Input
                id="assessorEmail"
                type="email"
                value={formData.assessorEmail}
                onChange={(e) => setFormData({ ...formData, assessorEmail: e.target.value })}
                placeholder="e.g., john.smith@company.com"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="reviewNotes" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Review Notes
              </Label>
              <Textarea
                id="reviewNotes"
                value={formData.reviewNotes}
                onChange={(e) => setFormData({ ...formData, reviewNotes: e.target.value })}
                placeholder="Any additional notes about this assessment..."
                rows={3}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Save Information</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export function AssessorInfoDisplay() {
  const metadata = useAssessmentStore((state) => state.getAssessmentMetadata())
  
  if (!metadata) return null
  
  return (
    <Card className="mb-4">
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Assessed by:</span>
              <span>{metadata.assessorName}</span>
              {metadata.assessorRole && (
                <>
                  <span className="text-muted-foreground">•</span>
                  <span className="text-muted-foreground">{metadata.assessorRole}</span>
                </>
              )}
            </div>
            
            {metadata.assessorEmail && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>{metadata.assessorEmail}</span>
              </div>
            )}
            
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>Assessment Date: {new Date(metadata.assessmentDate).toLocaleDateString()}</span>
            </div>
            
            {metadata.reviewNotes && (
              <div className="mt-2 text-sm text-muted-foreground">
                <span className="font-medium">Notes:</span> {metadata.reviewNotes}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 