"use client"

import type React from "react"
import type { Question } from "@/lib/types"
import { BooleanInput } from "./question-types/boolean-input"
import { ScaleInput } from "./question-types/scale-input"
import { PercentageInput } from "./question-types/percentage-input"
import { TextInput } from "./question-types/text-input"
import { NumericInput } from "./question-types/numeric-input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"
import { DocumentReviewInput } from "./question-types/document-review-input"
import { RAGIndicator } from "./rag-indicator"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Info, Lightbulb, ExternalLink, XCircle, Code, MessageSquare, FileCode, Users, PlusCircle, X, FileText, Link, Image, Mail } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { NotApplicableGuidance } from "./not-applicable-guidance"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { GeneralDocumentUpload } from "./question-types/general-document-upload"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { AlertCircle } from "lucide-react"

interface QuestionDisplayProps {
  question: Question
  onAnswerChange: (questionId: string, mainAnswer: any, additionalData?: string | object, riskOwner?: string) => void
}

export function QuestionDisplay({ question, onAnswerChange }: QuestionDisplayProps) {
  const [evidenceNotes, setEvidenceNotes] = useState(question.evidenceNotes || "")
  const [riskOwnerInput, setRiskOwnerInput] = useState(question.riskOwner || "")
  const [isNotApplicable, setIsNotApplicable] = useState(question.isNotApplicable || false)
  const [adoptionTimeline, setAdoptionTimeline] = useState(question.adoptionTimeline || "")
  const [codeSnippets, setCodeSnippets] = useState(question.codeSnippets || "")
  const [developerFeedback, setDeveloperFeedback] = useState(question.developerFeedback || "")
  const [developerRecommendations, setDeveloperRecommendations] = useState(question.developerRecommendations || "")
  const [documentData, setDocumentData] = useState({
    ...question.document,
    codeSnippetsList: question.codeSnippetsList || [],
    developerFeedbackList: question.developerFeedbackList || [],
    developerRecommendationsList: question.developerRecommendationsList || [],
    documentsList: question.documentsList || [],
    isNotApplicable: question.isNotApplicable || false,
    adoptionTimeline: question.adoptionTimeline || "",
  })
  
  // New states for managing code snippets
  const [isAddingSnippet, setIsAddingSnippet] = useState(false)
  const [editingSnippetId, setEditingSnippetId] = useState<string | null>(null)
  const [snippetForm, setSnippetForm] = useState({
    title: "",
    code: "",
    language: "powershell",
    description: ""
  })

  const [showAllSnippets, setShowAllSnippets] = useState(false)
  const [showAllDocuments, setShowAllDocuments] = useState(false)

  const handleEvidenceChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newEvidence = e.target.value
    setEvidenceNotes(newEvidence)
    if (question.type === "document-review") {
      onAnswerChange(
        question.id,
        question.answer,
        { ...(question.document || {}), evidenceNotes: newEvidence },
        riskOwnerInput,
      )
    } else {
      onAnswerChange(question.id, question.answer, newEvidence, riskOwnerInput)
    }
  }

  const handleCodeSnippetsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newCodeSnippets = e.target.value
    setCodeSnippets(newCodeSnippets)
    const updatedData = {
      codeSnippets: newCodeSnippets,
      developerFeedback,
      developerRecommendations,
      evidenceNotes: evidenceNotes
    }
    onAnswerChange(question.id, question.answer, updatedData, riskOwnerInput)
  }

  const handleDeveloperFeedbackChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newFeedback = e.target.value
    setDeveloperFeedback(newFeedback)
    const updatedData = {
      codeSnippets,
      developerFeedback: newFeedback,
      developerRecommendations,
      evidenceNotes: evidenceNotes
    }
    onAnswerChange(question.id, question.answer, updatedData, riskOwnerInput)
  }

  const handleDeveloperRecommendationsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newRecommendations = e.target.value
    setDeveloperRecommendations(newRecommendations)
    const updatedData = {
      codeSnippets,
      developerFeedback,
      developerRecommendations: newRecommendations,
      evidenceNotes: evidenceNotes
    }
    onAnswerChange(question.id, question.answer, updatedData, riskOwnerInput)
  }

  const handleMainAnswerChange = (mainAnswer: any, additionalData?: string | object) => {
    if (question.type === "document-review") {
      const docDataWithEvidence = {
        ...((additionalData as object) || question.document || {}),
        evidenceNotes: evidenceNotes,
        codeSnippets,
        codeSnippetsList: (additionalData as any)?.codeSnippetsList || documentData.codeSnippetsList || question.codeSnippetsList || [],
        developerFeedback,
        developerFeedbackList: (additionalData as any)?.developerFeedbackList || documentData.developerFeedbackList || question.developerFeedbackList || [],
        developerRecommendations,
        developerRecommendationsList: (additionalData as any)?.developerRecommendationsList || documentData.developerRecommendationsList || question.developerRecommendationsList || [],
        documentsList: (additionalData as any)?.documentsList || documentData.documentsList || question.documentsList || []
      }
      onAnswerChange(question.id, mainAnswer, docDataWithEvidence, riskOwnerInput)
    } else {
      const updatedData = {
        evidenceNotes: evidenceNotes,
        codeSnippets,
        codeSnippetsList: (additionalData as any)?.codeSnippetsList || documentData.codeSnippetsList || question.codeSnippetsList || [],
        developerFeedback,
        developerFeedbackList: (additionalData as any)?.developerFeedbackList || documentData.developerFeedbackList || question.developerFeedbackList || [],
        developerRecommendations,
        developerRecommendationsList: (additionalData as any)?.developerRecommendationsList || documentData.developerRecommendationsList || question.developerRecommendationsList || [],
        documentsList: (additionalData as any)?.documentsList || documentData.documentsList || question.documentsList || []
      }
      onAnswerChange(question.id, mainAnswer, updatedData, riskOwnerInput)
    }
  }

  const handleRiskOwnerBlur = () => {
    if (riskOwnerInput !== (question.riskOwner || "")) {
      if (question.type === "document-review") {
        onAnswerChange(
          question.id,
          question.answer,
          { 
            ...(question.document || {}), 
            evidenceNotes: evidenceNotes, 
            codeSnippets, 
            codeSnippetsList: documentData.codeSnippetsList || question.codeSnippetsList || [],
            developerFeedback, 
            developerFeedbackList: documentData.developerFeedbackList || question.developerFeedbackList || [],
            developerRecommendations,
            developerRecommendationsList: documentData.developerRecommendationsList || question.developerRecommendationsList || [],
            documentsList: documentData.documentsList || question.documentsList || []
          },
          riskOwnerInput,
        )
      } else {
        const updatedData = {
          evidenceNotes: evidenceNotes,
          codeSnippets,
          codeSnippetsList: documentData.codeSnippetsList || question.codeSnippetsList || [],
          developerFeedback,
          developerFeedbackList: documentData.developerFeedbackList || question.developerFeedbackList || [],
          developerRecommendations,
          developerRecommendationsList: documentData.developerRecommendationsList || question.developerRecommendationsList || [],
          documentsList: documentData.documentsList || question.documentsList || []
        }
        onAnswerChange(question.id, question.answer, updatedData, riskOwnerInput)
      }
    }
  }

  const handleNotApplicableChange = (checked: boolean) => {
    setIsNotApplicable(checked)
    // When marking as not applicable, update the answer
    const updatedData = {
      isNotApplicable: checked,
      adoptionTimeline: adoptionTimeline,
      evidenceNotes: evidenceNotes,
      codeSnippets,
      codeSnippetsList: documentData.codeSnippetsList || question.codeSnippetsList || [],
      developerFeedback,
      developerFeedbackList: documentData.developerFeedbackList || question.developerFeedbackList || [],
      developerRecommendations,
      developerRecommendationsList: documentData.developerRecommendationsList || question.developerRecommendationsList || [],
      documentsList: documentData.documentsList || question.documentsList || []
    }
    onAnswerChange(question.id, checked ? "not-applicable" : undefined, updatedData, riskOwnerInput)
  }

  const handleAdoptionTimelineUpdate = (timeline: string) => {
    setAdoptionTimeline(timeline)
    const updatedData = {
      isNotApplicable: true,
      adoptionTimeline: timeline,
      evidenceNotes: evidenceNotes,
      codeSnippets,
      codeSnippetsList: documentData.codeSnippetsList || question.codeSnippetsList || [],
      developerFeedback,
      developerFeedbackList: documentData.developerFeedbackList || question.developerFeedbackList || [],
      developerRecommendations,
      developerRecommendationsList: documentData.developerRecommendationsList || question.developerRecommendationsList || [],
      documentsList: documentData.documentsList || question.documentsList || []
    }
    onAnswerChange(question.id, "not-applicable", updatedData, riskOwnerInput)
  }

  const handleDocumentDataChange = (value: any) => {
    setDocumentData(value)
    handleMainAnswerChange(value, value)
  }

  const renderQuestionInput = () => {
    if (isNotApplicable) {
      return (
        <div className="space-y-4">
          <Alert>
            <XCircle className="h-4 w-4" />
            <AlertDescription>
              This feature/area is not currently used in your organization.
            </AlertDescription>
          </Alert>
          
          {question.notApplicableGuidance && (
            <Alert className="border-blue-200 bg-blue-50 dark:bg-blue-950">
              <Lightbulb className="h-4 w-4" />
              <AlertDescription>
                {question.notApplicableGuidance}
              </AlertDescription>
            </Alert>
          )}

          {/* Show specific guidance based on the question category */}
          <NotApplicableGuidance 
            area={getAreaFromQuestion(question)} 
            onReadinessUpdate={handleAdoptionTimelineUpdate}
          />
        </div>
      )
    }

    switch (question.type) {
      case "boolean":
        return <BooleanInput question={question} onAnswerChange={handleMainAnswerChange} />
      case "scale":
        return <ScaleInput question={question} onAnswerChange={handleMainAnswerChange} />
      case "percentage":
        return <PercentageInput question={question} onAnswerChange={handleMainAnswerChange} />
      case "text":
        return <TextInput question={question} onAnswerChange={handleMainAnswerChange} />
      case "numeric":
        return <NumericInput question={question} onAnswerChange={handleMainAnswerChange} />
      case "document-review":
        return (
          <DocumentReviewInput
            question={question}
            value={documentData}
            onChange={(value) => handleDocumentDataChange(value)}
          />
        )
      default:
        return <p>Unsupported question type: {question.type}</p>
    }
  }

  // Scoring criteria component
  const ScoringCriteria = () => {
    const getCriteriaForType = () => {
      switch (question.type) {
        case "boolean":
          return (
            <div className="space-y-2 text-sm">
              <div className="flex items-start gap-2">
                <Badge className="bg-green-100 text-green-800">100%</Badge>
                <span>Yes - Feature is fully implemented and documented</span>
              </div>
              <div className="flex items-start gap-2">
                <Badge className="bg-red-100 text-red-800">0%</Badge>
                <span>No - Feature is not implemented</span>
              </div>
            </div>
          )
        case "percentage":
          return (
            <div className="space-y-2 text-sm">
              <div className="flex items-start gap-2">
                <Badge className="bg-green-100 text-green-800">76-100%</Badge>
                <span className="font-medium">Excellent:</span>
                <span>Comprehensive implementation with minimal gaps</span>
              </div>
              <div className="flex items-start gap-2">
                <Badge className="bg-blue-100 text-blue-800">51-75%</Badge>
                <span className="font-medium">Good:</span>
                <span>Well-established with some areas for improvement</span>
              </div>
              <div className="flex items-start gap-2">
                <Badge className="bg-yellow-100 text-yellow-800">26-50%</Badge>
                <span className="font-medium">Average:</span>
                <span>Basic implementation with significant gaps</span>
              </div>
              <div className="flex items-start gap-2">
                <Badge className="bg-red-100 text-red-800">0-25%</Badge>
                <span className="font-medium">Poor:</span>
                <span>Minimal or no implementation</span>
              </div>
            </div>
          )
        case "scale":
          return (
            <div className="space-y-2 text-sm">
              <div className="flex items-start gap-2">
                <Badge className="bg-green-100 text-green-800">5</Badge>
                <span className="font-medium">Excellent:</span>
                <span>Fully mature, optimized, and continuously improving</span>
              </div>
              <div className="flex items-start gap-2">
                <Badge className="bg-blue-100 text-blue-800">4</Badge>
                <span className="font-medium">Good:</span>
                <span>Well-established with minor improvements needed</span>
              </div>
              <div className="flex items-start gap-2">
                <Badge className="bg-yellow-100 text-yellow-800">3</Badge>
                <span className="font-medium">Average:</span>
                <span>Functional but requires significant improvements</span>
              </div>
              <div className="flex items-start gap-2">
                <Badge className="bg-orange-100 text-orange-800">2</Badge>
                <span className="font-medium">Below Average:</span>
                <span>Basic implementation with major gaps</span>
              </div>
              <div className="flex items-start gap-2">
                <Badge className="bg-red-100 text-red-800">1</Badge>
                <span className="font-medium">Poor:</span>
                <span>Minimal or no implementation</span>
              </div>
            </div>
          )
        case "numeric":
          return (
            <div className="space-y-2 text-sm">
              <p className="text-muted-foreground">
                Score based on the numeric value relative to industry standards and best practices for this metric.
              </p>
              <div className="space-y-1">
                <div className="flex items-start gap-2">
                  <Badge className="bg-green-100 text-green-800">High</Badge>
                  <span>Above industry standards</span>
                </div>
                <div className="flex items-start gap-2">
                  <Badge className="bg-yellow-100 text-yellow-800">Medium</Badge>
                  <span>Meets industry standards</span>
                </div>
                <div className="flex items-start gap-2">
                  <Badge className="bg-red-100 text-red-800">Low</Badge>
                  <span>Below industry standards</span>
                </div>
              </div>
            </div>
          )
        default:
          return (
            <div className="text-sm text-muted-foreground">
              <p>Evaluate based on completeness, quality, and alignment with best practices.</p>
            </div>
          )
      }
    }

    return (
      <Collapsible className="mb-4">
        <CollapsibleTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            <Info className="h-4 w-4" />
            Scoring Criteria
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-3">
          <Card className="bg-muted/50">
            <CardContent className="pt-4">
              {getCriteriaForType()}
            </CardContent>
          </Card>
        </CollapsibleContent>
      </Collapsible>
    )
  }

  return (
    <div className="p-4 md:p-6 border rounded-lg shadow-sm bg-card">
      <div className="flex justify-between items-start mb-1">
        <Label htmlFor={question.id} className="text-lg font-semibold block flex-1 pr-2">
          {question.text}
        </Label>
        <div className="flex items-center space-x-2">
          {question.guidance && (
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-primary">
                  <Info className="h-4 w-4" />
                  <span className="sr-only">Show guidance</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 text-sm" side="top" align="end">
                <p className="font-medium mb-1">Guidance:</p>
                {question.guidance}
              </PopoverContent>
            </Popover>
          )}
          <RAGIndicator status={isNotApplicable ? "not-applicable" : question.ragStatus} size="md" />
        </div>
      </div>
      <p className="text-xs text-muted-foreground mb-3">
        Category: {question.category} | Weight: {question.weight}
      </p>

      {/* Add Scoring Criteria */}
      <ScoringCriteria />

      <div className="mb-4 space-y-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            id={`${question.id}-not-applicable`}
            checked={isNotApplicable}
            onCheckedChange={handleNotApplicableChange}
          />
          <Label
            htmlFor={`${question.id}-not-applicable`}
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Not applicable - we don&apos;t use this feature/area yet
          </Label>
        </div>

        {renderQuestionInput()}
      </div>

      {!isNotApplicable && question.type !== "document-review" && (
        <div>
          <div className="flex items-center justify-between mb-1">
            <Label htmlFor={`${question.id}-evidence`} className="text-sm font-medium text-muted-foreground">
            Observations / Evidence (Optional)
          </Label>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              {(question.codeSnippetsList?.length || 0) > 0 && (
                <Badge variant="outline" className="text-xs">
                  <Code className="h-3 w-3 mr-1" />
                  {question.codeSnippetsList?.length} snippet{question.codeSnippetsList?.length !== 1 ? 's' : ''}
                </Badge>
              )}
              {(question.developerFeedbackList?.length || 0) > 0 && (
                <Badge variant="outline" className="text-xs">
                  <MessageSquare className="h-3 w-3 mr-1" />
                  {question.developerFeedbackList?.length} feedback
                </Badge>
              )}
              {(question.documentsList?.length || 0) > 0 && (
                <Badge variant="outline" className="text-xs">
                  <FileText className="h-3 w-3 mr-1" />
                  {question.documentsList?.length} doc{question.documentsList?.length !== 1 ? 's' : ''}
                </Badge>
              )}
            </div>
          </div>
          <Textarea
            id={`${question.id}-evidence`}
            value={evidenceNotes}
            onChange={handleEvidenceChange}
            placeholder="Enter any observations, links to documentation, or evidence..."
            className="min-h-[100px]"
          />
        </div>
      )}

      {/* Code Snippets Display - Always visible in main area */}
      {question.codeSnippetsList && question.codeSnippetsList.length > 0 && (
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <Label className="text-sm font-medium flex items-center gap-2">
              <Code className="h-4 w-4" />
              Code Snippets ({question.codeSnippetsList.length})
            </Label>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAllSnippets(!showAllSnippets)}
            >
              {showAllSnippets ? "Show Less" : "Show All"}
            </Button>
          </div>
          <div className="space-y-2">
            {(showAllSnippets ? question.codeSnippetsList : question.codeSnippetsList.slice(0, 2)).map((snippet, index) => (
              <Card key={snippet.id} className="p-3 bg-muted/30">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="text-sm font-medium">{snippet.title || `Code Snippet ${index + 1}`}</h4>
                    <p className="text-xs text-muted-foreground">
                      {new Date(snippet.createdAt).toLocaleDateString()} at {new Date(snippet.createdAt).toLocaleTimeString()}
                      {snippet.author && ` by ${snippet.author}`}
                    </p>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {snippet.language || 'code'}
                  </Badge>
                </div>
                {snippet.description && (
                  <p className="text-xs text-muted-foreground mb-2">{snippet.description}</p>
                )}
                <pre className="bg-background p-2 rounded text-xs overflow-x-auto max-h-32 overflow-y-auto">
                  <code>{snippet.code}</code>
                </pre>
              </Card>
            ))}
            {!showAllSnippets && question.codeSnippetsList.length > 2 && (
              <p className="text-xs text-muted-foreground text-center">
                +{question.codeSnippetsList.length - 2} more snippet{question.codeSnippetsList.length - 2 > 1 ? 's' : ''}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Documents & Links Display - Always visible in main area */}
      {question.documentsList && question.documentsList.length > 0 && (
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <Label className="text-sm font-medium flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Documents & Evidence ({question.documentsList.length})
            </Label>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAllDocuments(!showAllDocuments)}
            >
              {showAllDocuments ? "Show Less" : "Show All"}
            </Button>
          </div>
          <div className="space-y-2">
            {(showAllDocuments ? question.documentsList : question.documentsList.slice(0, 3)).map((doc) => (
              <Card key={doc.id} className="p-3 bg-muted/30">
                <div className="flex items-center gap-3">
                  <div className="text-muted-foreground">
                    {doc.type === 'link' ? <Link className="h-4 w-4" /> :
                     doc.type.includes('image') ? <Image className="h-4 w-4" /> :
                     doc.type.includes('message') || doc.name.endsWith('.eml') || doc.name.endsWith('.msg') ? <Mail className="h-4 w-4" /> :
                     <FileText className="h-4 w-4" />}
                  </div>
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
                    </p>
                  </div>
                </div>
              </Card>
            ))}
            {!showAllDocuments && question.documentsList.length > 3 && (
              <p className="text-xs text-muted-foreground text-center">
                +{question.documentsList.length - 3} more document{question.documentsList.length - 3 > 1 ? 's' : ''}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Developer Documentation Section */}
      {!isNotApplicable && (
        <Card className="mt-4">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Code className="h-4 w-4" />
              Developer Documentation
            </CardTitle>
            <CardDescription>
              Document code examples, findings, and recommendations for other developers
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="snippets" className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="evidence">Evidence</TabsTrigger>
                <TabsTrigger value="snippets">
                  <Code className="h-3 w-3 mr-1" />
                  Manage Code
                  {(question.codeSnippetsList?.length || 0) > 0 && (
                    <Badge variant="secondary" className="ml-1 h-4 px-1 text-xs">
                      {question.codeSnippetsList?.length}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="feedback">
                  <MessageSquare className="h-3 w-3 mr-1" />
                  Feedback
                  {(question.developerFeedbackList?.filter(f => f.type === 'finding').length || 0) > 0 && (
                    <Badge variant="secondary" className="ml-1 h-4 px-1 text-xs">
                      {question.developerFeedbackList?.filter(f => f.type === 'finding').length}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="recommendations">
                  <Lightbulb className="h-3 w-3 mr-1" />
                  Recommendations
                  {(question.developerFeedbackList?.filter(f => f.type === 'recommendation').length || 0) > 0 && (
                    <Badge variant="secondary" className="ml-1 h-4 px-1 text-xs">
                      {question.developerFeedbackList?.filter(f => f.type === 'recommendation').length}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="documents">
                  <FileCode className="h-3 w-3 mr-1" />
                  Documents
                  {(question.documentsList?.length || 0) > 0 && (
                    <Badge variant="secondary" className="ml-1 h-4 px-1 text-xs">
                      {question.documentsList?.length}
                    </Badge>
                  )}
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="snippets" className="space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">Add or Edit Code Examples</Label>
                    {question.codeSnippetsList && question.codeSnippetsList.length > 0 && (
                      <Badge variant="secondary">{question.codeSnippetsList.length} snippet{question.codeSnippetsList.length !== 1 ? 's' : ''}</Badge>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground mb-2">
                    Add new code snippets or edit existing ones. They'll appear in the main question view above.
                  </div>
                  
                  {/* Display existing code snippets */}
                  {question.codeSnippetsList && question.codeSnippetsList.length > 0 && (
                    <div className="space-y-2 mb-3">
                      {question.codeSnippetsList.map((snippet, index) => (
                        <Card key={snippet.id} className="p-3">
                          {editingSnippetId === snippet.id ? (
                            // Edit mode
                            <div className="space-y-2">
                              <Input
                                value={snippetForm.title}
                                onChange={(e) => setSnippetForm({...snippetForm, title: e.target.value})}
                                placeholder="Snippet title"
                                className="text-sm"
                              />
                              <Input
                                value={snippetForm.language}
                                onChange={(e) => setSnippetForm({...snippetForm, language: e.target.value})}
                                placeholder="Language (e.g., powershell, javascript)"
                                className="text-sm"
                              />
                              <Textarea
                                value={snippetForm.description}
                                onChange={(e) => setSnippetForm({...snippetForm, description: e.target.value})}
                                placeholder="Description (optional)"
                                className="text-sm min-h-[60px]"
                              />
                              <Textarea
                                value={snippetForm.code}
                                onChange={(e) => setSnippetForm({...snippetForm, code: e.target.value})}
                                placeholder="Paste your code here..."
                                className="font-mono text-xs min-h-[120px]"
                              />
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  onClick={() => {
                                    const updatedSnippets = question.codeSnippetsList?.map(s => 
                                      s.id === snippet.id 
                                        ? {...s, ...snippetForm, updatedAt: new Date()}
                                        : s
                                    ) || []
                                    handleMainAnswerChange(question.answer, { 
                                      ...documentData, 
                                      codeSnippetsList: updatedSnippets 
                                    })
                                    setEditingSnippetId(null)
                                  }}
                                >
                                  Save
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => setEditingSnippetId(null)}
                                >
                                  Cancel
                                </Button>
                              </div>
                            </div>
                          ) : (
                            // View mode
                            <>
                              <div className="flex justify-between items-start mb-2">
                                <div>
                                  <h4 className="text-sm font-medium">{snippet.title || `Code Snippet ${index + 1}`}</h4>
                                  <p className="text-xs text-muted-foreground">
                                    Added: {new Date(snippet.createdAt).toLocaleString()}
                                    {snippet.author && ` by ${snippet.author}`}
                                    {snippet.updatedAt && ` • Updated: ${new Date(snippet.updatedAt).toLocaleString()}`}
                                  </p>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Badge variant="outline" className="text-xs">
                                    {snippet.language || 'code'}
                                  </Badge>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-7 w-7"
                                    onClick={() => {
                                      setSnippetForm({
                                        title: snippet.title || "",
                                        code: snippet.code,
                                        language: snippet.language || "powershell",
                                        description: snippet.description || ""
                                      })
                                      setEditingSnippetId(snippet.id)
                                    }}
                                  >
                                    <MessageSquare className="h-3 w-3" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-7 w-7"
                                    onClick={() => {
                                      const updatedSnippets = question.codeSnippetsList?.filter(s => s.id !== snippet.id) || []
                                      handleMainAnswerChange(question.answer, { 
                                        ...documentData, 
                                        codeSnippetsList: updatedSnippets 
                                      })
                                    }}
                                  >
                                    <X className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                              {snippet.description && (
                                <p className="text-xs text-muted-foreground mb-2">{snippet.description}</p>
                              )}
                              <pre className="bg-muted p-2 rounded text-xs overflow-x-auto">
                                <code>{snippet.code}</code>
                              </pre>
                            </>
                          )}
                        </Card>
                      ))}
                    </div>
                  )}
                  
                  {/* Add new code snippet form */}
                  {isAddingSnippet ? (
                    <Card className="p-4 space-y-2">
                      <Input
                        value={snippetForm.title}
                        onChange={(e) => setSnippetForm({...snippetForm, title: e.target.value})}
                        placeholder="Snippet title (e.g., 'DLP Policy PowerShell Script')"
                        className="text-sm"
                      />
                      <Input
                        value={snippetForm.language}
                        onChange={(e) => setSnippetForm({...snippetForm, language: e.target.value})}
                        placeholder="Language (e.g., powershell, javascript, json)"
                        className="text-sm"
                      />
                      <Textarea
                        value={snippetForm.description}
                        onChange={(e) => setSnippetForm({...snippetForm, description: e.target.value})}
                        placeholder="Description - what does this code do? (optional)"
                        className="text-sm min-h-[60px]"
                      />
                      <Textarea
                        value={snippetForm.code}
                        onChange={(e) => setSnippetForm({...snippetForm, code: e.target.value})}
                        placeholder="Paste your code here..."
                        className="font-mono text-xs min-h-[150px]"
                      />
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => {
                            if (snippetForm.code.trim()) {
                              const newSnippet = {
                                id: `snippet-${Date.now()}`,
                                ...snippetForm,
                                createdAt: new Date(),
                              }
                              const updatedSnippets = [...(question.codeSnippetsList || []), newSnippet]
                              handleMainAnswerChange(question.answer, { 
                                ...documentData, 
                                codeSnippetsList: updatedSnippets 
                              })
                              setSnippetForm({
                                title: "",
                                code: "",
                                language: "powershell",
                                description: ""
                              })
                              setIsAddingSnippet(false)
                            }
                          }}
                          disabled={!snippetForm.code.trim()}
                        >
                          Save Snippet
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setIsAddingSnippet(false)
                            setSnippetForm({
                              title: "",
                              code: "",
                              language: "powershell",
                              description: ""
                            })
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
                      onClick={() => setIsAddingSnippet(true)}
                      className="w-full"
                    >
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Add Code Snippet
                    </Button>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="evidence" className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor={`${question.id}-evidence`} className="text-sm font-medium">
                    Observations / Evidence
                  </Label>
                  <div className="text-xs text-muted-foreground mb-2">
                    Document any observations, links to documentation, or evidence
                  </div>
                  <Textarea
                    id={`${question.id}-evidence`}
                    value={evidenceNotes}
                    onChange={handleEvidenceChange}
                    placeholder="Enter any observations, links to documentation, or evidence..."
                    className="min-h-[100px]"
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="feedback" className="space-y-3">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Developer Findings & Feedback</Label>
                  <div className="text-xs text-muted-foreground mb-2">
                    Document findings at different dates - track how issues evolve over time
                  </div>
                  
                  {/* Display existing feedback entries */}
                  {question.developerFeedbackList && question.developerFeedbackList.filter(f => f.type === 'finding').length > 0 && (
                    <div className="space-y-2 mb-3">
                      {question.developerFeedbackList
                        .filter(f => f.type === 'finding')
                        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                        .map((finding) => (
                          <Card key={finding.id} className="p-3">
                            <div className="flex justify-between items-start mb-2">
                              <p className="text-xs text-muted-foreground">
                                {new Date(finding.createdAt).toLocaleString()}
                                {finding.author && ` - ${finding.author}`}
                              </p>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={() => {
                                  const updatedFeedback = question.developerFeedbackList?.filter(f => f.id !== finding.id) || []
                                  handleMainAnswerChange(question.answer, { 
                                    ...documentData, 
                                    developerFeedbackList: updatedFeedback 
                                  })
                                }}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                            <p className="text-sm">{finding.feedback}</p>
                          </Card>
                        ))}
                    </div>
                  )}
                  
                  <Textarea
                    value={developerFeedback}
                    onChange={handleDeveloperFeedbackChange}
                    placeholder="Document technical findings, challenges encountered, performance observations..."
                    className="min-h-[100px]"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      if (developerFeedback.trim()) {
                        const newFinding = {
                          id: `finding-${Date.now()}`,
                          feedback: developerFeedback,
                          type: 'finding' as const,
                          createdAt: new Date()
                        }
                        const updatedFeedback = [...(question.developerFeedbackList || []), newFinding]
                        handleMainAnswerChange(question.answer, { 
                          ...documentData, 
                          developerFeedbackList: updatedFeedback 
                        })
                        setDeveloperFeedback('')
                      }
                    }}
                    disabled={!developerFeedback.trim()}
                  >
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Add Feedback Entry
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="recommendations" className="space-y-3">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Developer Recommendations</Label>
                  <div className="text-xs text-muted-foreground mb-2">
                    Add recommendations over time as you discover better approaches
                  </div>
                  
                  {/* Display existing recommendations */}
                  {question.developerFeedbackList && question.developerFeedbackList.filter(f => f.type === 'recommendation').length > 0 && (
                    <div className="space-y-2 mb-3">
                      {question.developerFeedbackList
                        .filter(f => f.type === 'recommendation')
                        .map((rec, index) => (
                          <Card key={rec.id} className="p-3">
                            <div className="flex justify-between items-start mb-2">
                              <p className="text-xs text-muted-foreground">
                                {new Date(rec.createdAt).toLocaleString()}
                                {rec.author && ` - ${rec.author}`}
                              </p>
                            </div>
                            <p className="text-sm">{rec.feedback}</p>
                          </Card>
                        ))}
                    </div>
                  )}
                  
                  <Textarea
                    value={developerRecommendations}
                    onChange={handleDeveloperRecommendationsChange}
                    placeholder="Share recommendations for other developers implementing similar solutions..."
                    className="min-h-[100px]"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      if (developerRecommendations.trim()) {
                        const newRec = {
                          id: `rec-${Date.now()}`,
                          feedback: developerRecommendations,
                          type: 'recommendation' as const,
                          createdAt: new Date()
                        }
                        const updatedFeedback = [...(question.developerFeedbackList || []), newRec]
                        handleMainAnswerChange(question.answer, { 
                          ...documentData, 
                          developerFeedbackList: updatedFeedback 
                        })
                        setDeveloperRecommendations('')
                      }
                    }}
                  >
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Add Recommendation
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="documents" className="space-y-3">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Supporting Documents & Evidence</Label>
                  <div className="text-xs text-muted-foreground mb-2">
                    Upload documents, screenshots, emails, or add links to events and external resources
                  </div>
                  
                  {question.type === "document-review" ? (
                    <DocumentReviewInput
                      question={question}
                      value={documentData}
                      onChange={(value) => handleDocumentDataChange(value)}
                    />
                  ) : (
                    <GeneralDocumentUpload
                      documents={documentData.documentsList || question.documentsList || []}
                      onChange={(docs) => {
                        handleMainAnswerChange(question.answer, {
                          ...documentData,
                          documentsList: docs
                        })
                      }}
                    />
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}

      {!isNotApplicable && question.riskLevel && question.ragStatus !== "grey" && question.ragStatus !== "not-applicable" && (
        <div
          className={`mt-4 text-sm p-3 rounded-md border ${
            question.ragStatus === "red"
              ? "bg-red-50 border-red-200 text-red-900 dark:bg-red-900/20 dark:border-red-800 dark:text-red-200"
              : question.ragStatus === "amber"
                ? "bg-yellow-50 border-yellow-200 text-yellow-900 dark:bg-yellow-900/20 dark:border-yellow-800 dark:text-yellow-200"
                : "bg-green-50 border-green-200 text-green-900 dark:bg-green-900/20 dark:border-green-800 dark:text-green-200"
          }`}
        >
          <p className="text-xs font-semibold uppercase tracking-wider mb-2">Assessment Feedback</p>
          <p>
            Calculated Risk: <span className="font-semibold">{question.riskLevel?.toUpperCase()}</span> (Score:{" "}
            {question.score}/5)
          </p>

          {question.bestPractice?.suggestedActions && question.bestPractice.suggestedActions.length > 0 && (
            <div className="mt-3">
              <p className="font-semibold text-xs mb-1">Suggested Actions:</p>
              <ul className="list-disc list-inside text-xs space-y-0.5">
                {question.bestPractice.suggestedActions.map((action, idx) => (
                  <li key={idx}>{action}</li>
                ))}
              </ul>
            </div>
          )}

          {(question.ragStatus === "red" || question.ragStatus === "amber") && (
            <div className="mt-3">
              <Label htmlFor={`${question.id}-risk-owner`} className="text-xs font-semibold block mb-1">
                Risk Owner (e.g., C-Suite, Department Head):
              </Label>
              <Input
                id={`${question.id}-risk-owner`}
                type="text"
                value={riskOwnerInput}
                onChange={(e) => setRiskOwnerInput(e.target.value)}
                onBlur={handleRiskOwnerBlur}
                placeholder="Enter name or role"
                className="text-xs h-8"
              />
            </div>
          )}

          {question.bestPractice && (question.ragStatus === "red" || question.ragStatus === "amber") && (
            <div className="mt-3 pt-3 border-t border-current/20">
              <p className="flex items-center font-semibold mb-1">
                <Lightbulb className="h-4 w-4 mr-2 text-blue-500" />
                Best Practice Recommendation
              </p>
              <p className="text-sm">{question.bestPractice.description}</p>
              {question.bestPractice.link && (
                <a
                  href={question.bestPractice.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline dark:text-blue-400 text-sm mt-2 inline-flex items-center"
                >
                  {question.bestPractice.linkText || "Learn more"}
                  <ExternalLink className="ml-1 h-3 w-3" />
                </a>
              )}
            </div>
          )}
        </div>
      )}

      {/* Add Scoring Criteria */}
      <ScoringCriteria />
    </div>
  )
}

// Helper function to determine area from question
function getAreaFromQuestion(question: Question): string {
  const text = question.text.toLowerCase()
  const category = question.category.toLowerCase()
  
  if (text.includes("power automate") || text.includes("flow")) return "power-automate"
  if (text.includes("power apps") || category.includes("app")) return "power-apps"
  if (text.includes("power bi") || text.includes("analytics")) return "power-bi"
  if (text.includes("dataverse")) return "dataverse"
  if (text.includes("custom connector")) return "custom-connectors"
  
  return "general"
}
