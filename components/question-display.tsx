"use client"
import { useState } from "react"
import type { Question } from "@/lib/types"
import { useAssessmentStore } from "@/store/assessment-store"

import { BooleanInput } from "./question-types/boolean-input"
import { ScaleInput } from "./question-types/scale-input"
import { PercentageInput } from "./question-types/percentage-input"
import { TextInput } from "./question-types/text-input"
import { NumericInput } from "./question-types/numeric-input"
import { DocumentReviewInput } from "./question-types/document-review-input"
import { EvidenceManager } from "./evidence-manager"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { RAGIndicator } from "./rag-indicator"
import { Edit } from "lucide-react"

interface QuestionDisplayProps {
  question: Question
  standardSlug: string
}

export function QuestionDisplay({ question, standardSlug }: QuestionDisplayProps) {
  const { setAnswer } = useAssessmentStore()
  const activeProjectName = useAssessmentStore((state) => state.activeProjectName)

  const [riskOwnerInput, setRiskOwnerInput] = useState(question.riskOwner || "")
  const [isEvidenceDialogOpen, setIsEvidenceDialogOpen] = useState(false)
  const [evidenceNotes, setEvidenceNotes] = useState(question.evidenceNotes || "")

  const handleAnswerChange = (answer: any) => {
    setAnswer({ standardSlug, questionId: question.id, answer })
  }

  const handleEvidenceSave = () => {
    setAnswer({ standardSlug, questionId: question.id, evidenceNotes })
    setIsEvidenceDialogOpen(false)
  }

  const handleRiskOwnerBlur = () => {
    if (riskOwnerInput !== (question.riskOwner || "")) {
      setAnswer({
        standardSlug,
        questionId: question.id,
        riskOwner: riskOwnerInput,
      })
    }
  }

  const renderQuestionInput = () => {
    switch (question.type) {
      case "boolean":
        return <BooleanInput question={question} onAnswerChange={handleAnswerChange} />
      case "scale":
        return <ScaleInput question={question} onAnswerChange={handleAnswerChange} />
      case "percentage":
        return <PercentageInput question={question} onAnswerChange={handleAnswerChange} />
      case "text":
        return <TextInput question={question} onAnswerChange={handleAnswerChange} />
      case "numeric":
        return <NumericInput question={question} onAnswerChange={handleAnswerChange} />
      case "document-review":
        return (
          <DocumentReviewInput
            question={question}
            onAnswerChange={(qId, overallAssessment) =>
              setAnswer({ standardSlug, questionId: qId, answer: overallAssessment })
            }
          />
        )
      default:
        return <p>Unsupported question type: {question.type}</p>
    }
  }

  return (
    <div className="p-4 md:p-6 border rounded-lg shadow-sm bg-card">
      <div className="flex justify-between items-start mb-1">
        <Label htmlFor={question.id} className="text-lg font-semibold block flex-1 pr-2">
          {question.text}
        </Label>
        <div className="flex items-center space-x-1">
          {/* Popovers for Guidance and Discovery */}
          <RAGIndicator status={question.ragStatus} size="md" />
        </div>
      </div>
      <p className="text-xs text-muted-foreground mb-3">
        Category: {question.category} | Weight: {question.weight}
      </p>

      <div className="mb-4">{renderQuestionInput()}</div>

      {question.type !== "document-review" && (
        <div className="mb-4">
          <Label className="text-sm font-medium text-muted-foreground mb-2 block">
            Observations / Evidence Summary
          </Label>
          <Dialog open={isEvidenceDialogOpen} onOpenChange={setIsEvidenceDialogOpen}>
            <div className="flex items-start gap-2">
              <div className="w-full p-3 border rounded-md bg-background min-h-[84px]">
                {question.evidenceNotes ? (
                  <p className="text-sm whitespace-pre-wrap">{question.evidenceNotes}</p>
                ) : (
                  <p className="text-sm text-muted-foreground">No observations recorded.</p>
                )}
              </div>
              <DialogTrigger asChild>
                <Button variant="outline" size="icon">
                  <Edit className="h-4 w-4" />
                  <span className="sr-only">Edit Observations</span>
                </Button>
              </DialogTrigger>
            </div>
            <DialogContent className="sm:max-w-[625px]">
              <DialogHeader>
                <DialogTitle>Edit Observations / Evidence Summary</DialogTitle>
                <DialogDescription>
                  Summarise your findings, link to documentation, or describe the evidence provided below.
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <Textarea
                  value={evidenceNotes}
                  onChange={(e) => setEvidenceNotes(e.target.value)}
                  placeholder="Enter your detailed observations..."
                  className="min-h-[250px]"
                />
              </div>
              <DialogFooter>
                <Button type="button" variant="secondary" onClick={() => setIsEvidenceDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="button" onClick={handleEvidenceSave}>
                  Save Observations
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      )}

      {activeProjectName && (
        <EvidenceManager
          projectName={activeProjectName}
          questionId={question.id}
          standardSlug={standardSlug}
          initialEvidence={question.evidence || []}
        />
      )}

      {question.riskLevel && question.ragStatus !== "grey" && (
        <div
          className={`mt-6 text-sm p-3 rounded-md border ${
            question.ragStatus === "red"
              ? "bg-red-50 border-red-200 text-red-900 dark:bg-red-900/20 dark:border-red-800 dark:text-red-200"
              : question.ragStatus === "amber"
                ? "bg-yellow-50 border-yellow-200 text-yellow-900 dark:bg-yellow-900/20 dark:border-yellow-800 dark:text-yellow-200"
                : "bg-green-50 border-green-200 text-green-900 dark:bg-green-900/20 dark:border-green-800 dark:text-green-200"
          }`}
        >
          <p className="text-xs font-semibold uppercase tracking-wider mb-2">Assessment Feedback</p>
          <p>
            Calculated Risk: <span className="font-semibold">{question.riskLevel?.toUpperCase()}</span> (Score:{" "}
            {question.score}/5)
          </p>

          {question.bestPractice?.suggestedActions && question.bestPractice.suggestedActions.length > 0 && (
            <div className="mt-3">
              <p className="font-semibold text-xs mb-1">Suggested Actions:</p>
              <ul className="list-disc list-inside text-xs space-y-0.5">
                {question.bestPractice.suggestedActions.map((action, idx) => (
                  <li key={idx}>{action}</li>
                ))}
              </ul>
            </div>
          )}

          {(question.ragStatus === "red" || question.ragStatus === "amber") && (
            <div className="mt-3">
              <Label htmlFor={`${question.id}-risk-owner`} className="text-xs font-semibold block mb-1">
                Risk Owner (e.g., C-Suite, Department Head):
              </Label>
              <Input
                id={`${question.id}-risk-owner`}
                type="text"
                value={riskOwnerInput}
                onChange={(e) => setRiskOwnerInput(e.target.value)}
                onBlur={handleRiskOwnerBlur}
                placeholder="Enter name or role"
                className="text-xs h-8"
              />
            </div>
          )}
        </div>
      )}
    </div>
  )
}
