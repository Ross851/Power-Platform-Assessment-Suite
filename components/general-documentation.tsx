"use client"

import { useState, useEffect, useCallback, useTransition } from "react"
import { useDropzone } from "react-dropzone"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { UploadCloud, FileText, Trash2, Loader2, ExternalLink } from "lucide-react"
import { format } from "date-fns"
import type { GeneralDocument } from "@/lib/types"
import { uploadDocument, deleteDocument, getDocumentsForProject } from "@/app/actions"

function formatBytes(bytes: number | null, decimals = 2) {
  if (bytes === null || bytes === 0) return "0 Bytes"
  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i]
}

interface GeneralDocumentationProps {
  projectName: string | null
}

export function GeneralDocumentation({ projectName }: GeneralDocumentationProps) {
  const [documents, setDocuments] = useState<GeneralDocument[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [description, setDescription] = useState("")
  const [isPending, startTransition] = useTransition()

  const fetchDocuments = useCallback(() => {
    if (projectName) {
      setIsLoading(true)
      getDocumentsForProject(projectName)
        .then(setDocuments)
        .finally(() => setIsLoading(false))
    } else {
      setDocuments([])
      setIsLoading(false)
    }
  }, [projectName])

  useEffect(() => {
    fetchDocuments()
  }, [fetchDocuments])

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (!projectName) return

      acceptedFiles.forEach((file) => {
        startTransition(async () => {
          const formData = new FormData()
          formData.append("file", file)
          formData.append("description", description)
          formData.append("projectName", projectName)
          const result = await uploadDocument(formData)
          if (result?.error) {
            alert(`Upload failed: ${result.error}`)
          } else {
            setDescription("")
            fetchDocuments() // Re-fetch documents after successful upload
          }
        })
      })
    },
    [projectName, description, fetchDocuments],
  )

  const handleDelete = (doc: GeneralDocument) => {
    if (confirm(`Are you sure you want to delete "${doc.name}"?`)) {
      startTransition(async () => {
        const result = await deleteDocument(doc.id, doc.file_path)
        if (result?.error) {
          alert(`Deletion failed: ${result.error}`)
        } else {
          fetchDocuments() // Re-fetch documents after successful delete
        }
      })
    }
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    disabled: !projectName || isPending,
  })

  if (!projectName) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>General Programme Documentation</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center">
            Please select or create a project to manage documents.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>General Programme Documentation</CardTitle>
        <CardDescription>
          Upload relevant programme-level documents, policies, or architectural diagrams. These are stored securely in
          your project's backend.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Textarea
            placeholder="Optional: Add a brief description for the file(s) you are about to upload..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="min-h-[60px]"
            disabled={isPending}
          />
          <div
            {...getRootProps()}
            className={`p-6 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors
              ${isDragActive ? "border-primary bg-primary/10" : "border-muted-foreground/50 hover:border-primary/80"}
              ${isPending ? "cursor-not-allowed bg-muted/50" : ""}`}
          >
            <input {...getInputProps()} />
            {isPending ? (
              <>
                <Loader2 className="mx-auto h-10 w-10 text-muted-foreground animate-spin mb-2" />
                <p>Uploading...</p>
              </>
            ) : (
              <>
                <UploadCloud className="mx-auto h-10 w-10 text-muted-foreground mb-2" />
                {isDragActive ? (
                  <p>Drop the files here ...</p>
                ) : (
                  <p>Drag 'n' drop some files here, or click to select files</p>
                )}
              </>
            )}
          </div>
        </div>

        <div>
          <h4 className="text-md font-semibold mb-2">Uploaded Documents:</h4>
          {isLoading ? (
            <div className="flex justify-center items-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : documents.length > 0 ? (
            <ul className="space-y-3">
              {documents.map((doc) => (
                <li
                  key={doc.id}
                  className="flex items-center justify-between p-3 border rounded-md bg-muted/50 hover:shadow-sm transition-shadow"
                >
                  <div className="flex items-center space-x-3 overflow-hidden">
                    <FileText className="h-6 w-6 text-primary flex-shrink-0" />
                    <div className="overflow-hidden">
                      <a
                        href={doc.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-medium truncate hover:underline"
                        title={doc.name}
                      >
                        {doc.name} <ExternalLink className="inline-block h-3 w-3 ml-1" />
                      </a>
                      <p className="text-xs text-muted-foreground">
                        {formatBytes(doc.size)} - Uploaded: {format(new Date(doc.uploaded_at), "dd MMM yyyy, HH:mm")}
                      </p>
                      {doc.description && (
                        <p className="text-xs text-muted-foreground italic mt-0.5">Description: {doc.description}</p>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(doc)}
                    className="text-destructive hover:bg-destructive/10"
                    title="Remove document"
                    disabled={isPending}
                  >
                    {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                  </Button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">No general documents uploaded yet.</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
