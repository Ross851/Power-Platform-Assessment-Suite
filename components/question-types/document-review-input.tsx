"use client"

import type React from "react"
import { useState, useCallback, useEffect } from "react"
import { useDropzone } from "react-dropzone"
import { Document, Page, pdfjs } from "react-pdf"

import type { Question } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { UploadCloud, FileText, X, ChevronLeft, ChevronRight, PlusCircle, Trash2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

// Configure PDF.js worker
// In a Next.js app, you'd typically copy this to the public folder
// For Next.js, this might be tricky. Let's assume it can be fetched from a CDN.
// If running locally after npm install, it might resolve from node_modules.
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`

interface DocumentReviewInputProps {
  question: Question
  onAnswerChange: (
    questionId: string,
    // The 'answer' could be a summary or overall assessment.
    // Annotations are handled via documentData.
    answer: string,
    documentData: {
      file?: File | null
      fileName?: string
      numPages?: number
      annotations: Array<{ page: number; text: string; tags?: string[] }>
    },
  ) => void
}

interface Annotation {
  page: number
  text: string
  tags: string[]
}

export function DocumentReviewInput({ question, onAnswerChange }: DocumentReviewInputProps) {
  const [file, setFile] = useState<File | null>(question.document?.file || null)
  const [fileName, setFileName] = useState<string>(question.document?.fileName || "")
  const [numPages, setNumPages] = useState<number | null>(question.document?.numPages || null)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [annotations, setAnnotations] = useState<Annotation[]>(question.document?.annotations || [])
  const [currentAnnotationText, setCurrentAnnotationText] = useState("")
  const [currentAnnotationTags, setCurrentAnnotationTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState("")
  const [overallAssessment, setOverallAssessment] = useState<string>((question.answer as string) || "")

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles && acceptedFiles.length > 0) {
        const selectedFile = acceptedFiles[0]
        if (selectedFile.type === "application/pdf") {
          setFile(selectedFile)
          setFileName(selectedFile.name)
          setCurrentPage(1) // Reset to first page on new file
          // Annotations should be reset or handled if associated with the specific file
          setAnnotations([])
          onAnswerChange(question.id, overallAssessment, {
            file: selectedFile,
            fileName: selectedFile.name,
            numPages,
            annotations: [],
          })
        } else {
          alert("Please upload a PDF file.")
        }
      }
    },
    [question.id, onAnswerChange, overallAssessment, numPages],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"] },
    multiple: false,
  })

  function onDocumentLoadSuccess({ numPages: nextNumPages }: { numPages: number }) {
    setNumPages(nextNumPages)
    onAnswerChange(question.id, overallAssessment, { file, fileName, numPages: nextNumPages, annotations })
  }

  const addAnnotation = () => {
    if (currentAnnotationText.trim() === "") return
    const newAnnotation: Annotation = {
      page: currentPage,
      text: currentAnnotationText,
      tags: currentAnnotationTags,
    }
    const updatedAnnotations = [...annotations, newAnnotation]
    setAnnotations(updatedAnnotations)
    onAnswerChange(question.id, overallAssessment, { file, fileName, numPages, annotations: updatedAnnotations })
    setCurrentAnnotationText("")
    setCurrentAnnotationTags([])
    setTagInput("")
  }

  const removeAnnotation = (index: number) => {
    const updatedAnnotations = annotations.filter((_, i) => i !== index)
    setAnnotations(updatedAnnotations)
    onAnswerChange(question.id, overallAssessment, { file, fileName, numPages, annotations: updatedAnnotations })
  }

  const addTag = () => {
    if (tagInput.trim() && !currentAnnotationTags.includes(tagInput.trim())) {
      setCurrentAnnotationTags([...currentAnnotationTags, tagInput.trim()])
      setTagInput("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setCurrentAnnotationTags(currentAnnotationTags.filter((tag) => tag !== tagToRemove))
  }

  const handleOverallAssessmentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setOverallAssessment(e.target.value)
    onAnswerChange(question.id, e.target.value, { file, fileName, numPages, annotations })
  }

  useEffect(() => {
    // If initial question data exists, populate state
    if (question.document) {
      setFile(question.document.file || null)
      setFileName(question.document.fileName || "")
      setNumPages(question.document.numPages || null)
      setAnnotations(question.document.annotations || [])
    }
    if (question.answer) {
      setOverallAssessment(question.answer as string)
    }
  }, [question])

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Overall Document Assessment</CardTitle>
          <CardDescription>Provide a summary of your findings for this document.</CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            value={overallAssessment}
            onChange={handleOverallAssessmentChange}
            placeholder="e.g., Rulebook is comprehensive but lacks clear version control. Several DLP policies are outdated..."
            className="min-h-[100px]"
          />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Document Upload & View</CardTitle>
          </CardHeader>
          <CardContent>
            {!file ? (
              <div
                {...getRootProps()}
                className={`p-8 border-2 border-dashed rounded-lg text-center cursor-pointer
                  ${isDragActive ? "border-primary bg-primary/10" : "border-muted-foreground/50 hover:border-primary/80"}`}
              >
                <input {...getInputProps()} />
                <UploadCloud className="mx-auto h-12 w-12 text-muted-foreground mb-2" />
                {isDragActive ? (
                  <p>Drop the PDF here ...</p>
                ) : (
                  <p>Drag 'n' drop a PDF file here, or click to select file</p>
                )}
                <p className="text-xs text-muted-foreground mt-1">PDF files only</p>
              </div>
            ) : (
              <div>
                <div className="flex justify-between items-center mb-2 p-2 border rounded-md bg-muted/50">
                  <div className="flex items-center space-x-2">
                    <FileText className="h-5 w-5 text-primary" />
                    <span className="text-sm font-medium">{fileName}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setFile(null)
                      setFileName("")
                      setNumPages(null)
                      setAnnotations([])
                      onAnswerChange(question.id, overallAssessment, {
                        file: null,
                        fileName: "",
                        numPages: null,
                        annotations: [],
                      })
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                <div className="border rounded-md overflow-hidden">
                  <Document
                    file={file}
                    onLoadSuccess={onDocumentLoadSuccess}
                    onLoadError={(error) => console.error("Error loading PDF:", error)}
                  >
                    <Page
                      pageNumber={currentPage}
                      width={window.innerWidth > 768 ? window.innerWidth / 2 - 80 : window.innerWidth - 80}
                    />
                  </Document>
                </div>

                {numPages && (
                  <div className="flex items-center justify-center space-x-2 mt-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage <= 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="text-sm">
                      Page {currentPage} of {numPages}
                    </span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setCurrentPage(Math.min(numPages, currentPage + 1))}
                      disabled={currentPage >= numPages}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Annotations & Issues</CardTitle>
            <CardDescription>Log specific findings for page {currentPage} (or general document notes).</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="annotation-text">Note for Page {currentPage}:</Label>
              <Textarea
                id="annotation-text"
                value={currentAnnotationText}
                onChange={(e) => setCurrentAnnotationText(e.target.value)}
                placeholder="Describe the issue, observation, or gap..."
                className="min-h-[80px]"
              />
            </div>
            <div>
              <Label htmlFor="annotation-tags">Tags (optional):</Label>
              <div className="flex items-center space-x-2">
                <Input
                  id="annotation-tags"
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      addTag()
                    }
                  }}
                  placeholder="e.g., Security, Compliance"
                  className="flex-grow"
                />
                <Button type="button" variant="outline" size="sm" onClick={addTag}>
                  <PlusCircle className="h-4 w-4 mr-1" /> Add Tag
                </Button>
              </div>
              <div className="mt-2 space-x-1 space-y-1">
                {currentAnnotationTags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="group">
                    {tag}
                    <X
                      className="ml-1 h-3 w-3 cursor-pointer group-hover:text-destructive"
                      onClick={() => removeTag(tag)}
                    />
                  </Badge>
                ))}
              </div>
            </div>
            <Button onClick={addAnnotation} className="w-full" disabled={!file}>
              <PlusCircle className="mr-2 h-4 w-4" /> Add Annotation for Page {currentPage}
            </Button>

            <div className="mt-4 space-y-3 max-h-60 overflow-y-auto">
              <h4 className="text-sm font-semibold">Logged Annotations:</h4>
              {annotations.length === 0 && <p className="text-xs text-muted-foreground">No annotations added yet.</p>}
              {annotations.map((ann, index) => (
                <div key={index} className="p-2 border rounded-md bg-muted/30 text-xs">
                  <div className="flex justify-between items-start">
                    <p className="font-semibold">
                      Page {ann.page}: <span className="font-normal">{ann.text}</span>
                    </p>
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => removeAnnotation(index)}>
                      <Trash2 className="h-3 w-3 text-destructive" />
                    </Button>
                  </div>
                  {ann.tags.length > 0 && (
                    <div className="mt-1 space-x-1">
                      {ann.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
