"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

interface TextInputProps {
  question: {
    id: string
    text: string
    description?: string
    answer?: string
    placeholder?: string
    maxLength?: number
  }
  onAnswerChange: (questionId: string, answer: string) => void
}

export function TextInput({ question, onAnswerChange }: TextInputProps) {
  const [value, setValue] = useState<string>(question.answer || "")

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const inputValue = e.target.value
    setValue(inputValue)
    onAnswerChange(question.id, inputValue)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{question.text}</CardTitle>
        {question.description && <CardDescription>{question.description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Label htmlFor={`${question.id}-textarea`}>Your response</Label>
          <Textarea
            id={`${question.id}-textarea`}
            value={value}
            onChange={handleChange}
            placeholder={question.placeholder || "Enter your response..."}
            maxLength={question.maxLength}
            rows={4}
            className="w-full"
          />
          {question.maxLength && (
            <p className="text-sm text-muted-foreground">
              {value.length}/{question.maxLength} characters
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
