"use client"

import { useState, useEffect, useCallback, useTransition } from "react"
import { useDropzone } from "react-dropzone"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { UploadCloud, FileText, Trash2, Loader2, ExternalLink, MessageSquarePlus, AlertCircle } from "lucide-react"
import { format } from "date-fns"
import type { Evidence } from "@/lib/types"
import { addQuestionEvidence, deleteQuestionEvidence, getEvidenceForQuestion } from "@/app/actions"
import { useAssessmentStore } from "@/store/assessment-store"
import { useToast } from "@/hooks/use-toast"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface EvidenceManagerProps {
  projectName: string
  questionId: string
  standardSlug: string
  initialEvidence: Evidence[]
}

export function EvidenceManager({ projectName, questionId, standardSlug, initialEvidence }: EvidenceManagerProps) {
  const [evidence, setEvidence] = useState<Evidence[]>(initialEvidence)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [snippet, setSnippet] = useState("")
  const [isPending, startTransition] = useTransition()
  const { setAnswer } = useAssessmentStore()
  const { toast } = useToast()

  const fetchEvidence = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    const { evidence: fetchedEvidence, error: fetchError } = await getEvidenceForQuestion(projectName, questionId)
    if (fetchError) {
      setError(fetchError)
    } else {
      setEvidence(fetchedEvidence)
    }
    setIsLoading(false)
  }, [projectName, questionId])

  useEffect(() => {
    fetchEvidence()
  }, [fetchEvidence])

  const updateStore = (updatedEvidence: Evidence[]) => {
    setAnswer({
      standardSlug,
      questionId,
      evidence: updatedEvidence,
    })
  }

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      acceptedFiles.forEach((file) => {
        startTransition(async () => {
          const formData = new FormData()
          formData.append("file", file)
          formData.append("projectName", projectName)
          formData.append("questionId", questionId)
          formData.append("type", "file")
          const result = await addQuestionEvidence(formData)
          if (result.error) {
            toast({ title: "Upload Failed", description: result.error, variant: "destructive" })
          } else if (result.newEvidence) {
            const updatedEvidence = [...evidence, result.newEvidence]
            setEvidence(updatedEvidence)
            updateStore(updatedEvidence)
            toast({ title: "Evidence Added", description: `${file.name} has been uploaded.` })
          }
        })
      })
    },
    [projectName, questionId, evidence, startTransition, toast],
  )

  const handleAddSnippet = () => {
    if (!snippet.trim()) return
    startTransition(async () => {
      const formData = new FormData()
      formData.append("projectName", projectName)
      formData.append("questionId", questionId)
      formData.append("type", "snippet")
      formData.append("content", snippet.trim())
      const result = await addQuestionEvidence(formData)
      if (result.error) {
        toast({ title: "Failed to Add Snippet", description: result.error, variant: "destructive" })
      } else if (result.newEvidence) {
        const updatedEvidence = [...evidence, result.newEvidence]
        setEvidence(updatedEvidence)
        updateStore(updatedEvidence)
        setSnippet("")
        toast({ title: "Snippet Added", description: "Your text evidence has been saved." })
      }
    })
  }

  const handleDelete = (evidenceId: string) => {
    if (confirm("Are you sure you want to delete this piece of evidence?")) {
      startTransition(async () => {
        const result = await deleteQuestionEvidence(evidenceId)
        if (result.error) {
          toast({ title: "Deletion Failed", description: result.error, variant: "destructive" })
        } else {
          const updatedEvidence = evidence.filter((e) => e.id !== evidenceId)
          setEvidence(updatedEvidence)
          updateStore(updatedEvidence)
          toast({ title: "Evidence Removed", description: "The piece of evidence has been deleted." })
        }
      })
    }
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    disabled: isPending || !!error,
  })

  const isImage = (url?: string) => url && /\.(jpg|jpeg|png|gif|svg)$/i.test(url)

  return (
    <div className="mt-6 border-t pt-4">
      <h4 className="text-md font-semibold mb-2">Evidence Locker</h4>
      <div className="space-y-4">
        {/* Snippet Input */}
        <div className="space-y-2">
          <Textarea
            placeholder="Add a code snippet, configuration, or text evidence..."
            value={snippet}
            onChange={(e) => setSnippet(e.target.value)}
            className="min-h-[80px] text-xs font-mono"
            disabled={isPending || !!error}
          />
          <Button onClick={handleAddSnippet} disabled={isPending || !snippet.trim() || !!error} size="sm">
            <MessageSquarePlus className="mr-2 h-4 w-4" />
            {isPending ? "Adding..." : "Add Snippet"}
          </Button>
        </div>

        {/* File Upload */}
        <div
          {...getRootProps()}
          className={`p-4 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors
            ${isDragActive ? "border-primary bg-primary/10" : "border-muted-foreground/50 hover:border-primary/80"}
            ${isPending || !!error ? "cursor-not-allowed bg-muted/50" : ""}`}
        >
          <input {...getInputProps()} />
          {isPending ? (
            <Loader2 className="mx-auto h-8 w-8 text-muted-foreground animate-spin" />
          ) : (
            <UploadCloud className="mx-auto h-8 w-8 text-muted-foreground" />
          )}
          <p className="text-sm mt-1">{isPending ? "Processing..." : "Drag and drop files, or click to upload"}</p>
        </div>

        {/* Evidence List */}
        <div className="space-y-2">
          {isLoading && <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />}

          {error && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Evidence Locker Unavailable</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {!isLoading && !error && evidence.length === 0 && (
            <p className="text-xs text-muted-foreground text-center py-2">No evidence provided yet.</p>
          )}

          {!error && (
            <ul className="space-y-2">
              {evidence.map((evi) => (
                <li key={evi.id} className="flex items-start justify-between p-2 border rounded-md bg-muted/50">
                  <div className="flex items-start space-x-3 overflow-hidden">
                    {evi.type === "file" ? (
                      <FileText className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
                    ) : (
                      <MessageSquarePlus className="h-5 w-5 text-indigo-500 flex-shrink-0 mt-1" />
                    )}
                    <div className="overflow-hidden">
                      {evi.type === "file" ? (
                        <>
                          <a
                            href={evi.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm font-medium hover:underline"
                            title={evi.content}
                          >
                            {evi.content} <ExternalLink className="inline-block h-3 w-3" />
                          </a>
                          {isImage(evi.url) && (
                            <img
                              src={evi.url || "/placeholder.svg"}
                              alt="Evidence screenshot"
                              className="mt-2 max-w-xs rounded-md border"
                            />
                          )}
                        </>
                      ) : (
                        <pre className="text-xs font-mono whitespace-pre-wrap bg-background p-2 rounded-md">
                          <code>{evi.content}</code>
                        </pre>
                      )}
                      <p className="text-xs text-muted-foreground mt-1">
                        Added: {format(new Date(evi.uploadedAt), "dd MMM yyyy, HH:mm")}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(evi.id)}
                    className="text-destructive hover:bg-destructive/10 h-7 w-7"
                    title="Remove evidence"
                    disabled={isPending}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
