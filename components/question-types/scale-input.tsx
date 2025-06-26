"use client"

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import type { Question } from "@/lib/types"

interface ScaleInputProps {
  question: Question
  onAnswerChange: (answer: number) => void
}

export function ScaleInput({ question, onAnswerChange }: ScaleInputProps) {
  const options = question.options || ["1", "2", "3", "4", "5"]
  const currentAnswer = question.answer !== undefined ? String(question.answer) : undefined

  return (
    <RadioGroup
      value={currentAnswer}
      onValueChange={(value) => onAnswerChange(Number(value))}
      className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2"
    >
      {options.map((option, index) => {
        const value = String(index + 1) // Assuming scale is 1-based
        return (
          <Label
            key={value}
            htmlFor={`${question.id}-${value}`}
            className={`flex-1 flex flex-col items-center justify-center p-3 border rounded-md cursor-pointer transition-colors
              ${currentAnswer === value ? "bg-primary text-primary-foreground border-primary ring-2 ring-primary ring-offset-2" : "bg-card hover:bg-muted"}`}
          >
            <RadioGroupItem value={value} id={`${question.id}-${value}`} className="sr-only" />
            <span className="text-sm font-medium">{option}</span>
          </Label>
        )
      })}
    </RadioGroup>
  )
}
