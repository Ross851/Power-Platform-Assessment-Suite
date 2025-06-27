"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Upload, FileText, X } from "lucide-react"

interface DocumentReviewInputProps {
  question: {
    id: string
    text: string
    description?: string
    answer?: {
      documents: Array<{ name: string; type: string; size: number }>
      notes: string
    }
  }
  onAnswerChange: (questionId: string, answer: any) => void
}

export function DocumentReviewInput({ question, onAnswerChange }: DocumentReviewInputProps) {
  const [documents, setDocuments] = useState<Array<{ name: string; type: string; size: number }>>(
    question.answer?.documents || [],
  )
  const [notes, setNotes] = useState<string>(question.answer?.notes || "")

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const newDocuments = files.map((file) => ({
      name: file.name,
      type: file.type,
      size: file.size,
    }))

    const updatedDocuments = [...documents, ...newDocuments]
    setDocuments(updatedDocuments)
    updateAnswer(updatedDocuments, notes)
  }

  const removeDocument = (index: number) => {
    const updatedDocuments = documents.filter((_, i) => i !== index)
    setDocuments(updatedDocuments)
    updateAnswer(updatedDocuments, notes)
  }

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newNotes = e.target.value
    setNotes(newNotes)
    updateAnswer(documents, newNotes)
  }

  const updateAnswer = (docs: typeof documents, notesText: string) => {
    onAnswerChange(question.id, {
      documents: docs,
      notes: notesText,
    })
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{question.text}</CardTitle>
        {question.description && <CardDescription>{question.description}</CardDescription>}
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Upload Documents</Label>
          <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
            <Upload className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Drag and drop files here, or click to browse</p>
              <Button variant="outline" size="sm" asChild>
                <label htmlFor={`${question.id}-file-upload`} className="cursor-pointer">
                  Choose Files
                  <input
                    id={`${question.id}-file-upload`}
                    type="file"
                    multiple
                    onChange={handleFileUpload}
                    className="sr-only"
                    accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
                  />
                </label>
              </Button>
            </div>
          </div>
        </div>

        {documents.length > 0 && (
          <div className="space-y-2">
            <Label>Uploaded Documents</Label>
            <div className="space-y-2">
              {documents.map((doc, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">{doc.name}</p>
                      <p className="text-xs text-muted-foreground">{formatFileSize(doc.size)}</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeDocument(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor={`${question.id}-notes`}>Review Notes</Label>
          <Textarea
            id={`${question.id}-notes`}
            value={notes}
            onChange={handleNotesChange}
            placeholder="Add your review notes and observations..."
            rows={4}
            className="w-full"
          />
        </div>
      </CardContent>
    </Card>
  )
}
