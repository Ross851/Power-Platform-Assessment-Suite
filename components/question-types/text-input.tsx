"use client"

import { Textarea } from "@/components/ui/textarea"
import type { Question } from "@/lib/types"

interface TextInputProps {
  question: Question
  onAnswerChange: (answer: string) => void
}

export function TextInput({ question, onAnswerChange }: TextInputProps) {
  return (
    <Textarea
      id={question.id}
      value={(question.answer as string) || ""}
      onChange={(e) => onAnswerChange(e.target.value)}
      placeholder="Enter your detailed response..."
      className="min-h-[120px]"
    />
  )
}
