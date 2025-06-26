"use client"

import { Button } from "@/components/ui/button"
import type { Question } from "@/lib/types"
import { ThumbsUp, ThumbsDown } from "lucide-react"

interface BooleanInputProps {
  question: Question
  onAnswerChange: (answer: boolean) => void
}

export function BooleanInput({ question, onAnswerChange }: BooleanInputProps) {
  const currentAnswer = question.answer as boolean | undefined

  return (
    <div className="flex space-x-4">
      <Button
        variant={currentAnswer === true ? "default" : "outline"}
        onClick={() => onAnswerChange(true)}
        className={`flex-1 ${currentAnswer === true ? "ring-2 ring-primary ring-offset-2" : "bg-card text-card-foreground"}`}
      >
        <ThumbsUp className="mr-2 h-5 w-5 text-green-500" /> Yes
      </Button>
      <Button
        variant={currentAnswer === false ? "default" : "outline"}
        onClick={() => onAnswerChange(false)}
        className={`flex-1 ${currentAnswer === false ? "ring-2 ring-destructive ring-offset-2" : "bg-card text-card-foreground"}`}
      >
        <ThumbsDown className="mr-2 h-5 w-5 text-red-500" /> No
      </Button>
    </div>
  )
}
