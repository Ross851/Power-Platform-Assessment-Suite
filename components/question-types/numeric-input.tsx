"use client"

import { Input } from "@/components/ui/input"
import type { Question } from "@/lib/types"

interface NumericInputProps {
  question: Question
  onAnswerChange: (answer: number) => void
}

export function NumericInput({ question, onAnswerChange }: NumericInputProps) {
  return (
    <Input
      id={question.id}
      type="number"
      value={question.answer !== undefined ? String(question.answer) : ""}
      onChange={(e) => onAnswerChange(Number(e.target.value))}
      placeholder="Enter a numeric value"
      className="max-w-xs"
    />
  )
}
