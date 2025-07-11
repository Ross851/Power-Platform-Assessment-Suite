"use client"

import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useAssessmentStore } from "@/store/assessment-store"
import type { AssessmentStandard } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ArrowRight, CheckCircle } from "lucide-react"
import { QuestionDisplay } from "@/components/question-display"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RAGIndicator } from "@/components/rag-indicator" // Import RAGIndicator
import { Alert, AlertCircle, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function AssessmentStandardPage() {
  const router = useRouter()
  const params = useParams()
  const standardSlug = params.standardSlug as string

  const {
    getStandardBySlug,
    setAnswer,
    getStandardProgress,
    calculateScoresAndRAG,
    getStandardMaturityScore,
    activeProjectName,
    getActiveProject,
  } = useAssessmentStore()

  const [standard, setStandard] = useState<AssessmentStandard | undefined>(undefined)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    if (!activeProjectName) {
      // Optional: redirect or show a message if no project is active
      // For now, it might just show "Loading..." or an error if standard is not found
      setStandard(undefined)
      return
    }
    // Fetch standard fresh from store on mount/slug change or active project change
    const currentStandard = getStandardBySlug(standardSlug)
    setStandard(currentStandard)
    if (currentStandard) {
      calculateScoresAndRAG(standardSlug) // Initial calculation
    }
  }, [standardSlug, getStandardBySlug, calculateScoresAndRAG, activeProjectName]) // Added activeProjectName

  const handleAnswerChange = (
    questionId: string,
    answer: any,
    additionalData?: string | object,
    riskOwner?: string,
  ) => {
    const payload: any = {
      standardSlug,
      questionId,
      answer,
    }
    if (typeof additionalData === "string") {
      payload.evidenceNotes = additionalData
    } else {
      payload.documentData = additionalData
    }
    if (riskOwner !== undefined) {
      payload.riskOwner = riskOwner
    }

    setAnswer(payload)
    calculateScoresAndRAG(standardSlug) // Recalculate scores and RAG on answer change
    // Re-fetch standard from store to reflect updates immediately
    setStandard(getStandardBySlug(standardSlug))
  }

  const goToNextQuestion = () => {
    if (standard && currentQuestionIndex < standard.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    }
  }

  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    }
  }

  const completeStandard = () => {
    calculateScoresAndRAG(standardSlug) // Final calculation
    router.push("/")
  }

  if (!isClient || !activeProjectName) {
    return (
      <div className="container mx-auto p-8">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>No Active Project</AlertTitle>
          <AlertDescription>
            Please select or create a project from the dashboard to start an assessment.
            <Button variant="link" onClick={() => router.push("/")} className="p-0 h-auto ml-1">
              Go to Dashboard
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  if (!standard) {
    return <div className="container mx-auto p-8">Loading assessment standard for project "{activeProjectName}"...</div>
  }

  const currentQuestion = standard.questions[currentQuestionIndex]
  const progress = getStandardProgress(standardSlug)
  const maturityScore = getStandardMaturityScore(standardSlug)

  return (
    <div className="container mx-auto p-4 md:p-8 min-h-screen bg-background text-foreground">
      <Button variant="outline" onClick={() => router.push("/")} className="mb-4 bg-card text-card-foreground">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
      </Button>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl">{standard.name}</CardTitle>
            <RAGIndicator status={standard.ragStatus} size="lg" />
          </div>
          <CardDescription>{standard.description}</CardDescription>
          <div className="mt-2">
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium text-muted-foreground">Progress</span>
              <span className="text-sm font-medium text-primary">{progress.toFixed(0)}%</span>
            </div>
            <Progress value={progress} className="w-full h-2" />
            <p className="text-xs text-muted-foreground mt-1">Maturity Score: {maturityScore.toFixed(1)}/5.0</p>
          </div>
        </CardHeader>

        <CardContent>
          {currentQuestion ? (
            <QuestionDisplay question={currentQuestion} onAnswerChange={handleAnswerChange} key={currentQuestion.id} />
          ) : (
            <p>No questions available for this standard.</p>
          )}
        </CardContent>

        <CardFooter className="flex justify-between items-center">
          <Button
            variant="outline"
            onClick={goToPreviousQuestion}
            disabled={currentQuestionIndex === 0}
            className="bg-card text-card-foreground"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Question {currentQuestionIndex + 1} of {standard.questions.length}
          </span>
          {currentQuestionIndex === standard.questions.length - 1 ? (
            <Button onClick={completeStandard} className="bg-green-600 hover:bg-green-700 text-white">
              <CheckCircle className="mr-2 h-4 w-4" /> Complete Standard
            </Button>
          ) : (
            <Button onClick={goToNextQuestion}>
              Next <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}
