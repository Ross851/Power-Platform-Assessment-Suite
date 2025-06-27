"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowUpDown, Calendar, Code, Search, FileCode } from "lucide-react"
import { useAssessmentStore } from "@/store/assessment-store"

interface CodeSnippetWithContext {
  snippet: any
  standardName: string
  standardSlug: string
  questionText: string
  questionId: string
}

export function CodeSnippetsViewer() {
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest")
  const [filterLanguage, setFilterLanguage] = useState<string>("all")
  const [searchTerm, setSearchTerm] = useState("")
  
  const { getActiveProject } = useAssessmentStore()
  const activeProject = getActiveProject()

  // Collect all code snippets from all questions
  const allSnippets = useMemo(() => {
    if (!activeProject) return []
    
    const snippets: CodeSnippetWithContext[] = []
    
    activeProject.standards.forEach(standard => {
      standard.questions.forEach(question => {
        if (question.codeSnippetsList && question.codeSnippetsList.length > 0) {
          question.codeSnippetsList.forEach(snippet => {
            snippets.push({
              snippet,
              standardName: standard.name,
              standardSlug: standard.slug,
              questionText: question.text,
              questionId: question.id
            })
          })
        }
      })
    })
    
    return snippets
  }, [activeProject])

  // Get unique languages for filter
  const languages = useMemo(() => {
    const langs = new Set<string>()
    allSnippets.forEach(({ snippet }) => {
      if (snippet.language) langs.add(snippet.language)
    })
    return Array.from(langs).sort()
  }, [allSnippets])

  // Filter and sort snippets
  const filteredAndSortedSnippets = useMemo(() => {
    let filtered = allSnippets

    // Filter by language
    if (filterLanguage !== "all") {
      filtered = filtered.filter(({ snippet }) => snippet.language === filterLanguage)
    }

    // Filter by search term
    if (searchTerm) {
      const search = searchTerm.toLowerCase()
      filtered = filtered.filter(({ snippet, questionText, standardName }) => 
        snippet.title?.toLowerCase().includes(search) ||
        snippet.code?.toLowerCase().includes(search) ||
        snippet.description?.toLowerCase().includes(search) ||
        questionText.toLowerCase().includes(search) ||
        standardName.toLowerCase().includes(search)
      )
    }

    // Sort by date
    return filtered.sort((a, b) => {
      const dateA = new Date(a.snippet.updatedAt || a.snippet.createdAt).getTime()
      const dateB = new Date(b.snippet.updatedAt || b.snippet.createdAt).getTime()
      return sortOrder === "newest" ? dateB - dateA : dateA - dateB
    })
  }, [allSnippets, filterLanguage, searchTerm, sortOrder])

  if (!activeProject) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-muted-foreground">No active project selected</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileCode className="h-5 w-5" />
            Code Snippets Timeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search snippets..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <Select value={filterLanguage} onValueChange={setFilterLanguage}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All languages" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All languages</SelectItem>
                {languages.map(lang => (
                  <SelectItem key={lang} value={lang}>{lang}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              onClick={() => setSortOrder(sortOrder === "newest" ? "oldest" : "newest")}
              className="gap-2"
            >
              <ArrowUpDown className="h-4 w-4" />
              {sortOrder === "newest" ? "Newest First" : "Oldest First"}
            </Button>
          </div>

          <div className="text-sm text-muted-foreground mb-4">
            Found {filteredAndSortedSnippets.length} code snippet{filteredAndSortedSnippets.length !== 1 ? 's' : ''}
          </div>

          {filteredAndSortedSnippets.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center text-muted-foreground">
                {searchTerm || filterLanguage !== "all" 
                  ? "No snippets match your filters" 
                  : "No code snippets added yet"}
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredAndSortedSnippets.map(({ snippet, standardName, standardSlug, questionText }, index) => {
                const createdDate = new Date(snippet.createdAt)
                const updatedDate = snippet.updatedAt ? new Date(snippet.updatedAt) : null
                const displayDate = updatedDate || createdDate
                
                return (
                  <Card key={`${snippet.id}-${index}`} className="overflow-hidden">
                    <div className="p-4">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
                        <div className="flex-1">
                          <h3 className="font-medium text-lg">
                            {snippet.title || "Untitled Snippet"}
                          </h3>
                          <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            <span>
                              {displayDate.toLocaleDateString()} at {displayDate.toLocaleTimeString()}
                              {updatedDate && " (updated)"}
                            </span>
                            {snippet.author && (
                              <>
                                <span>•</span>
                                <span>by {snippet.author}</span>
                              </>
                            )}
                          </div>
                        </div>
                        <Badge variant="outline">{snippet.language || "code"}</Badge>
                      </div>

                      <div className="text-sm text-muted-foreground mb-3">
                        <div className="font-medium">{standardName}</div>
                        <div className="text-xs mt-1">{questionText}</div>
                      </div>

                      {snippet.description && (
                        <p className="text-sm mb-3">{snippet.description}</p>
                      )}

                      <pre className="bg-muted p-3 rounded-md overflow-x-auto">
                        <code className="text-xs">{snippet.code}</code>
                      </pre>

                      <div className="mt-3 pt-3 border-t">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            // Navigate to the specific question
                            window.location.href = `/assessment/${standardSlug}#${questionText.slice(0, 20).replace(/\s+/g, '-').toLowerCase()}`
                          }}
                        >
                          View in Assessment
                        </Button>
                      </div>
                    </div>
                  </Card>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
} 