import { z } from "zod"
import type { Project, AssessmentStandard, Question, TimestampedCodeSnippet, TimestampedFeedback } from "./types"

// Validation schemas
export const AssessmentResponseSchema = z.object({
  value: z.any(),
  notes: z.string().optional(),
  notApplicable: z.boolean().optional(),
  ragStatus: z.enum(["red", "amber", "green", "grey"]).optional(),
  score: z.number().min(0).max(100).optional(),
  riskOwner: z.string().optional(),
  codeSnippets: z.array(z.object({
    id: z.string(),
    content: z.string(),
    timestamp: z.string(),
    author: z.string().optional(),
  })).optional(),
  developerFeedback: z.array(z.object({
    id: z.string(),
    content: z.string(),
    timestamp: z.string(),
    author: z.string().optional(),
  })).optional(),
  recommendations: z.array(z.object({
    id: z.string(),
    content: z.string(),
    timestamp: z.string(),
    author: z.string().optional(),
  })).optional(),
  documents: z.array(z.object({
    id: z.string(),
    name: z.string(),
    url: z.string().optional(),
    type: z.string(),
    uploadedAt: z.string(),
    description: z.string().optional(),
  })).optional(),
})

// Validate assessment data integrity
export function validateAssessmentData(data: any): boolean {
  try {
    // Basic structure validation
    if (!data || typeof data !== "object") return false
    
    // Validate each question's data
    for (const standard of data.standards || []) {
      for (const question of standard.questions || []) {
        if (question.answer !== undefined || question.evidenceNotes || question.ragStatus) {
          const responseData = {
            value: question.answer,
            notes: question.evidenceNotes,
            notApplicable: question.isNotApplicable,
            ragStatus: question.ragStatus,
            score: question.score,
            riskOwner: question.riskOwner,
          }
          AssessmentResponseSchema.parse(responseData)
        }
      }
    }
    
    return true
  } catch (error) {
    console.error("Validation error:", error)
    return false
  }
}

// Sanitize assessment data
export function sanitizeAssessmentData(project: Project): Project {
  return {
    ...project,
    standards: project.standards.map(standard => ({
      ...standard,
      questions: standard.questions.map(question => ({
        ...question,
        evidenceNotes: typeof question.evidenceNotes === 'string' ? question.evidenceNotes.trim() : "",
        riskOwner: typeof question.riskOwner === 'string' ? question.riskOwner.trim() : "",
        codeSnippetsList: question.codeSnippetsList?.filter((s: TimestampedCodeSnippet) => 
          s.code && typeof s.code === 'string' && s.code.trim()
        ) || [],
        developerFeedbackList: question.developerFeedbackList?.filter((f: TimestampedFeedback) => 
          f.feedback && typeof f.feedback === 'string' && f.feedback.trim()
        ) || [],
        developerRecommendationsList: question.developerRecommendationsList?.filter((r: TimestampedFeedback) => 
          r.feedback && typeof r.feedback === 'string' && r.feedback.trim()
        ) || [],
      }))
    }))
  }
}

// Check for data corruption
export function checkDataIntegrity(project: Project): {
  isValid: boolean
  errors: string[]
} {
  const errors: string[] = []
  
  // Check project structure
  if (!project.name) errors.push("Project name is missing")
  if (!project.standards || !Array.isArray(project.standards)) {
    errors.push("Standards array is missing or invalid")
  }
  
  // Check each standard
  project.standards?.forEach((standard, sIndex) => {
    if (!standard.slug) errors.push(`Standard at index ${sIndex} has no slug`)
    if (!standard.questions || !Array.isArray(standard.questions)) {
      errors.push(`Standard ${standard.slug} has invalid questions array`)
    }
    
    // Check each question
    standard.questions?.forEach((question, qIndex) => {
      if (!question.id) {
        errors.push(`Question at index ${qIndex} in ${standard.slug} has no ID`)
      }
      
      // Validate question data if present
      if (question.answer !== undefined || question.evidenceNotes || question.ragStatus) {
        try {
          // Create a response-like object for validation
          const responseData = {
            value: question.answer,
            notes: question.evidenceNotes,
            notApplicable: question.isNotApplicable,
            ragStatus: question.ragStatus,
            score: question.score,
            riskOwner: question.riskOwner,
          }
          AssessmentResponseSchema.parse(responseData)
        } catch (e) {
          errors.push(`Invalid data for question ${question.id}: ${e}`)
        }
      }
    })
  })
  
  return {
    isValid: errors.length === 0,
    errors
  }
} 