'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { useAssessmentStore } from '@/store/assessment-store'
import { ClientOnly } from '@/components/client-only'
import { ErrorBoundary } from '@/components/error-boundary'
import Link from 'next/link'
import {
  ArrowLeft,
  FileText,
  Image,
  FileSpreadsheet,
  File,
  Search,
  Filter,
  Download,
  Calendar,
  FolderOpen,
  Eye
} from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface EvidenceItem {
  id: string
  fileName: string
  fileType: string
  uploadedAt: Date
  questionId: string
  questionText: string
  standardName: string
  projectName: string
  notes: string
}

export default function EvidencePage() {
  const { projects, activeProjectName } = useAssessmentStore()
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [filterProject, setFilterProject] = useState('all')
  const [evidenceItems, setEvidenceItems] = useState<EvidenceItem[]>([])

  // Extract all evidence from all projects
  useEffect(() => {
    const items: EvidenceItem[] = []
    
    projects.forEach(project => {
      project.assessmentStandards.forEach(standard => {
        standard.questions.forEach(question => {
          if (question.evidenceNotes && question.evidenceNotes.includes('Attached files:')) {
            // Parse the notes to extract file information
            const noteParts = question.evidenceNotes.split('\n\nAttached files: ')
            const notes = noteParts[0]
            const filesList = noteParts[1]?.split(', ') || []
            
            filesList.forEach((fileName, index) => {
              items.push({
                id: `${project.name}-${question.id}-${index}`,
                fileName: fileName.trim(),
                fileType: getFileType(fileName),
                uploadedAt: new Date(project.lastModifiedAt),
                questionId: question.id,
                questionText: question.text,
                standardName: standard.name,
                projectName: project.name,
                notes: notes
              })
            })
          }
        })
      })
    })
    
    setEvidenceItems(items)
  }, [projects])

  // Get file type from extension
  const getFileType = (fileName: string): string => {
    const ext = fileName.split('.').pop()?.toLowerCase() || ''
    const typeMap: Record<string, string> = {
      pdf: 'PDF',
      doc: 'Word',
      docx: 'Word',
      xls: 'Excel',
      xlsx: 'Excel',
      ppt: 'PowerPoint',
      pptx: 'PowerPoint',
      png: 'Image',
      jpg: 'Image',
      jpeg: 'Image',
      gif: 'Image'
    }
    return typeMap[ext] || 'File'
  }

  // Get file icon based on type
  const getFileIcon = (fileType: string) => {
    switch (fileType) {
      case 'PDF':
      case 'Word':
      case 'PowerPoint':
        return <FileText className="h-4 w-4" />
      case 'Excel':
        return <FileSpreadsheet className="h-4 w-4" />
      case 'Image':
        return <Image className="h-4 w-4" />
      default:
        return <File className="h-4 w-4" />
    }
  }

  // Filter evidence items
  const filteredItems = evidenceItems.filter(item => {
    const matchesSearch = 
      item.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.questionText.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.notes.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesType = filterType === 'all' || item.fileType === filterType
    const matchesProject = filterProject === 'all' || item.projectName === filterProject
    
    return matchesSearch && matchesType && matchesProject
  })

  // Get unique file types for filter
  const uniqueFileTypes = Array.from(new Set(evidenceItems.map(item => item.fileType)))

  return (
    <ErrorBoundary>
      <ClientOnly>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
          {/* Header */}
          <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
            <div className="container mx-auto px-4 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Link href="/">
                    <Button variant="ghost" size="sm">
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back to Home
                    </Button>
                  </Link>
                  <h1 className="text-2xl font-bold">Evidence Management</h1>
                </div>
                <Badge variant="outline" className="text-sm">
                  {evidenceItems.length} files uploaded
                </Badge>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="container mx-auto px-4 py-8">
            {/* Filters */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-lg">Search & Filter</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search files, questions, or notes..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                  
                  <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger>
                      <Filter className="mr-2 h-4 w-4" />
                      <SelectValue placeholder="All file types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All file types</SelectItem>
                      {uniqueFileTypes.map(type => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Select value={filterProject} onValueChange={setFilterProject}>
                    <SelectTrigger>
                      <FolderOpen className="mr-2 h-4 w-4" />
                      <SelectValue placeholder="All projects" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All projects</SelectItem>
                      {projects.map(project => (
                        <SelectItem key={project.name} value={project.name}>{project.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Button variant="outline" className="justify-start">
                    <Download className="mr-2 h-4 w-4" />
                    Export All
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Evidence Grid */}
            {filteredItems.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-lg font-medium mb-2">No evidence found</p>
                  <p className="text-sm text-muted-foreground">
                    {searchTerm || filterType !== 'all' || filterProject !== 'all' 
                      ? 'Try adjusting your filters' 
                      : 'Upload evidence files when answering assessment questions'}
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredItems.map(item => (
                  <Card key={item.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          {getFileIcon(item.fileType)}
                          <span className="font-medium text-sm truncate max-w-[200px]">
                            {item.fileName}
                          </span>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {item.fileType}
                        </Badge>
                      </div>
                      
                      <div className="space-y-2 text-sm">
                        <div>
                          <p className="text-muted-foreground text-xs">Project</p>
                          <p className="font-medium">{item.projectName}</p>
                        </div>
                        
                        <div>
                          <p className="text-muted-foreground text-xs">Question</p>
                          <p className="line-clamp-2">{item.questionText}</p>
                        </div>
                        
                        {item.notes && (
                          <div>
                            <p className="text-muted-foreground text-xs">Notes</p>
                            <p className="line-clamp-2 text-gray-600 dark:text-gray-400">
                              {item.notes}
                            </p>
                          </div>
                        )}
                        
                        <div className="flex items-center justify-between pt-2">
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            {item.uploadedAt.toLocaleDateString()}
                          </div>
                          <Button size="sm" variant="ghost">
                            <Eye className="h-3 w-3 mr-1" />
                            View
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </ClientOnly>
    </ErrorBoundary>
  )
}