"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"

interface PercentageInputProps {
  question: {
    id: string
    text: string
    description?: string
    answer?: number
  }
  onAnswerChange: (questionId: string, answer: number) => void
}

export function PercentageInput({ question, onAnswerChange }: PercentageInputProps) {
  const [value, setValue] = useState<number>(question.answer || 0)

  const handleSliderChange = (newValue: number[]) => {
    const percentage = newValue[0]
    setValue(percentage)
    onAnswerChange(question.id, percentage)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = Number.parseInt(e.target.value) || 0
    const clampedValue = Math.min(Math.max(inputValue, 0), 100)
    setValue(clampedValue)
    onAnswerChange(question.id, clampedValue)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{question.text}</CardTitle>
        {question.description && <CardDescription>{question.description}</CardDescription>}
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor={`${question.id}-slider`}>Percentage: {value}%</Label>
          <Slider
            id={`${question.id}-slider`}
            min={0}
            max={100}
            step={1}
            value={[value]}
            onValueChange={handleSliderChange}
            className="w-full"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`${question.id}-input`}>Or enter exact value:</Label>
          <div className="flex items-center space-x-2">
            <Input
              id={`${question.id}-input`}
              type="number"
              min="0"
              max="100"
              value={value}
              onChange={handleInputChange}
              className="w-24"
            />
            <span className="text-sm text-muted-foreground">%</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
