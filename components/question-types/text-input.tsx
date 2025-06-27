"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import type { Question } from "@/lib/types"
import { Edit, Save } from "lucide-react"

interface TextInputProps {
  question: Question
  onAnswerChange: (answer: string) => void
}

export function TextInput({ question, onAnswerChange }: TextInputProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [currentValue, setCurrentValue] = useState((question.answer as string) || "")

  const handleSave = () => {
    onAnswerChange(currentValue)
    setIsOpen(false)
  }

  const handleCancel = () => {
    setCurrentValue((question.answer as string) || "")
    setIsOpen(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <div className="flex items-start gap-2">
        <Textarea
          value={(question.answer as string) || ""}
          readOnly
          placeholder="Click to enter your detailed response..."
          className="min-h-[120px] cursor-pointer resize-none"
          onClick={() => setIsOpen(true)}
        />
        <DialogTrigger asChild>
          <Button variant="outline" size="icon">
            <Edit className="h-4 w-4" />
            <span className="sr-only">Edit Response</span>
          </Button>
        </DialogTrigger>
      </div>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Detailed Response</DialogTitle>
          <DialogDescription>{question.text}</DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Label htmlFor="response-text" className="sr-only">
            Detailed Response
          </Label>
          <Textarea
            id="response-text"
            value={currentValue}
            onChange={(e) => setCurrentValue(e.target.value)}
            placeholder="Enter your detailed response..."
            className="min-h-[400px] resize-none"
            autoFocus
          />
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button type="button" onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Save Response
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
