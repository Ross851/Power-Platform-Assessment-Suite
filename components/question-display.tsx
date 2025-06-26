"use client"

import type React from "react"
import type { Question } from "@/lib/types"
import { BooleanInput } from "./question-types/boolean-input"
import { ScaleInput } from "./question-types/scale-input"
import { PercentageInput } from "./question-types/percentage-input"
import { TextInput } from "./question-types/text-input"
import { NumericInput } from "./question-types/numeric-input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"
import { DocumentReviewInput } from "./question-types/document-review-input"
import { RAGIndicator } from "./rag-indicator"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Info, Lightbulb, ExternalLink } from "lucide-react"
import { Input } from "@/components/ui/input"

interface QuestionDisplayProps {
  question: Question
  onAnswerChange: (questionId: string, mainAnswer: any, additionalData?: string | object, riskOwner?: string) => void
}

export function QuestionDisplay({ question, onAnswerChange }: QuestionDisplayProps) {
  const [evidence, setEvidence] = useState(question.evidenceNotes || "")
  const [riskOwnerInput, setRiskOwnerInput] = useState(question.riskOwner || "")

  const handleEvidenceChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newEvidence = e.target.value
    setEvidence(newEvidence)
    if (question.type === "document-review") {
      onAnswerChange(
        question.id,
        question.answer,
        { ...(question.document || {}), evidenceNotes: newEvidence },
        riskOwnerInput,
      )
    } else {
      onAnswerChange(question.id, question.answer, newEvidence, riskOwnerInput)
    }
  }

  const handleMainAnswerChange = (mainAnswer: any, additionalData?: string | object) => {
    if (question.type === "document-review") {
      const docDataWithEvidence = {
        ...((additionalData as object) || question.document || {}),
        evidenceNotes: evidence,
      }
      onAnswerChange(question.id, mainAnswer, docDataWithEvidence, riskOwnerInput)
    } else {
      onAnswerChange(question.id, mainAnswer, evidence, riskOwnerInput)
    }
  }

  const handleRiskOwnerBlur = () => {
    // Only call onAnswerChange if riskOwnerInput has actually changed from the stored question.riskOwner
    // or if question.riskOwner was undefined and riskOwnerInput has a value.
    if (riskOwnerInput !== (question.riskOwner || "")) {
      if (question.type === "document-review") {
        onAnswerChange(
          question.id,
          question.answer,
          { ...(question.document || {}), evidenceNotes: evidence },
          riskOwnerInput,
        )
      } else {
        onAnswerChange(question.id, question.answer, evidence, riskOwnerInput)
      }
    }
  }

  const renderQuestionInput = () => {
    switch (question.type) {
      case "boolean":
        return <BooleanInput question={question} onAnswerChange={handleMainAnswerChange} />
      case "scale":
        return <ScaleInput question={question} onAnswerChange={handleMainAnswerChange} />
      case "percentage":
        return <PercentageInput question={question} onAnswerChange={handleMainAnswerChange} />
      case "text":
        return <TextInput question={question} onAnswerChange={handleMainAnswerChange} />
      case "numeric":
        return <NumericInput question={question} onAnswerChange={handleMainAnswerChange} />
      case "document-review":
        return (
          <DocumentReviewInput
            question={question}
            onAnswerChange={(questionId, overallAssessment, documentData) => {
              handleMainAnswerChange(overallAssessment, documentData)
            }}
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
        <div className="flex items-center space-x-2">
          {question.guidance && (
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-primary">
                  <Info className="h-4 w-4" />
                  <span className="sr-only">Show guidance</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 text-sm" side="top" align="end">
                <p className="font-medium mb-1">Guidance:</p>
                {question.guidance}
              </PopoverContent>
            </Popover>
          )}
          <RAGIndicator status={question.ragStatus} size="md" />
        </div>
      </div>
      <p className="text-xs text-muted-foreground mb-3">
        Category: {question.category} | Weight: {question.weight}
      </p>

      <div className="mb-4">{renderQuestionInput()}</div>

      {question.type !== "document-review" && (
        <div>
          <Label htmlFor={`${question.id}-evidence`} className="text-sm font-medium text-muted-foreground mb-1 block">
            Observations / Evidence (Optional)
          </Label>
          <Textarea
            id={`${question.id}-evidence`}
            value={evidence}
            onChange={handleEvidenceChange}
            placeholder="Enter any observations, links to documentation, or evidence..."
            className="min-h-[100px]"
          />
        </div>
      )}

      {question.riskLevel && question.ragStatus !== "grey" && (
        <div
          className={`mt-4 text-sm p-3 rounded-md border ${
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

          {question.bestPractice && (question.ragStatus === "red" || question.ragStatus === "amber") && (
            <div className="mt-3 pt-3 border-t border-current/20">
              <p className="flex items-center font-semibold mb-1">
                <Lightbulb className="h-4 w-4 mr-2 text-blue-500" />
                Best Practice Recommendation
              </p>
              <p className="text-sm">{question.bestPractice.description}</p>
              {question.bestPractice.link && (
                <a
                  href={question.bestPractice.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline dark:text-blue-400 text-sm mt-2 inline-flex items-center"
                >
                  {question.bestPractice.linkText || "Learn more"}
                  <ExternalLink className="ml-1 h-3 w-3" />
                </a>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
