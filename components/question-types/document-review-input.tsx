"use client"

import type React from "react"
import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"

import type { Question } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { UploadCloud, FileText, X, PlusCircle, Trash2, Download, Eye } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface DocumentReviewInputProps {
  question: Question
  value: any
  onChange: (value: any) => void
}

interface DocumentData {
  documents: {
    id?: string
    name: string
    size: number
    type: string
    url?: string
    uploadDate: string
    author?: string
    description?: string
  }[]
  notes: string
  riskOwner: string
  codeSnippets?: string
  developerFeedback?: string
  developerRecommendations?: string
}

export function DocumentReviewInput({ question, value, onChange }: DocumentReviewInputProps) {
  const [documentData, setDocumentData] = useState<DocumentData>(
    value || {
      documents: [],
      notes: "",
      riskOwner: "",
      codeSnippets: "",
      developerFeedback: "",
      developerRecommendations: "",
    }
  )

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const newDocuments = acceptedFiles.map((file) => ({
        id: `doc-${Date.now()}-${Math.random()}`,
        name: file.name,
        size: file.size,
        type: file.type,
        uploadDate: new Date().toISOString(),
      }))

      const updatedData = {
        ...documentData,
        documents: [...documentData.documents, ...newDocuments],
      }
      setDocumentData(updatedData)
      onChange(updatedData)
    },
    [documentData, onChange]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.bmp'],
      'text/*': ['.txt', '.csv'],
    },
  })

  const removeDocument = (index: number) => {
    const updatedData = {
      ...documentData,
      documents: documentData.documents.filter((_, i) => i !== index),
    }
    setDocumentData(updatedData)
    onChange(updatedData)
  }

  const updateNotes = (notes: string) => {
    const updatedData = { ...documentData, notes }
    setDocumentData(updatedData)
    onChange(updatedData)
  }

  const updateRiskOwner = (riskOwner: string) => {
    const updatedData = { ...documentData, riskOwner }
    setDocumentData(updatedData)
    onChange(updatedData)
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const getFileIcon = (type: string) => {
    if (type.includes("pdf")) return "📄"
    if (type.includes("word")) return "📝"
    if (type.includes("excel") || type.includes("spreadsheet")) return "📊"
    if (type.includes("image")) return "🖼️"
    return "📎"
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Document Upload</CardTitle>
          <CardDescription>Upload supporting documents for this assessment item</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Dropzone */}
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50"
            }`}
          >
            <input {...getInputProps()} />
            <UploadCloud className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            {isDragActive ? (
              <p className="text-sm text-muted-foreground">Drop the files here...</p>
            ) : (
              <div>
                <p className="text-sm text-muted-foreground">Drag & drop files here, or click to select</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Supported: PDF, Word, Excel, Images, Text files
                </p>
              </div>
            )}
          </div>

          {/* Uploaded Documents */}
          {documentData.documents.length > 0 && (
            <div className="space-y-2">
              <Label className="text-sm font-medium">Uploaded Documents ({documentData.documents.length})</Label>
              {documentData.documents.map((doc, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg bg-muted/30">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{getFileIcon(doc.type)}</span>
                    <div>
                      <p className="text-sm font-medium">{doc.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatFileSize(doc.size)} • Uploaded {new Date(doc.uploadDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeDocument(index)}
                      className="h-8 w-8"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Risk Owner */}
          <div>
            <Label htmlFor="risk-owner" className="text-sm font-medium">
              Risk Owner / Document Owner
            </Label>
            <Input
              id="risk-owner"
              value={documentData.riskOwner}
              onChange={(e) => updateRiskOwner(e.target.value)}
              placeholder="Enter the name of the person responsible for this documentation"
              className="mt-1"
            />
          </div>

          {/* Review Notes */}
          <div>
            <Label htmlFor="review-notes" className="text-sm font-medium">
              Document Review Notes
            </Label>
            <Textarea
              id="review-notes"
              value={documentData.notes}
              onChange={(e) => updateNotes(e.target.value)}
              placeholder="Enter your review notes, findings, and observations about these documents..."
              className="mt-1 min-h-[100px]"
            />
          </div>
        </CardContent>
      </Card>

      {/* Summary Badge */}
      {documentData.documents.length > 0 && (
        <div className="flex items-center gap-2">
          <Badge variant="secondary">
            <FileText className="h-3 w-3 mr-1" />
            {documentData.documents.length} document{documentData.documents.length !== 1 ? "s" : ""} uploaded
          </Badge>
          {documentData.riskOwner && (
            <Badge variant="outline">
              Owner: {documentData.riskOwner}
            </Badge>
          )}
        </div>
      )}
    </div>
  )
}
