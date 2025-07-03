"use client"

import { useParams, useRouter } from "next/navigation"
import { useAssessmentStore } from "@/store/assessment-store"
import { assessmentStandards } from "@/lib/constants"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { ResponsiveWrapper } from "@/components/responsive-wrapper"
import { AssessmentSidebarEnhanced } from "@/components/assessment-sidebar-enhanced"
import { QuestionCardEnhanced } from "@/components/question-card-enhanced"
import { SkipLinks } from "@/components/accessibility/skip-links"
import { useKeyboardShortcuts, useFormKeyboardNavigation } from "@/lib/accessibility"
import { 
  ArrowLeft, 
  ArrowRight, 
  Save, 
  Home,
  AlertCircle,
  CheckCircle,
  TrendingUp,
  Clock,
  Target,
  Info
} from "lucide-react"
import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import { useMediaQuery } from "@/hooks/use-media-query"
import { Question } from "@/lib/types"

// Import question type components
import { BooleanInput } from "@/components/question-types/boolean-input"
import { ScaleInput } from "@/components/question-types/scale-input"
import { PercentageInput } from "@/components/question-types/percentage-input"
import { TextInput } from "@/components/question-types/text-input"
import { NumericInput } from "@/components/question-types/numeric-input"
import { DocumentReview } from "@/components/question-types/document-review"

export default function EnhancedAssessmentPage() {
  const params = useParams()
  const router = useRouter()
  const isMobile = useMediaQuery("(max-width: 768px)")
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [highlightedQuestionId, setHighlightedQuestionId] = useState<string | null>(null)

  const standardSlug = params?.standardSlug as string
  const standard = assessmentStandards.find((s) => s.slug === standardSlug)

  const activeProject = useAssessmentStore((state) => state.getActiveProject())
  const updateQuestionAnswer = useAssessmentStore((state) => state.updateQuestionAnswer)
  const calculateScoresAndRAG = useAssessmentStore((state) => state.calculateScoresAndRAG)

  const projectStandard = activeProject?.standards.find((s) => s.name === standard?.name)
  const questions = projectStandard?.questions || []

  // Form keyboard navigation
  const formRef = useFormKeyboardNavigation()

  // Custom keyboard shortcuts
  useKeyboardShortcuts([
    {
      key: "s",
      modifiers: ["ctrl"],
      action: () => handleSave(),
      description: "Save assessment"
    },
    {
      key: "ArrowLeft",
      modifiers: ["alt"],
      action: () => navigateToPreviousStandard(),
      description: "Previous standard"
    },
    {
      key: "ArrowRight", 
      modifiers: ["alt"],
      action: () => navigateToNextStandard(),
      description: "Next standard"
    }
  ])

  // Auto-save functionality
  useEffect(() => {
    if (!autoSaveEnabled || !activeProject) return

    const saveTimer = setTimeout(() => {
      setLastSaved(new Date())
      // In a real app, this would trigger a save to backend
    }, 2000) // Save after 2 seconds of inactivity

    return () => clearTimeout(saveTimer)
  }, [questions, autoSaveEnabled, activeProject])

  // Handle URL hash for question highlighting
  useEffect(() => {
    const hash = window.location.hash
    if (hash && hash.startsWith("#q-")) {
      const questionId = hash.substring(3)
      setHighlightedQuestionId(questionId)
      setTimeout(() => setHighlightedQuestionId(null), 3000)
    }
  }, [])

  if (!standard || !activeProject || !projectStandard) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-center text-muted-foreground">
              {!activeProject ? "No active project selected" : "Standard not found"}
            </p>
            <Button 
              className="w-full mt-4" 
              onClick={() => router.push("/")}
            >
              <Home className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const answeredQuestions = questions.filter(q => 
    q.isNotApplicable || (q.answer !== undefined && q.answer !== null && q.answer !== "")
  ).length

  const completionPercentage = projectStandard.completionPercentage || 0
  const maturityScore = projectStandard.maturityScore || 0
  const ragStatus = projectStandard.ragStatus || "grey"

  const navigateToPreviousStandard = () => {
    const currentIndex = assessmentStandards.findIndex(s => s.slug === standardSlug)
    if (currentIndex > 0) {
      router.push(`/assessment/${assessmentStandards[currentIndex - 1].slug}`)
    }
  }

  const navigateToNextStandard = () => {
    const currentIndex = assessmentStandards.findIndex(s => s.slug === standardSlug)
    if (currentIndex < assessmentStandards.length - 1) {
      router.push(`/assessment/${assessmentStandards[currentIndex + 1].slug}`)
    }
  }

  const handleSave = () => {
    setLastSaved(new Date())
    // Trigger save logic
  }

  const handleQuestionUpdate = (questionId: string, updates: Partial<Question>) => {
    if (!activeProject || !projectStandard || !standard) return

    // Update the question
    updateQuestionAnswer(
      activeProject.name,
      standard.name,
      questionId,
      updates.answer,
      updates.evidence,
      updates.isNotApplicable
    )

    // Recalculate scores
    calculateScoresAndRAG(activeProject.name, standard.name)
  }

  const renderQuestionInput = (question: Question) => {
    const props = {
      value: question.answer,
      onChange: (value: any) => handleQuestionUpdate(question.id, { answer: value }),
      isNotApplicable: question.isNotApplicable,
      onNotApplicableChange: (isNA: boolean) => handleQuestionUpdate(question.id, { isNotApplicable: isNA }),
      evidence: question.evidence,
      onEvidenceChange: (evidence: any) => handleQuestionUpdate(question.id, { evidence }),
    }

    switch (question.type) {
      case "boolean":
        return <BooleanInput {...props} />
      case "scale":
        return <ScaleInput {...props} />
      case "percentage":
        return <PercentageInput {...props} />
      case "text":
        return <TextInput {...props} />
      case "numeric":
        return <NumericInput {...props} />
      case "document-review":
        return <DocumentReview {...props} />
      default:
        return <div>Unknown question type</div>
    }
  }

  return (
    <>
      <SkipLinks additionalLinks={[
        { id: "assessment-progress", label: "Skip to progress" },
        { id: "questions-section", label: "Skip to questions" }
      ]} />
      
      <ResponsiveWrapper
        sidebar={<AssessmentSidebarEnhanced />}
        sidebarTitle="Assessment Standards"
        className="min-h-screen bg-background"
      >
        <div className="container mx-auto p-4 md:p-6 lg:p-8 max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4 flex-wrap gap-4">
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => router.push("/")}
                    className="mr-2"
                  >
                    <Home className="h-4 w-4" />
                    <span className="sr-only">Dashboard</span>
                  </Button>
                  <h1 className="text-2xl md:text-3xl font-bold">{standard.name}</h1>
                </div>
                
                {lastSaved && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Saved {lastSaved.toLocaleTimeString()}</span>
                  </div>
                )}
              </div>

              {standard.description && (
                <p className="text-muted-foreground mb-6">{standard.description}</p>
              )}

              {/* Progress Card */}
              <Card id="assessment-progress" className="mb-6">
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Progress */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Target className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium">Progress</span>
                        </div>
                        <span className="text-2xl font-bold">{completionPercentage}%</span>
                      </div>
                      <Progress value={completionPercentage} className="h-2" />
                      <p className="text-xs text-muted-foreground">
                        {answeredQuestions} of {questions.length} questions answered
                      </p>
                    </div>

                    {/* Maturity Score */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium">Maturity</span>
                        </div>
                        <span className="text-2xl font-bold">{maturityScore.toFixed(1)}/5.0</span>
                      </div>
                      <Progress value={(maturityScore / 5) * 100} className="h-2" />
                      <p className="text-xs text-muted-foreground">
                        Weight: {standard.weight} | Impact: {standard.weight > 15 ? "High" : "Medium"}
                      </p>
                    </div>

                    {/* Risk Status */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <AlertCircle className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium">Risk Status</span>
                        </div>
                        <Badge variant={
                          ragStatus === "red" ? "destructive" :
                          ragStatus === "amber" ? "secondary" :
                          ragStatus === "green" ? "default" : "outline"
                        }>
                          {ragStatus.toUpperCase()}
                        </Badge>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {ragStatus === "red" && "High priority - immediate action needed"}
                        {ragStatus === "amber" && "Medium priority - review recommended"}
                        {ragStatus === "green" && "Low priority - performing well"}
                        {ragStatus === "grey" && "Not yet assessed"}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>

          {/* Questions Section */}
          <div id="questions-section" className="space-y-6" ref={formRef}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Assessment Questions</h2>
              <Badge variant="outline">
                {questions.length} Questions
              </Badge>
            </div>

            {questions.map((question, index) => (
              <QuestionCardEnhanced
                key={question.id}
                question={question}
                questionNumber={index + 1}
                totalQuestions={questions.length}
                onUpdate={(updates) => handleQuestionUpdate(question.id, updates)}
                isHighlighted={highlightedQuestionId === question.id}
                autoFocus={highlightedQuestionId === question.id}
              >
                {renderQuestionInput(question)}
              </QuestionCardEnhanced>
            ))}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8 pt-8 border-t">
            <Button
              variant="outline"
              onClick={navigateToPreviousStandard}
              disabled={assessmentStandards.findIndex(s => s.slug === standardSlug) === 0}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              {!isMobile && "Previous Standard"}
            </Button>

            <Button
              onClick={navigateToNextStandard}
              disabled={assessmentStandards.findIndex(s => s.slug === standardSlug) === assessmentStandards.length - 1}
            >
              {!isMobile && "Next Standard"}
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      </ResponsiveWrapper>
    </>
  )
}