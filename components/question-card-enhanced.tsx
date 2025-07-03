"use client"

import { Question, RAGStatus } from "@/lib/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { RAGIndicator } from "@/components/rag-indicator"
import { cn } from "@/lib/utils"
import { 
  ChevronDown, 
  ChevronUp,
  AlertCircle,
  CheckCircle,
  Info,
  Lightbulb,
  Link as LinkIcon,
  FileText,
  Code,
  MessageSquare,
  Clock,
  User,
  Hash
} from "lucide-react"
import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { formatDistanceToNow } from "date-fns"
import { useRAGStatusAnnouncement } from "@/lib/accessibility"

interface QuestionCardEnhancedProps {
  question: Question
  questionNumber: number
  totalQuestions: number
  children: React.ReactNode
  onUpdate?: (updates: Partial<Question>) => void
  isHighlighted?: boolean
  autoFocus?: boolean
}

export function QuestionCardEnhanced({
  question,
  questionNumber,
  totalQuestions,
  children,
  onUpdate,
  isHighlighted = false,
  autoFocus = false,
}: QuestionCardEnhancedProps) {
  const [isExpanded, setIsExpanded] = useState(true)
  const [showEvidence, setShowEvidence] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)
  const { announce } = useRAGStatusAnnouncement()

  // Auto-focus when highlighted
  useEffect(() => {
    if (isHighlighted && autoFocus && cardRef.current) {
      cardRef.current.focus()
      cardRef.current.scrollIntoView({ behavior: "smooth", block: "center" })
    }
  }, [isHighlighted, autoFocus])

  // Announce RAG status changes
  useEffect(() => {
    if (question.ragStatus && question.ragStatus !== "grey") {
      announce(question.ragStatus, `Question ${questionNumber}: ${question.text}`)
    }
  }, [question.ragStatus, question.text, questionNumber, announce])

  const getImportanceColor = (importance: number) => {
    if (importance >= 4) return "text-red-500"
    if (importance >= 3) return "text-amber-500"
    return "text-blue-500"
  }

  const getImportanceLabel = (importance: number) => {
    if (importance >= 4) return "Critical"
    if (importance >= 3) return "Important"
    if (importance >= 2) return "Moderate"
    return "Low"
  }

  const hasEvidence = question.evidence && (
    question.evidence.documents?.length > 0 ||
    question.evidence.code?.length > 0 ||
    question.evidence.feedback?.length > 0 ||
    question.evidence.recommendations?.length > 0
  )

  const getCompletionStatus = () => {
    if (question.isNotApplicable) return "not-applicable"
    if (question.answer !== undefined && question.answer !== null && question.answer !== "") {
      return "complete"
    }
    return "incomplete"
  }

  const completionStatus = getCompletionStatus()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: questionNumber * 0.05 }}
    >
      <Card
        ref={cardRef}
        id={`q-${question.id}`}
        className={cn(
          "transition-all duration-300",
          isHighlighted && "ring-2 ring-primary ring-offset-2",
          question.ragStatus === "red" && "border-red-200 dark:border-red-900",
          completionStatus === "complete" && "bg-green-50/5 dark:bg-green-950/5"
        )}
        tabIndex={-1}
        aria-label={`Question ${questionNumber} of ${totalQuestions}`}
      >
        <CardHeader>
          <div className="space-y-3">
            {/* Header Row */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Hash className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                    <span className="sr-only">Question </span>
                    {questionNumber}
                    <span className="text-muted-foreground font-normal">of {totalQuestions}</span>
                  </CardTitle>
                  
                  <Badge 
                    variant={completionStatus === "complete" ? "default" : "secondary"}
                    className="text-xs"
                  >
                    {completionStatus === "complete" && <CheckCircle className="h-3 w-3 mr-1" />}
                    {completionStatus === "not-applicable" ? "N/A" : 
                     completionStatus === "complete" ? "Answered" : "Pending"}
                  </Badge>

                  {question.importance && (
                    <Badge 
                      variant="outline" 
                      className={cn("text-xs", getImportanceColor(question.importance))}
                    >
                      {getImportanceLabel(question.importance)}
                    </Badge>
                  )}
                </div>

                <CardDescription className="text-sm leading-relaxed">
                  {question.text}
                </CardDescription>
              </div>

              <div className="flex items-center gap-2">
                <RAGIndicator status={question.ragStatus} size="md" />
                
                <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
                  <CollapsibleTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      aria-label={isExpanded ? "Collapse question" : "Expand question"}
                      aria-expanded={isExpanded}
                    >
                      {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </Button>
                  </CollapsibleTrigger>
                </Collapsible>
              </div>
            </div>

            {/* Guidance */}
            {question.guidance && (
              <div className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                <Lightbulb className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-muted-foreground">{question.guidance}</p>
              </div>
            )}

            {/* References */}
            {question.references && question.references.length > 0 && (
              <div className="flex items-center gap-2 text-sm">
                <LinkIcon className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">References:</span>
                {question.references.map((ref, idx) => (
                  <a
                    key={idx}
                    href={ref.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    {ref.title}
                  </a>
                ))}
              </div>
            )}
          </div>
        </CardHeader>

        <Collapsible open={isExpanded}>
          <CollapsibleContent>
            <CardContent className="space-y-4">
              {/* Question Input */}
              <div className="space-y-3">
                {children}
              </div>

              {/* Evidence Section */}
              {hasEvidence && (
                <div className="border-t pt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowEvidence(!showEvidence)}
                    className="mb-3"
                    aria-expanded={showEvidence}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Evidence & Documentation
                    {showEvidence ? <ChevronUp className="h-4 w-4 ml-2" /> : <ChevronDown className="h-4 w-4 ml-2" />}
                  </Button>

                  <AnimatePresence>
                    {showEvidence && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-3 overflow-hidden"
                      >
                        {/* Code Evidence */}
                        {question.evidence?.code?.map((item, idx) => (
                          <div key={idx} className="p-3 bg-muted rounded-lg space-y-2">
                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                              <div className="flex items-center gap-2">
                                <Code className="h-3 w-3" />
                                <span>Code Evidence</span>
                              </div>
                              <div className="flex items-center gap-2">
                                {item.author && (
                                  <>
                                    <User className="h-3 w-3" />
                                    <span>{item.author}</span>
                                  </>
                                )}
                                <Clock className="h-3 w-3" />
                                <span>{formatDistanceToNow(new Date(item.timestamp))} ago</span>
                              </div>
                            </div>
                            <pre className="text-xs overflow-x-auto">
                              <code>{item.content}</code>
                            </pre>
                          </div>
                        ))}

                        {/* Feedback */}
                        {question.evidence?.feedback?.map((item, idx) => (
                          <div key={idx} className="p-3 bg-muted rounded-lg space-y-2">
                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                              <div className="flex items-center gap-2">
                                <MessageSquare className="h-3 w-3" />
                                <span>Feedback</span>
                              </div>
                              <div className="flex items-center gap-2">
                                {item.author && (
                                  <>
                                    <User className="h-3 w-3" />
                                    <span>{item.author}</span>
                                  </>
                                )}
                                <Clock className="h-3 w-3" />
                                <span>{formatDistanceToNow(new Date(item.timestamp))} ago</span>
                              </div>
                            </div>
                            <p className="text-sm">{item.content}</p>
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {/* Metadata */}
              <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
                <span>Last updated: {question.lastUpdated ? formatDistanceToNow(new Date(question.lastUpdated)) + " ago" : "Never"}</span>
                {question.updatedBy && <span>by {question.updatedBy}</span>}
              </div>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>
    </motion.div>
  )
}