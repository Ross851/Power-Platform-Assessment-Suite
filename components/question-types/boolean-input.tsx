"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Check, X } from "lucide-react"

interface BooleanInputProps {
  question: {
    id: string
    text: string
    description?: string
    answer?: boolean
  }
  onAnswerChange: (questionId: string, answer: boolean) => void
}

export function BooleanInput({ question, onAnswerChange }: BooleanInputProps) {
  const [selectedValue, setSelectedValue] = useState<string>(
    question.answer !== undefined ? question.answer.toString() : "",
  )

  const handleValueChange = (value: string) => {
    setSelectedValue(value)
    onAnswerChange(question.id, value === "true")
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{question.text}</CardTitle>
        {question.description && <CardDescription>{question.description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <RadioGroup value={selectedValue} onValueChange={handleValueChange} className="space-y-3">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="true" id={`${question.id}-true`} />
            <Label htmlFor={`${question.id}-true`} className="flex items-center space-x-2 cursor-pointer">
              <Check className="h-4 w-4 text-green-600" />
              <span>Yes</span>
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="false" id={`${question.id}-false`} />
            <Label htmlFor={`${question.id}-false`} className="flex items-center space-x-2 cursor-pointer">
              <X className="h-4 w-4 text-red-600" />
              <span>No</span>
            </Label>
          </div>
        </RadioGroup>
      </CardContent>
    </Card>
  )
}
