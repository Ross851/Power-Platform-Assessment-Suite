"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

interface ScaleInputProps {
  question: {
    id: string
    text: string
    description?: string
    answer?: number
    scaleLabels?: string[]
  }
  onAnswerChange: (questionId: string, answer: number) => void
}

export function ScaleInput({ question, onAnswerChange }: ScaleInputProps) {
  const [selectedValue, setSelectedValue] = useState<string>(
    question.answer !== undefined ? question.answer.toString() : "",
  )

  const defaultLabels = ["1 - Not at all", "2 - Slightly", "3 - Moderately", "4 - Very much", "5 - Extremely"]

  const labels = question.scaleLabels || defaultLabels

  const handleValueChange = (value: string) => {
    setSelectedValue(value)
    onAnswerChange(question.id, Number.parseInt(value))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{question.text}</CardTitle>
        {question.description && <CardDescription>{question.description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <RadioGroup value={selectedValue} onValueChange={handleValueChange} className="space-y-3">
          {labels.map((label, index) => {
            const value = (index + 1).toString()
            return (
              <div key={value} className="flex items-center space-x-2">
                <RadioGroupItem value={value} id={`${question.id}-${value}`} />
                <Label htmlFor={`${question.id}-${value}`} className="cursor-pointer">
                  {label}
                </Label>
              </div>
            )
          })}
        </RadioGroup>
      </CardContent>
    </Card>
  )
}
