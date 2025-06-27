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
import { Edit } from "lucide-react"

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

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <div className="flex items-start gap-2">
        <div className="w-full p-3 border rounded-md bg-background min-h-[84px]">
          {question.answer ? (
            <p className="text-sm whitespace-pre-wrap">{question.answer as string}</p>
          ) : (
            <p className="text-sm text-muted-foreground">No response provided.</p>
          )}
        </div>
        <DialogTrigger asChild>
          <Button variant="outline" size="icon">
            <Edit className="h-4 w-4" />
            <span className="sr-only">Edit Response</span>
          </Button>
        </DialogTrigger>
      </div>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Edit Response</DialogTitle>
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
            className="min-h-[250px]"
          />
        </div>
        <DialogFooter>
          <Button type="button" variant="secondary" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button type="button" onClick={handleSave}>
            Save Response
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
