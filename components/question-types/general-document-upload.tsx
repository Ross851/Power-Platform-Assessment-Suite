"use client"

import type React from "react"
import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { 
  UploadCloud, 
  FileText, 
  X, 
  PlusCircle, 
  Link, 
  Mail, 
  Image,
  File,
  ExternalLink
} from "lucide-react"
import type { TimestampedDocument } from "@/lib/types"

interface GeneralDocumentUploadProps {
  documents: TimestampedDocument[]
  onChange: (documents: TimestampedDocument[]) => void
}

export function GeneralDocumentUpload({ documents, onChange }: GeneralDocumentUploadProps) {
  const [isAddingLink, setIsAddingLink] = useState(false)
  const [linkForm, setLinkForm] = useState({
    url: "",
    title: "",
    description: ""
  })

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const newDocuments: TimestampedDocument[] = acceptedFiles.map((file) => ({
        id: `doc-${Date.now()}-${Math.random()}`,
        name: file.name,
        size: file.size,
        type: file.type,
        uploadDate: new Date(),
        description: getFileDescription(file),
      }))

      onChange([...documents, ...newDocuments])
    },
    [documents, onChange]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.bmp', '.svg'],
      'text/*': ['.txt', '.csv'],
      'message/rfc822': ['.eml', '.msg'], // Email files
      'application/vnd.ms-outlook': ['.msg'],
    },
  })

  const getFileDescription = (file: File): string => {
    if (file.type.includes('image')) return 'Screenshot/Image'
    if (file.type.includes('message') || file.name.endsWith('.eml') || file.name.endsWith('.msg')) return 'Email'
    if (file.type.includes('pdf')) return 'PDF Document'
    if (file.type.includes('word')) return 'Word Document'
    if (file.type.includes('excel')) return 'Spreadsheet'
    return 'Document'
  }

  const removeDocument = (id: string) => {
    onChange(documents.filter(doc => doc.id !== id))
  }

  const addLink = () => {
    if (linkForm.url.trim()) {
      const newDoc: TimestampedDocument = {
        id: `link-${Date.now()}`,
        name: linkForm.title || linkForm.url,
        size: 0,
        type: 'link',
        url: linkForm.url,
        uploadDate: new Date(),
        description: linkForm.description || 'External Link',
      }
      onChange([...documents, newDoc])
      setLinkForm({ url: "", title: "", description: "" })
      setIsAddingLink(false)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const getFileIcon = (doc: TimestampedDocument) => {
    if (doc.type === 'link') return <Link className="h-5 w-5" />
    if (doc.type.includes("pdf")) return <FileText className="h-5 w-5" />
    if (doc.type.includes("image")) return <Image className="h-5 w-5" />
    if (doc.type.includes("message") || doc.name.endsWith('.eml') || doc.name.endsWith('.msg')) return <Mail className="h-5 w-5" />
    return <File className="h-5 w-5" />
  }

  return (
    <div className="space-y-4">
      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
          isDragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50"
        }`}
      >
        <input {...getInputProps()} />
        <UploadCloud className="mx-auto h-10 w-10 text-muted-foreground mb-3" />
        {isDragActive ? (
          <p className="text-sm text-muted-foreground">Drop the files here...</p>
        ) : (
          <div>
            <p className="text-sm text-muted-foreground">
              Drag & drop files here, or click to select
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Supports: Documents, Screenshots, Emails (.eml, .msg), PDFs, and more
            </p>
          </div>
        )}
      </div>

      {/* Add Link Form */}
      {isAddingLink ? (
        <Card className="p-4 space-y-3">
          <Label className="text-sm font-medium">Add External Link</Label>
          <Input
            value={linkForm.url}
            onChange={(e) => setLinkForm({...linkForm, url: e.target.value})}
            placeholder="https://example.com/event-details"
            className="text-sm"
          />
          <Input
            value={linkForm.title}
            onChange={(e) => setLinkForm({...linkForm, title: e.target.value})}
            placeholder="Link title (optional)"
            className="text-sm"
          />
          <Textarea
            value={linkForm.description}
            onChange={(e) => setLinkForm({...linkForm, description: e.target.value})}
            placeholder="Description (optional)"
            className="text-sm min-h-[60px]"
          />
          <div className="flex gap-2">
            <Button size="sm" onClick={addLink} disabled={!linkForm.url.trim()}>
              Add Link
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setIsAddingLink(false)
                setLinkForm({ url: "", title: "", description: "" })
              }}
            >
              Cancel
            </Button>
          </div>
        </Card>
      ) : (
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsAddingLink(true)}
          className="w-full"
        >
          <Link className="h-4 w-4 mr-2" />
          Add Link to External Resource
        </Button>
      )}

      {/* Uploaded Documents */}
      {documents.length > 0 && (
        <div className="space-y-2">
          <Label className="text-sm font-medium">
            Evidence & Documents ({documents.length})
          </Label>
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="flex items-center justify-between p-3 border rounded-lg bg-muted/30"
            >
              <div className="flex items-center gap-3">
                <div className="text-muted-foreground">{getFileIcon(doc)}</div>
                <div className="flex-1">
                  <p className="text-sm font-medium">
                    {doc.type === 'link' ? (
                      <a
                        href={doc.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline dark:text-blue-400 inline-flex items-center gap-1"
                      >
                        {doc.name}
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    ) : (
                      doc.name
                    )}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {doc.description} • {new Date(doc.uploadDate).toLocaleDateString()}
                    {doc.size > 0 && ` • ${formatFileSize(doc.size)}`}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeDocument(doc.id)}
                className="h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
} 