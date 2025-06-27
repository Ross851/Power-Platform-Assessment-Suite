"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface NumericInputProps {
  question: {
    id: string
    text: string
    description?: string
    answer?: number
    min?: number
    max?: number
    unit?: string
  }
  onAnswerChange: (questionId: string, answer: number) => void
}

export function NumericInput({ question, onAnswerChange }: NumericInputProps) {
  const [value, setValue] = useState<string>(question.answer?.toString() || "")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value
    setValue(inputValue)

    const numericValue = Number.parseFloat(inputValue)
    if (!isNaN(numericValue)) {
      onAnswerChange(question.id, numericValue)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{question.text}</CardTitle>
        {question.description && <CardDescription>{question.description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Label htmlFor={`${question.id}-input`}>Enter value {question.unit && `(${question.unit})`}</Label>
          <div className="flex items-center space-x-2">
            <Input
              id={`${question.id}-input`}
              type="number"
              min={question.min}
              max={question.max}
              value={value}
              onChange={handleChange}
              placeholder="Enter a number"
              className="w-full"
            />
            {question.unit && <span className="text-sm text-muted-foreground">{question.unit}</span>}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
