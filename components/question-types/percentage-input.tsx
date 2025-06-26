"use client"

import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import type { Question } from "@/lib/types"
import { Label } from "@/components/ui/label"

interface PercentageInputProps {
  question: Question
  onAnswerChange: (answer: number) => void
}

export function PercentageInput({ question, onAnswerChange }: PercentageInputProps) {
  const value = question.answer !== undefined ? Number(question.answer) : 50

  return (
    <div className="space-y-3">
      <div className="flex items-center space-x-3">
        <Slider
          id={question.id}
          min={0}
          max={100}
          step={1}
          value={[value]}
          onValueChange={(newValue) => onAnswerChange(newValue[0])}
          className="flex-grow"
        />
        <Input
          type="number"
          value={value}
          onChange={(e) => {
            let numVal = Number.parseInt(e.target.value)
            if (isNaN(numVal)) numVal = 0
            if (numVal < 0) numVal = 0
            if (numVal > 100) numVal = 100
            onAnswerChange(numVal)
          }}
          className="w-20 text-center"
          min="0"
          max="100"
        />
        <Label htmlFor={question.id} className="font-medium">
          %
        </Label>
      </div>
    </div>
  )
}
