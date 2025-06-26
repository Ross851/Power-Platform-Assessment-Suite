"use client"

import { useCallback, useState } from "react"
import { useDropzone } from "react-dropzone"
import { useAssessmentStore } from "@/store/assessment-store"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { UploadCloud, FileText, Trash2, AlertCircle } from "lucide-react"
import { format } from "date-fns" // For formatting date

function formatBytes(bytes: number, decimals = 2) {
  if (bytes === 0) return "0 Bytes"
  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i]
}

export function GeneralDocumentation() {
  const { addGeneralDocument, removeGeneralDocument, getActiveProject } = useAssessmentStore()
  const activeProject = getActiveProject()
  const generalDocuments = activeProject ? activeProject.generalDocuments : []
  const [description, setDescription] = useState("")
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      acceptedFiles.forEach((file) => {
        addGeneralDocument(file, description)
      })
      setDescription("") // Reset description after upload
    },
    [addGeneralDocument, description],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    // You can specify accepted file types here, e.g.,
    // accept: { 'application/pdf': ['.pdf'], 'image/*': ['.jpeg', '.png'] }
  })

  if (!activeProject) {
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
          Upload relevant programme-level documents, policies, or architectural diagrams. These documents are available
          for the current session.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Textarea
            placeholder="Optional: Add a brief description for the file(s) you are about to upload..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="min-h-[60px]"
          />
          <div
            {...getRootProps()}
            className={`p-6 border-2 border-dashed rounded-lg text-center cursor-pointer
              ${isDragActive ? "border-primary bg-primary/10" : "border-muted-foreground/50 hover:border-primary/80"}`}
          >
            <input {...getInputProps()} />
            <UploadCloud className="mx-auto h-10 w-10 text-muted-foreground mb-2" />
            {isDragActive ? (
              <p>Drop the files here ...</p>
            ) : (
              <p>Drag 'n' drop some files here, or click to select files</p>
            )}
          </div>
        </div>

        {generalDocuments.length > 0 && (
          <div>
            <h4 className="text-md font-semibold mb-2">Uploaded Documents:</h4>
            <ul className="space-y-3">
              {generalDocuments.map((doc) => (
                <li
                  key={doc.id}
                  className="flex items-center justify-between p-3 border rounded-md bg-muted/50 hover:shadow-sm transition-shadow"
                >
                  <div className="flex items-center space-x-3 overflow-hidden">
                    <FileText className="h-6 w-6 text-primary flex-shrink-0" />
                    <div className="overflow-hidden">
                      <p className="text-sm font-medium truncate" title={doc.name}>
                        {doc.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatBytes(doc.size)} - Uploaded: {format(doc.uploadedAt, "dd MMM yyyy, HH:mm")}
                        {doc.file === null && (
                          <span className="ml-2 text-yellow-600 dark:text-yellow-400 text-xs flex items-center">
                            <AlertCircle className="h-3 w-3 mr-1" />
                            Re-upload required after session reload
                          </span>
                        )}
                      </p>
                      {doc.description && (
                        <p className="text-xs text-muted-foreground italic mt-0.5">Description: {doc.description}</p>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeGeneralDocument(doc.id)}
                    className="text-destructive hover:bg-destructive/10"
                    title="Remove document"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        )}
        {generalDocuments.length === 0 && (
          <p className="text-sm text-muted-foreground text-center">No general documents uploaded yet.</p>
        )}
      </CardContent>
    </Card>
  )
}
