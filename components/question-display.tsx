"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Compass, Save, Edit3, AlertCircle, CheckCircle, Clock } from "lucide-react"
import { BooleanInput } from "./question-types/boolean-input"
import { ScaleInput } from "./question-types/scale-input"
import { PercentageInput } from "./question-types/percentage-input"
import { TextInput } from "./question-types/text-input"
import { NumericInput } from "./question-types/numeric-input"
import { DocumentReviewInput } from "./question-types/document-review-input"
import { RAGIndicator } from "./rag-indicator"
import type { Question } from "@/lib/types"

interface QuestionDisplayProps {
  question: Question
  onAnswerChange: (answer: any) => void
  onEvidenceNotesChange: (notes: string) => void
  onRiskOwnerChange: (owner: string) => void
}

export function QuestionDisplay({
  question,
  onAnswerChange,
  onEvidenceNotesChange,
  onRiskOwnerChange,
}: QuestionDisplayProps) {
  const [isEvidenceDialogOpen, setIsEvidenceDialogOpen] = useState(false)
  const [tempEvidenceNotes, setTempEvidenceNotes] = useState(question.evidenceNotes || "")

  const handleSaveEvidence = () => {
    onEvidenceNotesChange(tempEvidenceNotes)
    setIsEvidenceDialogOpen(false)
  }

  const handleCancelEvidence = () => {
    setTempEvidenceNotes(question.evidenceNotes || "")
    setIsEvidenceDialogOpen(false)
  }

  const renderQuestionInput = () => {
    switch (question.type) {
      case "boolean":
        return <BooleanInput value={question.answer} onChange={onAnswerChange} />
      case "scale":
        return <ScaleInput value={question.answer} onChange={onAnswerChange} />
      case "percentage":
        return <PercentageInput value={question.answer} onChange={onAnswerChange} />
      case "text":
        return (
          <TextInput value={question.answer} onChange={onAnswerChange} placeholder="Enter your detailed response..." />
        )
      case "numeric":
        return <NumericInput value={question.answer} onChange={onAnswerChange} />
      case "document-review":
        return <DocumentReviewInput question={question} onChange={onAnswerChange} />
      default:
        return <div>Unsupported question type: {question.type}</div>
    }
  }

  const getStatusIcon = () => {
    if (question.answer === undefined || question.answer === "" || question.answer === null) {
      return <Clock className="h-4 w-4 text-muted-foreground" />
    }
    if (question.ragStatus === "red") {
      return <AlertCircle className="h-4 w-4 text-red-500" />
    }
    if (question.ragStatus === "amber") {
      return <AlertCircle className="h-4 w-4 text-amber-500" />
    }
    return <CheckCircle className="h-4 w-4 text-green-500" />
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg flex items-center gap-2">
              {getStatusIcon()}
              {question.text}
              {question.ragStatus && question.ragStatus !== "grey" && (
                <RAGIndicator status={question.ragStatus} size="sm" />
              )}
            </CardTitle>
            {question.category && (
              <Badge variant="secondary" className="mt-2">
                {question.category}
              </Badge>
            )}
          </div>
          {question.discovery && question.discovery.length > 0 && (
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Compass className="h-4 w-4 mr-2" />
                  Discovery Guide
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>How to Find This Information</DialogTitle>
                </DialogHeader>
                <div className="space-y-3">
                  {question.discovery.map((step, index) => (
                    <div key={index} className="flex gap-3">
                      <div className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </div>
                      <p className="text-sm">{step}</p>
                    </div>
                  ))}
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
        {question.guidance && <CardDescription>{question.guidance}</CardDescription>}
      </CardHeader>
      <CardContent className="space-y-4">
        {renderQuestionInput()}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor={`evidence-${question.id}`}>Observations / Evidence Summary</Label>
            <div className="flex items-center gap-2">
              <Textarea
                id={`evidence-${question.id}`}
                value={question.evidenceNotes || ""}
                readOnly
                placeholder="Click to add detailed observations and evidence..."
                className="min-h-[80px] cursor-pointer"
                onClick={() => setIsEvidenceDialogOpen(true)}
              />
              <Dialog open={isEvidenceDialogOpen} onOpenChange={setIsEvidenceDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Edit3 className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[80vh]">
                  <DialogHeader>
                    <DialogTitle>Observations / Evidence Summary</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <Textarea
                      value={tempEvidenceNotes}
                      onChange={(e) => setTempEvidenceNotes(e.target.value)}
                      placeholder="Provide detailed observations, evidence, and context for your assessment..."
                      className="min-h-[400px] resize-none"
                      autoFocus
                    />
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={handleCancelEvidence}>
                        Cancel
                      </Button>
                      <Button onClick={handleSaveEvidence}>
                        <Save className="h-4 w-4 mr-2" />
                        Save
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor={`risk-owner-${question.id}`}>Risk Owner</Label>
            <Input
              id={`risk-owner-${question.id}`}
              value={question.riskOwner || ""}
              onChange={(e) => onRiskOwnerChange(e.target.value)}
              placeholder="e.g., IT Director, Security Team"
            />
          </div>
        </div>

        {question.bestPractice && (
          <div className="mt-4 p-4 bg-muted rounded-lg">
            <h4 className="font-semibold text-sm mb-2">Best Practice Guidance</h4>
            <p className="text-sm text-muted-foreground mb-2">{question.bestPractice.description}</p>
            {question.bestPractice.suggestedActions && (
              <div>
                <p className="font-medium text-sm mb-1">Suggested Actions:</p>
                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                  {question.bestPractice.suggestedActions.map((action, index) => (
                    <li key={index}>{action}</li>
                  ))}
                </ul>
              </div>
            )}
            {question.bestPractice.link && (
              <a
                href={question.bestPractice.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline text-sm"
              >
                {question.bestPractice.linkText || "Learn more"}
              </a>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
