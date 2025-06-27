"use client"

import { useState } from "react"
import type { Question } from "@/lib/types"
import { useAssessmentStore } from "@/store/assessment-store"

import { BooleanInput } from "./question-types/boolean-input"
import { ScaleInput } from "./question-types/scale-input"
import { PercentageInput } from "./question-types/percentage-input"
import { TextInput } from "./question-types/text-input"
import { NumericInput } from "./question-types/numeric-input"
import { DocumentReviewInput } from "./question-types/document-review-input"
import { EvidenceManager } from "./evidence-manager"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { RAGIndicator } from "./rag-indicator"
import {
  Edit,
  Info,
  Lightbulb,
  ExternalLink,
  Compass,
  Calendar,
  User,
  AlertTriangle,
  CheckCircle2,
  Save,
  ClipboardList,
} from "lucide-react"

interface QuestionDisplayProps {
  question: Question
  standardSlug: string
}

export function QuestionDisplay({ question, standardSlug }: QuestionDisplayProps) {
  const { setAnswer } = useAssessmentStore()
  const activeProjectName = useAssessmentStore((state) => state.activeProjectName)

  const [riskOwnerInput, setRiskOwnerInput] = useState(question.riskOwner || "")
  const [isEvidenceDialogOpen, setIsEvidenceDialogOpen] = useState(false)
  const [evidenceNotes, setEvidenceNotes] = useState(question.evidenceNotes || "")
  const [isFeedbackDialogOpen, setIsFeedbackDialogOpen] = useState(false)
  const [feedbackData, setFeedbackData] = useState({
    howAssessed: question.assessmentFeedback?.howAssessed?.join("\n") || "",
    assessmentDate: question.assessmentFeedback?.assessmentDate || new Date().toISOString().split("T")[0],
    reviewedBy: question.assessmentFeedback?.reviewedBy || "",
    findings: question.assessmentFeedback?.findings || "",
    limitations: question.assessmentFeedback?.limitations || "",
    recommendations: question.assessmentFeedback?.recommendations || "",
  })

  const handleAnswerChange = (answer: any) => {
    setAnswer({ standardSlug, questionId: question.id, answer })
  }

  const handleEvidenceSave = () => {
    setAnswer({ standardSlug, questionId: question.id, evidenceNotes })
    setIsEvidenceDialogOpen(false)
  }

  const handleFeedbackSave = () => {
    const assessmentFeedback = {
      howAssessed: feedbackData.howAssessed.split("\n").filter((line) => line.trim()),
      assessmentDate: feedbackData.assessmentDate,
      reviewedBy: feedbackData.reviewedBy,
      findings: feedbackData.findings,
      limitations: feedbackData.limitations,
      recommendations: feedbackData.recommendations,
    }
    setAnswer({ standardSlug, questionId: question.id, assessmentFeedback })
    setIsFeedbackDialogOpen(false)
  }

  const handleRiskOwnerBlur = () => {
    if (riskOwnerInput !== (question.riskOwner || "")) {
      setAnswer({
        standardSlug,
        questionId: question.id,
        riskOwner: riskOwnerInput,
      })
    }
  }

  const renderQuestionInput = () => {
    switch (question.type) {
      case "boolean":
        return <BooleanInput question={question} onAnswerChange={handleAnswerChange} />
      case "scale":
        return <ScaleInput question={question} onAnswerChange={handleAnswerChange} />
      case "percentage":
        return <PercentageInput question={question} onAnswerChange={handleAnswerChange} />
      case "text":
        return <TextInput question={question} onAnswerChange={handleAnswerChange} />
      case "numeric":
        return <NumericInput question={question} onAnswerChange={handleAnswerChange} />
      case "document-review":
        return (
          <DocumentReviewInput
            question={question}
            onAnswerChange={(qId, overallAssessment) =>
              setAnswer({ standardSlug, questionId: qId, answer: overallAssessment })
            }
          />
        )
      default:
        return <p>Unsupported question type: {question.type}</p>
    }
  }

  const getStatusIcon = () => {
    if (question.answer === undefined || question.answer === "" || question.answer === null) {
      return <div className="w-6 h-6 rounded-full border-2 border-gray-300" />
    }
    if (question.ragStatus === "red") {
      return <AlertTriangle className="w-6 h-6 text-red-500" />
    }
    if (question.ragStatus === "amber") {
      return <AlertTriangle className="w-6 h-6 text-amber-500" />
    }
    return <CheckCircle2 className="w-6 h-6 text-green-500" />
  }

  const hasAssessmentFeedback = () => {
    return (
      question.assessmentFeedback &&
      (question.assessmentFeedback.howAssessed?.length > 0 ||
        question.assessmentFeedback.findings ||
        question.assessmentFeedback.recommendations ||
        question.assessmentFeedback.reviewedBy)
    )
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3 flex-1">
            {getStatusIcon()}
            <div className="flex-1">
              <CardTitle className="text-lg leading-tight flex items-center gap-2">
                {question.text}
                <RAGIndicator status={question.ragStatus} size="md" />
              </CardTitle>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="secondary" className="text-xs">
                  {question.category}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  Weight: {question.weight}
                </Badge>
                {question.score !== undefined && (
                  <Badge variant="outline" className="text-xs">
                    Score: {question.score}/5
                  </Badge>
                )}
                {hasAssessmentFeedback() && (
                  <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                    Assessment Documented
                  </Badge>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {/* Developer Guidance */}
            {question.developerGuidance && (
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Info className="h-4 w-4" />
                    <span className="sr-only">Developer Guidance</span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-96 max-h-96 overflow-y-auto" side="left">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-sm mb-2 text-blue-600">What This Means</h4>
                      <p className="text-sm text-muted-foreground">{question.developerGuidance.whatThisMeans}</p>
                    </div>

                    <div>
                      <h4 className="font-semibold text-sm mb-2 text-green-600">When Needed</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        {question.developerGuidance.whenNeeded.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-green-500 mt-1">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold text-sm mb-2 text-purple-600">Implementation Requirements</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        {question.developerGuidance.implementationRequirements.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-purple-500 mt-1">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold text-sm mb-2 text-orange-600">Evidence to Look For</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        {question.developerGuidance.evidenceToLookFor.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-orange-500 mt-1">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            )}

            {/* Discovery Guide */}
            {question.discovery && question.discovery.length > 0 && (
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Compass className="h-4 w-4" />
                    <span className="sr-only">Discovery Guide</span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-96" side="left">
                  <div className="space-y-3">
                    <h4 className="font-semibold text-base">How to Find This Information</h4>
                    <p className="text-sm text-muted-foreground">
                      Follow these steps to locate the data needed to answer this question:
                    </p>
                    <ol className="space-y-2">
                      {question.discovery.map((step, index) => (
                        <li key={index} className="flex gap-3 text-sm">
                          <span className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-medium">
                            {index + 1}
                          </span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                </PopoverContent>
              </Popover>
            )}

            {/* === IN-DEPTH ASSESSMENT DOCUMENTATION === 
                For formal assessment methodology and detailed analysis. Use this for:
                - Documenting assessment procedures and steps taken
                - Recording detailed findings and limitations
                - Formal recommendations for audit trails
                This is the "compliance and audit" documentation layer.
            */}
            {/* Assessment Feedback */}
            <Dialog open={isFeedbackDialogOpen} onOpenChange={setIsFeedbackDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className={`h-8 w-8 ${hasAssessmentFeedback() ? "text-green-600 bg-green-50 hover:bg-green-100" : ""}`}
                >
                  <ClipboardList className="h-4 w-4" />
                  <span className="sr-only">Assessment Feedback {hasAssessmentFeedback() ? "(Completed)" : ""}</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Assessment Methodology & Detailed Analysis</DialogTitle>
                  <DialogDescription>
                    Record the assessment approach, detailed findings, and recommendations. This creates an audit trail
                    for compliance and future reviews.
                  </DialogDescription>
                </DialogHeader>

                <Tabs defaultValue="methodology" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="methodology">Assessment Methodology</TabsTrigger>
                    <TabsTrigger value="findings">Findings & Recommendations</TabsTrigger>
                  </TabsList>

                  <TabsContent value="methodology" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="assessment-date">Assessment Date</Label>
                        <Input
                          id="assessment-date"
                          type="date"
                          value={feedbackData.assessmentDate}
                          onChange={(e) => setFeedbackData((prev) => ({ ...prev, assessmentDate: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="reviewed-by">Reviewed By</Label>
                        <Input
                          id="reviewed-by"
                          value={feedbackData.reviewedBy}
                          onChange={(e) => setFeedbackData((prev) => ({ ...prev, reviewedBy: e.target.value }))}
                          placeholder="Assessor name"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="how-assessed">How This Was Assessed</Label>
                      <Textarea
                        id="how-assessed"
                        value={feedbackData.howAssessed}
                        onChange={(e) => setFeedbackData((prev) => ({ ...prev, howAssessed: e.target.value }))}
                        placeholder="- Specific steps taken to evaluate&#10;- Tools/locations checked&#10;- Tests performed"
                        className="min-h-[120px]"
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="findings" className="space-y-4">
                    <div>
                      <Label htmlFor="findings">Findings</Label>
                      <Textarea
                        id="findings"
                        value={feedbackData.findings}
                        onChange={(e) => setFeedbackData((prev) => ({ ...prev, findings: e.target.value }))}
                        placeholder="What was discovered during the assessment..."
                        className="min-h-[100px]"
                      />
                    </div>

                    <div>
                      <Label htmlFor="limitations">Limitations</Label>
                      <Textarea
                        id="limitations"
                        value={feedbackData.limitations}
                        onChange={(e) => setFeedbackData((prev) => ({ ...prev, limitations: e.target.value }))}
                        placeholder="What couldn't be verified or tested..."
                        className="min-h-[80px]"
                      />
                    </div>

                    <div>
                      <Label htmlFor="recommendations">Recommendations</Label>
                      <Textarea
                        id="recommendations"
                        value={feedbackData.recommendations}
                        onChange={(e) => setFeedbackData((prev) => ({ ...prev, recommendations: e.target.value }))}
                        placeholder="Next steps and recommended actions..."
                        className="min-h-[100px]"
                      />
                    </div>
                  </TabsContent>
                </Tabs>

                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsFeedbackDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleFeedbackSave}>
                    <Save className="h-4 w-4 mr-2" />
                    Save Assessment
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {question.guidance && <CardDescription className="mt-2">{question.guidance}</CardDescription>}
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Question Input */}
        <div>{renderQuestionInput()}</div>

        {/* === QUICK OBSERVATIONS SECTION === 
            For rapid note-taking during assessment. Use this for:
            - Brief findings and observations
            - Links to documentation
            - Quick evidence summaries
            This is the "fast track" for capturing essential information.
        */}
        {/* Evidence Notes */}
        {question.type !== "document-review" && (
          <div>
            <Label className="text-sm font-medium mb-2 block">Observations / Evidence Summary</Label>
            <Dialog open={isEvidenceDialogOpen} onOpenChange={setIsEvidenceDialogOpen}>
              <div className="flex items-start gap-2">
                <Textarea
                  value={question.evidenceNotes || ""}
                  readOnly
                  placeholder="Click to add detailed observations and evidence..."
                  className="min-h-[80px] cursor-pointer"
                  onClick={() => setIsEvidenceDialogOpen(true)}
                />
                <DialogTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Edit className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
              </div>
              <DialogContent className="max-w-4xl max-h-[80vh]">
                <DialogHeader>
                  <DialogTitle>Observations / Evidence Summary</DialogTitle>
                  <DialogDescription>
                    Summarise your findings, link to documentation, or describe the evidence provided.
                  </DialogDescription>
                </DialogHeader>
                <Textarea
                  value={evidenceNotes}
                  onChange={(e) => setEvidenceNotes(e.target.value)}
                  placeholder="Enter your detailed observations..."
                  className="min-h-[400px] resize-none"
                  autoFocus
                />
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsEvidenceDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleEvidenceSave}>
                    <Save className="h-4 w-4 mr-2" />
                    Save
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        )}

        {/* === DETAILED EVIDENCE COLLECTION === 
            For comprehensive documentation and file attachments. Use this for:
            - Uploading screenshots, documents, config files
            - Code snippets and technical evidence
            - Structured evidence that supports scoring decisions
            This provides the "deep dive" evidence trail.
        */}
        {/* Evidence Manager */}
        {activeProjectName && (
          <EvidenceManager
            projectName={activeProjectName}
            questionId={question.id}
            standardSlug={standardSlug}
            initialEvidence={question.evidence || []}
          />
        )}

        {/* === ASSESSMENT ANALYSIS & RECOMMENDATIONS === 
            Auto-generated based on answers and manual risk assignments. Contains:
            - Calculated risk levels and maturity scores
            - Best practice recommendations and action items
            - Risk ownership assignments
            This is the "actionable insights" section for stakeholders.
        */}
        {/* Risk Assessment Feedback */}
        {question.riskLevel && question.ragStatus !== "grey" && (
          <Card
            className={`border-l-4 ${
              question.ragStatus === "red"
                ? "border-l-red-500 bg-red-50 dark:bg-red-900/20"
                : question.ragStatus === "amber"
                  ? "border-l-amber-500 bg-amber-50 dark:bg-amber-900/20"
                  : "border-l-green-500 bg-green-50 dark:bg-green-900/20"
            }`}
          >
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold uppercase tracking-wider">Assessment Feedback</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Calculated Risk Level:</span>
                <Badge
                  variant={
                    question.riskLevel === "high"
                      ? "destructive"
                      : question.riskLevel === "medium"
                        ? "default"
                        : "secondary"
                  }
                >
                  {question.riskLevel?.toUpperCase()}
                </Badge>
              </div>

              {question.score !== undefined && (
                <div className="flex items-center justify-between">
                  <span className="text-sm">Maturity Score:</span>
                  <span className="font-semibold">{question.score}/5</span>
                </div>
              )}

              {question.bestPractice?.suggestedActions && question.bestPractice.suggestedActions.length > 0 && (
                <div>
                  <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                    <Lightbulb className="h-4 w-4" />
                    Suggested Actions
                  </h4>
                  <ul className="list-disc list-inside text-sm space-y-1">
                    {question.bestPractice.suggestedActions.map((action, idx) => (
                      <li key={idx}>{action}</li>
                    ))}
                  </ul>
                </div>
              )}

              {(question.ragStatus === "red" || question.ragStatus === "amber") && (
                <div>
                  <Label
                    htmlFor={`${question.id}-risk-owner`}
                    className="text-sm font-semibold flex items-center gap-2 mb-2"
                  >
                    <User className="h-4 w-4" />
                    Risk Owner
                  </Label>
                  <Input
                    id={`${question.id}-risk-owner`}
                    type="text"
                    value={riskOwnerInput}
                    onChange={(e) => setRiskOwnerInput(e.target.value)}
                    onBlur={handleRiskOwnerBlur}
                    placeholder="e.g., IT Director, Security Team"
                    className="text-sm"
                  />
                </div>
              )}

              {question.bestPractice && (question.ragStatus === "red" || question.ragStatus === "amber") && (
                <div className="pt-3 border-t">
                  <h4 className="font-semibold text-sm mb-2">Best Practice Recommendation</h4>
                  <p className="text-sm mb-2">{question.bestPractice.description}</p>
                  {question.bestPractice.link && (
                    <a
                      href={question.bestPractice.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline text-sm inline-flex items-center gap-1"
                    >
                      {question.bestPractice.linkText || "Learn more"}
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>
              )}

              {/* Assessment Feedback Summary */}
              {question.assessmentFeedback && (
                <div className="pt-3 border-t">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="h-4 w-4" />
                    <span className="text-sm font-medium">Assessed: {question.assessmentFeedback.assessmentDate}</span>
                    {question.assessmentFeedback.reviewedBy && (
                      <>
                        <span className="text-muted-foreground">by</span>
                        <span className="text-sm font-medium">{question.assessmentFeedback.reviewedBy}</span>
                      </>
                    )}
                  </div>
                  {question.assessmentFeedback.findings && (
                    <p className="text-sm text-muted-foreground">{question.assessmentFeedback.findings}</p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  )
}
